import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { 
  View, 
  Text, 
  StyleSheet, 
  Platform,
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import EmployeesScreen from './src/screens/EmployeesScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AIAssistantScreen from './src/screens/AIAssistantScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import EmployeeDetailScreen from './src/screens/EmployeeDetailScreen';
import AIAnalyticsScreen from './src/screens/AIAnalyticsScreen';
import OfflineDataScreen from './src/screens/OfflineDataScreen';

// Context
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { OfflineProvider } from './src/context/OfflineContext';
import { NotificationProvider } from './src/context/NotificationContext';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Auth Stack Navigator
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

// Main App Stack Navigator
function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="EmployeeDetail" 
        component={EmployeeDetailScreen}
        options={{
          title: 'Employee Details',
          headerStyle: { backgroundColor: '#3B82F6' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen 
        name="AIAnalytics" 
        component={AIAnalyticsScreen}
        options={{
          title: 'AI Analytics',
          headerStyle: { backgroundColor: '#8B5CF6' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          headerStyle: { backgroundColor: '#3B82F6' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen 
        name="OfflineData" 
        component={OfflineDataScreen}
        options={{
          title: 'Offline Data',
          headerStyle: { backgroundColor: '#059669' },
          headerTintColor: '#fff'
        }}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Employees') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Attendance') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'AI Assistant') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          height: Platform.OS === 'ios' ? 80 : 60,
        },
        headerStyle: {
          backgroundColor: '#3B82F6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Employees" component={EmployeesScreen} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen 
        name="AI Assistant" 
        component={AIAssistantScreen}
        options={{
          tabBarBadge: 3, // Show notification badge
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Connection Status Component
function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  if (isConnected) return null;

  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>
        📱 Offline Mode - Data will sync when connection is restored
      </Text>
    </View>
  );
}

// Main App Component
function AppContent() {
  const { user, loading } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        // Store token for backend notifications
        AsyncStorage.setItem('pushToken', token);
      }
    });

    // Listen for notifications
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading YK Group HR...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <ConnectionStatus />
      {user ? <AppStack /> : <AuthStack />}
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

// Push notification registration
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    Alert.alert('Permission required', 'Push notifications permission is required for HR updates!');
    return;
  }
  
  token = (await Notifications.getExpoPushTokenAsync()).data;
  
  return token;
}

// Main App with Providers
export default function App() {
  return (
    <AuthProvider>
      <OfflineProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </OfflineProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  offlineContainer: {
    backgroundColor: '#FED7D7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FC8181',
  },
  offlineText: {
    color: '#C53030',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
  },
});
