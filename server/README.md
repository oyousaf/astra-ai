# astra-ai-api

Standalone Express + Prisma API for Astra AI. Runs as a plain Node process on a
VPS — no Docker, no Supabase. Auth is custom JWT + bcrypt; storage is a plain
Postgres instance installed directly on the box.

## Local development

```bash
cd server
cp .env.example .env   # fill in DATABASE_URL / JWT_SECRET
npm install
npm run prisma:migrate # creates the DB schema
npm run dev            # http://localhost:4000
```

## VPS setup (Ubuntu/Debian, no Docker)

1. **Install Node and Postgres**
   ```bash
   sudo apt update
   sudo apt install -y postgresql postgresql-contrib
   # Node: use nvm or NodeSource, e.g.
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt install -y nodejs
   sudo npm install -g pm2
   ```

2. **Create the database and role**
   ```bash
   sudo -u postgres psql
   CREATE ROLE astra WITH LOGIN PASSWORD 'CHANGE_ME';
   CREATE DATABASE astra_ai OWNER astra;
   \q
   ```

3. **Deploy the app**
   ```bash
   git clone <your-repo-url> astra-ai
   cd astra-ai/server
   npm ci --omit=dev
   npm install prisma --no-save   # prisma CLI for migrate deploy
   cp .env.example .env           # set DATABASE_URL, JWT_SECRET, CORS_ORIGIN, PORT
   npx prisma migrate deploy
   npx prisma generate
   ```

4. **Run under PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup   # follow the printed instructions to boot on reboot
   ```

5. **Reverse proxy with Nginx** (`/etc/nginx/sites-available/astra-api`):
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:4000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   ```bash
   sudo ln -s /etc/nginx/sites-available/astra-api /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo certbot --nginx -d api.yourdomain.com   # TLS
   ```

6. Point the frontend's `NEXT_PUBLIC_API_URL` at `https://api.yourdomain.com`.

## Updating

```bash
git pull
npm ci --omit=dev
npx prisma migrate deploy
pm2 restart astra-ai-api
```
