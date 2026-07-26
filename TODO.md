# Learn AI Fast — open items

## To do

- [ ] **Check the Zoom plan.** Free Zoom cuts meetings off at 40 minutes. Sessions are
      60 / 90 / 180 minutes, so a free account would end a lesson mid-flow. Pro is roughly
      $14.16/month billed annually (~$16.99 monthly) and lifts the limit to 30 hours.
      Confirm GBP pricing at zoom.com/pricing.

- [ ] **Do one real end-to-end test booking.** Nothing has ever been paid for through
      Stripe — zero charges on the account. Book yourself a session, pay, confirm the Zoom
      link and both confirmation emails arrive, then refund it in Stripe. This is the only
      way to prove the Cal.com → Stripe → Zoom chain actually fires.

- [x] **All three lesson adverts remade square (1254x1254)** and the card slot changed
      to 1:1, so nothing is cropped any more. Business Starter now reads 180 minutes and
      the laptop typo is gone. Future adverts: supply square at 1500x1500 with ~5% safe
      margin, title and price in the top third.

- [ ] **Second Look Protect analytics.** Web Analytics is enabled on the Vercel project,
      but the tracking code still needs adding to that site. Waiting on the repo.

- [ ] **Reject the stale Cal.com booking** — Sun 26 Jul, 10:00am, stuck in "Pending
      payment / Unconfirmed". It's holding a slot that will never be paid for.

## Answered / done

- Booking now happens on-site at `/book` with the Cal.com calendar embedded — customers
  no longer get sent out to Stripe and then on to cal.com.
- Cal.com availability: Mon–Sun 08:00–20:00, Europe/London, set as default.
- Zoom is the location on all four sessions; Google Calendar syncs both ways;
  confirmation emails go to Kieran and the customer.
- The four old `book.stripe.com` payment links are now **deactivated** — they let people
  pay without ever booking a slot, and risked double-charging.
- Vercel Web Analytics live, including funnel events: Clicked Book → Booking Page Viewed
  → Calendar Loaded → Booking Completed, plus Calendar Failed and Enquiry Sent.
- The free 15-minute intro call has been removed from the homepage FAQ, the lessons page
  and the contact form dropdown.

## Still unanswered

- **Does Second Look Protect have its own Stripe account?** The "Learn AI Fast" Stripe
  account contains only the four lesson products — no SLP anything. Separate accounts are
  the only way to get a different name on customer bank statements.
