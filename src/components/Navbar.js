import React, { useEffect, useState } from 'react'
import logoImg from '../images/house-water-32.png'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import appdata from '../utility/appdata'
import Cookies from 'js-cookie'
import { loadAlerts, setModalBtnClick, showModalAlert, showSimpleAlert } from './AlertMsg';
import { loadSpinner, startSpinner, stopSpinner } from './Spinner';
import { logoutUser } from '../utility/user'

const initTab = { login: 'Login', register: 'Register' };
const Navbar = () => {
    const [logRegTab, setLogRegTab] = useState(initTab)
    const [monitorControlTab, setmonitorControlTab] = useState("Monitor & Control")
    const location = useLocation();
    const navigate = useNavigate({});
    // const [isAuthenticated,setIsAuthenticated]= useState(false);
    const loadNavbar = async () => {

        try {
            const res = await fetch(appdata.baseUrl + "/getData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'cookie': Cookies.get('jwtoken'),
                })
            });
            if (res.status !== 200) {
                // console.log("Status code: ",res.status);
                if (!Cookies.get('jwtoken')) {
                    sessionStorage.removeItem('loggedin')
                }
                throw new Error(res.Error);
            }
            if (!sessionStorage.getItem('loggedin')) {
                sessionStorage.setItem('loggedin', 'true')
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

    useEffect(() => {
        // to highlight login and register tab
        // console.log('mylocation',location.pathname, location.key);
        highlightTab(location.pathname);

    }, [location.pathname, location.key]);

    const signoutUser = () => {
        // console.log('Signing out user');
        setModalBtnClick(() => {
            startSpinner();
            logoutUser(appdata).then(() => {
                navigate('/login');
            }).finally(() => {
                stopSpinner();
                // console.log('Showing alert');
                showSimpleAlert("You have been logged out!", 'red');
            });
        });
        showModalAlert("Are you sure you want to exit?", 'Confirm')
    }

    // to highlight login and register tab
    const highlightTab = (name) => {
        // console.log(name);
        if (name === '/login') {
            setLogRegTab({ login: '<b>Login</b>', register: 'Register' })
        } else if (name === '/register') {
            setLogRegTab({ login: 'Login', register: '<b>Register</b>' })
        } else {
            setLogRegTab({ login: 'Login', register: 'Register' })
        }

        if(name==='/getdata'){
            setmonitorControlTab('Get Data');
        }else if(name==='/schedule'){
            setmonitorControlTab('Schedule');
        }else if(name==='/configure'){
            setmonitorControlTab('Configure');
        }else if(name==='/supplyList'){
            setmonitorControlTab('SupplyList');
        }
    }

    // show tabs when user is not logged in
    const LogoutTab = () => {
        return (
            <>
                <li className="nav-item">
                    <NavLink className="nav-link" name='about' to="/about">About</NavLink>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <span dangerouslySetInnerHTML={{ __html: logRegTab.login }}></span>/<span dangerouslySetInnerHTML={{ __html: logRegTab.register }}></span>
                    </a>
                    <ul className="dropdown-menu">
                        <li><NavLink className="dropdown-item" name='login' to="/login">Login</NavLink></li>
                        <li><NavLink className="dropdown-item" name='register' to="/register">Register</NavLink></li>
                    </ul>
                </li>
            </>
        )
    }

    // show tabs when user is logged in
    const LoginTab = () => {
        return (
            <>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/contact">Contact</NavLink>
                </li>

                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <span>{monitorControlTab}</span>
                    </a>
                    <ul className="dropdown-menu">
                        <li><NavLink className="dropdown-item" name='login' to="/getdata">GetData</NavLink></li>
                        <li><NavLink className="dropdown-item" name='register' to="/schedule">Schedule</NavLink></li>
                        <li><NavLink className="dropdown-item" name='configure' to="/configure">Configure</NavLink></li>
                        <li><NavLink className="dropdown-item" name='supplyList' to="/supplyList">Supply List</NavLink></li>
                    </ul>
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
                    <NavLink className="navbar-brand" name='logo' to="/">
                        <img src={logoImg} alt="Logo" width="30" height="30" className="d-inline-block align-text-top" />
                        Tank Automation
                    </NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" name='home' aria-current="page" to="/">Home</NavLink>
                            </li>
                            {sessionStorage.getItem('loggedin') ? <LoginTab /> : <LogoutTab />}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar