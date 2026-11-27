// modulo pluggable del chat de ironcito conectado al webhook de n8n

import {
  createBotMessageElement,
  createErrorMessageElement,
  createQuickSuggestionsElement,
  createTypingIndicatorElement,
  createUserMessageElement,
  createWidgetRoot,
} from './ui-template.js';
import {
  getFriendlyErrorMessage,
  getSessionId,
  pingWebhookHealth,
  resetSessionId,
  sendMessageToN8n,
} from './webhook-client.js';

// configuracion principal del webhook y rutas relativas del modulo
const CONFIG = {
  webhookUrl: 'https://n8n.carlosestrchz.me/webhook/api/v1/compatibilidad',
  // opcional para agregar despues un endpoint get de salud en n8n
  healthUrl: null,
  // mensaje silencioso inicial para recibir el saludo real desde n8n
  initialGreetingPrompt: 'Hola',
  sleepingAvatarUrl: new URL('../res/ironcito-sleeping.webp', import.meta.url).href,
  flyingAvatarUrl: new URL('../res/ironcito-flying-steady.webp', import.meta.url).href,
  stylesUrl: new URL('../css/ironcito-agente.css', import.meta.url).href,
  requestTimeoutMs: 120000,
  pingTimeoutMs: 5000,
  pingIntervalMs: 30000,
};

const FONT_STYLESHEET_ID = 'ironcito-google-font';
const WIDGET_STYLESHEET_ID = 'ironcito-agente-css';

let widgetInstance = null;

// inyecta los estilos encapsulados y las fuentes si aun no existen
function injectStyles() {
  if (!document.getElementById(FONT_STYLESHEET_ID)) {
    const fontLink = document.createElement('link');
    fontLink.id = FONT_STYLESHEET_ID;
    fontLink.rel = 'stylesheet';
    fontLink.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap';
    document.head.appendChild(fontLink);
  }

  if (!document.getElementById(WIDGET_STYLESHEET_ID)) {
    const cssLink = document.createElement('link');
    cssLink.id = WIDGET_STYLESHEET_ID;
    cssLink.rel = 'stylesheet';
    cssLink.href = CONFIG.stylesUrl;
    document.head.appendChild(cssLink);
  }
}

// inicializa y monta el widget de ironcito una sola vez en el documento
export function initIroncito() {
  if (widgetInstance || document.getElementById('ironcito-widget-root')) {
    return widgetInstance;
  }

  injectStyles();

  const root = createWidgetRoot({
    sleepingAvatarUrl: CONFIG.sleepingAvatarUrl,
    flyingAvatarUrl: CONFIG.flyingAvatarUrl,
  });
  document.body.appendChild(root);

  // referencias del dom encapsulado
  const fabBtn = root.querySelector('#ironcito-chat-btn');
  const overlay = root.querySelector('#ironcito-overlay');
  const modalEl = root.querySelector('#ironcito-modal');
  const flyerEl = root.querySelector('#ironcito-flyer');
  const statusDotEl = root.querySelector('#ironcito-status-dot');
  const closeBtn = root.querySelector('#ironcito-close-btn');
  const resetBtn = root.querySelector('#ironcito-reset-btn');
  const messagesEl = root.querySelector('#ironcito-messages');
  const formEl = root.querySelector('#ironcito-form');
  const inputEl = root.querySelector('#ironcito-input');
  const sendBtn = root.querySelector('#ironcito-send-btn');

  // estado interno del chat
  let sessionId = getSessionId();
  let isOpen = false;
  let isLoading = false;
  let hasGreeted = false;
  let previousBodyOverflow = '';
  let activeRequestController = null;
  let typingNode = null;
  let suggestionsNode = null;
  let pingTimerId = null;
  let closeCleanupTimerId = null;

  // actualiza el punto visual de estado de conexion
  function setConnectionStatus(status) {
    if (!statusDotEl) return;
    statusDotEl.dataset.status = status;
    const labels = {
      online: 'Conectado',
      offline: 'Sin conexión',
      checking: 'Verificando conexión...',
    };
    const label = labels[status] || labels.offline;
    statusDotEl.setAttribute('aria-label', label);
    statusDotEl.setAttribute('title', label);
  }

  // ejecuta el ping al webhook de n8n y actualiza el punto de estado
  async function checkWebhookStatus({ showChecking = false } = {}) {
    if (showChecking) {
      setConnectionStatus('checking');
    }
    const isAlive = await pingWebhookHealth({
      webhookUrl: CONFIG.webhookUrl,
      healthUrl: CONFIG.healthUrl,
      timeoutMs: CONFIG.pingTimeoutMs,
    });
    setConnectionStatus(isAlive ? 'online' : 'offline');
    return isAlive;
  }

  function startHealthPolling() {
    stopHealthPolling();
    pingTimerId = setInterval(() => {
      if (isOpen && !isLoading) {
        checkWebhookStatus();
      }
    }, CONFIG.pingIntervalMs);
  }

  function stopHealthPolling() {
    if (pingTimerId) {
      clearInterval(pingTimerId);
      pingTimerId = null;
    }
  }

  // desplaza el historial hasta el ultimo mensaje
  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });
  }

  // ajusta la altura del textarea entre una y tres lineas
  function autoResizeInput() {
    inputEl.style.height = 'auto';
    const maxHeight = 76;
    inputEl.style.height = `${Math.min(inputEl.scrollHeight, maxHeight)}px`;
  }

  // sincroniza el estado habilitado del campo de texto y el boton enviar
  function syncComposerState() {
    const hasText = inputEl.value.trim().length > 0;
    inputEl.disabled = isLoading;
    sendBtn.disabled = isLoading || !hasText;
    formEl.classList.toggle('ironcito-composer--disabled', isLoading);
  }

  // oculta con transicion suave las pildoras iniciales
  function dismissSuggestions() {
    if (!suggestionsNode) return;
    const nodeToRemove = suggestionsNode;
    suggestionsNode = null;
    nodeToRemove.classList.add('ironcito-suggestions--hiding');
    setTimeout(() => nodeToRemove.remove(), 180);
  }

  // muestra el indicador animado mientras responde n8n
  function showTypingIndicator(label) {
    removeTypingIndicator();
    typingNode = createTypingIndicatorElement(label);
    messagesEl.appendChild(typingNode);
    scrollToBottom();
  }

  // retira el indicador animado de escritura
  function removeTypingIndicator() {
    if (typingNode) {
      typingNode.remove();
      typingNode = null;
    }
  }

  // agrega las pildoras rapidas debajo del saludo de ironcito
  function appendQuickSuggestions() {
    if (suggestionsNode) {
      suggestionsNode.remove();
    }
    suggestionsNode = createQuickSuggestionsElement((suggestionText) => {
      if (isLoading) return;
      handleSendMessage(suggestionText);
    });
    messagesEl.appendChild(suggestionsNode);
    scrollToBottom();
  }

  // solicita el saludo inicial a n8n y luego muestra las opciones rapidas
  async function requestInitialGreeting() {
    if (hasGreeted || isLoading) return;

    isLoading = true;
    syncComposerState();
    showTypingIndicator('Ironcito se está conectando...');

    activeRequestController = new AbortController();
    const requestSignal = activeRequestController.signal;

    try {
      const greeting = await sendMessageToN8n({
        webhookUrl: CONFIG.webhookUrl,
        sessionId,
        message: CONFIG.initialGreetingPrompt,
        timeoutMs: CONFIG.requestTimeoutMs,
        externalSignal: requestSignal,
      });

      if (requestSignal.aborted) return;

      hasGreeted = true;
      setConnectionStatus('online');
      removeTypingIndicator();

      const welcomeMsg = createBotMessageElement(greeting);
      messagesEl.appendChild(welcomeMsg);
      appendQuickSuggestions();
    } catch (error) {
      if (error?.code === 'ABORTED') return;

      if (error?.code === 'NETWORK_ERROR' || error?.code === 'TIMEOUT' || error?.code === 'HTTP_ERROR') {
        setConnectionStatus('offline');
      }

      console.error('[Ironcito] Error al obtener el saludo inicial de n8n:', {
        code: error?.code,
        status: error?.status,
        message: error?.message,
        webhookUrl: CONFIG.webhookUrl,
      });

      removeTypingIndicator();
      const friendlyText = getFriendlyErrorMessage(error);
      const badgeText =
        error?.code === 'HTTP_ERROR'
          ? 'Error interno del asistente'
          : error?.code === 'TIMEOUT'
            ? 'Tiempo de espera agotado'
            : 'Conexión interrumpida';

      const errorBubble = createErrorMessageElement(
        friendlyText,
        () => {
          if (!isLoading) {
            requestInitialGreeting();
          }
        },
        badgeText
      );
      messagesEl.appendChild(errorBubble);
      scrollToBottom();
    } finally {
      if (activeRequestController?.signal === requestSignal) {
        activeRequestController = null;
      }
      isLoading = false;
      syncComposerState();
    }
  }

  // abre la ventana modal y lanza la animacion de vuelo de ironcito
  function open({ skipInitialGreeting = false } = {}) {
    if (isOpen) return;
    isOpen = true;
    if (closeCleanupTimerId) {
      clearTimeout(closeCleanupTimerId);
      closeCleanupTimerId = null;
    }

    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    overlay.classList.add('ironcito-open');
    overlay.setAttribute('aria-hidden', 'false');
    fabBtn.classList.remove('ironcito-fab--reappear');
    fabBtn.classList.add('activo', 'ironcito-fab--hidden');
    fabBtn.setAttribute('aria-expanded', 'true');

    // lanza el ascenso suave de ironcito hasta su posicion fija
    flyerEl.classList.remove('ironcito-flyer--active');
    void flyerEl.offsetWidth;
    flyerEl.classList.add('ironcito-flyer--active');

    fabBtn.blur();
    scrollToBottom();
    checkWebhookStatus({ showChecking: statusDotEl?.dataset.status !== 'online' });
    startHealthPolling();

    // pide el saludo inicial a n8n la primera vez que se abre el chat
    if (!skipInitialGreeting && !hasGreeted && !isLoading) {
      requestInitialGreeting();
    }
  }

  // abre la ventana y envia automaticamente una accion rapida o mensaje
  function openWithPrompt(promptText) {
    const cleanPrompt = typeof promptText === 'string' ? promptText.trim() : '';
    if (!cleanPrompt) {
      open();
      return;
    }

    open({ skipInitialGreeting: true });
    hasGreeted = true;

    if (!isLoading) {
      handleSendMessage(cleanPrompt);
    }
  }

  // cierra la ventana con desvanecido suave y reaparece el boton flotante
  function close() {
    if (!isOpen) return;
    isOpen = false;
    stopHealthPolling();
    document.body.style.overflow = previousBodyOverflow;

    overlay.classList.remove('ironcito-open');
    overlay.setAttribute('aria-hidden', 'true');
    fabBtn.classList.remove('activo', 'ironcito-fab--hidden');
    fabBtn.setAttribute('aria-expanded', 'false');

    // mantiene a ironcito visible durante el desvanecido antes de reiniciar el vuelo
    if (closeCleanupTimerId) {
      clearTimeout(closeCleanupTimerId);
    }
    closeCleanupTimerId = setTimeout(() => {
      if (!isOpen) {
        flyerEl.classList.remove('ironcito-flyer--active');
      }
      closeCleanupTimerId = null;
    }, 620);

    // inicia el aparecimiento suave del boton flotante dormido
    fabBtn.classList.remove('ironcito-fab--reappear');
    void fabBtn.offsetWidth;
    fabBtn.classList.add('ironcito-fab--reappear');
    fabBtn.addEventListener(
      'animationend',
      () => fabBtn.classList.remove('ironcito-fab--reappear'),
      { once: true }
    );
  }

  // envia el mensaje al webhook de n8n y muestra la respuesta
  async function dispatchToAgent(text) {
    isLoading = true;
    syncComposerState();
    showTypingIndicator();

    activeRequestController = new AbortController();
    const requestSignal = activeRequestController.signal;

    try {
      const reply = await sendMessageToN8n({
        webhookUrl: CONFIG.webhookUrl,
        sessionId,
        message: text,
        timeoutMs: CONFIG.requestTimeoutMs,
        externalSignal: requestSignal,
      });

      if (requestSignal.aborted) return;

      setConnectionStatus('online');
      removeTypingIndicator();
      const botBubble = createBotMessageElement(reply);
      messagesEl.appendChild(botBubble);
      scrollToBottom();
    } catch (error) {
      if (error?.code === 'ABORTED') return;

      if (error?.code === 'NETWORK_ERROR' || error?.code === 'TIMEOUT' || error?.code === 'HTTP_ERROR') {
        setConnectionStatus('offline');
      }

      console.error('[Ironcito] Error al consultar el webhook de n8n:', {
        code: error?.code,
        status: error?.status,
        message: error?.message,
        webhookUrl: CONFIG.webhookUrl,
      });

      removeTypingIndicator();
      const friendlyText = getFriendlyErrorMessage(error);
      const badgeText =
        error?.code === 'HTTP_ERROR'
          ? 'Error interno del asistente'
          : error?.code === 'TIMEOUT'
            ? 'Tiempo de espera agotado'
            : 'Conexión interrumpida';

      const errorBubble = createErrorMessageElement(
        friendlyText,
        () => {
          if (!isLoading) {
            dispatchToAgent(text);
          }
        },
        badgeText
      );
      messagesEl.appendChild(errorBubble);
      scrollToBottom();
    } finally {
      if (activeRequestController?.signal === requestSignal) {
        activeRequestController = null;
      }
      isLoading = false;
      syncComposerState();
      if (isOpen) {
        inputEl.focus();
      }
    }
  }

  // procesa el envio de un mensaje del usuario
  function handleSendMessage(rawText) {
    const cleanText = rawText.trim();
    if (!cleanText || isLoading) return;

    dismissSuggestions();

    const userBubble = createUserMessageElement(cleanText);
    messagesEl.appendChild(userBubble);
    scrollToBottom();

    inputEl.value = '';
    autoResizeInput();
    syncComposerState();

    dispatchToAgent(cleanText);
  }

  // reinicia la conversacion, genera una nueva sesion y solicita un saludo limpio
  function resetConversation() {
    if (activeRequestController) {
      activeRequestController.abort();
      activeRequestController = null;
    }

    isLoading = false;
    hasGreeted = false;
    sessionId = resetSessionId();

    resetBtn.classList.remove('ironcito-icon-btn--spin');
    void resetBtn.offsetWidth;
    resetBtn.classList.add('ironcito-icon-btn--spin');

    messagesEl.innerHTML = '';
    typingNode = null;
    suggestionsNode = null;

    inputEl.value = '';
    autoResizeInput();
    syncComposerState();

    if (isOpen) {
      requestInitialGreeting();
    }
  }

  // eventos de interaccion del usuario
  fabBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  resetBtn.addEventListener('click', resetConversation);

  // cierra al hacer clic fuera de la ventana modal
  overlay.addEventListener('click', (event) => {
    if (!modalEl.contains(event.target)) {
      close();
    }
  });

  // cierra al presionar la tecla escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      close();
    }
  });

  // autoajusta el textarea y actualiza el boton de enviar
  inputEl.addEventListener('input', () => {
    autoResizeInput();
    syncComposerState();
  });

  // envia con enter y permite salto de linea con shift y enter
  inputEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      handleSendMessage(inputEl.value);
    }
  });

  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSendMessage(inputEl.value);
  });

  // reacciona a cambios de conectividad del navegador
  window.addEventListener('offline', () => setConnectionStatus('offline'));
  window.addEventListener('online', () => {
    if (isOpen) {
      checkWebhookStatus({ showChecking: true });
    }
  });

  // escucha el evento desacoplado para abrir ironcito desde otros componentes
  document.addEventListener('ironcito:open', (event) => {
    event.preventDefault();
    const prompt = event?.detail?.prompt;
    if (prompt) {
      openWithPrompt(prompt);
    } else {
      open();
    }
  });

  // sincroniza el estado inicial del campo de texto
  syncComposerState();

  widgetInstance = {
    open,
    openWithPrompt,
    close,
    reset: resetConversation,
    getSessionId: () => sessionId,
  };

  return widgetInstance;
}

export { CONFIG };

// inicializacion automatica al importar el modulo en cualquier pagina
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initIroncito(), { once: true });
} else {
  initIroncito();
}
