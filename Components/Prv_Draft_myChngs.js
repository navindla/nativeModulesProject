

import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
  AppState,
  Pressable,
  ImageBackground,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Tab, TabView } from "@rneui/themed";
import { Avatar, Badge, Icon, withBadge } from "@rneui/themed";
import { styles } from "./Draft.styles";
import { styles as GoodluckStyles } from "./GoodLuck.styles";
import {
  Like,
  Pitch,
  Player1,
  Player2,
  Player3,
  Player4,
  Player5,
  Player6,
} from "../../../assets";

import WithProgress from "../LoadingOverlay/WithProgress";
import AsyncStorage from "@react-native-community/async-storage";
import Functions from "../Functions";
import UserStore from "../../stores/UserStore";
import { Image } from "react-native";
import Services from "../../../Services/Services";
import { TickIcon, dummyImage } from "../../../assets";
import ReactMoE, { MoEProperties } from "react-native-moengage";

const renderContestContent = (imageName, playerName, text) => {
  return (
    <View style={GoodluckStyles.tmsitem}>
      <View>
        <Avatar
          avatarStyle={{ borderWidth: 1, borderColor: "#fff" }}
          rounded
          source={{
            uri:
              "https://www.wplt20.com/static-assets/images/players/68442.png?v=50.45",
          }}
          size="medium"
        />

        <Image
          source={
            playerName.toLowerCase().startsWith("m")
              ? require("./Icons/cricketBall.png")
              : require("./Icons/bat10.png")
          }
          style={{
            //  width: 16, // Adjust the size as needed
            //  height: 16, // Adjust the size as needed
            width: playerName.toLowerCase().startsWith("s") ? 16 : 18,
            height: playerName.toLowerCase().startsWith("s") ? 16 : 18,
            position: "absolute",
            bottom: 0,
            left: 40,
            // left : item.item.name.toLowerCase().startsWith("s") ? 40: 50
          }}
        />

        {/* <View
          style={{
            width: 20, // Outer container width (background circle)
            height: 20, // Outer container height (background circle)
            backgroundColor: "white", // Background color (white circle)
            borderRadius: 10, // Half of the width/height to make it a perfect circle
            justifyContent: "center", // Center the image vertically
            alignItems: "center", // Center the image horizontally
            position: "absolute",
            bottom: 0,
            left: 40, // Adjust the position as needed
            padding: 3, //new
          }}
        >
          <Image
            source={require("./Icons/bat9.png")} // Local smaller image
            style={{
              width: 14.3, // Image width
              height: 14.3, // Image height
            }}
          />
        </View> */}
      </View>
      {text && <Text style={[GoodluckStyles.cvctxt, {paddingTop: 4 , backgroundColor: '#303030'}]}>{text}</Text>}
      <Text style={[GoodluckStyles.plyrnames, { fontSize: 10 }]}>
        {playerName}
      </Text>
    </View>
  );
};

//////// orgnl code ////////////////////////////////////////
// const renderContestContent = (imageName, playerName, text) => {
//   return (
//     <View style={GoodluckStyles.tmsitem}>
//       <View style={[GoodluckStyles.tmsplyr, { marginBottom: 7 }]}>
//         {imageName == "" ? (
//           <Image
//             style={[GoodluckStyles.tmsdimg, GoodluckStyles.plyrimg]}
//             source={require("../../../assets/images/dummy.png")}
//           />
//         ) : (
//           <Image
//             style={[GoodluckStyles.tmsdimg, GoodluckStyles.plyrimg]}
//             source={{
//               uri: `https://cdn.sportmonks.com/images/cricket/players/${imageName}`,
//             }}
//           />
//         )}
//       </View>
//       {text && <Text style={GoodluckStyles.cvctxt}>{text}</Text>}
//       <Text style={[GoodluckStyles.plyrnames]}>{playerName}</Text>
//     </View>
//   );
// };




let userInfo, myPic, userPF;

const DraftPreview = ({ navigation, showProgress, hideProgress }) => {
  const gameDetails = UserStore.getselectedGameData();
  const [index, setIndex] = useState(0);
  const [yourList, setYourList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [opponentList, setopponentList] = useState([]);
  const [opponentName, setopponentName] = useState("");
  const [opponentPic, setopponentPic] = useState("");
  const [isOpponent, setIsOpponent] = useState(false);
  const [strips, setstrips] = useState([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ]);
  const [tb1color, settb1color] = useState("#279bff");
  const [tb2color, settb2color] = useState("");
  const [currentTime, setCurrentTime] = useState(
    Functions.getInstance().getTimer(gameDetails?.startTime)
  );

  if (UserStore) {
    const profile = UserStore.getuserPF();
    if (profile) {
      myPic = profile?.replace(/['"]+/g, "");
    }
  }

  useEffect(() => {
    // gameDetails = UserStore.selectedGameData;
    // AsyncStorage.setItem("pl6-socket", "null");
    const dummyPlayerList = [
      {
        avg: 0,
        hs: 0,
        imageId: "",
        isCap: "1",
        isvCap: "0",
        name: "Habibullah Shahmuradi",
        orderId: "1",
        playerId: "3742",
        teamName: "ASHS",
      },
      {
        avg: 0,
        hs: 0,
        imageId: "",
        isCap: "0",
        isvCap: "0",
        name: "Noor Ahmad",
        orderId: "2",
        playerId: "3744",
        teamName: "ASHS",
      },
      {
        avg: "0",
        hs: "0",
        imageId: "",
        isCap: "0",
        isvCap: "0",
        name: "Mecit Ozturk",
        orderId: "3",
        playerId: "2292",
        teamName: "ASHS",
      },
      {
        avg: 0,
        hs: 0,
        imageId: "",
        isCap: "0",
        isvCap: "0",
        name: "Mehmet Cinar",
        orderId: "4",
        playerId: "3013",
        teamName: "ASHS",
      },
      {
        avg: 0,
        hs: 0,
        imageId: "",
        isCap: "0",
        isvCap: "0",
        name: "Md Al Mamun",
        orderId: "5",
        playerId: "3725",
        teamName: "SOS",
      },
      {
        avg: "0",
        hs: "0",
        imageId: "",
        isCap: "0",
        isvCap: "1",
        name: "Mathew Johnson",
        orderId: "6",
        playerId: "3724",
        teamName: "SOS",
      },
      {
        avg: 0,
        hs: 0,
        imageId: "",
        isCap: "1",
        isvCap: "0",
        name: "Habibullah Shahmuradi",
        orderId: "1",
        playerId: "3743",
        teamName: "ASHS",
      },
      {
        avg: 0,
        hs: 0,
        imageId: "",
        isCap: "0",
        isvCap: "0",
        name: "Noor Ahmad",
        orderId: "2",
        playerId: "3745",
        teamName: "ASHS",
      },
      {
        avg: "0",
        hs: "0",
        imageId: "",
        isCap: "0",
        isvCap: "0",
        name: "Mecit Ozturk",
        orderId: "3",
        playerId: "2293",
        teamName: "ASHS",
      },
      {
        avg: 0,
        hs: 0,
        imageId: "",
        isCap: "0",
        isvCap: "0",
        name: "Mehmet Cinar",
        orderId: "4",
        playerId: "3014",
        teamName: "ASHS",
      },
      {
        avg: 0,
        hs: 0,
        imageId: "",
        isCap: "0",
        isvCap: "0",
        name: "Md Al Mamun",
        orderId: "5",
        playerId: "3726",
        teamName: "SOS",
      },
      {
        avg: "0",
        hs: "0",
        imageId: "",
        isCap: "0",
        isvCap: "1",
        name: "Mathew Johnson",
        orderId: "6",
        playerId: "3725",
        teamName: "SOS",
      },
    ];
    setPlayerList(dummyPlayerList);
    // getSelectedFinalPleyerList();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation?.addListener("focus", () => {
      setIndex(0);
      getData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getData = async () => {
    showProgress();
    userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
    userPF = JSON.parse(await AsyncStorage.getItem("player6-profile"));
    Functions.getInstance()
      .offlineSelectedDraftPlayers()
      .then((result) => {
        setYourList(result); // orginal code
      });
    if (gameDetails?.userTwo == userInfo.userId) {
      setIsOpponent(true);
      Services.getInstance()
        .getAlreadyDraftedPlayers(
          userInfo.userId,
          gameDetails?.userOne,
          gameDetails.gameId,
          userInfo.accesToken
        )
        .then((result) => {
          hideProgress();
          if (result.status == 200) {
            setopponentList(result.playerList);
            setopponentName(result.name);
            setopponentPic(result.profile);
          } else {
            hideProgress();
          }
        });
    } else {
      Services.getInstance()
        .getAlreadyDraftedPlayers(
          userInfo.userId,
          gameDetails?.userTwo,
          gameDetails.gameId,
          userInfo.accesToken
        )
        .then((result) => {
          hideProgress();
          if (result.status == 200) {
            setopponentList(result.playerList);
            setopponentName(result.name);
            setopponentPic(result.profile);
          } else {
            hideProgress();
          }
        });
    }
  };

  const handleButton1Press = () => {
    setIndex(0);
    settb1color("#279bff");
    settb2color("");
  };

  const handleButton2Press = () => {
    showProgress();
    settb1color("");
    settb2color("#279bff");
    setIndex(1);
    if (gameDetails?.userTwo == userInfo.userId) {
      setIsOpponent(true);
      Services.getInstance()
        .getAlreadyDraftedPlayers(
          userInfo.userId,
          gameDetails?.userOne,
          gameDetails.gameId,
          userInfo.accesToken
        )
        .then((result) => {
          hideProgress();
          console.log(result);
          if (result.status == 200) {
            //  setopponentList(result.playerList);
            //  setopponentName(result.name);
            console.log("API CALL", result.profile);
            //  setopponentPic(result.profile);
          } else {
            hideProgress();
          }
        });
    } else {
      Services.getInstance()
        .getAlreadyDraftedPlayers(
          userInfo.userId,
          gameDetails?.userTwo,
          gameDetails.gameId,
          userInfo.accesToken
        )
        .then((result) => {
          hideProgress();
          console.log(result);
          if (result.status == 200) {
            //  setopponentList(result.playerList);
            //  setopponentName(result.name);
            console.log("API CALL", result.profile);
            //  setopponentPic(result.profile);
          } else {
            hideProgress();
          }
        });
    }
  };

  const playersData = (item) => {
    return (
      <View style={styles.plyrmain}>
        <View style={styles.plyrinfo}>
          <View style={[styles.plyrprflinfo, styles.srtby]}>
            <View style={styles.plyrprfl}>
              {item.item.image == "" ? (
                <Image
                  style={styles.tmsdimg}
                  source={require("../../../assets/images/dummy.png")}
                />
              ) : (
                <Image
                  style={styles.tmsdimg}
                  source={{
                    uri: `https://cdn.sportmonks.com/images/cricket/players/${item.item.image}`,
                  }}
                />
              )}
            </View>
            <View style={styles.plyrtxt}>
              <Text
                style={[
                  styles.teamnm,
                  styles.wnrtxt,
                  styles.tmname,
                  styles.plyrname,
                ]}
              >
                {item.item.name}
              </Text>
              <Text style={[styles.ortxt, styles.plyrtm]}>
                {item.item.country}
              </Text>
            </View>
          </View>

          <View style={[styles.srtby, styles.rnoptn]}>
            <View style={[styles.topo, styles.hdoptns]}>
              <Text style={styles.ortxt}>{item.item.avg}</Text>
            </View>
          </View>
          <View style={[styles.srtby, styles.rnoptn]}>
            <View style={[styles.topo, styles.hdoptns]}>
              <Text style={styles.ortxt}>{item.item.hs}</Text>
            </View>
          </View>
          <>
            {item.item.draftId !== "" ? (
              <Pressable
                style={[styles.srtby, styles.rnoptn]}
                onPress={() => onPicked(item.item, false)}
              >
                <View
                  style={[
                    styles.topo,
                    styles.hdoptns,
                    styles.pkop,
                    styles.alpkd,
                  ]}
                >
                  <Text style={styles.ortxt}>Picked</Text>
                </View>
              </Pressable>
            ) : (
              <Pressable
                style={[
                  styles.topo,
                  styles.hdoptns,
                  styles.pkop,
                  isOpponent ? styles.orngpick : {},
                ]}
                onPress={() => onPicked(item.item, true)}
              >
                <Image
                  style={[styles.tmsdimg, styles.picon]}
                  source={PlusIcon}
                />
                <Text style={styles.ortxt}>Pick</Text>
              </Pressable>
            )}
          </>
        </View>
      </View>
    );
  };

  //////////////// orgnl render item code //////////////////////////
  // const playersData = (item) =>{
  //   return(
  //     <View style={styles.plyrmain}>
  //         <View style={styles.plyrinfo}>

  //               <View style={[styles.plyrprflinfo,styles.srtby]}>
  //                     <View style={styles.plyrprfl}>
  //                     {item.item.image == "" ? <Image style={styles.tmsdimg} source={require('../../../assets/images/dummy.png')}/>
  //                         :
  //                         <Image style={styles.tmsdimg} source={{ uri: `https://cdn.sportmonks.com/images/cricket/players/${item.item.image}` }}/>
  //                     }
  //                     </View>
  //                     <View style={styles.plyrtxt}>
  //                         <Text style={[styles.teamnm,styles.wnrtxt,styles.tmname,styles.plyrname]}>{item.item.name}</Text>
  //                         <Text style={[styles.ortxt,styles.plyrtm]}>{item.item.country}</Text>
  //                     </View>
  //               </View>

  //             <View style={[styles.srtby,styles.rnoptn]}>
  //             <View style={[styles.topo,styles.hdoptns]}>
  //               <Text style={styles.ortxt}>{item.item.avg}</Text>
  //             </View>
  //           </View>
  //           <View style={[styles.srtby,styles.rnoptn]}>
  //             <View style={[styles.topo,styles.hdoptns]}>
  //               <Text style={styles.ortxt}>{item.item.hs}</Text>
  //             </View>
  //           </View>
  //           <>
  //               {item.item.draftId !== "" ? (
  //                 <Pressable
  //                   style={[styles.srtby, styles.rnoptn]}
  //                   onPress={() => onPicked(item.item, false)}>
  //                   <View
  //                     style={[
  //                       styles.topo,
  //                       styles.hdoptns,
  //                       styles.pkop,
  //                       styles.alpkd,
  //                     ]}>
  //                     <Text style={styles.ortxt}>Picked</Text>
  //                   </View>
  //                 </Pressable>
  //               ) : (
  //                 <Pressable
  //                   style={[
  //                     styles.topo,
  //                     styles.hdoptns,
  //                     styles.pkop,
  //                     isOpponent ? styles.orngpick : {},
  //                   ]}
  //                   onPress={() => onPicked(item.item, true)}>
  //                   <Image
  //                     style={[styles.tmsdimg, styles.picon]}
  //                     source={PlusIcon}
  //                   />
  //                   <Text style={styles.ortxt}>Pick</Text>
  //                 </Pressable>
  //               )}
  //             </>

  //         </View>
  //     </View>
  //   )
  // }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar backgroundColor="#111111" />
      <View style={styles.exvw}>
        {index == 0 ? (
          <View style={styles.teamtab}>
            <TouchableOpacity
              onPress={() => {
                Functions.getInstance().fireAdjustEvent("fj3sft");
                Functions.getInstance().fireFirebaseEvent("YourTeamPreview");
                let properties = new MoEProperties();
                properties.addAttribute("Preview Own Team", true);
                ReactMoE.trackEvent("Preview", properties);
                handleButton1Press();
              }}
              style={[styles.team, { backgroundColor: "#279bff" }]}
            >
              <View>
                <Text style={styles.teamTitle}>Your Team test1</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.team, { backgroundColor: "" }]}
              onPress={() => {
                // Functions.getInstance().fireAdjustEvent("e9wkxm");
                // Functions.getInstance().fireFirebaseEvent("OpponentTeamPreview");
                // let properties = new MoEProperties();
                // properties.addAttribute("Preview Opponent Team", true);
                // ReactMoE.trackEvent("Preview", properties);
                // handleButton2Press()
                handleButton1Press();
              }}
            >
              <View>
                <Text style={styles.teamTitle}>Opponent Team</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          ""
        )}

        {index == 1 ? (
          <View style={styles.teamtab}>
            <TouchableOpacity
              onPress={() => {
                Functions.getInstance().fireAdjustEvent("fj3sft");
                Functions.getInstance().fireFirebaseEvent("YourTeamPreview");
                let properties = new MoEProperties();
                properties.addAttribute("Preview Own Team", true);
                ReactMoE.trackEvent("Preview", properties);
                handleButton1Press();
              }}
              style={[styles.team, { backgroundColor: "" }]}
            >
              <View>
                <Text style={styles.teamTitle}>Your Team test2</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.team, { backgroundColor: "#279bff" }]}
              onPress={() => {
                Functions.getInstance().fireAdjustEvent("e9wkxm");
                Functions.getInstance().fireFirebaseEvent(
                  "OpponentTeamPreview"
                );
                let properties = new MoEProperties();
                properties.addAttribute(
                  "Preview Opponent Team",
                  userInfo.userId
                );
                ReactMoE.trackEvent("Preview", properties);
                handleButton2Press();
              }}
            >
              <View>
                <Text style={styles.teamTitle}>Opponent Team</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          ""
        )}

        <ScrollView style={{ flex: 1 }}>
          <ImageBackground
            source={Pitch}
            style={GoodluckStyles.backgroundImage}
          >
            <Text style={GoodluckStyles.textContent}>
              {" "}
              {userPF ? userPF?.name : ""} Team Selection
            </Text>
            <View style={GoodluckStyles.teamSelectionMainContainer}>
              <View
                style={[
                  {
                    borderWidth: 1.5,
                    borderColor: "#fff",
                    borderRadius: 50,
                    // paddingTop: 85,
                    paddingBottom: 12.3,
                  },
                ]}
              >
                <FlatList
                  data={playerList}
                  numColumns={2}
                  renderItem={({ item, index }) => {
                    return renderContestContent(
                      item?.imageId ?? "",
                      item?.name ?? "",
                      index + 1
                      // item?.isCap == "1" ? "C" : item?.isvCap == "1" ? "VC" : ""
                    );
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    Functions.getInstance().fireAdjustEvent("fg170o");
                    Functions.getInstance().fireFirebaseEvent("GoodLuckButton");
                    let properties = new MoEProperties();
                    properties.addAttribute("clicked", true);
                    ReactMoE.trackEvent("Good luck", properties);
                    navigation.navigate("RunningMatch");
                  }}
                ></TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default WithProgress(DraftPreview);
