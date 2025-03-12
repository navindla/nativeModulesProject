// Venky
/////////// has BLUE & ORANGE, BAT/BALL 

import React, {useEffect, useRef, useState} from 'react';
import {Image, Text, TouchableOpacity, View, Animated, Easing, ActivityIndicator} from 'react-native';
import {BorderLine2, CorrectIcon, PlusIcon, TickIcon} from '../../../assets';
import Modal from 'react-native-modal';
// import { styles } from '../draft/Draft.styles';
import { styles } from './BothTeamSelection.styles';
import { ScrollView } from 'react-native-gesture-handler';
import { FlatList } from 'react-native';
import { graybg } from '../../../style';
import { Avatar, Badge, Icon, withBadge } from "@rneui/themed";




const LoadingPopup = ({global_6players, isVisible, closePopup, navigation, teamA, teamB, teamABench, teamBBench,isOpponent, userInfo, userStoreGdetails, gameDetails}) => {
    let rotateValueHolder = new Animated.Value(0);
  const startImageRotateFunction = () => {
    rotateValueHolder.setValue(0);
    Animated.timing(rotateValueHolder, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => startImageRotateFunction());
  };




/// exp chnging to oppsite  B & O colors
  const renderTeamAItem = ({ item, index }) => {

       const getBorderColor = (item, global_6players, userInfo) => {
         const matchingPlayer = global_6players.find(
           (player) => player.playerId === item.playerId
         );
         if (matchingPlayer) {
           return matchingPlayer.userId === gameDetails.userOne
             ? //matchingPlayer.userId === userInfo?.userId
            styles.borderTopBlueWidth
          :   styles.borderTopOrangeWidth

         }
         return styles.defaultBorderStyle; // Optional fallback style
       };
   

       //// below code works usr1B////
       const getTickBgColor = (item, global_6players, userInfo) => {
         const matchingPlayer = global_6players.find(
           (player) => player.playerId === item.playerId
         );
         if (matchingPlayer) {
           return matchingPlayer.userId === gameDetails.userOne
             ? //matchingPlayer.userId === userInfo?.userId
               "#246afe"
             : "orange"
         }
         return styles.defaultBorderStyle; // Optional fallback style
       };
    


    // Determine if the player is already selected or disabled
    const isPlayerDisabled = global_6players.some(
      (player) => player.playerId === item.playerId
    );

    return (
      // <TouchableOpacity
      // disabled={true}
      //   style={[
      //     styles.tmplyrlft,
      //     getBorderColor(item, global_6players, userInfo),
      //   ]}
      // >
      //   {/* Player Left Section */}
      //   <View style={styles.plyrlft}>
      //     <View style={[styles.plyrprfl, styles.plyrlftprfl]}>
      //       <Image
      //         style={styles.teamsImageStyle}
      //         source={
      //           item.imageId
      //             ? {
      //                 uri: `https://cdn.sportmonks.com/images/cricket/players/${item.imageId}`,
      //               }
      //             : require("../../../assets/images/dummy.png")
      //         }
      //         onError={() =>
      //           console.error(`Failed to load image for ${item.name}`)
      //         }
      //       />
      //     </View>
      //     <View style={{ marginTop: 5 }}>
      //       <Text style={[styles.ortxt, styles.plyrtm, styles.plyrsd]}>
      //         {item.teamName}
      //       </Text>
      //     </View>
      //   </View>

      //   {/* Dotted Line Section */}
      //   <View style={[styles.dotp, styles.dotp2]}>
      //     <Image style={styles.dotimg} source={BorderLine2} />
      //   </View>

      //   {/* Player Info Section */}
      //   <View>
      //     <Text
      //       style={[
      //         styles.teamnm,
      //         styles.wnrtxt,
      //         styles.tmname,
      //         styles.plyrname,
      //       ]}
      //     >
      //       {item.name}
      //     </Text>
      //     <Text style={[styles.teamnm, styles.plyrruns]}>Avg: {item.avg}</Text>
      //     <Text style={[styles.ortxt, styles.plyrruns]}>HS: {item.hs}</Text>
      //   </View>

      //   {/* Player Action Button */}
      //   <TouchableOpacity
      //     style={[
      //       styles.adplyr,
      //       {
      //         backgroundColor: isPlayerDisabled ?  getTickBgColor(item, global_6players, userInfo) : "gray",
      //       },
      //     ]}
      //     disabled={true}

      //   >
      //     {isPlayerDisabled ? (
      //       <Image style={{ width: 8, height: 8 }} source={TickIcon} />
      //     ) : (
      //       <Image style={styles.adplusimg} source={PlusIcon} />
      //     )}
      //   </TouchableOpacity>
      // </TouchableOpacity>
            <TouchableOpacity
            disabled={true}
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



    //////////// real code below //////////////////

    const iconStyle = (roleType) => ({
      width: roleType === "3" ? 14 : 15.5,
      height: roleType === "3" ? 14 : 15.5,
      position: "absolute",
      left: 30,
      bottom: 1,
    });


  const renderTeamBItem = ({ item, index }) => {

    const getBorderColor = (item, global_6players, userInfo) => {
      const matchingPlayer = global_6players.find(
        (player) => player.playerId === item.playerId
      );
      if (matchingPlayer) {
        return matchingPlayer.userId === gameDetails.userOne
          ? //matchingPlayer.userId === userInfo?.userId
         styles.borderTopBlueWidth
           // styles.borderTopBlueWidth
          : styles.borderTopOrangeWidth
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

    // Determine if the player is already selected or disabled
    const isPlayerDisabled = global_6players.some(
      (player) => player.playerId === item.playerId
    );

    return (
      // <View
      //   style={[
      //     styles.tmplyrlft,
      //     getBorderColor(item, global_6players, userInfo),
      //   ]}
      // >
      //   {/* Player Left Section */}
      //   <View style={styles.plyrlft}>
      //     <View style={[styles.plyrprfl, styles.plyrlftprfl]}>
      //       <Image
      //         style={styles.teamsImageStyle}
      //         source={
      //           item.imageId
      //             ? {
      //                 uri: `https://cdn.sportmonks.com/images/cricket/players/${item.imageId}`,
      //               }
      //             : require("../../../assets/images/dummy.png")
      //         }
      //         onError={() =>
      //           console.error(`Failed to load image for ${item.name}`)
      //         }
      //       />
      //     </View>
      //     <View style={{ marginTop: 5 }}>
      //       <Text style={[styles.ortxt, styles.plyrtm, styles.plyrsd]}>
      //         {item.teamName}
      //       </Text>
      //     </View>
      //   </View>

      //   {/* Dotted Line Section */}
      //   <View style={[styles.dotp, styles.dotp2]}>
      //     <Image style={styles.dotimg} source={BorderLine2} />
      //   </View>

      //   {/* Player Info Section */}
      //   <View>
      //     <Text
      //       style={[
      //         styles.teamnm,
      //         styles.wnrtxt,
      //         styles.tmname,
      //         styles.plyrname,
      //       ]}
      //     >
      //       {item.name}
      //     </Text>
      //     <Text style={[styles.teamnm, styles.plyrruns]}>Avg: {item.avg}</Text>
      //     <Text style={[styles.ortxt, styles.plyrruns]}>HS: {item.hs}</Text>
      //   </View>

      //   {/* Player Action Button */}
      //   <TouchableOpacity
      //     style={[
      //       styles.adplyr,
      //       {
      //         backgroundColor: isPlayerDisabled ?  getTickBgColor(item, global_6players, userInfo) : "gray",
      //       },
      //     ]}
         
      //   >
      //     { isPlayerDisabled ? (
      //       <Image style={{ width: 8, height: 8 }} source={TickIcon} />
      //     ) : (
      //       <Image style={styles.adplusimg} source={PlusIcon} />
      //     )}
      //   </TouchableOpacity>
      // </View>

            <TouchableOpacity
            disabled={true}
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
      <Modal isVisible={isVisible} style={{marginTop: 100}}>
        <View style={{paddingHorizontal: 0,paddingVertical: 0,marginBottom: 30,width:'100%'}}>
          <ScrollView style={[styles.scrollView]}>
          <Text style={[styles.headingText, styles.ennum,{textAlign : 'center',fontSize:14}]}>Please wait while your opponent selects a player</Text>
          <View style={[styles.playerContainer,{marginTop : 10}]}>
              <View style={styles.playerContentBox}>
                  <FlatList
                      data={teamA}
                      renderItem={renderTeamAItem}
                    //  keyExtractor={(item) => item.playerId.toString()}
                      keyExtractor={(item, index) => index.toString()}
                  />
              </View>
              <View style={styles.playerContentBox}>
                  <FlatList
                      data={teamB}
                      renderItem={renderTeamBItem}
                    //  keyExtractor={(item) => item.playerId.toString()}
                      keyExtractor={(item, index) => index.toString()} //updated dec-3
                  />
              </View>
          </View>
          <Text style={[styles.headingText, styles.ennum,{textAlign : 'center'}]}>Bench</Text>
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
          <View style={{width: "100%", backgroundColor: graybg, borderRadius: 14, paddingHorizontal: 6, paddingVertical: 5,marginLeft: 'auto',marginRight: 'auto', borderTopColor: "red"}}>
              <View style={styles.crtimg}>
                  <ActivityIndicator size="large" color="#279bff" />
              </View>
              <Text style={styles.sucstxt}>Waiting for opponent's pick</Text>
            </View>
        </View>
        



      </Modal>
  );
};

export default LoadingPopup;
