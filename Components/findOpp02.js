// all game room glitzzccc bugs fixed




///////////////////////////////////////// v2 below: abv old code if blow code works erase abv code n push ///////////////




import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
  BackHandler,
  AppState,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { WebView } from 'react-native-webview';
import ImageSlider from "./common/ImageSlider";
// import Eicon from "./Imgs/Icons/coin.png";
import Eicon from "../cricketLeague/Imgs/Icons/coin.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { BorderLine, Option1, Option2, Option3 } from "../../../assets";
import { styles } from "./crickLeagueStyles/CricketLeague.style";
import Functions from "../Functions";
import Services from "../../../Services/Services";
import UserStore from "../../stores/UserStore";
import AsyncStorage from "@react-native-community/async-storage";
import EventSource from "react-native-event-source";
import { useSocket } from "../../SocketContext";
import WithProgress from "../LoadingOverlay/WithProgress";
import DowngradePopup from "../customComponents/DowngradePopup";
import MatchBanner from "./MatchBanner";
import { useRoute } from "@react-navigation/native";
import { inject, observer } from "mobx-react";
import ReactMoE, { MoEProperties } from "react-native-moengage";

const getRandomCircleImage = () => {
  const circleImages = [Option3, Option2, Option1];
  const randomIndex = Math.floor(Math.random() * circleImages.length);
  return circleImages[randomIndex];
};

const MatchType = {
  "1": "1",
  "2": "5",
  "3": "10",
  "4": "20",
};

let userInfo,
  allContestFees,
  prevContests,
  selectedUserMatch = {},
  selectedUserContest = {};

const FindOpponent = ({ navigation, showProgress, hideProgress }) => {
  const [selectedItemPrice, setSelectedItemPrice] = useState(null); //Price display by venky
  const [PriceTyp, setPriceTyp] = useState(null);
  const [circleImage, setCircleImage] = useState(getRandomCircleImage());
  const [opEvent, setopEvent] = useState(false);
  const [downGrade, setdownGrade] = useState([]);
  const [currentFees, setCurrentFees] = useState([]);
  const [alert, setAlert] = useState(false);
  const [newGrade, setnewGrade] = useState({});
  const [opp, setOpp] = useState(false);
  const route = useRoute();
  const from = route.params.source; // -- from SCR --> EntryFee 1
  const Price = route.params.PriceType;
  const ContestantType = route.params.ContestantTpye; // BettingPrice
  const DisplayPrice = route.params.BettingPrice;
  const [GAMEid, setGAMEid] = useState(0);
  let newSocket;


    ////////////// new code ////////////
    const [userInfo1, setUserInfo1] = useState(null);


    useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const storedData = await AsyncStorage.getItem("player6-userdata");
          if (storedData) {
            setUserInfo1(JSON.parse(storedData));
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      };
  
      fetchUserInfo();
    }, []);



  
// console.log("-- from SCR -->",from);
// return;


///////////////////////////////////////// new evnt ///////////////////////
  const injectedJavaScript = `
  // Create a new EventSource to listen for server-sent events
  const eventSource = new EventSource('https://apiqa.player6sports.com/1.0/auth/User/191/watchEvents');
  

   eventSource.addEventListener('opnSel', function(event) {
    // Send the received data back to React Native
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'opnSel', data: JSON.parse(event.data) }));
  });

  eventSource.onerror = function(error) {
    console.error('EventSource failed:', error);
    // Optionally send an error message back to React Native
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: 'Error occurred with EventSource' }));
  };
  
  true; // Required for the injected script to execute correctly
`;

  ///////////////venky useeffect///////////
  useEffect(() => {
    // Function to fetch the price from AsyncStorage
    const getPriceFromAsyncStorage = async () => {
      console.log('Price params',Price);
      try {
        const price = await AsyncStorage.getItem("selectedItemPrice");
        const priceType = await AsyncStorage.getItem("selectedItemPriceType");//new
        setPriceTyp(priceType);
      //  setSelectedItemPrice(numericValue);

        // if (price !== null) {
           setSelectedItemPrice(JSON.parse(price));
        //   if (Price === undefined) {
        //     setPriceTyp(priceType)
        //   } else {
        //     setPriceTyp(Price);
        //     // Handle other cases if needed
        //    // console.log(`Price is: ${Price}`);
        //   }

        // }
      } catch (error) {
        console.error("Error fetching price:", error);
      }
    };

    // Fetch price on screen load
    getPriceFromAsyncStorage();

    // Function to delete the price from AsyncStorage
    const deletePriceFromAsyncStorage = async () => {
      try {
        await AsyncStorage.removeItem("selectedItemPrice");
        console.log("Price deleted successfully");
      } catch (error) {
        console.error("Error deleting price:", error);
      }
    };

    // Clean up when the user navigates away from the screen
    const unsubscribe = navigation.addListener("beforeRemove", async () => {
      await deletePriceFromAsyncStorage();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      selectedUserMatch = UserStore.selectedMatch;
      selectedUserContest = UserStore.selectedContest;
      const interval = setInterval(() => {
        setCircleImage(getRandomCircleImage());
      }, 100);
    //  callSocket();

      getData();
      setOpp(true);
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (from == "EntryFee") {
            navigation.navigate("CricketLeague");
            return true;
          } else {
            navigation.navigate("BettingAddMoney");
            return true;
          }
        }
      );

      return () => {
        clearInterval(interval);
        backHandler.remove();
      };
    });

    return () => {
      newSocket.removeAllListeners();
      newSocket.close();
    };
  }, [navigation]);






//////////// new event ////////////////////


// const onMessageGetStatus = async (event) => {
//   const { data: receivedData } = event.nativeEvent;
//  console.log('onMessageGetStatus---Event fun trigs')
//   try {
//     const parsedData = JSON.parse(receivedData);

//     if (parsedData.type === 'opnSel') {
//       console.log('Received innScors data from WebView:', parsedData.data);
//       const opponentData = parsedData.data;
//       await AsyncStorage.setItem("Opn", "true"); // Store opponent status
//       setopEvent(true);
//       UserStore.setopponentSocketData(opponentData); // Set opponent data in store
//       navigation.navigate("GameRoom", { source: "FindOpponent" });

//     }
//   } catch (error) {
//     console.error('Error parsing message from WebView:', error);
//   }
// };

///////////////////////////////////// old code abv, new code is Bug mutple gameRooms join fixed in Below code onMessageGetStatus //////////////////////////////////

//////// with xtra vs rm bug
// const onMessageGetStatus = async (event) => {
//   const { data: receivedData } = event.nativeEvent;
//   try {
//     const parsedData = JSON.parse(receivedData);
//     if (parsedData.type === 'opnSel') {
//       console.log('Received innScors data from WebView:', parsedData.data);
//       // Destructure the parsed data
//       const { contestId, gameId, matchId, userOne, userTwo } = parsedData.data;
//       // Log each property individually
//               // Log each property individually
//       // console.log("📌 contestId:", contestId);
//       // console.log("📌 gameId:", gameId);
//       // console.log("📌 matchId:", matchId);
//       // console.log("📌 userOne:", userOne);
//       // console.log("📌 userTwo:", userTwo);

//       // if (ContestantType === contestId
//       //    && selectedUserMatch.matchId === matchId                 // test it
//       // )
//       if (UserStore.selectedMatch.contestId === contestId &&
//          UserStore.selectedMatch.matchId === matchId      &&           // tested working
//         (userInfo1?.userId === userOne || userInfo1?.userId === userTwo)
//      )
//        {
//         console.log('ContestantType matches contestId. Navigating to GameRoom.');
//         const opponentData = parsedData.data;
//         await AsyncStorage.setItem("Opn", "true"); // Store opponent status
//         setopEvent(true);
//         UserStore.setopponentSocketData(opponentData); // Set opponent data in store
//         navigation.navigate("GameRoom", { source: "FindOpponent" });
//       } else {
//         console.warn("❌ Contest or Match ID does not match. No navigation.");
//       }
//     }
//   } catch (error) {
//     console.error('Error parsing message from WebView:', error);
//   }
// };

///////////////////////////////////////////////////////////////////////////////////////////////





  //////////////////To GAME ROOM////////////////////////////////////////
  /////// one of the interlinked functional code from callsocket() func(): takes opp data from async and socket and compares depending on this this  fun() navigates to a screen///////////
  // const getStatus = async (event) => {
  //   const stat = await AsyncStorage.getItem("Opn"); //checks opp info frm async
  //   const ds = JSON.parse(event.data); //opp data frm socket
  //   console.log("opnSel Event :::: ", ds);
  //   if (
  //     route.name == "FindOpponent" &&
  //     stat == "false" &&
  //     ds.matchId == selectedUserMatch.matchId &&
  //     ds.contestId == selectedUserContest.contestId &&
  //     (ds.userOne == userInfo.userId || ds.userTwo == userInfo.userId)
  //   ) {
  //     AsyncStorage.setItem("Opn", "true"); //abv condition ds vs stat
  //     setopEvent(true);
  //     UserStore.setopponentSocketData(JSON.parse(event.data)); //set opp info to redx
  //     navigation.navigate("GameRoom", { source: "FindOpponent" });
  //   }
  // };

  // const getDownStatus = async (event) => {
  //   const stat = await AsyncStorage.getItem("Opn");
  //   const ds = JSON.parse(event.data);
  //   console.log("opnDownSel Event ::::: ", ds);
  //   if (
  //     route.name == "FindOpponent" &&
  //     stat == "false" &&
  //     ds.matchId == selectedUserMatch.matchId &&
  //     ((ds.userOne == userInfo.userId &&
  //       ds.userOneContId == selectedUserContest.contestId) ||
  //       (ds.userTwo == userInfo.userId &&
  //         ds.userTwoContId == selectedUserContest.contestId))
  //   ) {
  //     AsyncStorage.setItem("Opn", "true");
  //     setopEvent(true);
  //     UserStore.setopponentSocketData(JSON.parse(event.data));
  //     navigation.navigate("GameRoom", { source: "FindOpponent" });
  //   }
  // };

  // const getDownGradeList = async (event) => {
  //   const ds = JSON.parse(event.data);
  //   console.log("Down Grade Event :::: ", ds);
  //   if (
  //     route.name == "FindOpponent" &&
  //     ds.matchId == selectedUserMatch.matchId
  //   ) {
  //     const f_dgrade1 = ds.options.filter((val) => !prevContests.includes(val));
  //     const f_dgrade2 = f_dgrade1.filter(
  //       (item) => Number(item) < Number(selectedUserContest.contestId)
  //     );
  //     console.log(f_dgrade2);
  //     setdownGrade(f_dgrade2);
  //     filterContestPrices(allContestFees, f_dgrade2);
  //   }
  // };



//////////////// v1 /.//////////
  // const onMessageGetStatus = async (event) => {
  //   const { data: receivedData } = event.nativeEvent;
  
  //   try {
  //     const parsedData = JSON.parse(receivedData);
  
  //     if (parsedData.type === "opnSel") {
  //       console.log("Received innScors data from WebView:", parsedData.data);
  
  //       // Destructure the parsed data
  //       const { contestId, gameId, matchId, userOne, userTwo } = parsedData.data;
  
  //       // New logic for contestId check (including reverse conditions)
  //       // const isContestValid =
  //       //   UserStore.selectedMatch.contestId == "10"
  //       //     ? contestId == "10" || contestId == "2"
  //       //     : UserStore.selectedMatch.contestId === "2"
  //       //     ? contestId == "2" || contestId == "10"
  //       //     : UserStore.selectedMatch.contestId == "1"
  //       //     ? contestId == "1" || contestId == "9"
  //       //     : UserStore.selectedMatch.contestId == "9"
  //       //     ? contestId == "9" || contestId == "1"
  //       //     : UserStore.selectedMatch.contestId == contestId;


  //       const isContestValid =
  //       UserStore.selectedMatch.contestId == "10"
  //         ? contestId == "10" || contestId == "2"
  //         : UserStore.selectedMatch.contestId === "2"
  //         ? contestId == "2" || contestId == "10"
  //         : UserStore.selectedMatch.contestId == "1"
  //         ? contestId == "1" || contestId == "9"
  //         : UserStore.selectedMatch.contestId == "9"
  //         ? contestId == "9" || contestId == "1"
  //         : UserStore.selectedMatch.contestId == contestId
          


  
  //       if (
  //         isContestValid &&
  //         UserStore.selectedMatch.matchId === matchId &&
  //         (userInfo1?.userId === userOne || userInfo1?.userId === userTwo)
  //       ) {
  //         console.log("✅ Contest & Match ID matched. Navigating to GameRoom.");
  //         const opponentData = parsedData.data;
  
  //         await AsyncStorage.setItem("Opn", "true"); // Store opponent status
  //         setopEvent(true);
  //         UserStore.setopponentSocketData(opponentData); // Set opponent data in store
  //         navigation.navigate("GameRoom", { source: "FindOpponent" });
  //       } else {
  //         console.warn("❌ Contest or Match ID does not match. No navigation.");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error parsing message from WebView:", error);
  //   }
  // };




  ///////////// v2 ////////////////////// working //
  // const onMessageGetStatus = async (event) => {
  //   const { data: receivedData } = event.nativeEvent;
  
  //   try {
  //     const parsedData = JSON.parse(receivedData);
  
  //     if (parsedData.type == "opnSel") {
  //     //  console.log("Received innScors data from WebView:", parsedData.data);
  
  //       // Destructure the parsed data
  //       const { contestId, gameId, matchId, userOne, userTwo } = parsedData.data;
  
  //       // Ensure contestId is treated as a string
  //       const contestIdStr = String(contestId);
  //       const selectedContestIdStr = String(UserStore.selectedMatch.contestId);
  //       const selectedMatchIdStr = String(UserStore.selectedMatch.matchId);
  
  //       // New logic for contestId check (including reverse conditions)
  //       const isContestValid =
  //         selectedContestIdStr == "10"
  //           ? contestIdStr == "10" || contestIdStr == "2"
  //           : selectedContestIdStr == "2"
  //           ? contestIdStr == "2" || contestIdStr == "10"
  //           : selectedContestIdStr == "1"
  //           ? contestIdStr == "1" || contestIdStr == "9"
  //           : selectedContestIdStr == "9"
  //           ? contestIdStr == "9" || contestIdStr == "1"
  //           : selectedContestIdStr == "3"
  //           ? contestIdStr == "3" || contestIdStr == "11"
  //           : selectedContestIdStr == "11"
  //           ? contestIdStr == "11" || contestIdStr == "3"
  //           : selectedContestIdStr == "4"
  //           ? contestIdStr == "4" || contestIdStr == "12"
  //           : selectedContestIdStr == "12"
  //           ? contestIdStr == "12" || contestIdStr == "4"
  //           : selectedContestIdStr == "5"
  //           ? contestIdStr == "5" || contestIdStr == "13"
  //           : selectedContestIdStr == "13"
  //           ? contestIdStr == "13" || contestIdStr == "5"
  //           : selectedContestIdStr == "6"
  //           ? contestIdStr == "6" || contestIdStr == "14"
  //           : selectedContestIdStr == "14"
  //           ? contestIdStr == "14" || contestIdStr == "6"
  //           : selectedContestIdStr == "7"
  //           ? contestIdStr == "7" || contestIdStr == "15"
  //           : selectedContestIdStr == "15"
  //           ? contestIdStr == "15" || contestIdStr == "7"
  //           : selectedContestIdStr == "8"
  //           ? contestIdStr == "8" || contestIdStr == "16"
  //           : selectedContestIdStr == "16"
  //           ? contestIdStr == "16" || contestIdStr == "8"
  //           : selectedContestIdStr == contestIdStr;
  
  //       if (
  //         isContestValid &&
  //         selectedMatchIdStr == matchId &&
  //         (userInfo1?.userId == userOne || userInfo1?.userId == userTwo)
  //       ) {
  //         console.log("✅ Contest & Match ID matched. Navigating to GameRoom.");
  //         const opponentData = parsedData.data;
  
  //         await AsyncStorage.setItem("Opn", "true"); // Store opponent status
  //         setopEvent(true);
  //         UserStore.setopponentSocketData(opponentData); // Set opponent data in store
  //         navigation.navigate("GameRoom", { source: "FindOpponent" });
  //       } else {
  //         console.warn("❌ Contest or Match ID does not match. No navigation.");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error parsing message from WebView:", error);
  //   }
  // };
  
  
  // const onMessageGetStatus = async (event) => {
  //   const { data: receivedData } = event.nativeEvent;
  
  //   try {
  //     const parsedData = JSON.parse(receivedData);
  
  //     if (parsedData.type == "opnSel") {
  //       // Destructure the parsed data
  //       const { contestId, gameId, matchId, userOne, userTwo } = parsedData.data;
  
  //       // Log all values from parsedData.data and other important fields
  //       console.log("Parsed Data (parsedData.data):", {
  //         contestId,
  //         gameId,
  //         matchId,
  //         userOne,
  //         userTwo,
  //       });
  //       console.log("Selected Match ID (selectedMatchIdStr):", UserStore.selectedMatch.matchId);
  //       console.log("User ID (userInfo1?.userId):", userInfo1?.userId);
  //       console.log("selectedContestId:", String(UserStore.selectedMatch.contestId));
  
  //       // Ensure contestId is treated as a string
  //       const contestIdStr = String(contestId);
  //       const selectedContestIdStr = String(UserStore.selectedMatch.contestId);
  //       const selectedMatchIdStr = String(UserStore.selectedMatch.matchId);
  
  //       // New logic for contestId check (including reverse conditions)
  //       const isContestValid =
  //         selectedContestIdStr == "10"
  //           ? contestIdStr == "10" || contestIdStr == "2"
  //           : selectedContestIdStr == "2"
  //           ? contestIdStr == "2" || contestIdStr == "10"
  //           : selectedContestIdStr == "1"
  //           ? contestIdStr == "1" || contestIdStr == "9"
  //           : selectedContestIdStr == "9"
  //           ? contestIdStr == "9" || contestIdStr == "1"
  //           : selectedContestIdStr == "3"
  //           ? contestIdStr == "3" || contestIdStr == "11"
  //           : selectedContestIdStr == "11"
  //           ? contestIdStr == "11" || contestIdStr == "3"
  //           : selectedContestIdStr == "4"
  //           ? contestIdStr == "4" || contestIdStr == "12"
  //           : selectedContestIdStr == "12"
  //           ? contestIdStr == "12" || contestIdStr == "4"
  //           : selectedContestIdStr == "5"
  //           ? contestIdStr == "5" || contestIdStr == "13"
  //           : selectedContestIdStr == "13"
  //           ? contestIdStr == "13" || contestIdStr == "5"
  //           : selectedContestIdStr == "6"
  //           ? contestIdStr == "6" || contestIdStr == "14"
  //           : selectedContestIdStr == "14"
  //           ? contestIdStr == "14" || contestIdStr == "6"
  //           : selectedContestIdStr == "7"
  //           ? contestIdStr == "7" || contestIdStr == "15"
  //           : selectedContestIdStr == "15"
  //           ? contestIdStr == "15" || contestIdStr == "7"
  //           : selectedContestIdStr == "8"
  //           ? contestIdStr == "8" || contestIdStr == "16"
  //           : selectedContestIdStr == "16"
  //           ? contestIdStr == "16" || contestIdStr == "8"
  //           : selectedContestIdStr == contestIdStr;
  
  //       if (
  //         isContestValid &&
  //         selectedMatchIdStr == matchId &&
  //         (userInfo1?.userId == userOne || userInfo1?.userId == userTwo)
  //       ) {
  //         console.log("✅ Contest & Match ID matched. Navigating to GameRoom.");
  //         const opponentData = parsedData.data;
  
  //         await AsyncStorage.setItem("Opn", "true"); // Store opponent status
  //         setopEvent(true);
  //         UserStore.setopponentSocketData(opponentData); // Set opponent data in store
  //         navigation.navigate("GameRoom", { source: "FindOpponent" });
  //       } else {
  //         console.warn("❌ Contest or Match ID does not match. No navigation.");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error parsing message from WebView:", error);
  //   }
  // };f

  // console.log("🚀 ~ file: FindOpponent.js:26 ~ UserStore.selectedMatch ~ game id:", UserStore.selectedMatch);
  



  const onMessageGetStatus = async (event) => {
    const { data: receivedData } = event.nativeEvent;
  
    try {
      const parsedData = JSON.parse(receivedData);
  
      if (parsedData.type === "opnSel") {
        const { contestId, gameId, matchId, userOne, userTwo } = parsedData.data;
  
        console.log("Parsed Data (parsedData.data):", {
          contestId,
          gameId,
          matchId,
          userOne,
          userTwo,
        });
  
        const isGameIdValid = GAMEid !== 0 ? parseInt(gameId) === parseInt(GAMEid) : parseInt(gameId) === parseInt(UserStore.selectedMatch.gameId);
        // console.log("GAMEid ---:", GAMEid);
        // console.log("parsed gameId :", gameId);
  
        if (
          // parseInt(GAMEid) === parseInt(gameId)
          isGameIdValid
        ) {
          console.log("✅ Contest & Match ID matched. Navigating to GameRoom.", );
          
          const opponentData = parsedData.data;
          
          await AsyncStorage.setItem("Opn", "true"); // Store opponent status
          setopEvent(true);
          UserStore.setopponentSocketData(opponentData); // Set opponent data in store
          navigation.navigate("GameRoom", { source: "FindOpponent" });
        } else {
          console.warn("❌ Contest or Match ID does not match. No navigation.",);
        }
      }
    } catch (error) {
      console.error("Error parsing message from WebView:", error);
    }
  };
  



  const getData = async () => {
    showProgress();
    AsyncStorage.setItem("Opn", "false");
    userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
    prevContests = JSON.parse(await AsyncStorage.getItem("prev-contests"));
    console.log("Prev Contest :   ", prevContests);
    Functions.getInstance().checkExpiration(
      userInfo.userId,
      userInfo.refToken,
      navigation
    );
    Functions.getInstance()
      .checkInternetConnectivity()
      .then((state) => {
        if (state == true) {
          const obj = {
            matchId: selectedUserMatch.matchId,
            contestId: ContestantType, // selectedUserContest.contestId,  //Price
            priceType: Price,
          };
          console.log("obj API findAnOpponent::::::::::", obj);
          //   Services.getInstance().findAnOpponent(obj, userInfo.userId, selectedUserMatch.matchId, selectedUserContest.contestId, userInfo.accesToken).then((result)=>{
          Services.getInstance()
            .findAnOpponent(
              obj,
              userInfo.userId,
              selectedUserMatch.matchId,
              ContestantType,
              userInfo.accesToken
            )
            .then((result) => {
              console.log(
                "FindOpponentJS screen contestCreate api response: ",
                JSON.stringify(result)
              );
              if (result.status === 401 && result.error === 'Low wallet Balance') {
                Functions.getInstance().Toast("error", JSON.stringify(result.error));
                // Navigate back to the previous screen
               // navigation.goBack();
              }
              else if (result.status === 200) {
                getwalletDetails(
                  19.209340872820388,
                  72.87764686564747,
                  userInfo.userId,
                  userInfo.accesToken
                );
                setGAMEid(result.gameId);  // only wen this api is success..!
              }
              hideProgress();
              return
            //  Functions.getInstance().Toast("error", JSON.stringify(result)); //debuging in real device
            });
            

          Services.getInstance()
            .getAllDownGrades(
              obj,
              userInfo.userId,
              selectedUserMatch.matchId,
              userInfo.accesToken
            )
            .then((result) => {
              if (result.status == 200) {
                setdownGrade(result.msg);
                const f_dgrade1 = result.msg.filter(
                  (val) => !prevContests.includes(val)
                );
                const f_dgrade2 = f_dgrade1.filter(
                  (item) => Number(item) < Number(selectedUserContest.contestId)
                );
                filterContestPrices(allContestFees, f_dgrade2);
                hideProgress();
              } else {
                hideProgress();
              }
            });
        }
      });
  };



  
  const getwalletDetails = async (lat, lng, usrId, accssTokn) => {
    showProgress();
    try {
      const obj = {
        lat: lat,
        lng: lng,
        page: "game room entry",
      };
      console.log("verify location from findOpponent.js", obj);
      const result = await Services.getInstance().verifyLocation(
        usrId,
        accssTokn,
        obj
      ); 
      // console.log('--LOCATION lat longt  api----', result); //walletBal
      // console.log('--LOCATION lat longt  api---findOpponent.js -', result.walletBal);
      UserStore.setWalletBalc(result.walletBal);
      await AsyncStorage.setItem('userWallet', JSON.stringify(result.walletBal)); //added by venky
    } catch (error) {
      if (__DEV__) {
        console.error("Error verifying location:", error);
      }
    } finally {
      hideProgress();
    }
  };

  const filterContestPrices = (fees, dgrade) => {
    if (dgrade && dgrade.length > 0) {
      let x = [];
      fees.forEach((element) => {
        if (element.matchType == selectedUserMatch.matchType) {
          for (let i = 0; i < dgrade.length; i++) {
            if (element.contType == dgrade[i]) {
              x.push(element);
              return x;
            }
          }
        }
      });
      setCurrentFees(x);
      hideProgress();
    } else {
      console.log("no down");
    }
  };

  const switchContest = (data) => {
    setAlert(true);
    setnewGrade(data);
  };

  const onClose = () => {
    setAlert(false);
  };

  const onYes = () => {
    showProgress();
    const obj = {
      matchId: selectedUserMatch.matchId,
      contestId: selectedUserContest.contestId,
      newContestId: newGrade.contType,
    };
    Services.getInstance()
      .updateDownGrades(
        obj,
        userInfo.userId,
        selectedUserMatch.matchId,
        selectedUserContest.contestId,
        userInfo.accesToken
      )
      .then((result) => {
        if (result.status == 200) {
          setAlert(false);
          hideProgress();
          let date = new Date();
          let properties = new MoEProperties();
          properties.addAttribute("Match", selectedUserMatch.title);
          properties.addAttribute("Contest", selectedUserContest.price);
          properties.addAttribute("Date", date.toLocaleDateString());
          properties.addAttribute("Time", date.toLocaleTimeString());
          ReactMoE.trackEvent("Downgrade Tile", properties);
        } else {
          hideProgress();
          setAlert(false);
          Functions.getInstance().Toast("error", result.error);
        }
      });
  };

  const renderContestContent = (imageName, content) => {
    return (
      <View style={styles.opslcnitem}>
        <View style={styles.slcnprfl}>
          <Image style={styles.prflimg} source={imageName} />
        </View>
        <Text style={[styles.chstxt, styles.slcntxt]}>{content}</Text>
      </View>
    );
  };

  const getDownGrade = () => {
    return (
      <View style={[styles.opponent, styles.opmn, { marginBottom: 30 }]}>
        <View style={styles.cntstmain}>
          <Text style={[styles.chstxt, styles.slctd]}>
            Opponent is available below
          </Text>
          {currentFees && currentFees.length > 0
            ? currentFees.map((data, index) => {
                return (
                  <Pressable
                    onPress={() => switchContest(data)}
                    key={index}
                    style={{ marginBottom: 10 }}
                  >
                    <View style={styles.opslavlbl}>
                      <View style={styles.opslblw}>
                        <Text style={styles.opslfee}>Each Run</Text>
                        <Text style={styles.opslrepe}>{`₹${
                          MatchType[data.contType]
                        }`}</Text>
                      </View>
                      <View style={styles.opslonlne}>
                        <Text style={styles.opslmdl}>1 Online</Text>
                      </View>
                      <View style={styles.opslblww}>
                        <Text style={styles.opslfee}>Entry Fee</Text>
                        <Text style={styles.opslrepe}>₹ {data.price}</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })
            : ""}
        </View>
      </View>
    );
  };

  return !opp ? null :
   (
    <SafeAreaView style={styles.root}>
      <StatusBar backgroundColor="#111111" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <MatchBanner selectedUserMatch={selectedUserMatch} />
        <View style={[styles.mainContainer, {marginTop: -6}]}>
       
          {/* <Pressable onPress={()=>navigation.navigate('GameRoom')}>
                    <Text style={[styles.headingText, styles.ennum]}>Dummy GameRoom</Text>
                </Pressable> */}

          <View style={[styles.opponent, styles.opmn]}>
            <View style={styles.cntstmain}>
              {/* <Text style={[styles.chstxt, styles.slctd]}>Finding You An Opponent For Contest {`₹${MatchType[(selectedUserContest.contestId)]}`}</Text> */}
              {/* <Text style={[styles.chstxt, styles.slctd]}>Finding You An Opponent For Contest {`₹${selectedItemPrice}`}</Text> */}
              <Text style={[styles.chstxt, styles.slctd]}>
                Finding You An Opponent..
                {" "}

              
              </Text>

              <View style={styles.opslcn}>
                {renderContestContent(Option2, "You")}
                <View style={styles.dotp}>
                  <Image style={styles.dotimg} source={BorderLine} />
                </View>
                {renderContestContent(circleImage, "Your Opponent")}
              </View>
              <Text style={[styles.chstxt, styles.slctd]}>Waiting Room...</Text>
            </View>
          </View>

          {currentFees && currentFees.length > 0 ? (
            <View>{getDownGrade()}</View>
          ) : (
            ""
          )}

          {alert ? <DowngradePopup onClose={onClose} onYes={onYes} /> : ""}
        </View>
      </ScrollView>

      <WebView
        source={{ html: '<html><body></body></html>' }} // Load an empty HTML page
        javaScriptEnabled={true}
        injectedJavaScript={injectedJavaScript}
        onMessage={onMessageGetStatus}
        style={{ width: 0,
          height: 0,
          opacity: 0, }} // Hide the WebView
      />
    </SafeAreaView>
  );
};

export default WithProgress(inject("UserStore")(observer(FindOpponent)));

