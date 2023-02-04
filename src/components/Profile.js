import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { userInfo } from '../utility/appdata';
import { loadUserData } from '../utility/user';
const imgPath = require('../images/avatar3.png');

let about = document.getElementById('aboutProfile');
let otherinfo = document.getElementById('otherInfo');
let loadcomp = document.querySelectorAll('.glowme');

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(userInfo);
    const [selectedPart, setSelectedPart] = useState('about');

    // getting data from backend to fill profile page data
    const loadProfilePage = async () => {

        //applying placeholders while data is being fetched from backend
        loadcomp.forEach((elem) => { elem.classList.add('placeholder'); })
        loadUserData()
            .then((data) => {
                if(data)
                setUserData(data);
            })
            .finally(() => {
                loadcomp.forEach((elem) => { elem.classList.remove('placeholder') });
            })
    }

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
        if (!sessionStorage.getItem('loggedin')) {
            navigate('/login');
        }
        //getting components after the page is loaded
        about = document.getElementById('aboutProfile');
        otherinfo = document.getElementById('otherInfo');
        loadcomp = document.querySelectorAll('.glowme');
        if (!userInfo.creationdate) {
            loadProfilePage();
        } else {
            setUserData(userInfo);
        }
        // console.log('about: ',about,'otherinfo ',otherinfo);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // display profile section
    const ProfileSection = () => {
        return (
            <>
                <div className="placeholder-glow d-flex flex-column mt-4 profileSection">

                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">UserId : </span>
                        <span className="glowme col-xs-11 col-sm-7">{userData._id}</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Name : </span>
                        <span className="glowme col-xs-11 col-sm-7">{userData.name}</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Gender : </span>
                        <span className="glowme col-xs-11 col-sm-7">{userData.gender}</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Email : </span>
                        <span className="glowme col-xs-11 col-sm-7">{userData.email}</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Phone : </span>
                        <span className="glowme col-xs-11 col-sm-7">{userData.phone}</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Date of creation : </span>
                        <span className="glowme col-xs-11 col-sm-7">{userData.creationdate}</span>
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
                        <span className="col-xs-11 col-sm-5 text_bold">Room no. : </span>
                        <span className="col-xs-11 col-sm-7">105</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Tank capacity : </span>
                        <span className="col-xs-11 col-sm-7">400L</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Other : </span>
                        <span className="col-xs-11 col-sm-7">Description3</span>
                    </div>
                </div>

            </>
        )
    }

    return (
        <>
            <div className="card-body p-md-5">
                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4 ">Profile</p>

                <form method="get">
                    <div className="row justify-content-center mb-4">
                        <div className="col-sm-10 col-md-4 order-1 d-flex ">
                            <div className="flex-fill p-lg-2" style={{ width: '18rem' }}>
                                <img src={imgPath} width="200px"
                                    className="img-fluid mb-2 profile_img" alt="login_img" />
                                <div className="p-0 w-100">
                                    <h5 className="card-title">Society Name</h5>
                                    <p className="card-text">Location of society</p>
                                </div>
                                <ul className="list-group list-group-flush" style={{ zIndex: "0" }}>
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
                        <div className="col-sm-10 col-md-8 d-flex flex-column order-2 mt-4" >
                            <div className="col-md-10 col-lg-4 col-xl-3 order-1 d-flex w-100 justify-content-between">
                                <div className='placeholder-glow' >
                                    <div className='glowme text_bold'>{userData.name}</div>
                                    <div className="w-100"></div>
                                    <div className='glowme text-primary'>Society Admin</div>
                                    <div className="w-100"></div>
                                    <div className='glowme text-secondry'>Other info</div>
                                </div>
                                <div>
                                    <button type="button" className="btn btn-light">Edit Profile</button>
                                </div>
                            </div>

                            <div className="col-md-10 col-lg-8 col-xl-9 w-100 d-flex order-2 mt-4">
                                <div className="d-flex flex-column flex-fill">
                                    <ul className="nav nav-tabs">
                                        <li className="nav-item">
                                            <span className="nav-link active" onClick={() => { changeContent('about') }} id='aboutProfile'>Profile</span>
                                        </li>
                                        <li className="nav-item">
                                            <span className="nav-link" onClick={() => { changeContent('otherinfo') }} id='otherInfo'>Other info</span>
                                        </li>
                                    </ul>
                                    {selectedPart === 'about' ? <ProfileSection userData={userData} /> : <OtherInfo />}
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