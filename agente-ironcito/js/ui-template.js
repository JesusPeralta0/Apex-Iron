// constructores de interfaz dom para el widget de ironcito

import { escapeHtml, parseIroncitoMarkdown } from './markdown-parser.js';

export const QUICK_SUGGESTIONS = [
  'Mi computadora está lenta',
  'Quiero más espacio para fotos',
  'Mejorar memoria para programas',
  'Busco accesorios para mi compu',
  'Quiero una PC armada',
  'Quiero aprender sobre computadoras',
];

const ICON_RESET = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
  </svg>
`;

const ICON_CLOSE = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
`;

const ICON_SEND = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22 11 13 2 9 22 2Z" />
  </svg>
`;

// formatea la hora local actual para cada mensaje
function formatCurrentTime() {
  return new Date().toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// crea la estructura principal del boton flotante y la ventana modal
export function createWidgetRoot({ sleepingAvatarUrl, flyingAvatarUrl }) {
  const root = document.createElement('div');
  root.id = 'ironcito-widget-root';
  root.className = 'ironcito-root';

  root.innerHTML = `
    <button
      type="button"
      id="ironcito-chat-btn"
      class="ironcito-fab"
      aria-label="Abrir asistente Ironcito"
      aria-haspopup="dialog"
      aria-expanded="false"
      aria-controls="ironcito-modal"
    >
      <img
        src="${escapeHtml(sleepingAvatarUrl)}"
        alt="Ironcito dormido"
        class="ironcito-fab-img"
      />
    </button>

    <div
      id="ironcito-overlay"
      class="ironcito-overlay"
      role="presentation"
      aria-hidden="true"
    >
      <div class="ironcito-stage">
        <img
          id="ironcito-flyer"
          src="${escapeHtml(flyingAvatarUrl)}"
          alt="Ironcito volando"
          class="ironcito-flyer"
          aria-hidden="true"
        />

        <section
          id="ironcito-modal"
          class="ironcito-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ironcito-modal-title"
        >
          <header class="ironcito-header">
            <div class="ironcito-header-brand">
              <h2 id="ironcito-modal-title" class="ironcito-header-title">Ironcito</h2>
              <span
                id="ironcito-status-dot"
                class="ironcito-status-indicator"
                data-status="checking"
                role="status"
                aria-label="Verificando conexión"
                title="Verificando conexión..."
              ></span>
            </div>

            <div class="ironcito-header-actions">
              <button
                type="button"
                id="ironcito-reset-btn"
                class="ironcito-icon-btn"
                title="Reiniciar conversación"
                aria-label="Reiniciar conversación"
              >
                ${ICON_RESET}
              </button>
              <button
                type="button"
                id="ironcito-close-btn"
                class="ironcito-icon-btn"
                title="Cerrar chat"
                aria-label="Cerrar ventana de chat"
              >
                ${ICON_CLOSE}
              </button>
            </div>
          </header>

          <div
            id="ironcito-messages"
            class="ironcito-messages"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          ></div>

          <footer class="ironcito-footer">
            <form id="ironcito-form" class="ironcito-composer" novalidate>
              <textarea
                id="ironcito-input"
                class="ironcito-input"
                rows="1"
                placeholder="Cuéntame qué necesitas"
                aria-label="Escribe tu mensaje para Ironcito"
              ></textarea>
              <button
                type="submit"
                id="ironcito-send-btn"
                class="ironcito-send-btn"
                aria-label="Enviar mensaje"
                title="Enviar mensaje"
              >
                ${ICON_SEND}
              </button>
            </form>
            <div class="ironcito-footer-hint">
              <span>Enter para enviar · Shift + Enter para salto de línea</span>
              <span>Apex Iron</span>
            </div>
          </footer>
        </section>
      </div>
    </div>
  `;

  return root;
}

// crea la burbuja de un mensaje del usuario
export function createUserMessageElement(text) {
  const row = document.createElement('div');
  row.className = 'ironcito-msg-row ironcito-msg-row--user';

  const safeText = escapeHtml(text).replace(/\n/g, '<br>');

  row.innerHTML = `
    <div class="ironcito-msg-body">
      <div class="ironcito-bubble ironcito-bubble--user">${safeText}</div>
      <span class="ironcito-msg-meta">${formatCurrentTime()}</span>
    </div>
  `;

  return row;
}

// crea la burbuja de respuesta del asistente con markdown y veredictos
export function createBotMessageElement(markdown) {
  const row = document.createElement('div');
  row.className = 'ironcito-msg-row ironcito-msg-row--bot';

  row.innerHTML = `
    <div class="ironcito-msg-body">
      <div class="ironcito-bubble ironcito-bubble--bot">
        <div class="ironcito-md">${parseIroncitoMarkdown(markdown)}</div>
      </div>
      <span class="ironcito-msg-meta">Ironcito · ${formatCurrentTime()}</span>
    </div>
  `;

  return row;
}

// crea una burbuja de error con boton para reintentar el envio
export function createErrorMessageElement(message, onRetry, badgeText = 'Conexión interrumpida') {
  const row = document.createElement('div');
  row.className = 'ironcito-msg-row ironcito-msg-row--bot';

  row.innerHTML = `
    <div class="ironcito-msg-body">
      <div class="ironcito-bubble ironcito-bubble--bot">
        <div class="ironcito-error-box">
          <div class="ironcito-verdict ironcito-verdict--incompatible" style="margin: 0;">
            <span class="ironcito-verdict-badge">${escapeHtml(badgeText)}</span>
            <div class="ironcito-verdict-header">
              <span>${escapeHtml(message)}</span>
            </div>
          </div>
          <button type="button" class="ironcito-retry-btn">Reintentar envío</button>
        </div>
      </div>
      <span class="ironcito-msg-meta">Ironcito · ${formatCurrentTime()}</span>
    </div>
  `;

  const retryBtn = row.querySelector('.ironcito-retry-btn');
  if (retryBtn && typeof onRetry === 'function') {
    retryBtn.addEventListener('click', () => {
      row.remove();
      onRetry();
    });
  }

  return row;
}

// crea la fila de botones rapidos iniciales
export function createQuickSuggestionsElement(onSelect) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ironcito-suggestions';
  wrapper.id = 'ironcito-suggestions';

  const label = document.createElement('p');
  label.className = 'ironcito-suggestions-label';
  label.textContent = 'O elige una opción rápida para empezar:';

  const pillsContainer = document.createElement('div');
  pillsContainer.className = 'ironcito-pills';

  for (const text of QUICK_SUGGESTIONS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ironcito-pill';
    btn.textContent = text;
    btn.addEventListener('click', () => onSelect(text));
    pillsContainer.appendChild(btn);
  }

  wrapper.appendChild(label);
  wrapper.appendChild(pillsContainer);
  return wrapper;
}

// crea el indicador animado de escritura del asistente
export function createTypingIndicatorElement(label = 'Ironcito está revisando el catálogo...') {
  const row = document.createElement('div');
  row.className = 'ironcito-msg-row ironcito-msg-row--bot';
  row.id = 'ironcito-typing-indicator';
  row.setAttribute('aria-label', label);

  row.innerHTML = `
    <div class="ironcito-msg-body">
      <div class="ironcito-typing-bubble">
        <span>${escapeHtml(label)}</span>
        <span class="ironcito-typing-dots" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
    </div>
  `;

  return row;
}
