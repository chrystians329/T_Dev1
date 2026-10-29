(function () {
  "use strict";

  // Menu catalog
  const CANTEENS = [
    {
      id: "A",
      name: "Kantin A",
      sub: "Mie, Bakso & Kuah Hangat",
      logoImage: "Asset/logo-store/kantin-A-hero.png",
      items: [
        { name: "Mie Ayam Original", price: 10000, img: "Asset/Menu/mie-ayam.jpg" },
        { name: "Bakso Sapi Urat", price: 12000, img: "Asset/Menu/bakso.jpg" },
        { name: "Pangsit Goreng", price: 8000, img: "Asset/Menu/pangsit.jpg" },
        { name: "Mie Goreng Spesial", price: 11000, img: "Asset/Menu/mie-goreng.jpg" },
        { name: "Kwetiau Ayam", price: 12000, img: "Asset/Menu/kwetiau.jpg" },
        { name: "Es Teh Manis", price: 4000, img: "Asset/Menu/es-teh.jpg" },
        { name: "Teh Tarik", price: 6000, img: "Asset/Menu/teh-tarik.jpg" }
      ]
    },
    {
      id: "B",
      name: "Kantin B",
      sub: "Nasi, Ayam & Lauk Pauk",
      logoImage: "Asset/logo-store/Kantin-B-hero.png",
      items: [
        { name: "Nasi Ayam Geprek", price: 13000, img: "Asset/Menu/ayam-geprek.jpg" },
        { name: "Nasi Telur Balado", price: 10000, img: "Asset/Menu/telur-balado.jpg" },
        { name: "Nasi Uduk Komplit", price: 9000, img: "Asset/Menu/nasi-uduk.jpg" },
        { name: "Tempe Orek", price: 5000, img: "Asset/Menu/tempe-orek.jpg" },
        { name: "Sayur Asem", price: 6000, img: "Asset/Menu/sayur-asem.jpg" },
        { name: "Kerupuk Udang", price: 2000, img: "Asset/Menu/kerupuk.jpg" },
        { name: "Air Mineral", price: 3000, img: "Asset/Menu/air-mineral.jpg" },
        { name: "Es Jeruk Peras", price: 5000, img: "Asset/Menu/es-jeruk.jpg" }
      ]
    },
    {
      id: "C",
      name: "Kantin C",
      sub: "Soto & Masakan Tradisional",
      logoImage: "Asset/logo-store/Kantin-C-hero.jpg",
      items: [
        { name: "Soto Ayam Lamongan", price: 12000, img: "Asset/Menu/soto-ayam.jpg" },
        { name: "Rawon Daging", price: 15000, img: "Asset/Menu/rawon.jpg" },
        { name: "Gado-Gado", price: 10000, img: "Asset/Menu/gado-gado.jpg" },
        { name: "Pecel Sayur", price: 9000, img: "Asset/Menu/pecel.jpg" },
        { name: "Lontong Sayur", price: 11000, img: "Asset/Menu/lontong-sayur.jpg" },
        { name: "Es Cendol Dawet", price: 7000, img: "Asset/Menu/cendol.jpg" },
        { name: "Tahu Isi", price: 4000, img: "Asset/Menu/tahu-isi.jpg" }
      ]
    },
    {
      id: "D",
      name: "Kantin D",
      sub: "Jajanan & Gorengan",
      logoImage: "Asset/logo-store/kantin-D-hero.png",
      items: [
        { name: "Martabak Telur", price: 12000, img: "Asset/Menu/martabak-telur.jpg" },
        { name: "Sosis Bakar", price: 8000, img: "Asset/Menu/sosis-bakar.jpg" },
        { name: "Roti Bakar Coklat", price: 9000, img: "Asset/Menu/roti-bakar.jpg" },
        { name: "Pisang Goreng Keju", price: 6000, img: "Asset/Menu/pisang-goreng.jpg" },
        { name: "Cireng Bumbu Rujak", price: 5000, img: "Asset/Menu/cireng.jpg" },
        { name: "Batagor", price: 10000, img: "Asset/Menu/batagor.jpg" },
        { name: "Es Doger", price: 8000, img: "Asset/Menu/es-doger.jpg" }
      ]
    },
    {
      id: "E",
      name: "Kantin E",
      sub: "Nasi Kuning & Menu Istimewa",
      logoImage: "Asset/logo-store/kantin-E-hero.png",
      items: [
        { name: "Nasi Kuning Komplit", price: 12000, img: "Asset/Menu/nasi-kuning.jpg" },
        { name: "Rendang Sapi", price: 18000, img: "Asset/Menu/rendang.jpg" },
        { name: "Sate Ayam Madura", price: 15000, img: "Asset/Menu/sate-ayam.jpg" },
        { name: "Ikan Bakar Kecap", price: 17000, img: "Asset/Menu/ikan-bakar.jpg" },
        { name: "Perkedel Kentang", price: 4000, img: "Asset/Menu/perkedel.jpg" },
        { name: "Sambal Terasi", price: 3000, img: "Asset/Menu/sambal-terasi.jpg" },
        { name: "Es Kelapa Muda", price: 8000, img: "Asset/Menu/es-kelapa.jpg" }
      ]
    }
  ];

  // Helpers
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function formatRp(n) {
    return "Rp " + Number(n).toLocaleString("id-ID");
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* ignore */ } }
  };

  // App state
  const itemIndex = new Map(); // Menu items by ID
  const cart = new Map(); // Quantities by item ID

  CANTEENS.forEach((c) => {
    c.items.forEach((it, i) => {
      const id = c.id + "-" + i;
      itemIndex.set(id, {
        id,
        name: it.name,
        price: it.price,
        img: it.img,
        canteenName: c.name
      });
    });
  });

  // Render navigation and menu sections
  const navLinks = $("#navLinks");
  const sectionsRoot = $("#canteenSections");

  function renderNavAndSections() {
    CANTEENS.forEach((c, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-link";
      btn.dataset.target = "kantin-" + c.id;
      btn.setAttribute("role", "tab");
      btn.textContent = c.name;
      btn.addEventListener("click", () => activateSection(c.id, true));
      navLinks.appendChild(btn);

      const section = document.createElement("section");
      section.className = "canteen-section";
      section.id = "kantin-" + c.id;

      const hero = document.createElement("header");
      hero.className = "section-hero";
      hero.innerHTML =
        '<img class="section-hero-image" src="' + escapeHtml(c.items[0].img) + '" alt="" aria-hidden="true" />' +
        '<div class="store-avatar" aria-hidden="true">' +
          '<img class="store-mark" src="' + escapeHtml(c.logoImage) + '" alt="" />' +
          '<span class="store-name-badge">' + escapeHtml(c.name) + '</span>' +
        '</div>' +
        '<div class="hero-copy">' +
          '<p class="hero-eyebrow">Pilihan kantin sekolah</p>' +
          '<h2 id="kantin-title-' + escapeHtml(c.id) + '">' + escapeHtml(c.name) + '</h2>' +
          '<p class="hero-description">' + escapeHtml(c.sub) + '</p>' +
        '</div>';
      hero.setAttribute("aria-labelledby", "kantin-title-" + c.id);
      section.appendChild(hero);

      const head = document.createElement("div");
      head.className = "section-heading";
      head.innerHTML =
        '<div><p class="section-kicker">Lagi tersedia</p><h3>Menu untuk kamu</h3></div>' +
        '<span class="count">' + c.items.length + " pilihan</span>";
      section.appendChild(head);

      const grid = document.createElement("div");
      grid.className = "grid";
      c.items.forEach((it, i) => {
        grid.appendChild(buildCard(c.id + "-" + i));
      });
      section.appendChild(grid);

      sectionsRoot.appendChild(section);

      if (idx === 0) btn.classList.add("active");
    });
    $("#kantin-" + CANTEENS[0].id).classList.add("active");
  }

  function buildCard(id) {
    const item = itemIndex.get(id);
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.itemId = id;

    const media = document.createElement("div");
    media.className = "card-media";
    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.name;
    img.loading = "lazy";
    media.appendChild(img);

    const body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML =
      '<p class="card-name">' + escapeHtml(item.name) + "</p>" +
      '<p class="card-price">' + formatRp(item.price) + "</p>";

    const foot = document.createElement("div");
    foot.className = "card-foot";
    body.appendChild(foot);
    card.appendChild(media);
    card.appendChild(body);

    card.addEventListener("click", (e) => {
      if (e.target.closest(".card-foot")) return;
      if ((cart.get(id) || 0) === 0) addItem(id, 1);
      openSheet();
    });

    renderCardFoot(id, foot);
    return card;
  }

  function renderCardFoot(id, foot) {
    const item = itemIndex.get(id);
    const qty = cart.get(id) || 0;
    foot.innerHTML = "";
    if (qty <= 0) {
      const add = document.createElement("button");
      add.type = "button";
      add.className = "card-add";
      add.textContent = "Tambah";
      add.addEventListener("click", (e) => {
        e.stopPropagation();
        addItem(id, 1);
        openSheet();
      });
      foot.appendChild(add);
    } else {
      const wrap = document.createElement("div");
      wrap.className = "stepper";
      wrap.innerHTML =
        '<button type="button" data-step="-1" aria-label="Kurangi ' + escapeHtml(item.name) + '">&minus;</button>' +
        '<span class="qty">' + qty + "</span>" +
        '<button type="button" data-step="1" aria-label="Tambah ' + escapeHtml(item.name) + '">+</button>';
      wrap.addEventListener("click", (e) => {
        e.stopPropagation();
        const stepBtn = e.target.closest("[data-step]");
        if (!stepBtn) return;
        addItem(id, Number(stepBtn.dataset.step));
      });
      foot.appendChild(wrap);
    }
  }

  function refreshAllCards() {
    $$(".card").forEach((card) => {
      const foot = $(".card-foot", card);
      if (foot) renderCardFoot(card.dataset.itemId, foot);
    });
  }

  // Section switching
  function activateSection(canteenId, scroll) {
    if (!CANTEENS.some((canteen) => canteen.id === canteenId)) return;

    $$(".canteen-section").forEach((s) => s.classList.remove("active"));
    const section = $("#kantin-" + canteenId);
    if (section) section.classList.add("active");

    $$(".nav-link").forEach((b) => {
      const on = b.dataset.target === "kantin-" + canteenId;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });

    if (scroll) {
      const y = $(".content").offsetTop - 12;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
    try {
      history.replaceState(null, "", "#kantin-" + canteenId);
    } catch (e) {
      location.hash = "kantin-" + canteenId;
    }
  }

  // Shopping cart
  function addItem(id, delta) {
    const item = itemIndex.get(id);
    if (!item) return;
    const next = (cart.get(id) || 0) + delta;
    if (next <= 0) cart.delete(id);
    else cart.set(id, next);

    refreshAllCards();
    if (cart.size === 0) hideSheet();
    else if (!$("#sheetWrap").hidden) renderSheet();
    if (!$("#payWrap").hidden) renderPayList();
  }

  function cartCount() {
    let n = 0;
    cart.forEach((q) => (n += q));
    return n;
  }

  function cartTotal() {
    let t = 0;
    cart.forEach((q, id) => (t += q * itemIndex.get(id).price));
    return t;
  }

  function clearCart() {
    cart.clear();
    refreshAllCards();
    hideSheet();
    renderSheet();
  }

  // Cart sheet
  const sheetWrap = $("#sheetWrap");
  const sheet = $("#bottomSheet");
  const sheetBody = $("#sheetBody");
  const sheetToggle = $("#sheetToggle");

  function expandSheet() {
    sheet.classList.remove("collapsed");
    sheetToggle.setAttribute("aria-expanded", "true");
  }

  function collapseSheet() {
    sheet.classList.add("collapsed");
    sheetToggle.setAttribute("aria-expanded", "false");
  }

  function toggleSheet() {
    if (sheet.classList.contains("collapsed")) expandSheet();
    else collapseSheet();
  }

  function openSheet() {
    if (cart.size === 0) return;
    renderSheet();
    const wasHidden = sheetWrap.hidden;
    sheetWrap.hidden = false;
    document.body.classList.add("cart-active");
    if (wasHidden) expandSheet();
  }

  function hideSheet() {
    sheetWrap.hidden = true;
    document.body.classList.remove("cart-active");
  }

  function renderSheet() {
    sheetBody.innerHTML = "";
    $("#sheetCount").textContent = cartCount() + " item";

    if (cart.size === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-cart";
      empty.innerHTML = '<span class="emoji">🛒</span>Keranjang masih kosong.<br />Pilih menu di katalog dulu ya.';
      sheetBody.appendChild(empty);
      $("#sheetTotal").textContent = formatRp(0);
      $("#sheetPay").disabled = true;
      return;
    }

    cart.forEach((qty, id) => {
      const item = itemIndex.get(id);
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML =
        '<img class="cart-thumb" src="' + item.img + '" alt="' + escapeHtml(item.name) + '" />' +
        '<div class="cart-info">' +
        "<h4>" + escapeHtml(item.name) + "</h4>" +
        '<p class="cart-origin">Dari ' + escapeHtml(item.canteenName) + "</p>" +
        '<p class="cart-unit">' + formatRp(item.price) + " / item</p>" +
        '<p class="cart-sub">Subtotal: ' + formatRp(item.price * qty) + "</p>" +
        "</div>" +
        '<div class="cart-stepper">' +
        '<button type="button" data-id="' + id + '" data-step="-1" aria-label="Kurangi">&minus;</button>' +
        '<span class="qty">' + qty + "</span>" +
        '<button type="button" data-id="' + id + '" data-step="1" aria-label="Tambah">+</button>' +
        "</div>";
      sheetBody.appendChild(row);
    });

    sheetBody.querySelectorAll(".cart-stepper button").forEach((b) => {
      b.addEventListener("click", () => addItem(b.dataset.id, Number(b.dataset.step)));
    });

    $("#sheetTotal").textContent = formatRp(cartTotal());
    $("#sheetPay").disabled = false;
  }

  let sheetDragging = false;
  let sheetStartY = 0;
  let sheetDelta = 0;

  function onSheetDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    sheetDragging = true;
    sheetStartY = e.clientY;
    sheetDelta = 0;
    sheet.style.transition = "none";
    try { sheetToggle.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
  }

  function onSheetMove(e) {
    if (!sheetDragging) return;
    sheetDelta = e.clientY - sheetStartY;
    const dy = Math.max(0, sheetDelta);
    sheet.style.transform = "translateY(" + dy + "px)";
  }

  function onSheetUp() {
    if (!sheetDragging) return;
    sheetDragging = false;
    sheet.style.transition = "";
    sheet.style.transform = "";
    if (Math.abs(sheetDelta) < 6) {
      toggleSheet();
    } else if (sheetDelta > 60) {
      collapseSheet();
    } else if (sheetDelta < -50) {
      expandSheet();
    }
  }

  // Payment dialog
  const payWrap = $("#payWrap");

  function openPay() {
    if (cart.size === 0) return;
    renderPayList();
    $("#payError").hidden = true;
    $$('input[name="payMethod"]').forEach((r) => (r.checked = false));
    payWrap.hidden = false;
    syncScrollLock();
    $("#payConfirm").focus();
  }

  function closePay() {
    payWrap.hidden = true;
    syncScrollLock();
  }

  function renderPayList() {
    const list = $("#payList");
    list.innerHTML = "";
    cart.forEach((qty, id) => {
      const item = itemIndex.get(id);
      const row = document.createElement("div");
      row.className = "pay-row";
      row.innerHTML =
        '<div><span class="pay-name">' + escapeHtml(item.name) + "</span>" +
        '<span class="pay-origin">Dari ' + escapeHtml(item.canteenName) + "</span>" +
        '<span class="pay-qty">' + qty + " x " + formatRp(item.price) + "</span></div>" +
        '<span class="pay-amt">' + formatRp(item.price * qty) + "</span>";
      list.appendChild(row);
    });
    $("#payTotal").textContent = formatRp(cartTotal());
  }

  function confirmPay() {
    const picked = $('input[name="payMethod"]:checked');
    if (!picked) {
      $("#payError").hidden = false;
      return;
    }
    $("#payError").hidden = true;
    closePay();
    clearCart();
    showToast("Pembayaran telah selesai. Terima kasih! 🎉");
  }

  // Account panel
  const accountPanel = $("#accountPanel");
  const overlay = $("#overlay");
  const feedbackToggle = $("#feedbackToggle");
  const feedbackWrap = $("#feedbackFormWrap");

  function setFeedbackOpen(open) {
    if (!feedbackToggle || !feedbackWrap) return;
    feedbackWrap.classList.toggle("open", open);
    feedbackToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function getAccount() {
    let name = storage.get("pojokteras.name") || "Chrystian";
    let id = storage.get("pojokteras.id");
    let idOwner = storage.get("pojokteras.idOwner");
    if (!id || idOwner !== name) {
      id = String(Math.floor(100 + Math.random() * 900));
      storage.set("pojokteras.id", id);
      storage.set("pojokteras.idOwner", name);
    }
    return { name, id };
  }

  function applyAccount() {
    const acc = getAccount();
    $("#accountName").textContent = acc.name;
    $("#accountId").textContent = acc.id;
    $("#accountAvatar").textContent = (acc.name.trim()[0] || "?").toUpperCase();
  }

  function openPanel() {
    applyAccount();
    accountPanel.classList.add("open");
    accountPanel.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
    $("#hamburger").setAttribute("aria-expanded", "true");
    syncScrollLock();
  }

  function closePanel() {
    accountPanel.classList.remove("open");
    accountPanel.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    $("#hamburger").setAttribute("aria-expanded", "false");
    syncScrollLock();
  }

  function syncScrollLock() {
    const locked = !payWrap.hidden || accountPanel.classList.contains("open");
    document.body.style.overflow = locked ? "hidden" : "";
  }

  // Toast notifications
  let toastTimer = null;
  function showToast(msg) {
    const toast = $("#toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  // Color theme
  function initTheme() {
    const stored = storage.get("pojokteras.theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    storage.set("pojokteras.theme", next);
  }

  // Event handlers
  function wire() {
    $("#themeToggle").addEventListener("click", toggleTheme);

    $("#hamburger").addEventListener("click", () => {
      if (accountPanel.classList.contains("open")) closePanel();
      else openPanel();
    });
    $("#panelClose").addEventListener("click", closePanel);
    overlay.addEventListener("click", closePanel);

    if (feedbackToggle) {
      feedbackToggle.addEventListener("click", () => {
        setFeedbackOpen(!feedbackWrap.classList.contains("open"));
      });
    }

    $("#brandBtn").addEventListener("click", () => {
      activateSection(CANTEENS[0].id, true);
    });

    sheetToggle.addEventListener("pointerdown", onSheetDown);
    sheetToggle.addEventListener("pointermove", onSheetMove);
    sheetToggle.addEventListener("pointerup", onSheetUp);
    sheetToggle.addEventListener("pointercancel", onSheetUp);
    $("#sheetPay").addEventListener("click", openPay);

    $("#payClose").addEventListener("click", closePay);
    $("#payCancel").addEventListener("click", closePay);
    $("#payBackdrop").addEventListener("click", closePay);
    $("#payConfirm").addEventListener("click", confirmPay);
    $$('input[name="payMethod"]').forEach((r) =>
      r.addEventListener("change", () => ($("#payError").hidden = true))
    );

    $("#feedbackForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const name = $("#fbName").value.trim();
      const topic = $("#fbTopic").value.trim();
      const msg = $("#fbMessage").value.trim();
      if (!name || !topic || !msg) {
        showToast("Mohon isi semua kolom feedback.");
        return;
      }
      form.reset();
      closePanel();
      showToast("Feedback terkirim. Terima kasih, " + name + "!");
    });

    $("#footerFeedback").addEventListener("click", (e) => {
      e.preventDefault();
      openPanel();
      setFeedbackOpen(true);
      setTimeout(() => $("#fbName").focus(), 320);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!payWrap.hidden) closePay();
      else if (accountPanel.classList.contains("open")) closePanel();
      else if (!sheetWrap.hidden) collapseSheet();
    });
  }

  // Start the app
  function init() {
    initTheme();
    applyAccount();
    renderNavAndSections();
    wire();

    const hash = (location.hash || "").replace("#kantin-", "");
    if (hash && CANTEENS.some((c) => c.id === hash)) activateSection(hash, false);

    $("#year").textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
