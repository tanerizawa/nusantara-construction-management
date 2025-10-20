# Firebase Setup Guide - Quick Start 🔥

**Purpose:** Enable push notifications for RAB approval system  
**Time Required:** 10 minutes  
**Status:** ⚠️ REQUIRED - Notifications won't work without this

---

## 📋 Prerequisites

- Google Account (to access Firebase Console)
- Admin access to Firebase project
- SSH/file access to server

---

## 🚀 Step-by-Step Setup

### Step 1: Get Firebase Service Account Key

1. **Open Firebase Console**
   ```
   https://console.firebase.google.com/
   ```

2. **Select Your Project**
   - Find and click on your project (or create new if needed)

3. **Navigate to Service Accounts**
   - Click ⚙️ **Settings** icon (top left)
   - Select **Project settings**
   - Click **Service accounts** tab

4. **Generate Private Key**
   - Scroll down to "Firebase Admin SDK" section
   - Select **Node.js** (should be selected by default)
   - Click **Generate new private key** button
   - Click **Generate key** in confirmation dialog
   - JSON file will download automatically

5. **Rename Downloaded File**
   ```bash
   # File is usually named something like:
   # your-project-firebase-adminsdk-xxxxx-1234567890.json
   
   # Rename to:
   firebase-service-account.json
   ```

### Step 2: Upload to Server

**Option A: Using SCP (from your local machine)**
```bash
# Replace with your actual file path and server details
scp firebase-service-account.json root@your-server:/root/APP-YK/backend/config/
```

**Option B: Using Docker Copy (if server has the file)**
```bash
# Copy from server to container
docker cp /path/to/firebase-service-account.json nusantara-backend:/app/config/
```

**Option C: Create File Directly on Server**
```bash
# SSH to server
ssh root@your-server

# Navigate to backend config directory
cd /root/APP-YK/backend/config

# Create file and paste JSON content
nano firebase-service-account.json

# Paste the entire JSON content from downloaded file
# Press Ctrl+X, then Y, then Enter to save
```

### Step 3: Verify File Placement

```bash
# Check file exists and has content
ls -lh /root/APP-YK/backend/config/firebase-service-account.json

# Should show file size (not 0 bytes)
# Example output: -rw-r--r-- 1 root root 2.3K Oct 19 10:30 firebase-service-account.json
```

### Step 4: Restart Backend

```bash
cd /root/APP-YK
docker-compose restart backend
```

### Step 5: Verify FCM Initialized

```bash
# Check backend logs
docker-compose logs backend --tail 50 | grep FCM

# Expected output:
# ✓ Firebase Cloud Messaging initialized
# ✅ FCM Notification Service initialized
```

**Success Indicators:**
- ✅ Line shows: `✓ Firebase Cloud Messaging initialized`
- ✅ No error: `✗ Failed to initialize FCM`

**If you still see errors:**
- Check file name is exactly: `firebase-service-account.json`
- Check file location: `/root/APP-YK/backend/config/`
- Check JSON format is valid (paste in validator: https://jsonlint.com/)
- Check file permissions: `chmod 644 firebase-service-account.json`

---

## 🧪 Test FCM After Setup

### Test 1: Check FCM Status
```bash
curl http://localhost:5000/api/notifications/health

# Expected response:
{
  "status": "healthy",
  "fcmInitialized": true  # ← Should be true
}
```

### Test 2: Send Test Notification

**Using Frontend:**
1. Login to app
2. Go to Settings → Notifications
3. Click "Test Notification" button
4. Check if notification appears

**Using API:**
```bash
# Get your user ID first
USER_ID="your-user-id"

# Send test notification
curl -X POST http://localhost:5000/api/notifications/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"userId": "'$USER_ID'"}'

# Expected response:
{
  "success": true,
  "message": "Test notification sent successfully"
}
```

### Test 3: Create RAB with Approval Status
```bash
# Login as user
# Create RAB
curl -X POST http://localhost:5000/api/projects/YOUR_PROJECT_ID/rab \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category": "Material",
    "description": "Test RAB for Notification",
    "unit": "pcs",
    "quantity": 10,
    "unitPrice": 50000,
    "status": "under_review",
    "itemType": "material"
  }'

# Check backend logs for:
# ✓ Found X project team members for RAB approval notification
# ✓ RAB approval notification sent: X/Y delivered
```

---

## 📄 Firebase Service Account JSON Format

**Example structure** (your actual file will have real values):
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

**Important Fields:**
- `project_id` - Your Firebase project ID
- `private_key` - RSA private key (keep secret!)
- `client_email` - Service account email

---

## 🔒 Security Notes

### ⚠️ CRITICAL: Keep Service Account Secret!

**DO NOT:**
- ❌ Commit to Git
- ❌ Share publicly
- ❌ Store in frontend
- ❌ Expose via API

**Verify .gitignore:**
```bash
# Check if firebase-service-account.json is ignored
cd /root/APP-YK
grep "firebase-service-account.json" .gitignore

# If not found, add it:
echo "backend/config/firebase-service-account.json" >> .gitignore
```

**File Permissions:**
```bash
# Set secure permissions (owner read/write only)
chmod 600 /root/APP-YK/backend/config/firebase-service-account.json
```

### Rotation Policy
- Rotate service account keys every 90 days
- Delete old keys after rotation
- Monitor usage in Firebase Console → IAM & Admin

---

## 🐛 Troubleshooting

### Issue 1: "Cannot find module" Error
**Symptom:**
```
✗ Failed to initialize FCM: Cannot find module '/app/config/firebase-service-account.json'
```

**Solutions:**
1. Check file exists: `ls /root/APP-YK/backend/config/firebase-service-account.json`
2. Check file name (exact match): `firebase-service-account.json`
3. Restart container: `docker-compose restart backend`

### Issue 2: "Invalid key format" Error
**Symptom:**
```
✗ Failed to initialize FCM: Invalid service account
```

**Solutions:**
1. Validate JSON: Paste content in https://jsonlint.com/
2. Check private key has `\n` characters (not actual newlines)
3. Re-download key from Firebase Console
4. Ensure no extra characters or BOM in file

### Issue 3: "Insufficient permissions" Error
**Symptom:**
```
✗ Failed to send notification: Permission denied
```

**Solutions:**
1. Check service account has "Firebase Admin SDK" role
2. Enable Firebase Cloud Messaging API in Google Cloud Console
3. Verify project ID matches in service account JSON

### Issue 4: Notifications Not Received
**Symptom:** FCM initialized but notifications don't appear

**Debug Steps:**
1. Check user has FCM token registered:
   ```sql
   SELECT * FROM notification_tokens WHERE user_id = 'YOUR_USER_ID';
   ```

2. Check backend logs for send confirmation:
   ```
   ✓ Sent notification to user X: 1/1 delivered
   ```

3. Check browser notification permission:
   - Chrome: Settings → Privacy & Security → Notifications
   - Should show your site with "Allow" permission

4. Test with simple notification:
   ```bash
   # API test endpoint
   POST /api/notifications/test
   ```

---

## 📊 Monitoring

### Check FCM Status
```bash
# View real-time logs
docker-compose logs backend -f | grep -E "FCM|notification"

# Count notification sends today
docker-compose logs backend --since 1d | grep "Sent notification" | wc -l
```

### Firebase Console Monitoring
1. Go to Firebase Console → Analytics → Events
2. Check "notification_received" events
3. Monitor delivery rate and errors

---

## ✅ Setup Verification Checklist

- [ ] Downloaded Firebase service account JSON
- [ ] Renamed file to `firebase-service-account.json`
- [ ] Uploaded to `/root/APP-YK/backend/config/`
- [ ] Verified file exists and has content (>2KB)
- [ ] Added to .gitignore
- [ ] Restarted backend container
- [ ] Checked logs show: `✓ Firebase Cloud Messaging initialized`
- [ ] Tested: Health endpoint shows `fcmInitialized: true`
- [ ] Tested: Test notification received
- [ ] Tested: RAB approval notification received

---

## 🎯 Next Steps After Setup

Once Firebase is configured:

1. **Test RAB Notification Flow**
   - Create RAB with `under_review` status
   - Verify approvers receive notification
   - Approve RAB and verify creator notified
   - Reject RAB and verify creator notified with reason

2. **Monitor First 24 Hours**
   - Check notification delivery rate
   - Monitor for any errors
   - Verify deep links work correctly

3. **Train Users**
   - Show how to enable notifications
   - Demonstrate notification workflow
   - Explain approval process

---

**Need Help?**

Check these resources:
- Firebase Console: https://console.firebase.google.com/
- Firebase Admin SDK: https://firebase.google.com/docs/admin/setup
- FCM Documentation: https://firebase.google.com/docs/cloud-messaging

**Common Issues Documentation:**
- See: `RAB_NOTIFICATION_FIX_COMPLETE.md` section "Known Issues"

---

**Last Updated:** October 19, 2024  
**Version:** 1.0  
**Status:** Ready for use
