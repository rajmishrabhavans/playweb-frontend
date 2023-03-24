import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Home.css'

import img from "../images/home1.jpg" 
import MultipleFlipCard from './MultipleFlipCard'

const Home = () => {

    return (
        <>
        <div style={{paddingTop: "80px"}}>
        <div className="hero vh-100 d-flex align-items-center" id="home">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7 mx-auto text-center">
                            <p className='h2 text-white fs-10'>Tank Automation</p>
                            <p className="fs-5 text-white my-3">Tank Automation provides equitable water supply, reliability, completely visibility into your tanks, operate automatically, flexibility and it reduces the wastage of water</p>
                            <Link to="/contact" className="btn me-2 btn-primary">Contact Us </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            <section id="team" >
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-8 mx-auto text-center">
                            <h6 className="text-primary">TEAM</h6>
                            <h1>Meet Our Team Members</h1>
                        </div>
                    </div>
                    <div className="row text-center g-4">
                        <div className="col-lg-5 card col-md-5 me-2 ms-2">
                            <div className="team-member card-effect">
                                <img src={require("../images/RajMishra.jpg")} alt="" />
                                <h5 className="mb-0 mt-4">Raj Mishra</h5>
                                <p>Programmer</p>
                                <div className="social-icons">
                                    <a href="#team"><i className="fab fa-facebook-f me-3"></i></a>
                                    <a href="#team"><i className="fab fa-linkedin me-3"></i></a>
                                    <a href="#team"><i className="fab fa-github"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5 card col-md-5 me-2 ms-2">
                            <div className="team-member card-effect">
                                <img src={require("../images/HimanshuThakur.jpg")} alt="" />
                                <h5 className="mb-0 mt-4">Himanshu Thakur</h5>
                                <p>Web Developer</p>
                                <div className="social-icons">
                                    <a href="#team"><i className="fab fa-facebook-f me-3"></i></a>
                                    <a href="#team"><i className="fab fa-linkedin me-3"></i></a>
                                    <a href="#team"><i className="fab fa-github"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="row w-100 py-0 bg-light" id="features">
                <div className="col-lg-6 col-img"></div>
                <div className="col-lg-6 py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-10 offset-md-1">
                                <h6 className="text-primary">WHY TO CHOOSE US</h6>
                                <h1>Best Solution for your society</h1>
                                <p>This Water Automation in Modern Society [WAMS]  is to observe and manage the wastage of water due to various reasons like tap leakage, pipe leakage and water tank overflow. It can be deployed in each and every building which sends the water level information to the owner of a particular building.</p>

                                <div className="feature d-flex mt-5">
                                    <div className="iconbox me-3">
                                        {/* <i className='bx bxs-comment-edit'></i> */}
                                    </div>
                                    <div>
                                        <h4>Automatic</h4>
                                        <p>Eliminating manual operations with a timer switch, the frustrations of manual monitoring water tanks are minimized. Water levels are maintained at the appropriate levels thanks to the automatic operations of these devices. </p>
                                    </div>
                                </div>
                                <div className="feature d-flex">
                                    <div className="iconbox me-3">
                                        {/* <i className='bx bxs-user-circle'></i> */}
                                    </div>
                                    <div>
                                        <h4>Control and monitor water level</h4>
                                        <p> It monitor water level and switches motor automatically when water goes above or below a certain level. </p>
                                    </div>
                                </div>
                                <div className="feature d-flex">
                                    <div className="iconbox me-3">
                                        {/* <i className='bx bxs-download'></i> */}
                                    </div>
                                    <div>
                                        <h4>Power Saver</h4>
                                        <p>Living in an age where we need to be more conscious of the energy that we use, a water level controller is ideal at saving power. Normally, regulating water levels can consume electricity and wastewater. However, with automatic controllers, the electricity usage is limited as well as less water needed to regulate supply.</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="portfolio">
                <div className="container-fluid">
                    <div className="row mb-5">
                        <div className="col-md-8 mx-auto text-center">
                            <h6 className="text-primary">ASSEST</h6>
                            <h1>Components Used</h1>
                            <p>Lorem ipsum dolor sit amet consectetur nisi necessitatibus repellat distinctio eveniet eaque fuga
                                in cumque optio consectetur harum vitae debitis sapiente praesentium aperiam aut</p>
                        </div>
                    </div>
                    <div className="row g-3">
                        <MultipleFlipCard />
                    </div>
                </div>
            </section>
            
        </>
    )
}

export default Home