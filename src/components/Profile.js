import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import appdata, {userInfo} from './appdata';
const imgPath = require('../images/avatar3.png');

let about = document.getElementById('aboutProfile');
let timeline = document.getElementById('temelineProfile');
let loadcomp= document.querySelectorAll('.glowme');

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(userInfo);
    const [selectedPart, setSelectedPart] = useState('about');

    const loadProfilePage = async () => {

        try {
            loadcomp.forEach((elem)=>{elem.classList.add('placeholder');})
            const res = await fetch(appdata.baseUrl+"/getdata", {
                method: "POST",
                headers: {
                    //send cookies
                    cookie:Cookies.get('jwtoken'),
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    cookie:Cookies.get('jwtoken')
                })
            });
            // console.log(res);
            if (res.status !== 200) {
                navigate('/login');
                throw new Error(res.error);
            }
            const data = await res.json();
            // console.log(data);
            Object.entries(data).forEach((e) => {if(userInfo[e[0]]!==undefined){userInfo[e[0]]= e[1]}});
            // console.log(userInfo);
            setUserData(data);
        } catch (error) {
            console.log(error);
        }finally{
            loadcomp.forEach((elem)=>{elem.classList.remove('placeholder');})
        }
    }

    const changeContent = (changeTo) => {
        console.log("some", changeTo);
        // console.log("UserData: ", userData.name);
        setSelectedPart(changeTo);
        if (changeTo === 'about') {
            timeline.classList.remove('active')
            about.classList.add('active');
        } else if (changeTo === 'timeline') {
            about.classList.remove('active')
            timeline.classList.add('active');
        }
    }
    useEffect(() => {
        about = document.getElementById('aboutProfile');
        timeline = document.getElementById('timelineProfile');
        loadcomp= document.querySelectorAll('.glowme');
        if(!userInfo.creationdate){
            loadProfilePage();
        }else{
            setUserData(userInfo);
        }
        // console.log('about: ',about,'timeline ',timeline);
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

    //display timeline section
    const TimelineSection = () => {
        return (
            <>
                <div className="d-flex flex-column mt-4" id="timelineSection" >
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Experience : </span>
                        <span className="col-xs-11 col-sm-7">Intermediate</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Title1 : </span>
                        <span className="col-xs-11 col-sm-7">Description1</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Title2 : </span>
                        <span className="col-xs-11 col-sm-7">Description2</span>
                    </div>
                    <div className='row my-2' >
                        <span className="col-xs-11 col-sm-5 text_bold">Title3 : </span>
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
                                    <h5 className="card-title">Some title</h5>
                                    <p className="card-text">Some Description</p>
                                </div>
                                <ul className="list-group list-group-flush" style={{zIndex:"0"}}>
                                    <li className="list-group-item">An item</li>
                                    <li className="list-group-item">A second item</li>
                                    <li className="list-group-item">A third item</li>
                                </ul>
                                <div className="card-body">
                                    <a href="/profile" className="card-link">Card link</a>
                                    <a href="/profile" className="card-link">Another link</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-10 col-md-8 d-flex flex-column order-2 mt-4" >
                            <div className="col-md-10 col-lg-4 col-xl-3 order-1 d-flex w-100 justify-content-between">
                                <div className='placeholder-glow' >
                                    <div className='glowme text_bold'>{userData.name}</div>
                                    <div className="w-100"></div>
                                    <div className='glowme text-primary'>Work Profession</div>
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
                                            <span className="nav-link" onClick={() => { changeContent('timeline') }} id='timelineProfile'>Timeline</span>
                                        </li>
                                    </ul>
                                    {selectedPart === 'about' ? <ProfileSection userData={userData} /> : <TimelineSection />}
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