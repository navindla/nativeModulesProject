
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
import {
  CommonActions,
} from '@react-navigation/native';
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
  //  const [userInfo, setUserInfo] = useState(null);

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

  const fetchUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("player6-userdata");
      if (storedUserData) {
        userInfo = JSON.parse(storedUserData);
        console.log("User Info NEW CODE--------:", userInfo); // Log the user info
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

    // sets state all req flds
    ws.onmessage = (event) => {
      try {
        console.log("--raw-event--", event);
        const parsedData = JSON.parse(event.data);
        // console.log(parsedData);

        // Extract and set the new state variables
        //  parsedData.data?.myFinal
        const myStatusData = parsedData.data?.myStatus;
        const opnStatusData = parsedData.data?.opnStatus;
        const myFinalData = parsedData.data?.myFinal;
        const opFinalData = parsedData.data?.opFinal;

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

        // Update globalList  both final data arrays
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

  const process1 = () => {
    // console.log(gameDetails);
    if (gameDetails?.tossWinner == userInfo.userId) {
      setLoading(false);
    }
    if (gameDetails?.tossWinner != userInfo.userId) {
      setLoading(true);
    }
    if (gameDetails?.userTwo == userInfo.userId) {
      setIsOpponent(true);
    }
  };

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
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, currentTime]);

  ////////// nov 25 ///////////////
  // Effect to update needToPick state based on myStatus
  useEffect(() => {
    if (myStatus.need_to_pick !== undefined) {
      //   setNeedToPick(myStatus.need_to_pick);
      setmyTurn(myStatus.need_to_pick);
      // console.log('setmyTurn-->',myStatus.need_to_pick)
      console.log("myStatus userID-->", myStatus.userId);
      console.log("myStatus need_to_pick-->", myStatus.need_to_pick);
    }
  }, [myStatus]);

  //uncmnt

  useEffect(() => {
    if (myTurn) {
      setLoading(false);
      setCurrentTime("00:30"); // Ensure UI reflects the reset immediately
      //  console.log('teamA------ data ------',teamA)
    } else {
      if (teamA.length > 0) {
        setLoading(true);
        setCurrentTime("00:30"); // Ensure UI reflects the reset immediately
      }
    }
  }, [myTurn]);

  useEffect(
    ()=>{
      if (global_6players.length === 12) {
        // Navigate to CaptainViceCaptainSelection
        navigation.navigate('CaptainViceCaptainSelection', {newGameId: UserStore.selectedGameData.gameId});
      }
    },[global_6players]
  )



   // v2.0
  const callPlayer11Data = async () => {
    showProgress();
    userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
    userPF = JSON.parse(await AsyncStorage.getItem("player6-profile"));
  
    const myPromise = new Promise((resolve, reject) => {
      const sysTime = getCurrentTime();
  
      Services.getInstance()
        .getPlayersData(
          userInfo.userId,
          gameDetails.gameId,
          userInfo.accesToken,
          sysTime
        )
        .then((result) => {
          console.log(
            "1st API result.playerSelection trigs", 
            result.playerSelection
          );
  
          if (!result.playerSelection) {
            navigation.replace('RunningMatch');
            hideProgress();
            return; // Exit further execution
          }
  
          if (result.status == 200) {
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
  
            resolve("true");
          } else {
            reject("false");
          }
        })
        .catch((error) => {
          console.error("Error fetching player data", error);
          reject("false");
        });
    });
  
    hideProgress();
    return myPromise;
  };
  

  // const callPlayer11Data = async () => {
  //   showProgress();
  //   userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
  //   userPF = JSON.parse(await AsyncStorage.getItem("player6-profile"));
  //   const myPromise = new Promise((resolve, reject) => {
  //     const sysTime = getCurrentTime();
  //     Services.getInstance()
  //       .getPlayersData(
  //         userInfo.userId,
  //         gameDetails.gameId,
  //         userInfo.accesToken,
  //         sysTime
  //       )
  //       .then((result) => {
  //         //  console.log(`------------------------->    Players List from user ${userInfo.userId} <-------------------------------------`);
  //         console.log("1stttttttttttt api result.playerSelection      trigs", 
  //           result.playerSelection
  //          // result
  //         );
  //         preDefinedPlayers = [];
  //         if (result.status == 200) {
  //           setIsRunning(true); // start timer 00:30
  //           selectionTime = result.selStartTm;
  //           setTeamA(result.teamA11);
  //           setTeamB(result.teamB11);
  //           setTeamABench(result.teamABan);
  //           setTeamBBench(result.teamBBan);
  //           setopponentName(result.opnName);
  //           setopponentPic(result.opnImg);
  //           setMyDefaultPlayers(result.myPlayers);
  //           tossWinnerLastPic = result.oponLPlayer.playerId;
  //           if (result.myPlayers.length > 0) {
  //             preDefinedPlayers = result.myPlayers[0];
  //           }
  //           filterTheSelectedData(
  //             result.teamA11,
  //             result.teamB11,
  //             result.teamABan,
  //             result.teamBBan
  //           );
  //           resolve("true");
  //         } else {
  //           reject("false");
  //         }
  //       });
  //   });
  //   hideProgress();
  //   return myPromise;
  // };

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

            return (
              <View
                key={index}
                //{player ? player.userId : index}
                style={[styles.pntitem, styles.ppicked]}
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
                style={[styles.pntitem, styles.opicked]}
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
      <View
        style={[
          styles.tmplyrlft,
          getBorderColor(item, global_6players, userInfo),
        ]}
      >
        {/* Player Left Section */}
        <View style={styles.plyrlft}>
          <View style={[styles.plyrprfl, styles.plyrlftprfl]}>
            <Image
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
        <TouchableOpacity
          style={[
            styles.adplyr,
            {
              backgroundColor: isPlayerDisabled ? "red" : "gray",
            },
          ]}
          disabled={isPlayerDisabled}
          onPress={() => {
            trackSelectionEvent();
            handlePlayerClick(index, 1, item);
          }}
        >
          {isPlayerDisabled ? (
            <Image style={{ width: 8, height: 8 }} source={TickIcon} />
          ) : (
            <Image style={styles.adplusimg} source={PlusIcon} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderTeamBItem = ({ item, index }) => {
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
      <View
        style={[
          styles.tmplyrlft,
          getBorderColor(item, global_6players, userInfo),
        ]}
      >
        {/* Player Left Section */}
        <View style={styles.plyrlft}>
          <View style={[styles.plyrprfl, styles.plyrlftprfl]}>
            <Image
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
        <TouchableOpacity
          style={[
            styles.adplyr,
            {
              backgroundColor: isPlayerDisabled ? "red" : "gray",
            },
          ]}
          disabled={isPlayerDisabled}
          onPress={() => {
            trackSelectionEvent();
            handlePlayerClick(index, 2, item);
          }}
        >
          { isPlayerDisabled ? (
            <Image style={{ width: 8, height: 8 }} source={TickIcon} />
          ) : (
            <Image style={styles.adplusimg} source={PlusIcon} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

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

