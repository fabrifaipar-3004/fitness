<!doctype js>
// Datos de ejemplo de productos
const PRODUCTS = [
  { id: 'camiseta-pro', name: 'Camiseta Pro', price: 24.99, img: 'https://down-co.img.susercontent.com/file/c9f68805ac438dbf9e42aec1367f483e' },
  { id: 'leggings-flex', name: 'Leggings Flex', price: 39.99, img: 'https://ortoprime.es/cdn/shop/products/mancuernas-juego-para-casa-ortoprime_573x432.jpg?v=1664624230' },
  { id: 'mancuernas', name: 'Mancuernas ajustables', price: 69.99, img: 'https://m.media-amazon.com/images/I/619Sq-ZRb9L._AC_SX569_.jpg' }
];

// Utilidades de carrito usando localStorage
const CART_KEY = 'ff_cart_v1';
function loadCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }catch(e){return {}} }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function cartCount(){ const cart = loadCart(); return Object.values(cart).reduce((s,i)=>s+i.qty,0); }

function formatPrice(n){ return (n).toFixed(2); }

// UI inicial
document.addEventListener('DOMContentLoaded',()=>{
  // colocar año
  document.querySelectorAll('#year,#year-2,#year-3').forEach(el=>el.textContent = new Date().getFullYear());
  // actualizar contador
  updateCartCount();

  // si estamos en la página de productos, renderizar
  const productsList = document.getElementById('products-list');
  if(productsList){
    PRODUCTS.forEach(p=>{
      const card = document.createElement('article'); card.className='product-card';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p class="price">€${formatPrice(p.price)}</p>
        <p><button class="btn add-to-cart" data-id="${p.id}">Añadir</button></p>
      `;
      productsList.appendChild(card);
    });
  }

  // handlers: añadir al carrito
  document.body.addEventListener('click',e=>{
    if(e.target.matches('.add-to-cart')){
      const id = e.target.dataset.id; addToCart(id,1); updateCartCount();
    }
  });

  // abrir/cerrar carrito
  const cartBtn = document.getElementById('cart-btn');
  const cartEl = document.getElementById('cart');
  const closeCart = document.getElementById('close-cart');
  if(cartBtn){ cartBtn.addEventListener('click', ()=>{ toggleCart(); renderCart(); }); }
  if(closeCart){ closeCart.addEventListener('click', ()=>{ hideCart(); }); }

  // checkout demo
  const checkout = document.getElementById('checkout');
  if(checkout){ checkout.addEventListener('click', ()=>{ alert('Simulación: proceder a pago (integra tu pasarela).'); }); }

  // contacto
  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', e=>{
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      if(!name||!email||!message){ document.getElementById('contact-feedback').textContent = 'Rellena todos los campos.'; return; }
      document.getElementById('contact-feedback').textContent = 'Gracias — tu mensaje ha sido enviado (simulado).';
      contactForm.reset();
    });
  }

  // si hay un contenedor de carrito, renderizar
  if(document.getElementById('cart-items')) renderCart();
});

function addToCart(id,qty=1){
  const cart = loadCart();
  if(!cart[id]){
    const p = PRODUCTS.find(x=>x.id===id);
    cart[id] = { id: id, qty: 0, name: p.name, price: p.price, img: p.img };
  }
  cart[id].qty += qty;
  saveCart(cart);
}

function updateCartCount(){ const el = document.getElementById('cart-count'); if(el) el.textContent = cartCount(); }

function renderCart(){
  const cart = loadCart(); const container = document.getElementById('cart-items');
  if(!container) return;
  container.innerHTML = '';
  let total = 0;
  Object.values(cart).forEach(item=>{
    total += item.qty * item.price;
    const div = document.createElement('div'); div.className='cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div style="flex:1">
        <strong>${item.name}</strong>
        <div>€${formatPrice(item.price)} x ${item.qty}</div>
      </div>
      <div>
        <button class="btn small" onclick="changeQty('${item.id}',1)">+</button>
        <button class="btn small" onclick="changeQty('${item.id}',-1)">-</button>
      </div>
    `;
    container.appendChild(div);
  });
  document.getElementById('cart-total').textContent = formatPrice(total);
  updateCartCount();
}

function changeQty(id,delta){
  const cart = loadCart(); if(!cart[id]) return;
  cart[id].qty += delta; if(cart[id].qty<=0) delete cart[id]; saveCart(cart); renderCart();
}

function toggleCart(){ const c = document.getElementById('cart'); if(!c) return; c.classList.toggle('hidden'); }
function hideCart(){ const c = document.getElementById('cart'); if(!c) return; c.classList.add('hidden'); }

// Exponer funciones al global (para botones inline)
window.changeQty = changeQty;
window.addToCart = addToCart;

// Si quieres limpiar el carrito, usa localStorage.removeItem('ff_cart_v1');


/* Fin de app.js */