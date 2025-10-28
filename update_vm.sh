#!/bin/bash

# VM Update Script for Last Opinion Backend
# This script updates your VM with all the working fixes (without anonymization)

echo "🚀 Starting VM update process..."

# Step 1: Backup current code
echo "📦 Creating backup..."
cp -r /var/www/last-opinion /var/www/last-opinion-backup-$(date +%Y%m%d-%H%M%S)

# Step 2: Stop services
echo "⏹️ Stopping services..."
sudo systemctl stop last-opinion-backend
sudo systemctl stop last-opinion-frontend

# Step 3: Update backend files
echo "📝 Updating backend files..."
cp app/routers/files.py /var/www/last-opinion/backend/app/routers/files.py
cp app/routers/cases.py /var/www/last-opinion/backend/app/routers/cases.py
cp app/routers/payments.py /var/www/last-opinion/backend/app/routers/payments.py
cp app/routers/patients.py /var/www/last-opinion/backend/app/routers/patients.py
cp app/schemas.py /var/www/last-opinion/backend/app/schemas.py
cp app/models.py /var/www/last-opinion/backend/app/models.py
cp app/main.py /var/www/last-opinion/backend/app/main.py
cp config.py /var/www/last-opinion/backend/config.py

# Step 4: Update frontend files
echo "📝 Updating frontend files..."
cp src/pages/Upload.tsx /var/www/last-opinion/frontend/src/pages/Upload.tsx
cp src/pages/Dashboard.tsx /var/www/last-opinion/frontend/src/pages/Dashboard.tsx
cp src/pages/Login.tsx /var/www/last-opinion/frontend/src/pages/Login.tsx
cp src/lib/api.ts /var/www/last-opinion/frontend/src/lib/api.ts
cp src/lib/razorpay.ts /var/www/last-opinion/frontend/src/lib/razorpay.ts

# Step 5: Update environment files
echo "🔧 Updating environment files..."
cp backend/.env /var/www/last-opinion/backend/.env
cp echomed-ce18e-firebase-adminsdk-fbsvc-5355c1a9ec.json /var/www/last-opinion/backend/

# Step 6: Install dependencies
echo "📦 Installing dependencies..."
cd /var/www/last-opinion/backend
source venv/bin/activate
pip install -r requirements.txt

# Step 7: Restart services
echo "🔄 Restarting services..."
sudo systemctl start last-opinion-backend
sudo systemctl start last-opinion-frontend

# Step 8: Check status
echo "✅ Checking service status..."
sudo systemctl status last-opinion-backend
sudo systemctl status last-opinion-frontend

echo "🎉 VM update completed!"
echo "🌐 Your app should now be available at: https://app.lastopinion.in"
echo "🔧 Backend API at: https://api.lastopinion.in"
