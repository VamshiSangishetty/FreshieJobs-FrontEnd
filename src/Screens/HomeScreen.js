import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Platform, Alert,AppState } from 'react-native';
import { getPosts } from '../api/post';
import { createToken,getToken } from '../api/expoToken';
import JobComponent from '../Components/JobComponent';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';
import { io } from 'socket.io-client';
import dateFormat from 'dateformat';
import { BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5687012734553237/6418070663';

const socket = io('http://freshiejobs-env.eba-c9eevhy7.ap-south-1.elasticbeanstalk.com/');


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function formatDate(dateString) {
  const formattedDate = dateFormat(new Date(dateString), 'mmm dd, yyyy');
  return formattedDate;
}

let pageNo=0
const limit=9

function HomeScreen(props) {
  const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();
  const [end,setEnd]=useState(false)
  const [busy,setBusy]=useState(false);
    const [loading, setLoading] = useState(true);

    const permission=async()=>{
        if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Please on notification from your setting for new job updates');
      return;
    }
  } else {
    // alert('Must use a physical device for Push Notifications');
  }
    }
    useEffect(()=>{
permission();
    },[])

const requestUserPermission =async()=>{
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Authorization status:', authStatus);
  }
}

useEffect(()=>{
if(requestUserPermission()){
  messaging().getToken().then(token=>setExpoPushToken(token));
}else{
requestUserPermission();
}
 // Check whether an initial notification is available
 messaging()
 .getInitialNotification()
 .then(async remoteMessage => {
   if (remoteMessage) {
    //  console.log(
    //    'Notification caused app to open from quit state:',
    //    remoteMessage.notification,
    //  );
   }
 });
 // Assume a message-notification contains a "type" property in the data payload of the screen to open

 messaging().onNotificationOpenedApp(async remoteMessage => {
  // console.log(
  //   'Notification caused app to open from background state:',
  //   remoteMessage.notification,
  // );
});
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // console.log('Message handled in the background!', remoteMessage);
});

const unsubscribe = messaging().onMessage(async remoteMessage => {
  // console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));

  // Check if the app is in the foreground
  if (AppState.currentState === 'active') {
    // Display a local notification
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'FreshieJobs',
        body:remoteMessage.notification.body ,// Change this to the relevant title in your notification payload
        smallIcon:remoteMessage.notification.android.smallIcon,
      },
      trigger: null,
    });
  }
});
return unsubscribe;

},[])

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => {
  //     setExpoPushToken(token);
  //   });

  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });

  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     // console.log(response);
  //   });

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  const checkAndCreateToken = async () => {
    try {
      // Call your getToken function to check if the push token exists in the database
      const response = await getToken(expoPushToken);
      if (response.error==='Token not found!') {
          // If the push token doesn't exist, create a new one
          const expoToken=await createToken({token:expoPushToken});
          // Alert.alert(expoToken)
          // Alert.alert('Push token added to the database');
          return;
        } else  {
          // Alert.alert('Push token already exists in the database');
      }
    } catch (error) {
      // Alert.alert('Error in token:',error);
      // Handle error
    }
  };
  useEffect(() => {
    if(!expoPushToken) return;

    checkAndCreateToken();
  }, [expoPushToken]);
  
  

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      // console.log('Connected to Socket.IO server');
    });
  
    // Listen for 'newPost' events
    socket.on('newPost', (data) => {  
      // Update jobs state with the new post
      setJobs((prevJobs) => [data.post, ...prevJobs]);
  
      // Schedule a notification for the new post
      // schedulePushNotification(data.post.title);
    });

    socket.on('updatePost', (data) => {
  
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === data.post._id ? data.post : job))
      );
    });

    socket.on('deletePost', (data) => {
  
      // Remove the deleted post from the jobs state
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== data._id));
    });
  
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  

  const fetchPosts = async()=>{
    const {error,posts}=await getPosts(pageNo,limit);
    if(error) return console.log('error in fetchPOst',error);
    
    setJobs(posts);
}

  const fetchMorePosts = async()=>{
    if(end || busy) return;
    pageNo+=1;
    setBusy(true)
    const {error,posts,postCount}=await getPosts(pageNo,limit);
    setBusy(false)
    if(error) return console.log('error in fmp',error);

    if(postCount===jobs.length) return setEnd(true)
    
    setJobs([...jobs,...posts]);
}

useEffect(() => {
  const fetchData = async () => {
    try {
      await fetchPosts();
      setLoading(false);
    } catch (error) {
      // Alert.alert('error in useEffect',error);
      setLoading(false);
    }
  };

  fetchData();

  return () => {
    pageNo = 0;
    setEnd(false);
  };
}, []);


  const groupedJobs = jobs.reduce((acc, job) => {
    const dateKey = formatDate(job.createdAt);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(job);
    return acc;
  }, {});

  const jobList = Object.entries(groupedJobs).map(([date, jobs]) => ({
    date,
    jobs,
  }));

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1}}>
      <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
      <View style={styles.container}>
        <FlatList
          data={jobList}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <>
              <Text style={styles.dateHeader}>{item.date}</Text>
              {item.jobs.map((job) => (
                <JobComponent key={job._id} job={job} />
              ))}
            </>
          )}
          showsVerticalScrollIndicator={false}
          onEndReached={fetchMorePosts}
          onEndReachedThreshold={0}
          ListFooterComponent={()=>{
            return end?<Text style={{fontWeight:"bold",color:"#383838",textAlign:'center',paddingVertical:15}}>You reached to end</Text>:<ActivityIndicator />
          }}
        />
      </View>
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
    padding: 9,
    // marginTop: 45,
  },
  jobContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  jobButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 69,
  },
  selected: {
    backgroundColor: 'lightblue',
  },
  jobButtonText: {
    fontWeight: 'bold',
  },
  dateHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  adView: {
    alignItems: 'flex-start',
    alignSelf: 'stretch'
  }
});

export default HomeScreen;




