import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AdminContext } from './MyDashboard';

let about = document.getElementById('aboutProfile');
let otherinfo = document.getElementById('otherInfo');

const Profile = () => {
    const navigate = useNavigate();
    const {adminData} = useContext(AdminContext)
    const [selectedPart, setSelectedPart] = useState('about');

    //change the content when tabs are clicked
    const changeContent = (changeTo) => {

        setSelectedPart(changeTo);
        if (changeTo === 'about') {
            otherinfo.classList.remove('active')
            about.classList.add('active');
        } else if (changeTo === 'otherinfo') {
            about.classList.remove('active')
            otherinfo.classList.add('active');
        }
    }
    useEffect(() => {
        // if user is logged in then only allow else send user to login page
        if (!localStorage.getItem('loggedin')) {
            navigate('/login');
        }
        //getting components after the page is loaded
        about = document.getElementById('aboutProfile');
        otherinfo = document.getElementById('otherInfo');
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // display profile section
    const ProfileSection = () => {
        return (
            <>
                <div className="placeholder-glow d-flex flex-column mt-4 profileSection">

                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">UserId : </span>
                        <span className="glowme col-xs-11 col-sm-7">{adminData._id}</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Name : </span>
                        <span className="glowme col-xs-11 col-sm-7">{adminData.name}</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Gender : </span>
                        <span className="glowme col-xs-11 col-sm-7">{adminData.gender}</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Email : </span>
                        <span className="glowme col-xs-11 col-sm-7">{adminData.email}</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Phone : </span>
                        <span className="glowme col-xs-11 col-sm-7">{adminData.phone}</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Date of creation : </span>
                        <span className="glowme col-xs-11 col-sm-7">{adminData.creationdate}</span>
                    </div>
                </div>

            </>
        )
    }

    //display otherinfo section
    const OtherInfo = () => {
        return (
            <>
                <div className="d-flex flex-column mt-4" id="otherInfo" >
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Role : </span>
                        <span className="col-xs-11 col-sm-7">Society Admin</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Society no. : </span>
                        <span className="col-xs-11 col-sm-7">2</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Tank capacity : </span>
                        <span className="col-xs-11 col-sm-7">400L</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">No of wing : </span>
                        <span className="col-xs-11 col-sm-7">2</span>
                    </div>
                </div>

            </>
        )
    }

    return (
        <>
            <h2 className="text-center text-dark mb-3">Profile</h2>
            <div className="card p-md-4 m-2">

                <form method="get">
                    <div className="row justify-content-center mb-4">
                        <div className="col-sm-10 col-lg-4 order-1 d-flex ">
                            <div className="flex-fill p-lg-2 ps-2" style={{ width: '18rem' }}>
                                
                                <div className='d-flex justify-content-center placeholder-glow'>
                                    <label id='profileLabel' htmlFor="photo-upload" className="custom-file-upload fas m-2" style={{pointerEvents:'none'}}>
                                    <div className="img-wrap img-upload" >
                                        <img id="profileImg" className='img-fluid glowme' htmlFor="photo-upload" alt='' src={adminData.profilePic}/>
                                    </div>
                                    </label>
                                </div>
                                <div className="p-0 w-100">
                                    <h5 className="card-title">{(adminData.societyName).toUpperCase()}</h5>
                                    <p className="card-text mb-3">{(adminData.societyLocation).toUpperCase()}</p>
                                </div>
                                <ul className="list-group list-group-flush" style={{ zIndex: "1" }}>
                                    <li className="list-group-item">Room number</li>
                                    <li className="list-group-item">tank capacity</li>
                                    <li className="list-group-item">other info</li>
                                </ul>
                                {/* <div className="card-body">
                                    <a href="/profile" className="card-link">Card link</a>
                                    <a href="/profile" className="card-link">Another link</a>
                                </div> */}
                            </div>
                        </div>
                        <div className="col-sm-10 col-md-10 col-lg-8 d-flex flex-column order-2 mt-4" >
                            <div className="col-lg-4 col-xl-3 order-1 d-flex mw-100 justify-content-between" style={{width:'100%'}}>
                                <div className='placeholder-glow' >
                                    <h2 className='glowme text_bold'>{adminData.name}</h2>
                                    <div className="w-100"></div>
                                    <h5 className='glowme text-primary'>Society Admin</h5>
                                </div>
                                <div>
                                    <button type="button" onClick={()=>navigate('/editAdmin')} className="btn btn-light">Edit Profile</button>
                                </div>
                            </div>

                            <div className="col-lg-8 col-xl-9 mw-100 d-flex order-2 mt-4">
                                <div className="d-flex flex-column flex-fill">
                                    <ul className="nav nav-tabs">
                                        <li className="nav-item">
                                            <span className="nav-link active" onClick={() => { changeContent('about') }} id='aboutProfile'>Profile</span>
                                        </li>
                                        <li className="nav-item">
                                            <span className="nav-link" onClick={() => { changeContent('otherinfo') }} id='otherInfo'>Other info</span>
                                        </li>
                                    </ul>
                                    {selectedPart === 'about' ? <ProfileSection adminData={adminData} /> : <OtherInfo />}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        </>
    )
}

export default Profile
