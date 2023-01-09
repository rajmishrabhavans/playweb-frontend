import {React,useContext, useEffect} from 'react'
import {NavLink,useNavigate} from 'react-router-dom'
import { userContext } from '../App';
import appdata,{userInfo} from './appdata';
import Cookies from 'js-cookie';
import {useFormik} from 'formik';
import loginSchema from '../schemas/loginSchema';
const buildingImg= require('../images/building.png');

let spinner= document.getElementById('play-spinner');
const Login = () => {
    //eslint-disable-next-line
    const {state,dispatch} = useContext(userContext);
    const navigate= useNavigate();
    const initValue= {
        email:"",
        password:""
    }
    const {values,errors,touched,handleChange,handleSubmit,handleBlur}= useFormik({
        initialValues:initValue,
        validationSchema:loginSchema,
        onSubmit: (values,action)=>{
            action.resetForm();
            // console.log(values);
            submitUserData();
        }
    })
    // console.log(errors);
    const submitUserData =async()=>{
        spinner.classList.remove('d-none');
        try {
        const {email,password}= values;
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
            spinner.classList.add('d-none');
        }
    }
    useEffect(()=>{
        spinner= document.getElementById('play-spinner');
    },[])
  return (
    <>
        <div className="card-body p-md-5">
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign in</p>

                    <form onSubmit={handleSubmit} method="POST" className="mx-1 mx-md-4">

                        <div className="d-flex flex-row align-items-center mb-1">
                            <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                            <div className="form-outline flex-fill mb-0">
                                <input type="email" name="email" className="form-control"
                                    onBlur={handleBlur} onChange={handleChange} value={values.email} placeholder="Your Email" required />
                            </div>
                        </div>
                        <p className='ms-4 mt-1 mb-4 text-danger' >{errors.email && touched.email ? errors.email:""}</p>


                        <div className="d-flex flex-row align-items-center mb-1">
                            <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                            <div className="form-outline flex-fill mb-0">
                                <input type="password" name="password" className="form-control"
                                    onBlur={handleBlur} onChange={handleChange} value={values.password} placeholder="Password" required />
                            </div>
                        </div>
                        <p className='ms-4 mt-1 mb-4 text-danger' >{errors.password && touched.password ? errors.password:""}</p>


                        <div className="d-flex flex-row justify-content-center mb-4">
                            <div className="">
                                Don't have an account? <NavLink to="/register">Apply here</NavLink>
                            </div>
                        </div>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                            <button type="submit" className="btn btn-primary btn-lg">Login</button>
                        </div>

                    </form>

                </div>
                <div className="col-md-10 col-lg-6 col-xl-7 d-flex justify-content-center order-1 order-lg-2">

                    <img src={buildingImg}
                        className="img-fluid log_img" alt="login_img"/>

                </div>
            </div>
        </div>

    </>
  )
}

export default Login