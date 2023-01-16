import '../App.css'
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
//import {loadAlerts,showModalAlert} from './AlertMsg';
import appdata from '../utility/appdata';
import { loadProgBar,toggleCheckbox} from '../utility/displayFunc';

let initValue = {
    index: 0,
    upperTank: 0,
    lowerTank: 0,
    flowSpeed: 0,
    tankFull: false
}
const GetData = () => {
    const [sensorData, setSensorData] = useState(initValue);
    const getSensorData = async () => {
        // console.log("get Data");
        try {
            const res = await fetch(appdata.baseUrl + "/getSensorData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cookie: Cookies.get('jwtoken')
                })
            });

            if (res.status > 201) {
                throw new Error(res.error);
            }
            const data = await res.json();
            console.log(data.data);
            setSensorData(data.data);
            loadProgBar();
            return true;

        } catch (error) {
            console.log(error);
            return false;
        }
    }
    // console.log(userData);

    useEffect(() => {
        if (sessionStorage.getItem('loggedin')) {
            getSensorData();
            loadProgBar();
            /*
            const loadSensorData = setInterval(() => {
                getSensorData().then((sent)=>{
                    console.log(fetchInfo.fetchTry,fetchInfo.interval,sent);
                    if(sent){
                        if(fetchInfo.fetchTry>=10){
                            fetchInfo.interval = 5000;
                            fetchInfo.fetchTry = 0;
                        }else if(fetchInfo.fetchTry>0){
                            fetchInfo.fetchTry = fetchInfo.fetchTry-1;
                        }
                    }else{
                        if(fetchInfo.fetchTry>=10){
                            clearInterval(loadSensorData);
                        }else{
                            fetchInfo.fetchTry = fetchInfo.fetchTry+1;
                        }
                    }
                });
            }, fetchInfo.interval);
            */
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>

            <div id="row text-center">
                <div className='m-4 mx-auto d-flex flex-column pe-2 w-80 col-sm-11 col-md-10 col-xl-8'>

                    <h2 className='text-center'>Water Monitoring & control</h2>

                    <div className="container form-check form-switch form-check-reverse content-align-center">
                        <div className="my-4 d-flex justify-content-around">
                            <div>Build-in LED : </div>
                            <input className="form-check-input" name="buildLed" onChange={(e)=>{toggleCheckbox(e)}} type="checkbox" role="switch" id="flexSwitch1" style={{ transform: "scale(2.4)" }} />
                        </div>
                        <div className="my-4 d-flex justify-content-around">
                            <div>Motor Switch : </div>
                            <input className="form-check-input" name="motorOn" onChange={(e)=>{toggleCheckbox(e)}} type="checkbox" role="switch" id="flexSwitch2" style={{ transform: "scale(2.4)" }} />
                        </div>
                    </div>

                    {sensorData.tankFull && <p id="alertmsg" className="markedr" >Tank is Full</p>}
                    <p id="datetime" className="markedr" ></p>

                    <div className='container d-flex flex-column  content-align-center'>
                        <div className='mb-2'>Set Motor start time :</div> <input className="mx-3 form-control mb-2" type="datetime-local" id="motorStartTime" name="motorStartTime" />
                        <div className='mb-2'>Stop motor after in (minutes) :</div> <input className="mx-3 form-control mb-2" type="number" id="motorStopTime" placeholder='Time in Minutes' name="motorStopTime" min='1' max='100' />
                        <div className="container d-flex justify-content-around flex-sm-row flex-column">
                            <input className="btn btn-success w-70 mb-2" type="submit" value="Set Timer" onClick={() => { }} />
                            <input className="btn btn-danger w-70 mb-2" type="submit" value="Stop Timer" onClick={() => { }} />
                        </div>
                        <div id="countdown"></div>
                    </div>
                    {/* %FLOWSENSORHOLDER% */}
                    <p> Flow speed: <span id="flowspeed">{sensorData.flowSpeed}</span></p>
                    <p> Water passed: <span id="flowamt"></span></p> <input type="submit" className='btn btn-info mx-auto w-140' value="Reset Flow Amount" onClick={() => { }} />

                    {/* <!--  Start filling till water Amount: <input type="text" placeholder= "Water Amount(in ml)" id="flowvalue">
            <input type="submit" value="Start filling" onclick= flowAmount()> 
            --> */}
                    <div className="container row d-flex justify-content-center">
                    <p>{sensorData.index}</p>
                        <div className="box col-md-5">
                            <div className="circle" id="progress1" data-dots="70" data-percent={sensorData.upperTank} style={{ bgColor: ' #ff0070' }}></div>
                            <div className="text" ><h2 id="prog1">{sensorData.upperTank}%</h2><small>Upper Tank</small></div>
                        </div>

                        <div className="box col-md-5">
                            <div className="circle" id="progress2" data-dots="70" data-percent={sensorData.lowerTank} style={{ bgColor: '#0f0' }}></div>
                            <div className="text" ><h2 id="prog2">{sensorData.lowerTank}%</h2><small>Lower Tank</small></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GetData