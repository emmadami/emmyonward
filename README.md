# All-in-One Finance Platform

✅ Pay bills  
✅ Trade crypto  
✅ Trade gift cards  
✅ P2P transactions  
✅ Accept payments with Stripe

## 📌 Quick Start

```bash
# Backend
cd server
npm install
npm run dev

# Frontend
### Quick Deploy Commands

```bash
# Docker Deployment
npm run deploy:docker

# Vercel Deployment  
npm run deploy:vercel

# Netlify Deployment
npm run deploy:netlify

# Railway Deployment
npm run deploy:railway

# Render Deployment
npm run deploy:render
```

### Platform-Specific Instructions

#### 🐳 Docker Deployment
```bash
# Production build and deploy
docker-compose -f docker-compose.production.yml up -d
```

#### 🔺 Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `npm run deploy:vercel`

#### 🌐 Netlify Deployment
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Login: `netlify login`
3. Deploy: `npm run deploy:netlify`

#### 🚂 Railway Deployment
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Deploy: `npm run deploy:railway`

#### 🎨 Render Deployment
1. Connect your GitHub repository to Render
2. Use the provided `render.yaml` configuration
3. Push to main branch for auto-deployment
