import '../App.css'
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loadSpinner, startSpinner, stopSpinner } from '../components/Spinner';
import {loadEspConfigData, setEspConfigData} from '../utility/espFucntion'

const depthRangeError = 'range should be between [4,400]'
const levelRangeError = 'range should be between [10,100]'
const configureSchema = () => Yup.object({
    tankDepth: Yup.number().required("please enter depth of tank").min(4,depthRangeError).max(400,depthRangeError),
    maxFill:Yup.number().required("please enter max fill level of tank").min(10,levelRangeError).max(100,levelRangeError),
})

const ScheduleWater = () => {
    const navigate = useNavigate();

    const initValue = {
        tankDepth: "",
        maxFill: "",
    }
    const { values, errors, touched,setFieldValue, handleChange, handleSubmit, handleBlur } = useFormik({
        initialValues: initValue,
        validationSchema: configureSchema,
        onSubmit: (values, action) => {
            // action.resetForm();
            startSpinner();
            setEspConfigData(values)
            .finally(()=>{
                stopSpinner();
            });

        }
    })
    // console.log(values);
    useEffect(() => {
        loadSpinner();
        if (sessionStorage.getItem('loggedin')) {
            loadEspConfigData(setFieldValue);
        } else {
            navigate('/login')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>

            <div id="row text-center">
                <div className='m-4 mx-auto d-flex flex-column pe-2 w-80 col-sm-11 col-md-10 col-xl-8'>

                    <h2 className='text-center'>Configure</h2>

                    <form onSubmit={handleSubmit} method="POST" className="mx-1 mx-md-4">

                        <div className="placeholder-glow d-flex flex-column mt-4 profileSection">
                            <div className='row my-2' >
                                <span className="col-xs-11 col-sm-5 text_bold">Tank Depth (in cm) : </span>
                                <input type="number" className="form-control" name='tankDepth' onBlur={handleBlur} onChange={handleChange}
                                    value={values.tankDepth} placeholder="Tank Depth" />
                            </div>
                        </div>
                        <p className='ms-4 mt-1 mb-4 text-danger' >{errors.tankDepth && touched.tankDepth ? errors.tankDepth:""}</p>

                        <div className="placeholder-glow d-flex flex-column mt-4 profileSection">
                            <div className='row my-2' >
                                <span className="col-xs-11 col-sm-5 text_bold">Max Tank Fill: </span>
                                <input type="number" className="form-control" name='maxFill' onBlur={handleBlur} onChange={handleChange}
                                    value={values.maxFill} placeholder="Max Fill" />
                            </div>
                        </div>
                        <p className='ms-4 mt-1 mb-4 text-danger' >{errors.maxFill && touched.maxFill ? errors.maxFill:""}</p>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                            <button type="submit" className="btn btn-primary btn-lg">Save Changes</button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default ScheduleWater