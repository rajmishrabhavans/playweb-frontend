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

  const UseNav=({children})=>{
    return(
      <>
        <Navbar/>
        {children}
      </>
    )
  }
  
  return (
    
    <>
    
    <loggedInContext.Provider value= {{loggedIn, setLoggedIn}}>
    <AlertMsg/>
    <Spinner/>
    {loggedIn ? 
    
    <MyDashboard /> 
    
    :

    <>
    {/* <Navbar/> */}
    <Routes>
      <Route exact path="/" element={<UseNav><Home /></UseNav>} />
      <Route path="/about" element={<UseNav><About/></UseNav>} />
      <Route path="/contact" element={<UseNav><ContactPage /></UseNav>} />
      <Route path="/login" element={<UseNav><BackPage Element= {Login}/></UseNav>} />
      <Route path="/register" element={<UseNav><BackPage Element= {Register}/></UseNav>} />
      <Route path="/forgotPassword" element={<UseNav><BackPage Element= {ForgotPass} /> </UseNav> } />
      <Route path="/verify" element={<UseNav><BackPage Element= {VerificationPage} /> </UseNav> } />
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