import * as Yup from 'yup';

// validation schema for registration form
const contactPageSchema = () => Yup.object({
    firstName: Yup.string().test('Valid Character?','Name is Invalid',(str)=> !(/[^a-zA-Z\s]+/.test(str))).min(2).max(25).required("please enter your name"),
    lastName: Yup.string().test('Valid Character?','Name is Invalid',(str)=> !(/[^a-zA-Z\s]+/.test(str))).min(2).max(25).required("please enter your name"),
    subject: Yup.string().required("please enter subject"),
    email: Yup.string().email().required("please enter your email"),
    mobile: Yup.string().test('is Integer?','Enter proper number!',(str)=> !isNaN(str) && !isNaN(parseFloat(str))).min(10).max(12),
    city: Yup.string().required("please enter your city"),
    message: Yup.string().required("please write message"),
})

export default contactPageSchema