import React from 'react'


export const showAlert = (alertbox,alertmsg,message) => {
  alertbox.classList.remove('d-none');
  alertmsg.innerText = message;
}
export const closeAlert = () => {
  let alertbox= document.getElementById('alertmsg');
  alertbox.classList.add('d-none');
}

const AlertMsg = () => {
  return (
    <>
        <div id='alertbox' className="d-flex justify-content-center rounded-4 bg-secondary bg-opacity-25 position-absolute w-100 h-100 d-none" style={{zIndex:1}}>
        <div className="position-absolute top-50 start-80" style={{width: '18rem', height: '3rem',zIndex:1}} role="status">
        <div className="card border-secondary" style={{width: '18rem'}}>
        <div className="card-body text-center">
          <h5 className="card-title pb-2 text-secondary" id="alertmsg">Message Sent</h5>
          <button className="btn btn-secondary" onClick={closeAlert} id= "alertbtn">Close</button>
        </div>
      </div>
        </div>
        </div>
    </>
  )
}

export default AlertMsg