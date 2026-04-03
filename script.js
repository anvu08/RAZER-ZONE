let cart = JSON.parse(localStorage.getItem("razer_cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const modal = document.getElementById("login-modal");
  const bttBtn = document.getElementById("backToTop");
  const chromaSection = document.querySelector(".chroma-section");
  const keyboards = document.querySelectorAll(".keyboard-container img");

  updateCartUI();

  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY;
    if (navbar) {
      if (scrollPos > 50) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    }
    if (bttBtn) {
      bttBtn.classList.toggle("show", scrollPos > 500);
    }
    if (chromaSection && keyboards.length > 0) {
      const rect = chromaSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      let progress = (windowHeight - rect.top) / (windowHeight + rect.height);
      progress = Math.max(0, Math.min(1, progress));
      const hue = progress * 360;
      const color = `hsl(${hue}, 100%, 60%)`;
      keyboards.forEach((kb) => {
        kb.style.setProperty("--hue-angle", `${hue}deg`);
        kb.style.setProperty("--dynamic-color", color);
      });
    }
  });

  window.openLogin = function () {
    if (modal) {
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
      playClick();
    }
  };

  window.closeLogin = function () {
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  };

  window.addEventListener("click", (e) => {
    if (e.target === modal) closeLogin();
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          if (entry.target.classList.contains("count"))
            startCounting(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  document
    .querySelectorAll(".reveal, .fade-in, .count")
    .forEach((el) => observer.observe(el));

  function startCounting(el) {
    const target = +el.getAttribute("data-target");
    let current = 0;
    const increment = target / 50;
    const update = () => {
      current += increment;
      if (current < target) {
        el.innerText = Math.ceil(current);
        requestAnimationFrame(update);
      } else {
        el.innerText = target;
      }
    };
    update();
  }
});

// Hàm Đóng/Mở Giỏ hàng dùng chung cho tất cả các trang
// Hàm Đóng/Mở Giỏ hàng dùng chung cho tất cả các trang
// function toggleCart() {
//   // Lấy cả 2 phần tử: Giỏ hàng và Lớp nền mờ
//   const drawer = document.getElementById("cart-drawer");
//   const overlay = document.getElementById("cart-overlay");

//   // Kiểm tra xem chúng có tồn tại không để tránh lỗi trình duyệt
//   if (drawer && overlay) {
//     // Thêm hoặc xóa class 'active' cho CẢ HAI cùng một lúc
//     drawer.classList.toggle("active");
//     overlay.classList.toggle("active");
//   }
// }

function openCart() {
  const drawer = document.getElementById("cart-drawer");
  if (drawer) drawer.classList.add("active");
}

function closeCart() {
  const drawer = document.getElementById("cart-drawer");
  if (drawer) drawer.classList.remove("active");
}

function addToCart(name, price) {
  let existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  localStorage.setItem("razer_cart", JSON.stringify(cart));
  updateCartUI();

  const toast = document.getElementById("toast-msg");
  if (toast) {
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  }
  openCart();
}

// function updateCartUI() {
//   const list =
//     document.getElementById("cart-items") ||
//     document.getElementById("cart-items-list");
//   const totalEl =
//     document.getElementById("cart-total") ||
//     document.getElementById("cart-total-price");
//   const countNav =
//     document.getElementById("cart-count") ||
//     document.getElementById("cart-count-nav");

//   if (!list) return;
//   list.innerHTML = "";

//   let total = 0;
//   let totalQty = 0;

//   if (cart.length === 0) {
//     list.innerHTML =
//       '<p style="text-align:center; color:#555; padding:20px;">Your cart is empty.</p>';
//   } else {
//     cart.forEach((item, index) => {
//       const currentQty = item.qty || 1;
//       total += item.price * currentQty;
//       totalQty += currentQty;
//       list.innerHTML += `
//                 <div class="cart-item" style="display:flex; justify-content:space-between; padding:15px; border-bottom:1px solid #222; color:white;">
//                     <div>
//                         <h4 style="margin:0; font-size:14px;">${item.name} x${currentQty}</h4>
//                         <span style="color:#44d62c">$${(item.price * currentQty).toFixed(2)}</span>
//                     </div>
//                     <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer;">✖</button>
//                 </div>`;
//     });
//   }

//   if (totalEl) totalEl.innerText = total.toFixed(2) + "$";
//   if (countNav) {
//     countNav.innerText = totalQty;
//     countNav.classList.add("pop");
//     setTimeout(() => countNav.classList.remove("pop"), 300);
//   }
// }

// function removeFromCart(index) {
//   cart.splice(index, 1);
//   localStorage.setItem("razer_cart", JSON.stringify(cart));
//   updateCartUI();
// }

// --- PHẦN QUẢN LÝ GIỎ HÀNG CHUẨN (HỢP NHẤT) ---
let discountAmount = 0; // Biến lưu số tiền được giảm

// function updateCartUI() {
//   const list = document.getElementById("cart-items");
//   const totalEl = document.getElementById("cart-total");
//   const countNav = document.getElementById("cart-count-nav");
//   const discountEl = document.getElementById("discount");

//   if (!list) return;
//   list.innerHTML = "";

//   let subtotal = 0;
//   let totalQty = 0;

//   if (cart.length === 0) {
//     list.innerHTML =
//       '<p style="text-align:center; color:#555; padding:20px;">Your cart is empty.</p>';
//   } else {
//     cart.forEach((item) => {
//       const itemTotal = item.price * item.quantity;
//       subtotal += itemTotal;
//       totalQty += item.quantity;

//       list.innerHTML += `
//                 <div class="cart-item" style="display:flex; align-items:center; justify-content:space-between; padding:15px; border-bottom:1px solid #222; color:white;">
//                     <div style="flex:1;">
//                         <h4 style="margin:0; font-size:14px;">${item.name}</h4>
//                         <span style="color:#44d62c">$${item.price.toFixed(2)}</span>
//                     </div>
//                     <div style="display:flex; align-items:center; gap:10px;">
//                         <button onclick="changeQty('${item.name}', -1)" style="background:#222; border:1px solid #44d62c; color:white; cursor:pointer; width:25px;">−</button>
//                         <span>${item.quantity}</span>
//                         <button onclick="changeQty('${item.name}', 1)" style="background:#222; border:1px solid #44d62c; color:white; cursor:pointer; width:25px;">+</button>
//                     </div>
//                     <div style="margin-left:15px; font-weight:bold; width:70px; text-align:right; color:#44d62c;">
//                         $${itemTotal.toFixed(2)}
//                     </div>
//                     <button onclick="removeItem('${item.name}')" style="background:none; border:none; color:#ff4d4d; cursor:pointer; margin-left:10px;">✖</button>
//                 </div>`;
//     });
//   }

//   // LOGIC QUAN TRỌNG: Tính toán tiền sau khi trừ voucher
//   let finalTotal = subtotal - discountAmount;
//   if (finalTotal < 0) finalTotal = 0;

//   // Hiển thị ra màn hình
//   if (totalEl) totalEl.innerText = finalTotal.toFixed(2);
//   if (discountEl) discountEl.innerText = discountAmount.toFixed(2);
//   if (countNav) {
//     countNav.innerText = totalQty;
//     countNav.classList.add("pop");
//     setTimeout(() => countNav.classList.remove("pop"), 300);
//   }

//   localStorage.setItem("razer_cart", JSON.stringify(cart));
// }

// function applyVoucher() {
//   const input = document.getElementById("voucher-input");
//   if (!input) return;
//   const code = input.value.trim().toUpperCase();

//   // Kiểm tra mã
//   if (code === "VIPERV4") {
//     discountAmount = 20; // Giảm 20$
//     alert("Voucher applied! -$20.00");
//   } else if (code === "RAZER50") {
//     discountAmount = 50; // Giảm 50$
//     alert("Voucher applied! -$50.00");
//   } else {
//     discountAmount = 0;
//     alert("Invalid voucher code.");
//   }

//   // Sau khi gán giá trị discount, PHẢI gọi hàm này để vẽ lại giá tiền
//   updateCartUI();
// }

// function changeQty(name, amount) {
//   const item = cart.find((i) => i.name === name);
//   if (!item) return;
//   item.quantity += amount;
//   if (item.quantity <= 0) {
//     cart = cart.filter((i) => i.name !== name);
//   }
//   updateCartUI();
// }

// function removeItem(name) {
//   cart = cart.filter((i) => i.name !== name);
//   updateCartUI();
// }

// function addToCart(name, price) {
//   price = Number(price);
//   let existing = cart.find((item) => item.name === name);
//   if (existing) {
//     existing.quantity++;
//   } else {
//     cart.push({ name, price, quantity: 1 });
//   }
//   updateCartUI();

//   // Mở giỏ hàng ngay khi thêm
//   const drawer = document.getElementById("cart-drawer");
//   if (drawer) drawer.classList.add("active");
// }
function playClick() {
  const clickSound = new Audio("sound/soundclick.mp3");
  clickSound.volume = 0.5;
  clickSound.play().catch(() => {});
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  playClick();
}

let lastFireTime = 0;
document.addEventListener("mousemove", (e) => {
  const cursor = document.querySelector(".cursor");
  if (cursor) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  }
  const now = Date.now();
  if (now - lastFireTime > 35) {
    createFireParticle(e.clientX, e.clientY);
    lastFireTime = now;
  }
});

function createFireParticle(x, y) {
  const container = document.getElementById("fire-container");
  if (!container) return;
  const p = document.createElement("div");
  p.className = "fire-particle";
  const size = Math.random() * 6 + 4;
  p.style.width = p.style.height = `${size}px`;
  p.style.left = x + (Math.random() - 0.5) * 15 + "px";
  p.style.top = y + (Math.random() - 0.5) * 15 + "px";
  container.appendChild(p);
  p.addEventListener("animationend", () => p.remove());
}

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");

  if (!sessionStorage.getItem("visited")) {
    sessionStorage.setItem("visited", "true");

    setTimeout(() => {
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
    }, 1200);
  } else {
    preloader.style.display = "none";
  }
});

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

function selectColor(colorName, mainImgSrc, element) {
  document.getElementById("color-name").innerText = colorName;
  changeImg(mainImgSrc);
  document
    .querySelectorAll(".color-dot")
    .forEach((dot) => dot.classList.remove("active"));
  element.classList.add("active");

  // Cập nhật dàn ảnh nhỏ
  const thumbs = document.querySelectorAll(".thumb");
  const newAlbum = productImages[colorName];
  thumbs.forEach((thumb, index) => {
    if (newAlbum[index + 1]) thumb.src = newAlbum[index + 1];
  });
}

function changeImg(src) {
  const mainImg = document.getElementById("current-img");
  mainImg.src = src;
  document
    .querySelectorAll(".thumb")
    .forEach((t) => t.classList.toggle("active", t.src.includes(src)));
}

function toggleCart() {
  document.getElementById("cart-drawer").classList.toggle("active");
}
function toggleSearch() {
  console.log("Search toggled");
}

function addToCart(name, price) {
  document.getElementById("cart-count-nav").innerText = cart.length;
  const list = document.getElementById("cart-items");
  list.innerHTML += `<p style="border-bottom:1px solid #333; padding:5px;">${name} - $${price}</p>`;
  let total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById("cart-total").innerText = total.toFixed(2);
  toggleCart();
}

/* --- HÀM CHUYỂN TAB (Sửa lỗi không chuyển trang) --- */
function changeTab(element, url) {
  playClick();
  document
    .querySelectorAll(".nav-item")
    .forEach((i) => i.classList.remove("active"));
  if (element) element.classList.add("active");
  if (url) {
    setTimeout(() => {
      window.location.href = url;
    }, 150);
  }
}

/* --- ÂM THANH CLICK BỔ SUNG --- */
function playClickSound() {
  const razerAudio = new Audio("sound/soundclick.mp3");
  razerAudio.volume = 1.0;
  razerAudio.play().catch(() => {});
}

/* --- ĐÓNG GIỎ HÀNG KHI CLICK OVERLAY --- */
document.addEventListener("click", (e) => {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  const cartIcon = document.querySelector(".cart-icon");

  // Nếu click vào overlay hoặc bên ngoài drawer (mà không phải nút mở giỏ)
  if (e.target === overlay) {
    closeCart();
  }
});

/* --- HÀM TÌM KIẾM CHI TIẾT --- */
function toggleSearch() {
  const wrapper = document.querySelector(".search-wrapper");
  const input = document.getElementById("search-input");
  if (wrapper) {
    wrapper.classList.toggle("active");
    if (wrapper.classList.contains("active") && input) {
      input.focus();
    }
  }
}
// function updateCartUI() {
//   const list = document.getElementById("cart-items");
//   const totalEl = document.getElementById("cart-total");
//   const countNav = document.getElementById("cart-count-nav");

//   if (!list) return;

//   list.innerHTML = "";

//   let total = 0;

//   if (cart.length === 0) {
//     list.innerHTML = `<p style="text-align:center; color:#555;">Cart is empty</p>`;
//   } else {
//     cart.forEach((item, index) => {
//       total += item.price;

//       list.innerHTML += `
//         <div class="cart-item">
//           <div>
//             <h4>${item.name}</h4>
//             <span>$${item.price.toFixed(2)}</span>
//           </div>
//           <button class="remove-btn" onclick="removeFromCart(${index})">✖</button>
//         </div>
//       `;
//     });
//   }

//   totalEl.innerText = total.toFixed(2);
//   countNav.innerText = cart.length;
// }
// function removeFromCart(index) {
//   cart.splice(index, 1);
//   localStorage.setItem("razer_cart", JSON.stringify(cart));
//   updateCartUI();
// }
// function addToCart(name, price) {
//   price = Number(price); // ép về số

//   const existingItem = cart.find((item) => item.name === name);

//   if (existingItem) {
//     existingItem.quantity += 1;
//   } else {
//     cart.push({
//       name: name || "Unknown",
//       price: price || 0,
//       quantity: 1,
//     });
//   }

//   localStorage.setItem("razer_cart", JSON.stringify(cart));
//   updateCart();
// }

function checkout() {
  if (cart.length === 0) {
    alert("Giỏ hàng đang trống!");
    return;
  }

  alert("Mua hàng thành công ✅");

  cart = [];
  localStorage.removeItem("razer_cart");

  updateCartUI();
  toggleCart();
}
// voucher code
// --- PHẦN QUẢN LÝ GIỎ HÀNG ĐÃ CHUẨN HÓA ---
let discount = 0;

// function updateCartUI() {
//   const list = document.getElementById("cart-items");
//   const totalEl = document.getElementById("cart-total");
//   const countNav = document.getElementById("cart-count-nav");
//   const discountEl = document.getElementById("discount");

//   if (!list) return;
//   list.innerHTML = "";

//   let subtotal = 0;
//   let totalQty = 0;

//   if (cart.length === 0) {
//     list.innerHTML =
//       '<p style="text-align:center; color:#555; padding:20px;">Your cart is empty.</p>';
//   } else {
//     cart.forEach((item, index) => {
//       const itemTotal = item.price * item.quantity;
//       subtotal += itemTotal;
//       totalQty += item.quantity;

//       list.innerHTML += `
//         <div class="cart-item" style="display:flex; align-items:center; justify-content:space-between; padding:15px; border-bottom:1px solid #222; color:white;">
//           <div style="flex:1;">
//             <h4 style="margin:0; font-size:14px;">${item.name}</h4>
//             <span style="color:#44d62c">$${item.price.toFixed(2)}</span>
//           </div>
//           <div style="display:flex; align-items:center; gap:10px;">
//             <button onclick="changeQty('${item.name}', -1)" style="background:#222; border:1px solid #44d62c; color:white; cursor:pointer; width:25px;">−</button>
//             <span>${item.quantity}</span>
//             <button onclick="changeQty('${item.name}', 1)" style="background:#222; border:1px solid #44d62c; color:white; cursor:pointer; width:25px;">+</button>
//           </div>
//           <div style="margin-left:15px; font-weight:bold; width:70px; text-align:right; color:#44d62c;">
//             $${itemTotal.toFixed(2)}
//           </div>
//           <button onclick="removeItem('${item.name}')" style="background:none; border:none; color:#ff4d4d; cursor:pointer; margin-left:10px;">✖</button>
//         </div>`;
//     });
//   }

//   let finalTotal = Math.max(0, subtotal - discount);

//   if (totalEl) totalEl.innerText = finalTotal.toFixed(2);
//   if (countNav) {
//     countNav.innerText = totalQty;
//     countNav.classList.add("pop");
//     setTimeout(() => countNav.classList.remove("pop"), 300);
//   }
//   if (discountEl) discountEl.innerText = discount.toFixed(2);

//   localStorage.setItem("razer_cart", JSON.stringify(cart));
// }

// function addToCart(name, price) {
//   price = Number(price);
//   let existing = cart.find((item) => item.name === name);

//   if (existing) {
//     existing.quantity++;
//   } else {
//     cart.push({ name, price, quantity: 1 });
//   }

//   updateCartUI();

//   // Hiển thị thông báo (nếu có)
//   const toast = document.getElementById("toast-msg");
//   if (toast) {
//     toast.classList.add("show");
//     setTimeout(() => toast.classList.remove("show"), 2000);
//   }

//   // Mở giỏ hàng
//   const drawer = document.getElementById("cart-drawer");
//   if (drawer) drawer.classList.add("active");
//   playClick();
// }

// function changeQty(name, amount) {
//   const item = cart.find((i) => i.name === name);
//   if (!item) return;
//   item.quantity += amount;
//   if (item.quantity <= 0) {
//     cart = cart.filter((i) => i.name !== name);
//   }
//   updateCartUI();
// }

// function removeItem(name) {
//   cart = cart.filter((i) => i.name !== name);
//   updateCartUI();
// }

// function applyVoucher() {
//   const input = document.getElementById("voucher-input");
//   if (!input) return;
//   const code = input.value.trim().toUpperCase();

//   if (code === "VIPERV4") {
//     discount = 20;
//     alert("Voucher applied! -$20.00");
//   } else {
//     discount = 0;
//     alert("Invalid voucher code.");
//   }
//   updateCartUI();
// }

function checkout() {
  if (cart.length === 0) return alert("Your cart is empty!");
  alert("Checkout successful! Thank you.");
  cart = [];
  discount = 0;
  localStorage.removeItem("razer_cart");
  updateCartUI();
  toggleCart();
}
// --- KẾT THÚC PHẦN GIỎ HÀNG ---
// function updateCartUI() {
//   const list = document.getElementById("cart-items");
//   // ... các phần khai báo khác giữ nguyên ...

//   list.innerHTML = "";
//   cart.forEach((item) => {
//     const itemTotal = item.price * item.quantity;

//     list.innerHTML += `
//             <div class="cart-item">
//                 <div class="item-info">
//                     <p class="item-name">${item.name}</p>
//                     <p class="item-unit-price">$${item.price.toFixed(2)}</p>
//                 </div>

//                 <div class="item-controls">
//                     <button onclick="changeQty('${item.name}', -1)">−</button>
//                     <span class="qty-num">${item.quantity}</span>
//                     <button onclick="changeQty('${item.name}', 1)">+</button>
//                 </div>

//                 <div class="item-total-price">$${itemTotal.toFixed(2)}</div>

//                 <button class="remove-btn" onclick="removeItem('${item.name}')">✖</button>
//             </div>
//         `;
//   });
//   // ... phần còn lại của hàm ...
// }
// function updateCartUI() {
//   const list = document.getElementById("cart-items");
//   const totalEl = document.getElementById("cart-total");
//   const countNav = document.getElementById("cart-count-nav");

//   if (!list) return;
//   list.innerHTML = "";

//   let subtotal = 0;

//   cart.forEach((item) => {
//     const itemTotal = item.price * item.quantity;
//     subtotal += itemTotal;

//     list.innerHTML += `
//             <div class="cart-item">
//                 <div class="item-info">
//                     <p class="item-name">${item.name}</p>
//                     <p class="item-unit-price">$${item.price.toFixed(2)}</p>
//                 </div>

//                 <div class="item-controls">
//                     <button onclick="changeQty('${item.name}', -1)">−</button>
//                     <span class="qty-num">${item.quantity}</span>
//                     <button onclick="changeQty('${item.name}', 1)">+</button>
//                 </div>

//                 <div class="item-total-price">$${itemTotal.toFixed(2)}</div>

//                 <button class="remove-btn" onclick="removeItem('${item.name}')">✖</button>
//             </div>
//         `;
//   });

//   if (totalEl) totalEl.innerText = subtotal.toFixed(2);
//   if (countNav)
//     countNav.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
// }
// --- HỆ THỐNG GIỎ HÀNG CHUẨN HÓA (CHỈ GIỮ LẠI CỤM NÀY) ---
let discountValue = 0;

// 2. Hàm Thêm hàng
function addToCart(name, price, image = "img/default.jpg") {
  price = Number(price);
  let existing = cart.find((item) => item.name === name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }

  saveAndRefresh();
  openCart();
}

function handleAddToCart(button) {
  const name = button.getAttribute("data-name");
  const price = button.getAttribute("data-price");
  addToCart(name, price);
}

// 3. Quản lý Đóng/Mở và Nền mờ
function toggleCart() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (drawer && overlay) {
    drawer.classList.toggle("active");
    overlay.classList.toggle("active");
  }
}

function openCart() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (drawer) drawer.classList.add("active");
  if (overlay) overlay.classList.add("active");
}

// 4. Cập nhật giao diện (Giữ nguyên bố cục bạn thích)
function updateCartUI() {
  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const countNav = document.getElementById("cart-count-nav");
  const discountEl = document.getElementById("discount-amount");

  if (!list) return;
  list.innerHTML =
    cart.length === 0
      ? '<p style="text-align:center; color:#555; padding:20px;">Your cart is empty.</p>'
      : "";

  let subtotal = 0;
  let totalQty = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    totalQty += item.quantity;

    list.innerHTML += `
            <div class="cart-item" style="display:flex; align-items:center; justify-content:space-between; padding:15px; border-bottom:1px solid #222; color:white;">
                <div style="flex:1;">
                    <h4 style="margin:0; font-size:14px;">${item.name}</h4>
                    <span style="color:#44d62c">$${item.price.toFixed(2)}</span>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button onclick="changeQty(${index}, -1)" style="background:#222; border:1px solid #44d62c; color:white; cursor:pointer; width:25px;">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQty(${index}, 1)" style="background:#222; border:1px solid #44d62c; color:white; cursor:pointer; width:25px;">+</button>
                </div>
                <div style="margin-left:15px; font-weight:bold; width:70px; text-align:right; color:#44d62c;">
                    $${itemTotal.toFixed(2)}
                </div>
                <button onclick="removeItem(${index})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; margin-left:10px;">✖</button>
            </div>`;
  });

  let finalTotal = Math.max(0, subtotal - discountValue);
  if (totalEl) totalEl.innerText = finalTotal.toFixed(2);
  if (discountEl) discountEl.innerText = discountValue.toFixed(2);
  if (countNav) countNav.innerText = totalQty;

  localStorage.setItem("razer_cart", JSON.stringify(cart));
}

// 5. Các hàm bổ trợ
function changeQty(index, amount) {
  cart[index].quantity += amount;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  saveAndRefresh();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveAndRefresh();
}

function saveAndRefresh() {
  localStorage.setItem("razer_cart", JSON.stringify(cart));
  updateCartUI();
}

function applyVoucher() {
  const input = document.getElementById("voucher-input");
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (code === "VIPERV4") {
    discountValue = 20;
    alert("Voucher VIPERV4 applied: -$20.00");
  } else if (code === "RAZER50") {
    discountValue = 50;
    alert("Voucher RAZER50 applied: -$50.00");
  } else {
    discountValue = 0;
    alert("Invalid voucher code.");
  }
  updateCartUI();
}

// --- HÀM CHECKOUT CÓ HIỆU ỨNG PROCESSING NHƯ BẠN MUỐN ---
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty! Add some Razer gear first.");
    return;
  }

  const checkoutBtn = document.querySelector(".checkout-btn");
  const totalAmount = document.getElementById("cart-total").innerText;

  // 1. Hiệu ứng bắt đầu xử lý
  checkoutBtn.innerText = "PROCESSING...";
  checkoutBtn.style.opacity = "0.7";
  checkoutBtn.disabled = true;

  // 2. Chờ 1.5 giây để giả lập thanh toán (giống Screenshot_72.png)
  setTimeout(() => {
    alert("Thank you for your purchase! Total: $" + totalAmount);

    // 3. Sau khi người dùng ấn OK trên Alert, dọn dẹp giỏ hàng
    cart = [];
    localStorage.removeItem("razer_cart");
    discountValue = 0; // Reset voucher luôn

    updateCartUI();
    toggleCart(); // Đóng slide và xóa nền đen hoàn toàn

    // 4. Reset trạng thái nút
    checkoutBtn.innerText = "PROCEED TO CHECKOUT";
    checkoutBtn.style.opacity = "1";
    checkoutBtn.disabled = false;
  }, 1500);
}

document.addEventListener("DOMContentLoaded", updateCartUI);
