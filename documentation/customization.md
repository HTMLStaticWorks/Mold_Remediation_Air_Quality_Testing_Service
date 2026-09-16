# Customization Guide

This guide explains how to customize colors, typography, brand assets, dashboard data, and form integrations.

---

## 1. Changing Brand Colors
All colors are configured via CSS Custom Properties in `assets/css/style.css`. Locate the `:root` block:

```css
:root {
  /* Change the primary clean air color */
  --primary: #0D9488;          /* Brand Primary (Medical Teal) */
  --primary-light: #14B8A6;    /* Luminous Hover */
  --primary-dark: #0F766E;     /* Active / Gradient end */
  --primary-surface: #F0FDFA;  /* Card subtle highlight */

  /* Change health/nature secondary color */
  --secondary: #059669;        /* Sage / Emerald */
  --secondary-light: #10B981;  

  /* Hazard & Warning colors */
  --accent-red: #EF4444;       /* Mold spore hazard alert */
  --accent-amber: #F59E0B;     /* Warning moisture indicator */
}
```

Dark mode equivalents can be adjusted inside `assets/css/dark-mode.css` under `[data-theme="dark"]`.

---

## 2. Typography
The template imports Google Fonts in `assets/css/style.css`:
- **Headings & Display:** `Plus Jakarta Sans`
- **Body & Forms:** `Inter`
- **Data & Telemetry:** `JetBrains Mono`

To switch to a different typeface (e.g. `Sora` or `Outfit`), update the `@import` URL at the top of `style.css` and modify:
```css
:root {
  --font-display: 'Your Font', sans-serif;
  --font-body: 'Your Body Font', sans-serif;
}
```

---

## 3. Brand Logo
The brand logo uses inline SVG or `assets/images/logo.svg`. You can replace the text "AEROPURE" or substitute an `<img>` tag pointing to your company's SVG/PNG logo.

---

## 4. Client Dashboard Customization
Dashboard mock records are rendered in `pages/dashboard.html` and managed by `assets/js/dashboard.js`:
- **Active Job ID:** Update `#AP-2026-8941` to your customer's job ticket number.
- **Stage Tracker:** Set classes `.completed` or `.active` on `.tracker-step` elements to reflect real project progress.
- **Lab Reports:** Add or remove `<tr>` entries in the reports table with links to your generated PDF certificates.
- **Invoices:** Update amount, invoice number, and status pills.

---

## 5. Connecting Real Form Backends
All forms include `data-validate="true"` attributes and validate emails and required inputs client-side:
- **Formspree:** Change `<form action="https://formspree.io/f/YOUR_ID" method="POST">`
- **Netlify Forms:** Add `data-netlify="true"` and `name="contact"` to your `<form>`.
