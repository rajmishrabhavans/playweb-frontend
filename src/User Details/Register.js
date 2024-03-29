import { useFormik } from 'formik'
import React, { useEffect, useContext} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { getSupplyList, saveSupplyList } from '../utility/espFucntion';
import { showSimpleAlert } from '../components/AlertMsg';
import { UsersContext } from '../DashComponent/MyDashboard';

const Register = () => {
    const navigate = useNavigate()

    const {usersdata, setUserdata} = useContext(UsersContext)

    // checks if room already exists
    const checkRoom = async (values) => {
        let errors = {};
        console.log(values);
        if (usersdata.filter(function (e) { return e.room === values.room && e.wing === values.wing; }).length > 0) {
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
    const {values,errors, touched, handleChange, handleBlur, handleSubmit} = useFormik({
    // initialValues: { wing: "A", room: "101", name: "test", email: "test@mail.com", age: "20", mobile: "8456893296", ownership: "", status: "" },
    initialValues: initValue,
    validationSchema: roomSchema,
    validate: checkRoom,
    onSubmit: (values, action) => {
        console.log("submit")
        manageList("addListItem", values);
        // action.resetForm();
    }
    })

    useEffect(() => {
        loadSupplyList();
        console.log("List is loading");
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
      // reducer for adding,removing and updating supply listItem
    const manageList = async(type, value) => {
    let roomlist = usersdata;
    if (type === "addListItem") {
      roomlist.push(value);

    //   console.log(setUdata);
      const saved = await saveSupplyList(usersdata);
      if(saved) {
        setUserdata(roomlist);
        showSimpleAlert("List Updated Successfully")
        navigate("/users")
      }else{
        showSimpleAlert("Failed to update!")
      }
    }
  }
  
//   const saveChanges= async()=>{
//     // console.log((usersdata[0]));
//     const saved = await saveSupplyList(usersdata);
//     if(saved) showSimpleAlert("List Updated Successfully")
//   }

  const loadSupplyList= async()=>{
    if(usersdata.length>0) return;
    const slist= await getSupplyList();
    console.log(typeof('before'+usersdata));
    if(slist){
    setUserdata(slist);
    }
    // console.log(slist);
  }

  return (
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
                    <option value="" disabled hidden>Please Select...</option>
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
            <button type="submit" className="btn btn-primary">Submit</button>
        </div>
    </form>
</div>
  )
}

export default Register
