import React, { useState, useEffect } from 'react'
import { userInfo } from '../utility/appdata';
import { loadUserData } from '../utility/user';

let loadcomp;
const Home = () => {
    const [userData, setUserData] = useState({
        name: "TANK AUTOMATION",
        info: ""
    });
    // getting data from backend to fill home page data
    const loadHomePage = async () => {

        //applying placeholders while data is being fetched from backend
        loadcomp.forEach((elem) => { elem.classList.add('placeholder'); })
        loadUserData()
            .then((data) => {
                if(data){
                    setUserData({ ...userData, name: data.name, info: "happy to see you back" });
                }
            })
            .finally(() => {
                //removing placeholders after data is fetched
                loadcomp.forEach((elem) => { elem.classList.remove('placeholder') });
            })
    }

    useEffect(() => {

        //getting all part where to apply placeholder while loading
        loadcomp = document.querySelectorAll('.glowme');

        // if user is logged in then only allow else send user to login page
        if (sessionStorage.getItem('loggedin') && !userInfo.creationdate) {
            loadHomePage();
        } else if (!sessionStorage.getItem('loggedin')) {
            setUserData({ ...userData, name: "WATER AUTOMATION", info: "" });
        }
        else {
            setUserData({ ...userData, name: userInfo.name, info: "happy to see you back" });
        }
        //   eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className="card-body p-md-5">
                <div className="row justify-content-center">
                    <div className="col-md-11 col-lg-9 col-xl-7 order-2 order-lg-1 ">

                        <p className="text-center ">Welcome {!sessionStorage.getItem('loggedin') ? "to" : ""}</p>
                        <div className="placeholder-glow d-flex justify-content-center flex-column">
                            <p className="glowme text-center h1 fw-bold mt-3 mb-2 align-self-center col-11">{userData.name}</p>
                            <p className="glowme text-center align-self-center col-5">{userData.info}</p>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default Home