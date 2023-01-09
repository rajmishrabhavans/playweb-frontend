import React, { createContext, useReducer } from 'react'
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
import { reducer,initialState } from './reducer/UseReducer';
import BackPage from './components/BackPage';

export const userContext = createContext();
function App() {
  const [state,dispatch]= useReducer(reducer,initialState);
  return (
    <>
    <userContext.Provider value= {{state,dispatch}}>
      <Navbar/>
      <Routes>
        <Route exact path="/" element={<BackPage Element= {Home}/>} />
        <Route path="/about" element={<BackPage Element= {About}/>} />
        <Route path="/contact" element={<BackPage Element= {Contactus}/>} />
        <Route path="/login" element={<BackPage Element= {Login}/>} />
        <Route path="/register" element={<BackPage Element= {Register}/>} />
        <Route path="/profile" element={<BackPage Element= {Profile}/>} />
        <Route path="/*" element={<ErrorPage/>} />
      </Routes>
      </userContext.Provider>
    </>
  )
}

export default App