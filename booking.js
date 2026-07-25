/* ==========================================================
   Learn AI Fast — in-website booking page (/book)

   Customers land here from a session page, pick a slot in the
   embedded calendar, and pay — all without leaving the site.

   TO ADD OR EDIT A SESSION: just edit the SESSIONS list below.
   - calLink : the Cal.com event, as "username/event-slug".
               Set to null if that session has no online calendar yet.
   - payLink : Stripe payment link, used only when calLink is null.
   ========================================================== */

const CAL_USER = "kieran-rowan-tiujdp";

const SESSIONS = {
  confidence: {
    name: "60-Minute AI Confidence Session",
    price: "£79.99",
    meta: "60 minutes · Zoom or in person",
    detailPage: "/ai-confidence-session",
    calLink: CAL_USER + "/60-minute-ai-confidence-session",
    payLink: "https://book.stripe.com/4gM14peePf4u8AMe8c8bS00",
  },
  "deep-dive": {
    name: "90-Minute Deep Dive Session",
    price: "£109.99",
    meta: "90 minutes · Zoom or in person",
    detailPage: "/deep-dive-session",
    calLink: CAL_USER + "/90-minute-deep-dive-session",
    payLink: "https://book.stripe.com/00wcN72w75tU8AM7JO8bS01",
  },
  business: {
    name: "Business Starter Session",
    price: "£249.99",
    meta: "3 hours · Zoom or in person",
    detailPage: "/business-starter-session",
    calLink: CAL_USER + "/business-starter-session",
    payLink: "https://book.stripe.com/9B600l3Ab4pQcR24xC8bS02",
  },
  scam: {
    name: "60-Minute AI Scam Safety Session",
    price: "£79.99",
    meta: "60 minutes · Private Zoom lesson",
    detailPage: "/ai-scam-safety-session",
    calLink: CAL_USER + "/60-minute-ai-scam-safety-session",
    payLink: "https://book.stripe.com/aFa00l7Qr1dE4kw6FK8bS03",
  },
};

/* ---- Which session are we booking? ---- */
const params = new URLSearchParams(window.location.search);
const key = params.get("session");
const session = key && Object.prototype.hasOwnProperty.call(SESSIONS, key) ? SESSIONS[key] : null;

const els = {
  title: document.getElementById("bookingTitle"),
  summary: document.getElementById("bookingSummary"),
  picker: document.getElementById("bookingPicker"),
  pickerGrid: document.getElementById("bookingPickerGrid"),
  frame: document.getElementById("bookingFrame"),
  frameTitle: document.getElementById("bookingFrameTitle"),
  direct: document.getElementById("bookingDirect"),
  directTitle: document.getElementById("bookingDirectTitle"),
  directPay: document.getElementById("bookingDirectPay"),
};

if (!session) {
  showPicker();
} else if (session.calLink) {
  showCalendar(session);
} else {
  showDirect(session);
}

/* ---- No session chosen: let them pick one here ---- */
function showPicker() {
  els.title.textContent = "Book your session";
  els.summary.textContent = "Choose which session you'd like, then pick a time that suits you.";
  els.pickerGrid.innerHTML = Object.keys(SESSIONS)
    .map((k) => {
      const s = SESSIONS[k];
      return (
        '<a class="booking-picker-card" href="/book?session=' + k + '">' +
        '<span class="booking-picker-name">' + s.name + "</span>" +
        '<span class="booking-picker-meta">' + s.meta + "</span>" +
        '<span class="booking-picker-price">' + s.price + "</span>" +
        '<span class="booking-picker-go">Pick a time →</span>' +
        "</a>"
      );
    })
    .join("");
  els.picker.hidden = false;
}

/* ---- Session with an online calendar: embed it inline ---- */
function showCalendar(s) {
  document.title = "Book: " + s.name + " — Learn AI Fast";
  els.title.textContent = s.name;
  els.summary.innerHTML =
    "<strong>" + s.price + "</strong> · " + s.meta +
    " — pick a date and time below, then pay securely by card.";
  els.frameTitle.textContent = "Available dates for your " + s.name.toLowerCase();
  els.frame.hidden = false;
  loadCalEmbed(s.calLink);
}

/* ---- Session without a calendar yet: secure payment + follow-up ---- */
function showDirect(s) {
  document.title = "Book: " + s.name + " — Learn AI Fast";
  els.title.textContent = s.name;
  els.summary.innerHTML = "<strong>" + s.price + "</strong> · " + s.meta;
  els.directTitle.textContent = s.name;
  els.directPay.href = s.payLink;
  els.direct.hidden = false;
}

/* ---- Cal.com inline embed ----
   Renders the calendar and the payment step inside our own page,
   styled with the Learn AI Fast gold. Official Cal.com loader. */
function loadCalEmbed(calLink) {
  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal;
      let ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement("script")).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ["initNamespace", namespace]);
        } else {
          p(cal, ar);
        }
        return;
      }
      p(cal, ar);
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");

  Cal("init", { origin: "https://app.cal.com" });

  Cal("inline", {
    elementOrSelector: "#cal-inline",
    calLink: calLink,
    layout: "month_view",
    config: { theme: "light" },
  });

  Cal("ui", {
    theme: "light",
    hideEventTypeDetails: false,
    layout: "month_view",
    cssVarsPerTheme: {
      light: {
        "cal-brand": "#a67c00",
        "cal-bg": "#fffdf8",
        "cal-text": "#26332c",
      },
    },
  });

  /* If the calendar hasn't appeared after 8 seconds (blocked script,
     bad connection), show a plain link so nobody hits a dead end. */
  setTimeout(function () {
    const holder = document.getElementById("cal-inline");
    if (holder && !holder.querySelector("iframe")) {
      holder.innerHTML =
        '<p class="booking-loading">The calendar is taking a moment to load. ' +
        '<a href="https://cal.com/' + calLink + '" ' +
        'target="_blank" rel="noopener">Open the booking calendar</a> ' +
        'or <a href="/contact">send me a message</a> and I\'ll find you a time.</p>';
    }
  }, 8000);
}
