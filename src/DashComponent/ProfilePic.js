import React from 'react'
import { adminInfo } from '../utility/appdata';

const Profile2 = ({editMode,profileImg,setProfileImg}) => {

  const photoUpload = (e) =>{
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      setProfileImg({...profileImg,file: file,
        imagePreviewUrl: reader.result});
        adminInfo.profilePic= reader.result
        // console.log(reader.result);
    }
    reader.readAsDataURL(file);
  }
    
  return (
    <div className='d-flex justify-content-center'>
        <label id='profileLabel' htmlFor="photo-upload" className="custom-file-upload fas m-2" style={{pointerEvents:editMode?'auto':'none'}}>
          <div className="img-wrap img-upload" >
            <img id="profileImg" className='img-fluid' htmlFor="photo-upload" alt='' src={profileImg.imagePreviewUrl}/>
          </div>
          <input id="photo-upload" type="file" onChange={photoUpload}/> 
        </label>
    </div>
  )
}

export default Profile2