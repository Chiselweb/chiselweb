# ChiselWeb Website

Static two-page website for ChiselWeb. Built with vanilla HTML, CSS, and JavaScript. No build step required.

## Files

```
index.html      — Home page
contact.html    — Contact page
styles.css      — Shared stylesheet
script.js       — Scroll animations (home page only)
README.md       — This file
```

## Deploying to GitHub Pages

### 1. Create a GitHub repository

1. Go to [github.com](https://github.com) and create a new **public** repository (e.g. `chiselweb-site`).
2. Push these files to the `main` branch:

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/chiselweb-site.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository → **Settings** → **Pages**.
2. Under **Source**, select **Deploy from a branch**.
3. Choose branch: `main`, folder: `/ (root)`.
4. Click **Save**.

Your site will be live at `https://YOUR_USERNAME.github.io/chiselweb-site/` within a minute or two.

---

## Pointing a Hostinger domain at GitHub Pages

### Step 1 — Add a custom domain in GitHub

1. In your repo → **Settings** → **Pages** → **Custom domain**.
2. Enter your domain (e.g. `chiselweb.co.uk`) and click **Save**.
3. GitHub will create a `CNAME` file in your repo automatically.

### Step 2 — Configure DNS in Hostinger

Log in to Hostinger → **Domains** → **DNS / Nameservers** → **Manage DNS Records**.

**For an apex domain (chiselweb.co.uk)** — add four `A` records:

| Type | Host | Points to         | TTL  |
|------|------|-------------------|------|
| A    | @    | 185.199.108.153   | 3600 |
| A    | @    | 185.199.109.153   | 3600 |
| A    | @    | 185.199.110.153   | 3600 |
| A    | @    | 185.199.111.153   | 3600 |

**For www subdomain** — add a `CNAME` record:

| Type  | Host | Points to                              | TTL  |
|-------|------|----------------------------------------|------|
| CNAME | www  | YOUR_USERNAME.github.io                | 3600 |

### Step 3 — Wait for DNS propagation

DNS changes typically propagate within 15–60 minutes. Once live, GitHub Pages will automatically provision an SSL certificate via Let's Encrypt.

Tick **Enforce HTTPS** in GitHub Pages settings once the certificate is issued.

---

## Setting up the contact form

1. Go to [formspree.io](https://formspree.io) and create a free account.
2. Create a new form and copy the endpoint ID (looks like `xabcdefg`).
3. In `contact.html`, replace `REPLACE_WITH_ID` with your ID:

```html
action="https://formspree.io/f/xabcdefg"
```

4. Commit and push. Form submissions will arrive in your Formspree dashboard and be forwarded to your email.

---

## Local development

Open `index.html` directly in a browser, or use any static file server:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```
