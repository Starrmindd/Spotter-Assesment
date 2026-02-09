# 🚀 Free Hosting Guide for ELD Trip Planner

## Best Free Hosting Options

### 🥇 Option 1: Render.com (RECOMMENDED)
**Why**: Easy setup, generous free tier, auto-deploys from GitHub

**Free Tier Includes**:
- 750 hours/month (enough for 24/7)
- Auto-sleep after 15 min inactivity (wakes on request)
- PostgreSQL database (90 days retention)
- Custom domain support

**Steps**:
1. Push code to GitHub
2. Go to https://render.com
3. Sign up with GitHub
4. Click "New +" → "Web Service"
5. Connect your repository
6. Configure:
   - **Name**: eld-trip-planner
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt && cd frontend && npm install && npm run build && cd .. && python manage.py collectstatic --noinput`
   - **Start Command**: `gunicorn config.wsgi:application`
7. Add environment variables (see below)
8. Click "Create Web Service"

**Environment Variables**:
```
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-app-name.onrender.com
DATABASE_URL=postgresql://... (auto-provided)
```

---

### 🥈 Option 2: Railway.app
**Why**: Modern, fast deploys, great DX

**Free Tier Includes**:
- $5 credit/month (enough for small apps)
- Auto-sleep after inactivity
- PostgreSQL included

**Steps**:
1. Push code to GitHub
2. Go to https://railway.app
3. Sign up with GitHub
4. Click "New Project" → "Deploy from GitHub repo"
5. Select your repository
6. Railway auto-detects Django
7. Add environment variables
8. Deploy!

---

### 🥉 Option 3: Fly.io
**Why**: Global edge network, fast performance

**Free Tier Includes**:
- 3 shared-cpu VMs
- 3GB persistent storage
- 160GB outbound data

**Steps**:
1. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Run: `fly auth signup`
3. Run: `fly launch` (in project directory)
4. Follow prompts
5. Deploy: `fly deploy`

---

### 🎯 Option 4: PythonAnywhere
**Why**: Python-focused, simple setup

**Free Tier Includes**:
- 1 web app
- 512MB storage
- Daily CPU quota

**Steps**:
1. Go to https://www.pythonanywhere.com
2. Sign up for free account
3. Upload code via Git or file upload
4. Configure web app in dashboard
5. Set WSGI file to point to `config.wsgi`

---

## 📋 Pre-Deployment Checklist

### 1. Update Django Settings
Already configured in `config/settings.py`:
- ✅ WhiteNoise for static files
- ✅ Environment variables
- ✅ ALLOWED_HOSTS from env
- ✅ DEBUG from env

### 2. Ensure Dependencies
Check `requirements.txt` includes:
- ✅ gunicorn (production server)
- ✅ whitenoise (static files)
- ✅ psycopg2-binary (PostgreSQL)

### 3. Build Frontend
```bash
cd frontend
npm install
npm run build
cd ..
```

### 4. Collect Static Files
```bash
python manage.py collectstatic --noinput
```

### 5. Create Procfile (for Render/Railway)
Already exists: `Procfile`

---

## 🔧 Quick Deploy: Render.com (Step-by-Step)

### Step 1: Prepare Your Code
```bash
# Make sure everything is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Sign Up on Render
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub

### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Click "Connect account" to link GitHub
3. Find your repository and click "Connect"

### Step 4: Configure Service
Fill in these settings:

**Basic Settings**:
- **Name**: `eld-trip-planner` (or your choice)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Runtime**: `Python 3`

**Build Settings**:
- **Build Command**:
```bash
pip install -r requirements.txt && cd frontend && npm install && npm run build && cd .. && python manage.py collectstatic --noinput
```

- **Start Command**:
```bash
gunicorn config.wsgi:application
```

**Advanced Settings** (click "Advanced"):
- **Environment Variables** - Add these:
  - `SECRET_KEY` = `django-insecure-change-this-to-random-string`
  - `DEBUG` = `False`
  - `ALLOWED_HOSTS` = `your-app-name.onrender.com`
  - `PYTHON_VERSION` = `3.11.0`

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for build
3. Your app will be live at: `https://your-app-name.onrender.com`

### Step 6: Run Migrations (First Time Only)
1. In Render dashboard, go to your service
2. Click "Shell" tab
3. Run: `python manage.py migrate`

---

## 🎨 Custom Domain (Optional)

### On Render:
1. Go to your service settings
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records as shown

---

## ⚡ Performance Tips

### 1. Keep App Awake (Render)
Free tier sleeps after 15 min. To keep it awake:
- Use a service like UptimeRobot (free)
- Ping your app every 10 minutes

### 2. Optimize Build Time
- Cache npm dependencies
- Use `--production` flag for npm

### 3. Database
- Use PostgreSQL (provided free by Render)
- SQLite won't work on Render (ephemeral filesystem)

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure `requirements.txt` is complete
- Verify Node.js is available

### Static Files Not Loading
- Check `STATIC_ROOT` in settings
- Verify `collectstatic` ran in build
- Check WhiteNoise is in MIDDLEWARE

### Database Errors
- Run migrations: `python manage.py migrate`
- Check DATABASE_URL is set

### App Crashes
- Check logs in Render dashboard
- Verify `gunicorn` is in requirements.txt
- Check `ALLOWED_HOSTS` includes your domain

---

## 💰 Cost Comparison

| Platform | Free Tier | Sleep? | Database | Best For |
|----------|-----------|--------|----------|----------|
| **Render** | 750 hrs/mo | Yes (15min) | PostgreSQL | Easy setup |
| **Railway** | $5 credit/mo | Yes | PostgreSQL | Modern DX |
| **Fly.io** | 3 VMs | No | Separate | Performance |
| **PythonAnywhere** | 1 app | No | MySQL | Python focus |

---

## 🎯 My Recommendation

**Use Render.com** because:
1. ✅ Easiest setup (5 minutes)
2. ✅ Auto-deploys from GitHub
3. ✅ Free PostgreSQL included
4. ✅ Great documentation
5. ✅ Perfect for Django apps

---

## 📚 Additional Resources

- [Render Django Guide](https://render.com/docs/deploy-django)
- [Railway Django Guide](https://docs.railway.app/guides/django)
- [Fly.io Django Guide](https://fly.io/docs/django/)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/)

---

## 🚀 Ready to Deploy?

1. Choose a platform (I recommend Render)
2. Push code to GitHub
3. Follow the steps above
4. Your app will be live in 10 minutes!

**Need help?** Check the troubleshooting section or platform docs.
