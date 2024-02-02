import React,{useEffect} from 'react';
import { Text,View ,StyleSheet,TouchableOpacity,Image,ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TestIds,RewardedInterstitialAd,RewardedAdEventType} from 'react-native-google-mobile-ads';

const rewardadUnitId = __DEV__
  ? TestIds.REWARDED_INTERSTITIAL
  : 'ca-app-pub-5687012734553237/7911895985';

const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(rewardadUnitId);


const JobComponent=React.memo(({job})=> {

    const navigation = useNavigation();

    useEffect(() => {
      const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
        },
      );
      const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        reward => {
        },
      );
  
      // Start loading the rewarded interstitial ad straight away
      rewardedInterstitial.load();
  
      // Unsubscribe from events on unmount
      return () => {
        unsubscribeLoaded();
        unsubscribeEarned();
      };
    }, []);

const onPress=async()=>{
    if(rewardedInterstitial.loaded){
      rewardedInterstitial.show();
    }
    navigation.navigate("JobScreen",{job:job})   
}

    return (
        <TouchableOpacity  style={styles.productsContainer} onPress={onPress}>
    <Image style={styles.image} source={{uri:job.image}} />
    <View style={styles.detailsContainer}>
    <Text style={styles.title}>{job.title}</Text>
    </View>
    </TouchableOpacity>
    );
    });

const styles = StyleSheet.create({
    productsContainer:{
        backgroundColor:"white",
   width:"100%",
   marginVertical:6,
   borderRadius:27,
   overflow:"hidden",
    }, 
    detailsContainer:{
     padding:12,
    } ,  
    image:{
     width:"100%",
     aspectRatio:9/3,
     marginBottom:4,
    },
    title:{
     fontSize:16,
     fontWeight:"600",
     marginVertical:0,
    }
})

export default React.memo(JobComponent);