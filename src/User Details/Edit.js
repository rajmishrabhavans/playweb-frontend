import React, {useContext, useEffect} from 'react'
import { useFormik } from 'formik'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { getSupplyList, saveSupplyList } from '../utility/espFucntion';
import { showSimpleAlert } from '../components/AlertMsg';
import * as Yup from 'yup'
import { UsersContext } from '../DashComponent/MyDashboard';

const Edit = () => {

  const navigate = useNavigate()
  const {usersdata, setUserdata} = useContext(UsersContext)

  const initValue = {
    wing: "",
    room: "",
    name: "",
    email: "",
    age: "",
    mobile: "",
    ownership: "",
    status: "",
  }

  const { id } = useParams("");
  console.log(id-1);
   
  let slist
  
  const loadSupplyList= async()=>{
    if(usersdata.length>0){
      slist= usersdata
    }else{
      slist= await getSupplyList();
      if(slist) setUserdata(slist);
    }
    if(slist){
      const result = slist[id-1];
      console.log(result);
      Object.entries(result).forEach((e) => {setFieldValue(e[0],e[1],true)});

    }
  }
  const updateUserList= async (values) => {
    slist= await getSupplyList();
    slist[id-1] = values
    console.log(slist)
    const saved = await saveSupplyList(slist);
    if(saved) showSimpleAlert("List Updated Successfully")
    navigate('/users')
  }

  // checks if room already exists
  const checkRoom = async (values) => {
    if(!slist)
    if(usersdata.length>0){
      slist= usersdata
    }else{
      slist= await getSupplyList();
      if(slist) setUserdata(slist);
    }
    const result = slist[id-1];
    let errors = {};
    console.log(values);
    if (slist.filter(function (e) { return e.room === values.room && values.room!==result.room; }).length > 0) {
    errors.room = "room exists"
    }
    return errors;
}

  // validation for adding new room
  const roomError = 'range [0-10000]';
  const ageError = 'range [0-150]'
  const roomSchema = () => Yup.object({
      wing: Yup.string().required("please enter room name")
      .test('Valid Character?', 'Name is Invalid', (str) => !(/[^a-zA-Z0-9_\s]+/.test(str))),
      room: Yup.number().required("enter room no.").min(0, roomError).max(10000, roomError),
      name: Yup.string().required("please enter room name")
      .test('Valid Character?', 'Name is Invalid', (str) => !(/[^a-zA-Z0-9_\s]+/.test(str))),
      age: Yup.number().required("enter age.").min(0, roomError).max(150, ageError),
      email:Yup.string().email().required("please enter your email"),
      mobile:Yup.string().test('is Integer?','Enter proper number!',(str)=> !isNaN(str) && !isNaN(parseFloat(str))).min(10).max(12),
      // ownership:Yup.string().required("select ownership").test('is valid?','Select proper value!',(str)=> !str).min(10).max(12),
      ownership: Yup.string().required("Select ownership"),
      status:Yup.string().required("select status")
  })

  const {values, handleBlur, handleSubmit, handleChange, errors, touched, setFieldValue} = useFormik({
    initialValues: initValue,
    validationSchema: roomSchema,
    validate: checkRoom,
    onSubmit: (values, action) => {
      updateUserList(values)
    }
    })

    useEffect(() => {
      loadSupplyList();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
  <>
  <div className="container">
    <NavLink to="/users">Go Back</NavLink>
    <form className="mt-4" onSubmit={handleSubmit}>
        <div className="row">
            <div className="mb-3 col-lg-6 col-md-6 col-12">
                <label htmlFor="exampleInputPassword1" className="form-label">Wing</label>
                <input type="text" name="wing" value={values.wing} onBlur={handleBlur} onChange={handleChange} className="form-control" />
                <p className='ms-4 mt-1 mb-4 text-danger' >{errors.wing && touched.wing ? errors.wing : ""}</p>
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
                <label htmlFor="exampleInputPassword1" className="form-label">Room no</label>
                <input type="number" name="room" value={values.room} onBlur={handleBlur} onChange={handleChange} className="form-control" />
                <p className='ms-4 mt-1 mb-4 text-danger' >{errors.room && touched.room ? errors.room : ""}</p>
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
                <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                <input type="text" name="name" value={values.name} onBlur={handleBlur} onChange={handleChange} className="form-control" />
                <p className='ms-4 mt-1 mb-4 text-danger' >{errors.name && touched.name ? errors.name : ""}</p>
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
                <label htmlFor="exampleInputPassword1" className="form-label">Email</label>
                <input type="email" name="email" value={values.email} onBlur={handleBlur} onChange={handleChange} className="form-control" />
                <p className='ms-4 mt-1 mb-4 text-danger' >{errors.email && touched.email ? errors.email : ""}</p>
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
                <label htmlFor="exampleInputPassword1" className="form-label">Age</label>
                <input type="number" name="age" value={values.age} onBlur={handleBlur} onChange={handleChange} className="form-control" />
                <p className='ms-4 mt-1 mb-4 text-danger' >{errors.age && touched.age ? errors.age : ""}</p>
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
                <label htmlFor="exampleInputPassword1" className="form-label">Mobile</label>
                <input type="number" name="mobile" value={values.mobile} onBlur={handleBlur} onChange={handleChange} className="form-control" />
                <p className='ms-4 mt-1 mb-4 text-danger' >{errors.mobile && touched.mobile ? errors.mobile : ""}</p>
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
                <label htmlFor="exampleInputPassword1" className="form-label">Ownership</label>
                <select className="form-select" aria-label="Default select example" name='ownership' value={values.ownership} onBlur={handleBlur} onChange={handleChange}>
                    <option value="" disabled selected hidden>Please Select...</option>
                    <option value="1">Owner</option>
                    <option value="2">Tenant</option>
                </select>
                <p className='ms-4 mt-1 mb-4 text-danger' >{errors.ownership && touched.ownership ? errors.ownership : ""}</p>
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
                <label htmlFor="exampleInputPassword1" className="form-label">Status</label>
                <select className="form-select" aria-label="Default select example" name="status" value={values.status} onBlur={handleBlur} onChange={handleChange} >
                    <option value="" disabled hidden>Please Choose...</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <p className='ms-4 mt-1 mb-4 text-danger' >{errors.status && touched.status ? errors.status : ""}</p>
            </div>
            <button type="submit" className="btn btn-primary">Update</button>
        </div>
    </form>
  </div>
  </>
  )
}

export default Edit
