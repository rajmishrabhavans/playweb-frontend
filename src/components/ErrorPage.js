import React from 'react'
import errorImg from '../images/404.webp'

const ErrorPage = () => {
  return (
    <>
        
    <div className="container-fluid main_content">
        <div className="row">
            <div className="col-md-10 col-12 mx-auto">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-12 main_header_left align-items-center">
                        <figure>
                            <img src={errorImg} alt="avatar" className="img-fluid" title="myAvatar"/>
                        </figure>
                        <p>some error occoured</p>
                        <h1>Oops! Page not found</h1>
                        <a href="/"><button> Go back</button></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default ErrorPage