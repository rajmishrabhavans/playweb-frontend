// import React, { useState } from 'react'
import { setModalBtnClick, showModalAlert, showSimpleAlert, loadAlerts } from '../components/AlertMsg';
import { useNavigate, Link } from 'react-router-dom'
import appdata from '../utility/appdata';
import moment from 'moment';
import { getTankAlert, logoutAdmin } from '../utility/admin'
import { useContext, useEffect } from 'react';
import { AdminContext, AlertContext, LiveDataContext, SidebarContext } from './MyDashboard';
import { loggedInContext } from '../App';

const Topbar = (status) => {
    const{setLoggedIn}= useContext(loggedInContext)
    const {liveData} = useContext(LiveDataContext);
    const { adminData } = useContext(AdminContext)
    const navigate = useNavigate({});
    const {alerts,setAlerts}= useContext(AlertContext)

    const {setSidebarStatus}= useContext(SidebarContext)
    const changeStyle = () => {
        const varr = document.getElementById('accordionSidebar')
        varr.classList.toggle("toggled");
        console.log(varr.classList.contains('toggled'));
        if(varr.classList.contains('toggled')){
            setSidebarStatus(false)
        }else{
            setSidebarStatus(true)
        }
    };
    const signoutUser = () => {
        // console.log('Signing out user');
        if(!navigator.onLine){
            showModalAlert("Check your internet Connection","ok","yellow");
            return;
        }
        setModalBtnClick(() => {
            logoutAdmin(appdata).then(() => {
                setLoggedIn(false)
                navigate('/');
                console.log(appdata);
                // window.location.reload();
            }).finally(() => {
                // console.log('Showing alert');
                showSimpleAlert("You have been logged out!", 'red');
            });
        });
        showModalAlert("Are you sure you want to exit?", 'Confirm')
    }
    
    useEffect(() => {
        console.log(alerts);
        // alertsCount = alerts ? alerts.alertsMsg.length-alerts.markRead : -1;
        // console.log(alerts.alertsMsg.length,alerts.markRead,alertsCount);
        loadAlerts();
        getTankAlert()
        .then((data)=>{console.log('alert data:',data);
            if(data && data.alerts){
            setAlerts({alertsMsg:data.alerts.reverse(),markRead:data.read});
            console.log(data.alerts);
            }
        }).catch(e=>console.log(e))
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div id='content-wrapper' className='d-flex flex-column'>

                {/*  <!-- Topbar --> */}
                <nav className="navbar navbar-expand fixed-top navbar-light bg-white topbar mb-4 static-top shadow" style={{zIndex:"5"}}>

                    {/*  <!-- Sidebar Toggle (Topbar) --> */}
                    <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-1" onClick={changeStyle}>
                        <i className="fa fa-bars"></i>
                    </button>

                    {/*  <!-- Topbar Navbar --> */}
                    <ul className="navbar-nav ml-auto">

                        {/*  <!-- Nav Item - Alerts --> */}
                        <li className="nav-item dropdown no-arrow mx-1">
                            <a className="nav-link dropdown-toggle px-0" href=" " id="alertsDropdown" role="button"
                                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-bell fa-fw"></i>
                                {/*  <!-- Counter - Alerts --> */}
                                <span className={`badge badge-danger badge-counter ${(alerts ? alerts.alertsMsg.length-alerts.markRead : -1)<=0?'d-none':''}`}>{alerts ? alerts.alertsMsg.length-alerts.markRead : -1}</span>
                            </a>
                            {/*   <!-- Dropdown - Alerts --> */}
                            <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                aria-labelledby="alertsDropdown">
                                <h6 className="dropdown-header">
                                    Alerts Center
                                </h6>

                            {alerts && alerts.alertsMsg && alerts.alertsMsg.slice(0,3).map((alert,index)=>{
                                return(
                                <a key={index} className={`dropdown-item d-flex align-items-center ${(alerts ? alerts.alertsMsg.length-alerts.markRead : -1)>index?'fw-bold':''}`} href=" ">
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


                                <Link className="dropdown-item text-center small text-gray-500" to="/tankAlerts">Show All Alerts</Link>
                            </div>
                        </li>

                        <div className="topbar-divider mx-2 mx-sm-3 d-sm-block"></div>

                        <div className='live-logo'> 
                        {liveData?
                        <>
                        <i className="fas fa-wifi mt-4"></i>
                        <div className="live-text text-success">Esp is live</div>
                        </>
                        :
                        <>
                        <i className="fas fa-ban mt-4"></i>
                        <div className="live-text text-warning">Esp is Disconnected</div>
                        </>
                        }
                        </div>
                        
                        <div className="topbar-divider mx-2 mx-sm-3 d-sm-block"></div>

                        {/* <!-- Nav Item - User Information --> */}
                        <li className="nav-item dropdown no-arrow placeholder-glow">
                            <a className="nav-link dropdown-toggle ps-0" href=" " id="userDropdown" role="button"
                                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="mr-2 d-lg-inline text-gray-600 small glowme">{adminData.name}</span>
                                <img className="img-profile rounded-circle glowme" alt='proficPic'
                                    src={adminData.profilePic} />
                            </a>
                            {/*  <!-- Dropdown - User Information --> */}
                            <div className="dropdown-menu dropdown-menu-end shadow animated--grow-in" style={{maxWidth:"120px"}}
                                aria-labelledby="userDropdown">
                                <Link className="dropdown-item" to="profile">
                                    <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Profile
                                </Link>
                                <Link className="dropdown-item" to="configure">
                                    <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Settings
                                </Link>
                                <div className="dropdown-divider"></div>
                                <span className="dropdown-item" onClick={signoutUser}>
                                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Logout
                                </span>
                            </div>
                        </li>

                    </ul>
                </nav>

            </div>
        </>
    )
}

export default Topbar
