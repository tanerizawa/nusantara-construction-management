# Frontend Integration Quick Start Guide
## User-Employee Linking System

**For:** Frontend Developers  
**Status:** Backend Ready ✅ | Frontend Implementation Pending ⏳

---

## 🎯 Overview

The backend now supports **optional bidirectional linking** between Users (authentication) and Employees (HR data). This guide shows you exactly what to implement in the frontend.

---

## 📍 Implementation Locations

### 1. User Management Page
**File:** `frontend/src/pages/Settings/UserManagement.js` (or similar)  
**Changes:** Add employee linking capability to user creation/edit forms

### 2. Manpower/SDM Page
**File:** `frontend/src/pages/Manpower.js` or `frontend/src/pages/SDM.js`  
**Changes:** Add user account creation capability to employee forms

---

## 🔧 User Management Implementation

### Step 1: Add State Variables

```javascript
// In your UserManagement component
const [linkToEmployee, setLinkToEmployee] = useState(false);
const [availableEmployees, setAvailableEmployees] = useState([]);
const [selectedEmployee, setSelectedEmployee] = useState(null);
```

### Step 2: Fetch Available Employees

```javascript
// Fetch on component mount or when modal opens
useEffect(() => {
  if (linkToEmployee) {
    fetchAvailableEmployees();
  }
}, [linkToEmployee]);

const fetchAvailableEmployees = async () => {
  try {
    const response = await api.get('/api/users/available-employees');
    setAvailableEmployees(response.data.data);
  } catch (error) {
    console.error('Error fetching available employees:', error);
    // Show error notification
  }
};
```

### Step 3: Add UI Components (Material-UI Example)

```jsx
{/* Add after existing user form fields */}

<Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
  <FormControlLabel
    control={
      <Checkbox
        checked={linkToEmployee}
        onChange={(e) => setLinkToEmployee(e.target.checked)}
      />
    }
    label="Link to existing employee"
  />
  
  {linkToEmployee && (
    <Autocomplete
      sx={{ mt: 2 }}
      options={availableEmployees}
      getOptionLabel={(option) => 
        `${option.name} - ${option.position} (${option.department})`
      }
      value={selectedEmployee}
      onChange={(e, value) => setSelectedEmployee(value)}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label="Select Employee" 
          placeholder="Search employee..."
          required={linkToEmployee}
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <Box>
            <Typography variant="body1">{option.name}</Typography>
            <Typography variant="caption" color="textSecondary">
              {option.position} • {option.department}
            </Typography>
          </Box>
        </li>
      )}
    />
  )}
</Box>
```

### Step 4: Update Create/Update API Calls

```javascript
// CREATE USER
const handleCreateUser = async (formData) => {
  try {
    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      // Add employee link if selected
      ...(linkToEmployee && selectedEmployee && { 
        employeeId: selectedEmployee.id 
      })
    };
    
    const response = await api.post('/api/users', payload);
    
    // Show success notification
    enqueueSnackbar('User created successfully', { variant: 'success' });
    
    // Refresh user list
    fetchUsers();
    
    // Close modal
    handleClose();
  } catch (error) {
    console.error('Error creating user:', error);
    enqueueSnackbar(error.response?.data?.error || 'Failed to create user', { 
      variant: 'error' 
    });
  }
};

// UPDATE USER
const handleUpdateUser = async (userId, formData) => {
  try {
    const payload = {
      ...formData,
      // Include employeeId (can be null to unlink)
      employeeId: selectedEmployee?.id || null
    };
    
    const response = await api.put(`/api/users/${userId}`, payload);
    
    enqueueSnackbar('User updated successfully', { variant: 'success' });
    fetchUsers();
    handleClose();
  } catch (error) {
    console.error('Error updating user:', error);
    enqueueSnackbar(error.response?.data?.error || 'Failed to update user', { 
      variant: 'error' 
    });
  }
};
```

### Step 5: Display Employee Link in User List

```jsx
// In your user list table
<TableCell>
  {user.employee ? (
    <Tooltip title={`Linked to: ${user.employee.name}`}>
      <Chip
        icon={<PersonIcon />}
        label={user.employee.name}
        color="primary"
        size="small"
        variant="outlined"
      />
    </Tooltip>
  ) : (
    <Chip 
      label="No Employee Link" 
      size="small" 
      variant="outlined"
    />
  )}
</TableCell>
```

### Step 6: Update GET Users API Call

```javascript
const fetchUsers = async () => {
  try {
    const response = await api.get('/api/users');
    // Response now includes employee data
    // user.employee = { id, name, position, department }
    setUsers(response.data.data);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
```

---

## 🔧 Manpower/SDM Implementation

### Step 1: Add State Variables

```javascript
// In your Manpower component
const [createUserAccount, setCreateUserAccount] = useState(false);
const [username, setUsername] = useState('');
const [userPassword, setUserPassword] = useState('');
const [userRole, setUserRole] = useState('supervisor');
```

### Step 2: Auto-Generate Username (Optional Helper)

```javascript
// Helper function to suggest username from employee name
const suggestUsername = (employeeName) => {
  return employeeName
    .toLowerCase()
    .replace(/\s+/g, '.')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove accents
};

// Call when name changes
useEffect(() => {
  if (createUserAccount && formData.name) {
    setUsername(suggestUsername(formData.name));
  }
}, [createUserAccount, formData.name]);
```

### Step 3: Add UI Components

```jsx
{/* Add after existing employee form fields */}

<Divider sx={{ my: 3 }} />

<Box sx={{ p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
  <FormControlLabel
    control={
      <Checkbox
        checked={createUserAccount}
        onChange={(e) => setCreateUserAccount(e.target.checked)}
        color="primary"
      />
    }
    label={
      <Box>
        <Typography variant="body1" fontWeight="medium">
          Create user account for system access
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Employee will be able to login to the system
        </Typography>
      </Box>
    }
  />
  
  <Collapse in={createUserAccount}>
    <Card sx={{ mt: 2, p: 2 }} elevation={0}>
      <Typography variant="subtitle2" gutterBottom color="primary">
        User Account Details
      </Typography>
      
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required={createUserAccount}
            fullWidth
            helperText="Used for login"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Password"
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required={createUserAccount}
            fullWidth
            helperText="Minimum 8 characters"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required={createUserAccount}>
            <InputLabel>User Role</InputLabel>
            <Select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              label="User Role"
            >
              <MenuItem value="supervisor">Supervisor</MenuItem>
              <MenuItem value="project_manager">Project Manager</MenuItem>
              <MenuItem value="finance_manager">Finance Manager</MenuItem>
              <MenuItem value="inventory_manager">Inventory Manager</MenuItem>
              <MenuItem value="hr_manager">HR Manager</MenuItem>
              <MenuItem value="admin">Administrator</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Alert severity="info" icon={<InfoIcon />}>
            User account will be created with the same email as the employee
          </Alert>
        </Grid>
      </Grid>
    </Card>
  </Collapse>
</Box>
```

### Step 4: Update Create API Call

```javascript
const handleCreateEmployee = async (formData) => {
  try {
    // Validate user account data if creating account
    if (createUserAccount) {
      if (!username || !userPassword) {
        enqueueSnackbar('Username and password are required', { 
          variant: 'error' 
        });
        return;
      }
      if (userPassword.length < 8) {
        enqueueSnackbar('Password must be at least 8 characters', { 
          variant: 'error' 
        });
        return;
      }
    }
    
    const payload = {
      // Employee data
      name: formData.name,
      position: formData.position,
      department: formData.department,
      email: formData.email,
      phone: formData.phone,
      employeeId: formData.employeeId,
      status: formData.status,
      employmentType: formData.employmentType,
      // ... other employee fields
      
      // User account data (if creating)
      ...(createUserAccount && {
        createUserAccount: true,
        username,
        userPassword,
        userRole
      })
    };
    
    const response = await api.post('/api/manpower', payload);
    
    // Check if user account was created
    if (response.data.data.userAccount) {
      enqueueSnackbar(
        `Employee created with user account: ${response.data.data.userAccount.username}`, 
        { variant: 'success' }
      );
    } else {
      enqueueSnackbar('Employee created successfully', { variant: 'success' });
    }
    
    fetchEmployees();
    handleClose();
  } catch (error) {
    console.error('Error creating employee:', error);
    enqueueSnackbar(error.response?.data?.error || 'Failed to create employee', { 
      variant: 'error' 
    });
  }
};
```

### Step 5: Display User Status in Employee List

```jsx
// In your employee list table
<TableCell align="center">
  {employee.userId ? (
    <Tooltip 
      title={
        <Box>
          <Typography variant="caption">User: {employee.username}</Typography>
          <Typography variant="caption" display="block">
            Role: {employee.userRole}
          </Typography>
          <Typography variant="caption" display="block">
            Email: {employee.userEmail}
          </Typography>
        </Box>
      }
    >
      <Chip
        icon={<VpnKeyIcon />}
        label="Has Access"
        color="success"
        size="small"
      />
    </Tooltip>
  ) : (
    <Chip 
      icon={<BlockIcon />}
      label="No Access" 
      size="small"
      variant="outlined"
    />
  )}
</TableCell>

{/* Or use icon badge */}
<TableCell>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography>{employee.name}</Typography>
    {employee.userId && (
      <Tooltip title={`User: ${employee.username}`}>
        <IconButton size="small" color="primary">
          <VpnKeyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    )}
  </Box>
</TableCell>
```

### Step 6: Update GET Employees API Call

```javascript
const fetchEmployees = async () => {
  try {
    const response = await api.get('/api/manpower');
    // Response now includes user data
    // employee.userId, employee.username, employee.userEmail, employee.userRole
    setEmployees(response.data.data);
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
};
```

---

## 🎨 UI/UX Best Practices

### 1. Visual Indicators

**For Linked Items:**
```jsx
// Badge on avatar
<Badge
  badgeContent={<VpnKeyIcon fontSize="small" />}
  color="primary"
  overlap="circular"
>
  <Avatar>{employee.name[0]}</Avatar>
</Badge>

// Status chip in card
<Card>
  <CardHeader
    title={employee.name}
    subheader={employee.position}
    action={
      employee.userId && (
        <Chip label="System User" size="small" color="primary" />
      )
    }
  />
</Card>
```

### 2. Color Coding

```javascript
const getUserStatusColor = (employee) => {
  if (employee.userId) {
    return 'success'; // Has user account
  }
  return 'default'; // No user account
};
```

### 3. Confirmation Dialogs

```jsx
// When unlinking
<Dialog open={confirmUnlink}>
  <DialogTitle>Unlink Employee?</DialogTitle>
  <DialogContent>
    <Alert severity="warning">
      This will remove the link between user "{username}" and employee "{employeeName}". 
      Both records will remain but operate independently.
    </Alert>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCancel}>Cancel</Button>
    <Button onClick={handleConfirmUnlink} color="warning">
      Unlink
    </Button>
  </DialogActions>
</Dialog>
```

### 4. Loading States

```jsx
{loadingEmployees ? (
  <Skeleton variant="rectangular" height={200} />
) : (
  <Autocomplete
    loading={loadingEmployees}
    options={availableEmployees}
    {...props}
  />
)}
```

---

## 🧪 Testing Checklist

### User Management Tests

- [ ] Create user without employee link → User created, `employeeId = null`
- [ ] Create user with employee link → User created, employee linked
- [ ] Available employees dropdown shows only unlinked employees
- [ ] Update user's employee link → Old unlinked, new linked
- [ ] Delete user with link → Employee's `userId` set to null
- [ ] User list displays employee name/badge for linked users

### Manpower Management Tests

- [ ] Create employee without user account → Employee created, `userId = null`
- [ ] Create employee with user account → Both created and linked
- [ ] Username auto-suggestion works correctly
- [ ] Password validation (min 8 chars) works
- [ ] Role dropdown has all options
- [ ] Duplicate username shows error
- [ ] Employee list displays user status badge
- [ ] Tooltip shows user details on hover

---

## 🚨 Error Handling

### Common Errors and Messages

```javascript
// Error handling patterns
try {
  await api.post('/api/users', payload);
} catch (error) {
  const errorMessage = error.response?.data?.error || 'An error occurred';
  
  if (error.response?.status === 400) {
    // Validation error
    enqueueSnackbar(errorMessage, { variant: 'error' });
  } else if (error.response?.status === 409) {
    // Conflict (e.g., username exists)
    enqueueSnackbar('Username or email already in use', { variant: 'error' });
  } else {
    // Server error
    enqueueSnackbar('Server error. Please try again.', { variant: 'error' });
  }
}
```

### User-Friendly Error Messages

```javascript
const ERROR_MESSAGES = {
  USERNAME_EXISTS: 'This username is already taken. Please choose another.',
  EMAIL_EXISTS: 'A user with this email already exists.',
  EMPLOYEE_NOT_FOUND: 'Selected employee not found. Please refresh and try again.',
  VALIDATION_FAILED: 'Please check all required fields and try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.'
};
```

---

## 📊 API Response Structures

### GET /api/users (with employee data)

```json
{
  "success": true,
  "data": [
    {
      "id": "U001",
      "username": "danny.admin",
      "email": "danny@nusantara.com",
      "role": "admin",
      "isActive": true,
      "employee": {
        "id": "EMP-001",
        "employeeId": "E001",
        "name": "Danny Kusuma",
        "position": "System Administrator",
        "department": "IT"
      }
    },
    {
      "id": "U002",
      "username": "john.user",
      "email": "john@nusantara.com",
      "role": "supervisor",
      "isActive": true,
      "employee": null
    }
  ]
}
```

### GET /api/users/available-employees

```json
{
  "success": true,
  "data": [
    {
      "id": "EMP-005",
      "employeeId": "E005",
      "name": "Alice Johnson",
      "position": "Senior Engineer",
      "department": "Engineering"
    }
  ]
}
```

### POST /api/manpower (with user creation)

**Request:**
```json
{
  "name": "Bob Smith",
  "position": "Project Manager",
  "department": "Operations",
  "email": "bob@nusantara.com",
  "phone": "+62812345678",
  "createUserAccount": true,
  "username": "bob.smith",
  "userPassword": "SecurePass123",
  "userRole": "project_manager"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "EMP-025",
    "name": "Bob Smith",
    "userId": "U015",
    "userAccount": {
      "id": "U015",
      "username": "bob.smith",
      "role": "project_manager"
    }
  },
  "message": "Employee and user account created successfully"
}
```

### GET /api/manpower (with user data)

```json
{
  "success": true,
  "data": [
    {
      "id": "EMP-001",
      "name": "Danny Kusuma",
      "position": "Administrator",
      "department": "IT",
      "userId": "U001",
      "username": "danny.admin",
      "userEmail": "danny@nusantara.com",
      "userRole": "admin"
    },
    {
      "id": "EMP-002",
      "name": "Jane Doe",
      "position": "Engineer",
      "department": "Engineering",
      "userId": null,
      "username": null,
      "userEmail": null,
      "userRole": null
    }
  ]
}
```

---

## 🎯 Implementation Priority

### Phase 1: Basic Display (1-2 hours)
1. Update GET calls to fetch linked data
2. Display employee badges in user list
3. Display user badges in employee list

### Phase 2: User Management (2-3 hours)
1. Add employee linking checkbox to user form
2. Implement available employees dropdown
3. Update create/edit user API calls
4. Test linking functionality

### Phase 3: Manpower Management (3-4 hours)
1. Add user account creation checkbox to employee form
2. Implement collapsible user details section
3. Add username auto-suggestion
4. Update create employee API call
5. Test user account creation

### Phase 4: Polish & Testing (2-3 hours)
1. Add confirmation dialogs
2. Improve error messages
3. Add loading states
4. Test all scenarios
5. Fix bugs

**Total Estimated Time:** 8-12 hours (1-2 days)

---

## 💡 Pro Tips

### 1. Reusable Components

Create a `EmployeeLinkSelector` component:
```jsx
// components/EmployeeLinkSelector.js
export const EmployeeLinkSelector = ({ 
  value, 
  onChange, 
  required = false 
}) => {
  const [employees, setEmployees] = useState([]);
  
  useEffect(() => {
    fetchAvailableEmployees();
  }, []);
  
  // Component implementation...
  
  return <Autocomplete {...props} />;
};
```

### 2. Custom Hooks

```javascript
// hooks/useUserEmployeeLink.js
export const useUserEmployeeLink = () => {
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchAvailableEmployees = async () => {
    // Implementation...
  };
  
  return {
    availableEmployees,
    loading,
    refetch: fetchAvailableEmployees
  };
};
```

### 3. Form Validation

```javascript
const validateUserAccount = (data) => {
  const errors = {};
  
  if (data.createUserAccount) {
    if (!data.username) {
      errors.username = 'Username is required';
    } else if (data.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!data.userPassword) {
      errors.userPassword = 'Password is required';
    } else if (data.userPassword.length < 8) {
      errors.userPassword = 'Password must be at least 8 characters';
    }
    
    if (!data.userRole) {
      errors.userRole = 'User role is required';
    }
  }
  
  return errors;
};
```

---

## 📞 Need Help?

### Backend Endpoints Reference
See full documentation: `USER_EMPLOYEE_LINKING_IMPLEMENTATION_COMPLETE.md`

### API Testing
Use the provided Postman collection or test directly with:
```bash
# Get available employees
curl http://localhost:5000/api/users/available-employees

# Create user with employee link
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123","role":"supervisor","employeeId":"EMP-005"}'
```

---

**Document Version:** 1.0  
**Last Updated:** October 21, 2024  
**Backend Status:** ✅ Ready for Integration  
**Questions?** Check the main implementation doc or contact the backend team
