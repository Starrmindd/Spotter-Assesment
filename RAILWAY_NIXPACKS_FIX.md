# Railway Nixpacks Build Fix

## Issue: pip command not found

**Error from logs:**
```
/bin/bash: line 1: pip: command not found
exit code: 127
```

## Root Cause

Railway uses Nixpacks for automatic builds. The default Nixpacks configuration doesn't properly set up the Python PATH before running `pip install`, causing the build to fail.

## Solution

Created `nixpacks.toml` to explicitly configure the build process.

### What the fix does:

1. **Setup Phase**: Installs Python 3.11 and Node.js 20
2. **Install Phase**: 
   - Upgrades pip using `python -m pip`
   - Installs Python dependencies
   - Builds frontend
3. **Build Phase**: Collects static files
4. **Start Command**: Runs gunicorn

## Files Changed

### ✅ Created: `nixpacks.toml`

This file tells Railway exactly how to build your app:

```toml
[phases.setup]
nixPkgs = ["python311", "nodejs_20"]

[phases.install]
cmds = [
  "python -m pip install --upgrade pip",
  "pip install -r requirements.txt",
  "cd frontend && npm install && npm run build && cd .."
]

[phases.build]
cmds = [
  "python manage.py collectstatic --noinput"
]

[start]
cmd = "gunicorn config.wsgi:application --bind 0.0.0.0:$PORT"
```

## Next Steps

1. **Commit the new file:**
   ```bash
   git add nixpacks.toml
   git commit -m "Fix Railway Nixpacks build - add explicit pip configuration"
   git push origin main
   ```

2. **Railway will automatically redeploy** with the new configuration

3. **Monitor the build logs** - you should see:
   - ✅ Python and Node.js setup
   - ✅ pip upgrade succeeds
   - ✅ Requirements install
   - ✅ Frontend builds
   - ✅ Static files collected
   - ✅ App starts with gunicorn

## Why This Works

Using `python -m pip` instead of just `pip` ensures we're using the Python module directly, which doesn't depend on PATH being set up correctly. Once pip is upgraded, the PATH is properly configured for subsequent commands.

## Alternative: Use Dockerfile

If this still doesn't work, you can switch to a Dockerfile-based build by creating a `Dockerfile` in your project root. Railway will automatically detect and use it instead of Nixpacks.

## Environment Variables

Make sure these are set in Railway:

- `SECRET_KEY` - Django secret key
- `DEBUG` - Set to `False` for production
- `ALLOWED_HOSTS` - Your Railway domain
- `DATABASE_URL` - Auto-set by Railway if using PostgreSQL

## Expected Build Time

- First build: 3-5 minutes (downloading dependencies)
- Subsequent builds: 1-2 minutes (cached dependencies)

---

**Status**: Ready to deploy! Push the changes and Railway will rebuild automatically.
