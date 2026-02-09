# ⚡ Quick Deploy Reference

## 🚀 Deploy in 3 Commands

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Deploy" && git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main

# 2. Go to Render
# Visit: https://render.com → Sign up → New Web Service → Connect repo

# 3. Done!
# Your app deploys automatically via render.yaml
```

---

## 📋 What You Need

1. **GitHub account** (free)
2. **Render account** (free)
3. **5 minutes**

---

## 🎯 Render Auto-Configuration

The `render.yaml` file handles everything:
- ✅ Python 3.11
- ✅ PostgreSQL database
- ✅ Build command
- ✅ Start command
- ✅ Environment variables

Just click "Create Web Service" and wait!

---

## 🔗 Important URLs

- **Render**: https://render.com
- **GitHub**: https://github.com/new
- **Your App**: `https://your-app-name.onrender.com`

---

## ⏱️ Timeline

- **Push to GitHub**: 2 minutes
- **Connect to Render**: 2 minutes
- **Build & Deploy**: 5-10 minutes
- **Total**: ~15 minutes

---

## 🐛 Quick Fixes

### Build fails?
Check logs in Render dashboard

### App won't start?
Verify `gunicorn` in requirements.txt

### Static files missing?
Check `collectstatic` ran in build logs

### Database error?
Ensure `DATABASE_URL` is set

---

## ✅ Success Check

Your app works if:
- ✅ URL loads
- ✅ Can calculate trip
- ✅ Map displays
- ✅ ELD logs show

---

## 📚 Full Guides

- **Detailed**: `FREE_HOSTING_GUIDE.md`
- **Step-by-step**: `DEPLOY_NOW.md`
- **Checklist**: `DEPLOYMENT_CHECKLIST.md`
- **GitHub**: `GITHUB_SETUP.md`

---

## 💡 Pro Tip

Keep app awake (free tier sleeps):
1. Sign up: https://uptimerobot.com
2. Add monitor with your URL
3. Set interval: 10 minutes
4. App stays awake 24/7!

---

## 🎉 That's It!

**Cost**: $0
**Time**: 15 minutes
**Difficulty**: Easy

Deploy now! 🚀
