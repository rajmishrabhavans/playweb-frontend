import React, { useState } from 'react'
import {NavLink,useNavigate} from 'react-router-dom'
import appdata from './appdata';
const houseImg= require('../images/house.png')

const Register = () => {
    const navigate= useNavigate();
    const[userData,setUserData]= useState({
        name:"",
        email:"",
        phone:"",
        gender:"male",
        password:"",
        cpassword:"",
        date:""
    })
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
            const {name,email,phone,gender,password,cpassword}= userData;
            if(!name || !email || !phone || !gender || !password || !cpassword){
                alert("Please fill all the details");
                return;
            }
            const res = await fetch(appdata.baseUrl+"/register",{
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    name,email,phone,gender,password,cpassword
                })
            });
            const data= await res.json();
            if(data.status===(422) || !data){
                alert("Invalid Entry!");
                console.log("Invalid Entry!");
            }else{
                alert("Registration Sucessfull");
                console.log("Registration Sucessfull");
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
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

                                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Register</p>

                                    <form method="POST" className="mx-1 mx-md-4">

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="text" name="name" onChange={handleInput} value={userData.name} className="form-control"
                                                    placeholder="Full Name" required/>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="email" name="email" onChange={handleInput} value={userData.email} className="form-control"
                                                    placeholder="Your Email" required/>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="number" name="phone" onChange={handleInput} value={userData.phone} className="form-control"
                                                    placeholder="Your Mobile no." required/>
                                            </div>
                                        </div>
                                        
                                        <div className="form-check mb-4" onChange={handleInput}>
                                            <input className="" type="radio" name="gender"
                                                id="genderRadio1" value="male" defaultChecked required/>
                                            <label className="" htmlFor="genderRadio1">Male</label>
                                            <input className="ms-2" type="radio" name="gender"
                                                id="genderRadio2" value="female"/>
                                            <label className="" htmlFor="genderRadio2">Female</label>
                                        </div>
                                        


                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="password" onChange={handleInput} value={userData.password} name="password" className="form-control"
                                                    placeholder="Password" required/>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="password" onChange={handleInput} value={userData.cpassword} name="cpassword" className="form-control"
                                                    placeholder="Confirm password" required/>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row justify-content-center mb-4">
                                            <div className="">
                                                Already have an account? <NavLink to="/login">Login here</NavLink>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                            <button type="submit" onClick={submitUserData} className="btn btn-primary btn-lg">Register</button>
                                        </div>

                                    </form>

                                </div>
                                <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center justify-content-center order-1 order-lg-2">

                                    <img src= {houseImg}
                                        className="img-fluid log_img" alt="sample_img"/>

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

export default Register