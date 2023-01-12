import React from 'react'

let spinner;
export const loadSpinner = () =>{
  spinner= document.getElementById('play-spinner');
}
export const startSpinner = () =>{
  spinner.classList.remove('d-none');
}
export const stopSpinner = () =>{
  spinner.classList.add('d-none');
}
const Spinner = () => {
  return (
    <>
        <div id='play-spinner' className="d-flex justify-content-center rounded-4 bg-secondary bg-opacity-25 position-absolute w-100 h-100 d-none" style={{zIndex:1}}>
        <div className="spinner-grow position-absolute top-50 start-80 bg-primary" style={{width: '3rem', height: '3rem'}} role="status">
        <span className="visually-hidden">Loading...</span>
        </div>
        </div>
        
    </>
  )
}
export default Spinner;
