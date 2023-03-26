import React from 'react'

// const imgPath = require('../images/avatar1.png');

// About us tab
const About = () => {
    return (
        <>

            <div className="container mt-4">
      <div className="row" style={{paddingTop:"90px"}}>
        <div className="col-md-6">
            
          <h2 className='me-2 text-center pb-2'>About Us</h2>
          <p className='text-bold'>This project focuses primarily on optimizing water use. As water wastage has now become a major and global problem, water conservation has now become more important. One of the common sources of waste we encounter is water overflow. This project aims to help assess the water level inside the water tank and display it accordingly on the screen while preventing any water overflow which is achieved through the ESP-32. The ultrasonic sensors used helps determine the water level in the tank which is then sent to the ESP-32 Processor, and then it sends notifications to the user through the app. According to the level of water inside the tank, the ESP-32 helps to turn ON or OFF the motor hence closing the source of water. When it is at the lowest level; a motor is activated automatically to refill the tank. When the tank is filled to its maximum capacity, the motor is automatically de-energized. In this way, through the automation of water control, we intend to save energy and our natural resources. All things are connected through an Android app that makes the whole process much more efficient and easier to manage.</p>
        </div>
        <div className="col-md-6">
          <img src={require("../images/Team-Work.jpg")} alt="Company Logo" className="img-fluid" />
        </div>
      </div>

        
        <div className="container py-5">
      <div className="row">
        <div className="col-lg-12 text-center mb-5">
          <h2>Meet Our Team</h2>
        </div>
      </div>
      <div className="row col d-flex justify-content-center" id='aboutraj'>
      <div className="col-lg-4 col-sm-6 ms-2">
          <div className="card mb-4">
            <img src={require("../images/RajMishra.jpg")} alt="Team Member" className="card-img-top" />
            <div className="card-body">
              <h3 className="card-title">Raj Mishra</h3>
              <p className="card-text">Co-Founder</p>
              <div className="text-center">
                <a href="#aboutraj" className="social-icon">
                  <i className="fab fa-facebook-f me-4"></i>
                </a>
                <a href="#aboutraj" className="social-icon">
                  <i className="fab fa-linkedin me-4"></i>
                </a>
                <a href="#aboutraj" className="social-icon me-5">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

      <div className="col-lg-4 col-sm-6 ms-2" id='abouthimanshu'>
          <div className="card">
            <img src={require("../images/HimanshuThakur.jpg")} alt="Team Member" className="card-img-top" />
            <div className="card-body">
              <h3 className="card-title">Himanshu Thakur</h3>
              <p className="card-text">Co-Founder</p>
              <div className="text-center">
                <a href="#abouthimanshu" className="social-icon">
                  <i className="fab fa-facebook-f me-4"></i>
                </a>
                <a href="#abouthimanshu" className="social-icon">
                  <i className="fab fa-linkedin me-4"></i>
                </a>
                <a href="#abouthimanshu" className="social-icon me-5">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
        </div>
        </>
    )
}

export default About