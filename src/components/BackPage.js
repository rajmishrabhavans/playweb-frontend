import React from 'react'
// import Spinner from './Spinner';

const BackPage = ({Element}) => {
  return (
    
    <section className="vh-100" style={{backgroundColor: '#eee'}}>
        <div className="container h-100 ">
            <div className="row d-flex justify-content-center align-items-center h-100 ">
                <div className="col-lg-12 col-xl-11">
                    <div className="card text-black register-form" style={{borderRadius: '18px'}}>
                        
                        {/* <Spinner/> */}
                        <Element/>

                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default BackPage