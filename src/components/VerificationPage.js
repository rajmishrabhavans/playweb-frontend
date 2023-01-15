import React, { useEffect, useState } from 'react'
import { verifyEmail, sendEmail } from '../utility/email'
import { showSimpleAlert } from './AlertMsg';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom'
import appdata, { userInfo } from './appdata';
import { getUserData } from '../utility/user';
import * as Yup from 'yup';
;
// const isInteger=(str)=>{
//     return !isNaN(str) && !isNaN(parseFloat(str))
// }

const otpError = "OTP is not valid!";
const OTPSchema = () => Yup.object({
    OTP: Yup.string().required("please enter your OTP").test('is Integer?','Enter proper otp',(str)=>!isNaN(str) && !isNaN(parseFloat(str)) && !(/[^0-9]+/.test(str))).min(6,otpError).max(6,otpError),
})


const VerifyEmail = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("example@mail.com");
    const [msgSendDetails, setMsgSendDetails] = useState({ isMsgSent: false, msgSendTime: null,remainingTime: 0 });

    const { values, errors, handleChange, handleSubmit, handleBlur } = useFormik({
        initialValues: { OTP: "" },
        validationSchema: OTPSchema,
        onSubmit: (values, action) => {
            // action.resetForm();
            verifyEmail(values.OTP).then((d)=>{if(d) navigate('/login')}).catch((e)=>{console.log(e);});
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
        sendEmail(errors, values.OTP);
        setMsgSendDetails({ isMsgSent: true, msgSendTime: currTime });
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
        if (sessionStorage.getItem('loggedin') && !userInfo.creationdate) {
            getUserData(appdata).then((d) => setEmail(d.email)).catch(e => console.log(e));
        } else if (!sessionStorage.getItem('loggedin')) {
            console.log('Unauthorized');
        } else {
            setEmail(userInfo.email);
        }
        // console.log(userInfo)
    }, [])


    return (
        <>

            <div className="card-body p-md-5">
                <div className="row justify-content-center">
                    <div className="col-md-11 col-lg-9 col-xl-7 order-2 order-lg-1 ">

                        <div className="text-center ">

                            <div className="w-100 mt-1">
                                <p>{email}</p>
                                <button className="btn btn-success" onClick={onSendVerification} type="button">Send Email</button>
                                {msgSendDetails.remainingTime>0 && <div className="">You can send next mail after {msgSendDetails.remainingTime} sec</div>
}
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
                            
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default VerifyEmail