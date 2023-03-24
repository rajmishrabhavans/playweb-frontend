import React, { useContext, useEffect, useRef, useState } from 'react'
// import { CurrTable } from '../accessory/CurrTable';
// import { MiniCard, OneProgressCard } from '../accessory/MiniCard';
import { CardFill} from '../accessory/progressbar/FillProgress';
import { EspContext } from './MyDashboard';
import { fetchInfo } from '../utility/appdata';
import { getSupplyList2, loadProgBar, loadSensorData } from '../utility/espFucntion';
import { useNavigate } from 'react-router-dom';
import { OneTitleCard, OneProgressCard } from '../accessory/MiniCard';
import moment from 'moment/moment';
// let percentage = 44;

const Dashboard = () => {
  const {espData,setEspData} = useContext(EspContext);
  const navigate = useNavigate();
  const [repeatedData, setRepeatedData] = useState(false);

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value; //assign the value of ref to the argument
    }, [value]); //this code will run when the value of 'value' changes
    return ref; //in the end, return the current ref value.
}
const prevData = usePrevious(espData.index);
const lastSupply= useRef("not filled")

  useEffect(() => {
    
    let loadDataInterval;
    let repeatData = 0;
    getSupplyList2().then((data)=>{
      console.log(data)
      const isoDate= data.lastSupply
      let sdate= new Date(isoDate);
      console.log(sdate);
      let ndate= moment(sdate).fromNow()
      console.log(ndate)
      lastSupply.current= ndate
    })
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
                        setRepeatedData(true);
                        clearInterval(loadDataInterval);
                    }
                } else {
                    repeatData = 0;
                    setRepeatedData(false)
                }
                console.log(sent.index, prevData.current, repeatData,repeatedData);
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
    <div id='content-wrapper' className='d-flex flex-column'>
    <div className="container-fluid">
      {/*  <!-- Page Heading --> */}
      <div className="d-sm-flex align-items-center justify-content-between">
        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
          <p className='text-center text-warning'>{repeatedData ? "This may be some old data" : ""}</p>
        <a href="/" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
            <i className="fas fa-download fa-sm text-white-50"></i> Generate Report</a>
        </div>

    <div className="row mt-4">
        <OneTitleCard color= 'primary' title= 'Last Supplied' content= {lastSupply.current+''} icon= 'calendar'/>
        <OneTitleCard color= 'success' title= 'Next Scheduled' content= 'not scheduled' icon= 'hourglass-half'/>
        <OneTitleCard color= 'warning' title= 'Upper tank filled' content= 'not filled' icon= 'fill'/>
    </div>
       {/* <div className="border-bottom-primary shadow mb-4" style={{opacity:'0.6'}}></div> */}

        <div className='mt-4 row'>
          <div className='col-lg-6 col-12 text-center'>
            <CardFill percent= {espData.upperTank} title='UPPER TANK'/>
          </div>
          <div className='col-lg-6 col-12 text-center'>
            <CardFill percent= {espData.lowerTank} title='LOWER TANK'/>
          </div>
        </div>

                      
    <div className="row mt-4">
          <OneProgressCard color= 'info' title= 'Upper tank volume' currVol= {espData.UTVolume} totalVol= {1200}/>
          <OneProgressCard color= 'info' title= 'Lower tank volume' currVol= {espData.LTVolume} totalVol= {1200}/>
      </div>

        {/* <CurrTable/> */}
      </div>
      </div>
    </>
  )
}

export default Dashboard
