# 📦 GitHub Setup Guide

## Quick Setup (5 Minutes)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `eld-trip-planner` (or your choice)
   - **Description**: "Full-stack ELD Trip Planner with Django + React"
   - **Visibility**: Public (required for free hosting)
3. **Don't** initialize with README (we already have one)
4. Click "Create repository"

### Step 2: Push Your Code

Open terminal in your project folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ELD Trip Planner ready for deployment"

# Set main branch
git branch -M main

# Add remote (replace with YOUR repository URL)
git remote add origin https://github.com/YOUR_USERNAME/eld-trip-planner.git

# Push to GitHub
git push -u origin main
```

### Step 3: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files
3. Check that these key files are present:
   - ✅ `requirements.txt`
   - ✅ `Procfile`
   - ✅ `build.sh`
   - ✅ `render.yaml`
   - ✅ `runtime.txt`
   - ✅ `config/settings.py`
   - ✅ `frontend/` folder

---

## 🎯 What to Include

### ✅ Include These Files
- All Python code (`.py` files)
- All React code (`frontend/src/`)
- Configuration files (`requirements.txt`, `Procfile`, etc.)
- Frontend build (`frontend/dist/`) - needed for deployment
- Templates (`templates/`)
- Static files configuration

### ❌ Don't Include These
- `__pycache__/` folders
- `venv/` or `env/` folders
- `db.sqlite3` (local database)
- `.env` file (secrets)
- `node_modules/` (too large)
- IDE files (`.vscode/`, `.idea/`)

The `.gitignore` file handles this automatically!

---

## 🔐 Environment Variables

**Never commit these to GitHub**:
- `SECRET_KEY`
- Database passwords
- API keys
- `.env` file

Instead, set them in your hosting platform (Render/Railway).

---

## 📝 Repository Description

Use this for your GitHub repo description:

```
Full-stack ELD Trip Planner for trucking logistics. 
Built with Django REST Framework + React + Leaflet. 
Features: Route planning, HOS compliance, DOT-style ELD logs, 
70-hour cycle tracking, and interactive maps.
```

---

## 🏷️ Add Topics (Tags)

Add these topics to your GitHub repo for discoverability:
- `django`
- `react`
- `eld`
- `trucking`
- `logistics`
- `hos-compliance`
- `route-planning`
- `leaflet`
- `full-stack`
- `python`
- `javascript`

---

## 📄 Update README

Your `README.md` should include:
- ✅ Project description
- ✅ Features list
- ✅ Tech stack
- ✅ Setup instructions
- ✅ Deployment guide
- ✅ Screenshots (optional)
- ✅ Live demo link (after deployment)

---

## 🚀 After Pushing to GitHub

### Next Steps:
1. ✅ Code is on GitHub
2. ➡️ Deploy to Render/Railway (see `DEPLOY_NOW.md`)
3. ➡️ Add live demo link to README
4. ➡️ Share your project!

---

## 🔄 Making Updates

After deployment, to update your app:

```bash
# Make your changes
# ...

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

Render/Railway will automatically detect the push and redeploy!

---

## 🐛 Troubleshooting

### "Permission denied" error
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/eld-trip-planner.git
```

### "Repository not found"
- Check the URL is correct
- Ensure repository is created on GitHub
- Verify you're logged in

### Large files error
- Check `.gitignore` is working
- Remove `node_modules/` if accidentally added:
```bash
git rm -r --cached node_modules
git commit -m "Remove node_modules"
```

---

## ✅ Checklist

Before deploying, verify:
- [ ] Code pushed to GitHub
- [ ] Repository is public
- [ ] All required files present
- [ ] No sensitive data in commits
- [ ] `.gitignore` working correctly
- [ ] README updated
- [ ] Ready to deploy!

---

## 🎉 You're Ready!

Your code is now on GitHub and ready for deployment.

**Next**: Follow `DEPLOY_NOW.md` to deploy to Render or Railway.
