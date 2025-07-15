#!/bin/bash

# Deployment script for finance platform
set -e

echo "🚀 Starting deployment process..."

# Check if environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Supabase environment variables not set"
    exit 1
fi

# Build and deploy based on platform
case "$1" in
    "docker")
        echo "📦 Building Docker containers..."
        docker-compose -f docker-compose.production.yml build
        docker-compose -f docker-compose.production.yml up -d
        echo "✅ Docker deployment complete!"
        ;;
    "vercel")
        echo "🔺 Deploying to Vercel..."
        npx vercel --prod
        echo "✅ Vercel deployment complete!"
        ;;
    "netlify")
        echo "🌐 Deploying to Netlify..."
        npx netlify deploy --prod
        echo "✅ Netlify deployment complete!"
        ;;
    "railway")
        echo "🚂 Deploying to Railway..."
        npx @railway/cli deploy
        echo "✅ Railway deployment complete!"
        ;;
    "render")
        echo "🎨 Deploying to Render..."
        echo "Please push to your connected Git repository"
        echo "✅ Render will auto-deploy from Git!"
        ;;
    *)
        echo "Usage: $0 {docker|vercel|netlify|railway|render}"
        echo "Available deployment options:"
        echo "  docker   - Deploy using Docker Compose"
        echo "  vercel   - Deploy to Vercel"
        echo "  netlify  - Deploy to Netlify"
        echo "  railway  - Deploy to Railway"
        echo "  render   - Deploy to Render"
        exit 1
        ;;
esac

echo "🎉 Deployment process completed!"