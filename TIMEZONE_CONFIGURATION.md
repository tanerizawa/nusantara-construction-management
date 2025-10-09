# TIMEZONE CONFIGURATION - WIB (Asia/Jakarta)
**Date**: October 9, 2025  
**Timezone**: WIB (Waktu Indonesia Barat) / UTC+7  
**Status**: ✅ CONFIGURED

---

## 📍 Configuration Applied

### 1. Database (PostgreSQL)
✅ **Database timezone**: `Asia/Jakarta`
```sql
ALTER DATABASE nusantara_construction SET timezone TO 'Asia/Jakarta';
```

✅ **Container environment**:
```yaml
environment:
  TZ: Asia/Jakarta
  PGTZ: Asia/Jakarta
```

### 2. Backend (Node.js/Express)
✅ **Sequelize config**: `timezone: '+07:00'`
```javascript
// /backend/config/database.js
{
  dialect: 'postgres',
  timezone: '+07:00', // WIB/Asia Jakarta
  ...
}
```

✅ **Server runtime**:
```javascript
// /backend/server.js
process.env.TZ = 'Asia/Jakarta';
```

✅ **Docker environment**:
```yaml
environment:
  TZ: Asia/Jakarta
```

### 3. Frontend (React)
✅ **Date utilities**: `/frontend/src/utils/dateUtils.js`
- All date/time functions use `Asia/Jakarta` timezone
- Automatic WIB formatting
- Indonesian locale support

✅ **Docker environment**:
```yaml
environment:
  TZ: Asia/Jakarta
  REACT_APP_TIMEZONE: Asia/Jakarta
```

---

## 🎯 Features

### Date Utilities (`/frontend/src/utils/dateUtils.js`)

#### 1. Format Date
```javascript
import { formatDate } from '@/utils/dateUtils';

formatDate(date, 'short')   // 09/10/2025
formatDate(date, 'medium')  // 9 Okt 2025
formatDate(date, 'long')    // 9 Oktober 2025
formatDate(date, 'full')    // Senin, 9 Oktober 2025
```

#### 2. Format Time
```javascript
import { formatTime } from '@/utils/dateUtils';

formatTime(date)           // 14:30 WIB
formatTime(date, true)     // 14:30:45 WIB
```

#### 3. Format DateTime
```javascript
import { formatDateTime } from '@/utils/dateUtils';

formatDateTime(date)                    // 9 Okt 2025, 14:30 WIB
formatDateTime(date, 'long')           // 9 Oktober 2025, 14:30 WIB
formatDateTime(date, 'full', true)     // Senin, 9 Oktober 2025, 14:30:45 WIB
```

#### 4. Format DateTime Short (for tables)
```javascript
import { formatDateTimeShort } from '@/utils/dateUtils';

formatDateTimeShort(date)  // 09/10/2025 14:30 WIB
```

#### 5. Relative Time
```javascript
import { formatRelativeTime } from '@/utils/dateUtils';

formatRelativeTime(date)
// "Baru saja"
// "5 menit yang lalu"
// "2 jam yang lalu"
// "3 hari yang lalu"
// "2 bulan yang lalu"
```

#### 6. Get Current Time in WIB
```javascript
import { getCurrentWIB } from '@/utils/dateUtils';

const now = getCurrentWIB();  // Current Date in WIB
```

#### 7. Date Input Formatting
```javascript
import { formatDateInput } from '@/utils/dateUtils';

formatDateInput(date)  // "2025-10-09" (for input type="date")
```

---

## 📝 Usage Examples

### Example 1: Project Card
```javascript
import { formatDateTime, formatRelativeTime } from '@/utils/dateUtils';

const ProjectCard = ({ project }) => (
  <div>
    <h3>{project.name}</h3>
    <p>Dibuat: {formatDateTime(project.createdAt)}</p>
    <p className="text-gray-500">
      {formatRelativeTime(project.updatedAt)}
    </p>
  </div>
);
```

### Example 2: Data Table
```javascript
import { formatDate, formatTimeShort } from '@/utils/dateUtils';

const ProjectsTable = ({ projects }) => (
  <table>
    <thead>
      <tr>
        <th>Nama</th>
        <th>Tanggal Mulai</th>
        <th>Waktu</th>
      </tr>
    </thead>
    <tbody>
      {projects.map(project => (
        <tr key={project.id}>
          <td>{project.name}</td>
          <td>{formatDate(project.startDate, 'long')}</td>
          <td>{formatTimeShort(project.createdAt)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
```

### Example 3: Purchase Order
```javascript
import { formatDate, formatDateTimeShort } from '@/utils/dateUtils';

const PODetails = ({ po }) => (
  <div>
    <h3>PO: {po.poNumber}</h3>
    <div>
      <label>Order Date:</label>
      <span>{formatDate(po.orderDate, 'long')}</span>
    </div>
    <div>
      <label>Created:</label>
      <span>{formatDateTimeShort(po.createdAt)}</span>
    </div>
  </div>
);
```

### Example 4: Activity Feed
```javascript
import { formatRelativeTime } from '@/utils/dateUtils';

const ActivityFeed = ({ activities }) => (
  <div>
    {activities.map(activity => (
      <div key={activity.id}>
        <p>{activity.message}</p>
        <span className="text-sm text-gray-500">
          {formatRelativeTime(activity.timestamp)}
        </span>
      </div>
    ))}
  </div>
);
```

---

## 🔍 Verification

### Test Script
```bash
bash /root/APP-YK/test-timezone-config.sh
```

### Manual Verification

#### 1. Check Database Timezone
```bash
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "SHOW timezone;"
# Expected: Asia/Jakarta
```

#### 2. Check Current Database Time
```bash
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "SELECT NOW();"
# Expected: timestamp with +07 offset
```

#### 3. Test Date Insertion
```sql
-- Insert test record
INSERT INTO projects (id, name, client_name, status, "createdAt", "updatedAt")
VALUES ('TEST-TZ', 'Test Timezone', 'Test Client', 'planning', NOW(), NOW());

-- Check timestamp
SELECT id, name, "createdAt", "updatedAt" FROM projects WHERE id = 'TEST-TZ';
-- Timestamps should be in WIB (UTC+7)

-- Clean up
DELETE FROM projects WHERE id = 'TEST-TZ';
```

---

## 📦 Files Modified/Created

### Modified:
1. `/root/APP-YK/docker-compose.yml`
   - Added `TZ: Asia/Jakarta` to all services
   - Added `PGTZ: Asia/Jakarta` to postgres
   - Added `REACT_APP_TIMEZONE: Asia/Jakarta` to frontend

2. `/root/APP-YK/backend/config/database.js`
   - Added `timezone: '+07:00'` to all environments

3. `/root/APP-YK/backend/server.js`
   - Added `process.env.TZ = 'Asia/Jakarta'`

### Created:
1. `/root/APP-YK/frontend/src/utils/dateUtils.js`
   - Complete date/time utilities with WIB support
   - Indonesian locale formatting
   - All timezone conversions handled automatically

2. `/root/APP-YK/frontend/src/utils/dateUtilsExample.js`
   - Usage examples and component samples

3. `/root/APP-YK/test-timezone-config.sh`
   - Timezone verification script

4. `/root/APP-YK/TIMEZONE_CONFIGURATION.md` (this file)
   - Complete documentation

---

## ✅ Benefits

1. **Consistent Timezone**: All dates/times displayed in WIB
2. **No Manual Conversion**: Automatic timezone handling
3. **Indonesian Locale**: Date/time in Indonesian format
4. **Database Integrity**: Timestamps stored with timezone info
5. **Browser Independent**: Works regardless of user's browser timezone
6. **Developer Friendly**: Simple API, easy to use

---

## 🚀 Next Steps

### For New Components:
1. Import date utilities:
   ```javascript
   import { formatDate, formatTime, formatDateTime } from '@/utils/dateUtils';
   ```

2. Use utilities for all date/time displays:
   ```javascript
   <p>Created: {formatDateTime(item.createdAt)}</p>
   ```

3. Use Indonesian locale:
   ```javascript
   <p>{formatDate(item.date, 'long')}</p>
   // Output: "9 Oktober 2025"
   ```

### For Backend:
- All Sequelize models automatically use WIB timezone
- No code changes needed for existing models
- New timestamps will be in WIB

### For Database:
- All new timestamp columns will use Asia/Jakarta timezone
- Existing timestamps maintain their timezone info
- Queries automatically convert to WIB

---

## 📞 Support

If you encounter timezone issues:

1. **Check current timezone**:
   ```bash
   bash /root/APP-YK/test-timezone-config.sh
   ```

2. **Restart services** (if needed):
   ```bash
   docker-compose restart backend frontend
   ```

3. **Verify date displays** in browser developer console:
   ```javascript
   import { formatDateTime, getCurrentWIB } from '@/utils/dateUtils';
   console.log(formatDateTime(getCurrentWIB(), 'full', true));
   ```

---

## 📌 Notes

- **WIB** = Waktu Indonesia Barat = UTC+7
- Browser's local timezone does **NOT** affect display
- All dates stored with timezone information (`timestamp with time zone`)
- Backend uses `+07:00` offset for database connections
- Frontend utilities convert all dates to WIB before display
- System is fully timezone-aware and consistent

---

**Last Updated**: October 9, 2025  
**Configured by**: System Administrator  
**Location**: Karawang, Indonesia (WIB)
