import React from 'react'
import errorImg from '../images/403.png'

const Access = () => {
  return (
    <div className="container-fluid main_content">
        <div className="row">
            <div className="col-md-10 col-12 mx-auto">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-12 main_header_left align-items-center">
                        <figure>
                            <img src={errorImg} alt="avatar" className="img-fluid mt-5" title="myAvatar"/>
                        </figure>
                        <div className='text-center'>
                        <h1 className='display-3 font-weight-bold' style={{color: "#9cd02d"}}>Access Forbidden</h1>
                        <h5 className='text-dark'>You tried to access a page you didn't have prior authorization for. Please contact our team for verification</h5>
                        <a href="/"><button className='btn mt-3 text-white' style={{backgroundColor: "#9cd02d"}}> Go back to home</button></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Access
