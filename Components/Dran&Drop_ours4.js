// save workng tested,
// added mbtm, all long prss tested wrkng

import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
  FlatList,
  StatusBar,
  AppState,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import DragList from "react-native-draglist";
import { styles } from "./Draft.styles";
import UserStore from "../../stores/UserStore";
import AsyncStorage from "@react-native-community/async-storage";
import Functions from "../Functions";
import WithProgress from "../LoadingOverlay/WithProgress";
import { PreviewIcon, SaveIcon, TickIcon, dummyImage } from "../../../assets";
import Services from "../../../Services/Services";
import { secondary } from "../../../style";
import DraftSuccessPopup from "./DraftSuccessPopup";
import ReactMoE, { MoEProperties } from "react-native-moengage";

import { Avatar, Badge, Icon, withBadge } from "@rneui/themed";
import Iconicons from "react-native-vector-icons/Fontisto";
import Iconicons2 from "react-native-vector-icons/MaterialCommunityIcons";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconFeathr from "react-native-vector-icons/Feather";

let userInfo, myPic, userPF;
const DragNDrop = ({ navigation, showProgress, hideProgress }) => {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");

  // Responsive margins
  const MARGIN_LEFT_5_playerTag = SCREEN_WIDTH * 0.07;
  const MARGIN_LEFT_5 = SCREEN_WIDTH * 0.05; // 5% of screen width
  const MARGIN_RIGHT_8 = SCREEN_WIDTH * 0.1; // 8% of screen width

  const gameDetails = UserStore.getselectedGameData();
  const [draftPlayers, setDraftPlayers] = useState([]);
  const [positionedPlayersPrvList, setPositionedPlayersPrvList] = useState([]);
  const [selectedPlayer, updatePlayer] = useState([]);
  const [isOpponent, setIsOpponent] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [isPreviewDisabled, setisPreviewDisabled] = useState(true);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(
    Functions.getInstance().getTimer(gameDetails?.startTime)
  );
  const timerRef = useRef(null);
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
  const [cDragId, setCDragId] = useState("");
  const [dragShadowColor, setDragShadowColor] = useState(secondary);

  if (UserStore) {
    const profile = UserStore.getuserPF();
    if (profile) {
      myPic = profile?.replace(/['"]+/g, "");
    }
  }

  useEffect(() => {
    // };
  }, [cDragId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getData();
    });
    // const handleAppStateChange = (nextAppState) => {
    //   if (nextAppState === 'active') {
    //     getData();
    //   }
    // };
    // AppState.addEventListener('change', handleAppStateChange);
    return () => {
      unsubscribe();
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const getData = async () => {
    showProgress();
    userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
    userPF = JSON.parse(await AsyncStorage.getItem("player6-profile"));
    // Functions.getInstance().checkExpiration(userInfo.userId, userInfo.refToken, navigation);
    if (gameDetails?.userTwo == userInfo.userId) {
      setIsOpponent(true);
      setDragShadowColor("#e79013");
    }
    Services.getInstance()
      .getAlreadyDraftedPlayers(
        userInfo.userId,
        userInfo.userId,
        gameDetails.gameId,
        userInfo.accesToken
      )
      .then((result) => {
        hideProgress();
        console.log("Drag and Drop Page Get API: ", result);
        if (result.status == 200) {
          // console.log(result);
          AsyncStorage.setItem(
            "Selected-Draft-Players",
            JSON.stringify(result.playerList)
          );
          Functions.getInstance()
            .offlineSelectedDraftPlayers()
            .then((result) => {
              setDraftPlayers(result);
              defaultPlayersData(result);
              // hideProgress();
            });
          if (result.isDrafted == true) {
            setisPreviewDisabled(false);
          } else {
            setisPreviewDisabled(true);
          }
          Functions.getInstance().Toast(
            "success",
            "Arrange players in priority with drag-and-drop, then save"
          );
        } else {
          Functions.getInstance().Toast("error", "Please try again later");
        }
      });
  };

  const defaultPlayersData = (array) => {
    let x = [];
    array.forEach((element) => {
      if (element.draftId !== "") {
        x.push(element);
        updatePlayer(x);
      }
    });
  };

  ////// orgnl code ///////////
  const dragCompleted = (sData) => {
    setDraftPlayers(sData);
    updatePlayer(sData);
    setIsSaveDisabled(false);
    AsyncStorage.setItem("Selected-Draft-Players", JSON.stringify(sData));
    setCDragId("");
  };

  const showDraftPreview = () => {
    Functions.getInstance().fireAdjustEvent("yhtn39");
    Functions.getInstance().fireFirebaseEvent("DraftPreviewButton");
    let properties = new MoEProperties();
    properties.addAttribute("Preview Own Team", true);
    ReactMoE.trackEvent("Preview", properties);
    navigation.navigate("DraftPreview");
    // navigation.navigate("Dpreview");
  };

  const closeSuccessPopup = () => {
    Functions.getInstance().fireAdjustEvent("j2wayg");
    Functions.getInstance().fireFirebaseEvent("DraftSuccessOkButton");
    setIsSaveDisabled(true);
    setisPreviewDisabled(false);
    setIsSuccessVisible(false);
  };

  const savingTheDraft = () => {
    showProgress();
    Functions.getInstance().fireAdjustEvent("5x9265");
    Functions.getInstance().fireFirebaseEvent("DraftSave");
    let properties = new MoEProperties();
    properties.addAttribute("clicked", userInfo.userId);
    ReactMoE.trackEvent("Save", properties);
    let orderedData = [];
    const newDraft = draftPlayers;
    newDraft.forEach((element, index) => {
      const req = {
        orderId: index + 1,
        playerId: element.playerId,
        draftId: element.draftId,
      };
      orderedData.push(req);
    });
    console.log("--orderedData--", orderedData);

    const obj = {
      gameId: gameDetails.gameId,
      playerList: orderedData,
    };
    console.log("Drag N Drop payload", obj);
    Services.getInstance()
      .saveDraft(obj, userInfo.userId, gameDetails.gameId, userInfo.accesToken)
      .then((result) => {
        hideProgress();
        console.log(result);
        if (result.status == 200) {
          setIsSuccessVisible(true);
        } else {
          Functions.getInstance().Toast(
            "error",
            "Authentication error, Please try again later"
          );
        }
      });
  };

  // onTouchStart={drag}

  const iconStyle = (roleType) => ({
    width: roleType === "3" ? 16 : 18,
    height: roleType === "3" ? 16 : 18,
    position: "absolute",
    bottom: 0,
    left: 42,
  });

  function onReordered(fromIndex, toIndex) {
    const copy = [...draftPlayers];
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]);
    setDraftPlayers(copy);
    setIsSaveDisabled(false);
  }



  function keyExtractor(str, _index) {
    return _index;
  }

  function renderItem(info) {
    const { item, onDragStart, onDragEnd, isActive } = info;
    // Animate scale while dragging

    return (
      <Pressable
        key={item}
        onLongPress={onDragStart}
        onPressOut={onDragEnd}
        style={[
          styles.plyrmain,
          // mystyles.listItem,

          isActive && { borderWidth: 2, borderColor: "blue" },
          //mystyles.activeItem // Highlight item while dragging
        ]}
      >
        <View
          style={[
            styles.plyrmain,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: -8,
            },
          ]}
        >
          {/* <Text style={mystyles.listText}>{item.name}</Text> */}
          <Pressable
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginRight: 28,
              width: 80,
              //   borderRadius:40
            }}
            onLongPress={onDragStart}
            onPressOut={onDragEnd}
          >
            <View style={{ marginLeft: 5 }}>
              <Avatar
                avatarStyle={{ borderWidth: 1, borderColor: "#fff" }}
                rounded
                source={{
                  uri:
                    item.image === ""
                      ? "https://player6sports.s3.ap-south-1.amazonaws.com/pl6Asserts/dummy.png"
                      : // "https://www.wplt20.com/static-assets/images/players/68442.png?v=50.45"
                        `https://cdn.sportmonks.com/images/cricket/players/${item.image}`,
                }}
                size={48}
              />
              {item.playerRoleType === "0" && (
                <Image
                  source={{
                    uri:
                      "https://player6sports.s3.ap-south-1.amazonaws.com/pl6Asserts/bat10.png",
                  }}
                  // source={require("./Icons/bat10.png")} // Icon for Bat
                  style={iconStyle(item.playerRoleType)}
                />
              )}
              {item.playerRoleType === "1" && (
                <Image
                  source={{
                    uri:
                      "https://player6sports.s3.ap-south-1.amazonaws.com/pl6Asserts/bat10.png",
                  }}
                  //  source={require("./Icons/bat10.png")} // Icon for Bat
                  style={iconStyle(item.playerRoleType)}
                />
              )}
              {item.playerRoleType === "2" && (
                <Image
                  source={{
                    uri:
                      "https://player6sports.s3.ap-south-1.amazonaws.com/pl6Asserts/alrounder.png",
                  }}
                  // source={require("./Icons/alrounder.png")} // Icon for Allrounder
                  style={iconStyle(item.playerRoleType)}
                />
              )}
              {item.playerRoleType === "3" && (
                <Image
                  source={{
                    uri:
                      "https://player6sports.s3.ap-south-1.amazonaws.com/pl6Asserts/cricketBall.png",
                  }}
                  //  source={require("./Icons/cricketBall.png")} // Icon for Cricket Ball
                  style={iconStyle(item.playerRoleType)}
                />
              )}
              {item.playerRoleType === "4" && (
                <Image
                  source={{
                    uri:
                      "https://player6sports.s3.ap-south-1.amazonaws.com/pl6Asserts/wicketKeepr.png",
                  }}
                  //  source={require("./Icons/wicketKeepr.png")} // Icon for Wicket Keeper
                  style={iconStyle(item.playerRoleType)}
                />
              )}
              {item.playerRoleType === "5" && (
                <Image
                  source={{
                    uri:
                      "https://player6sports.s3.ap-south-1.amazonaws.com/pl6Asserts/alrounder.png",
                  }}
                  //  source={require("./Icons/alrounder.png")} // Icon for Allrounder
                  style={iconStyle(item.playerRoleType)}
                />
              )}
              {item.playerRoleType === "6" && (
                <Image
                  source={{
                    uri:
                      "https://player6sports.s3.ap-south-1.amazonaws.com/pl6Asserts/alrounder.png",
                  }}
                  //  source={require("./Icons/alrounder.png")} // Icon for Allrounder
                  style={iconStyle(item.playerRoleType)}
                />
              )}
            </View>
          </Pressable>

          <Pressable
            style={[styles.plyrtxt, { marginRight: MARGIN_RIGHT_8 }]}
            onLongPress={onDragStart}
            onPressOut={onDragEnd}
          >
            <Text
              numberOfLines={1} // Prevents text overflow
              ellipsizeMode="tail" // Adds ellipsis if text is too long
              style={[
                styles.teamnm,
                styles.wnrtxt,
                styles.tmname,
                styles.plyrname,
                {
                  fontFamily: "Poppins-Medium",
                  // Consider adding consistent text styling
                  fontSize: 12, // Example size
                  color: "#fff", // Ensure readability
                },
              ]}
            >
              {item.name}
            </Text>

            {/* <Text
              numberOfLines={1}
              style={[
                styles.ortxt,
                styles.plyrtm,
                {
                  color:
                    item.countryType === 1 ? "#fff" : "#2d2d2d",
                  backgroundColor:
                    item.countryType === 1 ? "gray" : "#fff",
                  fontSize: item.countryType === 1 ? 10 : 7.7,
                },
              ]}
            >
              {item.country}
            </Text> */}
            {item.countryType == 1 ? (
              <Text style={[styles.ortxt, styles.plyrtm]}>{item.country}</Text>
            ) : (
              <Text
                style={[
                  styles.ortxt,
                  styles.plyrtm,
                  { color: "#2d2d2d", backgroundColor: "#fff" },
                  { fontSize: 7.7 },
                ]}
              >
                {item.country}
              </Text>
            )}
          </Pressable>

          <Pressable
            style={{
              width: 50,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
            onLongPress={onDragStart}
            onPressOut={onDragEnd}
          >
            <Text style={[styles.ortxt]}>{item.avg}</Text>
          </Pressable>
          <Pressable
            style={{
              width: 50,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
            onLongPress={onDragStart}
            onPressOut={onDragEnd}
          >
            <Text style={[styles.ortxt]}>{item.hs}</Text>
          </Pressable>

          <Pressable
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            onLongPress={onDragStart}
            onPressOut={onDragEnd}
          >
            {item.draftId !== "" ? (
              <IconFeathr
                style={{ color: isOpponent === true ? "#e79013" : "#279bff" }}
                name="minus-circle"
                size={20} // Adjust size as needed
                color="#fff" // Static color
              />
            ) : (
              <IconFeathr
                style={{ color: isOpponent === true ? "#e79013" : "#279bff" }}
                name="plus"
                size={20} // Adjust size as needed
              />
            )}
          </Pressable>
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar backgroundColor="#111111" />
      {/* <ScrollView style={[styles.exvw, {flex: 1}]} keyboardShouldPersistTaps="always" scrollEnabled = {true}> */}

      <View
        style={[
          styles.tmslcnmain,
          { width: SCREEN_WIDTH, paddingHorizontal: 5 },
        ]}
      >
        <View style={[styles.tmmain, { marginBottom: 8 }]}>
          <View style={styles.tmpsmain}>
            <View style={styles.tmlft}>
              <View style={styles.tmsimg}>
                {userPF?.profileImg ==
                "https://s3.ap-south-1.amazonaws.com/player6sports/pl6Uplods/" ? (
                  <Image
                    style={styles.tmsdimg}
                    source={require("../../../assets/images/dummy.png")}
                  />
                ) : (
                  <Image
                    style={styles.tmsdimg}
                    source={
                      userPF
                        ? { uri: myPic }
                        : require("../../../assets/images/dummy.png")
                    }
                  />
                )}
              </View>
              <Text style={[styles.teamnm, styles.wnrtxt, styles.tmname]}>
                {userPF ? userPF?.name : ""}
              </Text>
            </View>

            <View style={[styles.tmlft, styles.tmrht]}>
              <Pressable
                disabled={isPreviewDisabled}
                style={styles.prvmain}
                onPress={() => {
                  showDraftPreview();
                }}
              >
                <View
                  style={[
                    styles.psimg,
                    isPreviewDisabled
                      ? {}
                      : {
                          backgroundColor: secondary,
                          borderColor: secondary,
                        },
                  ]}
                >
                  <Image style={styles.tmsdimg} source={PreviewIcon} />
                </View>
                <Text
                  style={[
                    styles.teamnm,
                    styles.wnrtxt,
                    styles.tmname,
                    styles.prvtxt,
                  ]}
                >
                  Preview
                </Text>
              </Pressable>

              <Pressable
                disabled={isSaveDisabled}
                style={[styles.prvmain, styles.sc]}
                onPress={() => savingTheDraft()}
                //  onPress={()=>{ console.log('---PrvDrft Item Data-----', positionedPlayersPrvList)}}
              >
                <View
                  style={[
                    styles.psimg,
                    isSaveDisabled
                      ? { backgroundColor: "" }
                      : {
                          backgroundColor: secondary,
                          borderColor: secondary,
                        },
                  ]}
                >
                  <Image style={styles.tmsdimg} source={SaveIcon} />
                </View>
                <Text
                  style={[
                    styles.teamnm,
                    styles.wnrtxt,
                    styles.tmname,
                    styles.prvtxt,
                    { textAlign: "center" },
                  ]}
                >
                  Save
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.ptkmain]}>
            <View style={[styles.pntlist, { flexBasis: "68%" }]}>
              <View style={styles.ptkmain}>
                <View style={styles.pntlist}>
                  {strips?.map((item, index) =>
                    item ? (
                      <View
                        key={index}
                        style={[
                          styles.pntitem,
                          isOpponent ? styles.orngpick : styles.ppicked,
                        ]}
                      >
                        <Image style={styles.wtick} source={TickIcon} />
                      </View>
                    ) : (
                      ""
                    )
                  )}
                </View>
              </View>
            </View>

            <View style={[styles.ptmr, styles.sltm]}>
              <Text style={[styles.teamnm, styles.tmrtxt, styles.pktmr]}>
                {currentTime}
              </Text>
            </View>
          </View>
        </View>

        {/* <View style={[styles.tmarmain, styles.plyrhd]}>
          <View style={[styles.tmarlist, styles.plyrshd]}>
            <View style={styles.srtby}>
              <View style={[styles.topo, styles.hdoptns]}>
                <Text style={styles.ortxt}>Players</Text>
              </View>
            </View>
            <View style={[styles.srtby, styles.rnoptn]}>
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
        </View> */}

        {draftPlayers && draftPlayers.length > 0 ? (
          <DragList
            data={draftPlayers}
            keyExtractor={(item) => item.playerId.toString()}
            // keyExtractor={keyExtractor}
            onReordered={onReordered}
            renderItem={renderItem}
            contentContainerStyle={mystyles.listContent}
          />
        ) : (
          ""
        )}
      </View>
      {/* </ScrollView> */}

      {isSuccessVisible ? (
        <DraftSuccessPopup
          isVisible={isSuccessVisible}
          closePopup={closeSuccessPopup}
        />
      ) : (
        ""
      )}
    </SafeAreaView>
  );
};

const mystyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  listItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dddddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  activeItem: {
    backgroundColor: "#e0f7fa",
    borderColor: "#00838f",
  },
  listText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  listContent: {
    paddingBottom: 160, // Adjust bottom padding here
  },
});

export default WithProgress(DragNDrop);
