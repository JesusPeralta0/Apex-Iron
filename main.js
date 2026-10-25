/**
 * Observar que pasa con algunos elementos y darles una clase en funcion
 * de los acontencimientos
 */
const REVELAR_MITAD = new IntersectionObserver((elementos) => {
    elementos.forEach(elemento => {
        if(elemento.isIntersecting) {
            elemento.target.classList.add('visible');
            REVELAR_MITAD.unobserve(elemento.target);
            desconectar();
        }
    });
}, {
  root: null,
  // Linea roja, izq, Linea azul, der
  rootMargin: "100% 0px -30% 0px",
  threshold: 0
});

/**
 * Comienza a obsrrvar si hay que revelar o no
 */
document.querySelectorAll('.fade-in').forEach(elemento => {
    REVELAR_MITAD.observe(elemento);
});

/** 
 * Si no llega a haber scroll suficiente, muestra todo 
 */
function revelarTodo() {
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - 5;
    if(scrollTop + viewportHeight >= documentHeight) {
        document.querySelectorAll('.fade-in').forEach(elemento => {
            elemento.classList.add('visible');
            REVELAR_MITAD.unobserve(elemento);
        });
        desconectar();
    }
}
window.addEventListener('scroll', revelarTodo);
window.addEventListener('load', revelarTodo);

function desconectar() {
    const pendientes = document.querySelector('.fade-in:not(.visible)');
    if(!pendientes) {
        window.removeEventListener('scroll', revelarTodo);
        REVELAR_MITAD.disconnect();
    }
}


const link = document.querySelector('.cardd');
link.addEventListener('click', () => {
    link.classList.add('active');
})
window.addEventListener('click', () => {
    link.classList.remove('active');
})