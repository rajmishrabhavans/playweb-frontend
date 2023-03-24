import React from 'react'
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
import AlertMsg from './components/AlertMsg';
import VerificationPage from './components/VerificationPage';
import ForgotPass from './components/ForgotPass';
import MyDashboard from './DashComponent/MyDashboard';
import Spinner from './components/Spinner';
import Cookies from 'js-cookie';

function App() {

  return (
    
    <>
    <AlertMsg/>
    <Spinner/>
    {localStorage.getItem('loggedin') && Cookies.get('jwtoken') ? 
    
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
    </Routes>
    </>
    }
  </>
    
  )
}


export default App