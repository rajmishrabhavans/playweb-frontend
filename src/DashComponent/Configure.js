import '../App.css'
import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loadSpinner, startSpinner, stopSpinner } from '../components/Spinner';
import { getTankInfo, loadEspConfigData, setEspConfigData } from '../utility/espFucntion'
import { showSimpleAlert } from '../components/AlertMsg';
import { TotalVolumeContext } from './MyDashboard';

const depthRangeError = 'range should be between [4,400]'
const maxlevelRangeError = 'range should be between [50,95]'
const minlevelRangeError = 'range should be between [5,50]'
const configureSchema = () => Yup.object({
    UTDepth: Yup.number().required("please enter depth of tank").min(4, depthRangeError).max(400, depthRangeError),
    LTDepth: Yup.number().required("please enter depth of tank").min(4, depthRangeError).max(400, depthRangeError),
    UTShape: Yup.string().required("select upperTank Shape"),
    LTShape: Yup.string().required("select lowerTank Shape"),
    UTR1: Yup.number().required("please enter upperTank shape parameter1"),
    UTR2: Yup.number().required("please enter upperTank shape parameter2"),
    LTR1: Yup.number().required("please enter lowerTank shape parameter1"),
    LTR2: Yup.number().required("please enter lowerTank shape parameter2"),
    maxFill: Yup.number().required("please enter max fill level of tank").min(50, maxlevelRangeError).max(95, maxlevelRangeError),
    minFill: Yup.number().required("please enter min fill level of tank").min(5, minlevelRangeError).max(50, minlevelRangeError),
})

const Configure = () => {
    const {setTotalVolume}= useContext(TotalVolumeContext)
    const navigate = useNavigate();

    
    //calculate volume of truncated cone
    const tConeTankVolume= (r1,r2,h)=>{
        const volume =  (1/3.0) * Math.PI * h * ((r1*r1) + r1 * r2 + (r2*r2));
        return Math.abs(volume);
    }
    //calculate volume of cuboid
    const tCuboidTankVolume= (l,w,h)=>{
        return  Math.abs(l*w*h);
    }

    const initValue = {
        UTDepth: "",
        LTDepth: "",
        UTShape: "frustum",
        LTShape: "frustum",
        UTR1: "",
        UTR2: "",
        LTR1: "",
        LTR2: "",
        maxFill: "",
        minFill: "",
    }
    const { values, errors, touched, setFieldValue, handleChange, handleSubmit, handleBlur } = useFormik({
        initialValues: initValue,
        validationSchema: configureSchema,
        onSubmit: (values, action) => {
            // action.resetForm();
            startSpinner();
            setEspConfigData(values)
                .then((d)=>{
                    if(d) {
                        showSimpleAlert("Changes saved")
                        let UTVolume,LTVolume;
                        if(values.UTShape==="cuboid"){
                            UTVolume= tCuboidTankVolume(values.UTR1,values.UTR2,values.UTDepth);
                        }else if(values.UTShape==="frustum"){
                            UTVolume= tConeTankVolume(values.UTR1,values.UTR2,values.UTDepth);
                        }if(values.LTShape==="cuboid"){
                            LTVolume= tCuboidTankVolume(values.LTR1,values.LTR2,values.LTDepth);
                        }else if(values.LTShape==="frustum"){
                            LTVolume= tConeTankVolume(values.LTR1,values.LTR2,values.LTDepth);
                        }
                        if(!UTVolume) UTVolume= 1200
                        if(!LTVolume) LTVolume= 1200
                        setTotalVolume({UTTotalVolume:Math.round(UTVolume),LTTotalVolume:Math.round(LTVolume)})

                    }
                    else showSimpleAlert("Failed to save","red")
                })
                .finally(() => {
                    stopSpinner();
                });
        }
    })


    const detectDepth = async (tank) => {

        setEspConfigData({ checkDepth: true });
        setTimeout(() => {
            getTankInfo().then((data) => {
                // console.log(data);
                if (tank === 'upper')
                    setFieldValue('UTDepth', data.UTDepth);
                if (tank === 'lower')
                    setFieldValue('LTDepth', data.LTDepth);
            });
        }, 2200);
    }

    // console.log(values);
    useEffect(() => {
        loadSpinner();
        if (localStorage.getItem('loggedin')) {
            loadEspConfigData().then((data) => {
                if (data) {
                    setFieldValue('UTDepth', data.udata.UTDepth);
                    setFieldValue('LTDepth', data.udata.LTDepth);
                    setFieldValue('UTShape', data.udata.UTShape);
                    setFieldValue('LTShape', data.udata.LTShape);

                    setFieldValue('UTR1', data.udata.UTR1);
                    setFieldValue('UTR2', data.udata.UTR2);
                    setFieldValue('LTR1', data.udata.LTR1);
                    setFieldValue('LTR2', data.udata.LTR2);
                    setFieldValue('maxFill', data.udata.maxFill);
                    setFieldValue('minFill', data.udata.minFill);
                } else {
                    console.log("No esp Config data!");
                }
            });
        } else {
            navigate('/login')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>

            <h2 className="text-center text-dark mb-3">Configure</h2>
            <div id="row text-center">
                <div className='m-4 mx-auto d-flex flex-column pe-2 w-80 col-sm-11 col-md-10 col-xl-8'>

                    <form onSubmit={handleSubmit} method="POST" className="mx-1 mx-md-4">

                        <div className="card border-left-primary shadow h-100">
                            <div className="card-header fw-bold text-center">Upper Tank</div>
                            <div className='px-2 pb-2'>
                                <div className="placeholder-glow d-flex flex-column mt-4 profileSection">
                                    <div className='row my-2 px-3' >
                                        <span className="text_bold">Upper Tank Depth (in cm) : </span>
                                        <input type="number" className="form-control" name='UTDepth' onBlur={handleBlur} onChange={handleChange}
                                            value={values.UTDepth} placeholder="Upper Tank Depth" />
                                    </div>
                                </div>
                                <p className='ms-4 mt-1 mb-1 text-danger' >{errors.UTDepth && touched.UTDepth ? errors.UTDepth : ""}</p>


                                <div className="mb-3 d-flex justify-content-center">
                                    <button type="button" onClick={() => detectDepth('upper')} className="btn btn-primary ">Detect depth</button>
                                </div>

                                <div className="placeholder-glow d-flex flex-column">
                                    <div className='row my-2' >
                                        <span className="col-xs-11 col-sm-5 text_bold">Upper Tank Shape : </span>

                                        <div className="mb-1" onBlur={handleBlur} onChange={handleChange} value={values.UTShape}>
                                            <input className="" type="radio" name="UTShape"
                                                id="frustum" value="frustum" defaultChecked />
                                            <label className="ps-1" htmlFor="frustum"> 🪣 Frustum</label>
                                            <input className="ms-3" type="radio" name="UTShape"
                                                id="cuboid" value="cuboid" />
                                            <label className="ps-1" htmlFor="cuboid">📦 Cuboid</label>
                                        </div>
                                        <p className='ms-4 mt-1 mb-1 text-danger' >{errors.UTShape && touched.UTShape ? errors.UTShape : ""}</p>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label htmlFor="upperRadius1" className="form-label">{values.UTShape === 'frustum' ? "Radius 1 in cm" : "Length in cm"}</label>
                                            <input type="number" name='UTR1' className="form-control" onBlur={handleBlur} onChange={handleChange} value={values.UTR1} id="upperRadius1" />
                                            <p className='ms-4 mt-1 mb-1 text-danger' >{errors.UTR1 && touched.UTR1 ? errors.UTR1 : ""}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="upperRadius2" className="form-label">{values.UTShape === 'frustum' ? "Radius 2 in cm" : "Width in cm"}</label>
                                            <input type="number" name='UTR2' className="form-control" onBlur={handleBlur} onChange={handleChange} value={values.UTR2} id="upperRadius2" />
                                            <p className='ms-4 mt-1 mb-1 text-danger' >{errors.UTR2 && touched.UTR2 ? errors.UTR2 : ""}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                        <div className="col-md-6">
                                            <label htmlFor="upperRadius1" className="form-label fw-bold">Min Tank Fill:</label>
                                            <input type="number" name='minFill' className="form-control" onBlur={handleBlur} onChange={handleChange} value={values.minFill} id="upperRadius1" />
                                            <p className='ms-4 mt-1 mb-1 text-danger' >{errors.minFill && touched.minFill ? errors.minFill : ""}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="upperRadius2" className="form-label fw-bold">Max Tank Fill:</label>
                                            <input type="number" name='maxFill' className="form-control" onBlur={handleBlur} onChange={handleChange} value={values.maxFill} id="upperRadius2" />
                                            <p className='ms-4 mt-1 mb-1 text-danger' >{errors.maxFill && touched.maxFill ? errors.maxFill : ""}</p>
                                        </div>
                                    </div>
                            </div>
                            
                        {/* <div className="placeholder-glow d-flex flex-column mt-4 profileSection">
                            <div className='row my-2 px-3' >
                                <span className="text_bold">Max Tank Fill: </span>
                                <input type="number" className="form-control" name='maxFill' onBlur={handleBlur} onChange={handleChange}
                                    value={values.maxFill} placeholder="Max Fill" />
                            </div>
                        </div>
                        <p className='ms-4 mt-1 mb-4 text-danger' >{errors.maxFill && touched.maxFill ? errors.maxFill : ""}</p> */}

                        </div>


                        <div className="card border-left-primary shadow h-100 mt-3">
                            <div className="card-header fw-bold text-center">Upper Tank</div>
                            <div className='px-2 pb-2'>
                                <div className="placeholder-glow d-flex flex-column mt-4 profileSection">
                                    <div className='row my-2 px-3' >
                                        <span className="col-xs-11 col-sm-5 text_bold">Lower Tank Depth (in cm) : </span>
                                        <input type="number" className="form-control" name='LTDepth' onBlur={handleBlur} onChange={handleChange}
                                            value={values.LTDepth} placeholder="Lower Tank Depth" />
                                    </div>
                                </div>
                                <p className='ms-4 mt-1 mb-1 text-danger' >{errors.LTDepth && touched.LTDepth ? errors.LTDepth : ""}</p>

                                <div className="mb-3 d-flex justify-content-center">
                                    <button type="button" onClick={() => detectDepth('lower')} className="btn btn-primary ">Detect depth</button>
                                </div>


                                <div className="placeholder-glow d-flex flex-column mt-4">
                                    <div className='row my-2' >
                                        <span className="col-xs-11 col-sm-5 text_bold">Lower Tank Shape : </span>

                                        <div className="mb-1" onBlur={handleBlur} onChange={handleChange} value={values.LTShape}>
                                            <input className="" type="radio" name="LTShape"
                                                id="frustum2" value="frustum" defaultChecked />
                                            <label className="ps-1" htmlFor="frustum2"> 🪣 Frustum</label>
                                            <input className="ms-3" type="radio" name="LTShape"
                                                id="cuboid2" value="cuboid" />
                                            <label className="ps-1" htmlFor="cuboid2">📦 Cuboid</label>
                                        </div>
                                        <p className='ms-4 mt-1 mb-1 text-danger' >{errors.LTShape && touched.LTShape ? errors.LTShape : ""}</p>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <label htmlFor="lowerRadius1" className="form-label">{values.LTShape === 'frustum' ? "Radius 1 in cm" : "Length in cm"}</label>
                                                <input type="number" name='LTR1' className="form-control" onBlur={handleBlur} onChange={handleChange} value={values.LTR1} id="lowerRadius1" />
                                                <p className='ms-4 mt-1 mb-1 text-danger' >{errors.LTR1 && touched.LTR1 ? errors.LTR1 : ""}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="lowerRadius2" className="form-label">{values.LTShape === 'frustum' ? "Radius 2 in cm" : "Width in cm"}</label>
                                                <input type="number" name='LTR2' className="form-control" onBlur={handleBlur} onChange={handleChange} value={values.LTR2} id="lowerRadius2" />
                                                <p className='ms-4 mt-1 mb-1 text-danger' >{errors.LTR2 && touched.LTR2 ? errors.LTR2 : ""}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                            <button type="submit" className="btn btn-primary btn-lg mt-3">Save Changes</button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default Configure