import '../App.css'
import React, { useContext, useEffect} from 'react'
import { loadSupplyList, resetSupplyStatus, stopTimer, TimerMsgProvider, VolumeProvider } from './Scheduler';
import { TimeInputProvider,HomeDataProvider,SupplyListProvider,SupplyInfoProvider } from './Scheduler';
import { getSensorData, updateHomeData } from '../utility/espFucntion';
import { useNavigate } from 'react-router-dom';
import { showSimpleAlert } from '../components/AlertMsg';
// import { AlertContext } from './MyDashboard';

const ScheduleWater = () => {
    const navigate = useNavigate();
    // const {setAlerts}= useContext(AlertContext)
    const {setWaterVolume}= useContext(VolumeProvider)
    const {scheduleTime,setScheduleTime,supplyBy,setSupplyBy}= useContext(TimeInputProvider)
    const {homeData,setHomeData}= useContext(HomeDataProvider)
    const {supplyList,setSupplyList}= useContext(SupplyListProvider)
    const {supplyInfo,setSupplyInfo}= useContext(SupplyInfoProvider)
    const {timerMsg,setTimerMsg}= useContext(TimerMsgProvider)


    
    // start timer when time is scheduled and confirmed
    const startTimer = () => {
        if (supplyInfo.timerOn) stopTimer({setSupplyInfo,supplyInfo,setTimerMsg,homeData,setHomeData,supplyList,setSupplyList});
        const { startTime, stopAfter } = scheduleTime;
        // console.log(startTime,stopAfter);
        if (!startTime) {
            showSimpleAlert("Select start time", 'red')
            return;
        } else if (!stopAfter) {
            showSimpleAlert("Select stop time", 'red')
            return;
        } else if (stopAfter > 200 || stopAfter <= 0) {
            showSimpleAlert("Select proper stop time in range(0-200]", 'red')
            return;
        }
        let timeDiff = Number.parseInt((Date.parse(scheduleTime.startTime) - Date.now()) / 1000);
        if (timeDiff < 0) {
            showSimpleAlert("Enter proper start time", 'red');
            return;
        }
        // console.log("RoomList: ",supplyList);
        resetSupplyStatus({supplyList,setSupplyList});
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
                    <div className={`badge bg-${color}`}>{status}</div>
                </td>
                <td className="text-center ">{supplyStatus === 1?homeData.flowSpeed:0} ml/s</td>
                <td className="text-center ">{supplyStatus === 1?homeData.waterPassed:waterPassed} ml</td>
            </tr>
        );
    }

    // check if user is authenticated to get data
    useEffect(() => {
        document.getElementById("motorStartTime").min= new Date().toISOString().slice(0, 16)
        if (localStorage.getItem('loggedin')) {
            loadSupplyList({setSupplyList}).then((slist) => {
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


    return (
        <>
            <h2 className="text-center text-dark mb-3">Schedule Supply</h2>
            <div id="row text-center">
                <div className='m-4 mx-auto d-flex flex-column pe-2 w-80 col-lg-10 col-xl-8'>

                    <div className='card p-4'>
                        <div className='mb-2'>Set Motor start time :</div>
                        <input className="me-4 form-control mb-2" type="datetime-local" onChange={e => setScheduleTime({ ...scheduleTime, startTime: e.target.value })}
                            value={scheduleTime.startTime} id="motorStartTime" name="motorStartTime" />

                        <div className="mb-1" onChange={e => { setSupplyBy(e.target.value)}} value={supplyBy}>
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
                            <input className="btn btn-success w-70 mb-2" type="submit" value="Set Timer" onClick={()=>startTimer()} />
                            <input className="btn btn-danger w-70 mb-2" type="submit" value="Stop Timer" onClick={()=>stopTimer({setSupplyInfo,supplyInfo,setTimerMsg,homeData,setHomeData,supplyList,setSupplyList})} />
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