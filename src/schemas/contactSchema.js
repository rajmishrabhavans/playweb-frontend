import * as Yup from 'yup';

// validation schema for contact form
const contactSchema = () => Yup.object({
    name:Yup.string().min(2).max(25).required("please enter your name"),
    email:Yup.string().email().required("please enter your email"),
    phone:Yup.string().min(10).max(15).required("please enter your mobile no."),
    message:Yup.string().required("Please write some message.")
})

export default contactSchema