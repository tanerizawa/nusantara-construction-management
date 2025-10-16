import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DebugRoute = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'yellow',
      padding: '10px',
      border: '1px solid black',
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <div><strong>Current Path:</strong> {location.pathname}</div>
      <div><strong>User Logged In:</strong> {user ? 'YES' : 'NO'}</div>
      <div><strong>User Object:</strong> {JSON.stringify(user, null, 2)}</div>
    </div>
  );
};

export default DebugRoute;
