import Cookies from 'js-cookie';
import React, { useState,useEffect} from 'react'
import appdata, {userInfo} from './appdata';

let loadcomp= document.querySelectorAll('.glowme');
const Home = () => {
    const[userData,setUserData]= useState({
        name:"Have Fun With Web",
        info:""
    });
    const loadHomePage =async()=>{
        try {
            loadcomp.forEach((elem)=>{elem.classList.add('placeholder');})
            // console.log(Cookies.get('jwtoken'));
            const res= await fetch(appdata.baseUrl+"/getData",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json" 
                },
                body:JSON.stringify({
                    'cookie':Cookies.get('jwtoken'),
                })
            });
            if(res.status!==200){
                console.log("Cannot fetch data");
            }
            const data= await res.json();
            Object.entries(data).forEach((e) => {if(userInfo[e[0]]!==undefined){userInfo[e[0]]= e[1]}});
            // console.log(userInfo);
            setUserData({...userData,name:data.name,info:"happy to see you back"});
            if(data.error){
                console.log("cannot load data!");
            }
        } catch (error) {
            console.log(error);
        }finally{
            loadcomp.forEach((elem)=>{elem.classList.remove('placeholder');});
        }
    }
    useEffect(() => {
        loadcomp= document.querySelectorAll('.glowme');
        // console.log(userInfo.creationdate)
        if(sessionStorage.getItem('loggedin') && !userInfo.creationdate){
            loadHomePage();
        }else if(!sessionStorage.getItem('loggedin')){
            setUserData({...userData,name:"Have Fun With Web",info:""});
        }
        else{
            setUserData({...userData,name:userInfo.name,info:"happy to see you back"});
        }
    //   eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
  return (
    <>
            <div className="card-body p-md-5">
                <div className="row justify-content-center">
                    <div className="col-md-11 col-lg-9 col-xl-7 order-2 order-lg-1 ">

                        <p className="text-center ">Welcome</p>
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