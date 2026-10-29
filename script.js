const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let currentTransport = "Pesawat";
let currentOrder = null;
let activeUser = null;
let authMode = "login";
let toastTimer;

const prices = {
  Pesawat: { Basic: 750000, Medium: 950000, Elite: 1200000, VIP: 1500000 },
  Kereta: { Basic: 150000, Medium: 225000, Elite: 350000, VIP: 500000 },
  Bus: { Basic: 80000, Medium: 125000, Elite: 190000, VIP: 275000 },
  Hotel: { Basic: 250000, Medium: 400000, Elite: 650000, VIP: 1000000 }
};
const icons = { Pesawat: "✈", Kereta: "🚆", Bus: "🚌", Hotel: "🏨" };
const providers = {
  "E-wallet": ["GoPay", "DANA", "SeaBank", "OVO", "ShopeePay"],
  "Bank": ["BANI (Demo)", "BRI", "Mandiri", "BCA", "Bank Syariah"]
};
const today = new Date();
$("#travelDate").min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value).replace(/\u00a0/g, " ");
}
function showToast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.add("hidden"), 2800);
}
function getUsers() {
  try { return JSON.parse(localStorage.getItem("handyflyUsers") || "[]"); }
  catch { return []; }
}
function updateUserUI() {
  $("#userLabel").textContent = activeUser ? `Hai, ${activeUser.name || activeUser.username}` : "";
  $("#loginOpen").classList.toggle("hidden", !!activeUser);
  $("#registerOpen").classList.toggle("hidden", !!activeUser);
  $("#logoutBtn").classList.toggle("hidden", !activeUser);
}
function openAuth(mode = "login") {
  authMode = mode;
  $("#authModal").classList.remove("hidden");
  updateAuthMode();
  $("#authMessage").textContent = "";
}
function closeModal(id) { $(id).classList.add("hidden"); }
function updateAuthMode() {
  const registering = authMode === "register";
  $("#authTitle").textContent = registering ? "Buat akun HandyFly" : "Masuk ke akunmu";
  $("#authSubtitle").textContent = registering ? "Daftar dulu untuk mulai memesan." : "Masuk untuk melanjutkan pemesanan.";
  $("#nameField").classList.toggle("hidden", !registering);
  $("#authName").required = registering;
  $("#authPassword").autocomplete = registering ? "new-password" : "current-password";
  $("#authSubmit").textContent = registering ? "Buat akun" : "Masuk";
  $("#tabLogin").classList.toggle("active", !registering);
  $("#tabRegister").classList.toggle("active", registering);
}
function setTransport(type) {
  currentTransport = type;
  $$(".transport-tab").forEach(button => button.classList.toggle("active", button.dataset.type === type));
  const isHotel = type === "Hotel";
  $("#fromLabel").firstChild.textContent = isHotel ? "Kota / area" : "Dari";
  $("#toLabel").firstChild.textContent = isHotel ? "Nama / area hotel" : "Ke";
  $("#fromCity").placeholder = isHotel ? "Contoh: Bandung" : "Kota asal";
  $("#toCity").placeholder = isHotel ? "Contoh: hotel dekat pusat kota" : "Kota tujuan";
  $("#dateLabel").firstChild.textContent = isHotel ? "Tanggal check-in" : "Tanggal berangkat";
  $("#travellers").previousElementSibling;
  $("#swapBtn").classList.toggle("hidden", isHotel);
  $("#searchResults").classList.add("hidden");
}
function calculateOrder() {
  const from = $("#fromCity").value.trim();
  const to = $("#toCity").value.trim();
  const date = $("#travelDate").value;
  const count = Number($("#travellers").value);
  const ticketClass = $("#ticketClass").value;
  const promo = $("#promoCode").value.trim().toUpperCase();
  if (!from || !to || !date) {
    showToast("Lengkapi kota/area dan tanggal terlebih dahulu.");
    return null;
  }
  if (currentTransport !== "Hotel" && from.toLowerCase() === to.toLowerCase()) {
    showToast("Kota asal dan tujuan tidak boleh sama.");
    return null;
  }
  const unitPrice = prices[currentTransport][ticketClass];
  let subtotal = unitPrice * count;
  let discount = 0;
  if (promo === "HEMAT15" && currentTransport === "Pesawat") discount = Math.round(subtotal * .15);
  else if (promo === "JALAN25" && ["Kereta","Bus"].includes(currentTransport)) discount = Math.min(25000, subtotal);
  else if (promo === "INAP10" && currentTransport === "Hotel") discount = Math.round(subtotal * .10);
  else if (promo) showToast("Kode promo tidak cocok untuk pilihan ini; harga normal digunakan.");
  return { id: "HF" + Date.now().toString().slice(-8), type: currentTransport, from, to, date, count, ticketClass, unitPrice, subtotal, discount, total: subtotal-discount, promo: discount ? promo : "-", customer: activeUser ? (activeUser.name || activeUser.username) : "Tamu" };
}
function renderResults(order) {
  const alternatives = [
    { label: order.ticketClass, price: order.unitPrice, note: "Pilihan sesuai kelas yang kamu pilih." },
    { label: "Basic", price: prices[order.type].Basic, note: "Pilihan hemat untuk perjalanan." },
    { label: "VIP", price: prices[order.type].VIP, note: "Pilihan dengan fasilitas premium." }
  ].filter((item, index, arr) => arr.findIndex(x => x.label === item.label) === index);
  $("#searchResults").classList.remove("hidden");
  $("#searchResults").innerHTML = `<h3>${icons[order.type]} Pilihan ${order.type}</h3><p>Harga berikut adalah contoh harga untuk latihan, bukan penawaran aktual.</p><div class="result-list">${alternatives.map(item => `
    <article class="result-card"><div class="result-icon">${icons[order.type]}</div><h4>${item.label}</h4><p>${item.note}</p><div class="result-price">${formatRupiah(item.price * order.count)}</div><button class="btn ${item.label === order.ticketClass ? "btn-primary" : "btn-outline"} choose-result" data-class="${item.label}">${item.label === order.ticketClass ? "Kelas dipilih" : "Pilih kelas"}</button></article>`).join("")}</div>`;
  $$(".choose-result").forEach(button => button.addEventListener("click", () => {
    $("#ticketClass").value = button.dataset.class;
    const updated = calculateOrder();
    if (updated) { currentOrder = updated; renderResults(updated); showToast(`Kelas ${button.dataset.class} dipilih.`); }
  }));
  const buyButtons = document.createElement("div");
  buyButtons.style.cssText = "display:flex;justify-content:flex-end;margin-top:16px";
  buyButtons.innerHTML = '<button class="btn btn-primary" id="continuePayment">Lanjut ke pembayaran →</button>';
  $("#searchResults").appendChild(buyButtons);
  $("#continuePayment").addEventListener("click", () => {
    if (!activeUser) { openAuth("login"); showToast("Masuk atau daftar terlebih dahulu untuk memesan."); return; }
    currentOrder = calculateOrder();
    if (currentOrder) openPayment(currentOrder);
  });
}
function openPayment(order) {
  $("#orderSummary").innerHTML = `
    <div class="summary-row"><span>Nomor pesanan</span><strong>${order.id}</strong></div>
    <div class="summary-row"><span>${icons[order.type]} ${order.type} · ${order.ticketClass}</span><strong>${order.count} orang/unit</strong></div>
    <div class="summary-row"><span>${order.from} → ${order.to}</span><strong>${formatDate(order.date)}</strong></div>
    <div class="summary-row"><span>Harga awal</span><span>${formatRupiah(order.subtotal)}</span></div>
    ${order.discount ? `<div class="summary-row"><span>Promo ${order.promo}</span><span>− ${formatRupiah(order.discount)}</span></div>` : ""}
    <div class="summary-row total"><span>Total pembayaran</span><strong>${formatRupiah(order.total)}</strong></div>`;
  $("#qrisAmount").textContent = formatRupiah(order.total);
  $("#paymentMessage").textContent = "";
  $("#paymentModal").classList.remove("hidden");
  updatePaymentPanel();
}
function formatDate(value) {
  return new Date(value + "T00:00:00").toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}
function updatePaymentPanel() {
  const method = $('input[name="paymentMethod"]:checked').value;
  $("#qrisPanel").classList.toggle("hidden", method !== "QRIS");
  $("#transferPanel").classList.toggle("hidden", method !== "Transfer");
  updateProviderOptions();
}
function updateProviderOptions() {
  const type = $("#transferType").value;
  const select = $("#providerSelect");
  const old = select.value;
  select.innerHTML = providers[type].map(name => `<option>${name}</option>`).join("");
  if (providers[type].includes(old)) select.value = old;
  $("#providerLabel").firstChild.textContent = type === "Bank" ? "Pilih bank" : "Pilih e-wallet";
  $("#accountNumber").textContent = type === "Bank" ? `${select.value} — Rekening Demo` : `${select.value} — Akun Demo`;
}
function makeReceipt(order, method, provider) {
  const paymentCode = "HF-PAY-" + Math.random().toString(36).slice(2,8).toUpperCase();
  $("#receiptContent").innerHTML = `
    <h3>✈ HandyFly</h3><div class="receipt-sub">STRUK PEMBAYARAN DEMO</div>
    <div class="summary-row"><span>Status</span><strong style="color:#168554">BERHASIL (SIMULASI)</strong></div>
    <div class="summary-row"><span>No. pesanan</span><strong>${order.id}</strong></div>
    <div class="summary-row"><span>No. pembayaran</span><strong>${paymentCode}</strong></div>
    <div class="receipt-line"></div>
    <div class="summary-row"><span>Nama pemesan</span><strong>${escapeHTML(order.customer)}</strong></div>
    <div class="summary-row"><span>Layanan</span><strong>${icons[order.type]} ${order.type} · ${order.ticketClass}</strong></div>
    <div class="summary-row"><span>Rute / area</span><strong>${escapeHTML(order.from)} → ${escapeHTML(order.to)}</strong></div>
    <div class="summary-row"><span>Tanggal</span><strong>${formatDate(order.date)}</strong></div>
    <div class="summary-row"><span>Jumlah</span><strong>${order.count} orang/unit</strong></div>
    <div class="summary-row"><span>Metode bayar</span><strong>${method === "QRIS" ? "QRIS Demo" : escapeHTML(provider)}</strong></div>
    <div class="receipt-line"></div>
    <div class="summary-row"><span>Subtotal</span><span>${formatRupiah(order.subtotal)}</span></div>
    ${order.discount ? `<div class="summary-row"><span>Diskon</span><span>− ${formatRupiah(order.discount)}</span></div>` : ""}
    <div class="summary-row total"><span>TOTAL</span><strong>${formatRupiah(order.total)}</strong></div>
    <div class="receipt-line"></div><div class="receipt-sub">Terima kasih telah mencoba HandyFly.<br>Ini bukan bukti pembayaran asli.</div>`;
  $("#receiptModal").classList.remove("hidden");
}
function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char]));
}

$$(".transport-tab").forEach(button => button.addEventListener("click", () => setTransport(button.dataset.type)));
$("#swapBtn").addEventListener("click", () => {
  const from = $("#fromCity").value;
  $("#fromCity").value = $("#toCity").value;
  $("#toCity").value = from;
});
$("#ticketForm").addEventListener("submit", event => {
  event.preventDefault();
  const order = calculateOrder();
  if (order) { currentOrder = order; renderResults(order); $("#searchResults").scrollIntoView({ behavior: "smooth", block: "nearest" }); }
});
$$("[data-promo]").forEach(link => link.addEventListener("click", () => {
  $("#promoCode").value = link.dataset.promo;
  showToast(`Kode ${link.dataset.promo} dimasukkan. Pilih layanan yang sesuai.`);
}));
$("#loginOpen").addEventListener("click", () => openAuth("login"));
$("#registerOpen").addEventListener("click", () => openAuth("register"));
$("#tabLogin").addEventListener("click", () => { authMode = "login"; updateAuthMode(); $("#authMessage").textContent = ""; });
$("#tabRegister").addEventListener("click", () => { authMode = "register"; updateAuthMode(); $("#authMessage").textContent = ""; });
$("#authClose").addEventListener("click", () => closeModal("#authModal"));
$("#authForm").addEventListener("submit", event => {
  event.preventDefault();
  const username = $("#authUsername").value.trim();
  const password = $("#authPassword").value;
  const name = $("#authName").value.trim();
  const users = getUsers();
  if (authMode === "register") {
    if (!name) { $("#authMessage").textContent = "Isi nama lengkap terlebih dahulu."; return; }
    if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) { $("#authMessage").textContent = "Username sudah digunakan. Pilih username lain."; return; }
    users.push({ username, password, name });
    localStorage.setItem("handyflyUsers", JSON.stringify(users));
    activeUser = { username, name };
    showToast("Akun demo berhasil dibuat.");
  } else {
    const user = users.find(item => item.username.toLowerCase() === username.toLowerCase() && item.password === password);
    if (!user) { $("#authMessage").textContent = "Username atau password salah. Coba lagi atau daftar akun baru."; return; }
    activeUser = { username: user.username, name: user.name };
    showToast("Berhasil masuk ke HandyFly.");
  }
  sessionStorage.setItem("handyflySession", JSON.stringify(activeUser));
  updateUserUI(); closeModal("#authModal"); $("#authForm").reset();
  if (currentOrder) openPayment(calculateOrder() || currentOrder);
});
$("#logoutBtn").addEventListener("click", () => {
  activeUser = null; sessionStorage.removeItem("handyflySession"); updateUserUI(); showToast("Kamu sudah keluar dari akun.");
});
$("#paymentClose").addEventListener("click", () => closeModal("#paymentModal"));
$("#receiptClose").addEventListener("click", () => closeModal("#receiptModal"));
$("#closeReceipt").addEventListener("click", () => { closeModal("#receiptModal"); closeModal("#paymentModal"); showToast("Terima kasih sudah mencoba HandyFly."); });
$$('input[name="paymentMethod"]').forEach(input => input.addEventListener("change", updatePaymentPanel));
$("#transferType").addEventListener("change", updateProviderOptions);
$("#providerSelect").addEventListener("change", updateProviderOptions);
$("#completePayment").addEventListener("click", () => {
  if (!currentOrder) { $("#paymentMessage").textContent = "Data pesanan belum tersedia."; return; }
  const method = $('input[name="paymentMethod"]:checked').value;
  const provider = method === "QRIS" ? "QRIS Demo" : `${$("#transferType").value}: ${$("#providerSelect").value}`;
  closeModal("#paymentModal");
  makeReceipt(currentOrder, method, provider);
});
$("#printReceipt").addEventListener("click", () => window.print());
$("#mobileMenu").addEventListener("click", () => $("nav").classList.toggle("open"));
$$(".modal-backdrop").forEach(backdrop => backdrop.addEventListener("click", event => {
  if (event.target === backdrop) backdrop.classList.add("hidden");
}));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") $$(".modal-backdrop").forEach(modal => modal.classList.add("hidden"));
});
try {
  const session = JSON.parse(sessionStorage.getItem("handyflySession") || "null");
  if (session) activeUser = session;
} catch {}
updateUserUI();
updateProviderOptions();
