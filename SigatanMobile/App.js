
import AllTanahMapView from './src/screens/AllTanahMapView';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



import LoginScreen from './src/screens/LoginScreen';
import PejabatScreen from './src/screens/PejabatScreen';
import ScanQRCode from './src/screens/ScanQRCode';
import ProfilUser from './src/screens/ProfilUser';
import HomeScreen from './src/screens/HomeScreen';
import DataTanahScreen from './src/screens/DataTanahScreen';

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const username = await AsyncStorage.getItem('username');
      setInitialRoute(username ? 'Home' : 'Login');
    };
    checkLogin();
  }, []);

  if (!initialRoute) return null; // atau tampilkan splash/loading

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DataTanahScreen" component={DataTanahScreen} />
        <Stack.Screen name="DetailTanah" component={require('./src/screens/MapViewComponent').default} />
        <Stack.Screen name="MapViewScreen" component={require('./src/screens/MapViewComponent').default} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Pejabat" component={PejabatScreen} />
        <Stack.Screen name="ScanQRCode" component={ScanQRCode} />
        <Stack.Screen name="ProfilUser" component={ProfilUser} />
        
        <Stack.Screen name="Maps" component={AllTanahMapView} />
        

      </Stack.Navigator>
    </NavigationContainer>
  );
}
