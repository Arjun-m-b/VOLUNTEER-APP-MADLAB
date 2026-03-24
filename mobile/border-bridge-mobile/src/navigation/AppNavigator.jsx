import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import IntakeScreen from '../screens/IntakeScreen';
import CaseFileScreen from '../screens/CaseFileScreen';
import SubmittedScreen from '../screens/SubmittedScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Intake') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.emerald600,
        tabBarInactiveTintColor: colors.gray400,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Intake" component={IntakeScreen} />
    </Tab.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerBackTitleVisible: false, headerTintColor: colors.emerald600 }}>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CaseFile" component={CaseFileScreen} options={{ title: 'Case File' }} />
      <Stack.Screen name="Submitted" component={SubmittedScreen} options={{ headerShown: false, gestureEnabled: false }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.emerald600} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AuthenticatedStack />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
