import React, { useState,useEffect } from 'react';
import { View,Text ,StyleSheet,Image, ScrollView,ActivityIndicator,Linking} from 'react-native';
import CustomButton from '../Components/CustomButton';
import { useRoute } from '@react-navigation/native';
import { BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5687012734553237/6418070663';

function JobScreen(props) {

    const route = useRoute();
    const job = route.params?.job;

      const onPress=()=>{
        if (job && job.link) {
            Linking.openURL(job.link);
          }
      }

      if (!job) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        );
      }

    return (
<View style={{flex:1}}>
<BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
<Text style={styles.title}>{job.title}</Text>
<Image style={styles.image} source={{uri:job.image}} />
{job.company!=='NA'?(<Text style={styles.data}>Company         : <Text style={styles.info}>  {job.company}</Text></Text>):null}
{job.description!=='NA'?(<Text style={styles.data}>Description      : <Text style={styles.info}>  {job.description}</Text></Text>):(null)}
{job.role!=='NA'?(<Text style={styles.data}>Role                  : <Text style={styles.info}>  {job.role}</Text></Text>):null}
{job.qualification!=='NA'?(<Text style={styles.data}>Qualification   : <Text style={styles.info}>  {job.qualification}</Text></Text>):null}
{job.skills!=='NA'?(<Text style={styles.data}>Skills                : <Text style={styles.info}>  {job.skills}</Text></Text>):null}
{job.batch!=='NA'?(<Text style={styles.data}>Batch                : <Text style={styles.info}>  {job.batch}</Text></Text>):null}
{job.jobType!=='NA'?(<Text style={styles.data}>Job Type          : <Text style={styles.info}>  {job.jobType}</Text></Text>):null}
{job.salary!='NA'?(<Text style={styles.data}>Salary               : <Text style={styles.info}>  {job.salary}</Text></Text>):null}
{job.location!=='NA'?(<Text style={styles.data}>Location           : <Text style={styles.info}>  {job.location}</Text></Text>):null}
<View style={{paddingVertical:18}}>
<CustomButton text="Apply Link" onPress={onPress}/>
</View>
       </ScrollView>
       <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
       </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f4f4',
        padding:9,
        overflow:"hidden",
      },
      image:{
        width:"100%",
        aspectRatio:6/3,
        marginBottom:4,
        backgroundColor:"white",
        borderRadius:18
       },
       title:{
        fontSize:18,
        fontWeight:"bold",
        marginVertical:6,
       },
       data:{
        fontSize:16,
        fontWeight:"bold",
    padding:6
       },
       info:{
        fontSize:16,
        fontWeight:"normal",
       }
})

export default JobScreen;