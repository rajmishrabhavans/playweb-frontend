import '../App.css'
import React, {useEffect, useRef, useState } from 'react'
import { fetchInfo } from '../utility/appdata';
import { loadProgBar,toggleCheckbox,loadSensorData} from '../utility/espFucntion';
import { useNavigate} from 'react-router-dom';

let initValue = {
    index: 0,
    upperTank: 0,
    lowerTank: 0,
    UTVolume: 0,
    LTVolume: 0,
    buildLed:false,
    motorOn:false,
    tankFull: false
}
const GetData = () => {
    const navigate= useNavigate();
    const [sensorData, setSensorData] = useState(initValue);
    const [repeatedData, setRepeatedData] = useState(false);
   
    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
          ref.current = value; //assign the value of ref to the argument
        },[value]); //this code will run when the value of 'value' changes
        return ref; //in the end, return the current ref value.
    }
    
    const prevData= usePrevious(sensorData.index);

    // fetch sensor data from backend and update it
    // if multiple request are failed then stop api request
    useEffect(() => {
        let loadDataInterval;
        let repeatData= 0;
        if (sessionStorage.getItem('loggedin')) {
            console.log("started interval ");
            loadSensorData(setSensorData);
            loadProgBar();
            loadDataInterval = setInterval(() =>{
                loadSensorData(setSensorData).then((sent)=>{
                    // console.log(fetchInfo.fetchTry,fetchInfo.interval,sent);
                    if(sent.index===prevData.current){
                        repeatData++;
                        if(repeatData>5){
                            setRepeatedData(true);
                        }
                    }else{
                        repeatData=0;
                        setRepeatedData(false)
                    }
                    console.log(sent.index,prevData.current,repeatData);
                    if(sent){
                        if(fetchInfo.fetchTry>=20){
                            fetchInfo.fetchTry = 0;
                        }else if(fetchInfo.fetchTry>0){
                            fetchInfo.fetchTry = fetchInfo.fetchTry-1;
                        }
                    }else{
                        if(fetchInfo.fetchTry>=20){
                            clearInterval(loadDataInterval);
                        }else{
                            fetchInfo.fetchTry = fetchInfo.fetchTry+1;
                        }
                    }
                })}, fetchInfo.interval);
            
        }else{
            navigate('/login')
        }

        return () =>{
            console.log("stopped interval ");
            clearInterval(loadDataInterval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    
    return (
        <>

            <div id="row text-center">
                <div className='m-4 mx-auto d-flex flex-column pe-2 w-80 col-sm-11 col-md-10 col-xl-8'>

                    <h2 className='text-center'>Water Monitoring & control</h2>
                    <p className='text-center text-warning'>{repeatedData?"This may be some old data":""}</p>
                    
                    <div className="container form-check form-switch form-check-reverse content-align-center">
                        <div className="my-4 d-flex justify-content-around">
                            <div>Build-in LED : </div>
                            <input className="form-check-input" name="buildLed" onClick={(e)=>{toggleCheckbox(e,sensorData,setSensorData)}} 
                            checked={sensorData.buildLed} type="checkbox" role="switch" id="buildLed" style={{ transform: "scale(2.4)" }} readOnly />
                        </div>
                        <div className="my-4 d-flex justify-content-around">
                            <div>Motor Switch : </div>
                            <input className="form-check-input" name="motorOn" onClick={(e)=>{toggleCheckbox(e,sensorData,setSensorData)}} 
                            checked={sensorData.motorOn} type="checkbox" role="switch" id="motorSwitch" style={{ transform: "scale(2.4)" }} readOnly />
                        </div>
                    </div>

                    {sensorData.tankFull && <p id="alertmsg" className="markedr" >Tank is Full</p>}
                    <p id="datetime" className="markedr" ></p>

                    {/* %FLOWSENSORHOLDER% */}
                    <p> UperTank Volume : <span id="uperTankVolume">{sensorData.UTVolume}</span></p>
                    <p> LowerTank Volume : <span id="lowerTankVolume">{sensorData.LTVolume}</span></p>

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