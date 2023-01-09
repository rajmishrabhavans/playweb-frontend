import {React,useState,useContext} from 'react'
import {NavLink,useNavigate} from 'react-router-dom'
import { userContext } from '../App';
import appdata,{userInfo} from './appdata';
import Cookies from 'js-cookie';
const buildingImg= require('../images/building.png');

const Login = () => {
    //eslint-disable-next-line
    const {state,dispatch} = useContext(userContext);
    const navigate= useNavigate();
    const[userData,setUserData]= useState({
        email:"",
        password:""
    });
    let name,value;
    const handleInput= (e)=>{
        name= e.target.name;
        value= e.target.value;
        setUserData({...userData,[name]:value})
        // console.log(userData);
    }
    const submitUserData =async(e)=>{
        try {
            
        e.preventDefault();
        e.target.disabled= true;
        const {email,password}= userData;
        if(!email || !password){
            alert("Please fill all the details");
            return;
        }
        const res = await fetch(appdata.baseUrl+"/login",{
            method: "POST",
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,password
            })
        });
        const data= await res.json();

        // console.log(res.status,data);
        if(res.status>201 || !data){
            alert("Invalid Entry!");
            setUserData({email:userData.email,password:""});
            console.log("Invalid Entry!");
        }else{
            dispatch({type:"USER",payload:true});
            alert("Login Sucessfull");
            Object.entries(data).forEach((e) => {if(userInfo[e[0]]!==undefined){userInfo[e[0]]= e[1]}});
            // console.log(userInfo);
            console.log("Login Sucessfull");
            const token= Cookies.get('jwtoken');
            if(!token){
                Cookies.set('jwtoken',data.token);
            }
            // console.log(state,Cookies.get());
            navigate('/');
        }
        } catch (error) {
            console.log(error);
        }finally{
            e.target.disabled= false;
        }

    }
  return (
    <>
    <section className="vh-100" style={{backgroundColor: '#eee'}}>
        <div className="container h-100 ">
            <div className="row d-flex justify-content-center align-items-center h-100 ">
                <div className="col-lg-12 col-xl-11">
                    <div className="card text-black register-form" style={{borderRadius: '25px'}}>
                        <div className="card-body p-md-5">
                            <div className="row justify-content-center">
                                <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign in</p>

                                    <form method="POST" className="mx-1 mx-md-4">

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="email" name="email" className="form-control"
                                                    onChange={handleInput} value={userData.email} placeholder="Your Email" required />
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="password" name="password" className="form-control"
                                                    onChange={handleInput} value={userData.password} placeholder="Password" required />
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row justify-content-center mb-4">
                                            <div className="">
                                                Don't have an account? <NavLink to="/register">Apply here</NavLink>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                            <button type="submit" onClick={submitUserData} className="btn btn-primary btn-lg">Login</button>
                                        </div>

                                    </form>

                                </div>
                                <div className="col-md-10 col-lg-6 col-xl-7 d-flex justify-content-center order-1 order-lg-2">

                                    <img src={buildingImg}
                                        className="img-fluid log_img" alt="login_img"/>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    </>
  )
}

export default Login