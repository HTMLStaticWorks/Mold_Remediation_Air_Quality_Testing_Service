# Installation & Deployment Guide

## Overview
AeroPure is an ultra-fast, zero-dependency HTML5/CSS3/ES6+ web application and client portal designed for mold remediation contractors, air quality inspection agencies, and industrial hygiene laboratories.

---

## Local Development Setup

### Option 1: Python HTTP Server (Recommended)
If you have Python installed, open your command prompt or terminal in the project root directory and run:
```bash
python -m http.server 8000
```
Then visit: `http://localhost:8000/`

### Option 2: Node.js (npx serve or live-server)
If you use Node.js:
```bash
npx serve .
```

### Option 3: VS Code Live Server
Right-click on `index.html` in VS Code and select **"Open with Live Server"**.

---

## Production Deployment

### Netlify Deployment
1. Drag and drop the root `Mold Remediation & Air Quality Testing Service` folder into the Netlify Dashboard.
2. Forms can be activated on Netlify by adding `data-netlify="true"` to `<form>`.

### Vercel Deployment
Deploy as a static project:
```bash
npx vercel .
```

### Traditional Apache / NGINX / CPanel
Upload all files to your `public_html` root directory. All assets use clean relative file paths (`assets/` or `../assets/`).

---

## Browser Support & Verification
- Google Chrome 90+
- Apple Safari 14+
- Mozilla Firefox 88+
- Microsoft Edge 90+
- Mobile Safari & Chrome Android
