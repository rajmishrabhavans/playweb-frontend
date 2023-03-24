import { useFormik } from 'formik'
import React, {useContext, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { AdminContext } from './MyDashboard'
import { showSimpleAlert } from '../components/AlertMsg';
import { fetchApi } from '../utility/apiHelper'
import { loadAdminData } from '../utility/admin'
import { loadSpinner, startSpinner, stopSpinner } from '../components/Spinner'

const EditAdmin = () => {
  const navigate= useNavigate();
  const {adminData, setAdminData} = useContext(AdminContext)
    // validation for admin details
    const adminSchema = () => Yup.object({
      name:Yup.string().test('Valid Character?','Name is Invalid',(str)=> !(/[^a-zA-Z\s]+/.test(str))).min(2).max(25).required("please enter your name"),
      email:Yup.string().email().required("please enter your email"),
      phone:Yup.string().min(10).max(15).required("please enter your mobile no."),
      gender:Yup.string().required("Select your Gender")
    })

    const initValue = {
      name:adminData.name,
      email:adminData.email,
      phone:adminData.phone,
      gender:adminData.gender,
      profilePic:adminData.profilePic,
      societyName:adminData.societyName,
      societyLocation:adminData.societyLocation,
      }
    const {values,errors, touched,setFieldValue, handleChange, handleBlur, handleSubmit} = useFormik({
    // initialValues: { wing: "A", room: "101", name: "test", email: "test@mail.com", age: "20", mobile: "8456893296", ownership: "", status: "" },
    initialValues: initValue,
    validationSchema: adminSchema,
    onSubmit: (values, action) => {
        console.log("submitted profile form")
        startSpinner()
        saveChanges()
        .finally(()=>{
          stopSpinner()
        })
        // action.resetForm();
    }
    })

    useEffect(() => {
      loadSpinner()
      setFieldValue('name',adminData.name)
      setFieldValue('email',adminData.email)
      setFieldValue('phone',adminData.phone)
      setFieldValue('gender',adminData.gender)
      setFieldValue('profilePic',adminData.profilePic)
      setFieldValue('societyName',adminData.societyName)
      setFieldValue('societyLocation',adminData.societyLocation)
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminData])
  
  const photoUpload = (e) =>{
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    const MAX_FILE_SIZE= 1*2024
    if(!file || file.size/1024>MAX_FILE_SIZE){
      showSimpleAlert( `File size exceeds ${MAX_FILE_SIZE}kb`)
      return
    }
    console.log(file.size/1024,MAX_FILE_SIZE)
    reader.onloadend = () => {
        setFieldValue('profilePic',reader.result)
        // console.log(reader.result);
    }
    reader.readAsDataURL(file);
  }
  
  const saveChanges= async()=>{
    // console.log((supplyList[0]));
    if(values.profilePic===adminData.profilePic){
      setFieldValue('profilePic',null)
    }
    await fetchApi('/updateProfile',values)
    .then(async()=>{
      await loadAdminData()
          .then((data) => {
              if(data){
              setAdminData({...data,
                profilePic:data.profilePic?data.profilePic:adminData.profilePic,
                societyName:data.societyName?data.societyName:adminData.societyName,
                societyLocation:data.societyLocation?data.societyLocation:adminData.societyLocation,
              });
              showSimpleAlert("Profile Updated Successfully")
            }
          })
    })
    navigate("/profile")
  }


  return (
    <div className="container">
    <form className="mt-4" onSubmit={handleSubmit}>

      <div className='mb-3'>
        <div className='d-flex justify-content-center placeholder-glow'>
            <label id='profileLabel' htmlFor="photo-upload" className="custom-file-upload fas m-2">
              <div className="img-wrap img-upload" >
                <img id="profileImg" className='img-fluid glowme' htmlFor="photo-upload" alt='' src={values.profilePic}/>
              </div>
              <input id="photo-upload" type="file" accept="image/*" onChange={photoUpload}/> 
            </label>
        </div>
      </div>
      
        <div className="row placeholder-glow">
            <div className="mb-3 col-lg-6 col-md-6 col-12">
                <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                <input type="text" name="name" value={values.name} onBlur={handleBlur} onChange={handleChange} className="form-control glowme" />
                <p className='ms-4 mt-1 mb-4 text-danger' >{errors.name && touched.name ? errors.name : ""}</p>
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
                <label htmlFor="exampleInputPassword1" className="form-label">Email</label>
                <input type="email" name="email" value={values.email} onBlur={handleBlur} onChange={handleChange} className="form-control glowme" />
                <p className='ms-4 mt-1 mb-4 text-danger' >{errors.email && touched.email ? errors.email : ""}</p>
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
                <label htmlFor="exampleInputPassword1" className="form-label">Mobile</label>
                <input type="number" name="phone" value={values.phone} onBlur={handleBlur} onChange={handleChange} className="form-control glowme" />
                <p className='ms-4 mt-1 mb-4 text-danger' >{errors.phone && touched.phone ? errors.phone : ""}</p>
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
                <label htmlFor="exampleInputPassword1" className="form-label">Gender</label>
                <select className="form-select glowme bg-light" aria-label="Default select example" name="gender" value={values.gender} onBlur={handleBlur} onChange={handleChange} >
                    <option value="" disabled hidden>Please Choose...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <p className='ms-4 mt-1 mb-4 text-danger' >{errors.gender && touched.gender ? errors.gender : ""}</p>
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
                <label htmlFor="exampleInputEmail1" className="form-label">Society Name</label>
                <input type="text" name="societyName" value={values.societyName} onBlur={handleBlur} onChange={handleChange} className="form-control glowme" />
                <p className='ms-4 mt-1 mb-4 text-danger' >{errors.societyName && touched.societyName ? errors.societyName : ""}</p>
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
                <label htmlFor="exampleInputEmail1" className="form-label">Society Location</label>
                <input type="text" name="societyLocation" value={values.societyLocation} onBlur={handleBlur} onChange={handleChange} className="form-control glowme" />
                <p className='ms-4 mt-1 mb-4 text-danger' >{errors.societyLocation && touched.societyLocation ? errors.societyLocation : ""}</p>
            </div>
            <div className='d-flex'>
            <button type="submit" className="btn btn-success glowme ms-auto me-2 px-md-4">Save</button>
            <button onClick={()=>navigate("/profile")} className="btn btn-outline-secondary bg-white text-dark">Cancel</button>
            </div>
        </div>
    </form>
</div>
  )
}

export default EditAdmin
