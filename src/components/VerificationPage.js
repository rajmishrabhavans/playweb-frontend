import React, { useEffect, useState } from 'react'
import { verifyEmail, sendEmail } from '../utility/email'
import { showModalAlert, showSimpleAlert } from './AlertMsg';
import { useFormik } from 'formik';
import validator from 'validator';
import { NavLink, useNavigate } from 'react-router-dom'
import appdata, { adminInfo } from '../utility/appdata';
import { getAdminData } from '../utility/admin';
import * as Yup from 'yup';

const otpError = "OTP is not valid!";
const OTPSchema = () => Yup.object({
    OTP: Yup.string().required("please enter your OTP").test('is Integer?','Enter proper otp',
    (str)=>!isNaN(str) && !isNaN(parseFloat(str)) && !(/[^0-9]+/.test(str))).min(6,otpError).max(6,otpError),
})

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("example@mail.com");
    const [msgSendDetails, setMsgSendDetails] = useState({ isMsgSent: false, msgSendTime: null,remainingTime: 0 });

    const afterVerify=()=>{
        
        let subject = "Email Verification Success";
        let content = `<h1>Your email has been verified successfully</h1>`;
        const msgSent = sendEmail(email,subject,content);
        if(msgSent===true){
            navigate("/");
        }
    }
    const { values, errors, handleChange, handleSubmit, handleBlur } = useFormik({
        initialValues: { OTP: "" },
        validationSchema: OTPSchema,
        onSubmit: (values, action) => {
            // action.resetForm();
            verifyEmail(email,values.OTP).then((d)=>{if(d===true) afterVerify()}).catch((e)=>{console.log(e);});
        }
    })

    const onSendVerification = () => {
        const currTime =Date.now();
        console.log('clicked verify at ',currTime);
        let timeGap;
        const timeLimit= 60;

        if (msgSendDetails.msgSendTime) {
            timeGap =Math.round(currTime/1000 - msgSendDetails.msgSendTime/1000)
            if (timeGap < timeLimit) {
                console.log(timeGap);
                // runTimer(timeGap,timeLimit);
                return showSimpleAlert(`Please wait ${60 - timeGap} sec before trying again`,'red');
            }
        }
        
        if(validator.isEmail(email)){
            sendEmail(email).then((mailSent)=>{
                console.log(mailSent);
                if(mailSent===true){
                    showSimpleAlert("Email send successfully");
                    setMsgSendDetails({ isMsgSent: true, msgSendTime: currTime });
                }
            })
        }else{
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

    useEffect(() => {
        if (localStorage.getItem('loggedin') && !adminInfo.creationdate) {
            getAdminData(appdata).then((d) => {
                if(d)
                setEmail(d.email)
            });
        } else if (!localStorage.getItem('loggedin')) {
            console.log('Unauthorized');
        } else {
            setEmail(adminInfo.email);
        }
        // console.log(adminInfo)
    }, [])


    return (
        <>

            <div className="card-body p-md-5">
                <div className="row justify-content-center">
                    <div className="col-md-11 col-lg-9 col-xl-7 order-2 order-lg-1 ">

                        <div className="text-center ">
                            {localStorage.getItem('loggedin')?(
                            <>
                            <h2 className='text-danger'>Your Email verification is pending!</h2>
                            <div className="w-100 mt-2">
                                <p><b>Email : </b> {email}</p>
                                <button className="btn btn-success" onClick={onSendVerification} type="button">Send Email</button>
                                {msgSendDetails.remainingTime>0 && <div className="">You can send next mail after {msgSendDetails.remainingTime} sec</div>}
                            </div>
                            {msgSendDetails.isMsgSent ? (
                                <>
                                    <form method='POST'>
                                        <div className="input-group mb-3 mt-1">
                                            <input type="text" className="form-control" name='OTP' onBlur={handleBlur} onChange={handleChange} value={values.OTP} placeholder="Enter verification code" />
                                            <button className="btn btn-success" onClick={handleSubmit} type="button">Submit</button>
                                        </div>
                                        <p className='text-danger'>{errors.OTP}</p>
                                    </form>
                                </>
                            ) : (null)}
                            <div className='mt-3'><NavLink to="/">skip for now</NavLink></div>
                            </>
                            ):
                            <h2 className='text-danger'>You need to login or register to gain access to this page!</h2>
                            }
                            
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default VerifyEmail