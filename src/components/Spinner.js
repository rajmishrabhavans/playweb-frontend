import React from 'react'
// import myImg from '../images/logo4.png'

let spinner;
export const loadSpinner = () =>{
  spinner= document.getElementById('play-spinner');
}
export const startSpinner = () =>{
  console.trace("Spinner")
  spinner.classList.remove('d-none');
}
export const stopSpinner = () =>{
  spinner.classList.add('d-none');
}
const Spinner = () => {
  return (
    <>
        <div id='play-spinner' className=" bg-secondary position-fixed w-100 h-100 d-none" style={{zIndex:1}}>
        <div className="d-flex justify-content-center">
        <div className="spinner-grow position-absolute top-50 start-80" style={{width: '3rem', height: '3rem',background:'#00f'}} role="status">
          {/* <img src={myImg} alt=""></img> */}
        </div>
        <span className="visually-hidden">Loading...</span>
        </div>
        </div>
        
    </>
  )
}
export default Spinner;
