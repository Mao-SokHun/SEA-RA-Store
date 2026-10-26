# 🚀 Production Deployment Guide - Game Account Marketplace Backend

This guide outlines step-by-step instructions to deploy the Game Account Marketplace Backend in production.

---

## Option 1: Docker Compose (Recommended)

### Prerequisites
- Docker Engine & Docker Compose installed
- Domain pointed to server IP (e.g., `api.yourdomain.com`)

### 1. Configure Environment
Copy `.env.example` to `.env` and fill in production secrets:
```bash
cp .env.example .env
nano .env
```

Ensure:
- `NODE_ENV=production`
- `DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@postgres:5432/game_marketplace?schema=public`
- `REDIS_HOST=redis`
- `JWT_ACCESS_SECRET` and `ENCRYPTION_KEY` are cryptographically random 32-byte strings.
- `BAKONG_API_TOKEN` contains your NBC Bakong Open API JWT token.

### 2. Launch Services
```bash
docker compose up -d --build
```

### 3. Run Prisma Migrations
```bash
docker compose exec backend npx prisma db push
```

### 4. Verify Health
```bash
curl http://localhost:5000/health
```

---

## Option 2: VPS Direct (Ubuntu 22.04 / 24.04 with PM2 & Nginx)

### 1. Install Node.js 20 & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pm2
```

### 2. Build Backend
```bash
cd /var/www/marketplace/backend
npm ci
npx prisma generate
npm run build
```

### 3. Start with PM2
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 4. Nginx Reverse Proxy with SSL (Certbot)
Create `/etc/nginx/sites-available/api.yourdomain.com`:
```nginx
server {
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site & get free SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/api.yourdomain.com /etc/nginx/sites-enabled/
sudo certbot --nginx -d api.yourdomain.com
sudo systemctl reload nginx
```

---

## Automated Background Workers (Cron)
The backend includes built-in background cron services that automatically start on boot:
- **15-Min Reservation Lock Release**: Runs every 60 seconds (cancels unpaid reservations and returns accounts to available).
- **Escrow Auto-Release**: Runs every 10 minutes (releases funds to sellers 24 hours after delivery if no disputes exist).
- **Token Cleanup**: Runs daily (purges expired refresh & password reset tokens).

To manually trigger any cron job from Admin dashboard:
```http
POST /api/v1/admin/cron/trigger
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{ "job": "all" }
```
