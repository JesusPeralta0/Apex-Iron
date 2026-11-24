// logica preliminar del agente ironcito
// aqui despues conecto las llamadas al webhook del flujo de n8n
// falta todavia el flujo para darle la capacidad a ironcito de armar una pc con componentes disponibles

// cargo los estilos aislados del agente desde su propio directorio
if (!document.getElementById('ironcito-fab-css')) {
    const link = document.createElement('link');
    link.id = 'ironcito-fab-css';
    link.rel = 'stylesheet';
    link.href = '/agente-ironcito/css/ironcito-agente.css';
    document.head.appendChild(link);
}

// inyecto el boton flotante y el globo de respuesta en el documento
document.body.insertAdjacentHTML('beforeend', `<button id="ironcito-chat-btn" class="ironcito-fab" aria-label="Abrir asistente Ironcito">
    <img src="/agente-ironcito/res/ironcito-sleeping.webp" alt="Ironcito dormido" class="ironcito-fab-img">
    </button>
    <div id="ironcito-bubble" class="ironcito-fab-bubble" role="status" aria-live="polite">
        <p>Estoy descansando, me han entrenado mucho y estoy exhausto. Vuelve después.</p>
    </div>`);

// manejo la apertura y cierre automatico del globo de ironcito
const btn = document.getElementById('ironcito-chat-btn');
const bubble = document.getElementById('ironcito-bubble');
let timer;

btn.addEventListener('click', () => {
    const abierto = bubble.classList.toggle('visible');
    btn.classList.toggle('activo', abierto);
    clearTimeout(timer);
    if (abierto) {
        timer = setTimeout(() => {
            bubble.classList.remove('visible');
            btn.classList.remove('activo');
        }, 5000);
    }
});
