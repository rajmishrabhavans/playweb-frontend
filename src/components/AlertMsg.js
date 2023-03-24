import React from 'react'

let modalbtn,modalalertmsg,simplealertmsg,modalMsgBtn,modalBtnMethod,closeModalBtn;
// loads the alerts before using modal and simple alerts
export const loadAlerts=()=>{
  modalbtn = document.getElementById('showModal');
  modalMsgBtn = document.getElementById('modalMsgBtn');
  modalalertmsg= document.getElementById('modalalertmsg');
  simplealertmsg= document.getElementById('simplealertmsg');
  closeModalBtn= document.getElementById('closeModalBtn');
}

const convertColor = (color) =>{
  switch(color){
    case 'red': return 'danger';
    case 'blue': return 'primary';
    case 'yellow': return 'warning';
    case 'green': return 'success';
    case 'lightblue': return 'info';
    case 'black': return 'dark';
    case 'grey': return 'secondary';
    default: return color;
  }
}

// shows simple allert message at the top
export const showSimpleAlert=(msg,bgcolor= 'success')=>{
  if (!simplealertmsg) return;
  const lightbg = ['warning','light','white','info'];
  const availableColors = ['warning','light','white','info','danger','primary','success','dark','secondary']
  const extraColor = ['red','blue','green','black','grey','yellow','lightblue']

  if(extraColor.includes(bgcolor)){
    bgcolor= convertColor(bgcolor);
  }else if(!availableColors.includes(bgcolor)){
    bgcolor= 'success';
  }

  if(lightbg.includes(bgcolor)){
    simplealertmsg.classList.add('text-dark');
  }else{
    simplealertmsg.classList.add('text-white');
  }
  const msgBgColor = 'bg-'+bgcolor;
  simplealertmsg.innerText = msg;
  simplealertmsg.classList.remove('d-none');
  simplealertmsg.classList.add(msgBgColor);
  setTimeout(() => {
      simplealertmsg.classList.add('d-none');
      simplealertmsg.classList.remove(msgBgColor);
      simplealertmsg.classList.remove('text-dark');
      simplealertmsg.classList.remove('text-white');
  }, 5000);
}

export const showModalAlert=(msg,buttonMsg= undefined,btnColor='success')=>{
  if(!modalalertmsg || !modalbtn || !modalMsgBtn) return;
  if(btnColor){
    btnColor= 'btn-'+convertColor(btnColor);
    modalMsgBtn.classList.add(btnColor);
  }
  if(buttonMsg){
    modalMsgBtn.classList.remove('d-none');
    modalMsgBtn.innerText = buttonMsg;
  }else{
    modalMsgBtn.classList.add('d-none');
    modalMsgBtn.innerText = 'Confirm';
    modalMsgBtn.classList.remove(btnColor);
  }
  modalalertmsg.innerText = msg;
  modalbtn.click();
}

export const setModalBtnClick = (btnMethod)=>{
  if(!modalMsgBtn){
    console.log("ModalAlert button not loaded");
    return;
  }
  modalBtnMethod = btnMethod;
}

const onModalBtnClick = ()=>{
  // console.log('Modal btn clicked',modalBtnMethod);
  closeModalBtn.click();
  if(!modalBtnMethod){
    console.log("ModalAlert method not loaded");
    return;
  }
  modalBtnMethod();
}


const AlertMsg = () => {
  return (
    <>
      <button type="button" id='showModal' data-bs-toggle="modal" data-bs-target="#modalalert" className="d-none"></button>

      <div className='d-flex justify-content-center'>
      <div id='simplealertmsg' className="alert alert-success position-fixed top-20 d-none" style={{zIndex:10}} role="alert">
        A simple alert
      </div>
      </div>

      <div className="modal fade" id="modalalert" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="modalalertmsg">Modal title</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-footer">
              <button type="button" id='closeModalBtn' className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" id='modalMsgBtn' onClick={onModalBtnClick} className="btn btn-success d-none">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AlertMsg