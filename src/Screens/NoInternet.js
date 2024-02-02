import React from 'react';
import { View,StyleSheet,Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

function NoInternet({onRefress}) {
    return (
        <View style={styles.container}>
        <Feather name="wifi-off" size={36} color="#383838" />
        <Text style={styles.text}>No Internet Connection</Text>
        <TouchableOpacity style={styles.tryAgain} onPress={onRefress}>
        <Feather name="refresh-ccw" size={18} color="black" style={{paddingVertical:9}}/>
<Text style={{marginLeft:5,fontSize:18,paddingVertical:5}}>Try again</Text>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
  flex:1,
  justifyContent:"center",
  alignItems:"center"
    },
    text:{
        fontSize:18,
        color:"#383838",
        paddingVertical:5
    },
    tryAgain:{
        flexDirection:"row",
        justifyContent:"space-between"
    }
})

export default NoInternet;