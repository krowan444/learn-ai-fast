/* ==========================================================
   Learn AI Fast — site settings + behaviour
   EDIT THESE TWO LINES after you set up Calendly:
   ========================================================== */
const CALENDLY_URL = "REPLACE-WITH-YOUR-CALENDLY-LINK"; // e.g. https://calendly.com/kieran-learnaifast/60min
const CONTACT_EMAIL = "kierandrowan@gmail.com";

/* ---- Booking buttons ----
   Every element with class "js-book" points to Calendly once
   CALENDLY_URL is set; until then it falls back to the contact page. */
document.querySelectorAll(".js-book").forEach((el) => {
  if (CALENDLY_URL.startsWith("http")) {
    el.href = CALENDLY_URL;
    el.target = "_blank";
    el.rel = "noopener";
  } else {
    el.href = "/contact";
  }
});

/* ---- Mobile nav toggle ---- */
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

/* ---- Contact form (no backend needed — opens the visitor's
        email app with the message pre-filled) ---- */
const form = document.querySelector("#contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.firstName.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const subject = encodeURIComponent("Friendly AI session request from " + name);
    const body = encodeURIComponent(
      "Name: " + name + "\nEmail: " + email + "\n\n" + message
    );
    window.location.href =
      "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
    const ok = document.querySelector(".form-success");
    if (ok) ok.style.display = "block";
  });
}

/* ---- Floating dandelion seeds in the hero ---- */
const seedHost = document.querySelector(".seeds");
if (seedHost) {
  const SEED_W = 26, SEED_H = 34;
  const SEED_SVG =
    '<svg viewBox="0 0 26 34" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<g stroke="#b9a77a" stroke-width="1.1" stroke-linecap="round">' +
    '<line x1="13" y1="14" x2="13" y2="27"/>' +
    '<line x1="13" y1="14" x2="4" y2="4"/>' +
    '<line x1="13" y1="14" x2="9" y2="2"/>' +
    '<line x1="13" y1="14" x2="13" y2="1"/>' +
    '<line x1="13" y1="14" x2="17" y2="2"/>' +
    '<line x1="13" y1="14" x2="22" y2="4"/>' +
    '<line x1="13" y1="14" x2="6" y2="9"/>' +
    '<line x1="13" y1="14" x2="20" y2="9"/>' +
    '</g><circle cx="13" cy="29" r="2.2" fill="#a68d55"/></svg>';
  for (let i = 0; i < 12; i++) {
    const s = document.createElement("div");
    s.className = "seed";
    s.innerHTML = SEED_SVG;
    const dur = 14 + Math.random() * 18;           // 14–32s to cross
    s.style.setProperty("--dur", dur.toFixed(1) + "s");
    s.style.setProperty("--delay", (-Math.random() * dur).toFixed(1) + "s"); // start mid-flight
    s.style.setProperty("--sway", (3.5 + Math.random() * 3).toFixed(1) + "s");
    s.style.setProperty("--o", (0.3 + Math.random() * 0.45).toFixed(2));
    s.style.top = (4 + Math.random() * 82).toFixed(1) + "%";
    const scale = 0.55 + Math.random() * 0.95;
    const svg = s.querySelector("svg");
    svg.setAttribute("width", Math.round(SEED_W * scale));
    svg.setAttribute("height", Math.round(SEED_H * scale));
    seedHost.appendChild(s);
  }
}
