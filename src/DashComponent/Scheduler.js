import { showSimpleAlert } from "../components/AlertMsg";
import { getTankAlert, saveTankAlerts } from "../utility/admin";
import { getHomeData, getSensorData, getSupplyList, updateHomeData, updateSupplyDetails } from "../utility/espFucntion";
import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { AlertContext } from "./MyDashboard";
    
    // supplyReducer for maintaining timer
    export const supplyReducer = (supplyInfo, action) => {
        let { startAfter, remainTime, timerOn, remainRoom, remainQuantity, supplyType }
            = supplyInfo;
        switch (action.type) {
            case "decStartAfter":
                startAfter = startAfter - 1;
                break;
            case "resetStartAfter":
                startAfter = -1;
                break;
            case "setStartAfter":
                startAfter = action.value;
                break;
            case "decRemainTime":
                remainTime = remainTime - 1;
                break;
            case "resetRemainTime":
                remainTime = -1;
                break;
            case "setRemainTime":
                remainTime = action.value;
                break;
            case "decRemainQuantity":
                remainQuantity = remainQuantity - 1;
                break;
            case "resetRemainQuantity":
                remainQuantity = -1;
                break;
            case "setRemainQuantity":
                remainQuantity = action.value;
                break;
            case "setTimerOn":
                timerOn = action.value;
                break;
            case "decRemainRoom":
                remainRoom = remainRoom - 1;
                break;
            case "setRemainRoom":
                remainRoom = action.value;
                break;
            case "setType":
                supplyType = action.value;
                break;
            default:
                return supplyInfo;
        }
        return { startAfter, remainTime, remainQuantity, remainRoom, timerOn, supplyType };
    }

    // load supply list from database
    export const loadSupplyList = async ({setSupplyList}) => {
        const slist = await getSupplyList();
        // console.log(slist);
        let roomList = [];
        for (let i = 0; i < slist.length; i++) {
            if (slist[i].status === 'active') {
                roomList.push({ ...slist[i], supplyOn: slist[i].status === 'active', supplyStatus: 0, waterPassed: 0 });
            }
        }
        console.log(roomList);
        if (roomList) {
            setSupplyList(roomList)
        }
        // console.log(slist);
        return roomList;
    }

    
    // update waterpassed from server
    export const updateWaterPassed = async ({supplyList,setSupplyList}) => {
        // setTimeout(async () => {
            console.log(supplyList);
        const roomList = await getHomeData();
        let slist = [...supplyList];
        console.log(slist);
        for (let i = 0; i < roomList.length; i++) {
            if (slist[0] && roomList[i].roomNo === slist[0].room && roomList[i].waterPassed) {
                slist[0].waterPassed = roomList[i].waterPassed;
            } else if (slist[1] && roomList[i].roomNo === slist[1].room && roomList[i].waterPassed) {
                slist[1].waterPassed = roomList[i].waterPassed;
            }
        }
        if (slist)
            setSupplyList(slist);
        // console.log("Supply list updated ");
        // }, 1500);
    }

    export const resetSupplyStatus = ({supplyList,setSupplyList}) => {
        const slist = supplyList;
        let roomList = [];
        for (let i = 0; i < slist.length; i++) {
            if (slist[i].supplyOn) {
                roomList.push({ ...slist[i], supplyStatus: 0, waterPassed: 0 });
            }
        }
        setSupplyList(roomList)
    }

    const formattedTime=(sec)=>{
        return `${parseInt(sec/86400)}days ${parseInt(sec/3600)%24}hr ${parseInt(sec/60)%60}min ${parseInt(sec%60)}s`
    }

     // use effect based timer
    // , [supplyInfo]);

    // stop timer by reseting time values
    export const stopTimer = ({setSupplyInfo,supplyInfo,timerMsg,homeData,setHomeData,supplyList,setSupplyList}) => {
        setSupplyInfo({ type: "resetStartAfter" });
        setSupplyInfo({ type: "resetRemainQuantity" });
        setSupplyInfo({ type: "resetRemainTime" });
        setSupplyInfo({ type: "setTimerOn", value: false });
        if (supplyInfo.remainTime > 0 && supplyInfo.startAfter < 1) {
            timerMsg = `Motor Stopped`;
            showSimpleAlert("Motor Stopped");
        } else {
            timerMsg = `Timer Stopped`;
            showSimpleAlert("Timer Stopped");
        }
        // updateSensorData({ motorOn: false });
        setTimeout(() => {
            updateWaterPassed({supplyList,setSupplyList});
        }, 2100);
        updateHomeData([{ roomNo: 1, supplyOn: false }, { roomNo: 2, supplyOn: false }], true);
        setHomeData({ ...homeData, roomNo: 0, flowSpeed: 0, supplyOn: false });
    }

    export const VolumeProvider= createContext("")
    export const TimeInputProvider= createContext("")
    export const HomeDataProvider= createContext("")
    export const SupplyListProvider= createContext("")
    export const SupplyInfoProvider= createContext("")
    export const TimerMsgProvider= createContext("")
    export const Scheduler = ({children}) => {
        const {setAlerts}= useContext(AlertContext)
        const [timerMsg, setTimerMsg] = useState("");
        const [scheduleTime, setScheduleTime] = useState({startTime: '',stopAfter: '',});
        const [waterVolume, setWaterVolume] = useState({ currUTVolume: 0, currLTVolume: 0, prevUTVolume: 0, prevLTVolume: 0 });
        const [supplyBy, setSupplyBy] = useState('time');
        const [homeData, setHomeData] = useState({ roomNo: 0, flowSpeed: 0, waterPassed: 0, supplyOn: false });
        const [supplyList, setSupplyList] = useState([
            { room: 1, name: 'Room1', supplyOn: false, supplyStatus: 0, waterPassed: 0 },
            { room: 2, name: 'Room2', supplyOn: false, supplyStatus: 0, waterPassed: 0 },
        ]);
        const [supplyInfo, setSupplyInfo] = useReducer(supplyReducer, { startAfter: 0, remainTime: 0, remainQuantity: 0, remainRoom: 0, timerOn: false, supplyType: 'T' });
    
        useEffect(() => {
            let intervalId;
            // console.log(supplyInfo.remainTime, supplyInfo.remainRoom);
            
            if(!(supplyInfo.remainQuantity>=0 || supplyInfo.remainTime>=0 || supplyInfo.remainRoom>=0)){
                console.log(supplyInfo);
                const timeStamp= new Date().toISOString()
                updateSupplyDetails({lastSupply:timeStamp})
                saveTankAlerts({timeStamp,type:"supply",message:"Supplied water to home tank"})
                .then(()=>{
                    getTankAlert()
                    .then((data)=>{
                        if(data && data.alerts){
                        setAlerts({alertsMsg:data.alerts.reverse(),markRead:data.read});
                        console.log(data.alerts);
                        }
                    })
                })
            }
            if (supplyInfo.startAfter >= 0 && supplyInfo.timerOn) {
                if (supplyInfo.remainTime >= 0 || supplyInfo.remainQuantity >= 0) {
                    setTimerMsg(`Motor will start in ${formattedTime(supplyInfo.startAfter)}`)
                    intervalId = setInterval(() => {
                        setSupplyInfo({ type: "decStartAfter" });
                        console.log(supplyInfo.startAfter);
                        if (supplyInfo.startAfter === 0) {
                            setSupplyInfo({ type: "decStartAfter" });
                            if (supplyInfo.remainTime <= 0) {
                                // updateSensorData({ motorOn: true });
                                if (supplyBy === 'quantity') {
                                    getSensorData().then((data) => {
                                        setWaterVolume({ currUTVolume: data.UTVolume, currLTVolume: data.LTVolume, prevUTVolume: data.UTVolume, prevLTVolume: data.LTVolume });
                                        if (!(data.currUTVolume >= 0 && data.currUTVolume <= 1400)) {
                                            getSensorData().then((data) => {
                                                setWaterVolume({ currUTVolume: data.UTVolume, currLTVolume: data.LTVolume, prevUTVolume: data.UTVolume, prevLTVolume: data.LTVolume })
                                            });
                                        }
                                    });
                                }
                                setTimerMsg(`Motor Started`)
                                showSimpleAlert("Motor Started");
                            }
                        }
                    }, 1000);
                }
            } else if (supplyInfo.remainTime >= 0 && supplyInfo.remainRoom >= 0 && supplyInfo.timerOn) {
                const currentRoom = supplyList[supplyList.length - supplyInfo.remainRoom];
                if (currentRoom) {
                    getHomeData().then((rdata) => {
                        rdata.find((item) => {
                            if (item.roomNo === currentRoom.room) {
                                console.log(item);
                                setHomeData(item);
                                return true;
                            }
                            return false;
                        });
                    });
                    if (currentRoom.supplyStatus === 0) {
                        currentRoom.supplyStatus = 1;
                        updateWaterPassed({supplyList,setSupplyList});
                        setTimeout(() => {
                            updateWaterPassed({supplyList,setSupplyList});
                        }, 1100);
                        updateHomeData({ roomNo: currentRoom.room, supplyOn: true });
                    }
                    setTimerMsg(`Motor will stop in ${formattedTime(supplyInfo.remainTime)} for room ${currentRoom.room}, remaining ${supplyInfo.remainRoom - 1}`)
                }
                intervalId = setInterval(() => {
                    if (supplyInfo.remainRoom > 0) {
    
                        setSupplyInfo({ type: "decRemainTime" });
                        console.log(supplyInfo.remainTime);
                        if (supplyInfo.remainTime === 0) {
                            setSupplyInfo({ type: "decRemainRoom" });
                            updateHomeData({ roomNo: currentRoom.room, supplyOn: false });
                            supplyList[supplyList.length - supplyInfo.remainRoom].supplyStatus = 2;
    
                            console.log("Finished room " + currentRoom.room);
    
                            updateWaterPassed({supplyList,setSupplyList});
                            console.log(supplyList);
    
                            if (supplyInfo.remainRoom > 0) {
                                setSupplyInfo({ type: "setRemainTime", value: Number.parseInt(scheduleTime.stopAfter * 60) });
                            }
                            else {
                                setSupplyInfo({ type: "decRemainTime" });
                                stopTimer({setSupplyInfo,supplyInfo,timerMsg,homeData,setHomeData,supplyList,setSupplyList});
                            }
                        }
                    } else {
                        setSupplyInfo({ type: "decRemainRoom" });
                        stopTimer({setSupplyInfo,supplyInfo,timerMsg,homeData,setHomeData,supplyList,setSupplyList});
                    }
                }, 1000);
            } else if (supplyInfo.remainQuantity >= 0 && supplyInfo.remainRoom >= 0 && supplyInfo.timerOn) {
                const currentRoom = supplyList[supplyList.length - supplyInfo.remainRoom];
    
                getSensorData().then((data) => {
                    setWaterVolume({ ...waterVolume, currUTVolume: data.UTVolume, currLTVolume: data.LTVolume })
                })
                updateWaterPassed({supplyList,setSupplyList});
                let passedVolume = waterVolume.prevUTVolume - waterVolume.currUTVolume;
                if (currentRoom) {
                    getHomeData().then((rdata) => {
                        rdata.find((item) => {
                            if (item.roomNo === currentRoom.room) {
                                console.log(item);
                                setHomeData(item);
                                return true;
                            }
                            return false;
                        });
                    });
                    if (currentRoom.supplyStatus === 0) {
                        currentRoom.supplyStatus = 1;
                        updateHomeData({ roomNo: currentRoom.room, supplyOn: true });
                    }
                    setTimerMsg(`${passedVolume} ml water passed from ${supplyInfo.remainQuantity}, current room(${currentRoom.room}), remaining rooms: ${supplyInfo.remainRoom - 1}
                    CurrentVolume ${waterVolume.currUTVolume}, Prev Volume ${waterVolume.prevUTVolume}`)
                }
                intervalId = setInterval(() => {
                    if (supplyInfo.remainRoom > 0) {
    
                        let waterPass = supplyList[supplyList.length - supplyInfo.remainRoom];
                        setSupplyInfo({ type: "decRemainTime" });
                        setTimeout(() => {
                            updateWaterPassed({supplyList,setSupplyList});
                            getHomeData().then((rdata) => {
                                rdata.find((item) => {
                                    if (item.roomNo === waterPass.room) {
                                        console.log(item);
                                        setHomeData(item);
                                        return true;
                                    }
                                    return false;
                                });
                            });
                        }, 500);
    
                        //if the flowsensor shows less than 50% water has passed but tank water is reduced more than given amount
                        if (passedVolume >= supplyInfo.remainQuantity && waterPass.waterPassed < scheduleTime.stopAfter * 0.5) {
                            getSensorData().then((data) => {
                                setWaterVolume({ currUTVolume: data.UTVolume, currLTVolume: data.LTVolume, prevUTVolume: data.UTVolume - waterPass.waterPassed, prevLTVolume: data.LTVolume })
                            })
                            console.log("Stopped");
                        }
                        //if the flowsensor is showing 90% water has passed or the tank is showing given amount is reduced
                        else if (passedVolume >= supplyInfo.remainQuantity || waterPass.waterPassed + 2 * homeData.flowSpeed >= scheduleTime.stopAfter * 0.9) {
                            console.log(`Water Passed for room:${currentRoom.room}(fs): ${waterPass.waterPassed}+${2 * homeData.flowSpeed}`);
                            console.log(`Water Passed for room:${currentRoom.room}(tank based): ${passedVolume}`);
                            setSupplyInfo({ type: "decRemainRoom" });
                            updateHomeData({ roomNo: currentRoom.room, supplyOn: false });
                            supplyList[supplyList.length - supplyInfo.remainRoom].supplyStatus = 2;
    
                            console.log("Finished room " + currentRoom.room);
    
                            updateWaterPassed({supplyList,setSupplyList});
                            console.log(supplyList);
    
                            if (supplyInfo.remainRoom > 0) {
                                getSensorData().then((data) => {
                                    setWaterVolume({ currUTVolume: data.UTVolume, currLTVolume: data.LTVolume, prevUTVolume: data.UTVolume, prevLTVolume: data.LTVolume });
                                    setSupplyInfo({ type: "decRemainTime" });
                                });
                                setSupplyInfo({ type: "setRemainQuantity", value: scheduleTime.stopAfter });
                            }
                            else {
                                // setSupplyInfo({ type: "decRemainTime" });
                                stopTimer({setSupplyInfo,supplyInfo,timerMsg,homeData,setHomeData,supplyList,setSupplyList});
                            }
                        }
                    } else {
                        setSupplyInfo({ type: "decRemainRoom" });
                        stopTimer({setSupplyInfo,supplyInfo,timerMsg,homeData,setHomeData,supplyList,setSupplyList});
                    }
                }, 1000);
            }
            return () => {
                clearInterval(intervalId);
            };
            
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [supplyInfo])


      return (
        <SupplyInfoProvider.Provider value={{supplyInfo,setSupplyInfo}}>
        <VolumeProvider.Provider value={{waterVolume,setWaterVolume}}>
        <HomeDataProvider.Provider value={{homeData,setHomeData}}>
        <TimeInputProvider.Provider value={{scheduleTime,setScheduleTime,supplyBy,setSupplyBy}}>
        <SupplyListProvider.Provider value={{supplyList,setSupplyList}}>
        <TimerMsgProvider.Provider value={{timerMsg,setTimerMsg}}>
            {children}
        </TimerMsgProvider.Provider>
        </SupplyListProvider.Provider>
        </TimeInputProvider.Provider>
        </HomeDataProvider.Provider>
        </VolumeProvider.Provider>
        </SupplyInfoProvider.Provider>
      )
    }
    
    export default Scheduler