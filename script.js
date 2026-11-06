// Enables motion only when JS runs (so everything is visible without it)
document.documentElement.classList.add("js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.getElementById("year").textContent = new Date().getFullYear();

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

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && e.intersectionRatio >= 0.2) e.target.classList.add("in");
      else if (!e.isIntersecting) e.target.classList.remove("in");
    });
  },
  { threshold: [0, 0.2] }
);
document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

// ---- Scroll progress trace in the header
const bar = document.querySelector(".progress");
let ticking = false;
function updateProgress() {
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

// ---- Contact form: no server needed on GitHub Pages, so it opens a pre-filled email.
const EMAIL = "edrianbarandino@gmail.com";
const form = document.getElementById("contact-form");
const errorBox = document.getElementById("form-error");

form.addEventListener("submit", (e) => {
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
  const subject = `Project inquiry: ${type}`;
  const body = `Hi Edrian,\n\n${message.value.trim()}\n\nThanks,\n${name.value.trim()}`;
  window.location.href =
    `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
