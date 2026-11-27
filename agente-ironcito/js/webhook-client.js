// cliente http para conectar ironcito con el webhook de n8n

const SESSION_STORAGE_KEY = 'apex_iron_ironcito_session_id';

// genera un identificador unico de sesion
function generateSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `ironcito-${crypto.randomUUID()}`;
  }
  const randomPart = Math.random().toString(36).slice(2, 11);
  return `ironcito-${Date.now().toString(36)}-${randomPart}`;
}

// obtiene el id de sesion actual o crea uno nuevo
export function getSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!id) {
      id = generateSessionId();
      sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    }
    return id;
  } catch {
    return generateSessionId();
  }
}

// genera un nuevo id de sesion para reiniciar la conversacion
export function resetSessionId() {
  const freshId = generateSessionId();
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, freshId);
  } catch {
    // continua en memoria si sessionstorage no esta disponible
  }
  return freshId;
}

// extrae el texto de respuesta del json o texto plano devuelto por n8n
function extractAgentText(payload) {
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    return trimmed || null;
  }

  if (Array.isArray(payload) && payload.length > 0) {
    return extractAgentText(payload[0]);
  }

  if (payload && typeof payload === 'object') {
    const candidateKeys = [
      'output',
      'response',
      'reply',
      'message',
      'text',
      'answer',
      'content',
      'respuesta',
    ];

    for (const key of candidateKeys) {
      if (typeof payload[key] === 'string' && payload[key].trim()) {
        return payload[key].trim();
      }
    }

    if (payload.data) {
      const nested = extractAgentText(payload.data);
      if (nested) return nested;
    }
  }

  return null;
}

// envia el mensaje del usuario al webhook de n8n y devuelve la respuesta
export async function sendMessageToN8n({
  webhookUrl,
  sessionId,
  message,
  timeoutMs = 45000,
  externalSignal,
}) {
  const controller = new AbortController();
  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timeoutId);
      const err = new Error('Solicitud cancelada');
      err.code = 'ABORTED';
      throw err;
    }
    externalSignal.addEventListener('abort', onExternalAbort, { once: true });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain;q=0.9',
      },
      body: JSON.stringify({
        sessionId,
        chatInput: message,
        mensaje: message,
        message,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      let detail = '';
      try {
        detail = (await response.text()).slice(0, 300);
      } catch {
        // ignora errores al leer el cuerpo de error
      }
      const err = new Error(`Error del servidor (${response.status})${detail ? `: ${detail}` : ''}`);
      err.code = 'HTTP_ERROR';
      err.status = response.status;
      err.detail = detail;
      throw err;
    }

    const contentType = response.headers.get('content-type') || '';
    let parsedData;

    if (contentType.includes('application/json')) {
      parsedData = await response.json();
    } else {
      const rawText = await response.text();
      try {
        parsedData = JSON.parse(rawText);
      } catch {
        parsedData = rawText;
      }
    }

    const agentText = extractAgentText(parsedData);
    if (!agentText) {
      const err = new Error('Respuesta vacía del agente');
      err.code = 'EMPTY_RESPONSE';
      throw err;
    }

    return agentText;
  } catch (error) {
    if (error.name === 'AbortError') {
      if (timedOut) {
        const err = new Error('Tiempo de espera agotado');
        err.code = 'TIMEOUT';
        throw err;
      }
      const err = new Error('Solicitud cancelada');
      err.code = 'ABORTED';
      throw err;
    }

    if (!error.code) {
      error.code = 'NETWORK_ERROR';
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
    if (externalSignal) {
      externalSignal.removeEventListener('abort', onExternalAbort);
    }
  }
}

// realiza un ping ligero al webhook para verificar si n8n esta en linea
export async function pingWebhookHealth({ webhookUrl, healthUrl = null, timeoutMs = 5000 }) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return false;
  }

  const targetUrl = healthUrl || webhookUrl;

  const probe = async (mode, method) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(targetUrl, {
        method,
        mode,
        cache: 'no-store',
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  };

  // valida estado http 2xx si existe un endpoint de salud dedicado
  if (healthUrl) {
    try {
      const res = await probe('cors', 'GET');
      return res.ok;
    } catch {
      return false;
    }
  }

  // usa head para comprobar disponibilidad sin disparar el flujo post de ia
  try {
    const res = await probe('cors', 'HEAD');
    return res.status < 500;
  } catch (error) {
    if (error?.name === 'AbortError') {
      return false;
    }
  }

  // respaldo en modo no cors cuando el servidor responde sin cabeceras en head
  try {
    await probe('no-cors', 'HEAD');
    return true;
  } catch {
    return false;
  }
}

// traduce errores tecnicos a mensajes sencillos para el usuario
export function getFriendlyErrorMessage(error) {
  switch (error?.code) {
    case 'TIMEOUT':
      return 'Me tardé un poco más de lo normal revisando el catálogo. ¿Intentamos enviar tu pregunta de nuevo?';
    case 'HTTP_ERROR':
      return 'En este momento no pude comunicarme correctamente con el catálogo de Apex Iron. Intenta de nuevo en unos segundos.';
    case 'EMPTY_RESPONSE':
      return 'Recibí una respuesta incompleta del sistema. Por favor, vuelve a enviarme tu consulta.';
    default:
      return 'Parece que hubo un problema de conexión. Revisa tu internet e inténtalo de nuevo.';
  }
}
