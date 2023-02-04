import React, { createContext, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About';
import Contactus from './components/Contactus'
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import {Routes, Route} from "react-router-dom";
import ErrorPage from './components/ErrorPage';
import BackPage from './components/BackPage';
import AlertMsg from './components/AlertMsg';
import VerificationPage from './components/VerificationPage';
import GetData from './components/GetData';
import ForgotPass from './components/ForgotPass';
import ScheduleWater from './components/ScheduleWater'
import Configure from './components/Configure';
import { fetchEspConfigData } from './utility/espFucntion';
import SupplyList from './components/SupplyList';

export const userContext = createContext();
function App() {

  useEffect(() => {
    fetchEspConfigData();
    return () => {
      // second
    }
  }, [])
  return (
    <>
      <Navbar/>
      <AlertMsg/>
      <Routes>
        <Route exact path="/" element={<BackPage Element= {Home}/>} />
        <Route path="/about" element={<BackPage Element= {About}/>} />
        <Route path="/contact" element={<BackPage Element= {Contactus}/>} />
        <Route path="/login" element={<BackPage Element= {Login}/>} />
        <Route path="/register" element={<BackPage Element= {Register}/>} />
        <Route path="/profile" element={<BackPage Element= {Profile}/>} />
        <Route path="/getdata" element={<BackPage Element= {GetData}/>} />
        <Route path="/schedule" element={<BackPage Element= {ScheduleWater}/>} />
        <Route path="/supplyList" element={<BackPage Element= {SupplyList}/>} />
        <Route path="/configure" element={<BackPage Element= {Configure}/>} />
        <Route path="/forgotPassword" element={<BackPage Element= {ForgotPass}/>} />
        <Route path="/verify" element={<BackPage Element= {VerificationPage}/>} />
        <Route path="/*" element={<ErrorPage/>} />
      </Routes>
    </>
  )
}


export default App