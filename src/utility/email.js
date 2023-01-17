import Cookies from "js-cookie";
import { showModalAlert} from "../components/AlertMsg";
import appdata from "./appdata";
import { logoutUser } from "./user";

export const verifyEmail= async(OTP)=>{

    try {
        const res = await fetch(appdata.baseUrl + "/verifyemail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'cookie':Cookies.get('jwtoken'),
                otp:OTP+""
            })
        });
        const data = await res.json();
        if (res.status>201) {
            if (data.error === 'Invalid request missing parameters') {
                showModalAlert('Invalid request missing parameters')
            }else if (data.error === 'Sorry User not found') {
                showModalAlert('Sorry User not found')
            }else if (data.error === 'Please provide valid otp') {
                showModalAlert('Please provide valid otp')
            }
            throw new Error("Failed to send mail");
        }
        showModalAlert("Email Verified successfully")
        logoutUser();
        return true
    } catch (error) {
        console.log(error);
        showModalAlert("Unable to verify your email")
        // error.email= 'Check your internet connection'
        return false;
    }
}
export const  sendEmail= async()=>{
    try {
        const res = await fetch(appdata.baseUrl + "/sendemail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                'cookie':Cookies.get('jwtoken'),
            })
        });
        const data = await res.json();
        if (res.status>201) {
            if (data.error === 'User already Verified') {
                showModalAlert('User already Verified')
            }else if (data.error === 'User not Found') {
                showModalAlert('User not Found')
            }
            showModalAlert("Email send successfully")
            throw new Error("Failed to send mail");
        }
    } catch (error) {
        console.log(error);
        showModalAlert("Unable to send email")
        // error.email= 'Check your internet connection'
        return error;
    }
    console.log('send');
}