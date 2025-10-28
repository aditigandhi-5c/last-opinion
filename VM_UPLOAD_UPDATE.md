# 🚀 VM Upload Page Update - Folder Upload Support

## 📦 **Package Ready:**
- `vm_upload_update.tar.gz` - Contains updated Upload.tsx with folder upload

## 🔧 **Quick Update Steps:**

### **1. Upload to Your VM:**
```bash
# Upload the package to your VM
scp /root/last-opinion/vm_upload_update.tar.gz user@your-vm-ip:/tmp/
```

### **2. Update on Your VM:**
```bash
# SSH into your VM and run:

# Extract the file
cd /tmp
tar -xzf vm_upload_update.tar.gz

# Update the upload page
sudo cp Upload.tsx /var/www/last-opinion/frontend/src/pages/Upload.tsx

# Restart frontend (if needed)
sudo systemctl restart last-opinion-frontend
```

## ✅ **What's New:**
- **📁 Folder Upload** - "Folder (Multiple Files)" option
- **📄 Single File Upload** - "Single File" option  
- **🔄 Toggle Buttons** - Switch between upload modes
- **📊 File Counter** - Shows number of files selected
- **📋 File List** - Scrollable list of selected files
- **✅ Better UX** - Clear instructions for each mode

## 🎯 **Expected Result:**
Your upload page will now show:
- Two buttons: "Single File" and "Folder (Multiple Files)"
- Ability to select multiple DICOM files at once
- File counter and list display
- All files uploaded to your 5C Network S3 bucket

## 🚀 **After Update:**
- Refresh `app.lastopinion.in/upload`
- You'll see the new folder upload interface
- Select "Folder (Multiple Files)" to upload multiple DICOM images
- All files will be sent to your integrated S3 bucket
