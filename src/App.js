import React, { createContext, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import ContactPage from './components/ContactPage';
import {Routes, Route} from "react-router-dom";
import ErrorPage from './components/ErrorPage';
import BackPage from './components/BackPage';
import AlertMsg, { showModalAlert } from './components/AlertMsg';
import VerificationPage from './components/VerificationPage';
import ForgotPass from './components/ForgotPass';
import MyDashboard from './DashComponent/MyDashboard';
import Spinner from './components/Spinner';
import Cookies from 'js-cookie';
import { useState } from 'react';
import Access from './components/AccessPage';
import InternalServerError from './components/InternalServerError';
import { fetchApi } from './utility/apiHelper';

export const loggedInContext = createContext("");
function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(()=>{
    if(localStorage.getItem('loggedin') && Cookies.get('jwtoken')){
      setLoggedIn(true);
      fetchApi("/testConnection")
      .then((data)=>{
        if(!data){
          if(!navigator.onLine){
             showModalAlert("Check your Internet connection");
          }else{
            showModalAlert("Problem occoured connecting to server")
          }
        }
      })
    }
  },[])
  
  return (
    
    <>
    
    <loggedInContext.Provider value= {{loggedIn, setLoggedIn}}>
    <AlertMsg/>
    <Spinner/>
    {loggedIn ? 
    
    <MyDashboard /> 
    
    :

    <>
    <Navbar/>
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/about" element={<BackPage Element= {About}/>} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<BackPage Element= {Login}/>} />
      <Route path="/register" element={<BackPage Element= {Register}/>} />
      <Route path="/forgotPassword" element={<BackPage Element= {ForgotPass}/>} />
      <Route path="/verify" element={<BackPage Element= {VerificationPage}/>} />
      <Route path="/*" element={<ErrorPage/>} />
      <Route path="/accessdenied" element={<Access />} />
      <Route path='/servererror' element={<InternalServerError />} />
    </Routes>
    </>
    }
    </loggedInContext.Provider>
  </>
    
  )
}


export default App