const products = [
  { id: 'p1', name: 'Glock 19 ', price: 17899, img: 'https://www.americanrifleman.org/media/vl0pjekz/g19x-right-profile-standard-mag.jpg' },
  { id: 'p2', name: 'M1 Garand ', price: 27595, img: 'https://www.recoilweb.com/wp-content/uploads/2022/09/M1-Garand-Article-1-600x450.jpg' },
  { id: 'p3', name: 'M4A1 ', price: 94522, img: 'https://i0.wp.com/blog.cheaperthandirt.com/wp-content/uploads/2018/04/ColtM4A1_c1.jpg?fit=1266%2C375&ssl=1' }
];

const productListEl = document.getElementById('productList');
const cartModal = document.getElementById('cartModal');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const totalPriceEl = document.getElementById('totalPrice');
const checkoutForm = document.getElementById('checkoutForm');

let cart = {};
let productsMap = {};

function renderProducts() {
  products.forEach(p => {
    productsMap[p.id] = p;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div>฿${p.price}</div>
      <button data-id="${p.id}">หยิบใส่ตะกร้า</button>
    `;
    productListEl.appendChild(card);
  });
  document.querySelectorAll('.card button').forEach(btn=>{
    btn.addEventListener('click',()=>addToCart(btn.dataset.id));
  });
}

function addToCart(id){
  cart[id] = (cart[id]||0)+1;
  renderCart();
  showCart();
}

function renderCart(){
  cartItemsEl.innerHTML = '';
  let total=0;
  let count=0;
  Object.keys(cart).forEach(id=>{
    const p = productsMap[id];
    const qty = cart[id];
    const sum = p.price * qty;
    total += sum;
    count += qty;

    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${p.img}">
      <div class="meta"><p>${p.name}</p><small>฿${p.price} x ${qty}</small></div>
      <div class="qty">
        <button data-op="dec" data-id="${id}">-</button>
        <span>${qty}</span>
        <button data-op="inc" data-id="${id}">+</button>
      </div>
    `;
    cartItemsEl.appendChild(el);
  });
  cartCountEl.textContent = count;
  totalPriceEl.textContent = '฿'+total;

  cartItemsEl.querySelectorAll('button').forEach(b=>{
    b.addEventListener('click',()=>{
      const id=b.dataset.id,op=b.dataset.op;
      if(op==='inc') cart[id]++;
      if(op==='dec'){ cart[id]--; if(cart[id]<=0) delete cart[id]; }
      renderCart();
    });
  });
}

function showCart(){ cartModal.classList.add('show'); }
function hideCart(){ cartModal.classList.remove('show'); }
document.getElementById('openCart').addEventListener('click', showCart);
document.getElementById('closeCart').addEventListener('click', hideCart);

checkoutForm.addEventListener('submit', async (e)=>{
  e.preventDefault();

  if(Object.keys(cart).length === 0){
    alert("⚠️ ตะกร้าว่างอยู่ครับ");
    return;
  }

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const payment = document.querySelector("input[name=payment]:checked").value;
  const note = document.getElementById("note").value;

  let orderDetails = [];
  let total = 0;
  Object.keys(cart).forEach(id=>{
    const p = productsMap[id];
    const qty = cart[id];
    const sum = p.price * qty;
    total += sum;
    orderDetails.push(`${p.name} x ${qty} = ฿${sum}`);
  });
  orderDetails.push(`รวมทั้งหมด = ฿${total}`);

  const order = { 
    name, email, address, phone, payment, 
    order: orderDetails.join(" | "), note 
  };

  await fetch("https://script.google.com/macros/s/AKfycby10xUg1IlKdUdGxUsGxEMT9S8xeuakIfnMrBh2KHUSaW1dKhA1c-g1a0wBWhaJUK5YIg/exec", {
    method: "POST",
    body: JSON.stringify(order)
  });

  alert("✅ ส่งออเดอร์เรียบร้อย! ไปที่ Google Sheets แล้ว");

  cart = {};
  renderCart();
  checkoutForm.reset();
  hideCart();
});

renderProducts();
renderCart();
