# 📄 SUBSIDIARY DATA IN PURCHASE ORDER PDF

**Updated:** October 16, 2025  
**Status:** ✅ READY  
**Purpose:** Documentation for how Karawang subsidiary data appears in PDF

---

## 🎯 OVERVIEW

Setelah update data subsidiary ke lokasi Karawang, informasi berikut akan otomatis muncul di PDF Purchase Order:

---

## 📋 DATA YANG MUNCUL DI PDF

### 1. **LETTERHEAD SECTION** (Top of PDF)
Menampilkan informasi perusahaan subsidiary yang membuat PO:

```
┌─────────────────────────────────────────────────────┐
│  [LOGO]  NAMA SUBSIDIARY                            │
│          Alamat lengkap di Karawang                 │
│          Telp: +62-267-xxxx-xxxx                    │
│          Email: info@subsidiary.co.id               │
└─────────────────────────────────────────────────────┘
```

**Data Fields:**
- `subsidiary.name` → Nama perusahaan
- `subsidiary.address.street` → Jalan dan kawling
- `subsidiary.address.city` → **"Karawang"**
- `subsidiary.address.province` → **"Jawa Barat"**
- `subsidiary.address.postalCode` → Kode pos
- `subsidiary.contact_info.phone` → **"+62-267-xxxx-xxxx"**
- `subsidiary.contact_info.email` → Email

---

## 🏢 CONTOH OUTPUT PER SUBSIDIARY

### NU001 - CV. CAHAYA UTAMA EMPATBELAS
**Akan muncul di PDF sebagai:**
```
CV. CAHAYA UTAMA EMPATBELAS
Jl. Harapan Raya Kav. A-14, KIIC
Karawang, Jawa Barat 41361
Telp: +62-267-8520-1401 | Email: info@cahayautama14.co.id
```

### NU002 - CV. BINTANG SURAYA
**Akan muncul di PDF sebagai:**
```
CV. BINTANG SURAYA
Jl. Surya Utama Kav. B-88, Surya Cipta
Karawang, Jawa Barat 41363
Telp: +62-267-8520-1402 | Email: info@bintangsuraya.co.id
```

### NU003 - CV. LATANSA
**Akan muncul di PDF sebagai:**
```
CV. LATANSA
Jl. Mitra Industri Kav. C-25, KIM Karawang
Karawang, Jawa Barat 41362
Telp: +62-267-8520-1403 | Email: info@latansa.co.id
```

### NU004 - CV. GRAHA BANGUN NUSANTARA
**Akan muncul di PDF sebagai:**
```
CV. GRAHA BANGUN NUSANTARA
Jl. Industri Terpadu Kav. D-77, KNIC
Karawang, Jawa Barat 41364
Telp: +62-267-8520-1404 | Email: info@grahabangun.co.id
```

### NU005 - CV. SAHABAT SINAR RAYA
**Akan muncul di PDF sebagai:**
```
CV. SAHABAT SINAR RAYA
Jl. Bukit Indah Industrial Kav. E-99
Karawang, Jawa Barat 41374
Telp: +62-267-8520-1405 | Email: info@sahabatsinar.co.id
```

### NU006 - PT. PUTRA JAYA KONSTRUKASI
**Akan muncul di PDF sebagai:**
```
PT. PUTRA JAYA KONSTRUKASI
Jl. Permata Industrial Park Kav. F-123, KIIC
Karawang, Jawa Barat 41361
Telp: +62-267-8520-1406 | Email: info@putrajaya.co.id
```

---

## 🔄 DATA FLOW: DATABASE → PDF

### Step-by-Step Process:

```
1. User clicks "Generate PDF" for a Purchase Order
   ↓
2. Backend fetches PO data including project_id
   ↓
3. Backend gets project.subsidiary_id
   ↓
4. Backend fetches subsidiary data from database:
   - SELECT * FROM subsidiaries WHERE id = subsidiary_id
   ↓
5. Extract JSONB fields:
   - address.street
   - address.city        → "Karawang"
   - address.province    → "Jawa Barat"
   - address.postalCode
   - contact_info.phone  → "+62-267-xxxx-xxxx"
   - contact_info.email
   ↓
6. PDF Generator builds company info section:
   - _drawLetterhead(doc, subsidiaryData)
   ↓
7. PDF displays updated Karawang information
```

---

## 📍 PDF LAYOUT POSITIONS

### Letterhead Section (Y: 40-100)
```javascript
// Location in purchaseOrderPdfGenerator.js
_drawLetterhead(doc, company) {
  // Line 1: Company Name (Bold, 13pt)
  doc.text(company.name, x, y);
  
  // Line 2: Street Address
  doc.text(company.address.street, x, y + 14);
  
  // Line 3: City, Province, Postal Code
  doc.text(
    `${company.address.city}, ${company.address.province} ${company.address.postalCode}`,
    x, y + 24
  );
  
  // Line 4: Phone & Email
  doc.text(
    `Telp: ${company.contact_info.phone} | Email: ${company.contact_info.email}`,
    x, y + 34
  );
}
```

**Position Details:**
- **X Position:** 95 points (right of logo)
- **Y Position:** 45 points from top
- **Font:** Helvetica / Helvetica-Bold
- **Size:** 8-13 points
- **Color:** Black (#000000)

---

## 🧪 TESTING CHECKLIST

### Manual Testing Steps:

1. **Generate PDF for each subsidiary:**
   - [ ] NU001 - CV. CAHAYA UTAMA EMPATBELAS
   - [ ] NU002 - CV. BINTANG SURAYA
   - [ ] NU003 - CV. LATANSA
   - [ ] NU004 - CV. GRAHA BANGUN NUSANTARA
   - [ ] NU005 - CV. SAHABAT SINAR RAYA
   - [ ] NU006 - PT. PUTRA JAYA KONSTRUKASI

2. **Verify in PDF:**
   - [ ] Company name appears correctly
   - [ ] Street address shows Karawang location
   - [ ] City displays "Karawang"
   - [ ] Province displays "Jawa Barat"
   - [ ] Postal code is correct (41361-41374)
   - [ ] Phone number shows +62-267-xxxx-xxxx
   - [ ] Email is correct

3. **Check Formatting:**
   - [ ] Text is aligned properly
   - [ ] No text overflow
   - [ ] Font sizes are readable
   - [ ] All information fits in letterhead section

---

## 🔍 TROUBLESHOOTING

### Issue: Subsidiary data not showing
**Solution:**
```sql
-- Check if subsidiary exists
SELECT * FROM subsidiaries WHERE id = 'NUxxx';

-- Check if project has subsidiary_id
SELECT id, name, subsidiary_id FROM projects WHERE id = 'project_id';
```

### Issue: Old Jakarta address still showing
**Solution:**
```bash
# Restart backend to clear cache
docker-compose restart backend

# Verify database has new data
docker-compose exec postgres psql -U admin -d nusantara_construction \
  -c "SELECT id, name, address->>'city' FROM subsidiaries;"
```

### Issue: Phone number format wrong
**Solution:**
```sql
-- Update specific subsidiary contact
UPDATE subsidiaries 
SET contact_info = jsonb_set(
  contact_info,
  '{phone}',
  '"+62-267-8520-xxxx"'
)
WHERE id = 'NUxxx';
```

---

## 📊 VERIFICATION QUERIES

### Check all subsidiaries are in Karawang:
```sql
SELECT 
  id,
  name,
  address->>'city' as city,
  address->>'province' as province,
  contact_info->>'phone' as phone
FROM subsidiaries
WHERE address->>'city' = 'Karawang'
ORDER BY id;
```

### Get full address format:
```sql
SELECT 
  id,
  name,
  CONCAT(
    address->>'street', ', ',
    address->>'city', ', ',
    address->>'province', ' ',
    address->>'postalCode'
  ) as full_address,
  contact_info->>'phone' as phone,
  contact_info->>'email' as email
FROM subsidiaries
ORDER BY id;
```

---

## 🎨 CUSTOMIZATION

### To change letterhead layout:
Edit `/root/APP-YK/backend/utils/purchaseOrderPdfGenerator.js`

Search for: `_drawLetterhead`

**Adjustable Parameters:**
```javascript
// Logo size
const logoSize = 45;  // UBAH DI SINI

// Company name font size
doc.fontSize(13);  // UBAH DI SINI

// Address font size
doc.fontSize(8);  // UBAH DI SINI

// Position from left
const infoX = this.margin + 55;  // UBAH DI SINI
```

---

## ✅ SUCCESS CRITERIA

**PDF Generation is successful when:**
- ✅ All subsidiary names display correctly
- ✅ All addresses show Karawang locations
- ✅ All phone numbers use 0267 area code
- ✅ Province shows "Jawa Barat"
- ✅ Postal codes are correct (41361-41374)
- ✅ Layout is clean and professional
- ✅ No text overflow or formatting issues

---

## 📞 SUBSIDIARY PHONE NUMBERS REFERENCE

| ID | Name | Phone |
|----|------|-------|
| NU001 | CV. CAHAYA UTAMA EMPATBELAS | +62-267-8520-1401 |
| NU002 | CV. BINTANG SURAYA | +62-267-8520-1402 |
| NU003 | CV. LATANSA | +62-267-8520-1403 |
| NU004 | CV. GRAHA BANGUN NUSANTARA | +62-267-8520-1404 |
| NU005 | CV. SAHABAT SINAR RAYA | +62-267-8520-1405 |
| NU006 | PT. PUTRA JAYA KONSTRUKASI | +62-267-8520-1406 |

---

## 🗺️ SUBSIDIARY LOCATIONS REFERENCE

| ID | Name | Industrial Estate | District |
|----|------|-------------------|----------|
| NU001 | CV. CAHAYA UTAMA EMPATBELAS | KIIC | Telukjambe Timur |
| NU002 | CV. BINTANG SURAYA | Surya Cipta | Telukjambe Timur |
| NU003 | CV. LATANSA | KIM | Telukjambe Barat |
| NU004 | CV. GRAHA BANGUN NUSANTARA | KNIC | Klari |
| NU005 | CV. SAHABAT SINAR RAYA | Bukit Indah City | Cikampek |
| NU006 | PT. PUTRA JAYA KONSTRUKASI | KIIC | Telukjambe Timur |

---

**Last Updated:** October 16, 2025  
**Backend Status:** ✅ Restarted with new data  
**Database Status:** ✅ All subsidiaries updated to Karawang  
**PDF Generator:** ✅ Ready to display new information

---

*Ready for testing! Generate any Purchase Order PDF to see the new Karawang locations.* 🎉
