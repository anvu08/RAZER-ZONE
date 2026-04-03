// PRODUCT IMAGES
const productImages = {
  Black: [
    "img/viperv4.jpg",
    "img/anhviper.jpg",
    "img/anhviper2.jpg",
    "img/anhviper3.jpg",
  ],
  White: [
    "img/whiteviperv4.jpg",
    "img/view1.jpg",
    "img/view2.jpg",
    "img/view3.jpg",
  ],
};

function changeImg(src) {
  const mainImg = document.getElementById("current-img");
  mainImg.style.opacity = "0.4";
  setTimeout(() => {
    mainImg.src = src;
    mainImg.style.opacity = "1";
  }, 250);
  document.querySelectorAll(".thumb").forEach((thumb) => {
    if (thumb.src.includes(src)) thumb.classList.add("active");
    else thumb.classList.remove("active");
  });
}

function selectColor(colorName, mainImgSrc, element) {
  document.getElementById("color-name").innerText = colorName;
  changeImg(mainImgSrc);
  document
    .querySelectorAll(".color-dot")
    .forEach((dot) => dot.classList.remove("active"));
  element.classList.add("active");

  const thumbs = document.querySelectorAll(".thumb");
  const images = productImages[colorName];
  thumbs.forEach((thumb, index) => {
    if (images[index + 1]) thumb.src = images[index + 1];
  });
  thumbs.forEach((t) => t.classList.remove("active"));
  thumbs[0].classList.add("active");
}

// CART
let cart = JSON.parse(localStorage.getItem("razer_cart")) || [];
function addToCart(name, price) {
  let existing = cart.find((item) => item.name === name);
  if (existing) existing.qty++;
  else cart.push({ name, price, qty: 1 });
  localStorage.setItem("razer_cart", JSON.stringify(cart));
  updateCartUI();
  openCart();
}
function updateCartUI() {
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  if (!cartCount || !cartItems || !cartTotal) return;

  cartCount.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
  cartItems.innerHTML = "";
  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.marginBottom = "15px";
    div.innerHTML = `<span>${item.name} x${item.qty}</span><span>$${(item.price * item.qty).toFixed(2)}</span><button onclick="removeFromCart(${index})" style="background:none;border:none;color:red;cursor:pointer;font-size:1.1rem">✖</button>`;
    cartItems.appendChild(div);
  });
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotal.innerText = total.toFixed(2);
}
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("razer_cart", JSON.stringify(cart));
  updateCartUI();
}
function openCart() {
  document.getElementById("cart-drawer").style.right = "0";
}
function closeCart() {
  document.getElementById("cart-drawer").style.right = "-400px";
}

document.querySelector(".cart-icon").addEventListener("click", openCart);
document.addEventListener("DOMContentLoaded", updateCartUI);
document
  .querySelectorAll(".color-dot")
  .forEach((dot) => dot.classList.remove("active"));
element.classList.add("active");
// ================= SEARCH =================
function toggleSearch() {
  const input = document.getElementById("search-input");
  input.classList.toggle("active");
  if (input.classList.contains("active")) {
    input.focus();
  } else {
    input.blur();
  }
}

// ================= CART DRAWER =================
function toggleCart() {
  const drawer = document.getElementById("cart-drawer");
  if (!drawer) return;
  if (drawer.style.right === "0px") {
    drawer.style.right = "-400px";
  } else {
    drawer.style.right = "0px";
  }
}

function closeCart() {
  const drawer = document.getElementById("cart-drawer");
  if (!drawer) return;
  drawer.style.right = "-400px";
}

// Cập nhật UI giỏ hàng và animation số lượng
function updateCartUI() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCountNav = document.getElementById("cart-count-nav");
  const cartCountFloating = document.getElementById("cart-count-floating");

  cartItems.innerHTML = "";
  let total = 0;
  let totalCount = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    totalCount += item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span class="item-name">${item.name}</span>
      <span class="item-qty">x${item.quantity}</span>
      <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);

  // Animation nhảy số
  animateCount(cartCountNav, totalCount);
  if (cartCountFloating) animateCount(cartCountFloating, totalCount);
}

// Animation nhảy số lượng
function animateCount(el, value) {
  el.classList.add("pop"); // thêm class animation
  el.textContent = value;
  setTimeout(() => el.classList.remove("pop"), 300);
}

// Mở / Đóng Drawer
function openCart() {
  const drawer = document.getElementById("cart-drawer");
  drawer.style.right = "0";
}

function closeCart() {
  const drawer = document.getElementById("cart-drawer");
  drawer.style.right = "-400px";
}

function toggleCart() {
  const drawer = document.getElementById("cart-drawer");
  if (drawer.style.right === "0px") {
    closeCart();
  } else {
    openCart();
  }
}

// Cập nhật UI và animation
function updateCartUI() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCountNav = document.getElementById("cart-count-nav");
  const cartCountFloating = document.getElementById("cart-count-floating");

  if (!cartItems || !cartTotal || !cartCountNav) return;

  cartItems.innerHTML = "";
  let total = 0;
  let totalCount = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    totalCount += item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span class="item-name">${item.name}</span>
      <span class="item-qty">x${item.quantity}</span>
      <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
      <button onclick="removeFromCart('${item.name}')" style="background:none;border:none;color:red;cursor:pointer">✖</button>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);

  // Cập nhật số lượng và hiệu ứng nhảy
  [cartCountNav, cartCountFloating].forEach((el) => {
    el.textContent = totalCount;
    el.classList.add("pop");
    setTimeout(() => el.classList.remove("pop"), 300);
  });
}

// Xóa item
function removeFromCart(name) {
  cart = cart.filter((item) => item.name !== name);
  localStorage.setItem("razer_cart", JSON.stringify(cart));
  updateCartUI();
}

// Drawer
function openCart() {
  const drawer = document.getElementById("cart-drawer");
  if (drawer) drawer.style.right = "0";
}
function closeCart() {
  const drawer = document.getElementById("cart-drawer");
  if (drawer) drawer.style.right = "-400px";
}
function toggleCart() {
  const drawer = document.getElementById("cart-drawer");
  if (!drawer) return;
  drawer.style.right = drawer.style.right === "0px" ? "-400px" : "0";
}

// Animation CSS
// Thêm vào style.css:
// #cart-count-nav.pop, #cart-count-floating.pop { transform: scale(1.5); transition: 0.2s; }
