//logica preeliminar de nuevo
//aqui tendré que hacer llamadas al webhook expuesto en el flujo de n8n
//falta todavia el flujo para darle la capacidad a ironcito de pedirle que te arme tu pc con componentes que tengamos a la venta

//carga el css
if (!document.getElementById('ironcito-fab-css')) {
    const link = document.createElement('link');
    link.id = 'ironcito-fab-css';
    link.rel = 'stylesheet';
    link.href = '/css/aironcito.css';
    document.head.appendChild(link);
}

//crea el botón y el globo
document.body.insertAdjacentHTML('beforeend', `<button id="ironcito-chat-btn" class="ironcito-fab" aria-label="Abrir asistente Ironcito">
    <img src="/res/miscelaneo/ironcito-sleeping.webp" alt="Ironcito dormido" class="ironcito-fab-img">
    </button>
    <div id="ironcito-bubble" class="ironcito-fab-bubble" role="status" aria-live="polite">
        <p>Estoy descansando, me han entrenado mucho y estoy exhausto. Vuelve después.</p>
    </div>`);


    //lolgica
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
