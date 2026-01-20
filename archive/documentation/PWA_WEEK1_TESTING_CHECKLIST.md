# ✅ PWA WEEK 1 - Manual Testing Checklist

**Date:** October 21, 2024  
**Tester:** _____________  
**Purpose:** Verify all Week 1 features on real devices

---

## 🎯 TESTING OVERVIEW

### Devices Required
- [ ] **Android Phone** (Chrome browser)
- [ ] **iPhone** (Safari browser, iOS 16.4+ recommended)
- [ ] **Desktop/Laptop** (Chrome/Firefox/Safari/Edge)

### Network Conditions
- [ ] **Fast WiFi** (for baseline)
- [ ] **4G Mobile** (realistic mobile experience)
- [ ] **Slow 3G** (worst case scenario)
- [ ] **Offline** (PWA offline features)

### Test URL
- Production: `https://your-domain.com`
- Development: `http://localhost:3000`
- Test Page: `http://localhost:3000/test/camera-gps`

---

## 📱 ANDROID CHROME TESTING

### Device Info
- Device Model: _____________
- Android Version: _____________
- Chrome Version: _____________
- Screen Size: _____________

### 1. PWA Installation
- [ ] Visit app URL
- [ ] Wait for install prompt to appear
- [ ] Click "Install" button
- [ ] App icon appears on home screen
- [ ] Open from home screen (standalone mode)
- [ ] No browser address bar visible
- [ ] Splash screen shown on launch

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

### 2. Camera Features
- [ ] Navigate to test page
- [ ] Click "Start Camera"
- [ ] Camera permission prompt appears
- [ ] Grant camera permission
- [ ] Live camera preview shows
- [ ] Guide frame visible
- [ ] Switch to front camera works
- [ ] Switch back to rear camera works
- [ ] Capture photo
- [ ] Photo preview appears
- [ ] Retake button works
- [ ] Photo quality acceptable

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

### 3. Camera Fallback
- [ ] Deny camera permission (Settings → Chrome → Permissions)
- [ ] Reload page
- [ ] Try "Start Camera"
- [ ] Fallback UI appears (file input)
- [ ] "Choose Photo" button works
- [ ] Select photo from gallery
- [ ] Photo loads successfully

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

### 4. GPS Features
- [ ] Click "Get GPS Position"
- [ ] Location permission prompt appears
- [ ] Grant location permission
- [ ] GPS acquiring message shows
- [ ] Wait 10-15 seconds
- [ ] GPS position acquired
- [ ] Accuracy badge shows (High/Medium/Low)
- [ ] Coordinates displayed correctly
- [ ] Try outdoors for better accuracy

**Status:** ⬜ Pass | ⬜ Fail  
**Coordinates:** Lat: _________ Lon: _________  
**Accuracy:** _________ meters  
**Notes:**
```


```

### 5. GPS Fallback
- [ ] Deny location permission
- [ ] Try "Get GPS Position"
- [ ] "Manual Location Entry" modal appears
- [ ] Enter example coordinates
- [ ] Validation works (invalid lat/lon rejected)
- [ ] "Use This Location" button works
- [ ] Coordinates saved

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

### 6. LocationPicker Map
- [ ] Scroll to LocationPicker section
- [ ] Map loads successfully
- [ ] OpenStreetMap tiles visible
- [ ] Current position marker (blue dot)
- [ ] Project location marker (red pin)
- [ ] Radius circle visible
- [ ] Distance banner shows
- [ ] Zoom in/out works
- [ ] Pan map works
- [ ] Auto-recenter button works

**Status:** ⬜ Pass | ⬜ Fail  
**Distance:** _________ meters  
**Within Radius:** ⬜ Yes | ⬜ No  
**Notes:**
```


```

### 7. Photo Compression
- [ ] Take large photo (>5MB)
- [ ] Compression starts automatically
- [ ] Progress shown
- [ ] Original size displayed
- [ ] Compressed size displayed
- [ ] Compression ratio >80%
- [ ] Photo quality acceptable

**Status:** ⬜ Pass | ⬜ Fail  
**Original Size:** _________ MB  
**Compressed Size:** _________ MB  
**Ratio:** _________ %  
**Notes:**
```


```

### 8. Offline Mode
- [ ] Browse app while online
- [ ] Turn on Airplane Mode
- [ ] Try to navigate to visited page
- [ ] Cached page loads
- [ ] Try to navigate to unvisited page
- [ ] Offline fallback page shows
- [ ] "Retry" button appears
- [ ] Turn off Airplane Mode
- [ ] Click "Retry"
- [ ] Page loads successfully

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

### 9. Performance (4G)
- [ ] Switch to 4G mobile data
- [ ] Clear cache (Settings → Chrome → Clear browsing data)
- [ ] Reload app
- [ ] Initial load <5 seconds
- [ ] App interactive quickly
- [ ] Camera loads smoothly
- [ ] GPS works normally
- [ ] No lag or freezing

**Status:** ⬜ Pass | ⬜ Fail  
**Load Time:** _________ seconds  
**Notes:**
```


```

### 10. Performance (3G)
- [ ] Simulate Slow 3G (Chrome DevTools)
- [ ] Or use actual slow connection
- [ ] Reload app
- [ ] Initial load acceptable
- [ ] Photo quality reduced automatically
- [ ] GPS interval increased
- [ ] App still usable

**Status:** ⬜ Pass | ⬜ Fail  
**Load Time:** _________ seconds  
**Notes:**
```


```

### 11. Battery Optimization
- [ ] Drain battery to <20%
- [ ] Open app
- [ ] Check GPS update interval (should be 10s)
- [ ] Check photo quality (should be reduced)
- [ ] Animations disabled
- [ ] App still functional

**Status:** ⬜ Pass | ⬜ Fail  
**Battery Level:** _________ %  
**Notes:**
```


```

### 12. Error Handling
- [ ] Navigate to test page
- [ ] Open Chrome DevTools (chrome://inspect)
- [ ] Trigger component error (intentionally break something)
- [ ] Error boundary catches error
- [ ] Friendly error message shows
- [ ] "Try Again" button appears
- [ ] Click "Try Again"
- [ ] Component recovers

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

---

## 🍎 iOS SAFARI TESTING

### Device Info
- Device Model: _____________
- iOS Version: _____________
- Safari Version: _____________
- Screen Size: _____________

### 1. PWA Installation
- [ ] Visit app URL in Safari
- [ ] Tap Share button (⬆)
- [ ] Scroll to "Add to Home Screen"
- [ ] Tap "Add to Home Screen"
- [ ] Edit app name if desired
- [ ] Tap "Add"
- [ ] App icon appears on home screen
- [ ] Open from home screen
- [ ] Standalone mode works

**Status:** ⬜ Pass | ⬜ Fail  
**iOS Version:** _________ (16.4+ recommended)  
**Notes:**
```


```

### 2. Camera Features
- [ ] Navigate to test page
- [ ] Tap "Start Camera"
- [ ] Camera permission prompt appears
- [ ] Allow camera access
- [ ] Live camera preview works
- [ ] Front/back camera switch works
- [ ] Capture photo works
- [ ] Photo preview works
- [ ] Retake works

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

### 3. GPS Features
- [ ] Tap "Get GPS Position"
- [ ] Location permission prompt
- [ ] Allow location access
- [ ] GPS acquires position
- [ ] Coordinates displayed
- [ ] Accuracy badge works
- [ ] Try outdoors for better signal

**Status:** ⬜ Pass | ⬜ Fail  
**Coordinates:** Lat: _________ Lon: _________  
**Accuracy:** _________ meters  
**Notes:**
```


```

### 4. LocationPicker Map
- [ ] Map loads successfully
- [ ] Tiles render correctly
- [ ] Markers visible
- [ ] Touch gestures work (pinch zoom, pan)
- [ ] Distance calculation works

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

### 5. Push Notifications (iOS 16.4+)
- [ ] iOS version is 16.4 or higher
- [ ] Notification permission prompt appears
- [ ] Allow notifications
- [ ] Service Worker registered
- [ ] Push subscription created

**Status:** ⬜ Pass | ⬜ Fail | ⬜ N/A (iOS <16.4)  
**Notes:**
```


```

### 6. Offline Mode
- [ ] Browse app online
- [ ] Enable Airplane Mode
- [ ] Navigate to visited pages
- [ ] Cached pages load
- [ ] Offline fallback for unvisited pages

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

### 7. Performance
- [ ] App loads quickly
- [ ] Smooth scrolling
- [ ] Camera responsive
- [ ] GPS works well
- [ ] No crashes

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

---

## 💻 DESKTOP BROWSER TESTING

### Chrome Desktop

**System:** ⬜ Windows | ⬜ Mac | ⬜ Linux  
**Chrome Version:** _____________

- [ ] App loads correctly
- [ ] Camera works (if available)
- [ ] GPS works (if available)
- [ ] Map fully functional
- [ ] Responsive design works
- [ ] PWA install prompt (desktop)
- [ ] All features accessible

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

### Firefox Desktop

**Firefox Version:** _____________

- [ ] App loads correctly
- [ ] Camera works
- [ ] GPS works
- [ ] Map functional
- [ ] No install prompt (expected)
- [ ] All core features work

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

### Safari Desktop (Mac only)

**Safari Version:** _____________

- [ ] App loads correctly
- [ ] Camera works
- [ ] GPS works
- [ ] Map functional
- [ ] WebKit compatibility

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

### Edge Desktop

**Edge Version:** _____________

- [ ] App loads correctly
- [ ] All features work
- [ ] PWA install works
- [ ] Chromium compatibility

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

---

## 🔍 ADVANCED TESTING

### Lighthouse PWA Audit

**Instructions:**
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Check "Progressive Web App"
4. Click "Generate report"

**Results:**
- [ ] PWA badge: ⬜ Pass | ⬜ Fail
- [ ] Installable: ⬜ Yes | ⬜ No
- [ ] Fast and reliable: Score _____ / 100
- [ ] PWA Optimized: Score _____ / 100
- [ ] **Target Score:** ≥90

**Issues Found:**
```


```

### Chrome DevTools - Application Tab

- [ ] Service Worker registered
- [ ] Service Worker active
- [ ] Cache Storage populated
- [ ] Manifest valid (no errors)
- [ ] Icons correct size/format

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

### Network Testing

**Chrome DevTools → Network:**
- [ ] Offline mode works
- [ ] Slow 3G simulation works
- [ ] Fast 3G simulation works
- [ ] Resources cached properly
- [ ] No unnecessary requests

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

### Performance Metrics

**Chrome DevTools → Performance:**
- [ ] First Contentful Paint: _____ ms (target <2000ms)
- [ ] Largest Contentful Paint: _____ ms (target <2500ms)
- [ ] Time to Interactive: _____ ms (target <3500ms)
- [ ] Total Blocking Time: _____ ms (target <300ms)
- [ ] Cumulative Layout Shift: _____ (target <0.1)

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:**
```


```

---

## 🐛 BUG REPORT TEMPLATE

### Bug #1
- **Severity:** ⬜ Critical | ⬜ High | ⬜ Medium | ⬜ Low
- **Device:** _____________
- **Browser:** _____________
- **Feature:** _____________
- **Steps to Reproduce:**
  1. 
  2. 
  3. 
- **Expected Behavior:**
- **Actual Behavior:**
- **Screenshots:**
- **Console Errors:**

### Bug #2
- **Severity:** ⬜ Critical | ⬜ High | ⬜ Medium | ⬜ Low
- **Device:** _____________
- **Browser:** _____________
- **Feature:** _____________
- **Steps to Reproduce:**
  1. 
  2. 
  3. 
- **Expected Behavior:**
- **Actual Behavior:**
- **Screenshots:**
- **Console Errors:**

*(Add more bug sections as needed)*

---

## 📊 TEST SUMMARY

### Overall Results
- **Total Tests:** _____
- **Passed:** _____
- **Failed:** _____
- **Blocked:** _____
- **Pass Rate:** _____ %

### Critical Issues
- [ ] None found ✅
- [ ] List critical issues:
  - 
  - 

### Recommendations
- [ ] Ready for Week 2 development
- [ ] Minor fixes needed (non-blocking)
- [ ] Major fixes required (blocking)

### Sign-off
- **Tester Name:** _____________
- **Date:** _____________
- **Signature:** _____________
- **Status:** ⬜ Approved | ⬜ Needs Fixes

---

## 📝 TESTING TIPS

### For Best Results
1. **Test on Real Devices:** Emulators don't fully replicate hardware APIs
2. **Test Outdoors:** GPS accuracy much better outdoors
3. **Test Different Times:** Network conditions vary throughout day
4. **Test Edge Cases:** Low battery, no connection, denied permissions
5. **Clear Cache Between Tests:** Ensures clean state
6. **Document Everything:** Screenshots, console logs, error messages

### Common Issues
- **GPS takes long time:** Normal, wait 15-20 seconds especially indoors
- **Camera blurry:** Tap screen to focus, ensure good lighting
- **Map not loading:** Check internet connection, try refresh
- **Install prompt not showing:** Revisit site after 5 minutes
- **iOS push not working:** Requires iOS 16.4+, check version

### Resources
- [Web.dev PWA Checklist](https://web.dev/pwa-checklist/)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [iOS PWA Compatibility](https://caniuse.com/web-app-manifest)
- [Service Worker Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

**Happy Testing!** 🧪  
**Report all issues in GitHub Issues or project management tool**
