# Learn AI Fast — static site

A fast, mobile-friendly rebuild of [learnaifast.co.uk](https://www.learnaifast.co.uk)
in plain HTML/CSS/JS. All text is real HTML (not baked into images), so it
reads perfectly on phones and is good for SEO.

## Pages

| File           | URL (on Vercel) | Notes                                        |
|----------------|-----------------|----------------------------------------------|
| `index.html`   | `/`             | Home                                         |
| `lessons.html` | `/lessons`      | 1-to-1 AI Lessons + pricing                  |
| `talks.html`   | `/talks`        | AI Safety Group Talks (was empty on Wix — drafted from your homepage copy, edit freely) |
| `protect.html` | `/protect`      | Second Look Protect (was empty on Wix — drafted from your homepage copy, edit freely)   |
| `contact.html` | `/contact`      | Contact form (opens visitor's email app)     |
| `about.html`   | `/about`        | About Kieran                                 |

Clean URLs (`/lessons` instead of `/lessons.html`) are handled by `vercel.json`.

## ⚙️ Two things to set in `script.js`

1. **`CALENDLY_URL`** — create a free account at calendly.com, copy your booking
   link, and paste it here. Every "Book a Session" button then opens Calendly.
   Until you set it, booking buttons go to the contact page instead.
2. **`CONTACT_EMAIL`** — where contact-form messages are sent
   (currently `kierandrowan@gmail.com`).

## 🖼 Images

Photos are currently loaded from your existing Wix image CDN
(`static.wixstatic.com`) — they'll keep working while your Wix account exists.
**Before cancelling Wix**, download the photos and put them in an `images/`
folder here, then update the `<img src>` URLs in the HTML files.

## 🚀 Publish on Vercel (one-time setup)

1. Create the GitHub repo: go to github.com → **New repository** →
   name it `learn-ai-fast` → Create (leave it empty, no README).
2. Push this folder (run these in this folder):
   ```
   git init
   git add -A
   git commit -m "Learn AI Fast - first version"
   git remote add origin https://github.com/YOUR-USERNAME/learn-ai-fast.git
   git branch -M main
   git push -u origin main
   ```
3. Go to vercel.com → **Add New → Project** → Import `learn-ai-fast` →
   Framework preset: **Other** → Deploy. No build settings needed.
4. To use your domain: Vercel → Project → Settings → **Domains** →
   add `www.learnaifast.co.uk`, then update the DNS records where your
   domain is registered (Vercel shows you exactly which records to set).

## ✏️ Editing

- Text: edit the HTML files directly — they're plain, commented, and each
  section is labelled.
- Colours/fonts: everything is defined at the top of `styles.css` in `:root`.
- Preview locally: `npx serve .` (or just open `index.html` in a browser —
  note the menu links use clean URLs, which work once deployed or via `serve`).

## Notes

- On the old Wix site the 90-minute and Business Starter session cards had
  identical bullet points (an artefact of the original images). Kept as-is —
  edit in `lessons.html` if you want the Business card to say something
  different.
- The contact form has no backend: it opens the visitor's own email app with
  the message pre-filled. If you'd rather have messages posted silently, sign
  up at formspree.io (free) and I can wire it in.
