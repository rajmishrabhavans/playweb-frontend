import '../App.css'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { getHomeData, getSensorData, getSupplyList, updateHomeData, updateSupplyDetails } from '../utility/espFucntion';
import { useNavigate } from 'react-router-dom';
import { showSimpleAlert } from '../components/AlertMsg';
import { getTankAlert, saveTankAlerts } from '../utility/admin';
import { AlertContext } from './MyDashboard';

const initSchedule = {
    startTime: '',
    stopAfter: '',
}
let timerMsg = "";
const ScheduleWater = () => {
    const navigate = useNavigate();
    const {setAlerts}= useContext(AlertContext)
    const [scheduleTime, setScheduleTime] = useState(initSchedule);
    const [waterVolume, setWaterVolume] = useState({ currUTVolume: 0, currLTVolume: 0, prevUTVolume: 0, prevLTVolume: 0 });
    const [supplyBy, setsupplyBy] = useState('time');
    const [homeData, setHomeData] = useState({ roomNo: 0, flowSpeed: 0, waterPassed: 0, supplyOn: false });
    const [supplyList, setSupplyList] = useState([
        { room: 1, name: 'Room1', supplyOn: false, supplyStatus: 0, waterPassed: 0 },
        { room: 2, name: 'Room2', supplyOn: false, supplyStatus: 0, waterPassed: 0 },
    ]);

    // supplyReducer for maintaining timer
    const supplyReducer = (supplyInfo, action) => {
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
    const [supplyInfo, setSupplyInfo] = useReducer(supplyReducer, { startAfter: 0, remainTime: 0, remainQuantity: 0, remainRoom: 0, timerOn: false, supplyType: 'T' });


    // load supply list from database
    const loadSupplyList = async () => {
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
    const updateWaterPassed = async () => {
        // setTimeout(async () => {
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

    const resetSupplyStatus = () => {
        const slist = supplyList;
        let roomList = [];
        for (let i = 0; i < slist.length; i++) {
            if (slist[i].supplyOn) {
                roomList.push({ ...slist[i], supplyStatus: 0, waterPassed: 0 });
            }
        }
        setSupplyList(roomList)
    }

    // start timer when time is scheduled and confirmed
    const startTimer = () => {
        if (supplyInfo.timerOn) stopTimer();
        const { startTime, stopAfter } = scheduleTime;
        // console.log(startTime,stopAfter);
        if (!startTime) {
            showSimpleAlert("Select start time", 'red')
            return;
        } else if (!stopAfter) {
            showSimpleAlert("Select stop time", 'red')
            return;
        } else if (stopAfter > 1000 || stopAfter < 0) {
            showSimpleAlert("Select proper stop time in range[0-1000]", 'red')
            return;
        }
        let timeDiff = Number.parseInt((Date.parse(scheduleTime.startTime) - Date.now()) / 1000);
        if (timeDiff < 0) {
            showSimpleAlert("Enter proper start time", 'red');
            return;
        }
        // console.log("RoomList: ",supplyList);
        resetSupplyStatus();
        updateHomeData([{ roomNo: 1, supplyOn: false, resetFlow: true }, { roomNo: 2, supplyOn: false, resetFlow: true }], true);

        setSupplyInfo({ type: "setRemainRoom", value: supplyList.length });
        setSupplyInfo({ type: "setStartAfter", value: timeDiff });
        if (supplyBy === 'time') {
            setSupplyInfo({ type: "setRemainTime", value: Number.parseInt(stopAfter * 60) });
        } else {
            setSupplyInfo({ type: "setRemainQuantity", value: stopAfter });
            getSensorData().then((data) => {
                setWaterVolume({ currUTVolume: data.UTVolume, currLTVolume: data.LTVolume, prevUTVolume: data.UTVolume, prevLTVolume: data.LTVolume })
            })
        }
        setSupplyInfo({ type: "setTimerOn", value: true });
    }

    const formattedTime=(sec)=>{
        return `${parseInt(sec/86400)}days ${parseInt(sec/3600)%24}hr ${parseInt(sec/60)%60}min ${parseInt(sec%60)}s`
    }

    // use effect based timer
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
                    setAlerts(data.alerts);
                    console.log(data.alerts);
                })
            })
        }
        if (supplyInfo.startAfter >= 0 && supplyInfo.timerOn) {
            if (supplyInfo.remainTime >= 0 || supplyInfo.remainQuantity >= 0) {
                timerMsg = `Motor will start in ${formattedTime(supplyInfo.startAfter)}`
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
                            timerMsg = `Motor Started`
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
                    updateWaterPassed();
                    setTimeout(() => {
                        updateWaterPassed();
                    }, 1100);
                    updateHomeData({ roomNo: currentRoom.room, supplyOn: true });
                }
                timerMsg = `Motor will stop in ${formattedTime(supplyInfo.remainTime)} for room ${currentRoom.room}, remaining ${supplyInfo.remainRoom - 1}`
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

                        updateWaterPassed();
                        console.log(supplyList);

                        if (supplyInfo.remainRoom > 0) {
                            setSupplyInfo({ type: "setRemainTime", value: Number.parseInt(scheduleTime.stopAfter * 60) });
                        }
                        else {
                            setSupplyInfo({ type: "decRemainTime" });
                            stopTimer();
                        }
                    }
                } else {
                    setSupplyInfo({ type: "decRemainRoom" });
                    stopTimer();
                }
            }, 1000);
        } else if (supplyInfo.remainQuantity >= 0 && supplyInfo.remainRoom >= 0 && supplyInfo.timerOn) {
            const currentRoom = supplyList[supplyList.length - supplyInfo.remainRoom];

            getSensorData().then((data) => {
                setWaterVolume({ ...waterVolume, currUTVolume: data.UTVolume, currLTVolume: data.LTVolume })
            })
            updateWaterPassed();
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
                timerMsg = `${passedVolume} ml water passed from ${supplyInfo.remainQuantity}, current room(${currentRoom.room}), remaining rooms: ${supplyInfo.remainRoom - 1}\n
                CurrentVolume ${waterVolume.currUTVolume}, Prev Volume ${waterVolume.prevUTVolume}`
            }
            intervalId = setInterval(() => {
                if (supplyInfo.remainRoom > 0) {

                    let waterPass = supplyList[supplyList.length - supplyInfo.remainRoom];
                    setSupplyInfo({ type: "decRemainTime" });
                    setTimeout(() => {
                        updateWaterPassed();
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

                        updateWaterPassed();
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
                            stopTimer();
                        }
                    }
                } else {
                    setSupplyInfo({ type: "decRemainRoom" });
                    stopTimer();
                }
            }, 1000);
        }
        return () => {
            clearInterval(intervalId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supplyInfo]);

    // stop timer by reseting time values
    const stopTimer = () => {
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
            updateWaterPassed();
        }, 2100);
        updateHomeData([{ roomNo: 1, supplyOn: false }, { roomNo: 2, supplyOn: false }], true);
        setHomeData({ ...homeData, roomNo: 0, flowSpeed: 0, supplyOn: false });
    }

    // check if user is authenticated to get data
    useEffect(() => {
        if (localStorage.getItem('loggedin')) {
            loadSupplyList().then((slist) => {
                console.log(slist);
            });
            getSensorData().then((data) => {
                setWaterVolume({ currUTVolume: data.UTVolume, currLTVolume: data.LTVolume, prevUTVolume: data.UTVolume, prevLTVolume: data.LTVolume })
            })
            // getHomeData();
        } else {
            navigate('/login')
        }
        return () => {
            // updateSensorData({ motorOn: false });
            updateHomeData([{ roomNo: 1, supplyOn: false }, { roomNo: 2, supplyOn: false }], true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // list item to be displayed
    // list item to be displayed
    const CurrRoom = (room, name, wing, waterPassed, supplyStatus) => {
        let color,status;
        switch (supplyStatus) {
            case 0:
                color = 'warning'
                status = 'upcoming'
                break;
            case 1:
                color = 'success';
                status = 'ongoing'
                break;
            case 2:
                color = 'primary'
                status = 'completed'
                break;

            default:
                status = 'other'
                color = 'info'
                break;
        }
        return (
            <tr key={room}>
                <td className="text-start">{name}</td>
                <td className="text-center">{wing}/{room}</td>
                <td className="text-center">
                    <div className={`badge badge-${color}`}>{status}</div>
                </td>
                <td className="text-center ">{supplyStatus === 1?homeData.flowSpeed:0} ml/s</td>
                <td className="text-center ">{supplyStatus === 1?homeData.waterPassed:waterPassed} ml</td>
            </tr>
        );
    }


    // list item to be displayed
    // const sList = (room, name, waterPassed, supplyStatus) => {
    //     return (
    //         <li key={room} className="list-group-item d-flex">
    //             <div className="col-2 col-sm-1">
    //                 <span>{supplyStatus}</span>
    //             </div>
    //             <div className="col-1" >
    //                 <span className="roomno"  >{room}</span>
    //             </div>
    //             <div className="col-8 col-sm-5">
    //                 {" " + name}
    //             </div>
    //             <div className="col-4 d-flex">
    //                 {room === homeData.roomNo && homeData.flowSpeed + " mL/s " + homeData.waterPassed + " mL"}
    //                 {supplyStatus === 2 && waterPassed + " mL passed"}
    //             </div>
    //         </li>
    //     );
    // }

    return (
        <>

            <h2 className="text-center text-dark mb-3">Schedule Supply</h2>
            <div id="row text-center">
                <div className='m-4 mx-auto d-flex flex-column pe-2 w-80 col-lg-10 col-xl-8'>

                    <div className='card p-4'>
                        <div className='mb-2'>Set Motor start time :</div>
                        <input className="me-4 form-control mb-2" type="datetime-local" onChange={e => setScheduleTime({ ...scheduleTime, startTime: e.target.value })}
                            value={scheduleTime.startTime} id="motorStartTime" name="motorStartTime" />

                        <div className="mb-1" onChange={e => { setsupplyBy(e.target.value) }} value={supplyBy}>
                            <input className="" type="radio" name="supplyBy"
                                id="supplyBy1" value="time" defaultChecked />
                            <label className="ps-1" htmlFor="supplyBy1">Time</label>
                            <input className="ms-3" type="radio" name="supplyBy"
                                id="supplyBy2" value="quantity" />
                            <label className="ps-1" htmlFor="supplyBy2">Quantity</label>
                        </div>

                        <div className='mb-2'>Stop motor after {supplyBy === 'time' ? "in (minutes) :" : "(quantity)"}</div>
                        <input className="me-4 form-control mb-2" type="number" id="motorStopTime" placeholder={supplyBy === 'time' ? "Time in minutes" : "Quantity in mL"}
                            onChange={e => setScheduleTime({ ...scheduleTime, stopAfter: e.target.value })} value={scheduleTime.stopAfter} name="motorStopTime" min='1' max='100' />

                        <p className='ms-4 mt-2 mb-3 text-danger' >{timerMsg}</p>
                        {/* <p className='ms-4 mt-2 mb-3 text-danger' >{new Date(Date.now()+supplyInfo.startAfter*1000).toString()}</p> */}

                        <div className="container d-flex justify-content-around flex-sm-row flex-column">
                            <input className="btn btn-success w-70 mb-2" type="submit" value="Set Timer" onClick={startTimer} />
                            <input className="btn btn-danger w-70 mb-2" type="submit" value="Stop Timer" onClick={stopTimer} />
                        </div>
                        <div id="countdown"></div>
                    </div>

                    {timerMsg !== "" &&
                        <div className="main-card mb-3 card mt-2">
                            <div className="card-header">Current supply List
                                <div className="btn-actions-pane-right">
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="align-middle mb-0 table table-borderless table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th className="text-start">Name</th>
                                            <th className="text-center">Flat</th>
                                            <th className="text-center">Status</th>
                                            <th className="text-center">Flow speed</th>
                                            <th className="text-center">Water pass</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {supplyList.filter((item) => item.supplyStatus === 0).map((item) => {
                                            return CurrRoom(item.room, item.name, item.wing, item.waterPassed, item.supplyStatus)
                                        })}

                                        {supplyList.filter((item) => item.supplyStatus === 1).map((item) => {
                                            return CurrRoom(item.room, item.name, item.wing, item.waterPassed, item.supplyStatus)
                                        })}

                                        {supplyList.filter((item) => item.supplyStatus === 2).map((item) => {
                                            return CurrRoom(item.room, item.name, item.wing, item.waterPassed, item.supplyStatus)
                                        })}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }

                </div>
            </div>
        </>
    )
}

export default ScheduleWater