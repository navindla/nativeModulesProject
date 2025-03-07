// here is the build-1 + pl sel ..has bugs: 0-0 no freeze n opp loadr




////////////////////////////// exp latest code /////////////////////////



//v 2.2.7 i6 ..ask tester app apk data xcel

////// v6 git latest  //////////////

/// includes dummy data also api funcs
// disable btns dynamic frm state
//wss soc integrated logs all and sets myFinal opFinal
// added usef Info in state
// added new renderPickPlayerCheckBox acc2 setmyFinal liust etc
// added 1st api.res.pl-sel-process = f? then to scrbrd scr.
// added navigate to cap.vc cap

////// v7 //////

// working check-yick marks
//renderteamA() working all bg
//renderteamB() working all bg
// initial loading is good.

//// v8
/// app crash fixed with loading popup

// RChngs added tested working fine

// included rem timer shows only rem timr frm wss respo
// also when pl-sel time completed? navigates to runng matches post pl-sel time
//  navigation.navigate("CaptainViceCaptainSelection" included need testng..

// 2.2.7 D6 : has dy. timers
// middle joinrem time shows exactly tested workng
// 1st api stored in async for 2nd time call
// pro pic , name new server link etc
// 

////////////////

import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  Vibration,
  AppState,
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
// import { MMKV } from 'react-native-mmkv';
import { CommonActions } from "@react-navigation/native";
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
import { Avatar, Badge, Icon, withBadge } from "@rneui/themed";
import ModalPopup from "./MiddleScreen";

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
  //  const [userInfo, setUserInfo] = useState(null);
  const profile1 = UserStore.getuserPF();
  if (UserStore) {
    const profile = UserStore.getuserPF();
    if (profile) {
      myPic = profile?.replace(/['"]+/g, "");
    }
  }
  const [userPro, setUserPro] = useState(null);   ///////////// added
  const [currentTime, setCurrentTime] = useState("00:29");
  const [isRunning, setIsRunning] = useState(false); // Track if the timer is runnin added
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [teamABench, setTeamABench] = useState([]);
  const [teamBBench, setTeamBBench] = useState([]);
  const [middleScreen, setmiddleScreen] = useState(false); 



//  return;
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

  ////////////////////// App state code //////////////////////////////////
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        navigation.navigate("BettingAddMoney");
      }
      setAppState(nextAppState);
    };

    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      appStateListener.remove(); // Cleanup on unmount
    };
  }, [appState]);
  //////////////////// end ///////////////////////////////////////////////

  // const storage = new MMKV();

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

  const fetchUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("player6-userdata");
      const userPF = JSON.parse(await AsyncStorage.getItem("player6-profile"));
      console.log("User Profile data: ", userPF);
      setUserPro(userPF);
      if (storedUserData) {
        userInfo = JSON.parse(storedUserData);
        ///// added ///////////////
        console.log("User Info id--------:", userInfo?.userId);
        console.log("User gamedetails userone--------:", gameDetails?.userOne);
        if (userInfo?.userId === gameDetails?.userOne) {
          setIsOpponent(false);
        } else {
          setIsOpponent(true);
        }
        ////////// end ////////////
        //console.log("User Info NEW CODE--------:", userInfo); // Log the user info
      } else {
        console.log("No user info found.");
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };




  useEffect(() => {
    const unsubscribe = navigation?.addListener("focus", async () => {
      try {
        // Resetting team and player data
        setTeamA([{}]);
        setTeamB([{}]);
        setTeamABench([]);
        setTeamBBench([]);
        playerIdsData = [];
        gameDetails = UserStore.selectedGameData;
        // Additional calls and resets
        // getData();
        fetchUserData();
        AsyncStorage.setItem("p6data", "false");
        AsyncStorage.setItem("pl6-socket", "false");
        // callSocket();
        callPlayer11Data(); // uncmnt
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    });

    return () => {
      // Cleanup logic
      hideProgress();
      setLoading(false);
      // newSocket.removeAllListeners();
      newSocket.close();
      unsubscribe();
    };
  }, []);

  ////////////// 25nov//////////
  useEffect(() => {
    const ws = new WebSocket(
      `wss://qaws.player6sports.com/${userInfo?.userId}/gameEvents/${UserStore.selectedGameData.gameId}`
    );

    ws.onopen = () => {
      console.log(
        "WebSocket connection established userInfo?.userId",
        userInfo?.userId
      );
    };



    // dy timer
    ws.onmessage = (event) => {
      try {
        console.log("-------raw-event triggerrrreeed--", event);
        const parsedData = JSON.parse(event.data);

        // Check if event is "COMPLETED"
        if (parsedData.event === "COMPLETED") {
          console.log("Events completed...");
          setmiddleScreen(false); ////////////////////////// added
          navigation.navigate("CaptainViceCaptainSelection", {
            newGameId: UserStore.selectedGameData.gameId,
          });
          // setSelectionProcess(true);
          return; // Exit early since no further processing is needed
        }

        // Extract and set the new state variables
        const myStatusData = parsedData.data?.myStatus;
        const opnStatusData = parsedData.data?.opnStatus;
        const myFinalData = parsedData.data?.myFinal;
        const opFinalData = parsedData.data?.opFinal;

        ////////////////// test2 hit passed /////////// gID 5897
        ///// PART-1 ////
        const nextPickTimeStr = myStatusData?.next_picked_player; // Example value "2024-12-11
        console.log("---event timers started----", nextPickTimeStr);
        //// PART-2 /////////
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(now.getUTCDate()).padStart(2, "0");
        const hours = String(now.getUTCHours()).padStart(2, "0");
        const minutes = String(now.getUTCMinutes()).padStart(2, "0");
        const seconds = String(now.getUTCSeconds()).padStart(2, "0");
        const now_time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        //////// OPR //////////////
        const nextPickTime = new Date(nextPickTimeStr.replace(" ", "T")); // Convert to ISO format
        const nowTime = new Date(now_time.replace(" ", "T")); // Convert to ISO format
        //////////// CAL ////////////////////////////////
        // Calculate the difference in seconds
        const timeDifferenceInSeconds = String(
          Math.floor((nextPickTime - nowTime) / 1000)
        ); // Log the result
        console.log("MAIN------------Next Pick Time API:", nextPickTimeStr);
        console.log("MAIN------------Current Time:", now_time);
        console.log(
          "MAIN------------Time Difference (in seconds):",
          timeDifferenceInSeconds
        );

        const minutes1 = "00";
        setCurrentTime(`${minutes1}:${timeDifferenceInSeconds}`);

        // Set myStatus based on userId comparison
        if (myStatusData && userInfo?.userId === myStatusData.userId) {
          console.log("My Status:", myStatusData);
          setMyStatus(myStatusData);
          setMyFinal(myFinalData); // Update the state with myFinal data
          setOpFinal(opFinalData); // Update the state with opFinal data
        } else if (opnStatusData) {
          console.log("Opponent Status:", opnStatusData);
          setMyStatus(opnStatusData); // Set opponent status if userId doesn't match
          setMyFinal(opFinalData); // Update the state with myFinal data
          setOpFinal(myFinalData); // Update the state with opFinal data
        }

        // Update globalList with both final data arrays
        if (myFinalData || opFinalData) {
          setglobal_6players([...(myFinalData || []), ...(opFinalData || [])]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Clean up WebSocket on component unmount
    return () => {
      ws.close();
    };
  }, []);

  ///////// only chnages timer if gets 00:00 ///
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
        //   setmyTurn(!myTurn); //added
        // setCurrentTime('00:30'); // Ensure UI reflects the reset immediately
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isRunning, currentTime]);

  ////////// nov 25 ///////////////
  // Effect to update needToPick state based on myStatus
  useEffect(() => {
    if (myStatus.need_to_pick !== undefined) {
      //   setNeedToPick(myStatus.need_to_pick);
      setmyTurn(myStatus.need_to_pick);
      console.log("setmyTurn-->", myStatus.need_to_pick);
      //    console.log("myStatus userID-->", myStatus.userId);
      //  console.log("myStatus need_to_pick-->", myStatus.need_to_pick);
    }
  }, [myStatus]);

  //uncmnt
  useEffect(() => {
    if (myTurn) {
      setLoading(false);
      //  calculateTimeLeft();
      //  setCurrentTime("00:30"); // Ensure UI reflects the reset immediately
      //  console.log('teamA------ data ------',teamA)
    } else {
      if (teamA.length > 0) {
        setLoading(true);
        //  setCurrentTime("00:30"); // Ensure UI reflects the reset immediately
      }
    }
  }, [myTurn]);





  useEffect(() => {
    if (global_6players.length === 12) {
      console.log("12");
      setmiddleScreen(true)
    }
  }, [global_6players]); 





  ////////////////////////////

  //////////////// v2///////////////

  const callPlayer11Data = async () => {
    try {
      showProgress();

      // User data
      const userInfo = JSON.parse(
        await AsyncStorage.getItem("player6-userdata")
      );
      // const userPF = JSON.parse(await AsyncStorage.getItem("player6-profile"));
      //console.log("userPF", userPF);

      // Unique key for AsyncStorage based on gameId
      const storageKey = `player6-api-response-${gameDetails.gameId}`;

      // Retrieve cached response for the specific gameId
      const cachedResponse = await AsyncStorage.getItem(storageKey);

      if (cachedResponse) {
        console.log(
          "Using cached API response for gameId:",
          gameDetails.gameId
        );
        const result = JSON.parse(cachedResponse);
        handleApiResponse(result);
        hideProgress();
        return;
      }

      const sysTime = getCurrentTime();

      // Call the API
      const result = await Services.getInstance().getPlayersData(
        userInfo.userId,
        gameDetails.gameId,
        userInfo.accesToken,
        sysTime
      );

      if (result.playerSelectionStatus === "COMPLETED") {
        navigation.replace("RunningMatch");
        hideProgress();
        return;
      }

      if (result.status === 200) {
        // Cache the response in AsyncStorage with the unique key
        await AsyncStorage.setItem(storageKey, JSON.stringify(result));

        handleApiResponse(result);
      } else {
        console.error("API call failed with status:", result.status);
      }
    } catch (error) {
      console.error("Error in callPlayer11Data:", error);
    } finally {
      hideProgress();
    }
  };

  // Separate function to handle API response
  const handleApiResponse = (result) => {
    setIsRunning(true); // start timer 00:30
    selectionTime = result.selStartTm;
    setTeamA(result.teamA11);
    setTeamB(result.teamB11);
    setTeamABench(result.teamABan);
    setTeamBBench(result.teamBBan);
    setopponentName(result.opnName);
    setopponentPic(result.opnImg);
    setMyDefaultPlayers(result.myPlayers);

    if (result.myPlayers.length > 0) {
      preDefinedPlayers = result.myPlayers[0];
    }

    tossWinnerLastPic = result.oponLPlayer.playerId;

    filterTheSelectedData(
      result.teamA11,
      result.teamB11,
      result.teamABan,
      result.teamBBan
    );
  };

  ////////////////////////////////////////

  //// sets if a player is slected isSel : "1"
  // it is a just a fun() not ui render item, just sets player in ui also in state level

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
  };

  const handlePlayerClick = (playerIndex, team, item) => {
    const obj = {
      gameId: gameDetails.gameId,
      playerId: item.playerId,
      utcCTime: getCurrentTime(),
    };

    console.log("2nd----api payload---", obj);
    Services.getInstance()
      .saveFinalPlayers(
        obj,
        userInfo.userId,
        gameDetails.gameId,
        userInfo.accesToken
      )
      .then((result) => {
        console.log(
          "2nd api--------success--------2nd api------------",
          result
        );
        plseleccted = false;
        if (result.status == 200) {
          callPlayer11Data()
            .then(function () {
              hideProgress();
              setmyTurn(false);
            })
            .catch(function () {
              console.log("Line handleclick function");
            });
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
  };

  ////////// real code below ////////

  //////////////////////////////////////////////////////////// Display render() ///////////////////////////////////////////////////////////////////////
  const renderCountryBoxHeader = () => {
    return (
      <View style={styles.countryBoxTopHeader}>
        <View style={styles.teamLeft}>
          <View style={styles.teamsImage}>
          <Image
                style={styles.teamsImageStyle}
                source={
                  UserStore.userPF
                    ? { uri: UserStore.userPF
                    //  profile 
                    }
                    : require("../../../assets/images/dummy.png")
                }
              />
          </View>
          <View style={styles.teamName}>
            <Text style={styles.teamLeftNameText}>
              {userPro?.name} 
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

  ////////////////////////// new Final Working code below ///////////////////////
  const renderPickPlayerCheckBox = () => {
    return (
      <View style={styles.ptkmain}>
        {/* Team A Player List */}
        <View style={[styles.pntlist, styles.ticklist, styles.btmlist]}>
          {Array.from({ length: 6 }).map((_, index) => {
            // Find the player corresponding to the current index (if exists)
            const player = myFinal[index];
            const isPlayerSelected = player
              ? player.userId === userInfo?.userId
              : false;
            // console.log("renderCountryBoxHeader", player)

            return (
              <View
                key={index}
                //{player ? player.userId : index}
                style={[
                  styles.pntitem,
                  { backgroundColor: isOpponent ? "#E99014" : "#279bff" },
                  // { backgroundColor: player?.userId === gameDetails?.userOne ? '#279bff' : '#E99014' }
                ]}
              >
                {isPlayerSelected ? (
                  <Image style={styles.wtick} source={TickIcon} />
                ) : null}
              </View>
            );
          })}
        </View>

        {/* Team B Player List */}
        <View
          style={[
            styles.pntlist,
            styles.ticklist,
            styles.btmlist,
            styles.slist,
          ]}
        >
          {Array.from({ length: 6 }).map((_, index) => {
            // Find the opponent player corresponding to the current index (if exists)
            const player = opFinal[index];
            const isPlayerSelected_Opp = player
              ? player.userId !== userInfo?.userId
              : false;

            return (
              <View
                key={index}
                //{player ? player.userId : index}
                style={[
                  styles.pntitem,
                  { backgroundColor: isOpponent ? "#279bff" : "#E99014" },
                ]}
              >
                {isPlayerSelected_Opp ? (
                  <Image style={styles.wtick} source={TickIcon} />
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  //////////// real code below //////////////////

  const iconStyle = (roleType) => ({
    width: roleType === "3" ? 14 : 15.5,
    height: roleType === "3" ? 14 : 15.5,
    position: "absolute",
    left: 30,
    bottom: 1,
  });

  ///////////// opp not added ////////////

  const renderTeamAItem = ({ item, index }) => {
    // Function to determine the border color based on conditions
    const getBorderColor = (item, global_6players, userInfo) => {
      const matchingPlayer = global_6players.find(
        (player) => player.playerId === item.playerId
      );
      if (matchingPlayer) {
        return matchingPlayer.userId === gameDetails.userOne
          ? //matchingPlayer.userId === userInfo?.userId
            styles.borderTopBlueWidth
          : styles.borderTopOrangeWidth;
      }
      return styles.defaultBorderStyle; // Optional fallback style
    };

    const getTickBgColor = (item, global_6players, userInfo) => {
      const matchingPlayer = global_6players.find(
        (player) => player.playerId === item.playerId
      );
      if (matchingPlayer) {
        return matchingPlayer.userId === gameDetails.userOne
          ? //matchingPlayer.userId === userInfo?.userId
            "#246afe"
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
        disabled={isPlayerDisabled}
        onPress={() => {
          Vibration.vibrate(400); // Trigger vibration
          trackSelectionEvent();
          handlePlayerClick(index, 1, item);
        }}
        style={[
          styles.tmplyrlft,
          getBorderColor(item, global_6players, userInfo),
        ]}
      >
        {/* Player Left Section */}
        <View style={styles.plyrlft}>
          <View
          //style={[styles.plyrprfl, styles.plyrlftprfl]}
          >
            <Avatar
              avatarStyle={{ borderWidth: 1, borderColor: "#fff" }}
              rounded
              source={
                item.imageId
                  ? {
                      uri: `https://cdn.sportmonks.com/images/cricket/players/${item.imageId}`,
                    }
                  : {
                      uri:
                        "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/dummy.png",
                    }
              }
              size={34}
            />

            {item.playerRoleType === "0" && (
              <Image
                source={{
                  uri:
                    "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/bat10.png",
                }}
                //  source={require("./Icons/bat10.png")} // Icon for Bat
                style={iconStyle(item.playerRoleType)}
              />
            )}
            {item.playerRoleType === "1" && (
              <Image
                source={{
                  uri:
                    "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/bat10.png",
                }}
                //   source={require("./Icons/bat10.png")} // Icon for Bat
                style={iconStyle(item.playerRoleType)}
              />
            )}
            {item.playerRoleType === "2" && (
              // || item.item.playerRoleType === "5" alrounder
              <Image
                source={{
                  uri:
                    "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/alrounder.png",
                }}
                //  source={require("./Icons/alrounder.png")} // Icon for Allrounder cricketBall
                style={iconStyle(item.playerRoleType)}
              />
            )}
            {item.playerRoleType === "3" && (
              <Image
                source={{
                  uri:
                    "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/cricketBall.png",
                }}
                //  source={require("./Icons/cricketBall.png")} // Icon for Cricket Ball wicketKeepr
                style={iconStyle(item.playerRoleType)}
              />
            )}
            {item.playerRoleType === "4" && (
              <Image
                source={{
                  uri:
                    "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/wicketKeepr.png",
                }}
                //  source={require("./Icons/wicketKeepr.png")} // Icon for Wicket Keeper alrounder
                style={iconStyle(item.playerRoleType)}
              />
            )}
            {item.playerRoleType === "5" && (
              <Image
                source={{
                  uri:
                    "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/alrounder.png",
                }}
                //  source={require("./Icons/alrounder.png")} // Icon for Allrounder
                style={iconStyle(item.playerRoleType)}
              />
            )}
            {item.playerRoleType === "6" && (
              <Image
                source={{
                  uri:
                    "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/alrounder.png",
                }}
                //  source={require("./Icons/alrounder.png")} // Icon for Allrounder
                style={iconStyle(item.playerRoleType)}
              />
            )}
          </View>
          <View style={{ marginTop: 5 }}>
            {/* <Text style={[styles.ortxt, styles.plyrtm, styles.plyrsd,{backgroundColor: item.countryType == 2? '#fff': "#2d2d2d", color: item.countryType == 2? "#2d2d2d": "#fff"} ]}>
              {item.teamName}
            </Text> */}
            {item.countryType == 2 && (
              <Text
                style={[
                  styles.ortxt,
                  styles.plyrtm,
                  styles.plyrsd,
                  { backgroundColor: "#fff", color: "#2d2d2d", marginTop: 3 },
                ]}
              >
                {item.teamName}
              </Text>
            )}
            {item.countryType == 1 && (
              <Text style={[styles.ortxt, styles.plyrtm, styles.plyrsd]}>
                {item.teamName}
              </Text>
            )}
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

  const renderTeamBItem = ({ item, index }) => {
    // Function to determine the border color based on conditions
    const getBorderColor = (item, global_6players, userInfo) => {
      const matchingPlayer = global_6players.find(
        (player) => player.playerId === item.playerId
      );
      if (matchingPlayer) {
        return matchingPlayer.userId === gameDetails.userOne
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
        return matchingPlayer.userId === gameDetails.userOne
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
        disabled={isPlayerDisabled}
        onPress={() => {
          Vibration.vibrate(400); // Trigger vibration
          trackSelectionEvent();
          handlePlayerClick(index, 2, item);
        }}
        style={[
          styles.tmplyrlft,
          getBorderColor(item, global_6players, userInfo),
        ]}
      >
        {/* Player Left Section */}
        <View style={styles.plyrlft}>
          <View
          //style={[styles.plyrprfl, styles.plyrlftprfl]}
          >
            <Avatar
              avatarStyle={{ borderWidth: 1, borderColor: "#fff" }}
              rounded
              source={
                item.imageId
                  ? {
                      uri: `https://cdn.sportmonks.com/images/cricket/players/${item.imageId}`,
                    }
                  : {
                      uri:
                        "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/dummy.png",
                    }
              }
              size={34}
            />

            {item.playerRoleType === "0" && (
              <Image
                source={{
                  uri:
                    "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/bat10.png",
                }}
                //  source={require("./Icons/bat10.png")} // Icon for Bat
                style={iconStyle(item.playerRoleType)}
              />
            )}
            {item.playerRoleType === "1" && (
              <Image
                source={{
                  uri:
                    "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/bat10.png",
                }}
                //   source={require("./Icons/bat10.png")} // Icon for Bat
                style={iconStyle(item.playerRoleType)}
              />
            )}
            {item.playerRoleType === "2" && (
              // || item.item.playerRoleType === "5" alrounder
              <Image
                source={{
                  uri:
                    "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/alrounder.png",
                }}
                //  source={require("./Icons/alrounder.png")} // Icon for Allrounder cricketBall
                style={iconStyle(item.playerRoleType)}
              />
            )}
            {item.playerRoleType === "3" && (
              <Image
                source={{
                  uri:
                    "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/cricketBall.png",
                }}
                //  source={require("./Icons/cricketBall.png")} // Icon for Cricket Ball wicketKeepr
                style={iconStyle(item.playerRoleType)}
              />
            )}
            {item.playerRoleType === "4" && (
              <Image
                source={{
                  uri:
                    "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/wicketKeepr.png",
                }}
                //  source={require("./Icons/wicketKeepr.png")} // Icon for Wicket Keeper alrounder
                style={iconStyle(item.playerRoleType)}
              />
            )}
            {item.playerRoleType === "5" && (
              <Image
                source={{
                  uri:
                    "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/alrounder.png",
                }}
                //  source={require("./Icons/alrounder.png")} // Icon for Allrounder
                style={iconStyle(item.playerRoleType)}
              />
            )}
            {item.playerRoleType === "6" && (
              <Image
                source={{
                  uri:
                    "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/alrounder.png",
                }}
                //  source={require("./Icons/alrounder.png")} // Icon for Allrounder
                style={iconStyle(item.playerRoleType)}
              />
            )}
          </View>
          <View style={{ marginTop: 5 }}>
            {/* <Text style={[styles.ortxt, styles.plyrtm, styles.plyrsd, {backgroundColor: item.countryType == 2? '#fff': "#2d2d2d", color: item.countryType == 2? "#2d2d2d": "#fff"} ]}>
              {item.teamName}
            </Text> */}
            {item.countryType == 2 && (
              <Text
                style={[
                  styles.ortxt,
                  styles.plyrtm,
                  styles.plyrsd,
                  { backgroundColor: "#fff", color: "#2d2d2d", marginTop: 3 },
                ]}
              >
                {item.teamName}
              </Text>
            )}
            {item.countryType == 1 && (
              <Text style={[styles.ortxt, styles.plyrtm, styles.plyrsd]}>
                {item.teamName}
              </Text>
            )}
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

  return (
    <View style={{ flex: 1, marginTop: 0, backgroundColor: "#111" }}>
      {/* <ScrollView style={styles.scrollView}> */}
      {teamA.length === 0 ? (
        <Text
          style={{
            fontSize: 12,
            color: "#fff",
            textAlign: "center",
            marginTop: 30,
          }}
        >
          Loading..
        </Text>
      ) : (
        <View style={[styles.headerContainer]}>
          <View style={styles.countryBox}>
            {renderCountryBoxHeader()}
            {renderPickPlayerCheckBox()}
          </View>
          <ScrollView style={styles.scrollView}>
            <Text
              style={[
                styles.headingText,
                styles.ennum,
                { textAlign: "center" },
              ]}
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
              style={[
                styles.headingText,
                styles.ennum,
                { textAlign: "center" },
              ]}
            >
              Bench
            </Text>
            <View style={styles.playerContainer}>
              <View style={styles.playerContentBox}>
                <FlatList
                  data={teamABench}
                  renderItem={renderTeamAItem}
                  keyExtractor={(item, index) => index}
                  ListFooterComponent={<View style={{ paddingBottom: 50 }} />}
                />
              </View>
              <View style={styles.playerContentBox}>
                <FlatList
                  data={teamBBench}
                  renderItem={renderTeamBItem}
                  keyExtractor={(item, index) => index}
                  ListFooterComponent={<View style={{ paddingBottom: 50 }} />}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      )}
     {/* Child Modal Component with Props */}
     <ModalPopup modalVisible={middleScreen}  />

      {/* </ScrollView> */}
      {loading ? (
        <LoadingPopup
          isVisible={loading}
          global_6players={global_6players}
          closePopup={() => setLoading(false)}
          navigation={navigation}
          teamA={teamA}
          teamB={teamB}
          teamABench={teamABench}
          teamBBench={teamBBench}
          isOpponent={isOpponent}
          userInfo={userInfo}
          userStoreGdetails={gameDetails}
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
