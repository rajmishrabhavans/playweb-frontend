import React from 'react'
import errorImg from '../images/500.png'

const InternalServerError = () => {
  return (
    <div className="container-fluid main_content">
        <div className="row">
            <div className="col-md-10 col-12 mx-auto">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-12 main_header_left align-items-center">
                        <figure>
                            <img src={errorImg} alt="avatar" className="img-fluid mt-5" title="myAvatar"/>
                        </figure>
                        <div className='text-center text-bold'>
                        <h1 className='font-weight-bold' style={{color: "#9cd02d"}}>Internal Server Error</h1>
                        <div className='text-dark'>
                        <h4>We're experiencing an internal server problem.</h4>
                        <h4>Please try again later</h4>
                        </div>
                        <a href="/"><button className='btn mt-3 text-white' style={{backgroundColor: "#9cd02d"}}> Go back to home</button></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default InternalServerError
