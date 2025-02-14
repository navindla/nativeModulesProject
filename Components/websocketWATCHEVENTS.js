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

  // const ws = new WebSocket(`wss://qaws.player6sports.com/${userInfo1?.userId}/watchEvents`);

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
  const ws = useRef(null);
  const route = useRoute();
  const from = route.params.source;
  const Price = route.params.PriceType;
  const ContestantType = route.params.ContestantTpye; // BettingPrice
  const DisplayPrice = route.params.BettingPrice;
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




  

    // useEffect(() => {
     
    //   ws.current = new WebSocket(`wss://apiqa.player6sports.com/1.0/auth/User/${userInfo1?.userId}/watchEvents`);
  
    //   ws.current.onopen = () => {
    //     console.log('✅ WebSocket Connected');
    //   };
  
    //   ws.current.onmessage = async (event) => {
    //     try {
    //       const parsedData = JSON.parse(event.data);
    //       if (parsedData.type === 'opnSel') {
    //         console.log('Received innScors data from WebSocket:', parsedData.data);
  
    //         const { contestId, matchId, userOne, userTwo } = parsedData.data;
  
    //         if (
    //           UserStore.selectedMatch.contestId === contestId &&
    //           UserStore.selectedMatch.matchId === matchId &&
    //           (userInfo1?.userId === userOne || userInfo1?.userId === userTwo)
    //         ) {
    //           console.log('✅ ContestantType matches contestId. Navigating to GameRoom.');
    //           await AsyncStorage.setItem('Opn', 'true'); // Store opponent status
    //           setopEvent(true);
    //           UserStore.setopponentSocketData(parsedData.data); // Store opponent data
    //           navigation.navigate('GameRoom', { source: 'FindOpponent' });
    //         } else {
    //           console.warn('❌ Contest or Match ID does not match. No navigation.');
    //         }
    //       }
    //     } catch (error) {
    //       console.error('❌ Error parsing WebSocket message:', error);
    //     }
    //   };
  
    //   ws.current.onerror = (error) => {
    //     console.error('❌ WebSocket Error:', error);
    //   };
  
    //   ws.current.onclose = () => {
    //     console.log('❌ WebSocket Disconnected');
    //   };
  
    //   return () => {
    //     if (ws.current) {
    //       ws.current.close();
    //     }
    //   };
    // }, [userInfo1]);


    useEffect(() => {
      ws.current = new WebSocket(`wss://qaws.player6sports.com/191/watchEvents`);
    
      ws.current.onopen = () => {
        console.log('✅ WebSocket Connected');
      };
    
      ws.current.onmessage = async (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          
          // Log the entire received data
          console.log('📩 Received WebSocket Message:', parsedData);
    
          // Extract necessary fields (if available)
          const { type, data } = parsedData;
    
          // Handle specific event type logic (previously 'innScors')
          if (type) {
            console.log(`📌 Received Event Type: ${type}`);
    
            if (data) {
              const { contestId, matchId, userOne, userTwo } = data;
    
              if (
                UserStore.selectedMatch.contestId === contestId &&
                UserStore.selectedMatch.matchId === matchId &&
                (userInfo1?.userId === userOne || userInfo1?.userId === userTwo)
              ) {
                console.log('✅ ContestantType matches contestId. Navigating to GameRoom.');
                await AsyncStorage.setItem('Opn', 'true'); // Store opponent status
                setopEvent(true);
                UserStore.setopponentSocketData(data); // Store opponent data
                navigation.navigate('GameRoom', { source: 'FindOpponent' });
              } else {
                console.warn('❌ Contest or Match ID does not match. No navigation.');
              }
            }
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };
    
      ws.current.onerror = (error) => {
        console.error('❌ WebSocket Error:', error);
      };
    
      ws.current.onclose = () => {
        console.log('❌ WebSocket Disconnected');
      };
    
      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }, []);
    



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

      //getData();
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




///////////////////////////////////////////////////////////////////////////////////////////////






  //////////////////To GAME ROOM////////////////////////////////////////
  /////// one of the interlinked functional code from callsocket() func(): takes opp data from async and socket and compares depending on this this  fun() navigates to a screen///////////
  const getStatus = async (event) => {
    const stat = await AsyncStorage.getItem("Opn"); //checks opp info frm async
    const ds = JSON.parse(event.data); //opp data frm socket
    console.log("opnSel Event :::: ", ds);
    if (
      route.name == "FindOpponent" &&
      stat == "false" &&
      ds.matchId == selectedUserMatch.matchId &&
      ds.contestId == selectedUserContest.contestId &&
      (ds.userOne == userInfo.userId || ds.userTwo == userInfo.userId)
    ) {
      AsyncStorage.setItem("Opn", "true"); //abv condition ds vs stat
      setopEvent(true);
      UserStore.setopponentSocketData(JSON.parse(event.data)); //set opp info to redx
      navigation.navigate("GameRoom", { source: "FindOpponent" });
    }
  };

  const getDownStatus = async (event) => {
    const stat = await AsyncStorage.getItem("Opn");
    const ds = JSON.parse(event.data);
    console.log("opnDownSel Event ::::: ", ds);
    if (
      route.name == "FindOpponent" &&
      stat == "false" &&
      ds.matchId == selectedUserMatch.matchId &&
      ((ds.userOne == userInfo.userId &&
        ds.userOneContId == selectedUserContest.contestId) ||
        (ds.userTwo == userInfo.userId &&
          ds.userTwoContId == selectedUserContest.contestId))
    ) {
      AsyncStorage.setItem("Opn", "true");
      setopEvent(true);
      UserStore.setopponentSocketData(JSON.parse(event.data));
      navigation.navigate("GameRoom", { source: "FindOpponent" });
    }
  };

  const getDownGradeList = async (event) => {
    const ds = JSON.parse(event.data);
    console.log("Down Grade Event :::: ", ds);
    if (
      route.name == "FindOpponent" &&
      ds.matchId == selectedUserMatch.matchId
    ) {
      const f_dgrade1 = ds.options.filter((val) => !prevContests.includes(val));
      const f_dgrade2 = f_dgrade1.filter(
        (item) => Number(item) < Number(selectedUserContest.contestId)
      );
      console.log(f_dgrade2);
      setdownGrade(f_dgrade2);
      filterContestPrices(allContestFees, f_dgrade2);
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
                "FindOpponentJS screen Data API payload chngd: ",
                JSON.stringify(result)
              );
              if (result.status === 401 && result.error === 'Low wallet Balance') {
                Functions.getInstance().Toast("error", JSON.stringify(result.error));
                // Navigate back to the previous screen
               // navigation.goBack();
              }
              hideProgress();
              return
            //  Functions.getInstance().Toast("error", JSON.stringify(result)); //debuging in real device
            });
            

          // Services.getInstance().previousContests(userInfo.userId, selectedUserMatch.matchId, userInfo.accesToken).then((result)=>{
          //     AsyncStorage.setItem("prev-contests", JSON.stringify(result.msg));
          //     prevContests = result.msg;
          //   })

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
                {/* { PriceTyp == "1" ? (
                  <Text style={styles.rupeeSymbol}>₹</Text>
                ) : (
                  <Image
                    source={Eicon}
                    style={{
                      width: 16,
                      height: 16,
                      marginRight: 1.6,
                      marginTop: 1,
                    }}
                  />
                )}
                <Text style={styles.priceText}>{selectedItemPrice}</Text> */}
              
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
    </SafeAreaView>
  );
};

export default WithProgress(inject("UserStore")(observer(FindOpponent)));
