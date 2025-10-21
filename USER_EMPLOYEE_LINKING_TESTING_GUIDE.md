# User-Employee Linking - Quick Testing Guide 🧪

**Status:** Ready for Testing  
**Test Duration:** ~15-20 minutes  
**Date:** October 21, 2025

---

## 🎯 Quick Start

### Prerequisites
- ✅ Backend running on `http://localhost:5000`
- ✅ Frontend running on `http://localhost:3000`
- ✅ Database migration executed
- ✅ Login credentials ready

### Test Credentials
```
Username: admin / your-username
Password: your-password
```

---

## 📋 Test Scenarios (15 Minutes)

### ✅ Test 1: Create Employee with User Account (5 min)

**Objective:** Test employee creation with automatic user account creation

**Steps:**
1. Navigate to **Manpower/SDM** page
2. Click **"Add Employee"** button
3. Fill employee form:
   ```
   Employee ID: TEST-001
   Name: Test User One
   Position: Software Engineer
   Department: Engineering
   Email: test1@example.com
   Phone: +62 812 1111 1111
   Status: Active
   ```
4. ✅ Check **"Create User Account for System Access"**
5. Fill user credentials:
   ```
   Username: test.user1
   Password: TestPass123!
   Confirm Password: TestPass123!
   Role: Supervisor
   ```
6. Click **"Create Employee"**

**Expected Results:**
- ✅ Success toast: "Employee and user account created successfully"
- ✅ Employee appears in list with green "Access" badge
- ✅ Key icon visible next to employee name
- ✅ Hover shows username in tooltip

**Validation:**
```bash
# Check database
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  m.id, m.name, m.user_id,
  u.id as user_id_check, u.username, u.employee_id
FROM manpower m
LEFT JOIN users u ON m.user_id = u.id
WHERE m.employee_id = 'TEST-001';
"
```

**Expected Output:**
```
 id     | name          | user_id | user_id_check | username   | employee_id
--------+---------------+---------+---------------+------------+-------------
 EMP-XX | Test User One | U00X    | U00X          | test.user1 | EMP-XX
```

---

### ✅ Test 2: Create User and Link to Employee (5 min)

**Objective:** Test linking existing employee to new user account

**Preparation:**
First create an employee WITHOUT user account:
1. Go to **Manpower/SDM**
2. Add employee:
   ```
   Employee ID: TEST-002
   Name: Test User Two
   Position: Project Manager
   Department: Operations
   Status: Active
   ```
3. Leave "Create User Account" UNCHECKED
4. Save

**Main Test:**
1. Navigate to **User Management** page (Settings)
2. Click **"Add New User"**
3. Fill user form:
   ```
   Full Name: Test User Two
   Username: test.user2
   Email: test2@example.com
   Password: TestPass123!
   Role: Project Manager
   ```
4. ✅ Check **"Link to Existing Employee"**
5. Select from dropdown: **"Test User Two - Project Manager (TEST-002)"**
6. Verify employee preview shows correct information
7. Click **"Create User"**

**Expected Results:**
- ✅ Success toast: "User created successfully"
- ✅ User appears in list with green "Linked" badge
- ✅ Shield icon visible next to username
- ✅ Click to expand shows "Linked Employee" section
- ✅ Go to Manpower page: employee now shows "Access" badge

**Validation:**
```bash
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  u.id, u.username, u.employee_id,
  m.id as employee_id_check, m.name, m.user_id
FROM users u
LEFT JOIN manpower m ON u.employee_id = m.id
WHERE u.username = 'test.user2';
"
```

**Expected Output:**
```
 id    | username   | employee_id | employee_id_check | name          | user_id
-------+------------+-------------+-------------------+---------------+---------
 U00X  | test.user2 | EMP-XX      | EMP-XX            | Test User Two | U00X
```

---

### ✅ Test 3: Password Validation (2 min)

**Objective:** Test password validation works correctly

**Steps:**
1. Go to **Manpower/SDM**
2. Click **"Add Employee"**
3. Fill basic employee info
4. Check "Create User Account"
5. Test scenarios:

   **Test 3a: Password Too Short**
   - Enter password: `short`
   - ✅ Error message: "Password must be at least 8 characters"
   - ✅ Submit button DISABLED

   **Test 3b: Passwords Don't Match**
   - Enter password: `ValidPass123`
   - Enter confirm: `DifferentPass123`
   - ✅ Red error icon + "Passwords do not match"
   - ✅ Submit button DISABLED

   **Test 3c: Passwords Match**
   - Enter password: `ValidPass123`
   - Enter confirm: `ValidPass123`
   - ✅ Green checkmark + "Passwords match"
   - ✅ Submit button ENABLED

6. Cancel form

---

### ✅ Test 4: Visual Indicators (3 min)

**Objective:** Verify all visual indicators work

**Steps:**
1. Go to **User Management**
2. Check user list:
   - ✅ Users with employee links show green "Linked" badge
   - ✅ Users without links show NO badge
3. Click expand on linked user:
   - ✅ "Linked Employee" section visible
   - ✅ Employee name, position, department shown
   - ✅ Blue themed styling

4. Go to **Manpower/SDM**
5. Check employee list:
   - ✅ Employees with user accounts show green "Access" badge
   - ✅ Employees without users show NO badge
6. Hover over "Access" badge:
   - ✅ Tooltip shows username

---

### ✅ Test 5: Edit User to Change Link (Optional - 5 min)

**Objective:** Test updating employee link

**Steps:**
1. Create another employee (TEST-003) without user
2. Edit user "test.user2"
3. Change employee selection to TEST-003
4. Verify new employee preview appears
5. Save
6. Check Manpower page:
   - ✅ TEST-002 no longer has "Access" badge
   - ✅ TEST-003 now has "Access" badge

**Database Validation:**
```bash
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  m.employee_id, m.name, m.user_id
FROM manpower m
WHERE m.employee_id IN ('TEST-002', 'TEST-003');
"
```

---

## 🐛 Common Issues & Solutions

### Issue: "Available employees not loading"

**Check:**
```bash
# Test API endpoint
curl -X GET http://localhost:5000/api/users/available-employees \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "EMP-XXX",
      "name": "Employee Name",
      "position": "Position",
      "employeeId": "TEST-XXX"
    }
  ]
}
```

---

### Issue: "Password validation not working"

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Check browser console for errors
4. Try different browser

---

### Issue: "Badges not showing"

**Check Database:**
```bash
# Verify bidirectional links exist
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  u.id as user_id, 
  u.username, 
  u.employee_id as user_points_to,
  m.id as employee_id,
  m.name,
  m.user_id as employee_points_to,
  CASE 
    WHEN u.employee_id = m.id AND m.user_id = u.id THEN 'LINKED'
    ELSE 'BROKEN'
  END as link_status
FROM users u
LEFT JOIN manpower m ON u.employee_id = m.id
WHERE u.employee_id IS NOT NULL OR m.user_id IS NOT NULL;
"
```

**Expected:** All rows should show `link_status = 'LINKED'`

---

### Issue: "User creation fails"

**Check Backend Logs:**
```bash
docker logs nusantara-backend --tail 50 | grep -i error
```

**Common Errors:**
- Username already exists
- Email already exists
- Password validation failed
- Database connection error

---

## ✅ Success Checklist

After completing all tests, verify:

- [ ] Can create employee with user account
- [ ] Password validation works (length, match)
- [ ] Can create user and link to employee
- [ ] "Linked" badge shows on users
- [ ] "Access" badge shows on employees
- [ ] Employee preview shows in user form
- [ ] User can log in with created credentials
- [ ] Database shows bidirectional links
- [ ] No console errors
- [ ] No backend errors in logs

---

## 📊 Performance Metrics

**Expected Performance:**
- Employee creation: < 2 seconds
- User creation: < 2 seconds
- Available employees load: < 1 second
- Form validation: Instant (< 100ms)
- Badge rendering: Instant

**If slower:**
- Check database indexes
- Check network tab in browser
- Monitor backend logs
- Check database query performance

---

## 🔍 Debug Commands

### Check All Links
```sql
-- Find all users with employee links
SELECT u.username, u.employee_id, m.name as employee_name
FROM users u
INNER JOIN manpower m ON u.employee_id = m.id;

-- Find all employees with user links
SELECT m.name, m.user_id, u.username
FROM manpower m
INNER JOIN users u ON m.user_id = u.id;

-- Find broken links (one-way only)
SELECT 
  u.id as user_id,
  m.id as employee_id,
  u.employee_id as user_points_to,
  m.user_id as employee_points_to
FROM users u
FULL OUTER JOIN manpower m ON u.employee_id = m.id OR m.user_id = u.id
WHERE (u.employee_id != m.id OR m.user_id != u.id) 
  AND (u.employee_id IS NOT NULL OR m.user_id IS NOT NULL);
```

### Check User Can Login
```bash
# Test login with created user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test.user1",
    "password": "TestPass123!"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": {
    "id": "U00X",
    "username": "test.user1",
    "role": "supervisor",
    "employee": {
      "id": "EMP-XX",
      "name": "Test User One"
    }
  }
}
```

---

## 🎯 Test Report Template

```
=== User-Employee Linking Test Report ===
Date: _______________
Tester: _______________

Test 1: Create Employee with User Account
Status: [ ] Pass [ ] Fail
Notes: ________________________________

Test 2: Create User and Link to Employee  
Status: [ ] Pass [ ] Fail
Notes: ________________________________

Test 3: Password Validation
Status: [ ] Pass [ ] Fail
Notes: ________________________________

Test 4: Visual Indicators
Status: [ ] Pass [ ] Fail
Notes: ________________________________

Test 5: Edit User Link (Optional)
Status: [ ] Pass [ ] Fail
Notes: ________________________________

Overall Status: [ ] All Pass [ ] Issues Found

Issues Summary:
1. ________________________________
2. ________________________________
3. ________________________________

Recommendations:
________________________________
________________________________
```

---

## 📞 Support

**Issues Not Covered Here:**
- Check main documentation: `USER_EMPLOYEE_LINKING_FRONTEND_COMPLETE.md`
- Check backend docs: `USER_EMPLOYEE_LINKING_IMPLEMENTATION_COMPLETE.md`
- Review database logs
- Check browser console
- Test in incognito mode

**Critical Bugs:**
- Document exact steps to reproduce
- Include screenshots
- Copy error messages
- Note browser and OS version
- Check database state

---

**Quick Guide Version:** 1.0  
**Last Updated:** October 21, 2025  
**Estimated Test Time:** 15-20 minutes
