import React, { useState } from 'react'
import { sendEmail, forgotPassword } from '../utility/email'
import { showModalAlert, showSimpleAlert } from './AlertMsg';
import { useFormik } from 'formik';
import validator from 'validator';
import { NavLink, useNavigate } from 'react-router-dom'
// import appdata, { userInfo } from '../utility/appdata';
import { OTPSchema } from '../schemas/OTPSchema';


const ForgotPass = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [msgSendDetails, setMsgSendDetails] = useState({ isMsgSent: false, msgSendTime: null, remainingTime: 0 });

    const afterPasswordChanged = () => {
        let subject = "Account Password Change";
        let content = `<h1>Your account password has changed on ${Date().toLocaleString()}</h1>`;
        const msgSent = sendEmail(email, subject, content);
        if (msgSent) {
            navigate('/login');
        }
    }

    const initValue = {
        OTP: "",
        password: "",
        cpassword: ""
    }
    const { values, errors, touched, handleChange, handleSubmit, handleBlur } = useFormik({
        initialValues: initValue,
        validationSchema: OTPSchema,
        onSubmit: (values, action) => {
            // action.resetForm();
            forgotPassword(email, values.OTP, values.password)
                .then((d) => {
                    if (d === true) afterPasswordChanged();
                    else return;
                }).catch((e) => {
                    console.log(e);
                });
        }
    })


    const onSendVerification = () => {

        const currTime = Date.now();
        console.log('clicked verify at ', currTime);
        let timeGap;
        const timeLimit = 60;

        if (msgSendDetails.msgSendTime) {
            timeGap = Math.round(currTime / 1000 - msgSendDetails.msgSendTime / 1000)
            if (timeGap < timeLimit) {
                console.log(timeGap);
                // runTimer(timeGap,timeLimit);
                return showSimpleAlert(`Please wait ${60 - timeGap} sec before trying again`, 'red');
            }
        }
        if (validator.isEmail(email)) {
            sendEmail(email).then((mailSent) => {
                console.log(mailSent);
                if (mailSent === true) {
                    showSimpleAlert("Email send successfully");
                    setMsgSendDetails({ isMsgSent: true, msgSendTime: currTime });
                }
            })
        } else {
            showModalAlert("Invalid Email");
        }
    }

    // const runTimer= (timeGap,timeLimit)=>{
    //     if(timeLimit-timeGap>0){
    //         const timer = setInterval(()=>{
    //             console.log(timeGap++);
    //             setMsgSendDetails({...msgSendDetails,remainingTime:(60-timeGap)})
    //             if(timeGap>=timeLimit){
    //                 clearInterval(timer);

    //             }
    //         },1000);
    //     }
    // };

    return (
        <>

            <div className="card-body p-md-5">
                <div className="row justify-content-center">
                    <div className="col-md-11 col-lg-9 col-xl-7 order-2 order-lg-1 ">

                        <div className="text-center ">

                            <h2 className='text-bold'>Enter your registered email!</h2>
                            <div className="w-100 mt-2">

                                <div className="d-flex flex-row align-items-center mb-1">
                                    <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                    <div className="form-outline flex-fill mb-0">
                                        <input type="email" name="email" className="form-control"
                                            onChange={e => setEmail(e.target.value)} value={email} placeholder="Your Email" required />
                                    </div>
                                </div>
                                {/* <p className='ms-4 mt-1 mb-4 text-danger' >{errors.email && touched.email ? errors.email : ""}</p> */}

                                <button className="btn btn-success" onClick={onSendVerification} type="button">Send Email</button>
                                {msgSendDetails.remainingTime > 0 && <div className="">You can send next mail after {msgSendDetails.remainingTime} sec</div>}
                            </div>
                            {msgSendDetails.isMsgSent ? (
                                <>
                                    <form onSubmit={handleSubmit} method="POST" className="mx-1 mx-md-4">

                                        <div className="d-flex flex-row align-items-center mb-1">
                                            <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="text" className="form-control" name='OTP' onBlur={handleBlur} onChange={handleChange}
                                                    value={values.OTP} placeholder="Enter verification code" />
                                            </div>
                                        </div>
                                        <p className='ms-4 mt-1 mb-4 text-danger' >{errors.OTP && touched.OTP ? errors.OTP : ""}</p>

                                        <div className="d-flex flex-row align-items-center mb-1">
                                            <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="password" name="password" className="form-control"
                                                    onBlur={handleBlur} onChange={handleChange} value={values.password} placeholder="Password" required />
                                            </div>
                                        </div>
                                        <p className='ms-4 mt-1 mb-4 text-danger' >{errors.password && touched.password ? errors.password : ""}</p>

                                        <div className="d-flex flex-row align-items-center mb-1">
                                            <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="password" name="cpassword" className="form-control"
                                                    onBlur={handleBlur} onChange={handleChange} value={values.cpassword} placeholder="Confirm Password" required />
                                            </div>
                                        </div>
                                        <p className='ms-4 mt-1 mb-4 text-danger' >{errors.cpassword && touched.cpassword ? errors.cpassword : ""}</p>

                                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                            <button type="submit" className="btn btn-primary btn-lg">Change</button>
                                        </div>

                                    </form>
                                </>
                            ) : (null)}
                            <div className='mt-3'><NavLink to="/login">go to login page</NavLink></div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPass