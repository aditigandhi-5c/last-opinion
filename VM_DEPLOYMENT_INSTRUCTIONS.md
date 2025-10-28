# 🚀 VM Deployment Instructions - Last Opinion Updates

## 📦 **Deployment Package Ready!**

Your VM deployment package is ready: `vm_deployment_focused.tar.gz` (30KB)

## 🔧 **Step-by-Step Deployment:**

### **1. Upload to Your VM**
```bash
# From your local machine, upload the package:
scp /root/last-opinion/vm_deployment_focused.tar.gz user@your-vm-ip:/tmp/
```

### **2. Deploy on Your VM**
```bash
# SSH into your VM and run these commands:

# Backup current installation
sudo cp -r /var/www/last-opinion /var/www/last-opinion-backup-$(date +%Y%m%d-%H%M%S)

# Stop services
sudo systemctl stop last-opinion-backend
sudo systemctl stop last-opinion-frontend

# Extract new files
cd /var/www
sudo tar -xzf /tmp/vm_deployment_focused.tar.gz -C /tmp/vm_update

# Update backend files
sudo cp -r /tmp/vm_update/backend/* /var/www/last-opinion/backend/

# Update frontend files  
sudo cp -r /tmp/vm_update/frontend/* /var/www/last-opinion/frontend/src/

# Update environment files
sudo cp /tmp/vm_update/.env /var/www/last-opinion/backend/.env
sudo cp /tmp/vm_update/echomed-ce18e-firebase-adminsdk-fbsvc-5355c1a9ec.json /var/www/last-opinion/backend/

# Install dependencies
cd /var/www/last-opinion/backend
source venv/bin/activate
pip install -r requirements.txt

# Restart services
sudo systemctl start last-opinion-backend
sudo systemctl start last-opinion-frontend

# Check status
sudo systemctl status last-opinion-backend
sudo systemctl status last-opinion-frontend
```

## ✅ **What's Fixed:**

1. **🔐 Authentication** - 5C Network API auth working
2. **📱 WhatsApp** - Messages sent on case creation
3. **🔥 Firebase** - Corrected credentials path
4. **📁 Folder Upload** - Multiple DICOM files support
5. **📊 Dashboard** - One report per case
6. **💳 Payments** - Razorpay integration
7. **🐛 Debug Logging** - Better error tracking

## 🌐 **Expected Results:**
- ✅ DICOM uploads work with authentication
- ✅ WhatsApp messages sent when cases created
- ✅ Folder uploads supported for multiple DICOM files
- ✅ Dashboard shows one report per case
- ✅ No more 401/500 errors
- ✅ Payment integration working

## 🚨 **If Issues Occur:**
```bash
# Check logs
sudo journalctl -u last-opinion-backend -f
sudo journalctl -u last-opinion-frontend -f

# Restore backup if needed
sudo systemctl stop last-opinion-backend last-opinion-frontend
sudo rm -rf /var/www/last-opinion
sudo mv /var/www/last-opinion-backup-* /var/www/last-opinion
sudo systemctl start last-opinion-backend last-opinion-frontend
```

## 🎉 **After Deployment:**
Your app will be available at:
- **Frontend**: https://app.lastopinion.in
- **Backend API**: https://api.lastopinion.in

**All fixes are included WITHOUT anonymization complexity!** 🚀
