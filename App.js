import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/navigation/Navigation";
import { StatusBar } from 'expo-status-bar';
import NoInternet from "./src/Screens/NoInternet";
import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect, useState } from "react";


export default function App() {
  const [noInternet,setNoInternet]=useState(false)
const netInfo=useNetInfo()

const fetchNetInfo=()=>{
  const {isConnected,isInternetReachable}=netInfo
  if(isConnected===false&&isInternetReachable===false){
  setNoInternet(true)}
  else{
    setNoInternet(false)
  }
}

useEffect(()=>{
fetchNetInfo()
},[netInfo])

if(noInternet) return <NoInternet onRefress={fetchNetInfo}/>
  return (
    <NavigationContainer>
      <Navigation/>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

