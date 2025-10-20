# User Guide: PWA Push Notifications

## Panduan Lengkap Notifikasi Push untuk Pengguna

---

## Daftar Isi

1. [Pengenalan](#pengenalan)
2. [Mengaktifkan Notifikasi](#mengaktifkan-notifikasi)
3. [Jenis-jenis Notifikasi](#jenis-jenis-notifikasi)
4. [Cara Menggunakan](#cara-menggunakan)
5. [Action Buttons](#action-buttons)
6. [Riwayat Notifikasi](#riwayat-notifikasi)
7. [Pengaturan](#pengaturan)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## Pengenalan

### Apa itu Push Notifications?

Push notifications adalah pesan otomatis yang dikirim langsung ke perangkat Anda, bahkan ketika aplikasi tidak sedang dibuka. Fitur ini membantu Anda tetap update dengan informasi penting seperti:

- ✅ Persetujuan cuti karyawan
- 📝 Pengajuan cuti yang perlu di-review
- ⏰ Reminder untuk absensi
- 🔔 Update proyek dan RAB
- 📊 Notifikasi sistem lainnya

### Keuntungan Menggunakan Notifikasi

- **Real-time Updates**: Terima informasi segera
- **Action Buttons**: Approve/reject langsung dari notifikasi
- **Offline Support**: Notifikasi tetap diterima meski offline
- **Riwayat Lengkap**: Semua notifikasi tersimpan
- **Deep Linking**: Langsung ke halaman yang relevan

---

## Mengaktifkan Notifikasi

### Langkah 1: Login ke Aplikasi

1. Buka aplikasi Nusantara
2. Login dengan credentials Anda
3. Setelah login berhasil, Anda akan melihat popup permintaan notifikasi

### Langkah 2: Izinkan Notifikasi

![Notification Permission Prompt]

**Di Desktop (Chrome/Edge/Firefox):**

```
┌─────────────────────────────────────┐
│  Nusantara ingin mengirim notifikasi│
│                                      │
│  [Block]              [Allow]       │
└─────────────────────────────────────┘
```

1. Klik tombol **"Allow"** atau **"Izinkan"**
2. Jika tidak muncul popup, check icon 🔒 di address bar
3. Klik icon → Site settings → Notifications → Allow

**Di Mobile (Chrome/Safari):**

**Android (Chrome):**
1. Popup akan muncul otomatis
2. Tap **"Allow"** atau **"Izinkan"**
3. Jika terlewat: Settings → Site settings → Notifications → Allow

**iOS (Safari):**
1. Tap "Share" button → "Add to Home Screen"
2. Buka app dari home screen
3. Popup permission akan muncul
4. Tap "Allow"

### Langkah 3: Verifikasi

Setelah mengaktifkan, Anda akan melihat:

- ✅ Badge hijau "Notifications Enabled" di header
- 🔔 Icon notifikasi dengan badge count di navbar
- 📱 Notification icon aktif di profile menu

### Troubleshooting Aktivasi

**Problem: Popup tidak muncul**

**Solusi:**
1. Check browser settings: Settings → Privacy → Site Permissions → Notifications
2. Pastikan browser mendukung notifications (Chrome 50+, Firefox 44+, Safari 16+)
3. Pastikan tidak di private/incognito mode
4. Refresh halaman dan login ulang

**Problem: Tombol "Allow" di-klik tapi tidak aktif**

**Solusi:**
1. Clear browser cache dan cookies
2. Logout dan login kembali
3. Check console untuk error messages (F12 → Console)
4. Hubungi admin jika masih error

---

## Jenis-jenis Notifikasi

### 1. Leave Approval Request 📝

**Kapan dikirim:**
- Saat karyawan mengajukan cuti
- Hanya dikirim ke manager/supervisor

**Contoh:**

```
┌─────────────────────────────────────────┐
│ 📝 Leave Request Approval                │
│                                          │
│ John Doe mengajukan cuti:                │
│ 22-24 Oktober 2024 (3 hari)             │
│ Alasan: Liburan keluarga                 │
│                                          │
│ [✓ Approve]  [✗ Reject]  [👁️ View]     │
└─────────────────────────────────────────┘
```

**Action:**
- ✓ **Approve**: Setujui cuti langsung
- ✗ **Reject**: Tolak cuti dengan alasan
- 👁️ **View**: Lihat detail lengkap

### 2. Leave Approved ✅

**Kapan dikirim:**
- Saat pengajuan cuti disetujui
- Dikirim ke karyawan yang mengajukan

**Contoh:**

```
┌─────────────────────────────────────────┐
│ ✅ Leave Request Approved                │
│                                          │
│ Cuti Anda telah disetujui:               │
│ 22-24 Oktober 2024 (3 hari)             │
│ Disetujui oleh: Manager HR               │
│                                          │
│ [View Details]                           │
└─────────────────────────────────────────┘
```

### 3. Leave Rejected ❌

**Kapan dikirim:**
- Saat pengajuan cuti ditolak
- Dikirim ke karyawan yang mengajukan

**Contoh:**

```
┌─────────────────────────────────────────┐
│ ❌ Leave Request Rejected                │
│                                          │
│ Cuti Anda ditolak:                       │
│ 22-24 Oktober 2024 (3 hari)             │
│ Alasan: Periode sibuk proyek             │
│                                          │
│ [View Details]                           │
└─────────────────────────────────────────┘
```

### 4. Attendance Reminder ⏰

**Kapan dikirim:**
- Setiap hari jam 08:00 (jika belum clock in)
- Reminder otomatis

**Contoh:**

```
┌─────────────────────────────────────────┐
│ ⏰ Reminder: Clock In                    │
│                                          │
│ Jangan lupa untuk clock in hari ini!    │
│                                          │
│ [⏰ Clock In Now]  [Dismiss]            │
└─────────────────────────────────────────┘
```

### 5. Clock Out Reminder 🔔

**Kapan dikirim:**
- Jam 17:00 (jika sudah clock in tapi belum clock out)
- Reminder otomatis

**Contoh:**

```
┌─────────────────────────────────────────┐
│ 🔔 Reminder: Clock Out                   │
│                                          │
│ Waktunya clock out. Sudah selesai kerja?│
│                                          │
│ [⏰ Clock Out Now]  [Later]             │
└─────────────────────────────────────────┘
```

### 6. Project Update 📊

**Kapan dikirim:**
- Saat ada update proyek penting
- Saat status proyek berubah

**Contoh:**

```
┌─────────────────────────────────────────┐
│ 📊 Project Update                        │
│                                          │
│ Proyek "Pembangunan Gedung A"            │
│ Status: In Progress → Review             │
│                                          │
│ [View Project]                           │
└─────────────────────────────────────────┘
```

---

## Cara Menggunakan

### Desktop Experience

#### 1. Notifikasi Popup (Toast)

Saat notifikasi baru datang, popup muncul di kanan atas:

```
     ┌───────────────────────────────┐
     │ 📝 Leave Request Approval     │
     │ John Doe - 3 days leave       │
     │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
     │ [5s auto-dismiss]          [×]│
     └───────────────────────────────┘
```

**Features:**
- ✅ Auto-dismiss setelah 5 detik
- 🖱️ Click untuk buka detail
- ❌ Klik × untuk close manual
- 📚 Maksimal 3 toast visible

#### 2. Badge Count di Navbar

```
┌────────────────────────────────────┐
│ 🏠 Dashboard  📊 Projects  🔔 [5]  │
└────────────────────────────────────┘
                            ↑
                      Unread count
```

**Badge menunjukkan:**
- 🔴 Jumlah notifikasi belum dibaca
- 📈 Update real-time
- 🎯 Maksimal tampil "99+"

### Mobile Experience

#### 1. Push Notification Native

**Android:**
```
┌─────────────────────────────────────┐
│ 📝 Nusantara                         │
│ Leave Request Approval               │
│ John Doe mengajukan cuti 3 hari     │
│                                      │
│ [✓ Approve] [✗ Reject] [View]      │
└─────────────────────────────────────┘
```

**iOS:**
```
┌─────────────────────────────────────┐
│   📝 Nusantara              8:30 AM  │
│   Leave Request Approval             │
│   John Doe mengajukan cuti 3 hari   │
│                                      │
│   Swipe for more                     │
└─────────────────────────────────────┘
```

#### 2. In-App Toast

Sama seperti desktop, tapi:
- 📱 Full width (responsive)
- 👆 Touch-friendly buttons
- ⚡ Smooth animations

---

## Action Buttons

### Approve/Reject from Notification

#### Desktop Flow

1. **Click Approve:**
   ```
   ┌──────────────────────────┐
   │ [Approving...] 🔄        │
   └──────────────────────────┘
   ```

2. **Success:**
   ```
   ┌──────────────────────────┐
   │ ✅ Request Approved!      │
   │ Navigating to details...  │
   └──────────────────────────┘
   ```

3. **Auto-navigate** ke halaman leave request

#### Mobile Flow

1. **Tap notification**
2. **Swipe or tap action button**
3. **Confirm action** (if required)
4. **See success message**
5. **App opens** to relevant page

### Action Button Types

| Button | Action | Confirmation | Navigation |
|--------|--------|--------------|------------|
| ✓ Approve | Approve leave request | No | Leave request detail |
| ✗ Reject | Reject leave request | Optional reason | Leave request detail |
| 👁️ View | Open detail page | No | Leave request detail |
| ⏰ Clock Now | Open clock in/out | No | Attendance page |
| Dismiss | Close notification | No | None |

### Error Handling

Jika action gagal:

```
┌───────────────────────────────────┐
│ ❌ Action Failed                   │
│ Failed to approve leave request    │
│ Error: Network timeout             │
│                                    │
│ [Retry]  [View Details]           │
└───────────────────────────────────┘
```

**Retry options:**
1. Tap **Retry** button
2. Check internet connection
3. Open app manually
4. Try action from in-app interface

---

## Riwayat Notifikasi

### Mengakses Riwayat

**Method 1: Click Badge**
```
Navbar → 🔔 [5] → Opens Notification Page
```

**Method 2: Menu**
```
Profile Menu → Notifications → Notification History
```

### Notification Page Layout

```
┌────────────────────────────────────────┐
│  Notifications                     [5] │
│  [Mark all as read]  [Clear all]      │
├────────────────────────────────────────┤
│  [All (15)]  [Unread (5)]             │
├────────────────────────────────────────┤
│  ● 📝 Leave Request Approval           │
│     John Doe - 3 days leave            │
│     2 hours ago                        │
│     [✓ Approve] [✗ Reject]            │
├────────────────────────────────────────┤
│  ✅ Leave Request Approved             │
│     Your leave has been approved       │
│     5 hours ago                        │
├────────────────────────────────────────┤
│  ⏰ Attendance Reminder                │
│     Don't forget to clock in!          │
│     Yesterday at 8:00 AM               │
└────────────────────────────────────────┘
```

### Features

#### 1. Filter Tabs

- **All**: Semua notifikasi (15)
- **Unread**: Hanya yang belum dibaca (5)

#### 2. Bulk Actions

- **Mark all as read**: Tandai semua sebagai sudah dibaca
- **Clear all**: Hapus semua riwayat (dengan konfirmasi)

#### 3. Individual Actions

- **Click notification**: Buka detail page
- **Mark as read**: Tap untuk tandai sudah dibaca
- **Delete**: 🗑️ button untuk hapus

#### 4. Visual Indicators

- **● Purple dot**: Notifikasi belum dibaca
- **Purple background**: Unread notification
- **Normal background**: Read notification
- **Highlighted**: Selected notification

### Storage & Limits

- **Maximum stored**: 100 notifikasi terakhir
- **Storage**: Browser localStorage
- **Persistence**: Tetap ada setelah refresh
- **Sync**: Tidak sync antar device (local only)

---

## Pengaturan

### Browser Permissions

#### Chrome/Edge

1. Klik icon 🔒 di address bar
2. Site settings
3. Notifications → Allow

#### Firefox

1. Klik icon 🔒 di address bar
2. Permissions
3. Receive Notifications → Allow

#### Safari

1. Safari → Preferences
2. Websites → Notifications
3. Select site → Allow

### System Notifications

#### Windows 10/11

```
Settings → System → Notifications & actions
→ Get notifications from apps and other senders [ON]
→ Chrome [ON]
```

#### macOS

```
System Preferences → Notifications & Focus
→ Chrome → Allow Notifications
```

#### Android

```
Settings → Apps → Chrome
→ Notifications → Allow
```

#### iOS

```
Settings → Notifications → Safari
→ Allow Notifications [ON]
```

### Do Not Disturb

**Windows:**
- Focus Assist: Settings → System → Focus assist

**macOS:**
- Do Not Disturb: Control Center → Focus

**Android:**
- Do Not Disturb: Quick settings → Do Not Disturb

**iOS:**
- Focus: Control Center → Focus

**Note:** Notifikasi tetap akan masuk ke riwayat, hanya tidak muncul popup.

---

## Troubleshooting

### Problem 1: Tidak Terima Notifikasi

**Check:**
- [ ] Permission granted? (Check browser settings)
- [ ] Internet connected?
- [ ] App tab still open?
- [ ] Service worker active? (F12 → Application → Service Workers)

**Solutions:**
1. Refresh page
2. Logout dan login kembali
3. Re-enable notifications
4. Clear cache and reload
5. Check firewall/antivirus settings

### Problem 2: Notifikasi Muncul Ganda

**Penyebab:**
- Multiple tabs open
- Multiple service workers registered

**Solutions:**
1. Close duplicate tabs
2. F12 → Application → Service Workers → Unregister all
3. Refresh page
4. Login kembali

### Problem 3: Action Buttons Tidak Bekerja

**Check:**
- [ ] Logged in?
- [ ] Internet connected?
- [ ] Token expired?

**Solutions:**
1. Login ulang
2. Check network console (F12 → Network)
3. Try action from in-app page
4. Contact admin if persists

### Problem 4: Badge Count Salah

**Solutions:**
1. Refresh notification page
2. Mark all as read, then reload
3. Clear localStorage: `localStorage.clear()`
4. Login kembali

### Problem 5: Notifikasi Tidak Muncul di Mobile

**iOS Specific:**
- Must add to home screen
- Must open from home screen icon
- Safari 16+ required

**Android Specific:**
- Chrome 50+ required
- Allow Chrome to run in background

---

## FAQ

### Q1: Apakah notifikasi gratis?

**A:** Ya, push notifications tidak dikenakan biaya tambahan.

### Q2: Berapa lama notifikasi tersimpan?

**A:** Maksimal 100 notifikasi terakhir. Notifikasi lama akan otomatis dihapus.

### Q3: Apakah notifikasi sync antar device?

**A:** Tidak, notifikasi tersimpan lokal di setiap device.

### Q4: Bisakah saya mute notifikasi tertentu?

**A:** Saat ini belum ada fitur ini. Anda bisa:
- Block notifikasi dari browser settings
- Use system Do Not Disturb
- Request fitur ini ke admin

### Q5: Apakah notifikasi tetap masuk saat offline?

**A:** Ya, saat online kembali notifikasi yang terlewat akan dikirim.

### Q6: Bagaimana cara approve leave request dari notifikasi?

**A:** 
1. Click notifikasi
2. Pilih action button "Approve" atau "Reject"
3. Confirm action (if required)
4. Done! Notifikasi success akan muncul

### Q7: Kenapa ada delay notifikasi?

**A:** Delay bisa disebabkan:
- Network latency
- Server load
- Firebase FCM queue
- Normal delay: 1-5 detik

### Q8: Bisakah saya customize bunyi notifikasi?

**A:** Saat ini menggunakan bunyi default sistem. Custom sounds belum tersedia.

### Q9: Apakah data notifikasi aman?

**A:** Ya, notifikasi:
- Encrypted in transit (HTTPS)
- Stored locally only
- Requires authentication
- GDPR compliant

### Q10: Support browser apa saja?

**A:**
- ✅ Chrome 50+ (Desktop & Mobile)
- ✅ Firefox 44+ (Desktop & Mobile)
- ✅ Edge 79+ (Desktop & Mobile)
- ✅ Safari 16+ (Desktop & iOS - with limitations)
- ❌ Internet Explorer (not supported)

---

## Kontak Support

**Technical Issues:**
- Email: support@nusantaragroup.co
- Phone: +62 xxx xxxx xxxx
- WhatsApp: +62 xxx xxxx xxxx

**Business Hours:**
- Senin - Jumat: 08:00 - 17:00 WIB
- Sabtu: 08:00 - 12:00 WIB
- Minggu: Closed

**Emergency Contact:**
- On-call support: +62 xxx xxxx xxxx
- 24/7 for critical issues

---

## Version History

**v1.0.0** (October 2024)
- ✨ Initial release
- ✅ Push notifications
- 📝 Leave approval actions
- ⏰ Attendance reminders
- 🔔 Notification history

---

**Last Updated:** October 19, 2024  
**Document Version:** 1.0.0  
**For:** Nusantara Group SaaS PWA
