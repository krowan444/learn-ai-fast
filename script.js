/* ==========================================================
   Learn AI Fast — site settings + behaviour
   ========================================================== */

/* ---- Vercel Web Analytics ----
   Loaded here rather than in each page, so every page that includes
   script.js is counted automatically. Page views only — no cookies,
   no personal data. View the numbers at:
   vercel.com → learn-ai-fast → Analytics
   Note: the /_vercel/insights/* routes only exist on Vercel, so this
   silently does nothing when opening the files locally. */
window.va = window.va || function () {
  (window.vaq = window.vaq || []).push(arguments);
};
(function () {
  if (location.hostname === "localhost" || location.protocol === "file:") return;
  const s = document.createElement("script");
  s.defer = true;
  s.src = "/_vercel/insights/script.js";
  document.head.appendChild(s);
})();

/* ---- Custom event helper ----
   Wraps Vercel's va() so a missing/blocked analytics script can never
   break the page. Requires a Pro plan (custom events aren't on Hobby).
   Data values must be strings, numbers, booleans or null — no nesting. */
window.lafTrack = function (name, data) {
  try {
    if (typeof window.va === "function") {
      window.va("event", data ? { name: name, data: data } : { name: name });
    }
  } catch (err) {
    /* analytics must never break the site */
  }
};

/* ---- Funnel step 1: someone clicked through to book ---- */
document.querySelectorAll(".detail-buy").forEach((el) => {
  el.addEventListener("click", () => {
    const q = (el.getAttribute("href") || "").split("session=")[1] || "unknown";
    window.lafTrack("Clicked Book", { session: q });
  });
});

const CONTACT_EMAIL = "hello@learnaifast.co.uk";

/* ---- Booking buttons ----
   Any element with class "js-book" goes to our own on-site
   booking page (/book), which embeds the calendar and payment.
   Session-specific buttons link straight to /book?session=... */
document.querySelectorAll(".js-book").forEach((el) => {
  el.href = "/book";
  el.removeAttribute("target");
});

/* ---- Mobile nav toggle ---- */
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.textContent = open ? "×" : "☰";
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      toggle.textContent = "☰";
    });
  });
}

/* ---- Contact form — submits directly to the Learn AI Fast
        enquiry service (Supabase Edge Function). ---- */
const ENQUIRY_URL = "https://sktwwjvbpaqvmokhnjeh.supabase.co/functions/v1/enquiry";

const form = document.querySelector("#contactForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    const ok = document.querySelector(".form-success");
    const name = form.firstName.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const context = form.dataset.enquiryContext;
    /* fold the optional topic + phone fields into the message so the
       enquiry service keeps working unchanged */
    const topic = form.topic ? form.topic.value : "";
    const phone = form.phone ? form.phone.value.trim() : "";
    const extras = [
      topic ? `Enquiry type: ${topic}` : "",
      phone ? `Phone: ${phone}` : "",
      context || ""
    ].filter(Boolean).join("\n");
    const fullMessage = extras ? `${extras}\n\n${message}` : message;
    if (!name || !email || !message) return;

    btn.disabled = true;
    const oldLabel = btn.textContent;
    btn.textContent = "Sending…";
    try {
      const res = await fetch(ENQUIRY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: name, email, message: fullMessage }),
      });
      if (!res.ok) throw new Error("Send failed");
      window.lafTrack("Enquiry Sent", { topic: topic || "not given" });
      form.reset();
      /* take them to a friendly thank-you page */
      window.location.href = "/thanks";
    } catch (err) {
      btn.textContent = oldLabel;
      btn.disabled = false;
      alert("Sorry — something went wrong sending your message. Please try again, or email " + CONTACT_EMAIL + " directly.");
    }
  });
}

/* ---- Floating dandelion seeds (hero + any .seeds layer) ---- */
document.querySelectorAll(".seeds").forEach((seedHost) => {
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
    s.style.setProperty("--o", (0.2 + Math.random() * 0.3).toFixed(2));
    /* placement depends on drift direction:
       vertical drifts spread across the width; horizontal drifts
       spread down the height (hero keeps to its bottom half) */
    if (seedHost.classList.contains("seeds-up") || seedHost.classList.contains("seeds-down")) {
      s.style.left = (4 + Math.random() * 92).toFixed(1) + "%";
    } else if (
      seedHost.classList.contains("seeds-rtl") ||
      seedHost.classList.contains("seeds-diag") ||
      seedHost.classList.contains("seeds-diag-flip")
    ) {
      s.style.top = (8 + Math.random() * 78).toFixed(1) + "%";
    } else {
      s.style.top = (52 + Math.random() * 40).toFixed(1) + "%";
    }
    const scale = 0.35 + Math.random() * 0.4;                 // small, subtle
    const svg = s.querySelector("svg");
    svg.setAttribute("width", Math.round(SEED_W * scale));
    svg.setAttribute("height", Math.round(SEED_H * scale));
    seedHost.appendChild(s);
  }
});

/* ---- Idea seeds drifting out from the hero character ---- */
const mindSeedHost = document.querySelector(".mind-seeds");
if (mindSeedHost) {
  /* a realistic dandelion seed: a fine umbrella of pappus filaments,
     a long thin beak, and a slender seed body at the bottom */
  const MIND_SEED_SVG =
    '<svg viewBox="0 0 26 37" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    /* pappus — a full starburst of filaments around the stalk tip */
    '<g stroke="#d3bf92" stroke-width="0.7" stroke-linecap="round">' +
    '<line x1="13" y1="11" x2="13" y2="1"/>' +
    '<line x1="13" y1="11" x2="17.1" y2="1.9"/>' +
    '<line x1="13" y1="11" x2="20.4" y2="4.3"/>' +
    '<line x1="13" y1="11" x2="22.5" y2="7.9"/>' +
    '<line x1="13" y1="11" x2="22.9" y2="12"/>' +
    '<line x1="13" y1="11" x2="21.7" y2="16"/>' +
    '<line x1="13" y1="11" x2="18.9" y2="19.1"/>' +
    '<line x1="13" y1="11" x2="15.1" y2="20.8"/>' +
    '<line x1="13" y1="11" x2="10.9" y2="20.8"/>' +
    '<line x1="13" y1="11" x2="7.1" y2="19.1"/>' +
    '<line x1="13" y1="11" x2="4.3" y2="16"/>' +
    '<line x1="13" y1="11" x2="3.1" y2="12"/>' +
    '<line x1="13" y1="11" x2="3.5" y2="7.9"/>' +
    '<line x1="13" y1="11" x2="5.6" y2="4.3"/>' +
    '<line x1="13" y1="11" x2="8.9" y2="1.9"/>' +
    '</g>' +
    /* inner, shorter filaments for fluffy density */
    '<g stroke="#d3bf92" stroke-width="0.6" stroke-linecap="round" opacity="0.6">' +
    '<line x1="13" y1="11" x2="8" y2="6.5"/>' +
    '<line x1="13" y1="11" x2="18" y2="6.5"/>' +
    '<line x1="13" y1="11" x2="19" y2="13.5"/>' +
    '<line x1="13" y1="11" x2="7" y2="13.5"/>' +
    '<line x1="13" y1="11" x2="13" y2="17.5"/>' +
    '</g>' +
    '<circle cx="13" cy="11" r="0.9" fill="#c9a24a" stroke="none"/>' +
    /* beak — the long thin stalk */
    '<line x1="13" y1="11" x2="13" y2="28" stroke="#c9a24a" stroke-width="0.9"/>' +
    /* seed body with tiny bristles at its top */
    '<path d="M11.9 28.2 l-1.3 -1.3 M14.1 28.2 l1.3 -1.3" stroke="#a67c2e" stroke-width="0.6" stroke-linecap="round"/>' +
    '<ellipse cx="13" cy="30.8" rx="1.3" ry="3" fill="#a67c2e" stroke="none"/>' +
    '</svg>';

  /* Each seed grows at his head, floats up a little, and the moment it
     leaves, the next one is born below it. They alternate direction:
     one sails left across the screen, the next sails right. */
  const LIFETIME = 22.5;   // seconds — must match the CSS animation duration
  const LAUNCH_AT = 0.20;  // fraction of the timeline when it floats off (the 20% keyframe)
  /* How often a new seed is born. This used to be LIFETIME x LAUNCH_AT, which
     forced the seed to hover on his head right up until the next one arrived
     — about seven seconds of very little happening. Keeping it as its own
     value lets the seed lift off early (4.5s) and still drift for a long,
     slow 18s, while the birth rhythm stays locked to the thought-bubble cycle. */
  const SPAWN_EVERY = 9.02;
  let flyDir = 1;          // 1 = right, -1 = left; alternates each birth

  const spawnSeed = () => {
    const s = document.createElement("span");
    s.className = "mind-seed";
    s.innerHTML = MIND_SEED_SVG;
    s.style.setProperty("--dir", flyDir);
    s.style.setProperty("--size", Math.round(22 + Math.random() * 4) + "px");
    flyDir = -flyDir;
    /* clean up once its flight finishes */
    s.addEventListener("animationend", (e) => {
      if (e.animationName === "mind-seed-flow") s.remove();
    });
    mindSeedHost.appendChild(s);
  };

  /* ---- Idea thought-bubbles ----
     Each cycle: three dots trail up-right off his head, a bubble pops open
     with one idea inside, it holds while the idea forms, then it shrinks
     back toward his head and fades at the same moment a seed is born — the
     idea becomes the seed and floats away. Ideas rotate in order. */
  const ICON = (paths) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
    paths + "</svg>";

  /* Ten ideas, cycling in order. Kept deliberately loose and everyday —
     the point is "AI helped me do this", not any one specific service. */
  const IDEAS = [
    /* a lightbulb — the idea itself */
    ICON(
      '<path d="M12 4.2a5.2 5.2 0 0 0-3 9.5v2.1h6v-2.1a5.2 5.2 0 0 0-3-9.5z"/>' +
      '<path d="M10 18.2h4"/><path d="M10.7 20.3h2.6"/>'
    ),
    /* a book */
    ICON(
      '<path d="M12 8.2C10.3 7.1 8.4 6.6 6.4 6.6H5.2v10.2h1.2c2 0 3.9.5 5.6 1.6 1.7-1.1 3.6-1.6 5.6-1.6h1.2V6.6h-1.2c-2 0-3.9.5-5.6 1.6z"/>' +
      '<path d="M12 8.2v10.2"/>'
    ),
    /* a task list with ticks */
    ICON(
      '<path d="M4.6 8.4l1.6 1.6 2.9-3"/>' +
      '<path d="M11.6 8.4h7.8"/>' +
      '<path d="M4.6 15.4l1.6 1.6 2.9-3"/>' +
      '<path d="M11.6 15.4h7.8"/>'
    ),
    /* a games controller — proper gamepad silhouette with grips */
    ICON(
      '<path d="M8.6 9.6h6.8a5 5 0 0 1 4.9 4.1l.5 2.7a2.2 2.2 0 0 1-4 1.6l-1.5-2.1H7.7l-1.5 2.1a2.2 2.2 0 0 1-4-1.6l.5-2.7a5 5 0 0 1 4.9-4.1z"/>' +
      '<path d="M7.4 12.3v2.2M6.3 13.4h2.2"/>' +
      '<circle cx="15.4" cy="12.7" r="1" fill="currentColor" stroke="none"/>' +
      '<circle cx="17.2" cy="14.5" r="1" fill="currentColor" stroke="none"/>'
    ),
    /* a growth chart */
    ICON(
      '<path d="M4.5 19.2h15"/>' +
      '<path d="M7.6 19.2v-4.6M12 19.2v-8.4M16.4 19.2v-3.2"/>'
    ),
    /* a shopping bag — selling something */
    ICON(
      '<path d="M5.6 8.6h12.8l-1 10.1a1.4 1.4 0 0 1-1.4 1.3H8a1.4 1.4 0 0 1-1.4-1.3z"/>' +
      '<path d="M9 8.6V7.1a3 3 0 0 1 6 0v1.5"/>'
    ),
    /* an envelope */
    ICON(
      '<rect x="3.6" y="6.6" width="16.8" height="11.4" rx="2"/>' +
      '<path d="M4.4 8.1l7.6 5.5 7.6-5.5"/>'
    ),
    /* a speech bubble */
    ICON(
      '<path d="M20 12.4c0 3.4-3.6 6.2-8 6.2-1 0-2-.15-2.9-.42L4.4 20l1.2-3.3A6.4 6.4 0 0 1 4 12.4C4 9 7.6 6.2 12 6.2s8 2.8 8 6.2z"/>'
    ),
    /* a calendar */
    ICON(
      '<rect x="4" y="6.6" width="16" height="13.4" rx="2"/>' +
      '<path d="M4 10.7h16"/><path d="M8.6 4.6v3.7M15.4 4.6v3.7"/>' +
      '<circle cx="9" cy="14.2" r=".9" fill="currentColor" stroke="none"/>' +
      '<circle cx="12.6" cy="14.2" r=".9" fill="currentColor" stroke="none"/>'
    ),
    /* a picture */
    ICON(
      '<rect x="3.6" y="5.6" width="16.8" height="12.8" rx="2"/>' +
      '<circle cx="8.8" cy="10.2" r="1.5"/>' +
      '<path d="M4.4 16.7l4.6-4.4 3.4 3.2 2.8-2.4 4.4 3.9"/>'
    ),
  ];

  /* Seconds the bubble leads the seed by. The idea symbol finishes opening
     at ~3.35s (1.85s delay + 1.5s pop), so 3.6s puts the seed's birth just
     after the symbol has appeared. The bubble then holds until 6.4s and
     fades by 8s, while the seed grows off the crown of his head. */
  const BUBBLE_LEAD = 3.6;
  let ideaIndex = 0;

  const spawnBubble = () => {
    const b = document.createElement("span");
    b.className = "mind-bubble";
    b.innerHTML =
      '<i class="mind-bubble-dot mind-bubble-dot-1"></i>' +
      '<i class="mind-bubble-dot mind-bubble-dot-2"></i>' +
      '<i class="mind-bubble-dot mind-bubble-dot-3"></i>' +
      '<span class="mind-bubble-body"><span class="mind-bubble-inner">' +
      IDEAS[ideaIndex] +
      "</span></span>";
    ideaIndex = (ideaIndex + 1) % IDEAS.length;
    b.addEventListener("animationend", (e) => {
      if (e.animationName === "mind-bubble-life") b.remove();
    });
    mindSeedHost.appendChild(b);
  };

  /* the bubble leads, the seed follows — so the idea forms first,
     then turns into the seed that drifts away */
  const runCycle = () => {
    spawnBubble();
    setTimeout(spawnSeed, BUBBLE_LEAD * 1000);
  };

  /* if the visitor prefers reduced motion the CSS hides the seeds and
     bubbles, so don't spawn them at all (they'd pile up unseen) */
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    runCycle();
    setInterval(runCycle, SPAWN_EVERY * 1000);
  }
}


/* ---- He types in bursts, pausing now and then to think ---- */
const zenFigure = document.querySelector(".hero-zen");
if (zenFigure && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  (function typingLoop() {
    zenFigure.classList.add("is-typing");
    zenFigure.classList.remove("is-thinking");
    const typeFor = 2400 + Math.random() * 2800;   // type 2.4–5.2s
    setTimeout(() => {
      zenFigure.classList.remove("is-typing");
      zenFigure.classList.add("is-thinking");      // face emotes while he pauses
      const restFor = 1400 + Math.random() * 2200; // pause 1.4–3.6s, thinking
      setTimeout(typingLoop, restFor);
    }, typeFor);
  })();
}


/* ---- Floating dandelion seeds in the header ---- */
const headerSeedHost = document.querySelector(".site-header");
if (headerSeedHost && !headerSeedHost.querySelector(".header-seeds")) {
  const layer = document.createElement("div");
  layer.className = "header-seeds";
  layer.setAttribute("aria-hidden", "true");
  headerSeedHost.prepend(layer);

  const HEADER_SEED_SVG =
    '<svg viewBox="0 0 26 34" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<g stroke="#d4bd7f" stroke-width="1" stroke-linecap="round">' +
    '<line x1="13" y1="14" x2="13" y2="27"/>' +
    '<line x1="13" y1="14" x2="4" y2="4"/>' +
    '<line x1="13" y1="14" x2="9" y2="2"/>' +
    '<line x1="13" y1="14" x2="13" y2="1"/>' +
    '<line x1="13" y1="14" x2="17" y2="2"/>' +
    '<line x1="13" y1="14" x2="22" y2="4"/>' +
    '<line x1="13" y1="14" x2="6" y2="9"/>' +
    '<line x1="13" y1="14" x2="20" y2="9"/>' +
    '</g><circle cx="13" cy="29" r="2" fill="#b39143"/></svg>';

  for (let i = 0; i < 10; i++) {
    const seed = document.createElement("span");
    seed.className = "header-seed";
    seed.innerHTML = HEADER_SEED_SVG;
    const dur = 12 + Math.random() * 12;
    const scale = 0.38 + Math.random() * 0.38;
    seed.style.setProperty("--dur", dur.toFixed(1) + "s");
    seed.style.setProperty("--delay", (-Math.random() * dur).toFixed(1) + "s");
    seed.style.setProperty("--float", (3 + Math.random() * 3.5).toFixed(1) + "s");
    seed.style.setProperty("--opacity", (0.24 + Math.random() * 0.32).toFixed(2));
    seed.style.setProperty("--top", (14 + Math.random() * 72).toFixed(1) + "%");
    const svg = seed.querySelector("svg");
    svg.setAttribute("width", Math.round(26 * scale));
    svg.setAttribute("height", Math.round(34 * scale));
    layer.appendChild(seed);
  }
}


/* ---- Secret tamagotchi-style pet ---- */
const secretPet = document.querySelector("#secretPet");
if (secretPet) {
  const clamp = (value) => Math.max(0, Math.min(100, value));
  const state = {
    health: 100,
    food: 100,
    fun: 100,
    clean: 100,
    poop: 0,
    alive: true,
    started: false,
    seconds: 0,
  };

  const character = secretPet.querySelector("[data-pet-character]");
  const message = secretPet.querySelector("[data-pet-message]");
  const status = secretPet.querySelector("[data-pet-state]");
  const poopZone = secretPet.querySelector("[data-poop-zone]");
  const bars = Object.fromEntries([...secretPet.querySelectorAll("[data-stat-bar]")].map((el) => [el.dataset.statBar, el]));
  const values = Object.fromEntries([...secretPet.querySelectorAll("[data-stat-value]")].map((el) => [el.dataset.statValue, el]));
  const statRows = Object.fromEntries([...secretPet.querySelectorAll("[data-stat]")].map((el) => [el.dataset.stat, el]));
  const actionButtons = [...secretPet.querySelectorAll("[data-pet-action]")];

  function setMessage(text) {
    message.textContent = text;
  }

  function updatePoop() {
    poopZone.innerHTML = "";
    for (let i = 0; i < state.poop; i++) {
      const item = document.createElement("span");
      item.className = "pet-poop";
      item.style.left = (12 + i * 23 + Math.random() * 4) + "%";
      poopZone.appendChild(item);
    }
  }

  function updateUi() {
    ["health", "food", "fun", "clean"].forEach((key) => {
      const amount = Math.round(state[key]);
      values[key].textContent = amount + "%";
      bars[key].style.width = amount + "%";
      statRows[key].classList.toggle("is-low", amount < 28);
    });

    character.classList.toggle("is-hungry", state.food < 35 && state.alive);
    character.classList.toggle("is-sad", state.fun < 35 && state.alive);
    character.classList.toggle("is-dirty", (state.clean < 35 || state.poop > 0) && state.alive);
    character.classList.toggle("is-dead", !state.alive);

    if (!state.alive) status.textContent = "Sprout died";
    else if (!state.started) status.textContent = "Ready to hatch";
    else if (state.poop > 0) status.textContent = "Needs cleaning";
    else if (state.food < 30) status.textContent = "Hungry";
    else if (state.fun < 30) status.textContent = "Bored";
    else if (state.clean < 30) status.textContent = "Messy";
    else status.textContent = "Doing well";

    actionButtons.forEach((button) => {
      const action = button.dataset.petAction;
      button.disabled = !state.alive && action !== "reset";
    });
  }

  function startIfNeeded() {
    if (state.started || !state.alive) return;
    state.started = true;
    secretPet.dataset.started = "true";
    setMessage("Sprout is awake. Keep food, fun, and clean topped up.");
  }

  function resetPet() {
    Object.assign(state, { health: 100, food: 100, fun: 100, clean: 100, poop: 0, alive: true, started: true, seconds: 0 });
    updatePoop();
    setMessage("Sprout is back. Fresh start.");
    updateUi();
  }

  function care(action) {
    if (action === "reset") {
      resetPet();
      return;
    }
    startIfNeeded();
    if (!state.alive) return;

    if (action === "feed") {
      state.food = clamp(state.food + 28);
      state.clean = clamp(state.clean - 4);
      setMessage("Sprout had a snack. Nice.");
    }
    if (action === "play") {
      state.fun = clamp(state.fun + 30);
      state.food = clamp(state.food - 6);
      state.clean = clamp(state.clean - 6);
      setMessage("Sprout loved that. Fun is up.");
    }
    if (action === "clean") {
      if (state.poop > 0) {
        state.poop = 0;
        state.clean = clamp(state.clean + 42);
        updatePoop();
        setMessage("All clean. Sprout can breathe again.");
      } else {
        state.clean = clamp(state.clean + 16);
        setMessage("A quick tidy never hurts.");
      }
    }
    state.health = clamp(state.health + 5);
    updateUi();
  }

  actionButtons.forEach((button) => {
    button.addEventListener("click", () => care(button.dataset.petAction));
  });

  setInterval(() => {
    if (!state.started || !state.alive) return;
    state.seconds += 1;
    state.food = clamp(state.food - 0.42);
    state.fun = clamp(state.fun - 0.34);
    state.clean = clamp(state.clean - 0.28 - state.poop * 0.03);

    if (state.seconds % 45 === 0) {
      state.poop = Math.min(4, state.poop + 1);
      state.clean = clamp(state.clean - 12);
      updatePoop();
      setMessage("Uh oh. Clean up before health drops.");
    }

    const lowestCare = Math.min(state.food, state.fun, state.clean);
    if (lowestCare < 24 || state.poop >= 2) {
      state.health = clamp(state.health - (0.62 + state.poop * 0.18));
    } else if (lowestCare > 62 && state.poop === 0) {
      state.health = clamp(state.health + 0.12);
    }

    if (state.health <= 0) {
      state.alive = false;
      setMessage("Sprout died. Press Start Again to hatch a new one.");
    } else if (lowestCare < 28) {
      setMessage("Sprout needs attention now.");
    }
    updateUi();
  }, 1000);

  updateUi();
}
