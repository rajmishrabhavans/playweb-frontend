import React from 'react'
import errorImg from '../images/404.png'

const ErrorPage = () => {
  return (
    <>
        
    <div className="container-fluid main_content mb-4">
        <div className="row">
            <div className="col-md-10 col-12 mx-auto">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-12 main_header_left align-items-center">
                        <figure>
                            <img src={errorImg} alt="avatar" className="img-fluid mt-5" title="myAvatar"/>
                        </figure>
                        <div className='text-center'>
                        <h1 className='font-weight-bold' style={{color: "#9cd02d"}}>You Missed</h1>
                        <h4 className='text-dark'>The page you are looking for doesn't exist</h4>
                        <a href="/"><button className='btn mt-3 text-white' style={{backgroundColor: "#9cd02d"}}> Go back to home</button></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default ErrorPage