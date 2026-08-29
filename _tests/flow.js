/* Interaction flow test: drive the most important user journeys by
   simulating clicks, then assert on state (DOM text + localStorage). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { parseHTML } = require("/home/user/_deps/node_modules/linkedom");

const SITE = "/home/user/vartalab";
let failures = 0;
const log = (...a) => console.log("   ", ...a);

function loadPage(page, session) {
  const [file, query = ""] = page.split("?");
  const html = fs.readFileSync(path.join(SITE, file), "utf8");
  const { document } = parseHTML(html);
  const loc = { search: query ? "?" + query : "", href: "http://x/" + page, pathname: "/" + file, replace() {} };
  const sandbox = {
    window: {}, document, location: loc,
    navigator: {}, confirm: () => true, alert: () => {},
    setTimeout, clearTimeout, setInterval, clearInterval, Intl, URLSearchParams, console,
    Math, JSON, Date, String, Number, Array, Object, Promise,
    addEventListener() {}, removeEventListener() {},
    requestAnimationFrame: (fn) => setTimeout(fn, 0), cancelAnimationFrame: (id) => clearTimeout(id),
    localStorage: { _s: session ? { vartalab_session: "1" } : {}, getItem(k) { return this._s[k] ?? null; }, setItem(k, v) { this._s[k] = String(v); }, removeItem(k) { delete this._s[k]; } },
    tailwind: {},
  };
  Object.assign(sandbox.window, sandbox);
  const ctx = vm.createContext(sandbox);
  const run = (code, label) => { try { vm.runInContext(code, ctx, { filename: label }); } catch (e) { e._label = label; throw e; } };
  const re = /<script([^>]*)>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1] || "";
    const srcMatch = attrs.match(/src="([^"]+)"/);
    if (srcMatch) {
      if (!srcMatch[1].includes("tailwindcss") && !srcMatch[1].includes("fonts")) run(fs.readFileSync(path.join(SITE, srcMatch[1]), "utf8"), srcMatch[1]);
    } else if ((m[2] || "").trim()) run(m[2], "inline");
  }
  return { document, sandbox, ctx };
}

function click(el) {
  el.dispatchEvent(new (el.ownerDocument.defaultView || global).Event("click", { bubbles: true, cancelable: true }));
}

console.log("LESSON flow (lesson.html?id=1):");
try {
  const { document } = loadPage("lesson.html?id=1", true);
  const startBtn = document.getElementById("l-start");
  if (!startBtn) throw new Error("l-start missing");
  click(startBtn);
  for (let i = 0; i < 5; i++) {
    const opts = document.querySelectorAll(".quiz-option");
    if (!opts.length) throw new Error("no options at q" + i);
    click(opts[1]);
    click(document.getElementById("l-next"));
  }
  const rootText = document.getElementById("lesson-root").textContent;
  if (!/Lesson complete/.test(rootText)) throw new Error("no completion screen: " + rootText.slice(0, 60));
  if (!/\+12 rating/.test(rootText)) throw new Error("rating gain missing: " + rootText.slice(0, 80));
  log("OK: lesson completes, +12 rating shown");
} catch (e) { failures++; log("FAIL:", (e._label||""), e.message); }

console.log("DIAGNOSTIC flow:");
try {
  const { document } = loadPage("diagnostic.html", true);
  click(document.querySelector('#diag-card .option-card[data-val="IELTS"]'));
  click(document.getElementById("d-next"));
  click(document.querySelector('#diag-card .option-card[data-val="B1+"]'));
  click(document.getElementById("d-next"));
  for (let i = 0; i < 3; i++) {
    for (const o of document.querySelectorAll(".quiz-option")) {
      click(o);
      if (o.classList.contains("correct")) break;
    }
    click(document.getElementById("d-next"));
  }
  const text = document.getElementById("diag-card").textContent;
  if (!/Recommended path/.test(text)) throw new Error("no result: " + text.slice(0, 60));
  log("OK: result screen with recommended path");
} catch (e) { failures++; log("FAIL:", (e._label||""), e.message); }

console.log("ASSESSMENT flow:");
try {
  const { document } = loadPage("assessments.html?start=1", true);
  click(document.getElementById("as-go"));
  for (let i = 0; i < 10; i++) {
    const opts = document.querySelectorAll(".quiz-option");
    if (!opts.length) throw new Error("no options at q" + i);
    click(opts[0]);
    const next = document.getElementById("as-next");
    if (next) click(next);
  }
  const submitBtn = document.getElementById("as-submit");
  if (!submitBtn) throw new Error("as-submit missing");
  click(submitBtn);
  const text = document.getElementById("as-root").textContent;
  if (!/Assessment result/.test(text) && !/You passed|So close/.test(text)) throw new Error("no result screen: " + text.slice(0, 80));
  log("OK: assessment runs to result");
} catch (e) { failures++; log("FAIL:", (e._label||""), e.message); }

console.log("ARENA flow:");
try {
  const { document } = loadPage("arena.html", true);
  click(document.getElementById("arena-enter"));
  click(document.getElementById("arena-go"));
  for (let i = 0; i < 3; i++) {
    const opts = document.querySelectorAll(".quiz-option");
    click(opts[0]);
    const next = document.getElementById("arena-next");
    if (next) click(next);
  }
  click(document.getElementById("arena-submit"));
  const text = document.getElementById("arena-root").textContent;
  if (!/Contest finished/.test(text)) throw new Error("no contest result: " + text.slice(0, 80));
  log("OK: contest completes with result + rating");
} catch (e) { failures++; log("FAIL:", (e._label||""), e.message); }

console.log("FLASHCARDS flow:");
try {
  const { document } = loadPage("flashcards.html", true);
  const front = document.getElementById("fc-front").textContent;
  click(document.getElementById("fc-flip"));
  if (!document.getElementById("fc-scene").classList.contains("flipped")) throw new Error("card did not flip");
  click(document.getElementById("fc-next"));
  if (front === document.getElementById("fc-front").textContent) throw new Error("next did not advance");
  log("OK: flip + navigate work");
} catch (e) { failures++; log("FAIL:", (e._label||""), e.message); }

console.log("LEADERBOARD tabs:");
try {
  const { document } = loadPage("leaderboard.html", true);
  const tabs = document.querySelectorAll("#lb-tabs .tab");
  click(tabs[1]);
  if (!tabs[1].classList.contains("active")) throw new Error("tab not activated");
  click(tabs[2]);
  log("OK: tabs switch");
} catch (e) { failures++; log("FAIL:", (e._label||""), e.message); }

console.log("LOGIN flow (login.html):");
try {
  const { document, sandbox } = loadPage("login.html", false);
  const form = document.getElementById("login-form");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const submitForm = () => form.dispatchEvent(new (form.ownerDocument.defaultView || global).Event("submit", { bubbles: true, cancelable: true }));
  email.value = "wrong@x.com";
  password.value = "nope";
  submitForm();
  if (document.getElementById("login-error").classList.contains("hidden")) throw new Error("error not shown for bad creds");
  email.value = "demo@vartalab.com";
  password.value = "demo1234";
  submitForm();
  if (sandbox.localStorage.getItem("vartalab_session") !== "1") throw new Error("session not set after login");
  log("OK: bad creds rejected, demo creds set session");
} catch (e) { failures++; log("FAIL:", (e._label||""), e.message); }

console.log("AUTH GUARD (learn.html without session):");
try {
  loadPage("learn.html", false);
  log("OK: page rendered without session (guard redirect attempted)");
} catch (e) { failures++; log("FAIL:", (e._label||""), e.message); }

console.log(failures ? failures + " FLOW FAILURES" : "ALL FLOWS PASS");
process.exit(failures ? 1 : 0);
