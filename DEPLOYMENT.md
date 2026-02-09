# Deployment Guide

## Railway Deployment

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and initialize:
```bash
railway login
railway init
```

3. Set environment variables:
```bash
railway variables set SECRET_KEY="your-secret-key"
railway variables set DEBUG="False"
railway variables set ALLOWED_HOSTS="your-app.railway.app"
```

4. Deploy:
```bash
railway up
```

## Render Deployment

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: eld-trip-planner
    env: python
    buildCommand: "pip install -r requirements.txt && cd frontend && npm install && npm run build && cd .. && python manage.py collectstatic --noinput"
    startCommand: "gunicorn config.wsgi"
    envVars:
      - key: SECRET_KEY
        generateValue: true
      - key: DEBUG
        value: False
      - key: PYTHON_VERSION
        value: 3.11.7
```

2. Connect GitHub repo and deploy

## Fly.io Deployment

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Create `fly.toml`:
```toml
app = "eld-trip-planner"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8000"

[[services]]
  http_checks = []
  internal_port = 8000
  processes = ["app"]
  protocol = "tcp"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

3. Deploy:
```bash
fly launch
fly secrets set SECRET_KEY="your-secret-key"
fly deploy
```

## VPS Deployment (Ubuntu)

1. Install dependencies:
```bash
sudo apt update
sudo apt install python3.11 python3-pip nginx
```

2. Clone and setup:
```bash
git clone your-repo
cd eld-trip-planner
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. Build frontend:
```bash
cd frontend
npm install
npm run build
cd ..
```

4. Collect static files:
```bash
python manage.py collectstatic --noinput
```

5. Setup Gunicorn service:
```bash
sudo nano /etc/systemd/system/eld-planner.service
```

```ini
[Unit]
Description=ELD Trip Planner
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/eld-trip-planner
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/gunicorn config.wsgi:application --bind 0.0.0.0:8000

[Install]
WantedBy=multi-user.target
```

6. Setup Nginx:
```bash
sudo nano /etc/nginx/sites-available/eld-planner
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /path/to/eld-trip-planner/staticfiles/;
    }
}
```

7. Enable and start:
```bash
sudo systemctl enable eld-planner
sudo systemctl start eld-planner
sudo systemctl enable nginx
sudo systemctl restart nginx
```

## Environment Variables

Required for all deployments:

- `SECRET_KEY`: Django secret key (generate with `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
- `DEBUG`: Set to `False` in production
- `ALLOWED_HOSTS`: Your domain(s), comma-separated
- `MAPBOX_TOKEN`: (Optional) For enhanced mapping features

## Post-Deployment Checklist

- [ ] Environment variables set
- [ ] Static files collected
- [ ] HTTPS enabled
- [ ] Database migrations run (if using DB)
- [ ] Health check endpoint responding
- [ ] Error logging configured
- [ ] Backup strategy in place

## Monitoring

Add health check endpoint in `trips/views.py`:

```python
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "healthy"})
```

Add to `trips/urls.py`:
```python
path('health/', health_check, name='health'),
```

## Troubleshooting

### Static files not loading
```bash
python manage.py collectstatic --noinput
```

### CORS errors
Check `CORS_ALLOWED_ORIGINS` in settings.py

### Route calculation fails
- Check OSRM service availability
- Verify geocoding service access
- Review fallback logic in RouteService

### Memory issues
Increase Gunicorn workers:
```bash
gunicorn config.wsgi --workers 4 --timeout 120
```
