///v2 app crash bug fixed

import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  PlusIcon,
  Player1,
  Player2,
  Player3,
  Player4,
  Player5,
  Player6,
  Player7,
  India,
  England,
  SortIcon,
} from "../../../assets";
import { useNavigation, useRoute } from "@react-navigation/native";
import { secondary } from "../../../style";
import { styles } from "./CaptainVcSelection.styles";
import { ScrollView } from "react-native";
import Services from "../../../Services/Services";
import UserStore from "../../stores/UserStore";
import AsyncStorage from "@react-native-community/async-storage";
import { inject, observer } from "mobx-react";
import WithProgress from "../LoadingOverlay/WithProgress";
import Functions from "../Functions";
import EventSource from "react-native-event-source";
import BottomNavigation from "../drawerStack/BottomNavigation";
import ReactMoE, { MoEProperties } from "react-native-moengage";

let userInfo,
  myPic,
  userPF,
  interval,
  timeOut,
  gameDetails = {},
  loading = false;
const CaptainViceCaptainSelection = ({
  navigation,
  showProgress,
  hideProgress,
}) => {
  // const navigation = useNavigation();

  const [selectedCaptainId, setSelectedCaptainId] = useState("");
  const [selectedViceCaptainId, setSelectedViceCaptainId] = useState("");
  const [isOpponent, setIsOpponent] = useState(false);
  const [playerData1, setPlayerData1] = useState([]);
  const [currentTime, setCurrentTime] = useState("1:00");
  const routes = useRoute();
  const newGameId = routes.params;

  if (UserStore) {
    const profile = UserStore.getuserPF();
    if (profile) {
      myPic = profile?.replace(/['"]+/g, "");
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log(routes);
      gameDetails = UserStore.selectedGameData;
      AsyncStorage.setItem("pl6-socket", "null");
      getData();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    interval = setInterval(updateTime, 1000);
    return () => {
      clearInterval(interval);
      if (timeOut) {
        clearTimeout(timeOut);
      }
    };
  }, [navigation]);

  useEffect(() => {
    if (currentTime === "00:05") {
      saveCaptainAndVC();
    }
  }, [currentTime]);

  const updateTime = () => {
    setCurrentTime((prevTime) => {
      const [minutes, seconds] = prevTime.split(":").map(Number);
      let newMinutes = minutes;
      let newSeconds = seconds - 1;

      if (newSeconds < 0) {
        newMinutes -= 1;
        newSeconds = 59;
      }

      if (newMinutes < 0) {
        newMinutes = 0;
        newSeconds = 0;
      }

      return `${String(newMinutes).padStart(2, "0")}:${String(
        newSeconds
      ).padStart(2, "0")}`;
    });
  };

  const getData = async () => {
    showProgress();
    userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
    userPF = JSON.parse(await AsyncStorage.getItem("player6-profile"));
    Services.getInstance()
      .finalSixPlayers(
        userInfo.userId,
        parseInt(newGameId.newGameId),
        // gameDetails.gameId,
        userInfo.accesToken
      )
      .then((result) => {
        console.log("Vc api result", result);
        console.log(
          "--gmaeID--",
          newGameId,
          "userInfo.userId",
          userInfo.userId
        );
        Functions.getInstance().Toast("error", JSON.stringify(result)); //debuging in real device
        if (result.status == 200) {
          setPlayerData1(result.list);
        }
        hideProgress();
      });
  };

  const selectCaptain = (item) => {
    if (item.playerId !== selectedViceCaptainId) {
      Functions.getInstance().fireAdjustEvent("4hldkl");
      Functions.getInstance().fireFirebaseEvent("SelectCaptain");
      let properties = new MoEProperties();
      properties.addAttribute("Selected Captain", true);
      ReactMoE.trackEvent("Captain Selection", properties);
      setSelectedCaptainId(item.playerId);
    }
  };

  const selectViceCaptain = (item) => {
    if (item.playerId !== selectedCaptainId) {
      Functions.getInstance().fireAdjustEvent("o1g4nw");
      Functions.getInstance().fireFirebaseEvent("SelectViceCaptain");
      let properties = new MoEProperties();
      properties.addAttribute("Vice Captain Selected", true);
      ReactMoE.trackEvent("Vice Captain Selection", properties);
      setSelectedViceCaptainId(item.playerId);
    }
  };

  const saveCaptainAndVC = () => {
    if (routes.name == "CaptainViceCaptainSelection") {
      showProgress();
      if (timeOut) {
        clearTimeout(timeOut);
      }
      clearInterval(interval);
      const obj = {
        gameId: gameDetails.gameId,
        capId: selectedCaptainId,
        viCapId: selectedViceCaptainId,
        selTimeId: "true",
      };
      console.log(obj);
      Services.getInstance()
        .selectCaptainAndVC(
          obj,
          userInfo.userId,
          gameDetails.gameId,
          userInfo.accesToken
        )
        .then((result) => {
          console.log(result);
          if (result.status == 200) {
            hideProgress();
            Functions.getInstance().Toast(
              "success",
              "Team details have been updated"
            );
            // navigation.navigate("PlayerSelection",{screen : 'GoodLuck'});
            navigation.navigate("GoodLuck");
          } else {
            hideProgress();
            navigation.navigate("GoodLuck");
          }
        });
    }
  };

  const renderCountryBoxHeader = () => {
    return (
      <View style={[styles.countryBoxTopHeader]}>
        <View style={styles.teamLeft}>
          <View style={styles.teamsImage}>
            {/* <Image style={styles.teamsImageStyle} source={India} /> */}
            {userPF?.profileImg ==
            "https://s3.ap-south-1.amazonaws.com/player6sports/pl6Uplods/" ? (
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

        <View style={[styles.teamRight]}>
          <View style={[styles.timerBox]}>
            <Text style={styles.timerText}>{currentTime}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => saveCaptainAndVC()}>
          <View style={{ position: "relative", top: -10, left: 12 }}>
            <Text style={[styles.nxtbtn]}>Next</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item, drag, isActive }) => {
    const isSelectedCaptain = selectedCaptainId === item?.player_id;
    const isSelectedViceCaptain = selectedViceCaptainId === item?.player_id;
    return (
      <View style={styles.plyrmain}>
        <View style={styles.plyrinfo}>
          <TouchableOpacity>
            <View style={[styles.plyrprflinfo, styles.srtby]}>
              <View style={styles.plyrprfl}>
                {item.imageId == "" ? (
                  <Image
                    style={styles.tmsdimg}
                    source={require("../../../assets/images/dummy.png")}
                  />
                ) : (
                  <Image
                    style={styles.tmsdimg}
                    source={{
                      uri: `https://cdn.sportmonks.com/images/cricket/players/${item.imageId}`,
                    }}
                  />
                )}
              </View>
              <View>
                <Text
                  style={[
                    styles.teamnm,
                    styles.wnrtxt,
                    styles.tmname,
                    styles.plyrname,
                    styles.plnm,
                    { width: 100 },
                  ]}
                >
                  {item.name}
                </Text>
                <Text style={[styles.ortxt, styles.plyrtm, { width: 60 }]}>
                  {item.teamName}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={[styles.srtby, styles.rnopt]}>
            <View style={[styles.topo, styles.hdoptns]}>
              <Text style={styles.ortxt}>{item.avg}</Text>
            </View>
          </View>
          <View style={[styles.srtby, styles.rnoptn]}>
            <View style={[styles.topo, styles.hdoptns]}>
              <Text style={styles.ortxt}>{item.hs}</Text>
            </View>
          </View>

          <View style={[styles.srtby, styles.rnoptn]}>
            <View style={[styles.srtby, styles.rnoptn, styles.cvcslct]}>
              <TouchableOpacity onPress={() => selectCaptain(item)}>
                <View
                  style={[
                    styles.cslct,
                    (item.isCap == "1" && isOpponent === false) ||
                    (selectedCaptainId == item.playerId && isOpponent === false)
                      ? { backgroundColor: secondary }
                      : (isOpponent === true && item.isCap == "1") ||
                        (selectedCaptainId == item.playerId &&
                          isOpponent === true)
                      ? { backgroundColor: "#e79013" }
                      : { backgroundColor: "#606060" },
                  ]}
                >
                  <Text
                    style={[
                      styles.ortxt,
                      styles.ctxt,
                      item.isCap == "1"
                        ? { color: "#fff" }
                        : { color: "#2d2d2d" },
                    ]}
                  >
                    C
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectViceCaptain(item)}>
                <View
                  style={[
                    styles.cslct,
                    (item.isvCap == "1" && isOpponent === false) ||
                    (selectedViceCaptainId == item.playerId &&
                      isOpponent === false)
                      ? { backgroundColor: secondary }
                      : (isOpponent === true && item.isvCap == "1") ||
                        (selectedViceCaptainId == item.playerId &&
                          isOpponent === true)
                      ? { backgroundColor: "#e79013" }
                      : { backgroundColor: "#606060" },
                  ]}
                >
                  <Text
                    style={[
                      styles.ortxt,
                      styles.ctxt,
                      item.isvCap == "1"
                        ? { color: "#fff" }
                        : { color: "#2d2d2d" },
                    ]}
                  >
                    VC
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">
        <View style={{ backgroundColor: "#111", marginTop: 60 }}>
          <View style={[styles.headerContainer]}>
            <Text style={[styles.headingdText]}>
              {userPF ? userPF?.name : ""} Team Selection
            </Text>
            <View style={styles.captanTxt}>
              <View>
                <Text style={styles.cpttxt}>Captain 2x</Text>
              </View>
              <View>
                <Text style={styles.cpttxt}>Vice Captain 1.5x</Text>
              </View>
            </View>
            <View style={[styles.countryBox]}>{renderCountryBoxHeader()}</View>
            <View style={[styles.tmarmain, styles.plyrhd]}>
              <View style={[styles.tmarlist, styles.plyrshd]}>
                <View style={styles.srtby}>
                  <View style={[styles.topo, styles.hdoptns]}>
                    <Text style={styles.ortxt}>Players</Text>
                  </View>
                </View>
                <View style={[styles.srtby, styles.rnoptn, { marginLeft: 80 }]}>
                  <View style={[styles.topo, styles.hdoptns]}>
                    <Text style={styles.ortxt}>Avg</Text>
                  </View>
                </View>
                <View style={[styles.srtby, styles.rnoptn]}>
                  <View style={[styles.topo, styles.hdoptns]}>
                    <Text style={styles.ortxt}>HS</Text>
                  </View>
                </View>
                <View style={[styles.srtby, styles.rnoptn]}>
                  <View style={[styles.topo, styles.hdoptns]}>
                    <Text style={styles.ortxt}>Pick</Text>
                  </View>
                </View>
              </View>
            </View>
            <FlatList
              nestedScrollEnabled={true}
              data={playerData1}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={<View style={{ paddingBottom: 180 }} />}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WithProgress(
  inject("UserStore")(observer(CaptainViceCaptainSelection))
);
