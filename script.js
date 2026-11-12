// Enables motion only when JS runs (so everything is visible without it)
document.documentElement.classList.add("js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Headline: wrap words so they can settle in one by one
const h1 = document.querySelector(".hero h1");
if (h1) {
  const words = h1.textContent.trim().split(/\s+/);
  h1.setAttribute("aria-label", h1.textContent.trim());
  h1.innerHTML = words
    .map((w, i) => `<span class="w" aria-hidden="true" style="--i:${i}">${w}</span>`)
    .join(" ");
}

// ---- Stagger indexes for lists that animate in sequence
document.querySelectorAll(".receipt-paper li, .steps li").forEach((el) => {
  el.style.setProperty("--i", [...el.parentElement.children].indexOf(el));
});

// ---- Animate each view as it scrolls in, and reset it once it's fully out of sight
//      so it plays again the next time the visitor scrolls back to it.
document.querySelectorAll('[data-reveal="row"], [data-reveal="up"]').forEach((el) => {
  const kin = [...el.parentElement.children].filter((c) => c.dataset.reveal === el.dataset.reveal);
  el.style.setProperty("--d", kin.indexOf(el));
});

// Headings that wipe in: clip an inner span, so the observed element itself stays measurable
document.querySelectorAll('[data-reveal="wipe"]').forEach((el) => {
  el.innerHTML = `<span class="wipe">${el.innerHTML}</span>`;
});

// Start the headline as soon as the page is ready (independent of scroll detection)
requestAnimationFrame(() => document.documentElement.classList.add("loaded"));

const revealEls = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  // "Entered" = any part is inside the middle 85% of the screen; works for any element height
  const enter = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
    { rootMargin: "0px 0px -15% 0px", threshold: 0 }
  );
  // "Left" = completely off screen, so it can replay next time
  const leave = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (!e.isIntersecting) e.target.classList.remove("in"); }),
    { threshold: 0 }
  );
  revealEls.forEach((el) => { enter.observe(el); leave.observe(el); });
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

// ---- Scroll progress trace in the header
const bar = document.querySelector(".progress");
let ticking = false;
function updateProgress() {
  if (!bar) return;
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  ticking = false;
}
addEventListener("scroll", () => {
  if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
}, { passive: true });
updateProgress();

// ---- Link service rows and hero chips: hovering one lights the other
document.querySelectorAll(".svc[id]").forEach((row) => {
  const chip = document.querySelector(`.chip-link[data-svc="${row.id}"]`);
  if (!chip) return;
  row.addEventListener("mouseenter", () => chip.classList.add("is-lit"));
  row.addEventListener("mouseleave", () => chip.classList.remove("is-lit"));
});

// ---- "Hiring?" / "Need something built?" paths: remember the choice in the contact form
document.querySelectorAll("[data-topic]").forEach((link) => {
  link.addEventListener("click", () => {
    const select = document.getElementById("f-type");
    if (select) select.value = link.dataset.topic;
  });
});

// ---- Light / dark theme toggle (follows the system until the visitor picks one)
const lightCss = document.getElementById("light-css");
const themeBtn = document.querySelector(".theme-toggle");
const systemLight = window.matchMedia("(prefers-color-scheme: light)");
function savedTheme() { try { return localStorage.getItem("theme"); } catch (e) { return null; } }
function applyTheme(choice) {
  const theme = choice || (systemLight.matches ? "light" : "dark");
  if (lightCss) lightCss.media = choice ? (choice === "light" ? "all" : "not all") : "(prefers-color-scheme: light)";
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    m.media = choice ? "all" : m.dataset.media || m.media;
    if (choice) m.content = theme === "light" ? "#EAF0F6" : "#0A1120";
  });
  if (themeBtn) {
    const next = theme === "light" ? "dark" : "light";
    themeBtn.setAttribute("aria-label", `Switch to ${next} theme`);
  }
}
document.querySelectorAll('meta[name="theme-color"]').forEach((m) => { m.dataset.media = m.media; m.dataset.content = m.content; });
applyTheme(savedTheme());
systemLight.addEventListener("change", () => { if (!savedTheme()) applyTheme(null); });
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("theme", next); } catch (e) {}
    applyTheme(next);
  });
}

// ---- Mobile menu
const menuBtn = document.querySelector(".menu-toggle");
const nav = document.getElementById("main-nav");
if (menuBtn && nav) {
  const setOpen = (open) => {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
  };
  menuBtn.addEventListener("click", () => setOpen(menuBtn.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
}

// ---- Contact form: no server needed on GitHub Pages, so it opens a pre-filled email.
const EMAIL = "edrianbarandino@gmail.com";
const form = document.getElementById("contact-form");
const errorBox = document.getElementById("form-error");

form && form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.elements.name;
  const message = form.elements.message;
  const missing = [];

  [name, message].forEach((el) => {
    const empty = !el.value.trim();
    el.setAttribute("aria-invalid", empty ? "true" : "false");
    if (empty) missing.push(el.labels[0].textContent.toLowerCase());
  });

  if (missing.length) {
    errorBox.textContent = `Add ${missing.join(" and ")} so I know how to help.`;
    errorBox.hidden = false;
    (name.value.trim() ? message : name).focus();
    return;
  }
  errorBox.hidden = true;

  const type = form.elements.type.value;
  const subject = `Portfolio inquiry: ${type}`;
  const body = `Hi Edrian,\n\n${message.value.trim()}\n\nThanks,\n${name.value.trim()}`;
  window.location.href =
    `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
