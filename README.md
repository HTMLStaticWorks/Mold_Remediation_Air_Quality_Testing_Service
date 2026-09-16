# AeroPure Environmental — Mold Remediation & Air Quality Testing Service Template

> A modern, multi-page web platform and client portal designed for environmental health diagnostics, certified mold remediation contractors, and air quality testing laboratories.

---

## Key Highlights

- **Clinical & Trustworthy Aesthetics:** Custom-designed color system built around clean air (medical teal `#0D9488`, luminous aqua `#14B8A6`), natural health (sage emerald `#10B981`), and hazard warning accents (`#EF4444`).
- **Two Structurally Distinct Homepages:**
  - **Home 1 ("Breathe Safe Indoors"):** Trust & clinical reassurance narrative featuring 3D tilt cards, 4-step process timeline, client reviews with verified clearance badges, and scheduling micro-form.
  - **Home 2 ("The Hidden Danger in Your Air"):** Risk/data-driven editorial narrative featuring an **interactive animated AQI & Mold Spore Gauge Meter**, **Before & After drag comparison slider**, health hazard blocks, and regional coverage map.
- **Client Portal Dashboard (Login-Gated):**
  - Instant **1-Click Demo Login** button pre-filled with test credentials.
  - **Overview:** Job status snapshot, environmental health score (96/100), and next inspection visit.
  - **Schedule Inspection:** Interactive appointment booking calendar.
  - **Job Status Tracker:** 6-stage visual pipeline with timestamped forensic logs.
  - **Air Quality Reports:** Table of downloadable lab tests with modal certificate viewer.
  - **Before & After Documentation:** High-res project photo logs.
  - **Invoices & Billing:** Itemized invoices with simulated Stripe payment gateway and instant receipt generation.
  - **Direct Messages:** Interactive chat thread with assigned Lead Industrial Hygienist.
  - **Settings:** Profile and SMS alert toggles.
  - **Skeleton Loaders:** Realistic transition states when switching tabs.
- **3D Tilt Cards Engine:**
  - Cursor-tracking 3D perspective transform with dynamic specular glare.
  - Centered icon and text alignment in ALL viewports.
  - Micro-animations: pulsing clean air ripple & shield checkmark.
  - Touch-device graceful degradation.
- **Full Dark / Light Mode:** Custom toggle with auto-detection of `prefers-color-scheme` and `localStorage` persistence.
- **Full RTL (Right-to-Left) Support:** Built-in bidirectional switcher supporting Arabic & Hebrew with mirrored components.
- **Zero-Tolerance Responsive QA:** Flawless reflow tested across Mobile (<640px), Tablet (640-1024px), Desktop, and specifically the 1024px breakpoint.
- **Production SEO & Security:** JSON-LD `LocalBusiness` & `Service` schemas, meta descriptions, unique title tags, `robots.txt`, and `sitemap.xml`.

---

## Quickstart

Run a local HTTP server in the project directory:

```bash
# Using Python:
python -m http.server 8000

# Using Node.js:
npx serve .
```

Navigate to: `http://localhost:8000/`

---

## Site Navigation Map

| Page | File | Description |
| :--- | :--- | :--- |
| **Home 1** | `index.html` | Primary landing page (6 sections, trust narrative) |
| **Home 2** | `pages/home-2.html` | Alternate landing page (6 sections, risk narrative + AQI gauge) |
| **About Us** | `pages/about.html` | 4 sections (Origin story, mission, team, certifications) |
| **Services** | `pages/services.html` | 4 sections (Overview, inspection, remediation, air testing) |
| **Pricing** | `pages/pricing.html` | 4 sections (Philosophy, 3 tiered packages, FAQs, custom quote) |
| **Contact** | `pages/contact.html` | 4 sections (Urgent alert, form & map, hours, emergency protocol) |
| **Client Login** | `pages/login.html` | Split-screen portal login with 1-click demo button |
| **Client Register** | `pages/register.html` | Client portal registration form |
| **Client Dashboard** | `pages/dashboard.html` | Full 8-module client portal dashboard |
| **404 Error** | `pages/404.html` | On-theme "Page Evaporated" error page with search bar |
| **Coming Soon** | `pages/coming-soon.html` | Enterprise pathogen portal with live countdown timer |
| **Documentation** | `documentation/index.html` | Interactive developer & installation documentation |

---

## Documentation

Full guides are available in the `/documentation` directory:
- [Installation Guide](file:///documentation/installation.md)
- [Customization Guide](file:///documentation/customization.md)
- [Page Structure](file:///documentation/page-structure.md)
- [Credits & Licenses](file:///documentation/credits.md)
- [Changelog](file:///documentation/changelog.md)
