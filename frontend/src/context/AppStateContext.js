import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Action types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_EMPLOYEES: 'SET_EMPLOYEES',
  SET_PROJECTS: 'SET_PROJECTS',
  SET_FINANCES: 'SET_FINANCES',
  SET_TAXES: 'SET_TAXES',
  SET_INVENTORY: 'SET_INVENTORY',
  UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  loading: false,
  error: null,
  employees: [],
  projects: [],
  finances: {
    transactions: [],
    budgets: [],
    overview: {}
  },
  taxes: {
    reports: [],
    calculations: [],
    overview: {}
  },
  inventory: {
    items: [],
    categories: [],
    warehouses: []
  }
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ACTION_TYPES.SET_EMPLOYEES:
      return { ...state, employees: action.payload, loading: false };
    
    case ACTION_TYPES.SET_PROJECTS:
      return { ...state, projects: action.payload, loading: false };
    
    case ACTION_TYPES.SET_FINANCES:
      return { ...state, finances: action.payload, loading: false };
    
    case ACTION_TYPES.SET_TAXES:
      return { ...state, taxes: action.payload, loading: false };
    
    case ACTION_TYPES.SET_INVENTORY:
      return { ...state, inventory: action.payload, loading: false };
    
    case ACTION_TYPES.UPDATE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map(emp => 
          emp.id === action.payload.id ? { ...emp, ...action.payload } : emp
        )
      };
    
    case ACTION_TYPES.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map(proj => 
          proj.id === action.payload.id ? { ...proj, ...action.payload } : proj
        )
      };
    
    default:
      return state;
  }
};

// Create contexts
const AppStateContext = createContext();
const AppDispatchContext = createContext();

// Provider component
export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.error]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

// Custom hooks
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

export const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within AppStateProvider');
  }
  return context;
};

// Action creators
export const actionCreators = {
  setLoading: (loading) => ({ type: ACTION_TYPES.SET_LOADING, payload: loading }),
  setError: (error) => ({ type: ACTION_TYPES.SET_ERROR, payload: error }),
  clearError: () => ({ type: ACTION_TYPES.CLEAR_ERROR }),
  setEmployees: (employees) => ({ type: ACTION_TYPES.SET_EMPLOYEES, payload: employees }),
  setProjects: (projects) => ({ type: ACTION_TYPES.SET_PROJECTS, payload: projects }),
  setFinances: (finances) => ({ type: ACTION_TYPES.SET_FINANCES, payload: finances }),
  setTaxes: (taxes) => ({ type: ACTION_TYPES.SET_TAXES, payload: taxes }),
  setInventory: (inventory) => ({ type: ACTION_TYPES.SET_INVENTORY, payload: inventory }),
  updateEmployee: (employee) => ({ type: ACTION_TYPES.UPDATE_EMPLOYEE, payload: employee }),
  updateProject: (project) => ({ type: ACTION_TYPES.UPDATE_PROJECT, payload: project })
};

// Selector hooks for specific data
export const useEmployees = () => {
  const { employees, loading, error } = useAppState();
  return { employees, loading, error };
};

export const useProjects = () => {
  const { projects, loading, error } = useAppState();
  return { projects, loading, error };
};

export const useFinances = () => {
  const { finances, loading, error } = useAppState();
  return { finances, loading, error };
};

export const useTaxes = () => {
  const { taxes, loading, error } = useAppState();
  return { taxes, loading, error };
};

export const useInventory = () => {
  const { inventory, loading, error } = useAppState();
  return { inventory, loading, error };
};
