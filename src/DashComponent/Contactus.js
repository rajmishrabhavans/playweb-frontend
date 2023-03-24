import Cookies from 'js-cookie';
import React, { useEffect} from 'react'
import {useFormik} from 'formik';
import contactSchema from '../schemas/contactSchema';
import {loadAlerts,showModalAlert} from '../components/AlertMsg';
import appdata, {adminInfo} from '../utility/appdata';
import { loadAdminData } from '../utility/admin';

let loadcomp= document.querySelectorAll('.glowme');
let initValue= {
    name: "",
    email: "",
    phone: "",
    message: ""
}
const Contactus = () => {
    const {values,errors,touched,setFieldValue,handleChange,handleSubmit,handleBlur}= useFormik({
        initialValues:initValue,
        validationSchema:contactSchema,
        onSubmit: (values,action)=>{
            //clear contact form on submit and reload it
            sendMessage().then(()=>{
                loadContactPage();
                action.resetForm();
            })
        }
    })

    // sent message to the backend
    const sendMessage = async () => {
        try {
            const {name,email,phone,message}= values;
            if(!name || !email || !phone || !message){
                alert("Please fill all the details");
                return;
            }
            const res = await fetch(appdata.baseUrl+"/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    name,email,phone,message,
                    'cookie':Cookies.get('jwtoken'),
                })
            });
            if (res.status !== 200) {
                throw new Error(res.error);
            }
            // const data = await res.json();
            showModalAlert("Message sent successfully");
        } catch (error) {
            console.log(error);
        }
    }

    //load values of value feilds from the backend
    const loadContactPage = async () => {

        //applying placeholders while data is being fetched from backend
        loadcomp.forEach((elem) => { elem.classList.add('placeholder'); })
        loadAdminData()
            .then((data) => {
                if(data){
                    setFieldValue('name',data.name)
                    setFieldValue('email',data.email)
                    setFieldValue('phone',data.phone)
                }
            })
            .finally(() => {
                //removing placeholders after data is fetched
                loadcomp.forEach((elem) => { elem.classList.remove('placeholder') });
            })
    }

    useEffect(() => {
        
        loadAlerts();
        loadcomp= document.querySelectorAll('.glowme');
        if(!adminInfo.creationdate && localStorage.getItem('loggedin')){
            loadContactPage();
        }else{
            
        setFieldValue('name',adminInfo.name)
        setFieldValue('email',adminInfo.email)
        setFieldValue('phone',adminInfo.phone)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <>
        <h2 className="text-center text-dark mb-3">Contact us</h2>
        <div className="card-body p-md-5">
            <div className="row justify-content-center">
                <div className="col-md-11 col-lg-9 col-xl-7 order-2 order-lg-1">


                    <form onSubmit={handleSubmit} method="POST" className="mx-1 mx-md-4">

                        <div className="d-flex flex-row align-items-center mb-1">
                            <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                            <div className="placeholder-glow form-outline flex-fill mb-0">
                                <input type="text" name="name" className="glowme form-control fw-bold"
                                    onBlur={handleBlur} onChange={handleChange} value={values.name} placeholder="Full Name" required/>
                            </div>
                        </div>
                        <p className='ms-4 mt-1 mb-4 text-danger' >{errors.name && touched.name ? errors.name:""}</p>


                        <div className="d-flex flex-row align-items-center mb-1">
                            <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                            <div className="placeholder-glow form-outline flex-fill mb-0">
                                <input type="email" name="email" className="glowme form-control fw-bold"
                                    onBlur={handleBlur} onChange={handleChange} value={values.email} placeholder="Your Email" required/>
                            </div>
                        </div>
                        <p className='ms-4 mt-1 mb-4 text-danger' >{errors.email && touched.email ? errors.email:""}</p>


                        <div className="d-flex flex-row align-items-center mb-1">
                            <i className="fas fa-mobile fa-lg me-3 fa-fw"></i>
                            <div className="placeholder-glow form-outline flex-fill mb-0">
                                <input type="number" name="phone" className="glowme form-control fw-bold"
                                    onBlur={handleBlur} onChange={handleChange} value={values.phone} placeholder="Mobile number" required/>
                            </div>
                        </div>
                        <p className='ms-4 mt-1 mb-4 text-danger' >{errors.phone && touched.phone ? errors.phone:""}</p>


                        <div className="d-flex flex-row align-items-center mb-1">
                        {/* <i className="fa-solid fa-messageme-3 fa-fw"></i> */}
                            <i className="fas fa-pen fa-lg me-3 fa-fw"></i>
                            <div className="placeholder-glow form-outline flex-fill mb-0">
                                <textarea rows='3' type="text" name="message" className="glowme form-control fw-bold"
                                    onBlur={handleBlur} onChange={handleChange} value={values.message} placeholder="Message" required/>
                            </div>
                        </div>
                        <p className='ms-4 mt-1 mb-4 text-danger' >{errors.message && touched.message ? errors.message:""}</p>


                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                            <button type="submit" className="btn btn-primary btn-lg">Submit</button>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    </>
  )
}

export default Contactus