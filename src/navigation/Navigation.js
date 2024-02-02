import React ,{useEffect} from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from '../Screens/HomeScreen';
import JobScreen from '../Screens/JobScreen';
import * as Notifications from "expo-notifications";

const Stack = createNativeStackNavigator();

const Navigation = ()=>{

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      },[]);
      
    return(
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name='Home' component={HomeScreen}/>
        <Stack.Screen name="JobScreen" component={JobScreen}/>
    </Stack.Navigator>
    );
};

export default Navigation;