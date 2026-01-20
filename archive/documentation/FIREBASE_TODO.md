# Firebase Web Config - TODO

**URGENT:** Get these values from Firebase Console

## Steps:
1. Go to: https://console.firebase.google.com/
2. Select project: **nusantaragroup-905e2**
3. Click ⚙️ (Project Settings)
4. Tab "General" → Your apps → Web app
5. Copy these values:

```
apiKey: AIza...
messagingSenderId: (numbers)
appId: 1:...:web:...
```

6. Tab "Cloud Messaging" → Web Push certificates → Generate key pair
7. Copy:

```
vapidKey: B...
```

## Update Files:
1. `/frontend/src/firebase/firebaseConfig.js` (lines 11 & 64)
2. `/frontend/public/firebase-messaging-sw.js` (line 14)

## Then:
```bash
cd frontend && npm start
```

Login → Allow permissions → Test notification
