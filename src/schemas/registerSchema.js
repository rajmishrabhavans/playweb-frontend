import * as Yup from 'yup';

const registerSchema = () => Yup.object({
    name:Yup.string().min(2).max(25).required("please enter your name"),
    email:Yup.string().email().required("please enter your email"),
    phone:Yup.string().min(10).max(15).required("please enter your mobile no."),
    gender:Yup.string().required("please select your gender"),
    password:Yup.string().min(6).required("enter your password"),
    cpassword:Yup.string().required("enter confirm password").oneOf([Yup.ref('password'),null],"password does not match")
})

export default registerSchema