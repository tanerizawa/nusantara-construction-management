# Database Naming Convention - Quick Reference

## 📊 Status Saat Ini

### ✅ **SUDAH BENAR (95%)**
- **35 Tabel** - Semua snake_case
- **Semua Kolom** - 0 camelCase
- **Index** - Mayoritas snake_case

### ⚠️ **PERLU DIPERBAIKI (5%)**
- **80 Constraint** - Masih camelCase
- **66 Duplicate** - berita_acara table

---

## 🎯 Rekomendasi

### **Apakah Harus Diperbaiki?**

**Jawaban: OPSIONAL (Low Priority)**

**Alasan:**
1. ✅ Kolom sudah benar (project_id, user_id, dll)
2. ✅ Application queries tidak terpengaruh
3. ✅ Data tidak berubah
4. ⚠️ Hanya mempengaruhi DDL operations & error messages

### **Kapan Harus Diperbaiki?**
- Saat ada maintenance window
- Sebelum production deployment
- Untuk consistency & best practices
- Untuk memudahkan maintenance

---

## 🚀 Cara Memperbaiki

### **Option 1: Otomatis (Recommended)**
```bash
cd /root/APP-YK
./scripts/execute-naming-convention-fix.sh
```

Script akan:
1. ✅ Backup database otomatis
2. ✅ Fix semua constraint
3. ✅ Verify results
4. ✅ Berikan rollback instructions

### **Option 2: Manual**
```bash
# 1. Backup
docker exec nusantara-postgres pg_dump -U admin nusantara_construction > backup.sql

# 2. Execute
docker exec -i nusantara-postgres psql -U admin nusantara_construction < scripts/fix-database-naming-convention.sql

# 3. Verify
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "SELECT COUNT(*) FROM pg_constraint WHERE conname ~ '[A-Z]';"
```

---

## ⏱️ Timeline

| Task | Time | Risk |
|------|------|------|
| Backup | 2 min | None |
| Execute | 5 min | Low |
| Test | 15 min | Low |
| **Total** | **~20 min** | **Low** |

---

## 📝 Files Generated

1. **DATABASE_NAMING_CONVENTION_ANALYSIS.md** - Full analysis report
2. **scripts/fix-database-naming-convention.sql** - SQL fix script
3. **scripts/execute-naming-convention-fix.sh** - Bash execution script

---

## 🔍 Before & After

### **Before (camelCase):**
```sql
-- Constraint names:
berita_acara_projectId_fkey
berita_acara_milestoneId_fkey
purchase_orders_createdBy_fkey
project_team_members_userId_fkey
```

### **After (snake_case):**
```sql
-- Constraint names:
berita_acara_project_id_fkey
berita_acara_milestone_id_fkey
purchase_orders_created_by_fkey
project_team_members_user_id_fkey
```

**Note:** Kolom tetap sama (tidak berubah), hanya constraint name yang berubah.

---

## 💡 Key Points

1. **NO DOWNTIME** - Application tetap berjalan
2. **NO DATA CHANGES** - Data tidak berubah sama sekali
3. **NO COLUMN CHANGES** - Kolom tetap snake_case
4. **LOW RISK** - Hanya rename constraint
5. **EASY ROLLBACK** - Restore dari backup jika ada masalah

---

## 🛡️ Safety Measures

1. ✅ Auto backup sebelum execute
2. ✅ Transaction-based (rollback otomatis jika error)
3. ✅ Verification setelah execution
4. ✅ Restore instructions provided

---

## ❓ FAQ

**Q: Apakah aplikasi akan error?**  
A: Tidak. Kolom tidak berubah, hanya constraint names.

**Q: Apakah data akan hilang?**  
A: Tidak sama sekali. Zero data changes.

**Q: Berapa lama downtime?**  
A: Zero downtime. Application tetap running.

**Q: Bagaimana jika ada masalah?**  
A: Restore dari backup yang auto-created.

**Q: Apakah wajib dilakukan?**  
A: Tidak wajib, tapi recommended untuk best practices.

---

## 📞 Support

Jika ada pertanyaan atau issue:
1. Check logs: `docker logs nusantara-postgres`
2. Verify backup exists
3. Restore jika perlu
4. Contact database admin

---

**Last Updated:** October 16, 2025  
**Status:** Ready to Execute  
**Risk Level:** LOW  
**Priority:** Medium (Optional)
