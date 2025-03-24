// import React, { useEffect, useState } from "react";
// import {
//   BackHandler,
//   FlatList,
//   ImageBackground,
//   SafeAreaView,
//   ScrollView,
//   View,
// } from "react-native";
// import { inject, observer } from "mobx-react";
// import WithProgress from "../LoadingOverlay/WithProgress";
// import { styles } from "./TotalResult.styles";
// import Eicon from "../cricketLeague/Imgs/Icons/coin.png";
// import CustomButton from "../customComponents/CustomButton";
// import {
//   HistoryEmpty,
//   LooserBG,
//   Player,
//   TBC,
//   ThumbsLoose,
//   TotalButton,
//   Trophy,
//   TrophyBackground,
// } from "../../../assets";
// import { Text } from "react-native";
// import { TouchableOpacity } from "react-native";
// import { Image } from "@rneui/base";
// import AsyncStorage from "@react-native-community/async-storage";
// import Services from "../../../Services/Services";
// import Functions from "../Functions";
// import { secondary } from "../../../style";
// import { useFocusEffect } from "@react-navigation/native";
// import ReactMoE, { MoEProperties } from "react-native-moengage";

// const MatchType = {
//   "1": "1",
//   "2": "5",
//   "3": "10",
//   "4": "20",
// };

// let userPF,
//   userInfo,
//   totalWin = 0,
//   totalLoss = 0,
//   status = false,
//   winCount = 0,
//   lossCount = 0;

// const TotalResult = ({ navigation, showProgress, hideProgress }) => {
//   const [scoreBoard, setScoreBoard] = useState();
//   const [historyList, setHistoryList] = useState([]);

//   useEffect(() => {
//     const unsubscribe = navigation.addListener("focus", () => {
//       AsyncStorage.setItem("pl6-socket", "null");
//       myHistory();
//     });
//     return unsubscribe;
//   }, [navigation, totalWin, totalLoss]);

//   useFocusEffect(
//     React.useCallback(() => {
//       const backHandler = BackHandler.addEventListener(
//         "hardwareBackPress",
//         () => {
//           navigation.navigate("CricketLeague");
//           return true;
//         }
//       );

//       return () => {
//         backHandler.remove();
//       };
//     }, [])
//   );

//   const myHistory = async () => {
//     showProgress();
//     userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
//     userPF = JSON.parse(await AsyncStorage.getItem("player6-profile"));
//     Functions.getInstance().checkExpiration(
//       userInfo.userId,
//       userInfo.refToken,
//       navigation
//     );
//     Functions.getInstance()
//       .checkInternetConnectivity()
//       .then((state) => {
//         if (state == true) {
//           Services.getInstance()
//             .historyData(userInfo.userId, userInfo.accesToken)
//             .then((result) => {
//               console.log(
//                 JSON.stringify("---- HISTRY API DATA -----", result.data)
//               );
//               console.log("---- HISTRY API DATA -----", result);
//               if (result.status == 200) {
//                 setHistoryList(result.data);
//                 AsyncStorage.setItem("History", JSON.stringify(result.data));
//                 if (result.data.length > 0) {
//                   fireEventToMoEngage(result.data);
//                 }
//                 if (result.winTotal) {
//                   totalWin = result.winTotal;
//                   AsyncStorage.setItem(
//                     "History-WinTotal",
//                     String(result.winTotal)
//                   );
//                 }
//                 if (result.loosTotal) {
//                   totalLoss = result.loosTotal;
//                   AsyncStorage.setItem(
//                     "History-LossTotal",
//                     String(result.loosTotal)
//                   );
//                 }
//               }
//               hideProgress();
//             });
//         } else {
//           getTotalWin();
//           getTotalLoss();
//           Functions.getInstance()
//             .offlineHistory()
//             .then((result) => {
//               setHistoryList(result);
//             });
//           hideProgress();
//         }
//       });
//   };

//   const getTotalWin = async () => {
//     totalWin = await AsyncStorage.getItem("History-WinTotal");
//   };
//   const getTotalLoss = async () => {
//     totalLoss = await AsyncStorage.getItem("History-LossTotal");
//   };

//   const fireEventToMoEngage = (data) => {
//     data.forEach((element) => {
//       if (element.winnStatus == "1") {
//         winCount = winCount + 1;
//       } else {
//         lossCount = lossCount + 1;
//       }
//       ReactMoE.setUserAttribute("Wins", winCount);
//       ReactMoE.setUserAttribute("Loses", lossCount);
//     });
//   };

//   return (
//     <SafeAreaView style={styles.root}>
//       <ScrollView style={[styles.exvw]}>
//         <View style={styles.rm_main}>
//           <View style={styles.cardView}>
//             <View style={styles.flexRow}>
//               <CustomButton
//                 width="45%"
//                 onPress={() => null}
//                 btnLabel={`Total Win ${totalWin}`}
//               />
//               <CustomButton
//                 width="45%"
//                 colour="orange"
//                 onPress={() => null}
//                 btnLabel={`Total Loss ${totalLoss}`}
//               />
//             </View>
//             {(Number(totalWin) - Number(totalLoss)).toFixed(2) > 0 ? (
//               <ImageBackground
//                 style={{
//                   margin: 8,
//                   padding: 8,
//                   flex: 1,
//                   borderRadius: 8,
//                   overflow: "hidden",
//                   marginBottom: 7,
//                 }}
//                 source={TotalButton}
//               >
//                 <Text style={styles.normalFont}>Net</Text>
//                 <Text style={styles.boldFont}>
//                   ₹{(Number(totalWin) - Number(totalLoss)).toFixed(2)}
//                 </Text>
//               </ImageBackground>
//             ) : (
//               <ImageBackground
//                 style={{
//                   margin: 8,
//                   padding: 8,
//                   flex: 1,
//                   borderRadius: 8,
//                   overflow: "hidden",
//                   marginBottom: 7,
//                 }}
//                 source={LooserBG}
//               >
//                 <Text style={styles.normalFont}>Net</Text>
//                 <Text style={styles.boldFont}>
//                   ₹{(Number(totalLoss) - Number(totalWin)).toFixed(2)}
//                 </Text>
//               </ImageBackground>
//             )}
//           </View>
//           {historyList && historyList.length > 0 ? (
//             historyList.map((item, index) => {
//               const PriceTyp =
//                 item.userOne == userInfo.userId
//                   ? item.userOnePriceType
//                   : item.userTwoPriceType;
//               return (
//                 <View key={index}>
//                   <TouchableOpacity
//                     onPress={() => {
//                       Functions.getInstance().fireAdjustEvent("nd4sm7");
//                       let properties = new MoEProperties();
//                       properties.addAttribute("Archived Match tiles", true);
//                       ReactMoE.trackEvent("Archived Match tiles", properties);
//                       if (status == false) {
//                         status = true;
//                         setScoreBoard(index);
//                       } else {
//                         if (index == scoreBoard) {
//                           status = false;
//                           setScoreBoard();
//                         } else {
//                           status = true;
//                           setScoreBoard(index);
//                         }
//                       }
//                     }}
//                   >
//                     <View style={styles.container}>
//                       <View style={styles.leftContainer}>
//                         <Text style={styles.heading}>{item.title}</Text>
//                         {/* <Text style={[styles.vsText,{fontSize : 12,bottom : 5}]}>{`₹ ${MatchType[(item.contestId)]}`}</Text> */}
//                         <Text style={styles.subHeading}>
//                           {Functions.getInstance().HistoryMatchDateTime(
//                             item.startTime
//                           )}
//                         </Text>

//                         <View style={styles.row}>
//                           <View style={{ marginTop: 10 }}>
//                             <View style={styles.plyrprfl}>
//                               {item.contOneImg == "" ||
//                               item.contOneImg ==
//                                 "https://cdn.sportmonks.com" ? (
//                                 <Image
//                                   style={[
//                                     styles.image,
//                                     styles.mnimg,
//                                     { marginTop: 5 },
//                                   ]}
//                                   source={TBC}
//                                 />
//                               ) : (
//                                 <Image
//                                   style={styles.image}
//                                   source={{
//                                     uri: `https://cdn.sportmonks.com/images/cricket/teams/${item.contOneImg}`,
//                                   }}
//                                 />
//                               )}
//                             </View>
//                             <Text style={styles.teamName}>
//                               {item.contOneSnam}
//                             </Text>
//                           </View>
//                           {PriceTyp === "1" ? (
//                             <Text
//                               style={[
//                                 styles.vsText,
//                                 { fontSize: 12, bottom: 5 },
//                               ]}
//                             >
//                               ₹ {item.contestPrice}
//                             </Text>
//                           ) : (
//                             <View
//                               style={{
//                                 flexDirection: "row",
//                                 alignItems: "center",
//                                 alignSelf: "center",
//                                 paddingHorizontal: 14,
//                                 paddingVertical: 4,
//                                 marginHorizontal: 10,
//                                 borderRadius: 16,
//                                 backgroundColor: "#5B5B5B",
//                               }}
//                             >
//                               <Image
//                                 source={Eicon}
//                                 style={{
//                                   width: 16,
//                                   height: 16,
//                                   marginRight: 1.6,
//                                   marginTop: 1,
//                                 }}
//                               />
//                               <Text
//                                 style={[
//                                   {
//                                     color: "white",
//                                     fontSize: 8,
//                                     fontWeight: "bold",
//                                     alignSelf: "center",
//                                     textAlign: "center",
//                                   },
//                                   {
//                                     fontSize: 12,
//                                     //bottom : 5
//                                   },
//                                 ]}
//                               >
//                                 {item.contestPrice}
//                               </Text>
//                             </View>
//                           )}
//                           {/* <Text style={[styles.vsText,{fontSize : 12,bottom : 5}]}>{`₹ ${item.contestPrice}`} API :{PriceTyp}</Text> */}
//                           <View style={{ marginTop: 10, marginLeft: 4 }}>
//                             <View style={styles.plyrprfl}>
//                               {item.contTwoImg == "" ||
//                               item.contTwoImg ==
//                                 "https://cdn.sportmonks.com" ? (
//                                 <Image
//                                   style={[
//                                     styles.image,
//                                     styles.mnimg,
//                                     { marginTop: 5 },
//                                   ]}
//                                   source={TBC}
//                                 />
//                               ) : (
//                                 <Image
//                                   style={styles.image}
//                                   source={{
//                                     uri: `https://cdn.sportmonks.com/images/cricket/teams/${item.contTwoImg}`,
//                                   }}
//                                 />
//                               )}
//                             </View>
//                             <Text style={styles.teamName}>
//                               {item.contTwoSnam}
//                             </Text>
//                           </View>
//                         </View>
//                       </View>

//                       <View style={styles.rightContainer}>
//                         <View style={{ flex: 1, paddingVertical: 10 }}>
//                           <Text style={styles.runs}>
//                             {item.userOneScore}/{item.userTwoScore} Runs
//                           </Text>

//                           {item.winnStatus == "1" &&
//                           (item.winnerId == userInfo.userId ||
//                             item.winnerId == "0") ? (
//                             <View
//                               style={[
//                                 styles.troffyImage,
//                                 {
//                                   marginLeft: 50,
//                                   marginTop: 5,
//                                   marginBottom: 5,
//                                 },
//                               ]}
//                             >
//                               <Image
//                                 style={styles.rightImage}
//                                 source={Trophy}
//                               />
//                             </View>
//                           ) : (
//                             <View
//                               style={[
//                                 styles.troffyImage,
//                                 {
//                                   marginLeft: 50,
//                                   marginTop: 5,
//                                   marginBottom: 5,
//                                 },
//                               ]}
//                             >
//                               <Image
//                                 style={styles.rightImage}
//                                 source={ThumbsLoose}
//                               />
//                             </View>
//                           )}
//                         </View>
//                         <Image
//                           style={{
//                             height: 60,
//                             top: 88,
//                             right: 1,
//                             width: 40,
//                             marginEnd: 2,
//                             marginBottom: 2,
//                             alignSelf: "flex-end",
//                             resizeMode: "center",
//                             overflow: "hidden",
//                             position: "absolute",
//                           }}
//                           source={TrophyBackground}
//                         />
//                         <View style={{ flex: 1, paddingVertical: 10 }}>
//                           {/* {item.winnStatus == "1" &&
//                           (item.winnerId == userInfo.userId ||
//                             item.winnerId == "0") ? (
//                             <Text style={[styles.amount, { color: secondary }]}>
//                               +Rs {item.amount}/-
//                             </Text>
//                           ) : (
//                             <Text style={[styles.amount, { color: "#e79013" }]}>
//                               -Rs {item.amount}/-
//                             </Text>
//                           )} */}

//                           {item.winnStatus == "1" &&
//                           (item.winnerId == userInfo.userId ||
//                             item.winnerId == "0") ? (
//                             PriceTyp === "1" ? (
//                               <Text
//                                 style={[styles.amount, { color: secondary, }]}
//                               >
//                                 +₹{item.amount}/-
//                               </Text>
//                             ) : (
//                               <View
//                                 style={{
//                                   flexDirection: "row",
//                                   alignItems: "center",
//                                   alignSelf: "center",
//                                   bottom: 0,
//                                   top: -15,

//                                   paddingHorizontal: 14,
//                                   paddingVertical: 4,
//                                   marginHorizontal: 10,
//                                   borderRadius: 16,
//                                 //  backgroundColor: "#5B5B5B",
//                                 }}
//                               >
//                               <Text
//                                   style={[
//                                     {
//                                       color: "white",
//                                       fontSize: 12,
//                                       fontWeight: "bold",
//                                     },
//                                   ]}
//                                 >+₹</Text>
//                                 {/* <Image
//                                   source={Eicon}
//                                   style={{
//                                     width: 16,
//                                     height: 16,
//                                    // marginRight: 1.6,
//                                     marginTop: 1,
//                                   }}
//                                 /> */}
//                                 <Text
//                                   style={[
//                                     {
//                                       color: "white",
//                                       fontSize: 12,
//                                       fontWeight: "bold",
//                                     },
//                                   ]}>{item.amount}/-</Text>
//                               </View>
//                             )
//                           ) : PriceTyp === "1" ? (
//                             <Text style={[styles.amount, { color: "#e79013" }]}>
//                               -₹{item.amount}/-
//                             </Text>
//                           ) : (
//                             <View
//                               style={{
//                                 flexDirection: "row",
//                                 alignItems: "center",
//                                 alignSelf: "center",
//                                 bottom: 0,
//                                 top: -15,

//                                 paddingHorizontal: 14,
//                                 paddingVertical: 4,
//                                 marginHorizontal: 10,
//                                 borderRadius: 16,
//                               //  backgroundColor: "#5B5B5B",
//                               }}
//                             >
//                             <Text
//                                 style={[
//                                   {
//                                     color: "white",
//                                     fontSize: 12,
//                                     fontWeight: "bold",
//                                   },
//                                 ]}
//                               >-</Text>
//                               <Image
//                                 source={Eicon}
//                                 style={{
//                                   width: 16,
//                                   height: 16,
//                                   marginRight: 1.6,
//                                   marginTop: 1,
//                                 }}
//                               />
//                               <Text
//                                 style={[
//                                   {
//                                     color: "white",
//                                     fontSize: 12,
//                                     fontWeight: "bold",
//                                   },
//                                 ]}
//                               >{item.amount}/-</Text>
//                             </View>
//                           )}
//                         </View>
//                       </View>
//                     </View>
//                   </TouchableOpacity>

//                   {scoreBoard == index ? (
//                     <View
//                       style={[
//                         styles.cardView,
//                         { flexDirection: "row", paddingRight: 40 },
//                       ]}
//                     >
//                       <View style={{ maxWidth: "50%" }}>
//                         {item.myPlayers && item.myPlayers.length > 0 ? (
//                           <Text
//                             style={[
//                               styles.teamnm,
//                               styles.wnrtxt,
//                               styles.tmname,
//                               styles.plyrname,
//                               { color: "#A9A9A9", marginTop: 10 },
//                             ]}
//                           >
//                             Your Team
//                           </Text>
//                         ) : (
//                           ""
//                         )}
//                         {item.myPlayers && item.myPlayers.length > 0
//                           ? item.myPlayers.map((players, pindex) => {
//                               return (
//                                 <View
//                                   key={pindex}
//                                   style={{
//                                     flex: 1,
//                                     paddingHorizontal: 16,
//                                     paddingVertical: 6,
//                                     marginLeft: 26,
//                                   }}
//                                 >
//                                   {players.isCap == "1" ||
//                                   players.isvCap == "1" ? (
//                                     <Text style={styles.cvctxt}>
//                                       {players.isCap == "1"
//                                         ? "C"
//                                         : players.isvCap == "1"
//                                         ? "Vc"
//                                         : ""}
//                                     </Text>
//                                   ) : (
//                                     ""
//                                   )}
//                                   <View style={[styles.plyrprflinfo]}>
//                                     <View style={[styles.plyrprfl]}>
//                                       {players.faceImageId == "" ? (
//                                         <Image
//                                           style={[
//                                             styles.tmsdimg,
//                                             { resizeMode: "contain" },
//                                           ]}
//                                           source={require("../../../assets/images/dummy.png")}
//                                         />
//                                       ) : (
//                                         <Image
//                                           style={[
//                                             styles.tmsdimg,
//                                             { resizeMode: "contain" },
//                                           ]}
//                                           source={{
//                                             uri: `https://cdn.sportmonks.com/images/cricket/players/${players.faceImageId}`,
//                                           }}
//                                         />
//                                       )}
//                                     </View>

//                                     <View>
//                                       <Text
//                                         style={[
//                                           styles.teamnm,
//                                           styles.wnrtxt,
//                                           styles.tmname,
//                                           styles.plyrname,
//                                         ]}
//                                       >
//                                         {players.name}
//                                       </Text>

//                                       <Text
//                                         style={[styles.ortxt, styles.plyrtm]}
//                                       >
//                                         Runs {players.score}{" "}
//                                         {players.isCap == "1"
//                                           ? "x 2"
//                                           : players.isvCap == "1"
//                                           ? "x 1.5"
//                                           : ""}
//                                       </Text>
//                                     </View>
//                                   </View>
//                                 </View>
//                               );
//                             })
//                           : ""}
//                       </View>
//                       <View style={{ maxWidth: "50%" }}>
//                         {item.openPlayers && item.openPlayers.length > 0 ? (
//                           <Text
//                             style={[
//                               styles.teamnm,
//                               styles.wnrtxt,
//                               styles.tmname,
//                               styles.plyrname,
//                               {
//                                 color: "#A9A9A9",
//                                 marginTop: 10,
//                                 paddingLeft: 30,
//                               },
//                             ]}
//                           >
//                             Opponent Team
//                           </Text>
//                         ) : (
//                           ""
//                         )}
//                         {item.openPlayers && item.openPlayers.length > 0
//                           ? item.openPlayers.map((players, pindex) => {
//                               return (
//                                 <View
//                                   key={pindex}
//                                   style={{
//                                     flex: 1,
//                                     paddingHorizontal: 16,
//                                     paddingVertical: 6,
//                                     marginLeft: 26,
//                                   }}
//                                 >
//                                   {players.isCap == "1" ||
//                                   players.isvCap == "1" ? (
//                                     <Text style={styles.cvctxt}>
//                                       {players.isCap == "1"
//                                         ? "C"
//                                         : players.isvCap == "1"
//                                         ? "Vc"
//                                         : ""}
//                                     </Text>
//                                   ) : (
//                                     ""
//                                   )}

//                                   <View style={[styles.plyrprflinfo]}>
//                                     <View style={[styles.plyrprfl]}>
//                                       {players.faceImageId == "" ? (
//                                         <Image
//                                           style={[
//                                             styles.tmsdimg,
//                                             { resizeMode: "contain" },
//                                           ]}
//                                           source={require("../../../assets/images/dummy.png")}
//                                         />
//                                       ) : (
//                                         <Image
//                                           style={[
//                                             styles.tmsdimg,
//                                             { resizeMode: "contain" },
//                                           ]}
//                                           source={{
//                                             uri: `https://cdn.sportmonks.com/images/cricket/players/${players.faceImageId}`,
//                                           }}
//                                         />
//                                       )}
//                                     </View>
//                                     <View>
//                                       <Text
//                                         style={[
//                                           styles.teamnm,
//                                           styles.wnrtxt,
//                                           styles.tmname,
//                                           styles.plyrname,
//                                         ]}
//                                       >
//                                         {players.name}
//                                       </Text>
//                                       <Text
//                                         style={[styles.ortxt, styles.plyrtm]}
//                                       >
//                                         Runs {players.score}{" "}
//                                         {players.isCap == "1"
//                                           ? "x 2"
//                                           : players.isvCap == "1"
//                                           ? "x 1.5"
//                                           : ""}
//                                       </Text>
//                                     </View>
//                                   </View>
//                                 </View>
//                               );
//                             })
//                           : ""}
//                       </View>
//                     </View>
//                   ) : (
//                     ""
//                   )}
//                 </View>
//               );
//             })
//           ) : (
//             <View style={{ marginTop: "50%", zIndex: 222 }}>
//               <Image
//                 source={HistoryEmpty}
//                 style={{
//                   width: "100%",
//                   resizeMode: "contain",
//                   height: 120,
//                   alignSelf: "center",
//                 }}
//               />
//             </View>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default WithProgress(inject("UserStore")(observer(TotalResult)));

//////////////// new chngs static vales for total wins/loasses below code //////////////

import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import {inject, observer} from 'mobx-react';
import WithProgress from '../LoadingOverlay/WithProgress';
import {styles} from './TotalResult.styles';
import Eicon from '../cricketLeague/Imgs/Icons/coin.png';
import CustomButton from '../customComponents/CustomButton';
import {
  HistoryEmpty,
  LooserBG,
  Player,
  TBC,
  ThumbsLoose,
  TotalButton,
  Trophy,
  TrophyBackground,
} from '../../../assets';
import {Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Image} from '@rneui/base';
import AsyncStorage from '@react-native-community/async-storage';
import Services from '../../../Services/Services';
import Functions from '../Functions';
import {secondary} from '../../../style';
import {useFocusEffect} from '@react-navigation/native';
import ReactMoE, {MoEProperties} from 'react-native-moengage';

const MatchType = {
  1: '1',
  2: '5',
  3: '10',
  4: '20',
};

let userPF,
  userInfo,
  totalWin = 0,
  totalLoss = 0,
  status = false,
  winCount = 0,
  lossCount = 0;

const TotalResult = ({navigation, showProgress, hideProgress}) => {
  const [scoreBoard, setScoreBoard] = useState();
  const [historyList, setHistoryList] = useState([]);
  const [wins, setwins] = useState(0);
  const [loss, setloss] = useState(0);
  const [period, setperiod] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      AsyncStorage.setItem('pl6-socket', 'null');
      myHistory('DAY');
      //  myHistory();
    });
    return unsubscribe;
  }, [navigation, totalWin, totalLoss]);

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.navigate('CricketLeague');
          return true;
        },
      );

      return () => {
        backHandler.remove();
      };
    }, []),
  );

  // const myHistory = async () => {
  //   showProgress();
  //   userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
  //   userPF = JSON.parse(await AsyncStorage.getItem("player6-profile"));
  //   Functions.getInstance().checkExpiration(
  //     userInfo.userId,
  //     userInfo.refToken,
  //     navigation
  //   );
  //   Functions.getInstance()
  //     .checkInternetConnectivity()
  //     .then((state) => {
  //       if (state == true) {
  //         Services.getInstance()
  //           .historyData(userInfo.userId, userInfo.accesToken, 'WEEK')
  //           .then((result) => {
  //             console.log(
  //               JSON.stringify("---- HISTRY API DATA -----", result.data)
  //             );
  //             console.log("---- HISTRY API DATA -----", result);
  //             if (result.status == 200) {
  //               setHistoryList(result.data);
  //               setwins(result.winTotal);
  //               setloss(result.loosTotal);
  //               AsyncStorage.setItem("History", JSON.stringify(result.data));
  //               if (result.data.length > 0) {
  //                 fireEventToMoEngage(result.data);
  //               }
  //               if (result.winTotal) {
  //                 totalWin = result.winTotal;
  //                 AsyncStorage.setItem(
  //                   "History-WinTotal",
  //                   String(result.winTotal)
  //                 );
  //               }
  //               if (result.loosTotal) {
  //                 totalLoss = result.loosTotal;
  //                 AsyncStorage.setItem(
  //                   "History-LossTotal",
  //                   String(result.loosTotal)
  //                 );
  //               }
  //             }
  //             hideProgress();
  //           });
  //       } else {
  //         getTotalWin();
  //         getTotalLoss();
  //         Functions.getInstance()
  //           .offlineHistory()
  //           .then((result) => {
  //             setHistoryList(result);
  //           });
  //         hideProgress();
  //       }
  //     });
  // };

  const myHistory = async (period = 'DAY') => {
    try {
      showProgress();
      userInfo = JSON.parse(await AsyncStorage.getItem('player6-userdata'));
      userPF = JSON.parse(await AsyncStorage.getItem('player6-profile'));

      // Map period to corresponding value
      const periodValue = {DAY: 0, WEEK: 1, MONTH: 2, YEAR: 3}[period] || 0;
      setperiod(periodValue);

      const functions = Functions.getInstance();
      const services = Services.getInstance();

      // Check session expiration
      functions.checkExpiration(userInfo.userId, userInfo.refToken, navigation);

      // Check internet connectivity
      const isConnected = await functions.checkInternetConnectivity();

      if (isConnected) {
        try {
          const result = await services.historyData(
            userInfo.userId,
            userInfo.accesToken,
            period,
          );

          console.log('---- HISTORY API DATA -----', result);

          if (result?.status === 200) {
            setHistoryList(result.data);
            setwins(result?.winTotal || 0);
            setloss(result?.loosTotal || 0);
            console.log('---- HISTORY API DATA ----w/l-', result?.winTotal);

            // Store history data only if it's not empty
            if (result.data?.length > 0) {
              AsyncStorage.setItem('History', JSON.stringify(result.data));
              fireEventToMoEngage(result.data);
            }

            // Store Win/Loss data only if present
            if (result?.winTotal) {
              AsyncStorage.setItem('History-WinTotal', String(result.winTotal));
            }
            if (result?.loosTotal) {
              AsyncStorage.setItem(
                'History-LossTotal',
                String(result.loosTotal),
              );
            }
          }
        } catch (error) {
          console.error('History API Error:', error);
        }
      } else {
        getTotalWin();
        getTotalLoss();

        // Fetch offline history data
        const offlineResult = await functions.offlineHistory();
        setHistoryList(offlineResult);
      }
    } catch (error) {
      console.error('myHistory Error:', error);
    } finally {
      hideProgress();
    }
  };

  /////////// performaced code ////

  const getTotalWin = async () => {
    totalWin = await AsyncStorage.getItem('History-WinTotal');
  };
  const getTotalLoss = async () => {
    totalLoss = await AsyncStorage.getItem('History-LossTotal');
  };

  const fireEventToMoEngage = data => {
    data.forEach(element => {
      if (element.winnStatus == '1') {
        winCount = winCount + 1;
      } else {
        lossCount = lossCount + 1;
      }
      ReactMoE.setUserAttribute('Wins', winCount);
      ReactMoE.setUserAttribute('Loses', lossCount);
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.exvw]}>
        <View style={[styles.rm_main, {paddingBottom: 120}]}>
          <View style={[styles.cardView]}>
            <View style={[styles.flexRow]}>
              <CustomButton
                width="45%"
                onPress={() => null}
                btnLabel={`Total Wins`} //${totalWin}
                amt={`${wins}`}
              />
              <CustomButton
                width="45%"
                colour="orange"
                onPress={() => null}
                btnLabel={`Total Losses `} //${totalLoss}
                // amt={`${totalWin}`}
                amt={`${loss}`}
              />
            </View>
          </View>

          <View
            style={{
              marginTop: 70,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              borderBottomWidth: 1,
              borderBottomColor: 'gray',
              paddingBottom: 20,
            }}>
            <TouchableOpacity
              onPress={() => myHistory('DAY')}
              style={[
                stylesLocal.btnActve,
                {backgroundColor: period == 0 ? '#279bff' : '#383838'},
              ]}>
              <Text style={stylesLocal.txtActve}>24 hrs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                stylesLocal.btnActve,
                {backgroundColor: period === 1 ? '#279bff' : '#383838'},
              ]}
              onPress={() => myHistory('WEEK')}>
              <Text style={stylesLocal.txtActve}>1 week</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => myHistory('MONTH')}
              style={[
                stylesLocal.btnActve,
                {backgroundColor: period === 2 ? '#279bff' : '#383838'},
              ]}>
              <Text style={stylesLocal.txtActve}>1 month</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => myHistory('YEAR')}
              style={[
                stylesLocal.btnActve,
                {backgroundColor: period === 3 ? '#279bff' : '#383838'},
              ]}>
              <Text style={stylesLocal.txtActve}>1 Year</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {historyList && historyList.length > 0 ? (
              historyList.map((item, index) => {
                const PriceTyp =
                  item.userOne == userInfo.userId
                    ? item.userOnePriceType
                    : item.userTwoPriceType;
                return (
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => {
                        Functions.getInstance().fireAdjustEvent('nd4sm7');
                        let properties = new MoEProperties();
                        properties.addAttribute('Archived Match tiles', true);
                        ReactMoE.trackEvent('Archived Match tiles', properties);
                        if (status == false) {
                          status = true;
                          setScoreBoard(index);
                        } else {
                          if (index == scoreBoard) {
                            status = false;
                            setScoreBoard();
                          } else {
                            status = true;
                            setScoreBoard(index);
                          }
                        }
                      }}>
                      <View style={styles.container}>
                        <View style={styles.leftContainer}>
                          <Text style={styles.heading}>{item.title}</Text>
                          {/* <Text style={[styles.vsText,{fontSize : 12,bottom : 5}]}>{`₹ ${MatchType[(item.contestId)]}`}</Text> */}
                          <Text style={styles.subHeading}>
                            {Functions.getInstance().HistoryMatchDateTime(
                              item.startTime,
                            )}
                          </Text>

                          <View style={styles.row}>
                            <View style={{marginTop: 10}}>
                              <View style={styles.plyrprfl}>
                                <Image
                                  style={[
                                    styles.image,
                                    styles.mnimg,
                                    {marginTop: 0},
                                  ]}
                                  source={{
                                    uri: item.contOneImg,
                                  }}
                                  onError={e => {
                                    e.target.setNativeProps({
                                      src: [
                                        {
                                          uri: 'https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/dummy.png',
                                        },
                                      ],
                                    });
                                  }}
                                />
                              </View>
                              <Text style={styles.teamName}>
                                {item.contOneSnam}
                              </Text>
                            </View>
                            {PriceTyp === '1' ? (
                              <Text
                                style={[
                                  styles.vsText,
                                  {fontSize: 12, bottom: 5},
                                ]}>
                                ₹ {item.contestPrice}
                              </Text>
                            ) : (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  alignSelf: 'center',
                                  paddingHorizontal: 14,
                                  paddingVertical: 4,
                                  marginHorizontal: 10,
                                  borderRadius: 16,
                                  backgroundColor: '#5B5B5B',
                                }}>
                                <Image
                                  source={Eicon}
                                  style={{
                                    width: 16,
                                    height: 16,
                                    marginRight: 1.6,
                                    marginTop: 1,
                                  }}
                                />
                                <Text
                                  style={[
                                    {
                                      color: 'white',
                                      fontSize: 8,
                                      fontWeight: 'bold',
                                      alignSelf: 'center',
                                      textAlign: 'center',
                                    },
                                    {
                                      fontSize: 12,
                                      //bottom : 5
                                    },
                                  ]}>
                                  {item.contestPrice}
                                </Text>
                              </View>
                            )}

                            {/* <Text style={[styles.vsText,{fontSize : 12,bottom : 5}]}>{`₹ ${item.contestPrice}`} API :{PriceTyp}</Text> */}
                            <View style={{marginTop: 10, marginLeft: 4}}>
                              <View style={styles.plyrprfl}>
                                <Image
                                  style={[
                                    styles.image,
                                    styles.mnimg,
                                    {marginTop: 0},
                                  ]}
                                  source={{
                                    uri: item.contTwoImg,
                                  }}
                                  onError={e => {
                                    e.target.setNativeProps({
                                      src: [
                                        {
                                          uri: 'https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/dummy.png',
                                        },
                                      ],
                                    });
                                  }}
                                />
                              </View>
                              <Text style={styles.teamName}>
                                {item.contTwoSnam}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.rightContainer}>
                          <View style={{flex: 1, paddingVertical: 10}}>
                            <Text style={styles.runs}>
                              {item.userOneScore}/{item.userTwoScore} Runs
                            </Text>

                            {item.winnStatus == '1' &&
                            (item.winnerId == userInfo.userId ||
                              item.winnerId == '0') ? (
                              <View
                                style={[
                                  styles.troffyImage,
                                  {
                                    marginLeft: 50,
                                    marginTop: 5,
                                    marginBottom: 5,
                                  },
                                ]}>
                                <Image
                                  style={styles.rightImage}
                                  source={Trophy}
                                />
                              </View>
                            ) : (
                              <View
                                style={[
                                  styles.troffyImage,
                                  {
                                    marginLeft: 50,
                                    marginTop: 5,
                                    marginBottom: 5,
                                  },
                                ]}>
                                <Image
                                  style={styles.rightImage}
                                  source={ThumbsLoose}
                                />
                              </View>
                            )}
                          </View>
                          <Image
                            style={{
                              height: 60,
                              top: 88,
                              right: 1,
                              width: 40,
                              marginEnd: 2,
                              marginBottom: 2,
                              alignSelf: 'flex-end',
                              resizeMode: 'center',
                              overflow: 'hidden',
                              position: 'absolute',
                            }}
                            source={TrophyBackground}
                          />
                          <View style={{flex: 1, paddingVertical: 10}}>
                            {/* {item.winnStatus == "1" &&
                          (item.winnerId == userInfo.userId ||
                            item.winnerId == "0") ? (
                            <Text style={[styles.amount, { color: secondary }]}>
                              +Rs {item.amount}/-
                            </Text>
                          ) : (
                            <Text style={[styles.amount, { color: "#e79013" }]}>
                              -Rs {item.amount}/-
                            </Text>
                          )} */}

                            {item.winnStatus == '1' &&
                            (item.winnerId == userInfo.userId ||
                              item.winnerId == '0') ? (
                              PriceTyp === '1' ? (
                                <Text
                                  style={[styles.amount, {color: secondary}]}>
                                  +₹{item.amount}/-
                                </Text>
                              ) : (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    bottom: 0,
                                    top: -15,

                                    paddingHorizontal: 14,
                                    paddingVertical: 4,
                                    marginHorizontal: 10,
                                    borderRadius: 16,
                                    //  backgroundColor: "#5B5B5B",
                                  }}>
                                  <Text
                                    style={[
                                      {
                                        color: 'white',
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                      },
                                    ]}>
                                    +₹
                                  </Text>
                                  {/* <Image
                                  source={Eicon}
                                  style={{
                                    width: 16,
                                    height: 16,
                                   // marginRight: 1.6,
                                    marginTop: 1,
                                  }}
                                /> */}
                                  <Text
                                    style={[
                                      {
                                        color: 'white',
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                      },
                                    ]}>
                                    {item.amount}/-
                                  </Text>
                                </View>
                              )
                            ) : PriceTyp === '1' ? (
                              <Text style={[styles.amount, {color: '#e79013'}]}>
                                -₹{item.amount}/-
                              </Text>
                            ) : (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  alignSelf: 'center',
                                  bottom: 0,
                                  top: -15,

                                  paddingHorizontal: 14,
                                  paddingVertical: 4,
                                  marginHorizontal: 10,
                                  borderRadius: 16,
                                  //  backgroundColor: "#5B5B5B",
                                }}>
                                <Text
                                  style={[
                                    {
                                      color: 'white',
                                      fontSize: 12,
                                      fontWeight: 'bold',
                                    },
                                  ]}>
                                  -
                                </Text>
                                <Image
                                  source={Eicon}
                                  style={{
                                    width: 16,
                                    height: 16,
                                    marginRight: 1.6,
                                    marginTop: 1,
                                  }}
                                />
                                <Text
                                  style={[
                                    {
                                      color: 'white',
                                      fontSize: 12,
                                      fontWeight: 'bold',
                                    },
                                  ]}>
                                  {item.amount}/-
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {scoreBoard == index ? (
                      <View
                        style={[
                          styles.cardView,
                          {flexDirection: 'row', paddingRight: 40},
                        ]}>
                        <View style={{maxWidth: '50%'}}>
                          {item.myPlayers && item.myPlayers.length > 0 ? (
                            <Text
                              style={[
                                styles.teamnm,
                                styles.wnrtxt,
                                styles.tmname,
                                styles.plyrname,
                                {color: '#A9A9A9', marginTop: 10},
                              ]}>
                              Your Team
                            </Text>
                          ) : (
                            ''
                          )}
                          {item.myPlayers && item.myPlayers.length > 0
                            ? item.myPlayers.map((players, pindex) => {
                                return (
                                  <View
                                    key={pindex}
                                    style={{
                                      flex: 1,
                                      paddingHorizontal: 16,
                                      paddingVertical: 6,
                                      marginLeft: 26,
                                    }}>
                                    {players.isCap == '1' ||
                                    players.isvCap == '1' ? (
                                      <Text style={styles.cvctxt}>
                                        {players.isCap == '1'
                                          ? 'C'
                                          : players.isvCap == '1'
                                          ? 'Vc'
                                          : ''}
                                      </Text>
                                    ) : (
                                      ''
                                    )}
                                    <View style={[styles.plyrprflinfo]}>
                                      <View style={[styles.plyrprfl]}>
                                        <Image
                                          style={[
                                            styles.tmsdimg,
                                            {resizeMode: 'contain'},
                                          ]}
                                          source={{
                                            uri: `https://player6sports.s3.us-east-1.amazonaws.com/Players/${players.faceImageId}`,
                                          }}
                                          onError={e => {
                                            e.target.setNativeProps({
                                              src: [
                                                {
                                                  uri: 'https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/dummy.png',
                                                },
                                              ],
                                            });
                                          }}

                                          // source={{
                                          //   uri: `https://cdn.sportmonks.com/images/cricket/players/${players.faceImageId}`,
                                          // }}
                                        />
                                      </View>

                                      <View>
                                        <Text
                                          style={[
                                            styles.teamnm,
                                            styles.wnrtxt,
                                            styles.tmname,
                                            styles.plyrname,
                                          ]}>
                                          {players.name}
                                        </Text>

                                        <Text
                                          style={[styles.ortxt, styles.plyrtm]}>
                                          Runs {players.score}{' '}
                                          {players.isCap == '1'
                                            ? 'x 2'
                                            : players.isvCap == '1'
                                            ? 'x 1.5'
                                            : ''}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>
                                );
                              })
                            : ''}
                        </View>
                        <View style={{maxWidth: '50%'}}>
                          {item.openPlayers && item.openPlayers.length > 0 ? (
                            <Text
                              style={[
                                styles.teamnm,
                                styles.wnrtxt,
                                styles.tmname,
                                styles.plyrname,
                                {
                                  color: '#A9A9A9',
                                  marginTop: 10,
                                  paddingLeft: 30,
                                },
                              ]}>
                              Opponent Team
                            </Text>
                          ) : (
                            ''
                          )}
                          {item.openPlayers && item.openPlayers.length > 0
                            ? item.openPlayers.map((players, pindex) => {
                                return (
                                  <View
                                    key={pindex}
                                    style={{
                                      flex: 1,
                                      paddingHorizontal: 16,
                                      paddingVertical: 6,
                                      marginLeft: 26,
                                    }}>
                                    {players.isCap == '1' ||
                                    players.isvCap == '1' ? (
                                      <Text style={styles.cvctxt}>
                                        {players.isCap == '1'
                                          ? 'C'
                                          : players.isvCap == '1'
                                          ? 'Vc'
                                          : ''}
                                      </Text>
                                    ) : (
                                      ''
                                    )}

                                    <View style={[styles.plyrprflinfo]}>
                                      <View style={[styles.plyrprfl]}>
                                        <Image
                                          style={[
                                            styles.tmsdimg,
                                            {resizeMode: 'contain'},
                                          ]}
                                          // source={{
                                          //   uri: `https://cdn.sportmonks.com/images/cricket/players/${players.faceImageId}`,
                                          // }}
                                          source={{
                                            uri: `https://player6sports.s3.us-east-1.amazonaws.com/Players/${players.faceImageId}`,
                                          }}
                                          onError={e => {
                                            e.target.setNativeProps({
                                              src: [
                                                {
                                                  uri: 'https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/dummy.png',
                                                },
                                              ],
                                            });
                                          }}
                                        />
                                      </View>
                                      <View>
                                        <Text
                                          style={[
                                            styles.teamnm,
                                            styles.wnrtxt,
                                            styles.tmname,
                                            styles.plyrname,
                                          ]}>
                                          {players.name}
                                        </Text>
                                        <Text
                                          style={[styles.ortxt, styles.plyrtm]}>
                                          Runs {players.score}{' '}
                                          {players.isCap == '1'
                                            ? 'x 2'
                                            : players.isvCap == '1'
                                            ? 'x 1.5'
                                            : ''}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>
                                );
                              })
                            : ''}
                        </View>
                      </View>
                    ) : (
                      ''
                    )}
                  </View>
                );
              })
            ) : (
              <View style={{marginTop: '50%', zIndex: 222}}>
                <Image
                  source={HistoryEmpty}
                  style={{
                    width: '100%',
                    resizeMode: 'contain',
                    height: 120,
                    alignSelf: 'center',
                  }}
                />
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const stylesLocal = StyleSheet.create({
  btnActve: {
    backgroundColor: '#279bff',
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingHorizontal: 19,
    marginLeft: 10,
    // width: 85,
  },
  txtActve: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'Poppins-Medium',
  },
});

export default WithProgress(inject('UserStore')(observer(TotalResult)));
