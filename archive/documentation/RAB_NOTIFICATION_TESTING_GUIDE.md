# 🧪 RAB Notification Testing Guide - Frontend

**Status:** Firebase FCM ✅ Ready  
**Backend:** ✅ Running  
**Notification Code:** ✅ Deployed  

---

## ✅ System Status

### Backend
- FCM Initialized: ✅ Yes
- Firebase Project: `nusantaragroup-905e2`
- Server: http://localhost:5000
- Health: Healthy

### Database
- Users: 4 registered (hadez, yonokurniawan, azmy, engkus)
- Projects: 1 active (2025PJK001 - "Proyek Uji Coba 01")
- RAB Items: 1 existing (status: draft)

### FCM Tokens
- Registered: 0 (users need to login via frontend)
- Status: Waiting for user login

---

## 🎯 Testing Steps

### Test 1: Login & Register FCM Token

**Purpose:** Register user's browser for push notifications

**Steps:**
1. **Open Frontend**
   ```
   http://localhost:3000
   ```

2. **Login with any user:**
   - Username: `hadez` (admin)
   - Username: `yonokurniawan` (admin)
   - Username: `azmy` (project manager)
   - Username: `engkus` (project manager)
   - Password: Ask administrator

3. **Allow Notifications**
   - Browser will prompt: "Allow notifications?"
   - Click **"Allow"**
   - FCM token will be registered automatically

4. **Verify Token Registered**
   ```bash
   docker exec nusantara-postgres psql -U admin -d nusantara_construction \
     -c "SELECT user_id, device_type, created_at FROM notification_tokens WHERE is_active = true;"
   ```
   
   Expected: Should show 1 row with your user ID

---

### Test 2: Create RAB Requiring Approval

**Purpose:** Test RAB approval request notification

**Prerequisites:**
- ✅ At least 1 user logged in (with FCM token)
- ✅ User has admin or project manager role

**Steps:**

1. **Navigate to Project**
   - Go to: Projects → Select "Proyek Uji Coba 01"

2. **Open RAB/Budget Section**
   - Click "Budget" or "RAB" tab
   - Click "+ Add RAB" button

3. **Fill RAB Form**
   ```
   Category: Material
   Item Type: Material
   Description: TEST - Semen Portland 50 sak
   Unit: sak
   Quantity: 50
   Unit Price: 75000
   Status: Under Review ← IMPORTANT!
   Notes: Testing notification system
   ```

4. **Submit**
   - Click "Save" or "Submit"
   - RAB will be created

5. **Check Backend Logs**
   ```bash
   docker-compose logs backend --tail 50 | grep -i "RAB.*notification"
   ```
   
   **Expected Output:**
   ```
   ✓ Found X project team members for RAB approval notification
   ✓ RAB approval notification sent: X/Y delivered
   ```
   
   **If 0/Y delivered:** No FCM tokens registered (users need to login)

6. **Check Notification**
   - Look for notification icon (bell) in frontend
   - Should show: "💰 {User} submitted RAB ..."
   - Click notification → Should navigate to RAB detail

---

### Test 3: Approve RAB

**Purpose:** Test RAB approval notification to creator

**Prerequisites:**
- ✅ RAB with status "under_review" exists
- ✅ Admin/manager user logged in

**Steps:**

1. **Find Pending RAB**
   - Go to: Projects → RAB List
   - Filter by status: "Under Review"

2. **Open RAB Detail**
   - Click on the RAB item
   - Should see "Approve" and "Reject" buttons

3. **Approve RAB**
   - Click "Approve" button
   - Add notes (optional): "Approved for procurement"
   - Confirm approval

4. **Check Backend Logs**
   ```bash
   docker-compose logs backend --tail 30 | grep "RAB approval notification"
   ```
   
   **Expected:**
   ```
   ✓ RAB approval notification sent to creator {user_id}
   ```

5. **Check Creator Notification**
   - Login as RAB creator (if different user)
   - Should see: "✅ Your RAB has been approved by {approver}"

---

### Test 4: Reject RAB

**Purpose:** Test RAB rejection notification with reason

**Steps:**

1. **Find Pending RAB** (same as Test 3)

2. **Reject RAB**
   - Click "Reject" button
   - Enter reason: "Budget exceeds project allocation"
   - Confirm rejection

3. **Check Creator Notification**
   - Creator should receive: "❌ Your RAB was rejected: {reason}"

---

## 🔍 Verification Commands

### Check FCM Tokens
```bash
docker exec nusantara-postgres psql -U admin -d nusantara_construction \
  -c "SELECT user_id, device_type, is_active, created_at::date FROM notification_tokens WHERE is_active = true;"
```

### Check Recent RAB Items
```bash
docker exec nusantara-postgres psql -U admin -d nusantara_construction \
  -c "SELECT id, description, status, created_by, created_at FROM project_rab ORDER BY created_at DESC LIMIT 5;"
```

### Monitor Notifications Real-time
```bash
docker-compose logs backend -f | grep -E "notification|RAB.*sent"
```

### Check Project Team Members
```bash
docker exec nusantara-postgres psql -U admin -d nusantara_construction \
  -c "SELECT project_id, employee_id, role, status FROM project_team_members WHERE project_id = '2025PJK001';"
```

---

## ⚠️ Troubleshooting

### Issue 1: No Notifications Received

**Symptom:** Created RAB but no notification appears

**Debug Steps:**

1. **Check FCM Token Registered**
   ```bash
   docker exec nusantara-postgres psql -U admin -d nusantara_construction \
     -c "SELECT COUNT(*) FROM notification_tokens WHERE is_active = true;"
   ```
   If returns 0: User needs to login and allow notifications

2. **Check Browser Permission**
   - Chrome: Settings → Privacy → Notifications
   - Should show `localhost:3000` as "Allowed"

3. **Check Backend Logs**
   ```bash
   docker-compose logs backend --tail 50 | grep "RAB approval"
   ```
   Should show: "✓ RAB approval notification sent"

4. **Check Notification Delivery**
   ```bash
   docker-compose logs backend --tail 50 | grep "Sent notification"
   ```
   Should show success count

### Issue 2: FCM Token Not Registered

**Symptom:** Login successful but no FCM token in database

**Solutions:**

1. **Check Browser Support**
   - Must use HTTPS (or localhost for testing)
   - Must support Service Workers
   - Check: `navigator.serviceWorker` in console

2. **Check Frontend Service Worker**
   - Open DevTools → Application → Service Workers
   - Should show service worker registered

3. **Manual Token Registration** (if frontend has test button)
   - Go to Settings → Notifications
   - Click "Test Notification" or "Register"

### Issue 3: Notification Sent But Not Visible

**Symptom:** Logs show "notification sent" but user doesn't see it

**Solutions:**

1. **Check Notification Permission**
   - Browser prompt might be blocked
   - Go to site settings → reset notifications

2. **Check Notification UI**
   - Look for bell icon in header
   - Check notification dropdown
   - Might need to refresh page

3. **Check Console for Errors**
   - Open DevTools → Console
   - Look for FCM or notification errors

---

## 📊 Expected Behavior

### When RAB Created with "under_review"
1. ✅ Backend finds approvers (team members or admins)
2. ✅ Backend sends FCM notification to each approver
3. ✅ Log shows: "✓ Found X approvers" and "✓ notification sent X/Y"
4. ✅ Approvers see notification in browser
5. ✅ Clicking notification navigates to RAB detail

### When RAB Approved
1. ✅ Backend finds RAB creator
2. ✅ Backend sends notification to creator
3. ✅ Log shows: "✓ RAB approval notification sent to creator"
4. ✅ Creator sees: "✅ Your RAB has been approved"

### When RAB Rejected
1. ✅ Backend finds RAB creator
2. ✅ Backend sends notification with reason
3. ✅ Creator sees: "❌ Your RAB was rejected: {reason}"

---

## 🎯 Success Criteria

- [x] FCM initialized without errors
- [ ] User can login and register FCM token
- [ ] Creating RAB triggers notification to approvers
- [ ] Approving RAB notifies creator
- [ ] Rejecting RAB notifies creator with reason
- [ ] Notifications appear in UI
- [ ] Clicking notification navigates correctly
- [ ] No errors in backend logs
- [ ] No errors in browser console

---

## 📈 Next Steps After Testing

### If All Tests Pass
1. ✅ Mark as production ready
2. Train users on notification system
3. Monitor delivery rates
4. Continue to Day 16-20

### If Issues Found
1. Document specific error
2. Check error logs
3. Fix and re-test
4. Verify fix works

---

## 🔗 Quick Links

**Frontend:** http://localhost:3000  
**Backend:** http://localhost:5000  
**Health Check:** http://localhost:5000/health  

**Logs:**
```bash
# Backend
docker-compose logs backend -f

# All services
docker-compose logs -f

# Notifications only
docker-compose logs backend -f | grep notification
```

---

## 📝 Notes

- **FCM Tokens expire** after 90 days of inactivity
- **Service Worker** must be registered for notifications to work
- **HTTPS required** in production (localhost OK for testing)
- **User must allow** notifications in browser
- **First notification** may be delayed (browser warming up)

---

**Ready to Test!** 🚀

Follow the steps above in order. If you encounter any issues, check the troubleshooting section or backend logs.

**Current Status:** ✅ All systems ready, waiting for frontend testing

---

**Document Created:** October 19, 2024  
**FCM Status:** ✅ Operational  
**Next:** Frontend testing
