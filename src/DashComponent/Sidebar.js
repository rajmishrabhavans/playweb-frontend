import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import contactImg from '../images/undraw_rocket.svg'
import myImg from '../images/logo4.png'
import { SidebarContext } from './MyDashboard';

function Sidebar() {
    const {sidebarOn,setSidebarStatus}= useContext(SidebarContext)
    const changeStyle = () => {
        const varr = document.getElementById('accordionSidebar')
        varr.classList.toggle("toggled");
        console.log(varr.classList.contains('toggled'));
        if(varr.classList.contains('toggled')){
            setSidebarStatus(false)
        }else{
            setSidebarStatus(true)
        }
    };

    useEffect(() => {
      const sidelinks= document.getElementsByClassName("sidelink")
    //   console.log(sidelinks);
      Array.from(sidelinks).forEach((elem)=>{
        elem.addEventListener('click', changeStyle)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    

    return (
        <div style={{height:'100%'}}>

                {/*  <!-- Page Wrapper --> */}
                <div id="wrapper" style={{height:'100%'}} >
                    <div className={`${sidebarOn?'sidebar-bg':''}`} onClick={changeStyle}></div>
                    {/*  <!-- Sidebar --> */}
                    <ul className="navbar-nav sidebar sidebar-dark sidebar-menu toggled" id="accordionSidebar">

                        {/*  <!-- Sidebar - Brand --> */}
                        <span className="sidebar-brand d-flex align-items-center justify-content-center">
                            <div className="sidebar-brand-icon">
                            <img src={myImg} alt="..." width={80} height={80}    />
                            </div>
                            <div className="sidebar-brand-text mx-3">Society Admin </div>
                            <div className="text-center d-none d-md-inline">
                                <button className="rounded-circle border-0" id="sidebarToggle" onClick={changeStyle}></button>
                            </div>
                        </span>

                        {/*   <!-- Divider --> */}
                        <hr className="sidebar-divider my-0" />

                        {/*  <!-- Nav Item - Dashboard --> */}
                        <li className="nav-item">
                            <Link className="nav-link sidelink" to="/">
                                <i className="fas fa-fw fa-tachometer-alt"></i>
                                <span>Dashboard</span>
                            </Link>
                        </li>

                        {/*  <!-- Divider --> */}
                        <hr className="sidebar-divider" />

                        {/*   <!-- Heading --> */}
                        <div className="sidebar-heading">
                            Data
                        </div>

                        {/*  <!-- Nav Item - Pages Collapse Menu --> */}
                        <li className="nav-item">
                            <Link className="nav-link sidelink" to='/users'>
                                <i className="fas fa-fw fa-cog"></i>
                                <span>User Details</span>
                            </Link>
                        </li>

                        {/* <!-- Nav Item - Utilities Collapse Menu --> */}
                        <li className="nav-item">
                            <Link className="nav-link sidelink" to='/supplyList'>
                                <i className="fas fa-fw fa-wrench"></i>
                                <span>Supply List</span>
                            </Link>
                        </li>

                        {/*  <!-- Divider --> */}
                        <hr className="sidebar-divider" />

                        {/* <!-- Heading --> */}
                        <div className="sidebar-heading">
                            Monitoring & Control
                        </div>

                        {/*  <!-- Nav Item - Pages Collapse Menu --> */}
                        <li className="nav-item">
                        
                            <Link className="nav-link sidelink" to="/getdata">
                                <i className="fas fa-fw fa-folder"></i>
                                <span>Manual</span>
                            </Link>
                        </li>

                        {/* <!-- Nav Item - Charts --> */}
                        <li className="nav-item">
                            <Link className="nav-link sidelink" to="/schedule">
                                <i className="fas fa-fw fa-folder"></i>
                                <span>Automatic</span>
                            </Link>
                        </li>

                        {/*  <!-- Divider --> */}
                        <hr className="sidebar-divider" />

                        {/*   <!-- Heading --> */}
                        <div className="sidebar-heading">
                            Services
                        </div>

                        {/*  <!-- Nav Item - Pages Collapse Menu --> */}
                        <li className="nav-item disabled">
                            <a className="nav-link sidelink" href=' '>
                                <i className="fas fa-fw fa-cog"></i>
                                <span>System Health</span>
                            </a>
                        </li>

                        {/* <!-- Nav Item - Utilities Collapse Menu --> */}
                        <li className="nav-item">
                            <Link className="nav-link sidelink" to='/configure'>
                                <i className="fas fa-fw fa-wrench"></i>
                                <span>Configure</span>
                            </Link>
                        </li>


                        {/* <!-- Divider --> */}
                        <hr className="sidebar-divider d-none d-md-block" />

                        {/*  <!-- Sidebar Message --> */}
                        <div className="sidebar-card d-none d-lg-flex">
                            <img className="sidebar-card-illustration mb-2" src={contactImg} alt="..." />
                            <p className="text-center mb-2">Having trouble in <br /><strong>Tank Automation</strong> <br />Please contact us</p>
                            <Link className="btn btn-success btn-sm" to="contactus">Help Center</Link>
                        </div>

                    </ul>
                    {/*  <!-- End of Sidebar --> */}
    
                </div>
                {/*  <!-- End of Page Wrapper -->

                 {/* <!-- Logout Modal--> */}
                <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                                <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                                <a className="btn btn-primary" href="login.html">Logout</a>
                            </div>
                        </div>
                    </div>
                </div>

        </div>
    )
}

export default Sidebar;
