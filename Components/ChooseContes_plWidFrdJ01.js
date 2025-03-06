

/////////////////////////////////////// new code: Performance based ///////////////////////////////////////////////// Venky!


// removed unwanted api calls pl11etc.. added async prices list cums only once frm api then frm async , real code abv, test it if works then delete abv code
// Banner postition fixed
// join is working




import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  StatusBar,
  BackHandler,
  ImageBackground,
  AppState,
  Image,
  Switch,
  StyleSheet,
} from "react-native";
import Eicon from "./Imgs/Icons/coin.png";
import Eicon2 from "./Imgs/Icons/coinSec.png";
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"; //reanimated
import Icons from "react-native-vector-icons/FontAwesome5";
import IconsEncpto from "react-native-vector-icons/Entypo";
import ExtrIcon from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from "react";
import ImageSlider from "./common/ImageSlider";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./crickLeagueStyles/CricketLeague.style";
import MatchesList from "./common/MatchesList";
import WithProgress from "../LoadingOverlay/WithProgress";
import Geolocation from "@react-native-community/geolocation";
import Functions from "../Functions";
import AsyncStorage from "@react-native-community/async-storage";
import Popup from "../customComponents/Popup";
import UserStore from "../../stores/UserStore";
import Services from "../../../Services/Services";
import RestrictedLocation from "../customComponents/RestrictedLocation";
import MatchBanner from "./MatchBanner";
import InsufficientWallet from "../customComponents/InsufficientWallet";
import GameRulesPopup from "../customComponents/GameRulesPopup";
import ReactMoE, { MoEProperties } from "react-native-moengage";
import KycPendingPopup from "../customComponents/KycPendingPopup";
import { CrossImage } from "../../../assets";
import CustomTextInput from "../customComponents/CustomTextInput";
import { isLocationEnabled, promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';


let userInfo,
  selectedMatch,
  contestPriceNew = 0; //////pending varible/////
const ChooseContest = ({ navigation, showProgress, hideProgress }) => {
  const textsize = useSharedValue(0); //reanimetd
  const handlePressWidthAnimated = () => {
    textsize.value = withTiming(80, { duration: 600 });
  };
  const [selectedContest, setSelectedContest] = useState("");
  const [useCoins, setUseCoins] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false); //Venky
  const [priceType, setpriceType] = useState("1");
  const [bettingPrice, setbettingPrice] = useState(0);
  const [contestantType, setcontestantType] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  // const [contestPrices, setcontestPrices] = useState(
  //   [
  //   { contestId: 1, price: 25 },
  //   { contestId: 2, price: 50 },
  //   { contestId: 3, price: 100 },
  //   { contestId: 4, price: 250 },  playWithFriend

  // ]);
  const [contestPrices, setcontestPrices] = useState(null);
  const [priceList, setpriceList] = useState([]);
  const [coinList, setcoinList] = useState([]);
  const [frndList, setfrndList] = useState([]);
  const [inputValue, setInputValue] = useState(""); //Join a frnd code
  const [upcomingMatches, setupcomingMatches] = useState([]);
  const [askLocation, setaskLocation] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [insufficient, setInsufficient] = useState(false); /////// low balc indica
  const [gameRules, setGameRules] = useState(false);
  const [prevContests, setprevContests] = useState([]);
  const [kycPending, setkycPending] = useState(false);
  const [maxReturn, setMaxReturn] = useState("");
  const [maxRunDiff, setRunDiff] = useState(""); //returns amnt
  const [playwithFrnd, setplaywithFrnd] = useState(false);
  const [joinwithFrnd, setjoinwithFrnd] = useState(false);

  // /////////////frndList sample /////////////////
  // LOG  frndLst : [{"contType": "21", "matchType": "1", "maxDiff": "0", "price": "0", "priceId": "22", "priceType": "0", "returnAmount": "0", "sequence": "0", "winningAmount": "0"}]

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState); //venky
    setSelectedContest("");
    if (isEnabled) {
      setcontestPrices(priceList);
      setpriceType("1");
    } else {
      setcontestPrices(coinList);
      setpriceType("2");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      selectedMatch = UserStore.selectedMatch;
      getData();
     // callPlayer11Data(); //uncomnt
    });
    // Timeout to check if the contestPrices state is set after 1 second
    const slowInternetTimeout = setTimeout(() => {
      if (contestPrices === null) {
        console.log("Slow internet");
      }
    }, 3000);

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );

    return () => {
      clearTimeout(slowInternetTimeout);
      unsubscribe();
      backHandler.remove();
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [navigation]);

  const getData = async () => {
    showProgress();
    userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
    AsyncStorage.setItem("Opn", "null");
    Functions.getInstance().checkInternetConnectivity();
    Functions.getInstance().checkExpiration(
      userInfo.userId,
      userInfo.refToken,
      navigation
    );
    Functions.getInstance()
      .offlineUpComingMatches()
      .then((result) => {
        setupcomingMatches(result);
      });
    console.log(userInfo.accesToken);
    Services.getInstance()
      .previousContests(
        userInfo.userId,
        selectedMatch.matchId,
        userInfo.accesToken
      )
      .then((result) => {
        console.log("Previous contest", result); // output => {"msg": ["1"], "status": 200}
        AsyncStorage.setItem("prev-contests", JSON.stringify(result.msg));
        setprevContests(result.msg);
        hideProgress();
      });
    fetchAndSetContestPrices(userInfo, setcontestPrices, setpriceList, setcoinList, setfrndList);
  };




const fetchAndSetContestPrices = async (userInfo, setcontestPrices, setpriceList, setcoinList, setfrndList) => {
  const cacheKey = "contestPricesData";

  try {
    // Check if data is already stored in AsyncStorage
    const cachedData = await AsyncStorage.getItem(cacheKey);

    if (cachedData) {
      // Parse and set the cached data
      const { prices, extraPrices, playWithFriend } = JSON.parse(cachedData);
      console.log("Using cached contest prices data:", cachedData);

      setcontestPrices(prices); // Main array to DISPLAY
      setpriceList(prices);
      setcoinList(extraPrices);
      setfrndList(playWithFriend);
    } else {
      // Fetch data from the API if not cached
      const response = await Services.getInstance().getAllContestPrices(
        userInfo.userId,
        userInfo.accesToken
      );
      console.log("---new contest prices------frnd:", response);

      // Destructure the API response to extract prices
      const { prices, extraPrices, playWithFriend } = response;
      console.log("frndLst:", playWithFriend);

      setcontestPrices(prices); // Main array to DISPLAY
      setpriceList(prices);
      setcoinList(extraPrices);
      setfrndList(playWithFriend);

      // Store the API response in AsyncStorage for future use
      await AsyncStorage.setItem(
        cacheKey,
        JSON.stringify({ prices, extraPrices, playWithFriend })
      );
    }
  } catch (error) {
    console.error("Error fetching or storing contest prices data:", error);
  }
};


  const storePriceInAsyncStorage = async (price, pricetype) => {
    try {
      await AsyncStorage.setItem("selectedItemPrice", JSON.stringify(price));
      await AsyncStorage.setItem(
        "selectedItemPriceType",
        JSON.stringify(pricetype)
      );
      console.log("Price stored successfully in ASYNC scr: choosecontestJS");
    } catch (error) {
      console.error("Error storing price:", error);
    }
  };

  const userSelectedItem = async (item) => {
    console.log("ITEM--", item.priceId, selectedMatch.matchType);
    showProgress();
    setSelectedContest(item);
    UserStore.setselectedContest(item);
    AsyncStorage.setItem("selected-game-match", JSON.stringify(selectedMatch));
    AsyncStorage.setItem("selected-game-contest", JSON.stringify(item));
    if (item.contestId == 1) {
      //priceId
      Functions.getInstance().fireAdjustEvent("v2x2e0");
      Functions.getInstance().fireFirebaseEvent("ContestRs1");
      let properties = new MoEProperties();
      properties.addAttribute("₹1", true);
      ReactMoE.trackEvent("Contest tier", properties);
    }
    if (item.contestId == 2) {
      Functions.getInstance().fireAdjustEvent("nvaoo6");
      Functions.getInstance().fireFirebaseEvent("ContestRs5");
      let properties = new MoEProperties();
      properties.addAttribute("₹5", true);
      ReactMoE.trackEvent("Contest tier", properties);
    }
    if (item.contestId == 3) {
      Functions.getInstance().fireAdjustEvent("ngc4ay");
      Functions.getInstance().fireFirebaseEvent("ContestRs10");
      let properties = new MoEProperties();
      properties.addAttribute("₹10", true);
      ReactMoE.trackEvent("Contest tier", properties);
    }
    if (item.contestId == 4) {
      Functions.getInstance().fireAdjustEvent("ifj89x");
      Functions.getInstance().fireFirebaseEvent("ContestRs20");
      let properties = new MoEProperties();
      properties.addAttribute("₹20", true);
      ReactMoE.trackEvent("Contest tier", properties);
    }
    Services.getInstance()
      .getEntryFees(
        userInfo.userId,
        userInfo.accesToken,
        //  item.contestId,  //priceId
        item.contType,
        item.matchType,
        item.priceType
        //  isEnabled? "1" : "2"
      )
      .then((result) => {
        console.log("slelected Item API respo", result);
        setMaxReturn(result.winningAmount);
        setRunDiff(result.returnAmount);
        setcontestantType(item.contType);
        setbettingPrice(item.price);
        contestPriceNew = item.price;
        hideProgress();
      });
  };

  const renderContestContent = (item, setContest) => {
    return (
      <TouchableOpacity
        key={item.contestId}
        disabled={prevContests.includes(String(item.contType))}
        style={[
          prevContests.includes(String(item.contType))
            ? [styles.contestItem, { backgroundColor: "#525151" }]
            : selectedContest?.contType === item.contType
            ? styles.activeContestItem
            : styles.contestItem,
          item.isDisabled && styles.disabled,
        ]}
        onPress={() => userSelectedItem(item)}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {isEnabled ? (
            <Image
              source={Eicon}
              style={{ width: 16, height: 16, marginRight: 1.6, marginTop: 1 }}
            />
          ) : (
            <Text
              style={[
                selectedContest?.contType === item.contType
                  ? styles.activeContestText
                  : styles.contestText,
              ]}
            >
              ₹
            </Text>
          )}
          <Text
            style={[
              selectedContest?.contType === item.contType
                ? styles.activeContestText
                : styles.contestText,
            ]}
          >
            {item.price}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };



    // Function to prompt user to enable location services
    const enableLocation = async () => {
      if (Platform.OS === 'android') {
        try {
          const result = await promptForEnableLocationIfNeeded();
          console.log('Enable Location Result:', result);
          if (result === 'enabled' || result === 'already-enabled') {
          //  setLocationStatus('Location is Enabled');
          }
        } catch (error) {
          console.error('Error enabling location:', error.message);
          // functionsInstance.Toast(
          //   "error",
          //   error.message
          // );
          if (error.message === ERR00) {

          //  setLocationStatus('User canceled enabling location');
          } else {
           // setLocationStatus('Error enabling location');
          }
        }
      } else {
       // setLocationStatus('Not supported on this platform');
      }
    };

  ///////// new single code ////
  const handleLocationAndContest = async () => {
    const functionsInstance = Functions.getInstance();
    const moEProperties = new MoEProperties(); // Common properties for MoEngage

    functionsInstance.fireAdjustEvent("5mu6ml");
    functionsInstance.fireFirebaseEvent("ChooseYourContest");

    if (!selectedContest) {
      hideProgress();
      functionsInstance.Toast("error", "Select a contest from the list");
      return;
    }

    try {
      // Request location permission
      const locationPermission = await functionsInstance.requestLocationPermission();
      moEProperties.addAttribute("location tracking Prompt", true);
      ReactMoE.trackEvent("Choose your Contest", moEProperties);

      if (locationPermission) {
        showProgress();

        // Get geolocation if latitude is not already set
        if (!latitude) {
          Geolocation.getCurrentPosition(
            async (position) => {
              const { latitude: lat, longitude: lng } = position.coords;

              if (lat !== latitude || lng !== longitude) {
                setLatitude(lat);
                setLongitude(lng);
              }
              await verifyAndProcessContest(lat, lng);
            },
            (error) => {
              hideProgress();
              console.error("Error getting geolocation: ", error.message);
              enableLocation();
              // functionsInstance.Toast(
              //   "error",
              //   "Please enable your device location"
              // );
            },
            { timeout: 15000 }
          );
        } else {
          await verifyAndProcessContest(latitude, longitude);
        }
      }
    } catch (error) {
      console.error("Error in location or contest handling: ", error);
    }
  };



  const verifyAndProcessContest = async (lat, lng) => {
    const functionsInstance = Functions.getInstance(); // Reuse the instance
    const moEProperties = new MoEProperties(); // Properties for MoEngage events
    moEProperties.addAttribute("Choose your contest", true);
    ReactMoE.trackEvent("Match tile", moEProperties);

    showProgress();

    try {
      const obj = {
        lat: lat,
        lng: lng,
        page: "game room entry",
      };

      const result = await Services.getInstance().verifyLocation(
        userInfo.userId,
        userInfo.accesToken,
        obj
      ); 
      console.log('--Loc at PLAY NOW api----', result);
      if (result.aadhaarVerify == "0") {
        Functions.getInstance().Toast("error", "Please complete address verification first"); //debuging in real device
        AsyncStorage.setItem("kyc-type", "Adhar");
        UserStore.setkycBtnTitle("Okay");
        navigation.navigate('KYC', { 
          screen: 'KycPage',
          params: {require : "Adhar"}
        });
        hideProgress();
        return
      }
       

      // Check for insufficient balance based on priceType
      if (
        selectedContest.priceType == "1" &&
        parseInt(result.walletBal) < contestPriceNew
      ) {
        setInsufficient(true);
      } else if (
        selectedContest.priceType == "2" &&
        parseInt(result.extraBal) < contestPriceNew
      ) {
        setInsufficient(true);
      } else if (
        selectedContest.priceType == "1" &&
        parseInt(result.walletBal) >= contestPriceNew
      ) {
        //  console.log('--cond1--Rs')
        try {
          const price = bettingPrice;
          UserStore.setWalletBalc(result.walletBal);
          console.log("price userstore", result.walletBal);
         // Store price safely in AsyncStorage used in next screen
         await storePriceInAsyncStorage(price, priceType);
          navigation.navigate("FindOpponent", {
            source: "EntryFee",
            PriceType: priceType,
            ContestantTpye: contestantType,
          });
        } catch (error) {
          if (__DEV__) {
            console.error("Error storing price in AsyncStorage: ", error);
          }
        }
      } else if (
        selectedContest.priceType == "2" &&
        parseInt(result.extraBal) >= contestPriceNew
      ) {
        // console.log('--cond2--X')
        try {
          const price = bettingPrice;
          // Store price safely in AsyncStorage used in next screen
          await storePriceInAsyncStorage(price, priceType);
          navigation.navigate("FindOpponent", {
            source: "EntryFee",
            PriceType: priceType,
            ContestantTpye: contestantType,
          });
        } catch (error) {
          if (__DEV__) {
            console.error("Error storing price in AsyncStorage: ", error);
          }
        }
      } else {
        if (__DEV__) {
          console.log(
            "Selected xtras..selectedContest.priceType: ",
            selectedContest.priceType
          );
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.error("Error verifying location:", error);
      }
    } finally {
      hideProgress();
    }
  };



/// orgnl code
// const joinFrnd = async () => {
//   try {
//     showProgress();
//     await AsyncStorage.setItem("Opn", "false");
    
//     const userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
//     const prevContests = JSON.parse(await AsyncStorage.getItem("prev-contests"));

//     // Check token expiration
//     await Functions.getInstance().checkExpiration(
//       userInfo.userId,
//       userInfo.refToken,
//       navigation
//     );

//     // Check internet connectivity before proceeding
//     const isConnected = await Functions.getInstance().checkInternetConnectivity();
//     if (!isConnected) {
//       console.warn("No internet connection.");
//       return;
//     }

//     const playWithFriendObj = {
//       matchId: selectedMatch.matchId,
//       roomCode: inputValue,
//       userOne: userInfo.userId,
//     };

//     // Host a play session with a friend
//     const result = await Services.getInstance().playWithFriendJoined(
//       playWithFriendObj,
//       userInfo.userId,
//       userInfo.accesToken
//     );
//     console.log("playWithFriendJoin API result:", JSON.stringify(result));

//     // Check if status is 200, then call another API
//     if (result.status === 200) {
//       const opponentObj = {
//         matchId: selectedMatch.matchId,
//         contestId: "21",
//         priceType: "0",
//       };

//       const additionalApiResult = await Services.getInstance().findAnOpponent(
//         opponentObj,
//         userInfo.userId,
//         selectedMatch.matchId,
//         "21",
//         userInfo.accesToken
//       );

//       console.log("API findAnOpponent response:", JSON.stringify(additionalApiResult));

//       // If additional API response is successful, navigate to GameRoom
//     //  if (additionalApiResult.status === 200) {
       
//      // }
//     }
//   } catch (error) {
//     console.error("Error in joinFrnd:", error);
//   } finally {
//     navigation.navigate("GameRoom_Friend", { GAMEid: additionalApiResult.gameId});
//     hideProgress();
//   }
// };


const joinFrnd = async () => {
  try {
    showProgress();
    await AsyncStorage.setItem("Opn", "false");

    const userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
    const prevContests = JSON.parse(await AsyncStorage.getItem("prev-contests"));

    // Check token expiration
    await Functions.getInstance().checkExpiration(
      userInfo.userId,
      userInfo.refToken,
      navigation
    );

    // Check internet connectivity before proceeding
    const isConnected = await Functions.getInstance().checkInternetConnectivity();
    if (!isConnected) {
      console.warn("No internet connection.");
      return;
    }

    const playWithFriendObj = {
      matchId: selectedMatch.matchId,
      roomCode: inputValue,
      userOne: userInfo.userId,
    };

    
    // Host a play session with a friend
    const result = await Services.getInstance().playWithFriendJoined(
      playWithFriendObj,
      userInfo.userId,
      userInfo.accesToken
    );
    console.log("playWithFriendJoin API result:", JSON.stringify(result));

    let additionalApiResult = null; // Declare additionalApiResult outside the if block

    // Check if status is 200, then call another API
    if (result.status === 200) {
      const opponentObj = {
        matchId: selectedMatch.matchId,
        contestId: "21",
        priceType: "0",
      };

      additionalApiResult = await Services.getInstance().findAnOpponent(
        opponentObj,
        userInfo.userId,
        selectedMatch.matchId,
        "21",
        userInfo.accesToken
      );

      console.log("API findAnOpponent response:", JSON.stringify(additionalApiResult));

      // If additional API response is successful, navigate to GameRoom
      if (additionalApiResult?.status === 200 && additionalApiResult?.gameId) { // Use optional chaining and check for gameId
        console.log("Navigating to GameRoom_Friend with gameId:", additionalApiResult.gameId);

        navigation.navigate("GameRoom_Friend", { GAMEid: additionalApiResult.gameId });
        hideProgress();
        return; // Exit the function after successful navigation
      } else {
        console.warn("additionalApiResult status is not 200, or gameId is missing", additionalApiResult);
        // Handle the error, show a message to the user, etc.
      }
    }
  } catch (error) {
    console.error("Error in joinFrnd:", error);
    // Handle the error, show a message to the user, etc.
  } finally {
    hideProgress();
  }
};



  let selectedMtchwithContestID = UserStore.selectedMatch;
  selectedMtchwithContestID.contestId = contestantType;
  //console.log('----New choosecntscr---', selectedMtchwithContestID);
  UserStore.setselectedMatch(selectedMtchwithContestID);

  ///////////////////////////////////////////////////////////////////////////  /////////////////////////////////////////

  
  //#246afe
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar backgroundColor="#111111" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <MatchBanner selectedUserMatch={selectedMatch} />
        <View style={[styles.mainContainer, {marginTop: -10}]}>
         

          {!playwithFrnd && (
            <View style={{ marginBottom: 7.8, alignItems: "flex-end" }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={[
                    styles.balAmntText,
                    {
                      color: isEnabled ? "#fff" : "#246afe",
                      fontSize: 20,
                      marginRight: 7.6,
                    },
                  ]}
                >
                  ₹
                </Text>
                <Switch
                  style={{
                    marginBottom: 7.8,
                    alignItems: "flex-end",
                    transform: [{ scaleX: 1.1 }, { scaleY: 1.0 }],
                  }}
                  trackColor={{ false: "gray", true: "#fff" }}
                  thumbColor={isEnabled ? "#246afe" : "#f4f3f4"}
                  // // ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
                {/* <Icons
                  name="coins"
                  color={isEnabled ? "#246afe" : "#fff"}
                  size={18}
                  style={{ marginRight: 6, marginLeft: 6 }}
                ></Icons> */}
                <Image
                  source={Eicon}
                  style={{
                    width: 22,
                    height: 22,
                    marginRight: 3,
                    marginTop: 2,
                  }}
                />
              </View>
            </View>
          )}

          <View style={[styles.contestContainer]}>
            <TouchableOpacity
              disabled={selectedContest === undefined}
              onPress={() => {
                setplaywithFrnd(!playwithFrnd);
                setjoinwithFrnd(false);
                //  console.log('cont prces', contestPrices);
                //  console.log('PRICE TYPE', priceType)
              }}
            >
              <View style={[styles.chscnst, { backgroundColor: "#fff" }]}>
                <Text
                  style={[
                    styles.chstxt,
                    styles.plynw,
                    { color: playwithFrnd ? "#279bff" : "#1e232d" },
                  ]}
                >
                  Play With a Friend
                </Text>
              </View>
            </TouchableOpacity>

            {playwithFrnd && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between", //'#279bff'  '#1e232d'
                  width: "100%",
                  backgroundColor: "#383838",
                  marginTop: -8,
                  padding: 4,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  marginBottom: 10,
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.contestItem,
                    { backgroundColor: "#279bff", marginTop: 8 },
                  ]}
                  onPress={() => {
                    setjoinwithFrnd(false);
                    navigation.navigate("FindOpponentFrnd", {
                      source: "FriendOpp",
                    });
                  }}
                >
                  <Text style={styles.contestText}> HOST </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.contestItem,
                    { backgroundColor: "#279bff", marginTop: 8 },
                  ]}
                  onPress={() => setjoinwithFrnd(true)}
                >
                  <Text style={styles.contestText}> JOIN </Text>
                </TouchableOpacity>
              </View>
            )}

            {playwithFrnd && joinwithFrnd && (
              <View style={Localstyles.container}>
                <TextInput
                  onChangeText={(text) => setInputValue(text)}
                  style={Localstyles.textInput}
                  placeholder="Enter a code to Join"
                  placeholderTextColor="#aaa"
                />
                <TouchableOpacity onPress={()=> joinFrnd()}>
                 
                  
                  <IconsEncpto
                    name="arrow-with-circle-right"
                    size={24}
                    color="#279bff"
                    style={Localstyles.icon}
                  />
                </TouchableOpacity>
              </View>
            )}

            {!playwithFrnd && contestPrices && (
              <View>
                <View style={styles.contestList}>
                  {contestPrices.map((item) => renderContestContent(item))}
                </View>
                <TouchableOpacity
                  disabled={selectedContest === undefined}
                  onPress={async () => {
                   // callPlayer11Data();
                    handleLocationAndContest(); //main
                    // getLocation2(); // Orgnl code

                  }}
                >
                  <View style={styles.chscnst}>
                    <Text style={[styles.chstxt, styles.plynw]}>Play Now</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                setGameRules(true);
                let properties = new MoEProperties();
                properties.addAttribute("Game rules", true);
                ReactMoE.trackEvent("Match tile", properties);
              }}
            >
              <Text style={styles.termsCondition}>Game Rules</Text>
            </TouchableOpacity>
          </View>

          {selectedContest != "" && playwithFrnd === false ? (
            <View
              style={{
                backgroundColor: "#383838",
                marginTop: 10,
                borderRadius: 12,
                padding: 10,
                marginBottom: 50,
              }}
            >
              <View
                style={{
                  backgroundColor: "#525151",
                  borderRadius: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 5,
                  paddingRight: 14,
                  paddingLeft: 14,
                }}
              >
                <Text style={[styles.chstxt, { color: "white", fontSize: 11 }]}>
                  Winnings
                </Text>
                <Text style={[styles.chstxt, { color: "white", fontSize: 11 }]}>
                  ₹ {maxReturn}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 5,
                  backgroundColor: "#525151",
                  borderRadius: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 5,
                  paddingRight: 14,
                  paddingLeft: 14,
                }}
              >
                <Text style={[styles.chstxt, { color: "white", fontSize: 11 }]}>
                  Returns
                </Text>
                <Text style={[styles.chstxt, { color: "white", fontSize: 11 }]}>
                  ₹ {maxRunDiff}
                </Text>
              </View>
            </View>
          ) : (
            ""
          )}

          <MatchesList
            title="Upcoming Matches"
            showMore={false}
            data={[]}
            extraData={[]}
            onPressMatch={() => {}}
          />
        </View>

        {askLocation ? <Popup onClose={() => setaskLocation(false)} /> : ""}

        {restricted ? (
          <RestrictedLocation onClose={() => setRestricted(false)} />
        ) : (
          ""
        )}

        {insufficient ? (
          <InsufficientWallet
            onClose={() => setInsufficient(false)}
            onYes={() => {
              setInsufficient(false);
              navigation.navigate("Wallet");
            }}
            amount={contestPriceNew}
          />
        ) : (
          ""
        )}

        {gameRules ? (
          <GameRulesPopup onClose={() => setGameRules(false)} />
        ) : (
          ""
        )}

        {kycPending ? (
          <KycPendingPopup
            onClose={() => setkycPending(false)}
            onYes={() => {
              UserStore.setkycBtnTitle("Start playing");
              AsyncStorage.setItem("kyc-type", "Adhar");
              setkycPending(false);
              let properties = new MoEProperties();
              properties.addAttribute(
                "(KYC-Aadhar)> Continue button",
                userInfo.userId
              );
              ReactMoE.trackEvent("KYC verification (Aadhar)", properties);
              navigation.navigate("KYC", {
                screen: "KycPage",
                params: { require: "Adhar" },
              });
            }}
          />
        ) : (
          ""
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const Localstyles = StyleSheet.create({
  iconContainer: {
    width: 20,
    height: 20,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff", // Background color for contrast
    borderRadius: 10, // To keep it circular if needed
    borderWidth: 2, // Thickness of the border
    borderColor: "#000", // Color of the border
  },
  activeContestText: {
    // Your styles for active contest text
  },
  contestText: {
    // Your styles for contest text
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#279bff",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#f0f0f0",
  },
  textInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  icon: {
    marginLeft: 10,
  },
});

export default WithProgress(ChooseContest);

