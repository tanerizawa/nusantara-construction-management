# 🗄️ Archive Scripts - Development & Testing Files

**Directory**: `backend/archive-scripts/`  
**Created**: October 9, 2025  
**Purpose**: Archive development, testing, and seed scripts that are not needed for production

---

## 📋 Archived Categories

### 1. Empty Files (12 files) - `empty-files/`
Files that are 0 bytes (empty, never completed):
- complete-mockup-migration.js
- create-final-projects.js
- create-five-projects.js
- enhanced-migration.js
- final-migration-fix.js
- generate-rab-final.js
- migrate-routes.js
- route-migration-summary.js
- seed-direct-db.js
- seed-hr-data.js
- setup-login.js
- test-create-project.js

**Status**: ❌ OBSOLETE - Empty files, never used

---

### 2. Test Files (7 files) - `test-files/`
Testing and debugging scripts used during development:
- test-db-connection.js - Database connection testing
- test-db.js - Database basic tests
- test-direct-import.js - Import testing
- test-journal-import.js - Journal entry import tests
- test-models-export.js - Model export tests
- test-phase9-endpoints.js - Phase 9 endpoint testing
- test-purchase-tracking.js - Purchase tracking tests

**Status**: ❌ DEVELOPMENT ONLY - Not needed in production

---

### 3. Seed Files (18 files) - `seed-files/`
Database seeding and sample data creation scripts:

#### Project Seeds
- seed-karawang-projects.js
- seed-nusantara-projects.js
- seed-projects-api.js
- add-remaining-projects.js
- create-simple-projects.js

#### RAB (Budget) Seeds
- seed-comprehensive-rab.js
- seed-comprehensive-rab-verbose.js
- seed-rab-sequelize.js
- seed-rab-simple.js

#### Manpower Seeds
- seed-comprehensive-manpower.js
- seed-comprehensive-manpower-nusantara.js

#### Subsidiary Seeds
- seed-enhanced-subsidiaries.js
- seed-nusantara-subsidiaries.js
- seed-subsidiaries.js

#### Financial Seeds
- seed-journal-entries.js

#### Sample Data Creators
- create-budget-sample-data.js
- create-cost-center-sample-data.js
- create-fixed-asset-sample-data.js

**Status**: ❌ DEVELOPMENT ONLY - Used for initial data setup

---

### 4. RAB Generators (2 files) - `rab-generators/`
Temporary RAB (Rencana Anggaran Biaya) generator scripts:
- comprehensive-rab-generator.js - Comprehensive RAB generation
- simple-rab-test.js - Simple RAB testing

**Status**: ❌ TEMPORARY - Used during RAB feature development

---

## 📊 Statistics

| Category | File Count | Total Size |
|----------|-----------|------------|
| Empty Files | 12 | 0 bytes |
| Test Files | 7 | ~15 KB |
| Seed Files | 18 | ~250 KB |
| RAB Generators | 2 | ~11 KB |
| **TOTAL** | **39 files** | **~276 KB** |

---

## 🎯 Why Archive These Files?

### Production Concerns
1. **Security**: Test files may contain sensitive connection strings
2. **Performance**: Extra files increase container size unnecessarily
3. **Confusion**: Clear separation between production and development code
4. **Maintainability**: Easier to understand what's actually used

### Development Benefits
1. **Historical Reference**: Can check how features were tested
2. **Data Regeneration**: Can re-run seeds if needed for new environment
3. **Debugging**: Can reference test scripts for troubleshooting
4. **Learning**: New developers can see how features were developed

---

## ⚠️ IMPORTANT NOTES

### DO NOT Use in Production
These files are:
- ❌ NOT required for production deployment
- ❌ NOT maintained for production use
- ❌ MAY contain hardcoded test data
- ❌ MAY have security implications

### When to Use
These files should ONLY be used for:
- ✅ Local development environment setup
- ✅ Creating test databases
- ✅ Debugging specific features
- ✅ Historical reference

### How to Use (Development Only)
If you need to run any of these scripts in development:

```bash
# From backend folder
cd /root/APP-YK/backend

# Run a seed script
node archive-scripts/seed-files/seed-nusantara-projects.js

# Run a test script
node archive-scripts/test-files/test-db-connection.js
```

---

## 🧹 Clean Production Backend

After archiving, the backend root folder contains only:
```
backend/
├── server.js              # Main server file ✅
├── package.json           # Dependencies ✅
├── package-lock.json      # Locked dependencies ✅
├── models/                # Database models ✅
├── routes/                # API routes ✅
├── services/              # Business logic ✅
├── middleware/            # Express middleware ✅
└── archive-scripts/       # This archive ⚠️
```

**Total active files**: 3 files (server.js, package.json, package-lock.json)  
**Status**: ✅ CLEAN & PRODUCTION READY

---

## 📝 Cleanup History

### Phase 1 - Script Cleanup (Oct 9, 2025)
- Archived 12 empty files
- Archived 7 test files
- Archived 18 seed files
- Archived 2 RAB generators
- **Total**: 39 files moved to archive

### Phase 2 - Routes Cleanup (Oct 9, 2025)
- Archived 7 _db.js files (all have regular versions)
- Moved to: `routes/archive-old-monolith/`

---

## 🗑️ Can These Be Deleted?

**YES**, but we keep them for:
1. **Development Reference** - How features were tested
2. **Data Regeneration** - Can recreate test data if needed
3. **Debugging** - Reference implementation details
4. **Onboarding** - Help new developers understand the system

**Recommendation**: 
- Keep for development/staging environments
- Exclude from production Docker images
- Can delete after 6+ months if never referenced

---

## 📦 Production Deployment

### What to Include
```dockerfile
# In Dockerfile, only copy necessary files:
COPY server.js .
COPY package*.json .
COPY models/ ./models/
COPY routes/ ./routes/
COPY services/ ./services/
COPY middleware/ ./middleware/

# Exclude archive-scripts from production build
```

### What to Exclude
- ❌ archive-scripts/ (this entire folder)
- ❌ node_modules/ (will be reinstalled)
- ❌ .git/ (not needed in container)
- ❌ *.md files (documentation)

---

## 🔗 Related Documentation

- [BACKEND_CLEANUP_COMPLETE_REPORT.md](../../BACKEND_CLEANUP_COMPLETE_REPORT.md)
- [ARCHIVING_COMPLETE_REPORT.md](../../ARCHIVING_COMPLETE_REPORT.md)
- [README_BACKEND_COMPLETE.md](../../README_BACKEND_COMPLETE.md)

---

**Project**: Nusantara Construction Management System  
**Phase**: Backend Cleanup Complete  
**Status**: Production Ready  
**Date**: October 9, 2025

