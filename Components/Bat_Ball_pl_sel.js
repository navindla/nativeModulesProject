// import { View, Text, ScrollView, Pressable,PermissionsAndroid, StatusBar, BackHandler, ToastAndroid, AppState, TouchableOpacity, RefreshControl} from 'react-native'
// import React, { useEffect, useRef, useState } from 'react'
// import ImageSlider from './common/ImageSlider'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { styles } from './crickLeagueStyles/CricketLeague.style'
// import MatchesList from './common/MatchesList'
// import WithProgress from '../LoadingOverlay/WithProgress'
// import Services from '../../../Services/Services'
// import Functions from '../Functions'
// import UserStore from '../../stores/UserStore'
// import AsyncStorage from '@react-native-community/async-storage'
// import { useNavigation } from '@react-navigation/native'
// import { secondary } from '../../../style'
// import { checkVersion } from "react-native-check-version";
// import AppVersionUpdate from '../customComponents/AppVersionUpdate'
// import ReactMoE,{
//   MoEGeoLocation,
//   MoEProperties,
// } from "react-native-moengage";
// import VersionCheck from "react-native-version-check";
// import BonusPopup from '../customComponents/BonusPopup'

// let userInfo, count=0, contest_prices, bonusStatus;

// const CricketLeague = ({navigation,showProgress,hideProgress}) => {
//   const [runningMatches, setRunningMatches] = useState([]);
//   const [upcomingMatches, setupcomingMatches] = useState([]);
//   const [net, setNet] = useState();
//   const [bannerData, setBannerData] = useState([]);
//   const [load, setLoad] = useState(false);
//   const [versionUpdate, setVersionUpdate] = useState(false);
//   const [manualVersion, setManualVersion] = useState(false);
//   const [bonusPopup, setBonusPopup] = useState(false);

//   useEffect(() => {

//     const unsubscribe = navigation?.addListener('focus', () => {
//       setRunningMatches([]);
//       setupcomingMatches([]);
//       getData();
//       checkPlayStoreVersion();
//     });

//     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
//       count = count + 1;
//       if(count%2 !== 0){
//         Functions.getInstance().Toast("warning", "Press again to exit");
//         return true;
//       }
//       else if(count%2 == 0){
//         BackHandler.exitApp();
//         return true;
//       }
//     })

//     return () => {
//       console.log("Leavng home")
//       unsubscribe();
//       backHandler.remove();
//       // AppState.removeEventListener('change', handleAppStateChange);
//     };
//   }, ([bonusPopup]));

//   const updateData = (data) => {
//     if (!data) {
//       console.warn('Data is undefined in updateData function.');
//       hideProgress();
//       return;
//     }
//     data.forEach(element => {
//       element.timer = Functions.getInstance().getTimer(element.startTime);
//       return element;
//     });
//     setRunningMatches(data);
//     hideProgress();
//   };

//   const getData= async() =>{
//     showProgress();
//     AsyncStorage.setItem('Opn', "null");
//     UserStore.setselectedMatch({});
//     UserStore.setselectedContest({});
//     UserStore.setopponentSocketData({});
//     UserStore.setselectedGameData({});
//     UserStore.setselectedTeamDetails({});
//     userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
//     contest_prices = JSON.parse(await AsyncStorage.getItem("Contest-Prices"));
//     bonusStatus = await AsyncStorage.getItem("Bonus-status");
//     AsyncStorage.removeItem("from");
//     AsyncStorage.removeItem("kyc-type");
//     AsyncStorage.removeItem("prev-contests");
//     AsyncStorage.setItem("toss", "null");
//     AsyncStorage.setItem("players", "null");
//     AsyncStorage.setItem("p6data", "null");
//     AsyncStorage.setItem("pl6-socket", 'null');
//     Functions.getInstance().checkExpiration(userInfo.userId, userInfo.refToken, navigation).then((result)=>{
//       if(result == "home"){
//         loadHomePage();
//       }
//       else{
//         Functions.getInstance().offlineRunningMatches().then(result => {
//           updateData(result);
//         });
//         Functions.getInstance().offlineUpComingMatches().then(result => setupcomingMatches(result));
//         hideProgress();
//       }
//     });
//   }

//  const loadHomePage = async() =>{
//   userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
//   Functions.getInstance().checkInternetConnectivity().then((state)=>{
//     UserStore.updateUserData(userInfo);
//     if(state == true){
//       Services.getInstance().getHomeBanners(userInfo.userId, userInfo.accesToken).then((result)=>{
//         if(result.status == 200){
//           const images = result.msg.map(element => element.name);
//           setBannerData(images);
//           setLoad(true);
//         }
//         else{
//           setLoad(true);
//         }
//       })

//       Services.getInstance().getRunningMatches(userInfo.userId, userInfo.accesToken).then((result)=>{
//         console.log('getRunningMatches API Respo',result)
//         if(result.status == 401){
//           Functions.getInstance().offlineRunningMatches().then(result => {
//             updateData(result);
//           });
//         }
//         else{
//             // setRunningMatches(result.list);
//             updateData(result.list);
//             checkVersionManually(result.version);
//             console.log("bonus status : ", bonusStatus);
//             console.log("Bonus POPUP, ", result.bonusPop);
//             console.log("bonus status : ", typeof(bonusStatus) );
//             console.log(" result.bonusPop : ", typeof( result.bonusPop) );
//             if((typeof(bonusStatus) == "object") && (result.bonusPop == true)){
//               console.log(" in condetion");
//               setBonusPopup(true);
//             }
//             AsyncStorage.setItem("Running-Matches", JSON.stringify(result.list));
//             // setInterval(function(){
//             //   updateData(result.list);
//             // }, 1000);
//         }
//       })
//       Services.getInstance().getUpComingMatches(userInfo.userId, userInfo.accesToken).then((result)=>{
//         setupcomingMatches(result.list);
//         AsyncStorage.setItem("Upcoming-Matches", JSON.stringify(result.list));
//       })

//       if(!contest_prices){
//         Services.getInstance().getAllContestPrices(userInfo.userId, userInfo.accesToken).then((result)=>{
//           console.log(result);
//           AsyncStorage.setItem("Contest-Prices", JSON.stringify(result.list));
//         })
//       }

//     }
//     else{
//       Functions.getInstance().offlineRunningMatches().then(result => {
//         // setRunningMatches(result);
//         updateData(result);
//         // setInterval(function(){
//         //   updateData(result);
//         // }, 1000);
//       });
//       Functions.getInstance().offlineUpComingMatches().then(result => setupcomingMatches(result));
//       setLoad(true);
//       hideProgress();

//     }
//   })

//  }

//  const checkVersionManually = (latestVers) =>{
//   VersionCheck.needUpdate({
//     currentVersion : VersionCheck.getCurrentVersion(),
//     latestVersion : latestVers
//   }).then((res)=>{
//     console.log(" Manual Version : ",res);
//     if(res.isNeeded){
//       setManualVersion(true);
//     }
//   })
//  }

//   const getCurrentTime = () =>{
//     var currentDate = new Date();
//     // Get the components of the date and time
//     var year = currentDate.getUTCFullYear();
//     var month = ('0' + (currentDate.getUTCMonth() + 1)).slice(-2);
//     var day = ('0' + currentDate.getUTCDate()).slice(-2);
//     var hours = ('0' + currentDate.getUTCHours()).slice(-2);
//     var minutes = ('0' + currentDate.getUTCMinutes()).slice(-2);
//     var seconds = ('0' + currentDate.getUTCSeconds()).slice(-2);
//     var currentSystemTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
//     return currentSystemTime;
// }

//    const selectMatch = (data) =>{
//     console.log(data);
//     Functions.getInstance().checkInternetConnectivity().then((state)=>{
//       if(state == true){
//         Functions.getInstance().fireAdjustEvent("ezt32m");
//         Functions.getInstance().fireFirebaseEvent("HomeUpComingMatches");
//         Services.getInstance().checkSquad(userInfo.userId, data.item.matchId, userInfo.accesToken).then((result)=>{
//           console.log(result);
//           if(result.status == true){
//             UserStore.setselectedMatch(data.item);
//             navigation.navigate('ChooseContest');
//           }
//           else{
//             if(result.msg == 'No Squad'){
//               Functions.getInstance().Toast("error","Squads are yet to be announced!");
//             }
//             else if(result.msg == 'Started'){
//               Functions.getInstance().Toast("error","Match has been started,You can't participate now");
//             }
//             else if(result.msg == 'No Content'){
//               Functions.getInstance().Toast("error","Match has been started,You can't participate now");
//             }

//           }
//         })
//       }
//       else{
//         Functions.getInstance().Toast("error","Check your internet");
//       }
//     })

//   }

//   const checkPlayStoreVersion = async() =>{
//     const version = await checkVersion();
//     console.log("Got version info:", version);
//     if (version.needsUpdate) {
//       // your popup goes here
//       console.log(`App has a ${version.updateType} update pending.`);
//       setVersionUpdate("Playstore");
//       checkVersionManually(version.version);
//     }
//   }

//   return !load ?
//   <SafeAreaView style={styles.root}>
//       <StatusBar backgroundColor="#111111" />
//   </SafeAreaView>

//   : (
//     <SafeAreaView style={styles.root}>
//       <StatusBar backgroundColor="#111111" />
//       <ScrollView contentContainerStyle={{flexGrow: 1}}>
//         <View style={[styles.mainContainer, {marginTop:0}]}>

//           <ImageSlider navigation={navigation} bannerData = {bannerData}/>
//           <MatchesList
//             title="Upcoming Matches"
//             showMore={true}
//             data={runningMatches}
//             extraData={upcomingMatches}
//             onPressMatch={selectMatch}
//           />
//           { manualVersion ?
//               <AppVersionUpdate
//                 onClose={()=>setManualVersion(false)}
//               /> : "" }

//         {
//           bonusPopup ? <BonusPopup onClose={()=>{
//             AsyncStorage.setItem("Bonus-status", "false");
//             setBonusPopup(false);
//           }
//           }
//             onYes={()=>{
//               AsyncStorage.setItem("Bonus-status", "false");
//               setBonusPopup(false);
//             }} /> : ""
//         }
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// export default WithProgress(CricketLeague);

// /////////////// exp Drag code working  //////////////////

// // import React from 'react';
// // import { StyleSheet, View } from 'react-native';
// // import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
// // import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// // const DraggableBox = () => {
// //   // Persistent positions (offsets) where the box starts/stays after dragging
// //   const offsetX = useSharedValue(0);
// //   const offsetY = useSharedValue(0);

// //   // Temporary positions during the drag
// //   const translationX = useSharedValue(0);
// //   const translationY = useSharedValue(0);

// //   const panGesture = Gesture.Pan()
// //     .onChange((event) => {
// //       translationX.value = event.translationX; // Track the current drag X value
// //       translationY.value = event.translationY; // Track the current drag Y value
// //     })
// //     .onEnd(() => {
// //       // When the drag ends, we add the final translation to the offset
// //       offsetX.value += translationX.value;
// //       offsetY.value += translationY.value;

// //       // Reset the temporary translation back to zero
// //       translationX.value = 0;
// //       translationY.value = 0;
// //     });

// //   // Apply the animated transformation for the box
// //   const animatedStyle = useAnimatedStyle(() => {
// //     return {
// //       transform: [
// //         { translateX: offsetX.value + translationX.value }, // Offset + current drag X
// //         { translateY: offsetY.value + translationY.value }, // Offset + current drag Y
// //       ],
// //     };
// //   });

// //   return (
// //     <GestureHandlerRootView style={styles.container}>
// //       <GestureDetector gesture={panGesture}>
// //         <Animated.View style={[styles.box, animatedStyle]} />
// //       </GestureDetector>
// //     </GestureHandlerRootView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   box: {
// //     width: 100,
// //     height: 100,
// //     backgroundColor: 'blue',
// //     borderRadius: 10,
// //   },
// // });

// // export default DraggableBox;

// //////// best code ////

// // import React, { useState } from 'react';
// // import { View, SafeAreaView, StyleSheet, TouchableOpacity, Text } from 'react-native';
// // import Animated, {
// //   LinearTransition,
// //   SequencedTransition,
// //   FadingTransition,
// //   FadeOut,
// //   JumpingTransition,
// //   CurvedTransition,
// //   EntryExitTransition,
// //   FlipOutYLeft,
// //   FlipInEasyY,
// //   Easing,
// // } from 'react-native-reanimated';

// // const INITIAL_BOXES = Array.from({ length: 10 }, (_, i) => ({
// //   id: i + 1,
// //   color: getRandomColor(),
// // }));

// // const LAYOUT_TRANSITIONS = [
// //   { label: 'Linear Transition', value: LinearTransition },
// //   { label: 'Sequenced Transition', value: SequencedTransition },
// //   { label: 'Fading Transition', value: FadingTransition },
// //   { label: 'Jumping Transition', value: JumpingTransition },
// //   {
// //     label: 'Curved Transition',
// //     value: CurvedTransition.easingX(Easing.sin).easingY(Easing.exp),
// //   },
// //   {
// //     label: 'Entry/Exit Transition',
// //     value: EntryExitTransition.entering(FlipInEasyY).exiting(FlipOutYLeft),
// //   },
// // ];

// // function getRandomColor() {
// //   const letters = '0123456789ABCDEF';
// //   let color = '#';
// //   for (let i = 0; i < 6; i++) {
// //     color += letters[Math.floor(Math.random() * 16)];
// //   }
// //   return color;
// // }

// // export default function App() {
// //   const [boxes, setBoxes] = useState(INITIAL_BOXES);
// //   const [selectedTransition, setSelectedTransition] = useState(LAYOUT_TRANSITIONS[0]);

// //   const removeBox = (idToRemove) => {
// //     const updatedBoxes = boxes.filter((box) => box.id !== idToRemove);
// //     setBoxes(updatedBoxes);
// //   };

// //   const onSelectTransition = (transition) => {
// //     setSelectedTransition(transition);
// //     setBoxes(INITIAL_BOXES); // Reset boxes when changing transition
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <View style={styles.dropdownContainer}>
// //         {LAYOUT_TRANSITIONS.map((transition, index) => (
// //           <TouchableOpacity
// //             key={index}
// //             onPress={() => onSelectTransition(transition)}
// //             style={[
// //               styles.transitionButton,
// //               {
// //                 backgroundColor: selectedTransition.label === transition.label ? '#888' : '#ccc',
// //               },
// //             ]}
// //           >
// //             <Text>{transition.label}</Text>
// //           </TouchableOpacity>
// //         ))}
// //       </View>

// //       <View style={styles.gridContainer}>
// //         {boxes.map((box) => (
// //           <Animated.View
// //             key={box.id}
// //             layout={selectedTransition.value}
// //             exiting={FadeOut}
// //             style={[styles.box, { backgroundColor: box.color }]}
// //           >
// //             <TouchableOpacity onPress={() => removeBox(box.id)}>
// //               <Text style={styles.boxText}>{box.id}</Text>
// //             </TouchableOpacity>
// //           </Animated.View>
// //         ))}
// //       </View>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //   },
// //   dropdownContainer: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     marginBottom: 20,
// //     justifyContent: 'center',
// //   },
// //   transitionButton: {
// //     padding: 10,
// //     margin: 5,
// //     borderRadius: 5,
// //   },
// //   gridContainer: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'center',
// //   },
// //   box: {
// //     width: 60,
// //     height: 60,
// //     margin: 10,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 8,
// //   },
// //   boxText: {
// //     color: '#fff',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// // });

///////////////////////////////////////////////////////

import { Avatar, Badge, Icon, withBadge } from "@rneui/themed";

import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native";
import {
  BorderLine2,
  England,
  India,
  Player1,
  Player2,
  Player3,
  Player4,
  Player5,
  Player6,
  Player7,
  PlusIcon,
  PlusIcon2,
  TickIcon,
} from "../../../assets";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { GREEN, ORANGE, secondary } from "../../../style";
import { styles } from "./BothTeamSelection.styles";
import WithProgress from "../LoadingOverlay/WithProgress";
import { inject, observer } from "mobx-react";
import LoadingPopup from "../playerSelection/LoadingPopup";
import UserStore from "../../stores/UserStore";
import AsyncStorage from "@react-native-community/async-storage";
import Functions from "../Functions";
import Services from "../../../Services/Services";
import EventSource from "react-native-event-source";
import { measureConnectionSpeed } from "react-native-network-bandwith-speed";
import ReactMoE, { MoEProperties } from "react-native-moengage";

let gameDetails,
  userInfo,
  myPic,
  userPF,
  currentSystemTime,
  teamACount = 1,
  teamBCount = 0,
  selected = false,
  plseleccted = false,
  socketTriggered,
  twentyFiveSeconds,
  thirtySeconds,
  globalTimeInterval,
  sec25int,
  playerIdsData = [],
  sec25TimeChange,
  preDefinedPlayers = [],
  nextTime,
  nextEndTime,
  serveCurTime,
  myStatus,
  startTimeClear,
  tossWinnerLastPic = {},
  lateDelayClear,
  netSpeedInterval,
  gb;
const BothTeamOpponentSelection = ({
  navigation,
  showProgress,
  hideProgress,
}) => {
  // const [userInfo, setUserInfo] = useState(null);

  if (UserStore) {
    const profile = UserStore.getuserPF();
    if (profile) {
      myPic = profile?.replace(/['"]+/g, "");
    }
  }
  const [currentTime, setCurrentTime] = useState("00:29");
  const [isRunning, setIsRunning] = useState(false); // Track if the timer is runnin added
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [teamABench, setTeamABench] = useState([]);
  const [teamBBench, setTeamBBench] = useState([]);
  /////// added /////
  const [global_6players, setglobal_6players] = useState([
    {
      contestId: "5832",
      endTime: "2024-11-22 09:14:01",
      matchId: "2197",
      order: 1,
      playerId: "1548",
      startTime: "2024-11-22 09:14:01",
      userId: "191",
    },
  ]);
  const [myDefaultPlayers, setMyDefaultPlayers] = useState([]);
  const [opponentName, setopponentName] = useState("");
  const [opponentPic, setopponentPic] = useState("");
  const [loading, setLoading] = useState(false);
  const [opEvent, setopEvent] = useState(false);
  const [isOpponent, setIsOpponent] = useState(false);
  const [myTurn, setmyTurn] = useState(true); // Track whoz the turn is now? added

  /////////////// new adds frm wss /////////////////
  const [myFinal, setMyFinal] = useState([]);
  const [opFinal, setOpFinal] = useState([]);
  const [myStatus, setMyStatus] = useState({});
  const [opnStatus, setOpnStatus] = useState({});
  const [needToPick, setNeedToPick] = useState(false); // New state for need_to_pick

  let selectionTime = "";
  let newSocket;

  const getCurrentTime = () => {
    var currentDate = new Date();
    // Get the components of the date and time
    var year = currentDate.getUTCFullYear();
    var month = ("0" + (currentDate.getUTCMonth() + 1)).slice(-2);
    var day = ("0" + currentDate.getUTCDate()).slice(-2);
    var hours = ("0" + currentDate.getUTCHours()).slice(-2);
    var minutes = ("0" + currentDate.getUTCMinutes()).slice(-2);
    var seconds = ("0" + currentDate.getUTCSeconds()).slice(-2);
    currentSystemTime =
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    return currentSystemTime;
  };

  useEffect(() => {
    const unsubscribe = navigation?.addListener("focus", () => {
      setTeamA([{}]);
      setTeamB([{}]);
      setTeamABench([]);
      setTeamBBench([]);
      playerIdsData = [];
      gameDetails = UserStore.selectedGameData;
      getData();
      AsyncStorage.setItem("p6data", "false");
      AsyncStorage.setItem("pl6-socket", "false");
      //  callSocket();
      callPlayer11Data();
    });
    return () => {
      hideProgress();
      setLoading(false);
      // newSocket.removeAllListeners();
      newSocket.close();
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let [minutes, seconds] = currentTime.split(":").map(Number);
    let totalSeconds = minutes * 60 + seconds;

    const interval = setInterval(() => {
      if (isRunning && totalSeconds > 0) {
        totalSeconds -= 1;

        const min = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
        const sec = String(totalSeconds % 60).padStart(2, "0");
        setCurrentTime(`${min}:${sec}`);
      }

      if (totalSeconds <= 0) {
        totalSeconds = 30; // Reset to 30 seconds (00:30)
        setmyTurn(!myTurn); //added
        // setCurrentTime('00:30'); // Ensure UI reflects the reset immediately
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, currentTime]);

  ////////// added ////////////////
  useEffect(() => {
    if (myTurn) {
      setLoading(false);
      setCurrentTime("00:30"); // Ensure UI reflects the reset immediately
      //  console.log('teamA------ data ------',teamA)
    } else {
      setLoading(true);
      setCurrentTime("00:30"); // Ensure UI reflects the reset immediately
    }
  }, [myTurn]);

  const getData = async () => {
    // showProgress();
    userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
    userPF = JSON.parse(await AsyncStorage.getItem("player6-profile"));
    console.log("userInfo --", userInfo.userId);
  };

  const callPlayer11Data = () => {
    const result = {
      myPlayers: [],
      nxtOpt: "",
      nxtTime: "",
      nxtTimeEnd: "",
      opnImg: "https://s3.ap-south-1.amazonaws.com/player6sports/pl6Uplods/",
      opnName: "av908488",
      oponLPlayer: "",
      selStartTm: "2024-11-07 12:34:02",
      serveCurTime: "2024-11-07 12:34:27",
      status: 200,
      teamA11: [
        {
          id: 1,
          name: "Player A1",
          playerRoleType: "Batsman",
          playerRole: "Opener",
          countryType: "India",
        },
        {
          id: 2,
          name: "Player A2",
          playerRoleType: "Batsman",
          playerRole: "Middle Order",
          countryType: "India",
        },
        {
          id: 3,
          name: "Player A3",
          playerRoleType: "All-Rounder",
          playerRole: "Batting All-Rounder",
          countryType: "India",
        },
        {
          id: 4,
          name: "Player A4",
          playerRoleType: "Bowler",
          playerRole: "Fast Bowler",
          countryType: "India",
        },
        {
          id: 5,
          name: "Player A5",
          playerRoleType: "Bowler",
          playerRole: "Spinner",
          countryType: "India",
        },
      ],
      teamB11: [
        {
          avg: "0",
          endTime: "",
          hs: "0",
          imageId: "",
          isSel: -1,
          name: "Ali Abid",
          orderId: "",
          playOrderId: "1",
          playerId: "1479",
          selBy: 0,
          teamName: "TAD",
        },
        {
          avg: "0",
          endTime: "",
          hs: "0",
          imageId: "20/8532.png",
          isSel: -1,
          name: "Alishan Sharafu",
          orderId: "",
          playOrderId: "1",
          playerId: "834",
          selBy: 0,
          teamName: "TAD",
        },
        {
          avg: "0",
          endTime: "",
          hs: "0",
          imageId: "",
          isSel: -1,
          name: "Ghulam Murtaza",
          orderId: "",
          playOrderId: "1",
          playerId: "4780",
          selBy: 0,
          teamName: "TAD",
        },
        {
          avg: "0",
          endTime: "",
          hs: "0",
          imageId: "",
          isSel: -1,
          name: "Haider Ali",
          orderId: "",
          playOrderId: "1",
          playerId: "4786",
          selBy: 0,
          teamName: "TAD",
        },
        {
          avg: "0",
          endTime: "",
          hs: "0",
          imageId: "",
          isSel: -1,
          name: "Ibrar Shah",
          orderId: "",
          playOrderId: "1",
          playerId: "1482",
          selBy: 0,
          teamName: "TAD",
        },
        {
          avg: "0",
          endTime: "",
          hs: "0",
          imageId: "",
          isSel: -1,
          name: "Jonathan Figy",
          orderId: "",
          playOrderId: "1",
          playerId: "4781",
          selBy: 0,
          teamName: "TAD",
        },
        {
          avg: "0",
          endTime: "",
          hs: "0",
          imageId: "",
          isSel: -1,
          name: "Prithvi Madhu",
          orderId: "",
          playOrderId: "1",
          playerId: "4783",
          selBy: 0,
          teamName: "TAD",
        },
        {
          avg: "0",
          endTime: "",
          hs: "0",
          imageId: "31/703.png",
          isSel: -1,
          name: "Rohan Mustafa",
          orderId: "",
          playOrderId: "1",
          playerId: "1484",
          selBy: 0,
          teamName: "TAD",
        },
        {
          avg: "0",
          endTime: "",
          hs: "0",
          imageId: "",
          isSel: -1,
          name: "Danny Pawson",
          orderId: "",
          playOrderId: "2",
          playerId: "4782",
          selBy: 0,
          teamName: "TAD",
        },
        {
          avg: "0",
          endTime: "",
          hs: "0",
          imageId: "19/2483.png",
          isSel: -1,
          name: "Mohammad Nadeem",
          orderId: "",
          playOrderId: "2",
          playerId: "849",
          selBy: 0,
          teamName: "TAD",
        },
        {
          avg: "0",
          endTime: "",
          hs: "0",
          imageId: "",
          isSel: -1,
          name: "Osama Shah",
          orderId: "",
          playOrderId: "2",
          playerId: "1480",
          selBy: 0,
          teamName: "TAD",
        },
      ],
      teamBBan: [
        {
          avg: "0",
          endTime: "",
          hs: "0",
          imageId: "",
          isSel: -1,
          name: "Mohammad Qasim",
          orderId: "",
          playOrderId: "4",
          playerId: "1592",
          selBy: 0,
          teamName: "TAD",
        },
        {
          avg: "0",
          endTime: "",
          hs: "0",
          imageId: "",
          isSel: -1,
          name: "Hamza Rehman",
          orderId: "",
          playOrderId: "2",
          playerId: "4784",
          selBy: 0,
          teamName: "TAD",
        },
        {
          avg: "0",
          endTime: "",
          hs: "0",
          imageId: "",
          isSel: -1,
          name: "Shehan Dilshan",
          orderId: "",
          playOrderId: "3",
          playerId: "4785",
          selBy: 0,
          teamName: "TAD",
        },
        {
          avg: "0",
          endTime: "",
          hs: "0",
          imageId: "",
          isSel: -1,
          name: "Muhammad Uzair Khan",
          orderId: "",
          playOrderId: "4",
          playerId: "1488",
          selBy: 0,
          teamName: "TAD",
        },
        {
          avg: "0",
          endTime: "",
          hs: "0",
          imageId: "",
          isSel: -1,
          name: "Zia Mukhtar",
          orderId: "",
          playOrderId: "4",
          playerId: "1489",
          selBy: 0,
          teamName: "TAD",
        },
        {
          avg: 0,
          endTime: "",
          hs: 0,
          imageId: "",
          isSel: -1,
          name: "Arran Fernandez",
          orderId: "",
          playOrderId: "4",
          playerId: "4977",
          selBy: 0,
          teamName: "TAD",
        },
      ],
    };
    selectionTime = result.selStartTm;
    setTeamA(result.teamA11);
    setTeamB(result.teamB11);
    setTeamABench(result.teamABan);
    setTeamBBench(result.teamBBan);
    setopponentName(result.opnName);
    setopponentPic(result.opnImg);
    setMyDefaultPlayers(result.myPlayers);
    tossWinnerLastPic = result.oponLPlayer.playerId;
    if (result.myPlayers.length > 0) {
      preDefinedPlayers = result.myPlayers[0];
    }
    filterTheSelectedData(
      result.teamA11,
      result.teamB11,
      result.teamABan,
      result.teamBBan
    );
  };

  // const process1 = () =>{
  //     // console.log(gameDetails);
  //     if(gameDetails?.tossWinner == userInfo.userId){
  //         sec25int = setInterval(autoSubmit25Sec, 25000);
  //         hideProgress();
  //         setLoading(false);
  //     }
  //     if(gameDetails?.tossWinner != userInfo.userId){
  //         setLoading(true);
  //         if(globalTimeInterval){
  //             clearInterval(globalTimeInterval);
  //         }
  //         startTimeClear = setTimeout(function(){
  //             teamBCount = teamBCount + 1;
  //             BindPlayerUI();
  //             hideProgress();
  //             setLoading(false);
  //             setCurrentTime("00:27");
  //             globalTimeInterval = setInterval(updateTime, 1000);
  //             sec25int = setInterval(autoSubmit25Sec, 27000);
  //         }, 30000)
  //     }
  //     if(gameDetails?.userTwo == userInfo.userId){
  //         setIsOpponent(true);
  //     }
  // }

  //// sets if a player is slected isSel : "1"
  // it is a just a fun() not ui render item, just sets player in ui also in state level

  const BindPlayerUI = () => {
    setTeamA((prevTeamA) => {
      const updatedTeamA = prevTeamA.map((element) => {
        if (
          element.playerId == tossWinnerLastPic &&
          element.selBy != userInfo.userId
        ) {
          return { ...element, isSel: "1" };
        }
        return element;
      });
      return updatedTeamA;
    });

    setTeamB((prevTeamB) => {
      const updatedTeamB = prevTeamB.map((element) => {
        if (
          element.playerId == tossWinnerLastPic &&
          element.selBy != userInfo.userId
        ) {
          return { ...element, isSel: "1" };
        }
        return element;
      });
      return updatedTeamB;
    });

    setTeamABench((prevTeamAB) => {
      const updatedTeamAB = prevTeamAB.map((element) => {
        if (
          element.playerId == tossWinnerLastPic &&
          element.selBy != userInfo.userId
        ) {
          return { ...element, isSel: "1" };
        }
        return element;
      });
      return updatedTeamAB;
    });

    setTeamBBench((prevTeamBB) => {
      const updatedTeamBB = prevTeamBB.map((element) => {
        if (
          element.playerId == tossWinnerLastPic &&
          element.selBy != userInfo.userId
        ) {
          return { ...element, isSel: "1" };
        }
        return element;
      });
      return updatedTeamBB;
    });
  };

  // navigates to 'CaptainViceCaptainSelection' if all 6 plrs sel done!
  const filterTheSelectedData = (teamA, teamB, teamAB, teamBB) => {
    teamACount = 0;
    teamBCount = 0;
    teamA.length > 0 &&
      teamA.forEach((element) => {
        if (element.isSel == "1" && element.selBy == userInfo.userId) {
          teamACount = teamACount + 1;
        }
        if (element.isSel == "1" && element.selBy != userInfo.userId) {
          teamBCount = teamBCount + 1;
        }
      });
    teamB.length > 0 &&
      teamB.forEach((element) => {
        if (element.isSel == "1" && element.selBy == userInfo.userId) {
          teamACount = teamACount + 1;
        }
        if (element.isSel == "1" && element.selBy != userInfo.userId) {
          teamBCount = teamBCount + 1;
        }
      });
    teamAB?.length > 0 &&
      teamAB?.forEach((element) => {
        if (element.isSel == "1" && element.selBy == userInfo.userId) {
          teamACount = teamACount + 1;
        }
        if (element.isSel == "1" && element.selBy != userInfo.userId) {
          teamBCount = teamBCount + 1;
        }
      });
    teamBB?.length > 0 &&
      teamBB?.forEach((element) => {
        if (element.isSel == "1" && element.selBy == userInfo.userId) {
          teamACount = teamACount + 1;
        }
        if (element.isSel == "1" && element.selBy != userInfo.userId) {
          teamBCount = teamBCount + 1;
        }
      });
    // console.log(`Team A count from user ${userInfo.userId}------>`, teamACount)
    //console.log(`Team B count from user ${userInfo.userId} ------>`, teamACount)
    if (teamACount == 6) {
      if (lateDelayClear) {
        clearTimeout(lateDelayClear);
      }
      if (startTimeClear) {
        clearTimeout(startTimeClear);
      }
      if (socketTriggered) {
        clearInterval(socketTriggered);
      }
      if (sec25int) {
        clearInterval(sec25int);
      }
      if (globalTimeInterval) {
        clearInterval(globalTimeInterval);
      }
      hideProgress();
      setLoading(false);
      const routes = navigation.getState()?.routes;
      if (routes[routes.length - 1].name == "BothTeamOpponentSelection") {
        console.log("Moving");
        hideProgress();
        setLoading(false);
        navigation.navigate("CaptainViceCaptainSelection");
      }
    }
  };

  const handlePlayerClick = (playerIndex, team, item) => {
    if (!plseleccted) {
      plseleccted = true;
      showProgress();
      if (item.isSel == "1") {
        hideProgress();
        Functions.getInstance().Toast(
          "error",
          "This player can't be selected.."
        );
        plseleccted = false;
      } else {
        const sysTime2 = getCurrentTime();
        if (lateDelayClear) {
          clearTimeout(lateDelayClear);
        }
        if (startTimeClear) {
          clearTimeout(startTimeClear);
        }
        if (socketTriggered) {
          clearInterval(socketTriggered);
        }
        if (sec25int) {
          clearInterval(sec25int);
        }
        if (globalTimeInterval) {
          clearInterval(globalTimeInterval);
        }
        setCurrentTime("00:00");
        const obj = {
          gameId: gameDetails.gameId,
          playerId: item.playerId,
          utcCTime: sysTime2,
        };
        console.log(obj);
        Services.getInstance()
          .saveFinalPlayers(
            obj,
            userInfo.userId,
            gameDetails.gameId,
            userInfo.accesToken
          )
          .then((result) => {
            console.log(result);
            plseleccted = false;
            if (result.status == 200) {
              callPlayer11Data()
                .then(function () {
                  hideProgress();
                  setLoading(true);
                  selected = false;
                })
                .catch(function () {
                  console.log("Line handleclick function");
                });
            } else if (result.status == 203) {
              console.log(
                `------------------> duplicate Player submission from user : ${userInfo.userId} <-------------------`
              );
              callPlayer11Data()
                .then(function () {
                  hideProgress();
                  setLoading(true);
                  selected = false;
                  socketTriggered = setInterval(offlineSocketVerify, 31000);
                })
                .catch(function () {
                  console.log("duplicate Player Line handleclick function");
                });
            } else if (result.status == 202) {
              hideProgress();
              setLoading(false);
              if (lateDelayClear) {
                clearTimeout(lateDelayClear);
              }
              if (startTimeClear) {
                clearTimeout(startTimeClear);
              }
              if (socketTriggered) {
                clearInterval(socketTriggered);
              }
              if (sec25int) {
                clearInterval(sec25int);
              }
              if (globalTimeInterval) {
                clearInterval(globalTimeInterval);
              }
              navigation.navigate("InternetChecker");
            } else {
              console.log(
                "------------------> Error in saving the final Player <-------------------"
              );
              plseleccted = false;
              Functions.getInstance().Toast(
                "error",
                "Unable to connect to the server at this moment,try again later"
              );
            }
          });
      }
    }
  };

  // Stop button handler
  const handleStop = () => {
    setIsRunning(false); // Stop the timer
  };

  const renderCountryBoxHeader = () => {
    return (
      <View style={styles.countryBoxTopHeader}>
        <View style={styles.teamLeft}>
          <View style={styles.teamsImage}>
            {userPF?.profileImg ==
            "https://s3.amazonaws.com/dealstageuploads/pl6Uplods/" ? (
              <Image
                style={styles.teamsImageStyle}
                source={require("../../../assets/images/dummy.png")}
              />
            ) : (
              <Image
                style={styles.teamsImageStyle}
                source={
                  userPF
                    ? { uri: myPic }
                    : require("../../../assets/images/dummy.png")
                }
              />
            )}
          </View>
          <View style={styles.teamName}>
            <Text style={styles.teamLeftNameText}>
              {userPF ? userPF?.name : ""}
            </Text>
          </View>
        </View>
        <View style={styles.timerBox}>
          <Text style={styles.timerText}>{currentTime}</Text>
        </View>
        <View style={styles.teamRight}>
          <View style={styles.teamRightImage}>
            {opponentPic &&
            opponentPic ==
              "https://s3.amazonaws.com/dealstageuploads/pl6Uplods/" ? (
              <Image
                style={styles.teamsImageStyle}
                source={require("../../../assets/images/dummy.png")}
              />
            ) : (
              <Image
                style={styles.teamsImageStyle}
                source={
                  opponentPic
                    ? { uri: opponentPic }
                    : require("../../../assets/images/dummy.png")
                }
              />
            )}
          </View>
          <View style={styles.teamRightTextContainer}>
            <Text style={styles.teamLeftNameText}>
              {opponentName ? opponentName : ""}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPickPlayerCheckBox = () => {
    return (
      <View style={styles.ptkmain}>
        <View style={[styles.pntlist, styles.ticklist, styles.btmlist]}>
          {[1, 2, 3, 4, 5, 6].map((player, index) =>
            index + 1 <= teamACount ? (
              <View
                key={index}
                style={[
                  styles.pntitem,
                  index + 1 <= teamACount && isOpponent
                    ? styles.opicked
                    : styles.ppicked,
                ]}
              >
                {index + 1 <= teamACount ? (
                  <Image style={styles.wtick} source={TickIcon} />
                ) : (
                  ""
                )}
              </View>
            ) : (
              <View
                key={index}
                style={[styles.pntitem, index + 1 <= teamACount]}
              >
                {index + 1 <= teamACount ? (
                  <Image style={styles.wtick} source={TickIcon} />
                ) : (
                  ""
                )}
              </View>
            )
          )}
        </View>

        <View
          style={[
            styles.pntlist,
            styles.ticklist,
            styles.btmlist,
            styles.slist,
          ]}
        >
          {[1, 2, 3, 4, 5, 6].map((player, index) =>
            index + 1 <= teamBCount ? (
              <View
                key={index}
                style={[
                  styles.pntitem,
                  index + 1 <= teamBCount && isOpponent
                    ? styles.ppicked
                    : styles.opicked,
                ]}
              >
                {index + 1 <= teamBCount ? (
                  <Image style={styles.wtick} source={TickIcon} />
                ) : (
                  ""
                )}
              </View>
            ) : (
              <View
                key={index}
                style={[styles.pntitem, index + 1 <= teamBCount]}
              >
                {index + 1 <= teamBCount ? (
                  <Image style={styles.wtick} source={TickIcon} />
                ) : (
                  ""
                )}
              </View>
            )
          )}
        </View>
      </View>
    );
  };

  // const renderTeamAItem = ({ item, index }) => (
  //         <View style={[styles.tmplyrlft,
  //             (item.isSel == "1"  && isOpponent && item.selBy == userInfo?.userId) ? styles.borderTopOrangeWidth
  //             :
  //             (item.isSel == "1"  && isOpponent == false && item.selBy == userInfo?.userId) ? styles.borderTopBlueWidth
  //             :
  //             (item.isSel == "1"  && isOpponent && item.selBy != userInfo?.userId) ? styles.borderTopBlueWidth
  //             :
  //             (item.isSel == "1"  && isOpponent == false && item.selBy != userInfo?.userId) ? styles.borderTopOrangeWidth
  //             :
  //             "grey"
  //         ]}>
  //             <View style={styles.plyrlft}>
  //                 <View style={[styles.plyrprfl, styles.plyrlftprfl]}>
  //                 {item.imageId == "" ? <Image style={styles.teamsImageStyle} source={require('../../../assets/images/dummy.png')}/>
  //                     :
  //                     <Image style={styles.teamsImageStyle} source={{ uri: `https://cdn.sportmonks.com/images/cricket/players/${item.imageId}` }} />
  //                 }
  //                 </View>
  //                 <View style={{ marginTop: 5 }}>
  //                     <Text style={[styles.ortxt, styles.plyrtm, styles.plyrsd]}>{item.teamName}</Text>
  //                 </View>
  //             </View>
  //             <View style={[styles.dotp, styles.dotp2]}>
  //                 <Image style={styles.dotimg} source={BorderLine2} />
  //             </View>
  //             <View>
  //                 <Text style={[styles.teamnm, styles.wnrtxt, styles.tmname, styles.plyrname]}>{item.name}</Text>
  //                 <Text style={[styles.teamnm, styles.plyrruns]}>Avg : {item.avg}</Text>
  //                 <Text style={[styles.ortxt, styles.plyrruns]}>HS : {item.hs}</Text>
  //             </View>

  //             <TouchableOpacity
  //                 style={[styles.adplyr,
  //                     {backgroundColor:
  //                         (item.isSel == "1"  && isOpponent && item.selBy == userInfo?.userId) ? "orange"
  //                         :
  //                         (item.isSel == "1"  && isOpponent == false && item.selBy == userInfo?.userId) ? "#246afe"
  //                         :
  //                         (item.isSel == "1"  && isOpponent && item.selBy != userInfo?.userId) ? "#246afe"
  //                         :
  //                         (item.isSel == "1"  && isOpponent == false && item.selBy != userInfo?.userId) ? "orange"
  //                         :

  //                         "grey" }]}
  //                 disabled={item.isSel == "1"}
  //                 onPress={() => {
  //                     Functions.getInstance().fireAdjustEvent("pogpop");
  //                     Functions.getInstance().fireFirebaseEvent("Players11SelectionPlusButton");
  //                     let properties = new MoEProperties();
  //                     properties.addAttribute("clicked", true);
  //                     ReactMoE.trackEvent("LIVE Player Selection", properties);
  //                     handlePlayerClick(index, 1, item);
  //                     selected = true;
  //                 }}
  //             >
  //                 {item.isSel == "1" ? (
  //                     <Image style={{width:8,height:8}} source={TickIcon}/>
  //                 ) : (
  //                     <Image style={styles.adplusimg} source={PlusIcon} />
  //                 )}
  //             </TouchableOpacity>

  //         </View>
  // );

  const renderTeamAItem = ({ item, index }) => {
    // Function to determine the border color based on conditions
    const getBorderColor = (item, global_6players, userInfo) => {
      const matchingPlayer = global_6players.find(
        (player) => player.playerId === item.playerId
      );
      if (matchingPlayer) {
        return matchingPlayer.userId === userInfo?.userId
          ? styles.borderTopBlueWidth
          : styles.borderTopOrangeWidth;
      }
      return styles.defaultBorderStyle; // Optional fallback style
    };

    const getTickBgColor = (item, global_6players, userInfo) => {
      const matchingPlayer = global_6players.find(
        (player) => player.playerId === item.playerId
      );
      if (matchingPlayer) {
        return matchingPlayer.userId === userInfo?.userId
          ? "#246afe"
          : "orange";
      }
      return styles.defaultBorderStyle; // Optional fallback style
    };

    // Track selection events using analytics tools
    const trackSelectionEvent = () => {
      const functionsInstance = Functions.getInstance();
      functionsInstance.fireAdjustEvent("pogpop");
      functionsInstance.fireFirebaseEvent("Players11SelectionPlusButton");

      const properties = new MoEProperties().addAttribute("clicked", true);
      ReactMoE.trackEvent("LIVE Player Selection", properties);
    };

    // Determine if the player is already selected or disabled
    const isPlayerDisabled = global_6players.some(
      (player) => player.playerId === item.playerId
    );

    return (
      <TouchableOpacity
        //  disabled={isPlayerDisabled}
        onPress={() => {
          Vibration.vibrate(400); // Trigger vibration
          trackSelectionEvent();
          handlePlayerClick(index, 1, item);
        }}
        style={[
          styles.tmplyrlft,
          // getBorderColor(item, global_6players, userInfo),
        ]}
      >
        {/* Player Left Section */}
        <View style={styles.plyrlft}>
          <View
          //  style={[styles.plyrprfl, styles.plyrlftprfl]}
          >
            {/* <Image
                style={styles.teamsImageStyle}
                source={
                  item.imageId
                    ? {
                        uri: `https://cdn.sportmonks.com/images/cricket/players/${item.imageId}`,
                      }
                    : require("../../../assets/images/dummy.png")
                }
                onError={() =>
                  console.error(`Failed to load image for ${item.name}`)
                }
              /> */}
            <Avatar
              avatarStyle={{ borderWidth: 1, borderColor: "#fff" }}
              rounded
              source={
                item.imageId
                  ? {
                      uri: `https://cdn.sportmonks.com/images/cricket/players/${item.imageId}`,
                    }
                  : require("../../../assets/images/dummy.png")
              }
              size={38}
            />
            <Image
              source={{
                uri:
                  "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/cricketBall.png",
              }}
              style={{
                width: 20,
                height: 20,
                position: "absolute",
                left: 30,
                bottom: 1,
              }}
            />
          </View>
          <View style={{ marginTop: 5 }}>
            <Text style={[styles.ortxt, styles.plyrtm, styles.plyrsd]}>
              {item.teamName}
            </Text>
          </View>
        </View>

        {/* Dotted Line Section */}
        <View style={[styles.dotp, styles.dotp2]}>
          <Image style={styles.dotimg} source={BorderLine2} />
        </View>

        {/* Player Info Section */}
        <View>
          <Text
            style={[
              styles.teamnm,
              styles.wnrtxt,
              styles.tmname,
              styles.plyrname,
            ]}
          >
            {item.name}
          </Text>
          <Text style={[styles.teamnm, styles.plyrruns]}>Avg: {item.avg}</Text>
          <Text style={[styles.ortxt, styles.plyrruns]}>HS: {item.hs}</Text>
        </View>

        {/* Player Action Button */}
        <View
          style={[
            styles.adplyr,
            {
              backgroundColor: isPlayerDisabled
                ? getTickBgColor(item, global_6players, userInfo)
                : "gray",
            },
          ]}
        >
          {isPlayerDisabled ? (
            <Image style={{ width: 8, height: 8 }} source={TickIcon} />
          ) : (
            <Image style={styles.adplusimg} source={PlusIcon} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Icon Style Function
  const iconStyle = (roleType) => ({
    width: roleType === "3" ? 16 : 18,
    height: roleType === "3" ? 16 : 18,
    position: "absolute",
    bottom: 0,
    left: 42,
  });

  const renderTeamBItem = ({ item, index }) => (
    <View
      style={[
        styles.tmplyrlft,
        item.isSel == "1" && isOpponent && item.selBy == userInfo?.userId
          ? styles.borderTopOrangeWidth
          : item.isSel == "1" &&
            isOpponent == false &&
            item.selBy == userInfo?.userId
          ? styles.borderTopBlueWidth
          : item.isSel == "1" && isOpponent && item.selBy != userInfo?.userId
          ? styles.borderTopBlueWidth
          : item.isSel == "1" &&
            isOpponent == false &&
            item.selBy != userInfo?.userId
          ? styles.borderTopOrangeWidth
          : "grey",
      ]}
    >
      <View style={styles.plyrlft}>
        <View style={[styles.plyrprfl, styles.plyrlftprfl]}>
          {item.imageId == "" ? (
            <Image
              style={styles.teamsImageStyle}
              source={require("../../../assets/images/dummy.png")}
            />
          ) : (
            <Image
              style={styles.teamsImageStyle}
              source={{
                uri: `https://cdn.sportmonks.com/images/cricket/players/${item.imageId}`,
              }}
            />
          )}
        </View>
        <View style={{ marginTop: 5 }}>
          <Text style={[styles.ortxt, styles.plyrtm, styles.plyrsd]}>
            {item.teamName}
          </Text>
        </View>
      </View>
      <View style={[styles.dotp, styles.dotp2]}>
        <Image style={styles.dotimg} source={BorderLine2} />
      </View>
      <View>
        <Text
          style={[styles.teamnm, styles.wnrtxt, styles.tmname, styles.plyrname]}
        >
          {item.name}
        </Text>
        <Text style={[styles.teamnm, styles.plyrruns]}>Avg : {item.avg}</Text>
        <Text style={[styles.ortxt, styles.plyrruns]}>HS : {item.hs}</Text>
      </View>

      {/* {(item.isSel == "1" || (currentSystemTime > (item.endTime))) && item.endTime != "" ? */}
      <TouchableOpacity
        style={[
          styles.adplyr,
          {
            backgroundColor:
              item.isSel == "1" && isOpponent && item.selBy == userInfo?.userId
                ? "orange"
                : item.isSel == "1" &&
                  isOpponent == false &&
                  item.selBy == userInfo?.userId
                ? "#246afe"
                : item.isSel == "1" &&
                  isOpponent &&
                  item.selBy != userInfo?.userId
                ? "#246afe"
                : item.isSel == "1" &&
                  isOpponent == false &&
                  item.selBy != userInfo?.userId
                ? "orange"
                : "grey",
          },
        ]}
        onPress={() => {
          Functions.getInstance().fireAdjustEvent("pogpop");
          Functions.getInstance().fireFirebaseEvent(
            "Players11SelectionPlusButton"
          );
          let properties = new MoEProperties();
          properties.addAttribute("clicked", true);
          ReactMoE.trackEvent("LIVE Player Selection", properties);
          handlePlayerClick(index, 2, item);
          selected = true;
        }}
        disabled={item.isSel == "1"}
      >
        {item.isSel == "1" ? (
          <Image style={{ width: 8, height: 8 }} source={TickIcon} />
        ) : (
          <Image style={styles.adplusimg} source={PlusIcon} />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, marginTop: 60, backgroundColor: "#111" }}>
      {/* <ScrollView style={styles.scrollView}> */}
      <View style={[styles.headerContainer]}>
        <View style={styles.countryBox}>
          {renderCountryBoxHeader()}
          {renderPickPlayerCheckBox()}
        </View>
        <ScrollView style={styles.scrollView}>
          <Text
            style={[styles.headingText, styles.ennum, { textAlign: "center" }]}
          >
            Select Your P6 Squads
          </Text>
          <View style={styles.playerContainer}>
            <View style={styles.playerContentBox}>
              <FlatList
                data={teamA}
                renderItem={renderTeamAItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View style={styles.playerContentBox}>
              <FlatList
                data={teamB}
                renderItem={renderTeamBItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>

          <Text
            style={[styles.headingText, styles.ennum, { textAlign: "center" }]}
          >
            Bench
          </Text>
          <View style={styles.playerContainer}>
            <View style={styles.playerContentBox}>
              <FlatList
                data={teamABench}
                renderItem={renderTeamAItem}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={<View style={{ paddingBottom: 50 }} />}
              />
            </View>
            <View style={styles.playerContentBox}>
              <FlatList
                data={teamBBench}
                renderItem={renderTeamBItem}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={<View style={{ paddingBottom: 50 }} />}
              />
            </View>
          </View>
        </ScrollView>
      </View>

      {/* </ScrollView> */}
      {loading ? (
        <LoadingPopup
          isVisible={loading}
          closePopup={() => setLoading(false)}
          navigation={navigation}
          teamA={teamA}
          teamB={teamB}
          teamABench={teamABench}
          teamBBench={teamBBench}
          isOpponent={isOpponent}
          userInfo={userInfo}
        />
      ) : (
        ""
      )}
    </View>
  );
};

export default WithProgress(
  inject("UserStore")(observer(BothTeamOpponentSelection))
);
