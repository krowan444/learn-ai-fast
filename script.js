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
