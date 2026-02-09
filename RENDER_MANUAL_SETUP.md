# 🔧 Render Manual Setup Guide

## Problem
Render is ignoring `render.yaml` and using wrong start command (`gunicorn app:app`).

## Solution: Manual Configuration

### Step 1: Go to Service Settings
1. Log into Render: https://dashboard.render.com
2. Click on your service (eld-trip-planner)
3. Click **"Settings"** tab (left sidebar)

### Step 2: Update Build & Deploy Settings

Scroll down to **"Build & Deploy"** section and set:

**Build Command:**
```bash
pip install -r requirements.txt && cd frontend && npm install && npm run build && cd .. && python manage.py collectstatic --no-input && python manage.py migrate
```

**Start Command:**
```bash
gunicorn config.wsgi:application
```

### Step 3: Set Environment Variables

Scroll to **"Environment Variables"** section and add:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11.0` |
| `SECRET_KEY` | (Click "Generate" button) |
| `DEBUG` | `False` |

### Step 4: Save and Deploy

1. Click **"Save Changes"** at the bottom
2. Go to **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait 5-10 minutes for build

---

## Alternative: Fresh Start (Recommended)

If manual config doesn't work, delete and recreate:

### Step 1: Delete Current Service
1. Go to service settings
2. Scroll to bottom
3. Click **"Delete Web Service"**
4. Confirm deletion

### Step 2: Create New Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo: `Spotter-Assesment`
3. Render should auto-detect `render.yaml`
4. Click **"Create Web Service"**

This time it should use the correct configuration from `render.yaml`.

---

## What Should Happen

After successful deployment:
- ✅ Build completes without errors
- ✅ App starts with `gunicorn config.wsgi:application`
- ✅ Your app is live at: `https://eld-trip-planner.onrender.com`

---

## Still Having Issues?

Try **Railway** instead - it's working better for Django apps right now:

1. Go to: https://railway.app
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select `Spotter-Assesment`
5. Railway auto-detects Django and deploys!

Railway is simpler and doesn't have these configuration issues.
