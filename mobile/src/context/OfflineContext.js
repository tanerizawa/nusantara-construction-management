import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const OfflineContext = createContext();

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

export const OfflineProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [offlineData, setOfflineData] = useState({
    employees: [],
    attendance: [],
    notifications: [],
    analytics: {},
    lastSync: null
  });
  const [syncQueue, setSyncQueue] = useState([]);

  useEffect(() => {
    // Monitor connection status
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOffline = !isConnected;
      const isNowOnline = state.isConnected;
      
      setIsConnected(isNowOnline);
      
      // If just came back online, sync data
      if (wasOffline && isNowOnline) {
        syncOfflineData();
      }
    });

    // Load offline data on app start
    loadOfflineData();

    return () => unsubscribe();
  }, []);

  const loadOfflineData = async () => {
    try {
      const data = await AsyncStorage.getItem('offlineData');
      const queue = await AsyncStorage.getItem('syncQueue');
      
      if (data) {
        setOfflineData(JSON.parse(data));
      }
      if (queue) {
        setSyncQueue(JSON.parse(queue));
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  };

  const saveOfflineData = async (data) => {
    try {
      const updatedData = { ...offlineData, ...data };
      setOfflineData(updatedData);
      await AsyncStorage.setItem('offlineData', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const addToSyncQueue = async (action) => {
    try {
      const newQueue = [...syncQueue, { ...action, timestamp: Date.now() }];
      setSyncQueue(newQueue);
      await AsyncStorage.setItem('syncQueue', JSON.stringify(newQueue));
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  };

  const syncOfflineData = async () => {
    if (!isConnected || syncQueue.length === 0) return;

    try {
      // Mock API sync - replace with actual API calls
      console.log('Syncing offline data...', syncQueue);
      
      for (const action of syncQueue) {
        // Process each queued action
        switch (action.type) {
          case 'UPDATE_ATTENDANCE':
            // await api.updateAttendance(action.data);
            break;
          case 'UPDATE_PROFILE':
            // await api.updateProfile(action.data);
            break;
          case 'SUBMIT_LEAVE_REQUEST':
            // await api.submitLeaveRequest(action.data);
            break;
          default:
            console.log('Unknown action type:', action.type);
        }
      }

      // Clear sync queue after successful sync
      setSyncQueue([]);
      await AsyncStorage.removeItem('syncQueue');
      
      // Update last sync time
      const updatedData = { 
        ...offlineData, 
        lastSync: new Date().toISOString() 
      };
      setOfflineData(updatedData);
      await AsyncStorage.setItem('offlineData', JSON.stringify(updatedData));
      
      console.log('Offline data synced successfully');
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  };

  const getEmployees = () => {
    if (isConnected) {
      // Return live data if connected
      return null; // Let components fetch from API
    }
    return offlineData.employees;
  };

  const updateAttendance = async (attendanceData) => {
    if (isConnected) {
      // Make API call if connected
      // return await api.updateAttendance(attendanceData);
      return { success: true };
    } else {
      // Queue for offline sync
      await addToSyncQueue({
        type: 'UPDATE_ATTENDANCE',
        data: attendanceData
      });
      
      // Update local data
      const updatedAttendance = [...offlineData.attendance, attendanceData];
      await saveOfflineData({ attendance: updatedAttendance });
      
      return { success: true, offline: true };
    }
  };

  const submitLeaveRequest = async (leaveData) => {
    if (isConnected) {
      // Make API call if connected
      // return await api.submitLeaveRequest(leaveData);
      return { success: true };
    } else {
      // Queue for offline sync
      await addToSyncQueue({
        type: 'SUBMIT_LEAVE_REQUEST',
        data: leaveData
      });
      
      return { success: true, offline: true };
    }
  };

  const cacheEmployeeData = async (employees) => {
    await saveOfflineData({ employees });
  };

  const cacheAnalyticsData = async (analytics) => {
    await saveOfflineData({ analytics });
  };

  const value = {
    isConnected,
    offlineData,
    syncQueue,
    getEmployees,
    updateAttendance,
    submitLeaveRequest,
    cacheEmployeeData,
    cacheAnalyticsData,
    syncOfflineData,
    addToSyncQueue
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};
