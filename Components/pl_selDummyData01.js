
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
          playerRoleType: "0",
          playerRole: "Opener",
          countryType: 2,
          teamName: "Ind"
        },
        {
          id: 2,
          name: "Player A2",
          playerRoleType: "0",
          playerRole: "Middle Order",
          countryType: 2,
          teamName: "Ind"
        },
        {
          id: 3,
          name: "Player A3",
          playerRoleType: "All-Rounder",
          playerRole: "Batting All-Rounder",
          countryType: 2,
          teamName: "Ind"
        },
        {
          id: 4,
          name: "Player A4",
          playerRoleType: "0",
          playerRole: "Fast Bowler",
          countryType: 2,
          teamName: "Ind"
        },
        {
          id: 5,
          name: "Player A5",
          playerRoleType: "Bowler",
          playerRole: "Spinner",
          countryType: 2,
          teamName: "Ind"
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
            <Avatar
              avatarStyle={{ borderWidth: 1, borderColor: "#fff", }}
              rounded
              source={
                item.imageId
                  ? {
                      uri: `https://cdn.sportmonks.com/images/cricket/players/${item.imageId}`,
                    }
                  : require("../../../assets/images/dummy.png")
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
          </View>
          <View style={{ marginTop: 5 }}>
              {
                item.countryType == 2 && (
                  <Text style={[styles.ortxt, styles.plyrtm, styles.plyrsd ,{backgroundColor:'#fff', color:"#2d2d2d", marginTop:3}]}>
                  {item.teamName}
                </Text>
                )
              }
                            {
                item.countryType == 1 && (
                  <Text style={[styles.ortxt, styles.plyrtm, styles.plyrsd ,]}>
                  {item.teamName}
                </Text>
                )
              }
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

  // Icon Style Function 16: 18
  const iconStyle = (roleType) => ({
    width: roleType === "3" ? 14 : 15.5,
    height: roleType === "3" ? 14 : 15.5,
    // position: "absolute",
    // bottom: 0,
    // left: 42,
    position: "absolute",
    left: 30,
    bottom: 1,
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
