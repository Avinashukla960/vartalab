/* Runtime smoke test: load every VARTALAB page into linkedom and run its
   scripts (data.js, app.js, inline) exactly as a browser would, reporting
   any runtime error thrown during page initialisation. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { parseHTML } = require("/home/user/_deps/node_modules/linkedom");

const SITE = "/home/user/vartalab";
const pages = fs.readdirSync(SITE).filter((f) => f.endsWith(".html"));
let failures = 0;

pages.forEach((page) => {
  const html = fs.readFileSync(path.join(SITE, page), "utf8");
  const { document } = parseHTML(html);
  const win = {
    addEventListener() {}, removeEventListener() {},
    matchMedia: () => ({ matches: true, addEventListener() {} }),
    requestAnimationFrame: (fn) => setTimeout(fn, 0),
    cancelAnimationFrame: (id) => clearTimeout(id), scrollTo() {},
  };
  const loc = { search: "", href: "http://x/" + page, pathname: "/" + page, replace() {}, };
  const sandbox = {
    window: win, document, location: loc, navigator: {},
    confirm: () => true, alert: () => {},
    setTimeout, clearTimeout, setInterval, clearInterval,
    Intl, URLSearchParams, console, Math, JSON, Date, String, Number, Array, Object, Promise,
    requestAnimationFrame: (fn) => setTimeout(fn, 0), cancelAnimationFrame: (id) => clearTimeout(id),
    addEventListener() {}, removeEventListener() {},
    localStorage: { _s: { vartalab_session: "1" }, getItem(k) { return this._s[k] ?? null; }, setItem(k, v) { this._s[k] = String(v); }, removeItem(k) { delete this._s[k]; } },
    tailwind: {},
  };
  Object.assign(win, { document, location: loc, navigator: {}, localStorage: sandbox.localStorage, tailwind: {}, confirm: () => true, alert: () => {}, setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame: sandbox.requestAnimationFrame, cancelAnimationFrame: sandbox.cancelAnimationFrame, addEventListener() {}, removeEventListener() {} });
  const ctx = vm.createContext(sandbox);

  const scriptSrcs = [], scriptInlines = [];
  const re = /<script([^>]*)>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1] || "";
    const srcMatch = attrs.match(/src="([^"]+)"/);
    if (srcMatch) scriptSrcs.push(srcMatch[1]);
    else if ((m[2] || "").trim()) scriptInlines.push(m[2]);
  }

  let pageErrors = [];
  const run = (code, label) => { try { vm.runInContext(code, ctx, { filename: label }); } catch (e) { pageErrors.push(label + " :: " + e.message); } };

  scriptSrcs.forEach((src) => {
    if (src.includes("tailwindcss") || src.includes("fonts")) return;
    const file = path.join(SITE, src);
    if (!fs.existsSync(file)) { pageErrors.push("missing script: " + src); return; }
    run(fs.readFileSync(file, "utf8"), src);
  });
  scriptInlines.forEach((s, i) => run(s, "inline#" + i));

  if (pageErrors.length) { failures++; console.log("FAIL", page); pageErrors.forEach((e) => console.log("   -", e)); }
  else console.log("ok  ", page);
});

console.log(failures ? failures + " page(s) with init errors" : "ALL PAGES INITIALISE CLEANLY");
process.exit(failures ? 1 : 0);
