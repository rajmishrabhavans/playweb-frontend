import React, { useEffect} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import appdata from '../utility/appdata';
import { useFormik } from 'formik';
import registerSchema from '../schemas/registerSchema';
import { loadAlerts, showModalAlert} from './AlertMsg';
import { loadSpinner, startSpinner, stopSpinner } from './Spinner';
// import Cookies from 'js-cookie';s
const houseImg = require('../images/house.png')

const Register = () => {
    const navigate = useNavigate();
    const initValue = {
        name: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        cpassword: ""
    }
    const checkExistingUser = async (values) => {
        const { email, phone } = values;
        let errors = {};
        try {
            const res = await fetch(appdata.baseUrl + "/checkUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, phone
                })
            });
            const data = await res.json();
            if (data.error) {
                if (data.error === 'email') {
                    errors.email = 'Email already exists'
                }
                if (data.error === 'phone') {
                    errors.phone = 'Phone already exists'
                }
            }
            return errors;
        } catch (error) {
            console.log(error);
            // error.email= 'Check your internet connection'
            return error;
        }
    }
    const { values, errors, touched, handleChange, handleSubmit, handleBlur } = useFormik({
        initialValues: initValue,
        validationSchema: registerSchema,
        validate: checkExistingUser,
        onSubmit: (values, action) => {
            // action.resetForm();
            // console.log(values);
            submitUserData();
            
        }
    })

    const submitUserData = async () => {
        try {
            startSpinner();
            const { name, email, phone, gender, password, cpassword } = values;
            if (!name || !email || !phone || !gender || !password || !cpassword) {
                alert("Please fill all the details");
                return;
            }
            const res = await fetch(appdata.baseUrl + "/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, phone, gender, password, cpassword
                })
            });
            const data = await res.json();
            if (res.status === (422) || !data) {
                if (data.error === 'email') {
                    alert('Email already exists');
                } else if (data.error === 'phone') {
                    alert('Phone already exists');
                } else {
                    alert("Failed to register!");
                }
                console.log("Failed to register!");
            } else {
                // const token = data.token;
                // if(!Cookies.get('jwtoken') || Cookies.get('jwtoken')!==token){
                //     Cookies.set('jwtoken',data.token)
                // }
                showModalAlert("Registered Successful\n Our Team will contact you soon","Ok","green");
                // console.log("Registration Sucessfull");
                // localStorage.setItem('loggedin','true')
                navigate('/');
            }
        } catch (error) {
            console.log(error);
            showModalAlert("Unable to register!")
        } finally {
            stopSpinner();
        }
    }

    useEffect(() => {
        loadSpinner();
        loadAlerts();
    }, [])


    return (
        <>

            <div className="card-body p-md-5">
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Register</p>

                        <form onSubmit={handleSubmit} method="POST" className="mx-1 mx-md-4">

                            <div className="d-flex flex-row align-items-center mb-0">
                                <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                <div className="form-outline flex-fill mb-0">
                                    <input type="text" name="name" onBlur={handleBlur} onChange={handleChange} value={values.name} className="form-control"
                                        placeholder="Full Name" />
                                </div>
                            </div>

                            <p className='ms-4 mt-1 mb-4 text-danger' >{errors.name && touched.name ? errors.name : ""}</p>

                            <div className="d-flex flex-row align-items-center mb-0">
                                <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                <div className="form-outline flex-fill mb-0">
                                    <input type="email" name="email" onBlur={handleBlur} onChange={handleChange} value={values.email} className="form-control"
                                        placeholder="Your Email" />
                                </div>
                            </div>
                            <p className='ms-4 mt-1 mb-4 text-danger' >{errors.email && touched.email ? errors.email : ""}</p>


                            <div className="d-flex flex-row align-items-center mb-0">
                                <i className="fas fa-mobile fa-lg me-3 fa-fw"></i>
                                <div className="form-outline flex-fill mb-0">
                                    <input type="text" name="phone" onBlur={handleBlur} onChange={handleChange} value={values.phone} className="form-control"
                                        placeholder="Your Mobile no." />
                                </div>
                            </div>
                            <p className='ms-4 mt-1 mb-3 text-danger' >{errors.phone && touched.phone ? errors.phone : ""}</p>

                            <div className="form-check mb-1" onBlur={handleBlur} onChange={handleChange} value={values.gender}>
                                <input className="" type="radio" name="gender"
                                    id="genderRadio1" value="male" />
                                <label className="" htmlFor="genderRadio1">Male</label>
                                <input className="ms-2" type="radio" name="gender"
                                    id="genderRadio2" value="female" />
                                <label className="" htmlFor="genderRadio2">Female</label>
                            </div>
                            <p className='ms-4 mt-1 mb-4 text-danger' >{errors.gender && touched.gender ? errors.gender : ""}</p>


                            <div className="d-flex flex-row align-items-center mb-0">
                                <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                <div className="form-outline flex-fill mb-0">
                                    <input type="password" onBlur={handleBlur} onChange={handleChange} value={values.password} name="password" className="form-control"
                                        placeholder="Password" />
                                </div>
                            </div>
                            <p className='ms-4 mt-1 mb-4 text-danger' >{errors.password && touched.password ? errors.password : ""}</p>


                            <div className="d-flex flex-row align-items-center mb-0">
                                <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                                <div className="form-outline flex-fill mb-0">
                                    <input type="password" onBlur={handleBlur} onChange={handleChange} value={values.cpassword} name="cpassword" className="form-control"
                                        placeholder="Confirm password" />
                                </div>
                            </div>
                            <p className='ms-4 mt-1 mb-4 text-danger' >{errors.cpassword && touched.cpassword ? errors.cpassword : ""}</p>


                            <div className="d-flex flex-row justify-content-center mb-4">
                                <div className="">
                                    Already have an account? <NavLink to="/login">Login here</NavLink>
                                </div>
                            </div>

                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                <button type="submit" className="btn btn-primary btn-lg">Register</button>
                            </div>

                        </form>

                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center justify-content-center order-1 order-lg-2">

                        <img src={houseImg}
                            className="img-fluid log_img" alt="sample_img" />

                    </div>
                </div>
            </div>
        </>
    )
}

export default Register