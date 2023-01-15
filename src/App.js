import React, { createContext } from 'react'
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

export const userContext = createContext();
function App() {
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
        <Route path="/verify" element={<BackPage Element= {VerificationPage}/>} />
        <Route path="/*" element={<ErrorPage/>} />
      </Routes>
    </>
  )
}

export default App