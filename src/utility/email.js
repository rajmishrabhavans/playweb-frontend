import Cookies from "js-cookie";
import { showModalAlert, showSimpleAlert} from "../components/AlertMsg";
import appdata from "./appdata";

export const verifyEmail= async(email,OTP)=>{

    try {
        const res = await fetch(appdata.baseUrl + "/verifyemail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'cookie':Cookies.get('jwtoken'),
                otp:OTP+"",
                email
            })
        });
        const data = await res.json();
        if (res.status>201) {
            console.log(data.error);
            if (data.error === 'Invalid request missing parameters') {
                showModalAlert('Invalid request missing parameters')
            }else if (data.error === 'Sorry User not found') {
                showModalAlert('Sorry User not found')
            }else if (data.error === 'invalid otp') {
                showModalAlert('Incorrect OTP')
            }else{
                showModalAlert("Unable to verify your email")
            }
            throw new Error("Failed to verify email");
        }
        showModalAlert("Email Verified successfully")
        return true
    } catch (error) {
        console.log(error);
        // error.email= 'Check your internet connection'
        return false;
    }
}
export const  sendEmail= async(email,subject="",content="")=>{
    try {
        const res = await fetch(appdata.baseUrl + "/sendemail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                'cookie':Cookies.get('jwtoken'),
                email,
                subject,
                content
            })
        });
        const data = await res.json();
        if (res.status>201) {
            if (data.error === 'User not Found') {
                showModalAlert('User not Found')
                return false;
            }
            showModalAlert("Unable to send email")
            throw new Error("Failed to send mail");
        }
        return true;
        // showSimpleAlert("Email send successfully");
        // showModalAlert("Email sent successfully")
    } catch (error) {
        console.log(error);
        showModalAlert("Unable to send email")
        // error.email= 'Check your internet connection'
        return false;
    }
}


export const forgotPassword= async(email,otp,password)=>{
    try {
        const res = await fetch(appdata.baseUrl + "/forgotPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                email,
                otp,
                password
            })
        });
        const data = await res.json();
        if (res.status>201) {
            console.log(data.error);
            if(data.error==='User not Found'){
                showModalAlert('Sorry User not found');
                return data.error;
            }else if(data.error==='invalid otp'){
                showModalAlert('Invalid OTP');
                return data.error;
            }
            throw new Error("Failed to send mail");
        }
        showSimpleAlert("Password changed successfully");
        return true;
        // showModalAlert("Email sent successfully")
    } catch (error) {
        console.log(error);
        showModalAlert("Unable to change password")
        // error.email= 'Check your internet connection'
        return error;
    }
}