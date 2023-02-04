import '../App.css'
import React, { useEffect, useReducer, useState } from 'react'
//import {loadAlerts,showModalAlert} from './AlertMsg';
import { getSupplyList, updateSensorData} from '../utility/espFucntion';
import { useNavigate } from 'react-router-dom';
import { showSimpleAlert } from './AlertMsg';

const initSchedule= {
    startTime: '',
    stopAfter: '',
}
let timerMsg = "";
const ScheduleWater = () => {
    const navigate = useNavigate();
    const [scheduleTime,setScheduleTime] = useState(initSchedule);
    const [supplyList, setSupplyList] = useState([
      { room: 1, name: 'Room1', supplyOn: false },
      { room: 2, name: 'Room2', supplyOn: false },
    ]);

    // reducer for maintaining timer
    const reducer = (motorStart, action) => {
        let startAfter= motorStart.startAfter;
        let remainTime= motorStart.remainTime;
        let timerOn = motorStart.timerOn;
        let remainRoom = motorStart.remainRoom;
        switch(action.type) {
            case "decStartAfter":
                startAfter = startAfter - 1;
                break;
            case "resetStartAfter":
                startAfter = 0;
                break;
            case "setStartAfter":
                startAfter = action.value;
                break;
            case "decRemainTime":
                remainTime = remainTime - 1;
                break;
            case "resetRemainTime":
                remainTime = 0;
                break;
            case "setRemainTime":
                remainTime = action.value;
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
            default:
                return motorStart;
        }
        return {startAfter,remainTime,remainRoom,timerOn};
    }
    const [motorStart,dispatch] = useReducer(reducer,{startAfter:0,remainTime:0,remainRoom:0,timerOn:false});

    // load supply list from database
    const loadSupplyList= async()=>{
        const slist= await getSupplyList();
        let roomList= [];
        for(let i=0;i<slist.length;i++){
            if(slist[i].supplyOn){
                roomList.push(slist[i]);
            }
        }
        setSupplyList(roomList)
        // console.log(slist);
        return roomList;
    }

    // start timer when time is scheduled and confirmed
    const startTimer= ()=>{
        if(motorStart.timerOn) stopTimer();
        const {startTime,stopAfter}= scheduleTime;
        // console.log(startTime,stopAfter);
        if(!startTime){
            showSimpleAlert("Select start time",'red')
            return;
        }else if(!stopAfter){
            showSimpleAlert("Select stop time",'red')
            return;
        }else if(stopAfter>100 || stopAfter<0){
            showSimpleAlert("Select proper stop time in range[0-100]",'red')
            return;
        }
        let timeDiff = Number.parseInt((Date.parse(scheduleTime.startTime)-Date.now())/1000);
        if(timeDiff<0){
            showSimpleAlert("Enter proper start time",'red');
            return;
        }
        // console.log("RoomList: ",supplyList);
        dispatch({type:"setRemainRoom",value:supplyList.length});
        dispatch({type:"setStartAfter",value:timeDiff});
        dispatch({type:"setRemainTime",value:Number.parseInt(stopAfter*60)});
        dispatch({type:"setTimerOn",value:true});
    }

    // use effect based timer
    useEffect(() => {
        let intervalId;
        console.log(motorStart.remainTime, motorStart.remainRoom);
        if(motorStart.startAfter>=0 && motorStart.timerOn){
            if(motorStart.remainTime>0){
                timerMsg= `Motor will start in ${motorStart.startAfter}s`
            }
            intervalId = setInterval(() => {
                dispatch({type:"decStartAfter"});
                console.log(motorStart.startAfter);
                if(motorStart.startAfter===0){
                    dispatch({type:"decStartAfter"});
                    if(motorStart.remainTime>0){
                        updateSensorData({motorOn:true});
                        timerMsg= `Motor Started`
                        showSimpleAlert("Motor Started");
                    }
                }
            }, 1000);
        }else if(motorStart.remainTime>=0 && motorStart.remainRoom>=0 && motorStart.timerOn){
            if(supplyList[supplyList.length-motorStart.remainRoom])
                timerMsg= `Motor will stop in ${motorStart.remainTime}s for room ${supplyList[supplyList.length-motorStart.remainRoom].room}, remaining ${motorStart.remainRoom-1}`
            intervalId = setInterval(() => {
                if(motorStart.remainRoom>0){

                    dispatch({type:"decRemainTime"});
                    console.log(motorStart.remainTime);
                    if(motorStart.remainTime===0){
                        dispatch({type:"decRemainRoom"});
                        if(motorStart.remainRoom>0){
                            dispatch({type:"setRemainTime",value:Number.parseInt(scheduleTime.stopAfter*60)});
                        }
                        else{
                            dispatch({type:"decRemainTime"});
                            stopTimer();
                        }
                    }
                }else{
                    dispatch({type:"decRemainRoom"});
                    stopTimer();
                }
            }, 1000);
        }
        return () => {
            clearInterval(intervalId);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [motorStart]);

    // stop timer by reseting time values
    const stopTimer=()=>{
        dispatch({type:"resetStartAfter"});
        dispatch({type:"resetRemainTime"});
        dispatch({type:"setTimerOn",value:false});
        if(motorStart.remainTime>0 && motorStart.startAfter<1){
            timerMsg= `Motor Stopped`;
            showSimpleAlert("Motor Stopped");
        }else{
            timerMsg= `Timer Stopped`;
            showSimpleAlert("Timer Stopped");
        }
        updateSensorData({motorOn:false});
    }

    // check if user is authenticated to get data
    useEffect(() => {
        if (sessionStorage.getItem('loggedin')) {
            loadSupplyList().then((slist)=>{
                console.log(slist);
            });
        } else {
            navigate('/login')
        }
        return ()=>{
            updateSensorData({motorOn:false});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>

            <div id="row text-center">
                <div className='m-4 mx-auto d-flex flex-column pe-2 w-80 col-sm-11 col-md-10 col-xl-8'>

                    <h2 className='text-center'>Schedule Supply</h2>

                    <div className='container d-flex flex-column  content-align-center'>
                        <div className='mb-2'>Set Motor start time :</div> 
                        <input className="mx-3 form-control mb-2" type="datetime-local" onChange={e=>setScheduleTime({...scheduleTime,startTime:e.target.value})} 
                        value={scheduleTime.startTime} id="motorStartTime" name="motorStartTime" />

                        <div className='mb-2'>Stop motor after in (minutes) :</div> 
                        <input className="mx-3 form-control mb-2" type="number" id="motorStopTime" placeholder='Time in Minutes' 
                        onChange={e=>setScheduleTime({...scheduleTime,stopAfter:e.target.value})} value={scheduleTime.stopAfter}name="motorStopTime" min='1' max='100' />

                        <p className='ms-4 mt-2 mb-3 text-danger' >{timerMsg}</p>

                        <div className="container d-flex justify-content-around flex-sm-row flex-column">
                            <input className="btn btn-success w-70 mb-2" type="submit" value="Set Timer" onClick={startTimer} />
                            <input className="btn btn-danger w-70 mb-2" type="submit" value="Stop Timer" onClick={stopTimer} />
                        </div>
                        <div id="countdown"></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ScheduleWater