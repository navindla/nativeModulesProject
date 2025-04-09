//////////// old code //////////////
/// Icon n tmName bug fixed.///
/////////USER 2/////////////
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Image,
  StatusBar,
  AppState,
  Dimensions,
  Linking,
  BackHandler,
  ToastAndroid
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ImageSlider from './common/ImageSlider';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './crickLeagueStyles/CricketLeague.style';
import IconUpDrft from 'react-native-vector-icons/Octicons';
import PrvDrftDrft from 'react-native-vector-icons/MaterialCommunityIcons';
import Functions from '../Functions';
import UserStore from '../../stores/UserStore';
import AsyncStorage from '@react-native-community/async-storage';
import EventSource from 'react-native-event-source';
import MatchBanner from './MatchBanner';
import {inject, observer} from 'mobx-react';
import WithProgress from '../LoadingOverlay/WithProgress';
import ReactMoE, {MoEProperties} from 'react-native-moengage';
import { watchEvents_URL } from '../../../Services/Services';

let gameDetails = {},
  teamDetails = {},
  selectedUserMatch = {},
  selectedUserContest = {},
  interval,
  timeout;

const OpponentChooseToss = ({navigation}) => {
  let [teamSelected, setteamSelected] = useState(false);
  let [tossDelayed, setTossDelayed] = useState(false);
  const [currentTime, setCurrentTime] = useState();
  const [teamData, setTeamData] = useState({});
  const [opEvent, setopEvent] = useState(false);
  const [opnS, setOpnS] = useState(false);
  let newSocket;
  //   const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;




  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      gameDetails = UserStore.selectedGameData;
      teamDetails = UserStore.selectedTeamDetails;
      selectedUserMatch = UserStore.selectedMatch;
      selectedUserContest = UserStore.selectedContest;
      callSocket();
      getData();
      setCurrentTime(Functions.getInstance().getTimer(gameDetails?.startTime));
      setOpnS(true);
    });
    return () => {
      console.log('ZZZZZZZZZZZZZZZZ');
      newSocket.removeAllListeners();
      newSocket.close();
      unsubscribe();
    };
  }, [navigation, UserStore.selectedGameData]);



  useEffect(() => {
    let myTime = getCurrentTime();
    gameDetails = UserStore.selectedGameData;
    teamDetails = UserStore.selectedTeamDetails;
    selectedUserMatch = UserStore.selectedMatch;
    selectedUserContest = UserStore.selectedContest;
    timeout = setTimeout(function () {
      clearTimeout(timeout);
      if (myTime > gameDetails.tosTime) {
        setTossDelayed(true);
      }

      interval = setInterval(() => {
        setCurrentTime(
          Functions.getInstance().getTimer(gameDetails?.startTime),
        );
        let myTime = getCurrentTime();

        if (myTime > gameDetails.tosTime) {
          setTossDelayed(true);
        }

        const delay = Functions.getInstance().contestClosedTimeDifference(
          myTime,
          gameDetails?.startTime,
        );
        if (delay <= 10 * 60) {
          if (timeout) {
            clearTimeout(timeout);
          }
          if (interval) {
            clearInterval(interval);
          }
          navigation.navigate('CricketLeague');
        }
      }, 1000);
    }, 1000);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  useEffect(() => {
    // if (currentTime == '00:00') {
    //   if(timeout){
    //     clearTimeout(timeout);
    //   }
    //   if(interval){
    //     clearInterval(interval);
    //   }
    // }
    return () => {};
  }, [currentTime]);

  const getCurrentTime = () => {
    var currentDate = new Date();
    // Get the components of the date and time
    var year = currentDate.getUTCFullYear();
    var month = ('0' + (currentDate.getUTCMonth() + 1)).slice(-2);
    var day = ('0' + currentDate.getUTCDate()).slice(-2);
    var hours = ('0' + currentDate.getUTCHours()).slice(-2);
    var minutes = ('0' + currentDate.getUTCMinutes()).slice(-2);
    var seconds = ('0' + currentDate.getUTCSeconds()).slice(-2);
    var currentSystemTime =
      year +
      '-' +
      month +
      '-' +
      day +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds;
    return currentSystemTime;
  };

  const getData = async () => {
    userInfo = JSON.parse(await AsyncStorage.getItem('player6-userdata'));
    AsyncStorage.setItem('toss', 'false');
    AsyncStorage.setItem('players', 'false');
    Functions.getInstance().checkExpiration(
      userInfo.userId,
      userInfo.refToken,
      navigation,
    );
    Functions.getInstance().checkInternetConnectivity();
    if (teamDetails?.userTwoTeam !== '0') {
      if (
        teamDetails?.userOne == userInfo.userId &&
        teamDetails?.userOneTeam == teamDetails?.contOne
      ) {
        const obj = {
          userTwoTeam: teamDetails?.contOne,
        };
        setTeamData(obj);
        setteamSelected(true);
      }

      if (
        teamDetails?.userOne == userInfo.userId &&
        teamDetails?.userOneTeam == teamDetails?.contTwo
      ) {
        const obj = {
          userTwoTeam: teamDetails?.contTwo,
        };
        setTeamData(obj);
        setteamSelected(true);
      }

      if (
        teamDetails?.userTwo == userInfo.userId &&
        teamDetails?.userTwoTeam == teamDetails?.contOne
      ) {
        const obj = {
          userTwoTeam: teamDetails?.contOne,
        };
        setTeamData(obj);
        setteamSelected(true);
      }
      if (
        teamDetails?.userTwo == userInfo.userId &&
        teamDetails?.userTwoTeam == teamDetails?.contTwo
      ) {
        const obj = {
          userTwoTeam: teamDetails?.contTwo,
        };
        setTeamData(obj);
        setteamSelected(true);
      }
    }
  };

  const callSocket = async () => {
    userInfo = JSON.parse(await AsyncStorage.getItem('player6-userdata'));
    // newSocket = new EventSource(
    //   `https://api.player6sports.com/1.0/auth/User/${userInfo.userId}/watchEvents`,
    // ); // qa
    newSocket = new EventSource(
      watchEvents_URL(userInfo.userId)
     ); 

    newSocket.addEventListener('ping', event => {
      console.log('Final List Socket ::::: ');
    });

    if (opEvent == false) {
      newSocket.addEventListener('tossDec', event => {
        let ds = JSON.parse(event.data);
        if (ds.matchId == gameDetails.matchId) {
          tossDeclarationEvent(event);
        }
      });
    }

    newSocket.addEventListener('contestClosed', event => {
      let ds = JSON.parse(event.data);
      if (ds.matchId == gameDetails.matchId) {
        navigation.navigate('CricketLeague');
      }
    });

    newSocket.addEventListener('teamSel', event => {
      let ds = JSON.parse(event.data);
      if (
        ds.matchId == gameDetails.matchId &&
        ds.gameId == gameDetails.gameId
      ) {
        gameDetails.userOneTeam = ds.userOneTeam;
        gameDetails.userTwoTeam = ds.userTwoTeam;
        setTeamData(JSON.parse(event.data));
        teamDetails = JSON.parse(event.data);
        console.log('---soc data venky trigs---', teamDetails);
      //  LOG  ---soc data venky trigs--- 
      // {"contOne": "131", "contOneImg": "https://gcdnimages.entitysport.com/assets/uploads/2022/03/mau.png", "contOneSnam": "MAU", "contTwo": "130", "contTwoImg": "https://gcdnimages.entitysport.com/assets/uploads/2025/04/Sonseca-Sultans.png", "contTwoSnam": "SNS", "gameId": "2745", "matchId": "324",
      //  "userOneTeam": "131", "userTwoTeam": "130"}
        setteamSelected(true);
      }
    });

    return () => {
      newSocket.removeAllListeners();
      newSocket.close();
    };
  };

  const tossDeclarationEvent = async event => {
    setopEvent(true);
    const stat = await AsyncStorage.getItem('toss');
    const toss = JSON.parse(event.data);

    if (gameDetails.matchId == toss.matchId && stat == 'false') {
      let user1Team, user2Team;
      AsyncStorage.setItem('toss', 'true');
      if (gameDetails?.userOne == userInfo.userId) {
        user1Team = gameDetails.userOneTeam;
      } else if (gameDetails?.userTwo == userInfo.userId) {
        user2Team = gameDetails.userTwoTeam;
      }

      if (user2Team == '0' && gameDetails?.userTwo == userInfo.userId) {
        user2Team = toss.winTeamId;
        navigation.navigate('TossWon');
      }

      if (user2Team == toss.winTeamId) {
        navigation.navigate('TossWon');
        // navigation.navigate("PlayersInteraction",{destination : "TossWon"});
      } else if (user1Team == toss.winTeamId) {
        navigation.navigate('TossWon');
        // navigation.navigate("PlayersInteraction",{destination : "TossWon"});
      } else {
        navigation.navigate('TossLoss');
        // navigation.navigate("PlayersInteraction",{destination : "TossLoss"});
      }
    }
  };

  const playersAnnouncement = async event => {
    setopEvent(true);
    const stat = await AsyncStorage.getItem('players');
    const toss = JSON.parse(event.data);
    if (gameDetails.matchId == toss.matchId && stat == 'false') {
      AsyncStorage.setItem('players', 'true');
      navigation.navigate('PlayerSelection', {
        screen: 'BothTeamOpponentSelection',
      });
    }
  };

  const renderContestContent = (image, name) => {
    return (
      <View style={styles.team}>
        <View style={[styles.teamView, styles.pickTeamView]}>
          <Image
            style={styles.teamImage}
            source={{
              // uri: `https://www.cricbuzz.com/a/img/v1/40x40/i1/c${image}/player_face.jpg`,
              // uri: `https://cdn.sportmonks.com/images/cricket/teams/${image}`,
              uri: image,
            }}
          />
        </View>
        <View style={[{width: 100}]}>
          <Text style={[styles.teamName, styles.teamText, {marginTop: 55}]}>
            {name || ''}
          </Text>
        </View>
        {teamSelected && (
          <View style={[styles.matchTime, {marginTop: 10, width: 120}]}>
            <View style={styles.pickTimer}>
              <Text style={[styles.teamName, styles.teamTimerText]}>
                {currentTime}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return !opnS ? null : (
    <SafeAreaView style={styles.root}>
      <StatusBar backgroundColor="#111111" />
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <MatchBanner selectedUserMatch={selectedUserMatch} />
        <View style={[styles.mainContainer, {marginTop: 0}]}>
          <View
            style={[styles.opponentcontainer, styles.open, {marginBottom: 0}]}>
            <View style={[styles.cntstmain, styles.pktm]}>
              <Text style={[styles.chstxt, styles.slctd, styles.ptmtxt]}>
                {teamSelected
                  ? 'Your Team For The Toss Is  Opp'
                  : 'Please wait while your opponent picks the toss  '}
              </Text>

              {teamSelected && (
                <View style={[styles.mtchcard, styles.pmtch]}>
                  {renderContestContent(
                    teamData?.userTwoTeam == teamDetails?.contTwo
                      ? teamDetails?.contTwoImg
                      : teamDetails?.contOneImg,
                    teamData?.userTwoTeam == teamDetails?.contTwo
                      ? teamDetails?.contTwoSnam
                      : teamDetails?.contOneSnam,
                  )}
                </View>
              )}

              {teamSelected ||
                (!teamSelected && (
                  <View style={styles.matchTime}>
                    <View style={styles.pickTimer}>
                      <Text style={[styles.teamName, styles.teamTimerText]}>
                        {currentTime}
                      </Text>
                    </View>
                  </View>
                ))}

              <Text style={[styles.teamnm, styles.wnrtxt]}>
                {`Winner of toss gets 1st pick in player selection,\nWhile waiting you can update your draft`}
              </Text>
              {currentTime == '00:00' && (
                <Text style={[styles.teamnm, styles.wnrtxt]}>
                  {`toss will be announced shortly.`}
                </Text>
              )}

              {/* <TouchableOpacity onPress={() => {
            Functions.getInstance().fireAdjustEvent("sg7g0q");
            Functions.getInstance().fireFirebaseEvent("UpdateDraftButton");
            let properties = new MoEProperties();
            properties.addAttribute("userId", userInfo.userId);
            properties.addAttribute("click_updatedraft", true);
            ReactMoE.trackEvent("click_updatedraft", properties);
            navigation.navigate('DraftRoute');
          }}>
          <View
            style={[styles.chooseContest, styles.waitingRoom, styles.openGame]}>
            <Text
              style={[styles.mainText, styles.playNow, styles.waitingRoomText]}>Update Draft  
            </Text>
          </View>
        </TouchableOpacity> */}

              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <Pressable
                  onPress={() => {
                    navigation.push('DraftRoute', {
                      screen: 'DraftPreview',
                    });
                  }}
                  //  disabled={!ContestContent} // Enable the button only when ContestContent is true
                >
                  <View
                    style={[
                      styles.chooseContest,
                      styles.waitingRoom,
                      styles.openGame,
                      // { opacity: ContestContent ? 1 : 0.5 }, // Change opacity when disabled
                      //  {width: screenWidth/2.4},
                      {
                        width: screenWidth / 2.4,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}>
                    <PrvDrftDrft
                      name="magnify"
                      color={'white'}
                      size={19}
                      style={{marginRight: 4, marginBottom: 2}}
                    />
                    <Text
                      style={[
                        styles.mainText,
                        styles.playNow,
                        styles.waitingRoomText,
                        {color: '#FFFFFF'},
                        // { color: ContestContent ? "#FFFFFF" : "#CCCCCC" }, // Change text color when disabled
                      ]}>
                      Preview Draft
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => {
                    Functions.getInstance().fireAdjustEvent('sg7g0q');
                    Functions.getInstance().fireFirebaseEvent(
                      'UpdateDraftButton',
                    );
                    let properties = new MoEProperties();
                    properties.addAttribute('userId', userInfo.userId);
                    properties.addAttribute('click_updatedraft', true);
                    ReactMoE.trackEvent('click_updatedraft', properties);
                    navigation.navigate('DraftRoute', {
                      screen: 'DraftPreview',
                    });
                    navigation.push('DraftRoute', {
                      screen: 'TeamSelection',
                    });

                    // navigation.push('DraftRoute'); //DraftPreview
                    // navigation.navigate('DraftRoute', {
                    //   screen: 'DraftPreview',
                    // });
                  }}
                  //  disabled={!ContestContent} // Enable the button only when ContestContent is true
                >
                  <View
                    style={[
                      styles.chooseContest,
                      styles.waitingRoom,
                      styles.openGame,
                      // { opacity: ContestContent ? 1 : 0.5 }, // Change opacity when disabled
                      {
                        width: screenWidth / 2.4,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}>
                    <IconUpDrft
                      name="arrow-switch"
                      color={'white'}
                      size={18}
                      style={{marginRight: 8, marginBottom: 2}}
                    />
                    <Text
                      style={[
                        styles.mainText,
                        styles.playNow,
                        styles.waitingRoomText,
                        {color: '#FFFFFF'}, // Change text color when disabled
                      ]}>
                      Update Draft
                    </Text>
                  </View>
                </Pressable>
              </View>
              {tossDelayed ? (
                <Text
                  style={[
                    styles.teamnm,
                    styles.wnrtxt,
                    {color: '#90EE90', fontSize: 12, marginTop: 10},
                  ]}>
                  {`Please wait. The toss will be announced shortly`}
                </Text>
              ) : (
                ''
              )}

              <TouchableOpacity
                style={{marginTop: 12}}
                onPress={() => {
                  // Open the hyperlink
                  Linking.openURL(
                    'https://player6sports.com/pdf/HowtoPlayPlayer6.pdf',
                  ).catch(err => console.error('Failed to open URL:', err));
                  let properties = new MoEProperties();
                  properties.addAttribute('Game rules', true);
                  ReactMoE.trackEvent('Match tile', properties);
                }}>
                <Text
                  style={[
                    styles.termsCondition,
                    {color: '#279bff', fontSize: 12, fontWeight: 'bold'},
                  ]}>
                  How To Play?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WithProgress(inject('UserStore')(observer(OpponentChooseToss)));
