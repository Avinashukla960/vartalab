/* ============================================================
   VARTALAB — app.js (shared engine for every page)
   - user state in localStorage (rating, lessons, weak areas…)
   - shared navbar + footer injection
   - toasts, confetti, modals, page transitions
   - shared renderers: leaderboard, video cards, paper cards,
     countdown, progress ring, avatar stack, etc.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- tiny DOM helper ---------- */
  function el(html) {
    const t = document.createElement("div");
    t.innerHTML = html.trim();
    return t.firstElementChild;
  }

  /* ---------- lucide icon helper (inline SVG, works offline) ---------- */
  const ICON_PATHS = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    "book-open": '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    "file-text": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    "clipboard-list": '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
    layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    "zap": '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "arrow-left": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    "check-circle": '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
    "x-circle": '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    "info": '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    crown: '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.735H5.81a1 1 0 0 1-.957-.735L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    "timer": '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
    "calendar": '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    "trending-up": '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    "trending-down": '<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    "send": '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    "globe": '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    "share-2": '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
    "youtube": '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
    "sparkles": '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
    "message-circle": '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    "heart": '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    "mic": '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
    "compass": '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    "award": '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    "refresh": '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    "flag": '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
    "coffee": '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',
    "settings": '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    "external-link": '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    "log-out": '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    "log-in": '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/>',
    "eye": '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    "eye-off": '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
    "shield": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    "graduation-cap": '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    "dumbbell": '<path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/>',
  };
  function icon(name, size) {
    const p = ICON_PATHS[name] || ICON_PATHS.info;
    size = size || 18;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  }

  /* ---------- storage ---------- */
  const LS_KEY = "vartalab_state_v1";
  const SESSION_KEY = "vartalab_session";
  const state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        // shallow-merge over the pristine DB user so new fields always exist
        const merged = Object.assign({}, DB.currentUser, saved.user || {});
        DB.currentUser = merged;
        return { user: merged };
      }
    } catch (e) { /* corrupted storage — fall through to defaults */ }
    return { user: DB.currentUser };
  }

  function saveState() {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ user: DB.currentUser })); } catch (e) { /* storage full/blocked */ }
  }

  /* ---------- auth (demo login) ---------- */
  const DEMO_EMAIL = "demo@vartalab.com";
  const DEMO_PASSWORD = "demo1234";

  function isLoggedIn() {
    try { return localStorage.getItem(SESSION_KEY) === "1"; }
    catch (e) { return false; }
  }
  function login(email, password) {
    if (String(email || "").trim().toLowerCase() === DEMO_EMAIL && String(password || "") === DEMO_PASSWORD) {
      try { localStorage.setItem(SESSION_KEY, "1"); } catch (e) { /* ignore */ }
      return true;
    }
    return false;
  }
  function logout() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
  }

  /* Redirect unauthenticated visitors away from app pages to the login screen.
     Public pages: landing, login, about. */
  function authGuard() {
    const current = (location.pathname.split("/").pop() || "index.html").split("?")[0];
    const PUBLIC = ["index.html", "login.html", "about.html"];
    if (!isLoggedIn() && PUBLIC.indexOf(current) === -1) {
      const dest = "login.html?next=" + encodeURIComponent(current);
      try { location.replace(dest); } catch (e) { location.href = dest; }
    }
  }

  /* ---------- toasts ---------- */
  let toastWrap = null;
  function toast(msg, type, title) {
    if (!toastWrap) {
      toastWrap = el('<div class="toast-wrap"></div>');
      document.body.appendChild(toastWrap);
    }
    const icons = { success: "check-circle", info: "info", error: "alert" };
    const t = el(
      '<div class="toast ' + (type || "info") + '">' +
        '<span class="t-icon">' + icon(icons[type] || "info", 20) + "</span>" +
        '<div><div class="t-title">' + (title || "") + "</div>" +
        "<div>" + msg + "</div></div></div>"
    );
    toastWrap.appendChild(t);
    setTimeout(function () {
      t.classList.add("out");
      setTimeout(function () { t.remove(); }, 320);
    }, 3600);
  }
  window.showToast = toast;

  /* ---------- confetti ---------- */
  let confettiCanvas = null, confettiCtx = null, confettiPieces = [], confettiRAF = null;
  function launchConfetti() {
    if (!confettiCanvas) {
      confettiCanvas = document.createElement("canvas");
      confettiCanvas.id = "confettiCanvas";
      document.body.appendChild(confettiCanvas);
      confettiCtx = confettiCanvas.getContext("2d");
    }
    function resize() {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    const colors = ["#fafafa", "#d4d4d8", "#a1a1aa", "#71717a", "#ffffff", "#e4e4e7"];
    for (let i = 0; i < 130; i++) {
      confettiPieces.push({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * confettiCanvas.height * 0.4,
        w: 6 + Math.random() * 7,
        h: 8 + Math.random() * 8,
        c: colors[Math.floor(Math.random() * colors.length)],
        vy: 2 + Math.random() * 3.2,
        vx: -1.6 + Math.random() * 3.2,
        rot: Math.random() * Math.PI,
        vr: -0.12 + Math.random() * 0.24,
      });
    }
    function frame() {
      if (!confettiCtx) { confettiPieces = []; return; }
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      let alive = false;
      confettiPieces.forEach(function (p) {
        p.y += p.vy; p.x += p.vx; p.rot += p.vr;
        if (p.y < confettiCanvas.height + 30) alive = true;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.rot);
        confettiCtx.fillStyle = p.c;
        confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        confettiCtx.restore();
      });
      if (alive) { confettiRAF = requestAnimationFrame(frame); }
      else {
        cancelAnimationFrame(confettiRAF);
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiPieces = [];
      }
    }
    cancelAnimationFrame(confettiRAF);
    frame();
  }
  window.launchConfetti = launchConfetti;

  /* ---------- modal ---------- */
  function openModal(htmlContent) {
    closeModal();
    const ov = el(
      '<div class="modal-overlay show"><div class="modal" role="dialog" aria-modal="true"></div></div>'
    );
    const m = ov.querySelector(".modal");
    m.innerHTML = htmlContent;
    ov.addEventListener("click", function (e) { if (e.target === ov) closeModal(); });
    document.body.appendChild(ov);
    const esc = function (e) { if (e.key === "Escape") { closeModal(); document.removeEventListener("keydown", esc); } };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return m;
  }
  function closeModal() {
    const ov = document.querySelector(".modal-overlay");
    if (ov) ov.remove();
    document.body.style.overflow = "";
  }
  window.openModal = openModal;
  window.closeModal = closeModal;

  /* ---------- demo user pill (only when authenticated) ---------- */
  function demoPill() {
    if (!isLoggedIn()) return;
    const pill = el(
      '<button class="demo-pill" title="Demo student — state is saved in this browser (localStorage)">' +
        '<span class="dot"></span><span class="avatar avatar-sm">' + DB.currentUser.avatar + "</span>" +
        "<span>Logged in as <b>" + esc(DB.currentUser.name) + "</b> · Demo</span>" +
        '<span class="d-x" data-x title="Dismiss">' + icon("x", 14) + "</span></button>"
    );
    pill.addEventListener("click", function (e) {
      if (e.target.closest("[data-x]")) { pill.remove(); return; }
      location.href = "profile.html";
    });
    document.body.appendChild(pill);
  }

  /* ---------- escape html ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  window.esc = esc;

  /* ---------- navigation ---------- */
  const NAV_ITEMS = [
    { href: "index.html", label: "Home", icon: "home" },
    { href: "learn.html", label: "Learn", icon: "book-open" },
    { href: "videos.html", label: "Videos", icon: "youtube" },
    { href: "papers.html", label: "Papers", icon: "file-text" },
    { href: "assessments.html", label: "Assessments", icon: "clipboard-list" },
    { href: "flashcards.html", label: "Flashcards", icon: "layers" },
    { href: "arena.html", label: "IELTS Arena", icon: "trophy" },
    { href: "leaderboard.html", label: "Leaderboard", icon: "trending-up" },
    { href: "colab.html", label: "CO-LAB", icon: "users" },
    { href: "actlab.html", label: "ACT-LAB", icon: "mic" },
    { href: "profile.html", label: "Profile", icon: "user" },
    { href: "about.html", label: "About", icon: "info" },
  ];

  function buildNav() {
    const current = location.pathname.split("/").pop() || "index.html";
    const links = NAV_ITEMS.map(function (n) {
      return '<a href="' + n.href + '" class="' + (n.href === current ? "active" : "") + '">' + icon(n.icon, 16) + " " + n.label + "</a>";
    }).join("");

    const mmLinks = NAV_ITEMS.map(function (n) {
      return '<a href="' + n.href + '" class="' + (n.href === current ? "active" : "") + '">' +
        '<span class="mm-ico" style="display:inline-flex;color:var(--' + (n.href === current ? "accent-3" : "dim") + ')">' + icon(n.icon, 18) + "</span>" + n.label + "</a>";
    }).join("");

    const u = DB.currentUser;
    const loggedIn = isLoggedIn();
    // Wrap the header + overlay + drawer in one container so el() (which
    // returns a single element) keeps all three siblings reachable.
    const nav = el(
      "<div>" +
      '<header class="nav">' +
        '<div class="wrap nav-inner">' +
          '<a class="brand" href="index.html"><span class="brand-mark">V</span><span>VARTA<small>LAB</small></span></a>' +
          '<nav class="nav-links">' + links + "</nav>" +
          '<div class="nav-right">' +
            (loggedIn
              ? '<span class="stat-pill gold" title="Rating">' + icon("zap", 14) + " " + u.rating + "</span>" +
                '<span class="stat-pill orange" title="Day streak">' + icon("flame", 14) + " " + u.streak + "</span>" +
                '<span class="stat-pill cyan" title="Rank">#' + u.rank + "</span>" +
                '<a class="btn btn-primary btn-sm nav-cta" href="learn.html">' + icon("book-open", 15) + " Dashboard</a>" +
                '<a class="btn btn-ghost btn-sm nav-user" href="profile.html" title="Profile"><span class="avatar avatar-sm">' + u.avatar + "</span></a>"
              : '<a class="btn btn-primary btn-sm nav-cta" href="login.html">' + icon("user", 15) + " Sign in</a>" +
                '<a class="btn btn-ghost btn-sm nav-user" href="login.html">Get started</a>') +
            '<button class="nav-burger" aria-label="Open menu">' + icon("menu", 20) + "</button>" +
          "</div>" +
        "</div>" +
      "</header>" +
      '<div class="menu-overlay" data-overlay></div>' +
      '<aside class="mobile-menu" data-menu>' +
        '<div class="mm-head"><a class="brand" href="index.html"><span class="brand-mark">V</span><span>VARTA<small>LAB</small></span></a>' +
        '<button class="modal-close" data-close aria-label="Close menu">' + icon("x", 18) + "</button></div>" +
        (loggedIn
          ? '<div class="mm-user flex" style="padding:12px;border:1px solid var(--border);border-radius:10px;background:rgba(255,255,255,.03);margin-bottom:14px">' +
              '<span class="avatar">' + u.avatar + "</span>" +
              '<div class="grow"><b style="font-size:.92rem">' + esc(u.name) + "</b><br><span class='text-xs' style='color:var(--muted)'>" +
              esc(u.goal) + " · Level " + esc(u.selfLevel) + ' · ' + icon("zap", 12) + ' ' + u.rating + "</span></div>" +
              '<a href="profile.html" class="btn btn-ghost btn-sm">' + icon("user", 14) + "</a></div>"
          : '<a href="login.html" class="btn btn-primary btn-block mb-2" style="margin-bottom:14px">' + icon("user", 15) + " Sign in</a>") +
        '<nav class="mm-links">' + mmLinks + "</nav>" +
        '<div class="mm-foot text-xs dim">' +
          (loggedIn
            ? '<button class="btn btn-ghost btn-sm btn-block" data-logout>' + icon("log-out", 14) + " Log out</button>"
            : "VARTALAB demo · sign in with demo credentials to continue") +
        "</div>" +
      "</aside>" +
      "</div>"
    );

    const overlay = nav.querySelector("[data-overlay]");
    const menu = nav.querySelector("[data-menu]");
    const burger = nav.querySelector(".nav-burger");

    function openMenu() { menu.classList.add("open"); overlay.classList.add("show"); }
    function closeMenu() { menu.classList.remove("open"); overlay.classList.remove("show"); }
    burger.addEventListener("click", openMenu);
    overlay.addEventListener("click", closeMenu);
    nav.querySelector("[data-close]").addEventListener("click", closeMenu);
    const logoutBtn = nav.querySelector("[data-logout]");
    if (logoutBtn) logoutBtn.addEventListener("click", function () {
      logout();
      location.href = "login.html";
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { if (!a.classList.contains("active")) closeMenu(); });
    });

    document.body.insertBefore(nav, document.body.firstChild);
  }

  /* ---------- footer ---------- */
  function buildFooter() {
    const foot = el(
      '<footer class="footer">' +
        '<div class="wrap">' +
          '<div class="footer-grid">' +
            '<div>' +
              '<a class="brand" href="index.html"><span class="brand-mark">V</span><span>VARTA<b style="color:var(--cyan)">LAB</b></span></a>' +
              '<p class="text-sm muted" style="margin-top:14px;max-width:300px">Learn · CO-LAB · ACT-LAB — a student-focused English practice platform. Build your English, practise with confidence, see your progress.</p>' +
              '<div class="socials">' +
                '<a href="#" aria-label="YouTube" onclick="return false">' + icon("youtube", 18) + "</a>" +
                '<a href="#" aria-label="Twitter" onclick="return false">' + icon("share-2", 18) + "</a>" +
                '<a href="#" aria-label="Instagram" onclick="return false">' + icon("heart", 18) + "</a>" +
                '<a href="#" aria-label="LinkedIn" onclick="return false">' + icon("users", 18) + "</a>" +
              "</div>" +
            "</div>" +
            '<div><h4>Product</h4><ul class="footer-links">' +
              '<li><a href="learn.html">Learn</a></li>' +
              '<li><a href="videos.html">Videos</a></li>' +
              '<li><a href="papers.html">Papers</a></li>' +
              '<li><a href="assessments.html">Assessments</a></li>' +
              '<li><a href="arena.html">IELTS Arena</a></li>' +
            "</ul></div>" +
            '<div><h4>Community</h4><ul class="footer-links">' +
              '<li><a href="colab.html">CO-LAB</a></li>' +
              '<li><a href="actlab.html">ACT-LAB</a></li>' +
              '<li><a href="leaderboard.html">Leaderboard</a></li>' +
              '<li><a href="flashcards.html">Flashcards</a></li>' +
            "</ul></div>" +
            '<div><h4>Company</h4><ul class="footer-links">' +
              '<li><a href="about.html">About</a></li>' +
              '<li><a href="about.html#contact">Contact</a></li>' +
              '<li><a href="about.html#terms" onclick="return false">Terms</a></li>' +
              '<li><a href="about.html#privacy" onclick="return false">Privacy</a></li>' +
            "</ul></div>" +
          "</div>" +
          '<div class="footer-bottom">' +
            "<span>© 2026 VARTALAB · Built for a hackathon demo. All practice content is illustrative.</span>" +
            "<span>Made with 💜 for English learners in India</span>" +
          "</div>" +
        "</div>" +
      "</footer>"
    );
    document.body.appendChild(foot);
  }

  /* ---------- page shell ---------- */
  function pageReady() {
    authGuard();          // app pages require a session
    buildNav();
    buildFooter();
    demoPill();
    // entrance animation
    const main = document.querySelector("main") || document.body;
    main.classList.add("page-enter");
    saveState();
  }

  /* ============================================================
     Shared renderers (used across pages)
     ============================================================ */

  /* Skill badge color mapping */
  function skillBadge(skill) {
    const map = {
      Tense: "accent", Articles: "cyan", Prepositions: "green",
      Vocabulary: "pink", Speaking: "amber", Writing: "accent",
      Mixed: "cyan", Reading: "green", Interview: "amber",
    };
    return '<span class="badge badge-' + (map[skill] || "dim") + '">' + esc(skill) + "</span>";
  }
  window.skillBadge = skillBadge;

  /* Difficulty badge */
  function diffBadge(d) {
    const c = d === "Easy" ? "green" : d === "Medium" ? "amber" : "red";
    return '<span class="badge badge-' + c + '">' + esc(d) + "</span>";
  }
  window.diffBadge = diffBadge;

  /* Leaderboard list (takes a sorted array) */
  function renderLeaderboard(list, highlightMe) {
    return list.map(function (u, i) {
      const rank = i + 1;
      const rankCls = rank === 1 ? "rank-1" : rank === 2 ? "rank-2" : rank === 3 ? "rank-3" : "";
      const crown = rank <= 3 ? icon("crown", 16) : "";
      const me = u.isMe || (u.name === DB.currentUser.name);
      return (
        '<div class="leader-row' + (me && highlightMe ? " me" : "") + '">' +
          '<span class="rank-num ' + rankCls + '">' + (rank <= 3 ? crown + " " : "") + rank + "</span>" +
          '<span class="avatar avatar-sm">' + (u.avatar || "🙂") + "</span>" +
          '<b class="name">' + esc(u.name) + (me ? ' <span class="badge badge-accent" style="padding:1px 8px;font-size:.64rem">YOU</span>' : "") + "</b>" +
          '<span class="rating-val">' + u.rating + "</span>" +
          '<span class="points-val">' + (u.points || (u.rating * 0.4).toFixed(0)) + " pts</span>" +
        "</div>"
      );
    }).join("");
  }
  window.renderLeaderboard = renderLeaderboard;

  /* Video card */
  function videoCard(v) {
    return (
      '<div class="card card-hover vid-card reveal-item">' +
        '<div class="vid-thumb">' +
          '<img src="https://i.ytimg.com/vi/' + v.youtubeId + '/hqdefault.jpg" alt="' + esc(v.title) + '" loading="lazy" onerror="this.style.display=\'none\'">' +
          '<div class="vid-play" data-watch="' + v.youtubeId + '"><span class="play-btn">' + icon("play", 22) + "</span></div>" +
          '<span class="vid-dur">' + esc(v.duration) + "</span>" +
        "</div>" +
        '<div class="mt-2 flex flex-between gap-1">' + skillBadge(v.skill) + '<span class="text-xs dim">' + icon("youtube", 12) + " " + esc(v.channel) + "</span></div>" +
        '<b style="display:block;margin-top:8px;font-size:.95rem">' + esc(v.title) + "</b>" +
        '<div class="mt-2 flex" style="gap:8px">' +
          '<button class="btn btn-primary btn-sm" data-watch="' + v.youtubeId + '">' + icon("play", 14) + " Watch</button>" +
          '<button class="btn btn-ghost btn-sm" data-quiz="' + v.skill + '">' + icon("book-open", 14) + " Take quiz</button>" +
        "</div>" +
      "</div>"
    );
  }
  window.videoCard = videoCard;

  /* Paper card */
  function paperCard(p) {
    return (
      '<div class="card card-hover reveal-item">' +
        '<div class="flex flex-between"><span class="badge badge-accent">' + esc(p.exam) + "</span>" +
        '<span class="badge badge-dim">' + esc(p.type) + "</span></div>" +
        '<h3 class="mt-2" style="font-size:1rem;min-height:2.6em">' + esc(p.title) + "</h3>" +
        '<div class="flex text-sm muted" style="gap:14px;flex-wrap:wrap">' +
          '<span>' + icon("clipboard-list", 14) + " " + p.questions + " questions</span>" +
          '<span>' + icon("clock", 14) + " " + esc(p.time) + "</span>" +
        "</div>" +
        '<div class="mt-3 flex" style="gap:8px">' +
          '<button class="btn btn-ghost btn-sm grow" data-view="' + p.id + '">' + icon("eye", 14) + " View sample</button>" +
          '<button class="btn btn-primary btn-sm" data-attempt="' + p.id + '">' + icon("target", 14) + " Attempt</button>" +
        "</div>" +
      "</div>"
    );
  }
  window.paperCard = paperCard;

  /* YouTube modal player */
  function openVideo(id) {
    openModal(
      '<h3 class="flex" style="gap:10px">' + icon("youtube", 22) + " Watch on YouTube</h3>" +
        '<p class="muted text-sm">This opens the real YouTube video in a new tab (demo-friendly).</p>' +
        '<div class="flex" style="gap:10px;margin-top:8px">' +
          '<a class="btn btn-primary" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=' + encodeURIComponent(id) + '">' + icon("youtube", 16) + " Open video</a>" +
          '<button class="btn btn-ghost" data-close-modal>' + icon("x", 16) + " Close</button>" +
        "</div>"
    );
    document.querySelector("[data-close-modal]").addEventListener("click", closeModal);
  }
  window.openVideo = openVideo;

  /* Progress ring (SVG) */
  function progressRing(pct, size, label, sub) {
    size = size || 150;
    const stroke = 12;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const off = c * (1 - Math.min(100, Math.max(0, pct)) / 100);
    const gradId = "ringGrad" + Math.floor(Math.random() * 1e6);
    return (
      '<div class="ring-wrap" style="width:' + size + "px;height:" + size + 'px">' +
        '<svg width="' + size + '" height="' + size + '">' +
          '<defs><linearGradient id="' + gradId + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="#6d5cff"/><stop offset="55%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#22d3ee"/>' +
          "</linearGradient></defs>" +
          '<circle class="ring-bg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '" fill="none"/>' +
          '<circle class="ring-fg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '" fill="none" stroke="url(#' + gradId + ')" stroke-dasharray="' + c + '" stroke-dashoffset="' + c + '" data-off="' + off + '"/>' +
        "</svg>" +
        '<div class="ring-label"><b style="font-size:1.5rem">' + label + "</b><span class='text-xs dim'>" + sub + "</span></div>" +
      "</div>"
    );
  }
  window.progressRing = progressRing;

  function animateRings() {
    requestAnimationFrame(function () {
      setTimeout(function () {
        document.querySelectorAll(".ring-fg[data-off]").forEach(function (c) {
          c.style.strokeDashoffset = c.getAttribute("data-off");
        });
      }, 120);
    });
  }
  window.animateRings = animateRings;

  /* Avatar stack (community previews) */
  function avatarStack(avatars, extra) {
    const inner = avatars.map(function (a) {
      return '<span class="avatar avatar-sm" style="border:2px solid var(--card);margin-left:-10px">' + a + "</span>";
    }).join("");
    const extraEl = extra
      ? '<span class="avatar avatar-sm" style="border:2px solid var(--card);margin-left:-10px;background:#2a3450;font-size:.7rem;color:var(--muted)">+' + extra + "</span>"
      : "";
    return '<span class="flex" style="gap:0">' + inner + extraEl + "</span>";
  }
  window.avatarStack = avatarStack;

  /* Live countdown to next contest (Sunday 6 PM, per DB) */
  function nextContestDate(offsetHours) {
    const c = DB.contests[0];
    const now = new Date();
    const d = new Date(now);
    d.setHours(c.contestHour, c.contestMinute, 0, 0);
    let diff = (c.contestDay - now.getDay() + 7) % 7;
    if (diff === 0 && d.getTime() <= now.getTime()) diff = 7;
    d.setDate(now.getDate() + diff);
    if (offsetHours) d = new Date(d.getTime() + offsetHours * 3600 * 1000);
    return d;
  }
  window.nextContestDate = nextContestDate;

  /* Countdown cell block */
  function countdownHTML(ms) {
    ms = Math.max(0, ms);
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return (
      '<div class="countdown-big">' +
        '<div class="count-cell"><b data-cd="d">' + pad(d) + "</b><span>Days</span></div>" +
        '<div class="count-cell"><b data-cd="h">' + pad(h) + "</b><span>Hours</span></div>" +
        '<div class="count-cell"><b data-cd="m">' + pad(m) + "</b><span>Mins</span></div>" +
        '<div class="count-cell"><b data-cd="s">' + pad(sec) + "</b><span>Secs</span></div>" +
      "</div>"
    );
  }
  function pad(n) { return String(n).padStart(2, "0"); }
  window.countdownHTML = countdownHTML;

  /* Tick a live countdown container */
  function tickCountdown(container, targetDate, onZero) {
    container.setAttribute("data-cd-target", targetDate.getTime());
    const fn = function () {
      const t = Number(container.getAttribute("data-cd-target"));
      let ms = t - Date.now();
      if (ms <= 0) {
        container.innerHTML = '<div class="countdown-big"><div class="count-cell"><b>LIVE</b><span>Started</span></div></div>';
        if (onZero) onZero();
        clearInterval(timer);
        return;
      }
      const s = Math.floor(ms / 1000);
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      const dEl = container.querySelector('[data-cd="d"]');
      if (dEl) dEl.textContent = pad(d);
      const hEl = container.querySelector('[data-cd="h"]');
      if (hEl) hEl.textContent = pad(h);
      const mEl = container.querySelector('[data-cd="m"]');
      if (mEl) mEl.textContent = pad(m);
      const sEl = container.querySelector('[data-cd="s"]');
      if (sEl) sEl.textContent = pad(sec);
    };
    fn();
    const timer = setInterval(fn, 1000);
    container._tickTimer = timer;
    return timer;
  }
  window.tickCountdown = tickCountdown;

  /* Generic countdown timer (for assessments/contest) — mm:ss ticking.
     The element is re-queried every tick so it keeps working even when
     the question screen re-renders and replaces the clock node. */
  function startClock(secondsEl, totalSeconds, onDone) {
    let left = totalSeconds;
    const render = function () {
      const el_ = document.getElementById(secondsEl);
      if (!el_) return;
      const m = Math.floor(left / 60);
      const s = left % 60;
      el_.textContent = pad(m) + ":" + pad(s);
      el_.style.color = left <= 60 ? "#f87171" : "";
      if (left <= 10) el_.classList.add("text-red");
    };
    render();
    const timer = setInterval(function () {
      left--;
      render();
      if (left <= 0) { clearInterval(timer); if (onDone) onDone(); }
    }, 1000);
    return timer;
  }
  window.startClock = startClock;

  /* ---------- global delegated interactions ---------- */
  document.addEventListener("click", function (e) {
    const watch = e.target.closest("[data-watch]");
    if (watch) { openVideo(watch.getAttribute("data-watch")); return; }
    const quiz = e.target.closest("[data-quiz]");
    if (quiz) {
      const skill = quiz.getAttribute("data-quiz");
      const lesson = DB.lessons.find(function (l) { return l.skill === skill; });
      if (lesson) location.href = "lesson.html?id=" + lesson.id;
      else { toast("No lesson for this skill yet — try a flashcard session!", "info", "Heads up"); location.href = "flashcards.html"; }
      return;
    }
  });

  /* ---------- boot ---------- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pageReady);
  } else {
    pageReady();
  }

  window.VT = {
    DB: DB, state: state, saveState: saveState, esc: esc, icon: icon, el: el,
    toast: toast, confetti: launchConfetti, openModal: openModal, closeModal: closeModal,
    isLoggedIn: isLoggedIn, login: login, logout: logout,
    DEMO_EMAIL: DEMO_EMAIL, DEMO_PASSWORD: DEMO_PASSWORD,
  };
})();
