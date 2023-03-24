import React, { useContext } from 'react'
import { AlertContext } from './MyDashboard'
import moment from 'moment';

export const TankAlerts = () => {
    const {alerts}= useContext(AlertContext)
  return (
    <div>
    <h6 className="dropdown-header">
        Alerts Center
    </h6>

        {alerts && alerts.map((alert,index)=>{
            return(
            <a key={index} className="dropdown-item d-flex align-items-center" href=" ">
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
