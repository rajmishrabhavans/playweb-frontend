import React from 'react'

const Spinner = () => {
  return (
    <>
        <div id='play-spinner' className="d-flex justify-content-center rounded-4 bg-secondary bg-opacity-25 position-absolute w-100 h-100 d-none">
        <div className="spinner-grow position-absolute top-50 start-80 bg-primary" style={{width: '3rem', height: '3rem',zIndex:1}} role="status">
        <span className="visually-hidden">Loading...</span>
        </div>
        </div>
        
    </>
  )
}
export default Spinner;
