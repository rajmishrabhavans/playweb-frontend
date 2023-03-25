import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import {useNavigate} from 'react-router-dom'
import { showModalAlert, showSimpleAlert, loadAlerts } from './AlertMsg'
import { fetchApi } from '../utility/apiHelper'
import contactPageSchema from '../schemas/contactPageSchema'
const ContactPage = () => {

    const navigate = useNavigate()

    const initValue = {
        firstName: '',
        lastName: '',
        subject: '',
        email: '',
        mobile: '',
        city: '',
        message : ''
    }
    const {values,errors,touched, handleChange, handleSubmit,handleBlur} = useFormik({
        initialValues: initValue,
        validationSchema: contactPageSchema,
        // validateOnChange: true,
        onSubmit: (values, action)=>{
            sendMessage().then((res)=>{
                if(res){
                    showModalAlert("Message sent successfully");
                    navigate('/')
                    action.resetForm();
                }else{
                    showSimpleAlert("Failed to sent message","red")
                }
            })
        }
        })
        
    // sent message to the backend
    const sendMessage = async () => {
            const {firstName, lastName, subject, email, mobile, city, message}= values;
            if( !firstName || !lastName || !subject || !email || !mobile || !city || !message){
                alert("Please fill all the details");
                return;
            }

            const data= {firstName,lastName,subject,email,mobile,city,message}
            const res = await fetchApi("/home/contact",data)
            
            console.log("updateSensorData: ");
            // console.trace("updateConfig: ");
            if(res){
                console.log(res);
                return res;
            }
            return false;

    }

    useEffect(() => {
        loadAlerts();
    }, [])
    

  return (
    <div className="container mt-5 shadow ">
        <div className="row ">
            <div className="col-md-4 bg-primary p-5 text-white order-sm-first order-last">
                <h2>Let's get in touch</h2>
                <p>We're open for any suggestion or just to have a chat</p>
                <div className="d-flex mt-2">
                    {/* <i className="bi bi-geo-alt"></i> */}
                    <i className="fa fa-map-marker fa-2x mt-4" aria-hidden="true"></i>
                    {/* <i className='fal fa-location'></i> */}
                    <p className="mt-3 ms-3">Address : Bhavan's College Andheri(West)</p>
                </div>
                <div className="d-flex mt-2">
                    {/* <i className="bi bi-telephone-forward"></i> */}
                    <i className="fa fa-phone fa-2x mt-4" aria-hidden="true"></i>
                    <p className="mt-4 ms-3">Phone : 8888888888</p>
                </div>
                <div className="d-flex mt-2">
                    {/* <i className="bi bi-envelope"></i> */}
                    <i className="fa fa-envelope fa-2x mt-4" aria-hidden="true"></i>
                    <p className="mt-4 ms-3">Email : typroject@gmail.com</p>
                </div>
            </div>
            <div className="col-md-8 p-5 ">
                <h2>Get in touch</h2>
                <form onSubmit={handleSubmit} className="row g-3 contactForm mt-4">
                    <div className="col-md-6">
                      <label htmlFor="inputEmail4" className="form-label">First Name</label>
                      <input type="text" name="firstName" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.firstName} required />
                      {/* {errors.firstName?"true":"false"} {touched.firstName?"true":"false"} */}
                      <p className='ms-4 mt-1 mb-4 text-danger' >{errors.firstName && touched.firstName ? errors.firstName : ""}</p>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="inputPassword4" className="form-label">Last Name</label>
                      <input type="text" name="lastName" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.lastName}  required />
                      
                      <p className='ms-4 mt-1 mb-4 text-danger' >{errors.lastName && touched.lastName ? errors.lastName : ""}</p>
                    </div>
                    <div className="col-12">
                      <label htmlFor="inputAddress" className="form-label">Subject</label>
                      <input type="text" name="subject" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.subject}  required />
                      
                      <p className='ms-4 mt-1 mb-4 text-danger' >{errors.subject && touched.subject ? errors.subject : ""}</p>
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputAddress" className="form-label">Email Id</label>
                        <input type="email" name="email" className="form-control"onChange={handleChange} onBlur={handleBlur} value={values.email}  required />
                        
                        <p className='ms-4 mt-1 mb-4 text-danger' >{errors.email && touched.email ? errors.email : ""}</p>
                      </div>
                    <div className="col-md-6">
                      <label htmlFor="inputCity" className="form-label">City</label>
                      <input type="text" name="city" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.city}  />
                      
                      <p className='ms-4 mt-1 mb-4 text-danger' >{errors.city && touched.city ? errors.city : ""}</p>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputCity" className="form-label">Contact Number</label>
                        <input type="number" name="mobile" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.mobile} required />
                        
                        <p className='ms-4 mt-1 mb-4 text-danger' >{errors.mobile && touched.mobile ? errors.mobile : ""}</p>
                    </div>
                    <div className="col-12 mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Message</label>
                        <textarea className="form-control" name="message" onChange={handleChange} onBlur={handleBlur} value={values.message} rows="3"></textarea>
                        
                        <p className='ms-4 mt-1 mb-4 text-danger' >{errors.message && touched.message ? errors.message : ""}</p>
                    </div>
                    <div className="col-12 text-center">
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                  </form>
            </div>
        </div>
    </div>
  )
}

export default ContactPage
