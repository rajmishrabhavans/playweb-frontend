import React, {useState, useEffect, useRef} from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const initTab = { login: 'Login', register: 'Register' };
const Navbar = () => {

    const navButton = useRef(null)
    const linksContainerRef = useRef(null);

    function collapseNav() {
        navButton.current.classList.add("collapsed");
        linksContainerRef.current.classList.remove("show");
    }

    const [logRegTab, setLogRegTab] = useState(initTab)
    const location = useLocation();

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
}

useEffect(() => {
    // to highlight login and register tab
    // console.log('mylocation',location.pathname, location.key);
    highlightTab(location.pathname);

}, [location.pathname, location.key]);

useEffect(() => {
    var prevScrollpos = window.pageYOffset;
    window.onscroll = function () {
        var currentScrollPos = window.pageYOffset;
        if(document.getElementById("navbar")){
            if (prevScrollpos > currentScrollPos) {
                document.getElementById("navbar").style.top = "0";
            } else {
                document.getElementById("navbar").style.top = "-80px";
            }
            prevScrollpos = currentScrollPos;
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  return (
    <nav id='navbar' className="navbar fixed-top navbar-expand-lg bg-light" style={{ transition: 'top 0.3s' }}>
    <div className="container-fluid">
        <NavLink onClick={collapseNav} className="navbar-brand" name='logo' to="/">
            {/* <img src={logoImg} alt="Logo" width="30" height="30" className="d-inline-block align-text-top" /> */}
            <img src={require("../images/logo4.png")} alt=" " width="60" height="50" />
            Tank Automation
        </NavLink>
        <button ref={navButton} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <i className="fas fa-bars"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav" ref={linksContainerRef}>
            <ul className="navbar-nav ms-auto">
                <li className="nav-item ms-2">
                    <NavLink onClick={collapseNav} className="nav-link" name='home' aria-current="page" to="/">Home</NavLink>
                </li>
                <li className="nav-item ms-2">
                    <NavLink onClick={collapseNav} className="nav-link" name='about' to="/about">About</NavLink>
                </li>
                <li className="nav-item ms-2">
                    <NavLink onClick={collapseNav} className="nav-link" name='about' to="/contact">Contact</NavLink>
                </li>
                <li className="nav-item ms-2 dropdown">
                    <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {/* <span>Login/Registration</span> */}
                        <span dangerouslySetInnerHTML={{ __html: logRegTab.login }}></span>/<span dangerouslySetInnerHTML={{ __html: logRegTab.register }}></span>
                    </a>
                    <ul className="dropdown-menu">
                        <li><NavLink className="dropdown-item" name='login' onClick={collapseNav} to="/login" >Login</NavLink></li>
                        <li><NavLink className="dropdown-item" name='register' onClick={collapseNav} to="/register">Register</NavLink></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>
  )
}

export default Navbar