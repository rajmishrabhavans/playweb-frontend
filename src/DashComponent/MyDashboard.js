import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
// import '../App.css'
// import Footer from "./components/Footer";
import Register from "../User Details/Register";
import Home from "../User Details/Home";
import Edit from "../User Details/Edit";
import Details from "../User Details/Details";

import Sidebar from "./Sidebar";
import Topbar from './Topbar';
import GetData from './GetData';
import ScheduleWater from './ScheduleWater'
import Profile from './Profile';
import Contactus from './Contactus'
import Configure from './Configure';
import SupplyList from './SupplyList';
import Dashboard from "./Dashboard";
import EditAdmin from './EditAdmin'

import { Routes, Route, useNavigate } from "react-router-dom";
import { adminInfo } from '../utility/appdata';
import { loadAdminData } from '../utility/admin';
import { TankAlerts } from './TankAlerts';
import { fetchEspConfigData } from '../utility/espFucntion';
import Scheduler from './Scheduler';
import { loggedInContext } from '../App';

let initValue = {
  index: 0,
  upperTank: 0,
  lowerTank: 0,
  UTVolume: 0,
  LTVolume: 0,
  buildLed: false,
  motorOn: false,
  tankFull: false
}
export const LiveDataContext = createContext("");
export const EspContext = createContext("");
export const AdminContext = createContext("");
export const UsersContext = createContext("");
export const AlertContext = createContext("");
export const SidebarContext = createContext("");
export const TotalVolumeContext = createContext("");
function MyDashboard() {
  const navigate = useNavigate();
  const [liveData, setLiveData] = useState(false);
  const [espData, setEspData] = useState(initValue);
  const [alerts, setAlerts] = useState({ alertsMsg: [], markRead: 0 })
  const [adminData, setAdminData] = useState(adminInfo);
  const [sidebarOn, setSidebarStatus] = useState(false)
  const [usersdata, setUserdata] = useState([])
  const [totalVolume,setTotalVolume]= useState({UTTotalVolume:1200,LTTotalVolume:1200})
  const {loggedIn}= useContext(loggedInContext)

  let loadcomp = useRef()
  useEffect(() => {
    loadcomp.current = document.querySelectorAll('.glowme');
    // if user is logged in then only allow else send user to login page
    if (!localStorage.getItem('loggedin')) {
      navigate('/login');
    }
    //getting asmin info after the page is loaded
    if (!adminInfo.creationdate) {
      loadcomp.current.forEach((elem) => { elem.classList.add('placeholder'); })
      // console.log("before fetch");
      fetchEspConfigData()
      
      loadAdminData()
        .then((data) => {
          if (data)
            setAdminData({
              ...data,
              profilePic: data.profilePic ? data.profilePic : adminData.profilePic,
              societyName: data.societyName ? data.societyName : adminData.societyName,
              societyLocation: data.societyLocation ? data.societyLocation : adminData.societyLocation,
            });
        })
        .finally(() => {
          loadcomp.current.forEach((elem) => { elem.classList.remove('placeholder') });
        })
    } else {
      setAdminData(adminInfo);
    }
    // console.log('about: ',about,'otherinfo ',otherinfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn])
  

  return (
    <AdminContext.Provider value={{ adminData, setAdminData }}>
      <LiveDataContext.Provider value={{ liveData, setLiveData }}>
        <EspContext.Provider value={{ espData, setEspData }}>
          <AlertContext.Provider value={{ alerts, setAlerts }}>
            <SidebarContext.Provider value={{ sidebarOn, setSidebarStatus }}>
              <UsersContext.Provider value={{ usersdata, setUserdata }}>
              <TotalVolumeContext.Provider value={{ totalVolume,setTotalVolume }}>
              <Scheduler>
                <div className="mysidebar">
                  <div className=" bg-gradient-primary">
                    <Sidebar />
                  </div>
                  <main className="content ">
                    <Topbar />
                    <div className='container-fluid' style={{ marginTop: '90px' }}>
                      <Routes>
                        <Route exact path="/" element={<Dashboard />} />
                        <Route path="/users" element={<Home />} />
                        <Route path="/user/register" element={<Register />} />
                        <Route path="/users/edit/:id" element={<Edit />} />
                        <Route path="/users/view/:id" element={<Details />} />
                        {/* </Route> */}
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/getdata" element={<GetData />} />
                        <Route path="/contactus" element={<Contactus />} />
                        <Route path="/schedule" element={<ScheduleWater />} />
                        <Route path="/supplyList" element={<SupplyList />} />
                        <Route path="/configure" element={<Configure />} />
                        <Route path="/editAdmin" element={<EditAdmin />} />
                        <Route path="/tankAlerts" element={<TankAlerts />} />
                      </Routes>
                    </div>
                  </main>
                </div>
                </Scheduler>
                </TotalVolumeContext.Provider>
              </UsersContext.Provider>
            </SidebarContext.Provider>
          </AlertContext.Provider>
        </EspContext.Provider>
      </LiveDataContext.Provider>
    </AdminContext.Provider>
  );
}

export default MyDashboard;
