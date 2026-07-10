/* ==========================================================
   Learn AI Fast — site settings + behaviour
   EDIT THESE TWO LINES after you set up Calendly:
   ========================================================== */
const CALENDLY_URL = "https://cal.com/kieran-rowan-tiujdp"; // Cal.com booking page (Stripe payments enabled)
const CONTACT_EMAIL = "hello@learnaifast.co.uk";

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
  const LIFETIME = 22;    // seconds — must match the CSS animation duration
  const LAUNCH_AT = 0.41; // fraction of the timeline when it floats off
  let flyDir = 1;         // 1 = right, -1 = left; alternates each birth

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

  /* if the visitor prefers reduced motion the CSS hides the seeds,
     so don't spawn them at all (they'd pile up unseen) */
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    spawnSeed();
    setInterval(spawnSeed, LIFETIME * LAUNCH_AT * 1000);
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
