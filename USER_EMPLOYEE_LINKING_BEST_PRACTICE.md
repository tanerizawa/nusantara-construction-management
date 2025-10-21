# 📋 User Management vs SDM (Manpower) - Best Practice Guide

## 🎯 Situasi yang Anda Alami

**Problem:**
- Membuat user baru "Danny" di **Settings > User Management**
- Data tidak muncul di halaman **SDM/Manpower**
- User bingung: kenapa data tidak sinkron?

**Root Cause:**
`users` table dan `manpower` table adalah **2 TABEL BERBEDA** dengan **TUJUAN BERBEDA**

---

## 🔍 Analisis Struktur Data

### 1. Tabel `users` (User Management)

**Tujuan:** Authentication & Authorization (Login system)

**Fields:**
```javascript
- id (PK)
- username (unique)      ← Login credential
- email (unique)         ← Login credential
- password (hashed)      ← Authentication
- role                   ← Authorization (admin, pm, finance, hr, etc)
- profile (JSONB)        ← Additional profile info
- permissions (JSONB)    ← Fine-grained permissions
- isActive               ← Account status
- lastLogin              ← Login tracking
- loginAttempts          ← Security
- lockUntil              ← Account locking
- created_at
- updated_at
```

**Purpose:**
- ✅ Manage system access (who can login)
- ✅ Manage permissions (what they can do)
- ✅ Track login activity
- ✅ Security management

**Example User:**
```json
{
  "id": "user_123",
  "username": "danny",
  "email": "danny@company.com",
  "role": "project_manager",
  "isActive": true,
  "profile": {
    "fullName": "Danny Wijaya",
    "phone": "08123456789"
  }
}
```

---

### 2. Tabel `manpower` (SDM/HR Management)

**Tujuan:** Employee Management (HR data)

**Fields:**
```javascript
- id (PK)
- employee_id (unique)   ← Employee number (NIK)
- name                   ← Full name
- position               ← Job title
- department             ← Department/Division
- email                  ← Work email
- phone                  ← Contact number
- join_date              ← Employment start date
- birth_date             ← Date of birth
- address                ← Home address
- status                 ← active/inactive/resigned
- employment_type        ← permanent/contract/freelance
- salary                 ← Compensation
- current_project        ← Current assignment
- subsidiary_id (FK)     ← Company subsidiary
- skills (JSONB)         ← Skills & certifications
- metadata (JSONB)       ← Additional HR data
- created_at
- updated_at
```

**Purpose:**
- ✅ Manage employee records (HR database)
- ✅ Track employment history
- ✅ Manage payroll data
- ✅ Project assignment
- ✅ Skills & competencies

**Example Employee:**
```json
{
  "id": "emp_456",
  "employee_id": "EMP-2024-001",
  "name": "Danny Wijaya",
  "position": "Senior Project Manager",
  "department": "Construction",
  "email": "danny@company.com",
  "salary": 15000000,
  "join_date": "2024-01-15",
  "status": "active",
  "subsidiary_id": "sub_jakarta",
  "skills": ["Project Management", "AutoCAD", "MS Project"]
}
```

---

## 🤔 Perbedaan Fundamental

| Aspect | Users Table | Manpower Table |
|--------|-------------|----------------|
| **Purpose** | System Access | HR Records |
| **Scope** | IT/System | Human Resources |
| **Focus** | Authentication/Authorization | Employee Management |
| **Who** | Anyone who needs system access | Company employees only |
| **Data** | Login credentials, permissions | Employment details, skills, salary |
| **Lifecycle** | Account creation → deactivation | Hiring → resignation/retirement |

---

## 📊 Relationship Analysis

### Current State: NO DIRECT RELATIONSHIP ⚠️

```
┌─────────────────┐                    ┌──────────────────┐
│  users table    │                    │  manpower table  │
│                 │                    │                  │
│  - id           │                    │  - id            │
│  - username     │  NO CONNECTION     │  - employee_id   │
│  - email        │ ◄──────────────► │  - name          │
│  - role         │                    │  - position      │
│  - password     │                    │  - department    │
└─────────────────┘                    └──────────────────┘
```

**Current Behavior:**
- Create user → Only in `users` table
- Create employee → Only in `manpower` table
- **NO automatic sync**
- **NO enforced relationship**

---

## 💡 Best Practice Recommendations

### Option 1: **Loose Coupling** (RECOMMENDED for flexibility) ⭐

**Concept:** Keep tables separate, link optionally

**Add to User model:**
```javascript
// backend/models/User.js
const User = sequelize.define('User', {
  // ... existing fields ...
  
  // Optional link to employee record
  employeeId: {
    type: DataTypes.STRING,
    allowNull: true,  // Not all users are employees
    field: 'employee_id',
    references: {
      model: 'manpower',
      key: 'id'
    }
  }
});
```

**Add to Manpower model:**
```javascript
// backend/models/Manpower.js
const Manpower = sequelize.define('Manpower', {
  // ... existing fields ...
  
  // Optional link to user account
  userId: {
    type: DataTypes.STRING,
    allowNull: true,  // Not all employees need system access
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  }
});
```

**Relationship:**
```javascript
// backend/models/index.js (or associations file)
User.belongsTo(Manpower, { 
  foreignKey: 'employeeId',
  as: 'employee'
});

Manpower.hasOne(User, {
  foreignKey: 'employeeId',
  as: 'userAccount'
});
```

**Benefits:**
- ✅ Flexibility: Not all users need to be employees
- ✅ Flexibility: Not all employees need system access
- ✅ Clean separation of concerns
- ✅ Easy to manage independently
- ✅ Can link later if needed

**Use Cases:**
- ✅ **User without Employee:** External consultant, client, vendor
- ✅ **Employee without User:** Field worker, laborer (no system access)
- ✅ **User with Employee:** Manager, supervisor, office staff

**Example Data:**

```javascript
// User with linked employee
{
  id: "user_1",
  username: "danny",
  email: "danny@company.com",
  role: "project_manager",
  employeeId: "emp_001"  // ← Link to manpower
}

// Employee with linked user
{
  id: "emp_001",
  employeeId: "EMP-2024-001",
  name: "Danny Wijaya",
  position: "Project Manager",
  userId: "user_1"  // ← Link to user
}

// User without employee (external consultant)
{
  id: "user_2",
  username: "consultant_john",
  email: "john@consulting.com",
  role: "supervisor",
  employeeId: null  // ← No employee record
}

// Employee without user (field worker)
{
  id: "emp_002",
  employeeId: "EMP-2024-002",
  name: "Budi Santoso",
  position: "Construction Worker",
  userId: null  // ← No system access
}
```

---

### Option 2: **Tight Coupling** (For strict employee-only system)

**Concept:** Every user MUST be an employee

**Not recommended for construction company because:**
- ❌ Need external consultants
- ❌ Need client/vendor access
- ❌ Need temp workers without system access
- ❌ Less flexible

---

### Option 3: **Single Table with Role Flag**

**Concept:** Merge users and manpower into one table

**Not recommended because:**
- ❌ Violates separation of concerns
- ❌ HR data mixed with IT data
- ❌ Harder to maintain
- ❌ Complex queries
- ❌ Data redundancy

---

## 🛠️ Implementation Plan (Recommended)

### Phase 1: Add Database Columns

**Migration File:** `backend/migrations/YYYYMMDD_add_user_employee_linking.js`

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add employee_id to users table
    await queryInterface.addColumn('users', 'employee_id', {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: 'manpower',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    
    // Add user_id to manpower table
    await queryInterface.addColumn('manpower', 'user_id', {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    
    // Add indexes for performance
    await queryInterface.addIndex('users', ['employee_id']);
    await queryInterface.addIndex('manpower', ['user_id']);
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'employee_id');
    await queryInterface.removeColumn('manpower', 'user_id');
  }
};
```

---

### Phase 2: Update Models

**Update User Model:**

```javascript
// backend/models/User.js
const User = sequelize.define('User', {
  // ... existing fields ...
  
  employeeId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'employee_id'
  }
}, {
  // ... existing config ...
});

// Add association method
User.associate = (models) => {
  User.belongsTo(models.Manpower, {
    foreignKey: 'employeeId',
    as: 'employee'
  });
};

// Add method to check if user has employee record
User.prototype.hasEmployeeRecord = function() {
  return !!this.employeeId;
};

// Add method to get full profile
User.prototype.getFullProfile = async function() {
  if (!this.employeeId) {
    return this.toSafeObject();
  }
  
  const Manpower = require('./Manpower');
  const employee = await Manpower.findByPk(this.employeeId);
  
  return {
    ...this.toSafeObject(),
    employee: employee ? employee.toJSON() : null
  };
};
```

**Update Manpower Model:**

```javascript
// backend/models/Manpower.js
const Manpower = sequelize.define('Manpower', {
  // ... existing fields ...
  
  userId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'user_id'
  }
}, {
  // ... existing config ...
});

// Add association method
Manpower.associate = (models) => {
  Manpower.hasOne(models.User, {
    foreignKey: 'employeeId',
    as: 'userAccount'
  });
  
  // ... other associations ...
};

// Add method to check if employee has user account
Manpower.prototype.hasUserAccount = function() {
  return !!this.userId;
};

// Add method to get with user account
Manpower.prototype.getWithUserAccount = async function() {
  if (!this.userId) {
    return this.toJSON();
  }
  
  const User = require('./User');
  const user = await User.findByPk(this.userId);
  
  return {
    ...this.toJSON(),
    userAccount: user ? user.toSafeObject() : null
  };
};
```

---

### Phase 3: Update API Endpoints

**User Management API:** `backend/routes/users.js`

```javascript
// POST /api/users - Create user with optional employee linking
router.post('/', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, role, employeeId, profile } = req.body;
    
    // Validate employee exists if provided
    if (employeeId) {
      const employee = await Manpower.findByPk(employeeId);
      if (!employee) {
        return res.status(400).json({
          success: false,
          error: 'Employee not found'
        });
      }
      
      // Check if employee already has a user account
      if (employee.userId) {
        return res.status(400).json({
          success: false,
          error: 'Employee already has a user account'
        });
      }
    }
    
    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      role,
      employeeId,  // ← Link to employee
      profile,
      isActive: true
    });
    
    // Update employee with userId
    if (employeeId) {
      await Manpower.update(
        { userId: user.id },
        { where: { id: employeeId } }
      );
    }
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user.toSafeObject()
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
});

// GET /api/users/:id - Get user with employee data
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{
        model: Manpower,
        as: 'employee',
        required: false  // Left join
      }]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user.toSafeObject()
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user'
    });
  }
});
```

**Manpower API:** `backend/routes/manpower.js`

```javascript
// POST /api/manpower - Create employee with optional user account
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { 
      employeeId, name, position, department, email, 
      createUserAccount,  // ← Flag to create user account
      username, password, role 
    } = req.body;
    
    // Create employee
    const employee = await Manpower.create({
      id: uuidv4(),
      employeeId,
      name,
      position,
      department,
      email,
      // ... other fields
    });
    
    // Optionally create user account
    if (createUserAccount) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        id: uuidv4(),
        username: username || email.split('@')[0],
        email,
        password: hashedPassword,
        role: role || 'supervisor',
        employeeId: employee.id,  // ← Link to employee
        profile: {
          fullName: name,
          phone: req.body.phone
        },
        isActive: true
      });
      
      // Update employee with userId
      await employee.update({ userId: user.id });
    }
    
    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee.toJSON()
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create employee'
    });
  }
});

// GET /api/manpower/:id - Get employee with user account
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const employee = await Manpower.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'userAccount',
        attributes: { exclude: ['password'] },  // Don't expose password
        required: false  // Left join
      }]
    });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    res.json({
      success: true,
      data: employee.toJSON()
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get employee'
    });
  }
});
```

---

### Phase 4: Update Frontend UI

**User Management Form:** Add employee selection

```jsx
// frontend/src/pages/Settings/UserManagement.js

const [formData, setFormData] = useState({
  username: '',
  email: '',
  password: '',
  role: 'supervisor',
  employeeId: '',  // ← Add this
  profile: {}
});

const [employees, setEmployees] = useState([]);
const [showEmployeeLink, setShowEmployeeLink] = useState(false);

// Fetch employees for selection
useEffect(() => {
  fetchEmployees();
}, []);

const fetchEmployees = async () => {
  try {
    const response = await axios.get('/api/manpower', {
      headers: { Authorization: `Bearer ${token}` },
      params: { status: 'active' }
    });
    setEmployees(response.data.data || []);
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
};

// In the form JSX
<form onSubmit={handleSubmit}>
  {/* Existing fields: username, email, password, role */}
  
  {/* NEW: Link to Employee */}
  <div className="form-group">
    <label>
      <input
        type="checkbox"
        checked={showEmployeeLink}
        onChange={(e) => {
          setShowEmployeeLink(e.target.checked);
          if (!e.target.checked) {
            setFormData(prev => ({ ...prev, employeeId: '' }));
          }
        }}
      />
      Link to existing employee record
    </label>
  </div>
  
  {showEmployeeLink && (
    <div className="form-group">
      <label htmlFor="employeeId">Select Employee</label>
      <select
        id="employeeId"
        value={formData.employeeId}
        onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
        className="form-control"
      >
        <option value="">-- Select Employee --</option>
        {employees.map(emp => (
          <option key={emp.id} value={emp.id}>
            {emp.employeeId} - {emp.name} ({emp.position})
          </option>
        ))}
      </select>
      <small className="text-muted">
        Select an employee to link this user account to their HR record
      </small>
    </div>
  )}
  
  <button type="submit">Create User</button>
</form>
```

**SDM/Manpower Form:** Add user account creation option

```jsx
// frontend/src/pages/Manpower.js

const [formData, setFormData] = useState({
  employeeId: '',
  name: '',
  position: '',
  department: '',
  email: '',
  // ... other fields
  
  createUserAccount: false,  // ← Add this
  username: '',
  password: '',
  role: 'supervisor'
});

// In the form JSX
<form onSubmit={handleSubmit}>
  {/* Existing employee fields */}
  
  {/* NEW: Create User Account Option */}
  <div className="form-section">
    <h3>System Access</h3>
    
    <div className="form-group">
      <label>
        <input
          type="checkbox"
          checked={formData.createUserAccount}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            createUserAccount: e.target.checked 
          }))}
        />
        Create user account for system access
      </label>
    </div>
    
    {formData.createUserAccount && (
      <>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            placeholder="Leave empty to use email prefix"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required={formData.createUserAccount}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">System Role</label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
          >
            <option value="supervisor">Supervisor</option>
            <option value="project_manager">Project Manager</option>
            <option value="hr_manager">HR Manager</option>
            <option value="finance_manager">Finance Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </>
    )}
  </div>
  
  <button type="submit">Create Employee</button>
</form>
```

**Display Linked Data:**

```jsx
// Show link status in table
<table>
  <thead>
    <tr>
      <th>Employee ID</th>
      <th>Name</th>
      <th>Position</th>
      <th>System Access</th>  {/* ← New column */}
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {employees.map(emp => (
      <tr key={emp.id}>
        <td>{emp.employeeId}</td>
        <td>{emp.name}</td>
        <td>{emp.position}</td>
        <td>
          {emp.userId ? (
            <span className="badge badge-success">
              ✓ Has Account
            </span>
          ) : (
            <span className="badge badge-secondary">
              No Account
            </span>
          )}
        </td>
        <td>
          {/* Action buttons */}
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## 📝 Workflow Examples

### Scenario 1: Create Employee, Then Create User Account

**Step 1:** HR creates employee record
```
Go to: SDM > Add Employee
Fill: Name, Position, Email, etc.
✓ DO NOT check "Create user account"
Result: Employee record created (no system access)
```

**Step 2:** IT creates user account and links to employee
```
Go to: Settings > User Management > Add User
Fill: Username, Password, Role
✓ CHECK "Link to existing employee"
Select: Danny (EMP-2024-001)
Result: User account created and linked to employee
```

**Result:**
- ✅ Employee "Danny" exists in SDM page
- ✅ User "danny" can login to system
- ✅ Linked: user.employeeId = emp.id, emp.userId = user.id

---

### Scenario 2: Create Employee with User Account (One-Step)

```
Go to: SDM > Add Employee
Fill: Name, Position, Email, etc.
✓ CHECK "Create user account for system access"
Fill: Username, Password, Role
Result: Both employee record AND user account created + linked automatically
```

**Result:**
- ✅ Employee exists in SDM
- ✅ User can login immediately
- ✅ Auto-linked

---

### Scenario 3: External Consultant (User without Employee)

```
Go to: Settings > User Management > Add User
Fill: Username, Password, Role = "supervisor"
✗ DO NOT link to employee (leave empty)
Result: User account for external person (no HR record needed)
```

**Result:**
- ✅ User can login
- ❌ No employee record (intentional - not an employee)

---

### Scenario 4: Field Worker (Employee without User)

```
Go to: SDM > Add Employee
Fill: Name, Position = "Construction Worker"
✗ DO NOT check "Create user account"
Result: Employee record only (no system access needed)
```

**Result:**
- ✅ Employee in HR database
- ❌ No system access (intentional - doesn't need to login)

---

## 🎯 Decision Matrix: When to Link?

| Role | Needs System Access? | Create User Account? | Link to Employee? |
|------|---------------------|---------------------|-------------------|
| **Project Manager** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Supervisor** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Finance Staff** | ✅ Yes | ✅ Yes | ✅ Yes |
| **HR Manager** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Office Admin** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Construction Worker** | ❌ No | ❌ No | ❌ N/A |
| **Laborer** | ❌ No | ❌ No | ❌ N/A |
| **Driver** | ❌ No | ❌ No | ❌ N/A |
| **External Consultant** | ✅ Yes | ✅ Yes | ❌ No (not employee) |
| **Client User** | ✅ Yes | ✅ Yes | ❌ No (not employee) |
| **Vendor** | ✅ Yes | ✅ Yes | ❌ No (not employee) |

---

## 📊 Summary: Best Practice

### ✅ DO:

1. **Keep Tables Separate**
   - `users` for authentication/authorization
   - `manpower` for HR management
   
2. **Add Optional Linking**
   - `users.employeeId` (nullable)
   - `manpower.userId` (nullable)
   
3. **Provide UI Options**
   - Checkbox: "Link to existing employee"
   - Checkbox: "Create user account"
   
4. **Clear Communication**
   - Show link status in tables
   - Badge: "Has Account" / "No Account"
   
5. **Flexibility**
   - Allow users without employees (consultants)
   - Allow employees without users (workers)

### ❌ DON'T:

1. **DON'T auto-sync** (creates confusion)
2. **DON'T force linking** (not everyone needs both)
3. **DON'T merge tables** (violates separation)
4. **DON'T create duplicate data** (link instead)

---

## 🚀 Migration Steps (Your Current Situation)

### Immediate Solution (Quick Fix)

**For Danny who's already created:**

```sql
-- Step 1: Find Danny's user ID
SELECT id, username, email FROM users WHERE username = 'danny';
-- Result: user_id = 'abc123'

-- Step 2: Create Danny's employee record in SDM
-- Go to SDM page, create employee manually with same email

-- Step 3: Link them (if you added the columns)
UPDATE users SET employee_id = 'emp_danny_id' WHERE id = 'user_danny_id';
UPDATE manpower SET user_id = 'user_danny_id' WHERE id = 'emp_danny_id';
```

### Long-term Solution (Implement Best Practice)

```
Week 1: Add database columns (employee_id, user_id)
Week 2: Update models with associations
Week 3: Update API endpoints
Week 4: Update frontend UI
Week 5: Test and deploy
Week 6: Migrate existing data (link existing users/employees)
```

---

## 🎓 Key Takeaway

**Current Behavior (Without Linking):**
```
Create User "Danny" → Only in users table
                     → NOT in manpower table
                     → Correct behavior (by design)
```

**Expected Behavior (With Linking):**
```
Option A: Create Employee → Optionally create user account → Auto-linked
Option B: Create User → Optionally link to existing employee → Linked
```

**The tables are INTENTIONALLY separate!**
- Not a bug, it's a feature
- Proper separation of concerns
- Add optional linking for integration

---

## 📞 Recommendation

**For your situation:**

1. **Short-term:** Manually create Danny in both places
   - Create user "danny" in User Management ✓ (already done)
   - Create employee "Danny" in SDM (do this now)
   
2. **Medium-term:** Implement linking columns
   - Add migration for `employee_id` and `user_id`
   - Update models
   - Update APIs
   
3. **Long-term:** Update UI
   - Add "Link to employee" option in User Management
   - Add "Create user account" option in SDM
   - Show link status in tables

**This is the industry-standard approach for enterprise systems!** 🎯

---

**Status:** Documentation Complete  
**Date:** October 21, 2024  
**Recommendation:** Implement Option 1 (Loose Coupling with Optional Linking)
