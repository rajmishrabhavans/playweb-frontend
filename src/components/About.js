import React from 'react'

const imgPath = require('../images/avatar1.png');

// About us tab
const About = () => {
  return (
    <>
        <div className="card-body p-md-5">
            <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4 ">About us</p>

            <div className="row justify-content-center mb-4">
                
                <div className="col-md-10 col-lg-4 col-xl-3 order-1 d-flex justify-content-center">
                    <img src= {imgPath} width= "200px"
                        className="img-fluid" alt="login_img"/>
                </div>

                <div className="col-md-10 col-lg-8 col-xl-9 d-flex order-2">
                        <div className="d-flex flex-column flex-fill">
                            <h2 className="fw-bold col-xs-11 align-self-center align-self-lg-start my-1">Person1</h2>
                            <p className='col-11 col-lg-10 align-self-center align-self-lg-start text-center text-lg-start my-1'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae et provident id voluptate corrupti aliquid voluptatum illum earum quam, placeat amet dignissimos asperiores eveniet sed. Excepturi neque assumenda quis minima.</p>
                        </div>
                </div>
                
            </div>
            
            <div className="row justify-content-center mb-4">
                
                <div className="col-md-10 col-lg-4 col-xl-3 order-1 d-flex justify-content-center">
                    <img src= {imgPath} width= "200px"
                        className="img-fluid" alt="login_img"/>
                </div>

                <div className="col-md-10 col-lg-8 col-xl-9 d-flex order-2">
                        <div className="d-flex flex-column flex-fill">
                            <h2 className="fw-bold col-xs-11 align-self-center align-self-lg-start my-1">Person2</h2>
                            <p className='col-11 col-lg-10 align-self-center align-self-lg-start text-center text-lg-start my-1'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae et provident id voluptate corrupti aliquid voluptatum illum earum quam, placeat amet dignissimos asperiores eveniet sed. Excepturi neque assumenda quis minima.</p>
                        </div>
                </div>
                
            </div>
        </div>

    </>
  )
}

export default About