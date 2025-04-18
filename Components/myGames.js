///////////////// To run the below code install 'moment' and run 'moment' in terminal ////
////delete abv code if blw works ///

//// new code, removed verify location added Pl11start time to navigate to scorecard basic testing done wokring, need thourough tested need to add veryfy Location

// backup file real code exists.

/// Icon bug fixed
import moment from 'moment'; // Ensure moment.js is installed
import React, {useEffect, useState} from 'react';
import {AppState, BackHandler, FlatList, Image, View} from 'react-native';
import {Text} from '@rneui/base';
// import Eicon from "./Imgs/Icons/coin.png";
import Eicon from '../cricketLeague/Imgs/Icons/coin.png';
import {secondary} from '../../../style';
import WithProgress from '../LoadingOverlay/WithProgress';
import CustomButton from '../customComponents/CustomButton';
import {styles} from './BettingAddMoney.styles';
import Functions from '../Functions';
import AsyncStorage from '@react-native-community/async-storage';
import Services from '../../../Services/Services';
import UserStore from '../../stores/UserStore';
import {useRoute} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import RestrictedLocation from '../customComponents/RestrictedLocation';
import {inject, observer} from 'mobx-react';
import {MyGameEmpty, TBC} from '../../../assets';
import ReactMoE, {MoEProperties} from 'react-native-moengage';

const MatchType = {
  1: '1',
  2: '5',
  3: '10',
  4: '20',
};

const TeamView = ({team, image}) => {
  return (
    <View style={styles.teamContainer}>
      <View style={styles.plyrprfl}>
        {/* {image == "" || image == "https://cdn.sportmonks.com" ? (
          <Image
            style={[styles.image, styles.mnimg, { marginTop: 5 }]}
            source={TBC}
          />
        ) : (
          <Image
            style={styles.image}
            source={{
              uri: `https://cdn.sportmonks.com/images/cricket/teams/${image}`,
            }}
          />
        )} */}
        <Image
          style={styles.image}
          source={{
            uri: image,
          }}
        />
      </View>
      <Text style={styles.teamName}>{team}</Text>
    </View>
  );
};

let userInfo,
  cont1 = 0,
  cont5 = 0,
  cont10 = 0,
  cont20 = 0;
const BettingAddMoney = ({navigation, showProgress, hideProgress}) => {
  const [Internet, setInternet] = useState(true);
  const [myGamesList, setMyGamesList] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [restricted, setRestricted] = useState(false);
  const [userID, setuserID] = useState('');
  const route = useRoute();

  useEffect(() => {
    const unsubscribe = navigation?.addListener('focus', () => {
      navigation.reset({index: 0, routes: [{name: 'CricketLeague'}]});
      AsyncStorage.setItem('Opn', 'null');
      AsyncStorage.setItem('toss', 'null');
      AsyncStorage.setItem('players', 'null');
      AsyncStorage.setItem('p6data', 'null');
      AsyncStorage.setItem('pl6-socket', 'null');
      const obj = {};
      UserStore.selectedMatch = {};
      UserStore.setselectedContest(obj);
      UserStore.setopponentSocketData(obj);
      UserStore.setselectedGameData(obj);
      UserStore.setselectedTeamDetails(obj);
      getMyContests();
      clearTeamDetails(); //////
    });
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('CricketLeague');
        return true;
      },
    );
    // const handleAppStateChange = (nextAppState) => {
    //   if (nextAppState === 'active') {
    //     getMyContests();
    //   }
    // };
    // AppState.addEventListener('change', handleAppStateChange);
    return () => {
      console.log('Unmount is executed');
      unsubscribe();
      backHandler.remove();
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [navigation]);

  const getMyContests = async () => {
    showProgress();
    userInfo = JSON.parse(await AsyncStorage.getItem('player6-userdata'));
    console.log(userInfo);
    Functions.getInstance().checkExpiration(
      userInfo.userId,
      userInfo.refToken,
      navigation,
    );
    Functions.getInstance()
      .checkInternetConnectivity()
      .then(state => {
        if (state == true) {
          setInternet(true);
          Services.getInstance()
            .getMyGamesList(userInfo.userId, userInfo.accesToken)
            .then(result => {
              console.log(
                'MyGames screen API ........................................................-->',
                result,
              );
              if (result.status == 200) {
                setMyGamesList(result.data);
                AsyncStorage.setItem(
                  'My-GamesList API respoo --------->',
                  JSON.stringify(result.data),
                );
                // Functions.getInstance().Toast("success",JSON.stringify(result.data));
                hideProgress();
                fireEventToMoEngage(result.data);
              } else {
                hideProgress();
                Functions.getInstance().Toast(
                  'error',
                  'Please try again later',
                ); //orgnl code uncomnt!
              }
            });
        } else {
          setInternet(false);
          Functions.getInstance()
            .offlineMyGamesList()
            .then(result => {
              setMyGamesList(result);
              hideProgress();
            });
        }
      });
  };

  ////////////////////////////////////////////////// new code
  const clearTeamDetails = async () => {
    try {
      await AsyncStorage.setItem('TeamDetails', JSON.stringify(null));
      console.log('TeamDetails set to null successfully');
    } catch (error) {
      console.error('Error setting TeamDetails to null:', error);
    }
  };

  const fireEventToMoEngage = data => {
    ReactMoE.setUserAttribute('Contest', data.length);
    ReactMoE.setUserAttribute('Draft', data.length);
    data.forEach(element => {
      if (MatchType[element.contestId] == '1') {
        cont1 = cont1 + 1;
      }
      if (MatchType[element.contestId] == '5') {
        cont5 = cont5 + 1;
      }
      if (MatchType[element.contestId] == '10') {
        cont10 = cont10 + 1;
      }
      if (MatchType[element.contestId] == '20') {
        cont20 = cont20 + 1;
      }
    });
    ReactMoE.setUserAttribute('1rs Contests', cont1);
    ReactMoE.setUserAttribute('5rs Contests', cont5);
    ReactMoE.setUserAttribute('10rs Contests', cont10);
    ReactMoE.setUserAttribute('20rs Contests', cont20);
  };

  /// new func scredirection ///

///// new func 8-aprl
const screenRedirection = async data => {
    Functions.getInstance().Toast("success", data.playerSelectionStatus);  /////////// COMMENT DEBUGR ADDED
  // functionsInstance.Toast('error', 'Please try again later');

  console.log('data---------', data);
  // return;
  showProgress();
  // console.log("data---------");

  const functionsInstance = Functions.getInstance();
  functionsInstance.fireAdjustEvent('rzz1nb');
  functionsInstance.fireFirebaseEvent('GameRoomOpenContestButton');

  let properties = new MoEProperties();
  properties.addAttribute("Gameroom's Contest tier blue button", true);
  ReactMoE.trackEvent('My Games', properties);

  UserStore.setopponentSocketData(data);

  const selectedMatchData = {
    ...data,
    team1Logo: data.contOneImg,
    team1Name: data.contOneSnam,
    team2Logo: data.contTwoImg,
    team2Name: data.contTwoSnam,
    title: data.banTitle,
  };

  UserStore.setselectedMatch(selectedMatchData);
  UserStore.setselectedGameData(data);
  UserStore.setselectedContest(data);

  await AsyncStorage.multiSet([
    ['selected-game-match', JSON.stringify(selectedMatchData)],
    ['selected-game-contest', JSON.stringify(data)],
  ]);

  // Check if the current time exceeds `data.startTime`
  const currentTimeUTC = moment().utc(); // Get current time in UTC
  const matchStartTime = moment.utc(data.startTime, 'YYYY-MM-DD HH:mm:ss'); // Convert match start time to UTC
  if (currentTimeUTC.isAfter(matchStartTime)) {
    // console.log('---Line 650----');
    hideProgress();
    return navigation.navigate('PlayersInteraction', {
      destination: 'RunningMatch',
    });
  }

  hideProgress();

  switch (data.status) {
    case '1':
      try {
        const result = await Services.getInstance().previousContests(
          userInfo.userId,
          data.matchId,
          userInfo.accesToken,
        );
        if (result.status === 200) {
          await AsyncStorage.setItem(
            'prev-contests',
            JSON.stringify(result.msg),
          );
          return navigation.navigate('PlayersInteraction', {
            destination: 'FindOpponent',
          });
        }
      } catch {
        return functionsInstance.Toast('error', 'Please try again later');
      }
      break;

    case '2':
    case '3':

let tmID;
if(data.userOne == userInfo.userId){
console.log('---Line 678----userInfo.userId : userOne', data.userOneTeam);
if( data.userOneTeam == data.contOne){
  tmID={
    teamName: data.contOneSnam,
    teamImg: data.contOneImg,
  }
}else{
tmID={
  teamName: data.contTwoSnam,
  teamImg: data.contTwoImg,
}
}

}else{
console.log('---Line 678----userInfo.userId : userTwo', data.userTwoTeam);
if( data.userTwoTeam == data.contTwo){
    tmID={
      teamName: data.contTwoSnam,
      teamImg: data.contTwoImg,
    }
}else{
  tmID={
    teamName: data.contOneSnam,
    teamImg: data.contOneImg,
  }
}

}
console.log('---Line 678----userInfo.userId : tmID', tmID);
AsyncStorage.setItem('selectedTmDetailsAscy', JSON.stringify(tmID));
      
    //////////////////end//////////////////////
      properties = new MoEProperties();
      properties.addAttribute(
        data.userOne === userInfo.userId
          ? 'Toss chooser screen'
          : 'Toss chooser screen (Opponent)',
        true,
      );
      ReactMoE.trackEvent('My Games', properties);

      return navigation.navigate('PlayersInteraction', {
        destination:
          data.userOne === userInfo.userId
            ? 'PickTeamForToss'
            : 'OpponentChooseToss',
      });

    case '4':
      if (!data.userTwo || data.userTwo === '0') {
        return functionsInstance.Toast(
          'error',
          "Oops! You haven't paired with anyone. Your amount will be refunded to your wallet.",
        );
      }

      if (!data.tossWinner || data.tossWinner === '0') {
        return navigation.navigate('PlayersInteraction', {
          destination:
            data.userOne === userInfo.userId ? 'TossLoss' : 'TossWon',
        });
      }

      if (data.finalPlayers === '0') {
        return navigation.navigate('PlayersInteraction', {
          destination:
            data.tossWinner === userInfo.userId ? 'TossWon' : 'TossLoss',
        });
      }

      if (data.playerSelectionStatus === 'PENDING') {
        return navigation.navigate('PlayersInteraction', {
          destination:
            data.tossWinner === userInfo.userId ? 'TossWon' : 'TossLoss',
        });
      }

      if (data.playerSelectionStatus === 'COMPLETED') {
        return navigation.navigate(
          data.isCapSel === '0'
            ? 'CaptainViceCaptainSelection'
            : 'PlayersInteraction',
          data.isCapSel === '0'
            ? {newGameId: UserStore.selectedGameData.gameId}
            : {destination: 'RunningMatch'},
        );
      }

      if (data.playerSelectionStatus === 'INPROGRESS') {
        return navigation.navigate('PlayersInteraction', {
          destination: 'BothTeamOpponentSelection',
        });
      }
      break;

    case '5':
      return functionsInstance.Toast(
        'success',
        'Match has been completed...',
      );
  }

  // Functions.getInstance().Toast("success", data.playerSelectionStatus);

  return functionsInstance.Toast('error', 'Please try again later');
};

  // console.log("UserStore.selectedMatch.gameId :", UserStore.selectedMatch);
  // return;

  const verifyLocation = async (isCapSel, startTime) => {
    const result = Functions.getInstance().requestLocationPermission();
    result.then(res => {
      if (res) {
        showProgress();
        if (latitude == '') {
          Geolocation.getCurrentPosition(
            position => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              setLatitude(latitude);
              setLongitude(longitude);
              pricesPage2(latitude, longitude, isCapSel, startTime);
            },
            error => {
              hideProgress();
              console.log(
                'Error getting geolocation: ' + error.code,
                error.message,
              );
              Functions.getInstance().Toast(
                'error',
                'Please enable your device location',
              );
            },
            {timeout: 15000},
          );
        } else {
          pricesPage2(latitude, longitude, isCapSel, startTime);
        }
      }
    });
  };

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

  const pricesPage2 = (L1, L2, isCapSel, startTime) => {
    showProgress();
    const myTime = getCurrentTime();
    if (myTime > startTime) {
      console.log('greater', myTime > startTime);
    }
    console.log('isCapsel', isCapSel);
    const obj = {
      lat: L1,
      lng: L2,
      page: 'player selection',
    };
    console.log(obj);
    Services.getInstance()
      .verifyLocation(userInfo.userId, userInfo.accesToken, obj)
      .then(result => {
        console.log(result);
        if (result.status == 200 && result.locVerify == true) {
          hideProgress();
          if (isCapSel == '0' && myTime < startTime) {
            navigation.navigate('PlayersInteraction', {
              destination: 'BothTeamOpponentSelection',
            });
          } else {
            navigation.navigate('PlayersInteraction', {
              destination: 'RunningMatch',
            });
          }
        } else if (result.status == 401) {
          hideProgress();
          setRestricted(true);
        } else {
          hideProgress();
          setRestricted(true);
        }
      });
  };

  const storePriceInAsyncStorage = async (price, pricetype) => {
    try {
      await AsyncStorage.setItem('selectedItemPrice', JSON.stringify(price));
      await AsyncStorage.setItem(
        'selectedItemPriceType',
        JSON.stringify(pricetype),
      );
      console.log('Price stored successfully in ASYNC');
    } catch (error) {
      console.error('Error storing price:', error);
    }
  };

  const AllTeamView = item => {
    const PriceTyp =
      item.item.userOne == userInfo.userId
        ? item.item.userOnePriceType
        : item.item.userTwoPriceType;

    return (
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Text style={[styles.heading, {marginRight: 2, marginLeft: 2}]}>
            {item.item.banTitle}
          </Text>
          <Text style={styles.subHeading}>
            {Functions.getInstance().displayMatchDateTime(item.item.startTime)}
          </Text>
          <View style={styles.row}>
            <TeamView
              team={item.item.contOneSnam}
              image={item.item.contOneImg}
            />
            <Text style={styles.vsText}>VS</Text>
            <TeamView
              team={item.item.contTwoSnam}
              image={item.item.contTwoImg}
            />
          </View>
        </View>

        <View style={styles.rightContainer}>
          <View style={styles.buttonContainer}>
            <CustomButton
              colour={secondary}
              //  onPress={()=> navigation.navigate("PlayersInteraction", { destination: "BothTeamOpponentSelection" })}
              onPress={async () => {
                try {
                  const {price, userOnePriceType} = item.item;
                  await storePriceInAsyncStorage(price, userOnePriceType);
                  // Call screenRedirection with item data
                  await screenRedirection(item.item);
                } catch (error) {
                  console.error('Error in onPress:', error);
                  Functions.getInstance().Toast(
                    'error',
                    'Something went wrong. Please try again.',
                  );
                }
              }}
              //  onPress={()=> screenRedirection(item.item)}
              //  btnLabel={`₹${MatchType[item.item.contestId]}`}
              // btnLabel={`₹${item.item.price}`}
              btnLabel={
                PriceTyp == '1' ? (
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#fff',
                      //  fontFamily: "Poppins-SemiBold",
                      marginTop: 3.2,
                    }}>
                    ₹ {item.item.price}
                  </Text>
                ) : (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={Eicon}
                      style={{
                        width: 16,
                        height: 16,
                        marginRight: 1.6,
                        marginTop: 1,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#fff',
                        fontFamily: 'Poppins-SemiBold',
                        marginTop: 3.2,
                      }}>
                      {item.item.price === '0' ? 'FREE GAME' : item.item.price}
                    </Text>
                  </View>
                )
              }
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.subContainer}>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={styles.mainHeading}>Match</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.mainHeading}>Contest</Text>
          </View>
        </View>
        <View style={styles.listContainer}>
          {myGamesList && myGamesList.length > 0 ? (
            <FlatList
              data={myGamesList}
              renderItem={AllTeamView}
              extraData={myGamesList}
              keyExtractor={(item, index) => index}
            />
          ) : (
            <View style={{marginTop: '50%'}}>
              <Image
                source={MyGameEmpty}
                style={{
                  width: '100%',
                  resizeMode: 'contain',
                  height: 120,
                  alignSelf: 'center',
                }}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 20,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                No Active Game Rooms
              </Text>
            </View>
          )}
        </View>
      </View>
      {restricted ? (
        <RestrictedLocation onClose={() => setRestricted(false)} />
      ) : (
        ''
      )}
    </View>
  );
};

export default WithProgress(inject('UserStore')(observer(BettingAddMoney)));
