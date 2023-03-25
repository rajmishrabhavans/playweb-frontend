import React, { useContext } from 'react'
import { AlertContext } from './MyDashboard'
import moment from 'moment';
import { getTankAlert } from '../utility/admin';

export const TankAlerts = () => {
    const {alerts,setAlerts}= useContext(AlertContext)

    const markRead=()=>{
        getTankAlert({markRead:true})
        .then((data)=>{
            if(data && data.alerts){
            setAlerts({...alerts,markRead:alerts.alertsMsg.length});
            console.log(data.alerts);
            }
        })
        
    }
  return (
    <div>
    <div className='d-flex justify-content-between'>
    <h3 className="dropdown-header  m-2 fw-bold text-primary">
        Alerts Center
    </h3>
    <button className='btn btn-primary mr-2' type='button' onClick={markRead}>Mark all Read</button>
    </div>

        {alerts && alerts.alertsMsg.map((alert,index)=>{
            return(
            <a key={index} className={`dropdown-item d-flex align-items-center ms-2 ${(alerts ? alerts.alertsMsg.length-alerts.markRead : -1)>index?'fw-bold':''}`} href=" ">
                <div className="mr-3">
                    <div className="icon-circle bg-primary">
                        <i className="fas fa-file-alt text-white"></i>
                    </div>
                </div>
                <div>
                    <div className="small text-gray-500"> {moment(alert.timeStamp).format('lll')}</div>
                    <span className="">{alert.message}</span>
                </div>
            </a>)
        })}
    </div>
  )
}
