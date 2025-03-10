

///////////////////////////////////////// v2 below: abv old code if blow code works erase abv code n push ///////////////

// code b4 playingWidFrnd works only F not R


import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
  BackHandler,
  AppState,
  StyleSheet,
  TouchableOpacity,
  Share,
  ToastAndroid
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import React, { useEffect, useRef, useState, useMemo } from "react";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
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
import ShareIcon from "react-native-vector-icons/AntDesign"
import Clipboard from "@react-native-clipboard/clipboard"; //copy
import { secondary } from "../../../style";

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



    const generateCouponCode = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
    
      const randomComponent = Math.random().toString(36).substring(2, 7); // Generate a random string
    
      return `PL6${year}${month}${day}${hours}${minutes}${seconds}${randomComponent}`;
    };
    
  //     // Memoize the coupon code
  // const couponCode = useMemo(() => {
  //   if (from === 'Frnd') {
  //     console.log('from is Frnd', userInfo?.userId);
  //     return generateCouponCode();

  //   }
  //   return '';
  // }, [from]);
      // Memoize the coupon code
  // const couponCode = React.useMemo(() => generateCouponCode(), []);
    ///////////// frnd ///////////////////
    const copyToClipboard = () => {
      Clipboard.setString(couponCode);
      ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
    };
    
    const shareText = async () => {
      try {
        await Share.share({
          message: couponCode,
        });
      } catch (error) {
        alert(error.message);
      }
    };

      // Animation for glowing effect
  const borderColor = useSharedValue('#0000ff');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: borderColor.value,
    };
  });




  
//  console.log("-- from SCR -->",from);
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









      // Memoize the coupon code
      const couponCode = useMemo(() => {
        if (from === 'Frnd') {
          console.log('from is Frnd', userInfo?.userId);
          return generateCouponCode();
    
        }
        return '';
      }, [from]);





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
            contestId: from ===  'Frnd'? "21" : ContestantType, // selectedUserContest.contestId,  //Price
            priceType: from === 'Frnd'? "0" : Price, 
          };
          console.log("obj API findAnOpponent::::::::::", obj);
          //   Services.getInstance().findAnOpponent(obj, userInfo.userId, selectedUserMatch.matchId, selectedUserContest.contestId, userInfo.accesToken).then((result)=>{
          Services.getInstance()
            .findAnOpponent(
              obj,
              userInfo.userId,
              selectedUserMatch.matchId,
              from ===  'Frnd'? "21" : ContestantType,
            //  ContestantType,
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
              } else if(result.code === 404){
                Functions.getInstance().Toast("error", "Server down, try again later");
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




      // Execute playWithFriendHost API call if from is 'Frnd'
      useEffect(() => {
        
        console.log("from line 405", from);
        const hostPlaySession = async () => {
          userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
          if (from == 'Frnd') {
            const playWithFriendObj = {
              matchId: selectedUserMatch.matchId,
              roomCode: couponCode,
              userOne: userInfo.userId,
            };
            console.log('Play session created Obj:', playWithFriendObj);
    
            try {
              // Host a play session with a friend
              const result = await Services.getInstance().playWithFriendHost(
                playWithFriendObj,
                userInfo.userId,
                userInfo.accesToken
              );
              
              // Handle the result as needed
             
              console.log('Play session created Respo:', result);
    
            } catch (error) {
              console.error('Error hosting play session:', error);
            }
          }
        };
    
        hostPlaySession();
        
      }, [from, couponCode]); // Add dependencies to ensure it runs when 



  
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
          {
            from === "Frnd" ? (
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Animated.View style={[LocalStyles.couponContainer,
                 animatedStyle
                 ]}>
                <Text style={LocalStyles.couponText}>{couponCode}</Text>
                <TouchableOpacity
                  onPress={copyToClipboard}
                  style={LocalStyles.copyIconContainer}
                >
                  <Icon name="copy" size={20} color={secondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={shareText}
                  style={[LocalStyles.copyIconContainer, {marginRight:5, marginLeft: 5}]}
                >
                  <ShareIcon name="sharealt" size={20} color={secondary} />
                </TouchableOpacity>
              </Animated.View>
            </View>
            ): ''
          }

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





const LocalStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  couponContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.0,
    borderColor: "#d3d3d3",
  // borderColor: '#0000ff', // Initial off color (gray)
    borderStyle: "dashed",
    padding: 10,
    borderRadius: 5,
    flexShrink: 1,
    alignSelf: 'flex-start',
    backgroundColor:'#383838'
  },
  couponText: {
    fontSize: 14.5,
    marginRight: 0,
    color: secondary,
    width: 200, // Adjust this width as necessary
  },
  copyIconContainer: {
    padding: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 80, // Adjust this value based on the height of the bottom tab menu
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: "42%",
    backgroundColor: "#279bff",
    paddingVertical: 12,
    borderRadius: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 13.4,
    fontWeight: "bold",
    textAlign: "center",
  },
});





export default WithProgress(inject("UserStore")(observer(FindOpponent)));

