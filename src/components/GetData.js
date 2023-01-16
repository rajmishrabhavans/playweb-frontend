import Cookies from 'js-cookie';
import React, { useEffect, useState} from 'react'
//import {loadAlerts,showModalAlert} from './AlertMsg';
import appdata from '../utility/appdata';

let initValue= {
    index: 0,
    upperTank: 0,
    lowerTank: 0,
    flowSpeed: 0,
    tankFull: false
}
const GetData = () => {
    const [sensorData,setSensorData] = useState(initValue);
    const getSensorData = async () => {
        console.log("contact load");
        try {
            const res = await fetch(appdata.baseUrl+"/getSensorData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    cookie:Cookies.get('jwtoken')
                })
            });

            if (res.status > 201) {
                throw new Error(res.error);
            }
            const data = await res.json();
            setSensorData(data.data);
            
        } catch (error) {
            console.log(error);
        }
    }
    // console.log(userData);

    useEffect(() => {
        if(sessionStorage.getItem('loggedin')){
            // setInterval(() => {
                getSensorData();
            // }, 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <>
                <div className="placeholder-glow d-flex flex-column m-5 profileSection">
                    
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">index: </span>
                        <span className="glowme col-xs-11 col-sm-7">{sensorData.index}</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">upperTank : </span>
                        <span className="glowme col-xs-11 col-sm-7">{sensorData.upperTank}</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">lowerTank : </span>
                        <span className="glowme col-xs-11 col-sm-7">{sensorData.lowerTank}</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">flowSpeed : </span>
                        <span className="glowme col-xs-11 col-sm-7">{sensorData.flowSpeed}</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">tankFull : </span>
                        <span className="glowme col-xs-11 col-sm-7">{sensorData.tankFull}</span>
                    </div>
                </div>

            </>
  )
}

export default GetData