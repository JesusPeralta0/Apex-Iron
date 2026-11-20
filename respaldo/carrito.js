// CARRITO APEX-IRON - Funcional sí o sí
let cart = JSON.parse(localStorage.getItem('apex_cart') || '[]');

function saveCart() {
  localStorage.setItem('apex_cart', JSON.stringify(cart));
  renderCart();
}

function addToCart(producto) {
  // producto = {id, nombre, precio, img}
  const existe = cart.find(p => p.id === producto.id);
  if (existe) {
    existe.qty += 1;
  } else {
    cart.push({...producto, qty: 1});
  }
  saveCart();
  // Abre el carrito automáticamente
  const bsOffcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasCarrito'));
  bsOffcanvas.show();
}

function removeFromCart(id) {
  cart = cart.filter(p => p.id !== id);
  saveCart();
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');
  const emptyEl = document.getElementById('cart-empty');
  
  if (cart.length === 0) {
    container.innerHTML = '<p class="text-center text-secondary mt-5" id="cart-empty">Tu carrito está vacío</p>';
    totalEl.textContent = '$0.00';
    countEl.style.display = 'none';
    return;
  }

  let total = 0;
  let count = 0;
  let html = '';

  cart.forEach(item => {
    total += item.precio * item.qty;
    count += item.qty;
    html += `
      <div class="d-flex gap-3 mb-3 pb-3 border-bottom" style="border-color:#333 !important;">
        <img src="${item.img}" style="width:60px; height:60px; object-fit:contain; background:white; border-radius:8px; padding:4px;">
        <div class="flex-grow-1">
          <h6 class="mb-1" style="font-size:14px;">${item.nombre}</h6>
          <small class="text-secondary">Cant: ${item.qty} x $${item.precio}</small>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${item.id}')"><i class="bi bi-trash"></i></button>
      </div>
    `;
  });

  container.innerHTML = html;
  totalEl.textContent = `$${total.toFixed(2)}`;
  countEl.textContent = count;
  countEl.style.display = 'block';
}

document.getElementById('btn-vaciar')?.addEventListener('click', () => {
  cart = [];
  saveCart();
});

document.getElementById('btn-pagar')?.addEventListener('click', () => {
  if (cart.length === 0) return Swal.fire('Carrito vacío', 'Agrega productos primero', 'info');
  Swal.fire('¡Listo!', 'Redirigiendo a pago...', 'success');
});

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', renderCart);

// Hacer global para que lo puedas usar en el catálogo
window.addToCart = addToCart;