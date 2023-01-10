import React, {  useEffect } from 'react'
import logoImg from '../images/house-water-32.png'
import { Link, NavLink,useNavigate } from 'react-router-dom'
import appdata, {userInfo} from './appdata'
import Cookies from 'js-cookie'

let spinner= document.getElementById('play-spinner');
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
      spinner= document.getElementById('play-spinner');
      loadNavbar();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    
    const logoutUser=async()=> {
        spinner.classList.remove('d-none');
        try {
            const res= await fetch(appdata.baseUrl+"/logout",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json" 
                },
                body:JSON.stringify({
                    cookie:Cookies.get('jwtoken')
                })
            });
            if(res.status!==200){
                throw new Error(res.Error);
            }
            // setIsAuthenticated(false);
            Cookies.remove('jwtoken',{path:''});
            const placholder = {
                _id:"295179",
                name:"your name",
                email:"example@mail.co",
                phone:"9876543210",
                gender:"male",
                creationdate:""
            }
            sessionStorage.removeItem('loggedin')
            Object.entries(placholder).forEach((e) => {if(userInfo[e[0]]!==undefined){userInfo[e[0]]= e[1]}});
            // console.log(userInfo);
            navigate("/login");
            // console.log(data);
        } catch (error) {
            console.log(error);
        }finally{
            spinner.classList.add('d-none');
        }
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

    // useEffect(() => {
    //     if(!Cookies.get('jwtoken')){
    //         dispatch({type:"USER",payload:false});
    //     }else{
    //         dispatch({type:"USER",payload:true});
    //     }
    //   }, [Cookies.get()])
    const LogoutTab=()=> {
      return (
        <>
        <li className="nav-item">
            <NavLink className="nav-link" to="/profile">Profile</NavLink>
        </li>
        <li className="nav-item">
            <Link className="nav-link cursor-pointer" onClick={logoutUser} >Logout</Link>
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
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/contact">Contact</NavLink>
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