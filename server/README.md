# astra-ai-api

Standalone Express + Prisma API for Astra AI. Runs as a plain Node process on a
VPS — no Docker, no Supabase. Auth is custom JWT + bcrypt; storage is a plain
Postgres instance installed directly on the box.

## Local development

```bash
cd server
cp .env.example .env   # fill in DATABASE_URL / JWT_SECRET / GEMINI_API_KEY
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
   cp .env.example .env           # set DATABASE_URL, JWT_SECRET, CORS_ORIGIN, PORT, GEMINI_API_KEY
   npx prisma migrate deploy
   npx prisma generate
   ```

4. **Run under PM2**

   PM2 apps on this VPS are managed from a single shared `/apps/ecosystem.config.cjs`
   (alongside other apps like `omega`, `ams`, `notes-api`), not a per-project config.
   Add an entry there:

   ```js
   {
     name: "astra-ai-api",
     cwd: "/apps/astra-ai/server",
     script: "src/index.js",
     instances: 1,
     exec_mode: "fork",
     env_file: ".env",
     autorestart: true,
     max_restarts: 10,
   },
   ```

   `cwd` must be an absolute path — `__dirname` resolves relative to where
   `ecosystem.config.cjs` itself lives (`/apps`), not this project, so a bare
   `__dirname` breaks the script path.

   ```bash
   cd /apps
   pm2 start ecosystem.config.cjs --only astra-ai-api
   pm2 save
   pm2 startup   # follow the printed instructions to boot on reboot
   ```

5. **Reverse proxy with Nginx** (`/etc/nginx/sites-available/astra-api`):

   Point an `A` record for `astra.kufi.uk` at the VPS's public IP first, then:

   ```nginx
   server {
       listen 80;
       server_name astra.kufi.uk;

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
   sudo certbot --nginx -d astra.kufi.uk   # TLS
   ```

6. Point the frontend's `NEXT_PUBLIC_API_URL` at `https://astra.kufi.uk`, and set `CORS_ORIGIN` in `server/.env` to the frontend's real origin (e.g. `https://astra-ai-six.vercel.app`) — not `localhost`.

## Updating

```bash
git pull
npm ci --omit=dev
npx prisma migrate deploy
pm2 restart astra-ai-api
```
