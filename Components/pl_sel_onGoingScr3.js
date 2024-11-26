
/// includes dummy data also api funcs
// disable btns dynamic frm state
//wss soc integrated logs all and sets myFinal opFinal
// added usef Info in state
// added new renderPickPlayerCheckBox acc2 setmyFinal liust etc 
// check-marks dync working
// 2nd api wokring fine manual mode

import {ActivityIndicator, Image,Modal,ScrollView,TouchableOpacity,View} from 'react-native';
import { Text } from 'react-native';
import { BorderLine2, England, India, Player1, Player2, Player3, Player4, Player5, Player6, Player7, PlusIcon, PlusIcon2, TickIcon } from '../../../assets';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { GREEN, ORANGE, secondary } from '../../../style';
import { styles } from './BothTeamSelection.styles';
import WithProgress from '../LoadingOverlay/WithProgress';
import { inject, observer } from 'mobx-react';
import LoadingPopup from '../playerSelection/LoadingPopup'
import UserStore from '../../stores/UserStore';
import AsyncStorage from '@react-native-community/async-storage';
import Functions from '../Functions';
import Services from '../../../Services/Services';
import EventSource from 'react-native-event-source';
import { measureConnectionSpeed } from 'react-native-network-bandwith-speed';
import ReactMoE,{
    MoEProperties,
  } from "react-native-moengage";

let gameDetails,
    userInfo,
    myPic, userPF, currentSystemTime, teamACount=1, teamBCount=0, selected = false, plseleccted = false,socketTriggered, twentyFiveSeconds, thirtySeconds,globalTimeInterval,sec25int, playerIdsData=[], sec25TimeChange, preDefinedPlayers = [], nextTime, nextEndTime,serveCurTime, myStatus, startTimeClear,tossWinnerLastPic = {},lateDelayClear,netSpeedInterval, gb;

const BothTeamOpponentSelection = ({ navigation, showProgress, hideProgress }) => {
  //  const [userInfo, setUserInfo] = useState(null);

    if(UserStore){
        const profile = UserStore.getuserPF();
        if(profile){
          myPic = profile?.replace(/['"]+/g, '');
        }
      }
    const [currentTime, setCurrentTime] = useState('00:29');
    const [isRunning, setIsRunning] = useState(false); // Track if the timer is runnin added
    const [teamA, setTeamA] = useState([]);
    const [teamB, setTeamB] = useState([]);
    const [teamABench, setTeamABench] = useState([]);
    const [teamBBench, setTeamBBench] = useState([]);
        /////// added /////
        // const [global_6players, setglobal_6players] = useState([{"contestId": "5832", "endTime": "2024-11-22 09:14:01", "matchId": "2197", "order": 1, "playerId": "1548", "startTime": "2024-11-22 09:14:01", "userId": "191"},
        //     {"contestId": "5832", "endTime": "2024-11-22 09:14:01", "matchId": "2197", "order": 1, "playerId": "1549", "startTime": "2024-11-22 09:14:01", "userId": "191"},
        //     //// teamB below ////
        //     {"contestId": "5832", "endTime": "2024-11-22 09:14:01", "matchId": "2197", "order": 1, "playerId": "1479", "startTime": "2024-11-22 09:14:01", "userId": "191"},
        //  ]);
        const [global_6players, setglobal_6players] = useState([{"contestId": "5832", "endTime": "2024-11-22 09:14:01", "matchId": "2197", "order": 1, "playerId": "1548", "startTime": "2024-11-22 09:14:01", "userId": "191"},
         ]);
    const [myDefaultPlayers, setMyDefaultPlayers] = useState([]);
    const [opponentName, setopponentName] = useState('');
    const [opponentPic, setopponentPic] = useState('');
    const [loading, setLoading] = useState(false);
    const [opEvent, setopEvent] = useState(false);
    const [isOpponent, setIsOpponent] = useState(false);
    const [myTurn, setmyTurn] = useState(true);  // Track whoz the turn is now? added

    /////////////// new adds frm wss /////////////////
    const [myFinal, setMyFinal] = useState([]);
    const [opFinal, setOpFinal] = useState([]);
    const [myStatus, setMyStatus] = useState({});
    const [opnStatus, setOpnStatus] = useState({});
    const [needToPick, setNeedToPick] = useState(false); // New state for need_to_pick




    let selectionTime = "";
    let newSocket;

    const getCurrentTime = () =>{
        var currentDate = new Date();
        // Get the components of the date and time
        var year = currentDate.getUTCFullYear();
        var month = ('0' + (currentDate.getUTCMonth() + 1)).slice(-2);
        var day = ('0' + currentDate.getUTCDate()).slice(-2);
        var hours = ('0' + currentDate.getUTCHours()).slice(-2);
        var minutes = ('0' + currentDate.getUTCMinutes()).slice(-2);
        var seconds = ('0' + currentDate.getUTCSeconds()).slice(-2);
        currentSystemTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        return currentSystemTime;
    }

    const fetchUserData = async () => {
        try {
            const storedUserData = await AsyncStorage.getItem("player6-userdata");
            if (storedUserData) {
                userInfo = JSON.parse(storedUserData);
                console.log('User Info NEW CODE--------:', userInfo); // Log the user info
            } else {
                console.log('No user info found.');
            }
        } catch (error) {
            console.error("Failed to load user data:", error);
        }
    };

        useEffect(() => {
        const unsubscribe = navigation?.addListener('focus', async () => {
            try {
                // Resetting team and player data
                setTeamA([{}]);
                setTeamB([{}]);
                setTeamABench([]);
                setTeamBBench([]);
                playerIdsData = [];
                gameDetails = UserStore.selectedGameData;
    
                // Fetch and parse user data from AsyncStorage
                // const storedUserData = await AsyncStorage.getItem("player6-userdata");
                // if (storedUserData) {
                //     const parsedData = JSON.parse(storedUserData);
                //     setUserInfo(parsedData);
                //     console.log('User Data:', parsedData); // Replace with your handling logic
                // }
    
                // Additional calls and resets
               // getData();
               fetchUserData();
                AsyncStorage.setItem("p6data", "false");
                AsyncStorage.setItem("pl6-socket", "false");
                // callSocket();
                callPlayer11Data();
            } catch (error) {
                console.error('Error retrieving user data:', error);
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
        const gameIda = 5846;
        // Create the WebSocket connection userInfo.userId   gameDetails.gameId
         const ws = new WebSocket('wss://qaws.player6sports.com/191/gameEvents/5846');
      //  const ws = new WebSocket(`wss://qaws.player6sports.com/${userInfo?.userId}/gameEvents/${gameIda}}`);
    
        ws.onopen = () => {
          console.log('WebSocket connection established');
        };
    
    // sets state all req flds
        ws.onmessage = (event) => {
          try {
            console.log('--raw-event--',event);
            const parsedData = JSON.parse(event.data);
            console.log(parsedData)
    
            // Extract and set the new state variables
            //  parsedData.data?.myFinal
            const myStatusData = parsedData.data?.myStatus;
            const opnStatusData = parsedData.data?.opnStatus;
            const myFinalData = parsedData.data?.myFinal;
            const opFinalData = parsedData.data?.opFinal;
    
            // Update the state with new data
            if (myStatusData) {
              console.log('My Status:', myStatusData);
              setMyStatus(myStatusData);
            }
            
            if (opnStatusData) {
              console.log('Opponent Status:', opnStatusData);
              setOpnStatus(opnStatusData);
            }
    
            if (myFinalData) {
              console.log('My Final Data:', myFinalData);
              setMyFinal(myFinalData); // Update the state with myFinal data
            }
    
            if (opFinalData) {
              console.log('Opponent Final Data:', opFinalData);
              setOpFinal(opFinalData); // Update the state with opFinal data
            }

                            // Update globalList  both final data arrays
                            if (myFinalData || opFinalData) {
                                setglobal_6players([...myFinalData || [], ...opFinalData || []]);
                            }
    
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
    
    
    
    
    
    
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
    
        ws.onclose = () => {
          console.log('WebSocket connection closed');
        };
    
        // Clean up WebSocket on component unmount
        return () => {
          ws.close();
        };
      }, []);
    
    
    


    const process1 = () =>{
        // console.log(gameDetails);
        if(gameDetails?.tossWinner == userInfo.userId){
            setLoading(false);
        }
        if(gameDetails?.tossWinner != userInfo.userId){
            setLoading(true);
        }
        if(gameDetails?.userTwo == userInfo.userId){
            setIsOpponent(true);
        }
    }




///////// only chnages timer if gets 00:00 ///
    useEffect(() => {
        let [minutes, seconds] = currentTime.split(':').map(Number);
        let totalSeconds = minutes * 60 + seconds;

        const interval = setInterval(() => {
            if (isRunning && totalSeconds > 0) {
                totalSeconds -= 1;

                const min = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
                const sec = String(totalSeconds % 60).padStart(2, '0');
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
            console.log('setmyTurn-->',myStatus.need_to_pick)
        }
    }, [myStatus]);





    useEffect(
        ()=>{
            if(myTurn){
                setLoading(false);
                setCurrentTime('00:30'); // Ensure UI reflects the reset immediately
              //  console.log('teamA------ data ------',teamA)
            }else{
                if(teamA.length > 0){
                    setLoading(true);
                    setCurrentTime('00:30'); // Ensure UI reflects the reset immediately
                }
            }
        },[myTurn]
    )

    const getData = async() =>{
         showProgress();
        userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
        userPF = JSON.parse(await AsyncStorage.getItem("player6-profile"));
        console.log('userInfo --',userInfo.userId);
    }




    // const callPlayer11Data = () =>{
    //     const result = {"myPlayers": [], "nxtOpt": "", "nxtTime": "", "nxtTimeEnd": "", "opnImg": "https://s3.ap-south-1.amazonaws.com/player6sports/pl6Uplods/", "opnName": "av908488", "oponLPlayer": "", "selStartTm": "2024-11-07 12:34:02", "serveCurTime": "2024-11-07 12:34:27", "status": 200, "teamA11": [{"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Ashwanth Valthapa", "orderId": "", "playOrderId": "1", "playerId": "1548", "selBy": 0, "teamName": "FUJ"}, {"avg": 0, "endTime": "", "hs": 0, "imageId": "", "isSel": -1, "name": "Hari Prasanth", "orderId": "", "playOrderId": "1", "playerId": "1827", "selBy": 0, "teamName": "FUJ"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Harshit Kaushik", "orderId": "", "playOrderId": "1", "playerId": "1496", "selBy": 0, "teamName": "FUJ"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Mayank Choudhary", "orderId": "", "playOrderId": "1", "playerId": "1545", "selBy": 0, "teamName": "FUJ"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Nabeel Aziz", "orderId": "", "playOrderId": "1", "playerId": "4779", "selBy": 0, "teamName": "FUJ"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Sagar Kalyan", "orderId": "", "playOrderId": "1", "playerId": "1494", "selBy": 0, "teamName": "FUJ"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Yusuf Khan", "orderId": "", "playOrderId": "1", "playerId": "1515", "selBy": 0, "teamName": "FUJ"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "31/8607.png", "isSel": -1, "name": "Sanchit Sharma", "orderId": "", "playOrderId": "2", "playerId": "1549", "selBy": 0, "teamName": "FUJ"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Shival Bawa", "orderId": "", "playOrderId": "2", "playerId": "1547", "selBy": 0, "teamName": "FUJ"}, {"avg": 0, "endTime": "", "hs": 0, "imageId": "", "isSel": -1, "name": "Sumeet Gosain", "orderId": "", "playOrderId": "2", "playerId": "4776", "selBy": 0, "teamName": "FUJ"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Zohair Iqbal", "orderId": "", "playOrderId": "2", "playerId": "4778", "selBy": 0, "teamName": "FUJ"}], "teamABan": [{"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Zahid Ali", "orderId": "", "playOrderId": "4", "playerId": "4777", "selBy": 0, "teamName": "FUJ"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "8/6952.png", "isSel": -1, "name": "Adeeb Usmani", "orderId": "", "playOrderId": "3", "playerId": "1550", "selBy": 0, "teamName": "FUJ"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Hardik Pai", "orderId": "", "playOrderId": "2", "playerId": "1523", "selBy": 0, "teamName": "FUJ"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Taimoor Ali", "orderId": "", "playOrderId": "4", "playerId": "1499", "selBy": 0, "teamName": "FUJ"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Shazaib Khan", "orderId": "", "playOrderId": "4", "playerId": "1594", "selBy": 0, "teamName": "FUJ"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Simranjeet Singh Kang", "orderId": "", "playOrderId": "4", "playerId": "4928", "selBy": 0, "teamName": "FUJ"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "2/5570.png", "isSel": -1, "name": "CP Rizwan", "orderId": "", "playOrderId": "2", "playerId": "3801", "selBy": 0, "teamName": "FUJ"}], "teamB11": [{"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Ali Abid", "orderId": "", "playOrderId": "1", "playerId": "1479", "selBy": 0, "teamName": "TAD"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "20/8532.png", "isSel": -1, "name": "Alishan Sharafu", "orderId": "", "playOrderId": "1", "playerId": "834", "selBy": 0, "teamName": "TAD"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Ghulam Murtaza", "orderId": "", "playOrderId": "1", "playerId": "4780", "selBy": 0, "teamName": "TAD"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Haider Ali", "orderId": "", "playOrderId": "1", "playerId": "4786", "selBy": 0, "teamName": "TAD"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Ibrar Shah", "orderId": "", "playOrderId": "1", "playerId": "1482", "selBy": 0, "teamName": "TAD"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Jonathan Figy", "orderId": "", "playOrderId": "1", "playerId": "4781", "selBy": 0, "teamName": "TAD"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Prithvi Madhu", "orderId": "", "playOrderId": "1", "playerId": "4783", "selBy": 0, "teamName": "TAD"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "31/703.png", "isSel": -1, "name": "Rohan Mustafa", "orderId": "", "playOrderId": "1", "playerId": "1484", "selBy": 0, "teamName": "TAD"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Danny Pawson", "orderId": "", "playOrderId": "2", "playerId": "4782", "selBy": 0, "teamName": "TAD"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "19/2483.png", "isSel": -1, "name": "Mohammad Nadeem", "orderId": "", "playOrderId": "2", "playerId": "849", "selBy": 0, "teamName": "TAD"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Osama Shah", "orderId": "", "playOrderId": "2", "playerId": "1480", "selBy": 0, "teamName": "TAD"}], "teamBBan": [{"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Mohammad Qasim", "orderId": "", "playOrderId": "4", "playerId": "1592", "selBy": 0, "teamName": "TAD"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Hamza Rehman", "orderId": "", "playOrderId": "2", "playerId": "4784", "selBy": 0, "teamName": "TAD"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Shehan Dilshan", "orderId": "", "playOrderId": "3", "playerId": "4785", "selBy": 0, "teamName": "TAD"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Muhammad Uzair Khan", "orderId": "", "playOrderId": "4", "playerId": "1488", "selBy": 0, "teamName": "TAD"}, {"avg": "0", "endTime": "", "hs": "0", "imageId": "", "isSel": -1, "name": "Zia Mukhtar", "orderId": "", "playOrderId": "4", "playerId": "1489", "selBy": 0, "teamName": "TAD"}, {"avg": 0, "endTime": "", "hs": 0, "imageId": "", "isSel": -1, "name": "Arran Fernandez", "orderId": "", "playOrderId": "4", "playerId": "4977", "selBy": 0, "teamName": "TAD"}]}
    //     selectionTime = result.selStartTm;
    //                 setTeamA(result.teamA11);
    //                 setTeamB(result.teamB11);
    //                 setTeamABench(result.teamABan);
    //                 setTeamBBench(result.teamBBan);
    //                 setopponentName(result.opnName);
    //                 setopponentPic(result.opnImg);
    //                 setMyDefaultPlayers(result.myPlayers);
    //                 tossWinnerLastPic = result.oponLPlayer.playerId;
    //                 if((result.myPlayers).length > 0){
    //                     preDefinedPlayers = ((result.myPlayers)[0]);
    //                 }
    //                 filterTheSelectedData(result.teamA11,result.teamB11,result.teamABan,result.teamBBan);

    // }




    const callPlayer11Data = async() =>{
        showProgress();
        userInfo = JSON.parse(await AsyncStorage.getItem("player6-userdata"));
        userPF = JSON.parse(await AsyncStorage.getItem("player6-profile"));
      const myPromise = new Promise((resolve, reject)=>{
          const sysTime = getCurrentTime();
          Services.getInstance().getPlayersData(userInfo.userId, gameDetails.gameId, userInfo.accesToken, sysTime).then((result)=>{
            //  console.log(`------------------------->    Players List from user ${userInfo.userId} <-------------------------------------`);
              console.log('1stttttttttttt api       trigs',result);
              preDefinedPlayers = [];
              if(result.status == 200){
                  setIsRunning(true);  // start timer 00:30
                  selectionTime = result.selStartTm;
                  setTeamA(result.teamA11);
                  setTeamB(result.teamB11);
                  setTeamABench(result.teamABan);
                  setTeamBBench(result.teamBBan);
                  setopponentName(result.opnName);
                  setopponentPic(result.opnImg);
                  setMyDefaultPlayers(result.myPlayers);
                  tossWinnerLastPic = result.oponLPlayer.playerId;
                  if((result.myPlayers).length > 0){
                      preDefinedPlayers = ((result.myPlayers)[0]);
                  }
                  filterTheSelectedData(result.teamA11,result.teamB11,result.teamABan,result.teamBBan);
                  resolve ("true");
              }

              else{
                  reject("false");
              }
          })
      });
      hideProgress()
      return myPromise;
            
  }



//// sets if a player is slected isSel : "1"
// it is a just a fun() not ui render item, just sets player in ui also in state level

    const BindPlayerUI = () =>{
        setTeamA(prevTeamA => {
            const updatedTeamA = prevTeamA.map(element => {
              if ((element.playerId == tossWinnerLastPic) && (element.selBy != userInfo.userId)) {
                return { ...element, isSel : "1" };
              }
              return element;
            });
            return updatedTeamA;
          });

          setTeamB(prevTeamB => {
            const updatedTeamB = prevTeamB.map(element => {
              if ((element.playerId == tossWinnerLastPic) && (element.selBy != userInfo.userId)) {
                return { ...element, isSel : "1" };
              }
              return element;
            });
            return updatedTeamB;
          });

          setTeamABench(prevTeamAB => {
            const updatedTeamAB = prevTeamAB.map(element => {
              if ((element.playerId == tossWinnerLastPic) && (element.selBy != userInfo.userId)) {
                return { ...element, isSel : "1" };
              }
              return element;
            });
            return updatedTeamAB;
          });

          setTeamBBench(prevTeamBB => {
            const updatedTeamBB = prevTeamBB.map(element => {
              if ((element.playerId == tossWinnerLastPic) && (element.selBy != userInfo.userId)) {
                return { ...element, isSel : "1" };
              }
              return element;
            });
            return updatedTeamBB;
          });

    }






// navigates to 'CaptainViceCaptainSelection' if all 6 plrs sel done!
    const filterTheSelectedData = (teamA, teamB, teamAB, teamBB) =>{
        teamACount = 0;
        teamBCount = 0;
        teamA.length > 0 && teamA.forEach(element => {
            if(element.isSel == "1" && element.selBy == userInfo.userId){
                teamACount = teamACount + 1;
            }
            if(element.isSel == "1" && element.selBy != userInfo.userId){
                teamBCount = teamBCount + 1;
            }
        });
        teamB.length > 0 && teamB.forEach(element => {
            if(element.isSel == "1" && element.selBy == userInfo.userId){
                teamACount = teamACount + 1;
            }
            if(element.isSel == "1" && element.selBy != userInfo.userId){
                teamBCount = teamBCount + 1;
            }
        });
        teamAB?.length > 0 && teamAB?.forEach(element => {
            if(element.isSel == "1" && element.selBy == userInfo.userId){
                teamACount = teamACount + 1;
            }
            if(element.isSel == "1" && element.selBy != userInfo.userId){
                teamBCount = teamBCount + 1;
            }
        });
        teamBB?.length > 0 && teamBB?.forEach(element => {
            if(element.isSel == "1" && element.selBy == userInfo.userId){
                teamACount = teamACount + 1;
            }
            if(element.isSel == "1" && element.selBy != userInfo.userId){
                teamBCount = teamBCount + 1;
            }
        });
       // console.log(`Team A count from user ${userInfo.userId}------>`, teamACount)
        //console.log(`Team B count from user ${userInfo.userId} ------>`, teamACount)
        /////////////// uncmnt below code ///////////////////////////
        // if (teamACount == 6) {
        //     if(lateDelayClear){
        //         clearTimeout(lateDelayClear);
        //     }
        //     if(startTimeClear){
        //         clearTimeout(startTimeClear);
        //     }
        //     if (socketTriggered) {
        //         clearInterval(socketTriggered);
        //     }
        //     if(sec25int){
        //         clearInterval(sec25int);
        //     }
        //     if(globalTimeInterval){
        //         clearInterval(globalTimeInterval);
        //     }
        //     hideProgress();
        //     setLoading(false);
        //     const routes = navigation.getState()?.routes;
        //     if(routes[routes.length - 1].name == 'BothTeamOpponentSelection'){
        //         console.log("Moving");
        //         hideProgress();
        //         setLoading(false);
        //         navigation.navigate('CaptainViceCaptainSelection');
        //     }
        // }
    }


    const handlePlayerClick = (playerIndex, team, item) =>{
    const obj ={
        gameId: gameDetails.gameId,
        playerId: item.playerId,
        utcCTime : getCurrentTime()
    }
    
    console.log('2nd----api payload---',obj);
    Services.getInstance().saveFinalPlayers(obj, userInfo.userId, gameDetails.gameId, userInfo.accesToken).then((result)=>{
        console.log('2nd api--------success---',result);
        plseleccted = false;
        if(result.status == 200){
            callPlayer11Data().then(
                function(){
                    hideProgress();
                   // setLoading(true);
                    //selected = false;
                }
            ).catch(
                function(){
                    console.log("Line handleclick function")
                }
            );
        }

        else{
            console.log("------------------> Error in saving the final Player <-------------------")
            plseleccted = false;
            Functions.getInstance().Toast("error","Unable to connect to the server at this moment,try again later");
        }

    })
}

////////// real code below ////////
    // const handlePlayerClick = (playerIndex, team, item) =>{
    //     if(!plseleccted){
    //         plseleccted = true;
    //         showProgress();
    //         if(item.isSel == "1"){
    //             hideProgress();
    //             Functions.getInstance().Toast("error", "This player can't be selected..");
    //             plseleccted = false;
    //         }
    //         else{
    //             const sysTime2 = getCurrentTime();
    //             if(lateDelayClear){
    //                 clearTimeout(lateDelayClear);
    //             }
    //             if(startTimeClear){
    //                 clearTimeout(startTimeClear);
    //             }
    //             if (socketTriggered) {
    //                 clearInterval(socketTriggered);
    //             }
    //             if(sec25int){
    //                 clearInterval(sec25int);
    //             }
    //             if(globalTimeInterval){
    //                 clearInterval(globalTimeInterval);
    //             }
    //             setCurrentTime("00:00");
    //             const obj ={
    //                 gameId: gameDetails.gameId,
    //                 playerId: item.playerId,
    //                 utcCTime : sysTime2
    //             }

    //             console.log('2nd----api payload---',obj);
    //             Services.getInstance().saveFinalPlayers(obj, userInfo.userId, gameDetails.gameId, userInfo.accesToken).then((result)=>{
    //                 console.log('2nd api--------success---',result);
    //                 plseleccted = false;
    //                 if(result.status == 200){
    //                     callPlayer11Data().then(
    //                         function(){
    //                             hideProgress();
    //                            // setLoading(true);
    //                             //selected = false;
    //                         }
    //                     ).catch(
    //                         function(){
    //                             console.log("Line handleclick function")
    //                         }
    //                     );
    //                 }

    //                 else{
    //                     console.log("------------------> Error in saving the final Player <-------------------")
    //                     plseleccted = false;
    //                     Functions.getInstance().Toast("error","Unable to connect to the server at this moment,try again later");
    //                 }

    //             })
    //         }
    //     }

    // }






  // Stop button handler
  const handleStop = () => {
    setIsRunning(false); // Stop the timer
  };





  //////////////////////////////////////////////////////////// Display render() ///////////////////////////////////////////////////////////////////////
    const renderCountryBoxHeader = () => {
        return (
            <View style={styles.countryBoxTopHeader}>
                <View style={styles.teamLeft}>
                    <View style={styles.teamsImage}>
                        {userPF?.profileImg == "https://s3.amazonaws.com/dealstageuploads/pl6Uplods/" ?
                                <Image style={styles.teamsImageStyle} source={require('../../../assets/images/dummy.png')}/>
                                :
                                <Image style={styles.teamsImageStyle} source={ userPF ? {uri: myPic} : require('../../../assets/images/dummy.png')}/>
                        }
                    </View>
                    <View style={styles.teamName}>
                        <Text style={styles.teamLeftNameText}>{userPF ? userPF?.name : ""}</Text>
                    </View>
                </View>
                <View style={styles.timerBox}>
                    <Text style={styles.timerText}>{currentTime}</Text>
                </View>
                <View style={styles.teamRight}>
                    <View style={styles.teamRightImage}>
                        {opponentPic &&  opponentPic == "https://s3.amazonaws.com/dealstageuploads/pl6Uplods/" ?
                                <Image style={styles.teamsImageStyle} source={require('../../../assets/images/dummy.png')}/>
                                :
                                <Image style={styles.teamsImageStyle} source={ opponentPic ? { uri: opponentPic} : require('../../../assets/images/dummy.png')}/>
                        }
                    </View>
                    <View style={styles.teamRightTextContainer}>
                        <Text style={styles.teamLeftNameText}>{opponentName ? opponentName : ""}</Text>
                    </View>
                </View>

            </View>
        )
    }



  ////////////////////////// new Final Working code below ///////////////////////
  const renderPickPlayerCheckBox = () => {
    return (
        <View style={styles.ptkmain}>
            {/* Team A Player List */}
            <View style={[styles.pntlist, styles.ticklist, styles.btmlist]}>
                {Array.from({ length: 6 }).map((_, index) => {
                    // Find the player corresponding to the current index (if exists)
                    const player = myFinal[index];
                    const isPlayerSelected = player ? player.userId === userInfo?.userId : false;

                    return (
                        <View key= {index}
                        //{player ? player.userId : index}
                         style={[styles.pntitem, styles.ppicked]}>
                            {isPlayerSelected ? (
                                <Image style={styles.wtick} source={TickIcon} />
                            ) : null}
                        </View>
                    );
                })}
            </View>

            {/* Team B Player List */}
            <View style={[styles.pntlist, styles.ticklist, styles.btmlist, styles.slist]}>
                
                {Array.from({ length: 6 }).map((_, index) => {
                    // Find the opponent player corresponding to the current index (if exists)
                    const player = opFinal[index];
                    const isPlayerSelected_Opp = player ? player.userId !== userInfo?.userId : false;

                    return (
                        <View
                         key= {index}
                         //{player ? player.userId : index}
                          style={[styles.pntitem, styles.opicked]}>
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
    // const renderPickPlayerCheckBox = () => {
    //     return (
    //         <View style={styles.ptkmain}>
    //             <View style={[styles.pntlist, styles.ticklist, styles.btmlist]}>
    //                 {[1, 2, 3, 4, 5, 6].map((player, index) => (
    //                     index + 1 <= teamACount ?(
    //                     <View
    //                         key={index}
    //                         style={[styles.pntitem, index + 1 <= teamACount && isOpponent ? styles.opicked : styles.ppicked]}>
    //                         {index + 1 <= teamACount ? (
    //                             <Image style={styles.wtick} source={TickIcon} />
    //                         ) : ""}
    //                     </View>
    //                     )
    //                     :
    //                     <View
    //                         key={index}
    //                         style={[styles.pntitem, index + 1 <= teamACount]}>
    //                         {index + 1 <= teamACount ? (
    //                             <Image style={styles.wtick} source={TickIcon} />
    //                         ) : ""}
    //                     </View>

    //                 ))}
    //             </View>

    //             <View style={[styles.pntlist, styles.ticklist, styles.btmlist, styles.slist]}>
    //                 {[1, 2, 3, 4, 5, 6].map((player, index) => (

    //                     index + 1 <= teamBCount ? (
    //                     <View
    //                         key={index}
    //                         style={[styles.pntitem, index + 1 <= teamBCount && isOpponent ? styles.ppicked :  styles.opicked]}
    //                     >
    //                      {index + 1 <= teamBCount ? (
    //                             <Image style={styles.wtick} source={TickIcon} />
    //                      ) : ""}
    //                     </View>
    //                     )
    //                     :
    //                     <View
    //                         key={index}
    //                         style={[styles.pntitem, index + 1 <= teamBCount ]}
    //                     >
    //                      {index + 1 <= teamBCount ? (
    //                             <Image style={styles.wtick} source={TickIcon} />
    //                      ) : ""}
    //                     </View>
    //                 ))}
    //             </View>
    //         </View>
    //     );
    // };

    // const renderTeamAItem = ({ item, index }) => (
    //         <View style={[styles.tmplyrlft,
    //             (item.isSel == "1"  && isOpponent && item.selBy == userInfo?.userId) ? styles.borderTopOrangeWidth
    //             :
    //             (item.isSel == "1"  && isOpponent == false && item.selBy == userInfo?.userId) ? styles.borderTopBlueWidth
    //             :
    //             (item.isSel == "1"  && isOpponent && item.selBy != userInfo?.userId) ? styles.borderTopBlueWidth
    //             :
    //             (item.isSel == "1"  && isOpponent == false && item.selBy != userInfo?.userId) ? styles.borderTopOrangeWidth
    //             :
    //             "grey"
    //         ]}>
    //             <View style={styles.plyrlft}>
    //                 <View style={[styles.plyrprfl, styles.plyrlftprfl]}>
    //                 {item.imageId == "" ? <Image style={styles.teamsImageStyle} source={require('../../../assets/images/dummy.png')}/>
    //                     :
    //                     <Image style={styles.teamsImageStyle} source={{ uri: `https://cdn.sportmonks.com/images/cricket/players/${item.imageId}` }} />
    //                 }
    //                 </View>
    //                 <View style={{ marginTop: 5 }}>
    //                     <Text style={[styles.ortxt, styles.plyrtm, styles.plyrsd]}>{item.teamName}</Text>
    //                 </View>
    //             </View>
    //             <View style={[styles.dotp, styles.dotp2]}>
    //                 <Image style={styles.dotimg} source={BorderLine2} />
    //             </View>
    //             <View>
    //                 <Text style={[styles.teamnm, styles.wnrtxt, styles.tmname, styles.plyrname]}>{item.name}</Text>
    //                 <Text style={[styles.teamnm, styles.plyrruns]}>Avg : {item.avg}</Text>
    //                 <Text style={[styles.ortxt, styles.plyrruns]}>HS : {item.hs}</Text>
    //             </View>

    //             <TouchableOpacity
    //                 style={[styles.adplyr,
    //                     {backgroundColor:
    //                         (item.isSel == "1"  && isOpponent && item.selBy == userInfo?.userId) ? "orange"
    //                         :
    //                         (item.isSel == "1"  && isOpponent == false && item.selBy == userInfo?.userId) ? "#246afe"
    //                         :
    //                         (item.isSel == "1"  && isOpponent && item.selBy != userInfo?.userId) ? "#246afe"
    //                         :
    //                         (item.isSel == "1"  && isOpponent == false && item.selBy != userInfo?.userId) ? "orange"
    //                         :

    //                         "grey" }]}
    //                 disabled={item.isSel == "1"}
    //                 onPress={() => {
    //                     Functions.getInstance().fireAdjustEvent("pogpop");
    //                     Functions.getInstance().fireFirebaseEvent("Players11SelectionPlusButton");
    //                     let properties = new MoEProperties();
    //                     properties.addAttribute("clicked", true);
    //                     ReactMoE.trackEvent("LIVE Player Selection", properties);
    //                     handlePlayerClick(index, 1, item);
    //                     selected = true;
    //                 }}
    //             >
    //                 {item.isSel == "1" ? (
    //                     <Image style={{width:8,height:8}} source={TickIcon}/>
    //                 ) : (
    //                     <Image style={styles.adplusimg} source={PlusIcon} />
    //                 )}
    //             </TouchableOpacity>

    //         </View>
    // );


    //////////// gpt code below ///////////

    const renderTeamAItem = ({ item, index }) => {
        const getBorderColor = (item, isOpponent, userId) => {
            if (item.isSel == "1") {
                if (isOpponent) {
                    return item.selBy == userId ? styles.borderTopOrangeWidth : styles.borderTopBlueWidth;
                } else {
                    return item.selBy == userId ? styles.borderTopBlueWidth : styles.borderTopOrangeWidth;
                }
            }
            return "grey";
        };
    
        const getBackgroundColor = (item, isOpponent, userId) => {
            if (item.isSel == "1") {
                if (isOpponent) {
                    return item.selBy == userId ? "orange" : "#246afe";
                } else {
                    return item.selBy == userId ? "#246afe" : "orange";
                }
            }
            return "grey";
        };
    
        const trackSelectionEvent = () => {
            Functions.getInstance().fireAdjustEvent("pogpop");
            Functions.getInstance().fireFirebaseEvent("Players11SelectionPlusButton");
            const properties = new MoEProperties();
            properties.addAttribute("clicked", true);
            ReactMoE.trackEvent("LIVE Player Selection", properties);
        };
    
        // Check if the current player's ID exists in global_6players
        const isPlayerDisabled = global_6players.some(player => player.playerId === item.playerId);
    
        return (
            <View
                style={[
                    styles.tmplyrlft,
                    getBorderColor(item, isOpponent, userInfo?.userId)
                ]}
            >
                <View style={styles.plyrlft}>
                    <View style={[styles.plyrprfl, styles.plyrlftprfl]}>
                        {item.imageId === "" ? (
                            <Image style={styles.teamsImageStyle} source={require('../../../assets/images/dummy.png')} />
                        ) : (
                            <Image
                                style={styles.teamsImageStyle}
                                source={{ uri: `https://cdn.sportmonks.com/images/cricket/players/${item.imageId}` }}
                            />
                        )}
                    </View>
                    <View style={{ marginTop: 5 }}>
                        <Text style={[styles.ortxt, styles.plyrtm, styles.plyrsd]}>{item.teamName}</Text>
                    </View>
                </View>
                <View style={[styles.dotp, styles.dotp2]}>
                    <Image style={styles.dotimg} source={BorderLine2} />
                </View>
                <View>
                    <Text style={[styles.teamnm, styles.wnrtxt, styles.tmname, styles.plyrname]}>{item.name}</Text>
                    <Text style={[styles.teamnm, styles.plyrruns]}>Avg : {item.avg}</Text>
                    <Text style={[styles.ortxt, styles.plyrruns]}>HS : {item.hs}</Text>
                </View>
    
                <TouchableOpacity
                      
                    style={[
                        styles.adplyr,
                        {
                            //   backgroundColor: getBackgroundColor(item, isOpponent, userInfo?.userId)
                            backgroundColor: isPlayerDisabled? 'red': 'white'
                            
                             }
                    ]}
                    disabled={isPlayerDisabled} // Disable if player is already selected or in global_6players
                    onPress={() => {
                        trackSelectionEvent();
                        handlePlayerClick(index, 1, item);
                        selected = true;
                    }}
                >
                    {item.isSel === "1" ? (
                        <Image style={{ width: 8, height: 8 }} source={TickIcon} />
                    ) : (
                        <Image style={styles.adplusimg} source={PlusIcon} />
                    )}
                </TouchableOpacity>
            </View>
        );
    };
    


    const renderTeamBItem = ({ item, index }) => {
        // Check if the current player's ID exists in global_6players
        const isPlayerDisabled = global_6players.some(player => player.playerId === item.playerId);
    
        return (
            <View style={[styles.tmplyrlft,
                (item.isSel == "1" && isOpponent && item.selBy == userInfo?.userId) ? styles.borderTopOrangeWidth :
                (item.isSel == "1" && !isOpponent && item.selBy == userInfo?.userId) ? styles.borderTopBlueWidth :
                (item.isSel == "1" && isOpponent && item.selBy != userInfo?.userId) ? styles.borderTopBlueWidth :
                (item.isSel == "1" && !isOpponent && item.selBy != userInfo?.userId) ? styles.borderTopOrangeWidth :
                "grey"
            ]}>
                <View style={styles.plyrlft}>
                    <View style={[styles.plyrprfl, styles.plyrlftprfl]}>
                        {item.imageId === "" ? 
                            <Image style={styles.teamsImageStyle} source={require('../../../assets/images/dummy.png')} /> :
                            <Image style={styles.teamsImageStyle} source={{ uri: `https://cdn.sportmonks.com/images/cricket/players/${item.imageId}` }} />
                        }
                    </View>
                    <View style={{ marginTop: 5 }}>
                        <Text style={[styles.ortxt, styles.plyrtm, styles.plyrsd]}>{item.teamName}</Text>
                    </View>
                </View>
                <View style={[styles.dotp, styles.dotp2]}>
                    <Image style={styles.dotimg} source={BorderLine2} />
                </View>
                <View>
                    <Text style={[styles.teamnm, styles.wnrtxt, styles.tmname, styles.plyrname]}>{item.name}</Text>
                    <Text style={[styles.teamnm, styles.plyrruns]}>Avg : {item.avg}</Text>
                    <Text style={[styles.ortxt, styles.plyrruns]}>HS : {item.hs}</Text>
                </View>
    
                <TouchableOpacity 
                    style={[styles.adplyr,
                        { backgroundColor: isPlayerDisabled? 'red' : 'white'
                        }
                    ]}
                    onPress={() => {
                        Functions.getInstance().fireAdjustEvent("pogpop");
                        Functions.getInstance().fireFirebaseEvent("Players11SelectionPlusButton");
                        let properties = new MoEProperties();
                        properties.addAttribute("clicked", true);
                        ReactMoE.trackEvent("LIVE Player Selection", properties);
                        handlePlayerClick(index, 2, item);
                        selected = true;
                    }}
                    disabled={isPlayerDisabled} // Disable if player is already selected or in global_6players
                >
                    {item.isSel === "1" ? (
                        <Image style={{ width: 8, height: 8 }} source={TickIcon} />
                    ) : (
                        <Image style={styles.adplusimg} source={PlusIcon} />
                    )}
                </TouchableOpacity>
            </View>
        );
    };



    return (
        <View style={{ flex: 1, marginTop : 60, backgroundColor: '#111'}}>
            {/* <ScrollView style={styles.scrollView}> */}
                <View style={[styles.headerContainer]}>
                    <View style={styles.countryBox}>
                        {renderCountryBoxHeader()}
                        {renderPickPlayerCheckBox()}
                    </View>
                    <ScrollView style={styles.scrollView}>
                    <Text style={[styles.headingText, styles.ennum,{textAlign : 'center'}]}>Select Your P6 Squads</Text>
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
                </View>

            {/* </ScrollView> */}
            {loading ?
                <LoadingPopup
                isVisible={loading}
                closePopup = {()=>setLoading(false)}
                navigation={navigation}
                teamA={teamA}
                teamB={teamB}
                teamABench={teamABench}
                teamBBench={teamBBench}
                isOpponent={isOpponent}
                userInfo={userInfo}/>
                : "" }

        </View>
    );
};

export default WithProgress(inject('UserStore')(observer(BothTeamOpponentSelection)));
