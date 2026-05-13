# Deploying Dominion.io Backend to Railway

## Prerequisites
- Railway account at railway.app
- GitHub repo connected to Railway
- Railway CLI installed: `npm install -g @railway/cli`

## Step 1 — Create Railway Project

1. Go to railway.app → New Project
2. Choose "Deploy from GitHub repo"
3. Select your `dominion-io` repository
4. Railway will auto-detect the Dockerfile

## Step 2 — Set Environment Variables

In Railway dashboard → Variables, add:

```
NODE_ENV=production
PORT=3000
```

Add Firebase vars if using Google auth:
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 3 — Configure Dockerfile

Ensure `Dockerfile` exists at repo root. If not, create it:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:server
EXPOSE 3000
CMD ["node", "dist/server/index.js"]
```

## Step 4 — Deploy

```bash
# Login
railway login

# Link to project
railway link

# Deploy
railway up
```

Or push to GitHub — Railway auto-deploys on every push to main.

## Step 5 — Get Your Backend URL

Railway assigns a URL like `https://dominion-io-production.up.railway.app`

## Step 6 — Connect Frontend

Update your Cloudflare Pages environment variable:
```
VITE_SERVER_URL=https://dominion-io-production.up.railway.app
```

Or set in `.env.local` for local development.

## Step 7 — Verify

1. Open the Railway URL → should return `{"status":"ok"}`
2. Open Dominion.io on Cloudflare Pages
3. Public game lobbies should now appear in the main menu
4. SOLO mode always works without the server

## Troubleshooting

**Build fails**: Check Railway logs → Settings → Deploy Logs

**WebSocket errors**: Railway supports WebSockets natively — no extra config needed

**CORS errors**: Server must allow your Cloudflare Pages domain:
```js
// In server config
cors({ origin: ['https://dominion-io.pages.dev', 'https://dominion.io'] })
```

**Memory limits**: Railway free tier has 512MB RAM. The game server may need Pro plan for 50+ concurrent players.
