import React, {  useEffect } from 'react'
import logoImg from '../images/house-water-32.png'
import { Link, NavLink,useNavigate } from 'react-router-dom'
import appdata from './appdata'
import Cookies from 'js-cookie'
import {loadAlerts,showModalAlert} from './AlertMsg';
import { loadSpinner, startSpinner, stopSpinner } from './Spinner';
import { logoutUser } from '../utility/user'

const Navbar = () => {
    const navigate= useNavigate({});
    // const [isAuthenticated,setIsAuthenticated]= useState(false);
    const loadNavbar =async()=>{
        try {
            const res= await fetch(appdata.baseUrl+"/getData",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json" 
                },
                body:JSON.stringify({
                    'cookie':Cookies.get('jwtoken'),
                })
            });
            if(res.status!==200){
                // console.log("State: ",state);
                if(!Cookies.get('jwtoken')){
                    sessionStorage.removeItem('loggedin')
                }
                throw new Error(res.Error);
            }
            if(!sessionStorage.getItem('loggedin')){
                sessionStorage.setItem('loggedin','true')
            }
                // console.log("State: ",state);
        } catch (error) {
            // console.log(error);
        }
    }
    useEffect(() => {
      loadSpinner();
      loadAlerts();
      loadNavbar();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    
    const signoutUser=async()=> {
        startSpinner();
        logoutUser(appdata).then(()=>{
            navigate('/login');
        }).finally(()=>{
            stopSpinner();
            showModalAlert("You have been logged out!");
        });
    }

    const LoginTab=()=> {
      return (
        <>
        <li className="nav-item">
            <NavLink className="nav-link" to="/login">Login</NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link" to="/register">Register</NavLink>
        </li>
        </>
      )
    }

    const LogoutTab=()=> {
      return (
        <>
        <li className="nav-item">
            <NavLink className="nav-link" to="/contact">Contact</NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link" to="/profile">Profile</NavLink>
        </li>
        <li className="nav-item">
            <Link className="nav-link cursor-pointer" onClick={signoutUser} >Logout</Link>
        </li>
        </>
      )
    }
    
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-light">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to="/">
                        <img src={logoImg} alt="Logo" width="30" height="30" className="d-inline-block align-text-top"/>
                        PlayWeb
                    </NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/about">About</NavLink>
                            </li>
                            {sessionStorage.getItem('loggedin')?<LogoutTab/>:<LoginTab/>}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar