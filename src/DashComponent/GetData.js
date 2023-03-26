import '../App.css'
import React, { useContext, useEffect, useRef } from 'react'
import { fetchInfo } from '../utility/appdata';
import { loadProgBar, toggleCheckbox, loadSensorData } from '../utility/espFucntion';
import { useNavigate } from 'react-router-dom';
import { CardFill } from '../accessory/progressbar/FillProgress';
import { OneProgressCard } from '../accessory/MiniCard';
import { EspContext, LiveDataContext, TotalVolumeContext } from './MyDashboard';

const GetData = () => {
    const {espData,setEspData} = useContext(EspContext);
    const {liveData,setLiveData} = useContext(LiveDataContext);
    const {totalVolume}= useContext(TotalVolumeContext)
    // console.log(espData);
    const navigate = useNavigate();
    // const [espData, setEspData] = useState(initValue);

    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
            ref.current = value; //assign the value of ref to the argument
        }, [value]); //this code will run when the value of 'value' changes
        return ref; //in the end, return the current ref value.
    }

    const prevData = usePrevious(espData.index);

    // fetch sensor data from backend and update it
    // if multiple request are failed then stop api request
    useEffect(() => {
        let loadDataInterval;
        let repeatData = 0;
        if (localStorage.getItem('loggedin')) {
            console.log("started interval ");
            loadSensorData(setEspData);
            loadProgBar();
            loadDataInterval = setInterval(() => {
                loadSensorData(setEspData).then((sent) => {
                    // console.log(fetchInfo.fetchTry,fetchInfo.interval,sent);
                    if (sent.index === prevData.current) {
                        repeatData++;
                        if (repeatData >= fetchInfo.maxRetry) {
                            setLiveData(false)
                            clearInterval(loadDataInterval);
                        }
                    } else {
                        repeatData = 0;
                        setLiveData(true)
                    }
                    console.log(sent.index, prevData.current, repeatData,liveData);
                })
            }, fetchInfo.interval);

        } else {
            navigate('/login')
        }

        return () => {
            console.log("stopped interval ");
            clearInterval(loadDataInterval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>

            <h2 className="text-center text-dark mb-3">Water Monitoring & control</h2>
            <div id="row text-center">
                <div className='m-4 mx-auto d-flex flex-column pe-2 w-80 col-lg-12 col-xl-10'>

                    <p className='text-center text-warning'>{!liveData ? "This may be some old data" : ""}</p>

                    <div className='row'>
                        <div className="col-lg-6 mb-4">
                            <div className="card border-left-primary shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            {/* <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Last Filled</div> */}
                                            <div className="h4 mb-0 font-weight-bold text-gray-800">Buildin LED: </div>
                                        </div>
                                        <div className="col-auto me-3">
                                            <div className="container form-check form-switch form-check-reverse content-align-center mr-4">
                                                <input className="ms-2 form-check-input" name="buildLed" onClick={(e) => { toggleCheckbox(e, espData, setEspData) }}
                                                    checked={espData.buildLed} type="checkbox" role="switch" id="buildLed" style={{ transform: "scale(2.4)" }} readOnly />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div className="col-lg-6 mb-4">
                            <div className="card border-left-primary shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            {/* <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Last Filled</div> */}
                                            <div className="h4 mb-0 font-weight-bold text-gray-800">Motor: </div>
                                        </div>
                                        <div className="col-auto me-3">
                                            <div className="container form-check form-switch form-check-reverse content-align-center mr-4">
                                                <input className="ms-2 form-check-input" name="motorOn" onClick={(e) => { toggleCheckbox(e, espData, setEspData) }}
                                                    checked={espData.motorOn} type="checkbox" role="switch" id="motorSwitch" style={{ transform: "scale(2.4)" }} readOnly />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {espData.tankFull && <p id="alertmsg" className="markedr" >Tank is Full</p>}
                    <p id="datetime" className="markedr" ></p>

                    
    <div className="row mt-4">
          <OneProgressCard color= 'info' title= 'Upper tank volume' currVol= {espData.UTVolume} totalVol= {totalVolume.UTTotalVolume}/>
          <OneProgressCard color= 'info' title= 'Lower tank volume' currVol= {espData.LTVolume} totalVol= {totalVolume.LTTotalVolume}/>
      </div>
                    
                    <div className='mt-4 row'>
                    <div className='col-lg-6 col-12 text-center'>
                        <CardFill percent= {espData.upperTank} title='UPPER TANK'/>
                    </div>
                    <div className='col-lg-6 col-12 text-center'>
                        <CardFill percent= {espData.lowerTank} title='LOWER TANK'/>
                    </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default GetData