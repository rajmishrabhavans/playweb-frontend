import * as Yup from 'yup';

const otpError = 'Invalid OTP format'

// validation schema for forgot Password
export const OTPSchema = () => Yup.object({
    OTP: Yup.string().required("please enter your OTP").test('is Integer?', 'Enter proper otp',
        (str) => !isNaN(str) && !isNaN(parseFloat(str)) && !(/[^0-9]+/.test(str))).min(6, otpError).max(6, otpError),
    password:Yup.string().min(6).required("enter your password").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-7])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/,
    "Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
  ),
    cpassword:Yup.string().required("enter confirm password").oneOf([Yup.ref('password'),null],"password does not match")

})
