const {businessName, instagram, email, schools, products, cashAppUrl, googleSheetsEndpoint, orderingNote} = SITE_CONFIG;
const $ = (s) => document.querySelector(s);
const money = (n) => `$${n.toFixed(2)}`;
const cart = {};

function init() {
  $("#year").textContent = new Date().getFullYear();
  $("#order-disclaimer").textContent = orderingNote || "";
  renderProducts();
  renderSchools();
  renderOrderProducts();
  renderCart();
  populateContact();
  setupNav();
  setupForm();
  setupContactForm();
  setDateMinimum();
}

function renderProducts() {
  const card = p => `
    <article class="product-card">
      <div class="product-visual">
        <span class="availability">${escapeHtml(p.availability)}</span>
        <span aria-hidden="true">${p.emoji}</span>
      </div>
      <div class="product-info">
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description)}</p>
        <div class="price-row">
          <span class="price">${money(p.price)}</span>
          <button class="small-order" type="button" data-add="${escapeHtml(p.id)}">Add to order</button>
        </div>
      </div>
    </article>`;
  $("#featured-grid").innerHTML = products.filter(p => p.featured).map(card).join("");
  $("#menu-grid").innerHTML = products.map(card).join("");
  document.querySelectorAll("[data-add]").forEach(btn => btn.addEventListener("click", () => {
    addItem(btn.dataset.add, 1);
    location.hash = "order";
  }));
}

function renderSchools() {
  $("#school").innerHTML += schools.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("");
  $("#school-pills").innerHTML = schools.map(s => `<div>${escapeHtml(s)}</div>`).join("");
}

function isUnavailable(p) {
  return /sold out|unavailable/i.test(p.availability);
}

function renderOrderProducts() {
  $("#order-products").innerHTML = products.map(p => {
    const disabled = isUnavailable(p) ? "disabled" : "";
    return `
      <div class="order-product">
        <div>
          <div class="order-product-name">${escapeHtml(p.name)}</div>
          <div class="order-product-price">${money(p.price)} each · ${escapeHtml(p.availability)}</div>
        </div>
        <div class="stepper">
          <button type="button" aria-label="Decrease ${escapeHtml(p.name)}" data-minus="${escapeHtml(p.id)}" ${disabled}>−</button>
          <span id="count-${escapeHtml(p.id)}">0</span>
          <button type="button" aria-label="Increase ${escapeHtml(p.name)}" data-plus="${escapeHtml(p.id)}" ${disabled}>+</button>
        </div>
      </div>`;
  }).join("");
  document.querySelectorAll("[data-minus]").forEach(b => b.addEventListener("click", () => changeItem(b.dataset.minus, -1)));
  document.querySelectorAll("[data-plus]").forEach(b => b.addEventListener("click", () => changeItem(b.dataset.plus, 1)));
}

function addItem(id, amount) {
  const product = products.find(p => p.id === id);
  if (!product || isUnavailable(product)) return;
  cart[id] = Math.max(0, (cart[id] || 0) + amount);
  renderCart();
}

function changeItem(id, amount) {
  addItem(id, amount);
}

function renderCart() {
  let qty = 0, total = 0;
  const lines = products.filter(p => (cart[p.id] || 0) > 0).map(p => {
    const q = cart[p.id];
    qty += q; total += q * p.price;
    const count = document.querySelector(`#count-${CSS.escape(p.id)}`);
    if (count) count.textContent = q;
    return `<div class="cart-line"><div><strong>${escapeHtml(p.name)}</strong><br><small>${q} × ${money(p.price)}</small></div><strong>${money(q*p.price)}</strong></div>`;
  });
  products.forEach(p => {
    const count = document.querySelector(`#count-${CSS.escape(p.id)}`);
    if (count) count.textContent = cart[p.id] || 0;
  });
  $("#cart-items").innerHTML = lines.length ? lines.join("") : `<div class="empty-cart"><div>🍪</div><strong>Your cart is empty</strong><span>Add a cookie to get started.</span></div>`;
  $("#cart-count").textContent = `${qty} item${qty === 1 ? "" : "s"}`;
  $("#cart-qty").textContent = qty;
  $("#cart-total").textContent = money(total);
}

function getOrderData() {
  const items = products.filter(p => cart[p.id] > 0).map(p => ({
    name: p.name, quantity: cart[p.id], price: p.price, lineTotal: cart[p.id] * p.price
  }));
  return {
    name: $("#customer-name").value.trim(),
    school: $("#school").value,
    pickupDate: $("#pickup-date").value,
    pickupTime: $("#pickup-time").value,
    notes: $("#notes").value.trim(),
    items,
    totalQuantity: items.reduce((a,i) => a+i.quantity, 0),
    total: items.reduce((a,i) => a+i.lineTotal, 0),
    paymentMethod: "Cash App",
    paymentStatus: "Pending"
  };
}

function createOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `PIPER-${stamp.slice(-6)}-${random}`;
}

function setupForm() {
  $("#order-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = getOrderData();
    if (!data.items.length) {
      alert("Please add at least one cookie to your order.");
      return;
    }
    if (!data.name || !data.school || !data.pickupDate || !data.pickupTime) {
      $("#order-form").reportValidity();
      return;
    }

    const orderNumber = createOrderNumber();
    const saved = {...data, orderNumber, createdAt: new Date().toISOString(), businessName};

    // Keep a local copy as a backup on the customer's device.
    const previous = JSON.parse(localStorage.getItem("bakedByPiperOrders") || "[]");
    previous.push(saved);
    localStorage.setItem("bakedByPiperOrders", JSON.stringify(previous));

    // Send the order to the Google Apps Script endpoint when one has been configured.
    submitToGoogleSheets(saved);

    showConfirmation(saved);
    Object.keys(cart).forEach(k => delete cart[k]);
    $("#order-form").reset();
    renderCart();
  });
}

function submitToGoogleSheets(order) {
  if (!googleSheetsEndpoint) return;

  // A native form POST avoids CORS/preflight issues on GitHub Pages.
  const frame = document.createElement("iframe");
  frame.name = `order-submit-${Date.now()}`;
  frame.hidden = true;
  document.body.appendChild(frame);

  const form = document.createElement("form");
  form.method = "POST";
  form.action = googleSheetsEndpoint;
  form.target = frame.name;
  form.style.display = "none";

  const payload = document.createElement("input");
  payload.type = "hidden";
  payload.name = "payload";
  payload.value = JSON.stringify(order);
  form.appendChild(payload);

  document.body.appendChild(form);
  form.submit();

  setTimeout(() => {
    form.remove();
    frame.remove();
  }, 15000);
}

function showConfirmation(o) {
  const itemLines = o.items.map(i => `<span>${i.quantity} × ${escapeHtml(i.name)}</span>`).join("");
  $("#confirmation-details").innerHTML = `
    <div><span>Order #</span><strong>${escapeHtml(o.orderNumber)}</strong></div>
    <div><span>Name</span><strong>${escapeHtml(o.name)}</strong></div>
    <div><span>School</span><strong>${escapeHtml(o.school)}</strong></div>
    <div><span>Pickup</span><strong>${escapeHtml(formatDate(o.pickupDate))} · ${escapeHtml(formatTime(o.pickupTime))}</strong></div>
    <div class="items-list"><strong>Items</strong>${itemLines}</div>
    <div><span>Total</span><strong>${money(o.total)}</strong></div>
    <div><span>Payment</span><strong>Cash App · Pending</strong></div>`;

  const paymentArea = $("#payment-area");
  const payButton = $("#cashapp-button");
  const unavailable = $("#payment-unavailable");
  paymentArea.hidden = false;
  if (cashAppUrl) {
    payButton.href = cashAppUrl;
    payButton.hidden = false;
    unavailable.hidden = true;
  } else {
    payButton.hidden = true;
    unavailable.hidden = false;
  }

  $("#confirmation").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeConfirmation() {
  $("#confirmation").hidden = true;
  document.body.style.overflow = "";
}
$(".modal-close").addEventListener("click", closeConfirmation);
$(".modal-done").addEventListener("click", closeConfirmation);
$(".modal-backdrop").addEventListener("click", closeConfirmation);

function setupContactForm() {
  $("#contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    $("#contact-status").hidden = false;
    e.target.reset();
  });
}

function populateContact() {
  const ig = $("#instagram-link");
  ig.querySelector("span").textContent = `@${instagram.replace(/^@/, "")}`;
  ig.href = "https://instagram.com/" + instagram.replace(/^@/, "");
  $("#email-link").querySelector("span").textContent = email;
  $("#email-link").href = "mailto:" + email;
}

function setupNav() {
  const toggle = $(".menu-toggle"), nav = $(".nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

function setDateMinimum() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  $("#pickup-date").min = local;
}

function formatDate(s) {
  const d = new Date(s + "T12:00:00");
  return d.toLocaleDateString(undefined, {month:"short", day:"numeric", year:"numeric"});
}
function formatTime(s) {
  const [h,m] = s.split(":"); const d = new Date(); d.setHours(+h,+m);
  return d.toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"});
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
document.addEventListener("DOMContentLoaded", init);
