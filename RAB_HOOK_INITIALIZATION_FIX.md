# RAB Hook Initialization Error Fix

## Problem
```
ReferenceError: Cannot access 'fetchRABData' before initialization
```

This error occurred because I was trying to use `fetchRABData` in a `useEffect` before it was defined due to JavaScript hoisting issues with `useCallback`.

## Root Cause
The order of execution was:
1. `useEffect(() => { fetchRABData(); }, [fetchRABData])` - trying to access fetchRABData
2. `const fetchRABData = useCallback(...)` - defining fetchRABData later

This created a temporal dead zone where the function was referenced before initialization.

## Solution Applied

### Before (Problematic):
```javascript
useEffect(() => {
  fetchRABData(); // ❌ Reference before initialization
}, [fetchRABData]);

const fetchRABData = useCallback(async () => {
  // implementation
}, [projectId]);
```

### After (Fixed):
```javascript
const fetchRABData = async () => {
  // implementation - regular function, no useCallback
};

// Create memoized refetch function for external use
const refetch = useCallback(() => {
  fetchRABData();
}, [projectId]);

useEffect(() => {
  fetchRABData(); // ✅ Works because fetchRABData is defined above
}, [projectId]);

return {
  // ...
  refetch // ✅ Stable reference for external components
};
```

## Key Changes
1. **Removed useCallback from fetchRABData**: Made it a regular async function
2. **Created separate memoized refetch function**: Provides stable reference for external components
3. **Fixed useEffect dependencies**: Now depends on projectId directly
4. **Maintained functionality**: All existing behavior preserved

## Expected Result
- ✅ No more initialization errors
- ✅ Component loads properly 
- ✅ RAB data fetching works
- ✅ Refetch functionality intact
- ✅ No infinite re-render loops

The fix maintains the performance benefits of memoization while avoiding the initialization order issues.