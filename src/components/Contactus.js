import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import appdata, {userInfo} from './appdata';

const Contactus = () => {
    const [userData, setUserData] = useState({
        name: "your name",
        email: "example@mail.com",
        phone: "9876543210",
        message: ""
    });
    const sendMessage = async (e) => {
        e.preventDefault();
        try {
            const {name,email,phone,message}= userData;
            if(!name || !email || !phone || !message){
                alert("Please fill all the details");
                return;
            }
            const res = await fetch(appdata.baseUrl+"/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    name,email,phone,message,
                    'cookie':Cookies.get('jwtoken'),
                })
            });
            // console.log(userData.message);
            if (res.status !== 200) {
                // navigate('/login');
                throw new Error(res.error);
            }
            // const data = await res.json();
            alert("Message sent successfully");
            setUserData({...userData,message:""})
        } catch (error) {
            console.log(error);
        }
    }

    const loadContactPage = async () => {

        try {
            const res = await fetch(appdata.baseUrl+"/getdata", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    cookie:Cookies.get('jwtoken')
                })
            });

            if (res.status !== 200) {
                // navigate('/login');
                throw new Error(res.error);
            }
            const data = await res.json();
            // console.log(data);
            if(data.error || !data.name || !data.email || !data.phone){
                console.log("Unable to fetch user data");
            }else{
                Object.entries(data).forEach((e) => {if(userInfo[e[0]]!==undefined){userInfo[e[0]]= e[1]}});
                // console.log(userInfo);
                setUserData({...userData, name:data.name,email:data.email,phone:data.phone});
            }
        } catch (error) {
            console.log(error);
        }
    }
    // console.log(userData);

    useEffect(() => {
        if(!userInfo.creationdate){
            loadContactPage();
        }else{
            setUserData({...userData, name:userInfo.name,email:userInfo.email,phone:userInfo.phone});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //store message in DB
    const handleInputs =(e)=>{
        const name= e.target.name;
        const value= e.target.value;
        setUserData({...userData,[name]:value})
    }

  return (
    <>
      
    <section className="vh-100" style={{backgroundColor: '#eee'}}>
        <div className="container h-100 ">
            <div className="row d-flex justify-content-center align-items-center h-100 ">
                <div className="col-lg-12 col-xl-11">
                    <div className="card text-black register-form" style={{borderRadius: '25px'}}>
                        <div className="card-body p-md-5">
                            <div className="row justify-content-center">
                                <div className="col-md-11 col-lg-9 col-xl-7 order-2 order-lg-1">

                                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Contact us</p>

                                    <form method="POST" className="mx-1 mx-md-4">

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="text" name="name" className="form-control fw-bold"
                                                    onChange={handleInputs} value={userData.name} placeholder="Full Name" required/>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="email" name="email" className="form-control fw-bold"
                                                    onChange={handleInputs} value={userData.email} placeholder="Your Email" required/>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-mobile fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input type="number" name="phone" className="form-control fw-bold"
                                                    onChange={handleInputs} value={userData.phone} placeholder="Mobile number" required/>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-mobile fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <textarea rows='3' type="text" name="message" className="form-control"
                                                    onChange={handleInputs} value={userData.message} placeholder="Message" required/>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                            <button type="submit" onClick={sendMessage} className="btn btn-primary btn-lg">Submit</button>
                                        </div>

                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default Contactus