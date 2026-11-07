# Deploy Guide — Netlify (Frontend) + Render (Backend)

## Overview
- Frontend → Netlify (free)
- Backend → Render (free)
- Form emails → your Gmail (via SMTP)

---

## Step 1: Gmail App Password (5 min)

1. Open: https://myaccount.google.com/security
2. Turn ON **2-Step Verification** (if not already)
3. Open: https://myaccount.google.com/apppasswords
4. App = Mail, Device = Other → name it `CodeVibe`
5. Copy the **16-character password** (looks like `abcd efgh ijkl mnop`)
6. Keep it safe — you will paste it on Render

---

## Step 2: Deploy Backend on Render

1. Go to https://render.com → Sign up (GitHub login is easiest)
2. **New +** → **Web Service**
3. Connect your GitHub repo (or upload the `backend` folder)
4. Settings:
   - **Name:** `code-vibe-api`
   - **Root Directory:** `backend` (if whole repo is connected)
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance type:** Free
5. **Environment Variables** — add these:

| Key | Value |
|-----|--------|
| `ENVIRONMENT` | `production` |
| `CORS_ORIGINS` | `https://YOUR-SITE.netlify.app` (update after Netlify deploy) |
| `NOTIFY_EMAIL` | `thecodevibehack@gmail.com` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `thecodevibehack@gmail.com` |
| `SMTP_PASSWORD` | *(your 16-char App Password, no spaces)* |
| `SMTP_FROM` | `The Code Vibe <thecodevibehack@gmail.com>` |

6. Click **Create Web Service**
7. Wait for deploy. Copy your backend URL, e.g.  
   `https://code-vibe-api.onrender.com`

Test: open `https://YOUR-BACKEND.onrender.com/api/health`  
You should see `"email_notifications": { "configured": true }`

---

## Step 3: Deploy Frontend on Netlify

1. Go to https://app.netlify.com → **Add new site**
2. **Import from Git** (or drag-drop `frontend` folder for manual)
3. Build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
4. **Environment variables** (Site settings → Environment variables):

| Key | Value |
|-----|--------|
| `VITE_API_BASE_URL` | `https://code-vibe-api.onrender.com` *(your Render URL, no trailing slash)* |
| `VITE_CONTACT_EMAIL` | `thecodevibehack@gmail.com` |
| `VITE_ADMIN_EMAILS` | `thecodevibehack@gmail.com` |
| + your existing Firebase keys | (already in frontend/.env) |

5. Deploy
6. Copy your Netlify URL: `https://something.netlify.app`

---

## Step 4: Connect both (CORS)

1. Go back to **Render** → your web service → Environment
2. Update `CORS_ORIGINS` to your Netlify URL:  
   `https://something.netlify.app`
3. Save → Render will redeploy automatically

---

## Step 5: Test the form

1. Open your Netlify site → Collaborate page
2. Fill and submit the form
3. Check inbox of `thecodevibehack@gmail.com`
4. You should get an email with all form details

If email does not arrive:
- Check spam folder
- Confirm Render `/api/health` shows `"email_notifications": { "configured": true }`
- Confirm App Password has no spaces
- Check Render logs for SMTP errors

---

## Free tier notes

- **Render free:** spins down after ~15 min idle. First request after sleep can take 30–60 sec.
- **Netlify free:** plenty for this site.
- For always-on backend later: Render paid (~$7/mo) or Railway.

---

## Local testing (optional)

```bash
# Terminal 1 — backend
cd backend
# fill backend/.env with same SMTP values
pip install -r requirements.txt
python main.py

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

## Collaborate form email fix (updated)

The Collaborate API now reports whether SMTP actually sent the notification. If the backend accepts the application but SMTP is not configured or delivery fails, the frontend tries the Netlify/FormSubmit email route instead of displaying a false success. FormSubmit errors are also surfaced to the user.

For a Netlify-only deployment, open **Site configuration → Environment variables** and set:

- `VITE_CONTACT_EMAIL` = `thecodevibehack@gmail.com`
- Keep `VITE_API_BASE_URL` empty unless you have deployed the FastAPI backend.

Then trigger **Deploys → Trigger deploy → Clear cache and deploy site**. On the first FormSubmit submission, FormSubmit may send a one-time activation/confirmation email to the destination inbox. Open that message and confirm the address; submissions will not reach the inbox until that step is completed. Check Spam/Promotions too.

If you deploy the backend, configure `NOTIFY_EMAIL`, `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER`, and a Gmail App Password as Render environment variables. Do not put the App Password in frontend variables or commit it to Git.
