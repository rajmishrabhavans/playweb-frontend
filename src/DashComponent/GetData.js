import '../App.css'
import React, { useContext, useEffect, useRef, useState } from 'react'
// import { fetchInfo } from '../utility/appdata';
import { toggleCheckbox, loadSensorData, getSupplyList } from '../utility/espFucntion';
import { useNavigate } from 'react-router-dom';
import { EspContext, LiveDataContext, UsersContext } from './MyDashboard';
import { showSimpleAlert } from '../components/AlertMsg';
import { updateHomeData } from '../utility/espFucntion';

const GetData = () => {
    const { espData, setEspData } = useContext(EspContext);
    const { liveData } = useContext(LiveDataContext);
    const { usersdata, setUserdata } = useContext(UsersContext)
    const [loading, setLoading] = useState(false)
    const [searchPattern, setSearchPattern] = useState("")
    // console.log(espData);
    const navigate = useNavigate();

    function usePrevious(value) {
      const ref = useRef();
      useEffect(() => {
        ref.current = value; //assign the value of ref to the argument
      }, [value]); //this code will run when the value of 'value' changes
      return ref; //in the end, return the current ref value.
    }
    const prevData = usePrevious(espData.index);

    const loadSupplyList = async () => {
        console.log(usersdata);
        if (usersdata.length > 0) return;
        setLoading(true)
        const slist = await getSupplyList()
            .finally(() => {
                setLoading(false)
            })
        console.log(slist);
        if (slist) {
            setUserdata(slist);
        }

    }

    // fetch sensor data from backend and update it
    // if multiple request are failed then stop api request
    useEffect(() => {
        if (localStorage.getItem('loggedin')) {
            console.log("started interval ");
            loadSupplyList()
            loadSensorData(setEspData);

        } else {
            navigate('/login')
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //turn on and off home tank
    const toggleHomeTank = (element, room) => {
        const isChecked = element.target.checked;
        if (isChecked)
            updateHomeData({ roomNo: room, supplyOn: true });
        else
            updateHomeData({ roomNo: room, supplyOn: false });

    }

    const toggleMotor = (e)=>{
      toggleCheckbox(e, espData, setEspData)
      let repeatData= 0,count=0;
      const checkMotorStatus = setInterval(() => {
        count++;
        loadSensorData(setEspData).then((sent) => {
          // console.log(fetchInfo.fetchTry,fetchInfo.interval,sent);
          if (sent.index === prevData.current) {
            repeatData++;
            if (repeatData >= 3 || count>20) {
                console.log("Repeat: "+repeatData+",Count: "+count);
              clearInterval(checkMotorStatus);
            }
          } else {
            repeatData = 0;
            if(e.target.checked===false && sent.motorOn===false){
                clearInterval(checkMotorStatus);
            }
          }
          count++;
          console.log(e.target.checked,sent.motorOn);
        })
      }, 2000);
    }

    const checkPattern=(user) =>{
        const pattern= new RegExp(searchPattern);
        // console.log(searchPattern,pattern,user.name,pattern.test(user.name));
        return(
            searchPattern?
            pattern.test(user.name) || pattern.test(user.room)
            :true
        )
    }

    const CurrRow = (props) => {
        return (
            <tr key={props.ID}>
                <td className="text-center text-muted">{props.ID}</td>
                <td>
                    <div className="widget-heading">{props.Name}</div>
                </td>
                <td className="text-center">{props.Wing}-{props.Room}</td>
                <td className="text-center">
                    <div className={`badge bg-${props.Color}`}>{props.Status}</div>
                </td>
                <td className="text-center">
                    <div className="col-auto me-3">
                        <div className="container form-check form-switch form-check-reverse content-align-center mr-4">
                            <input className="ms-2 form-check-input" name="buildLed" onChange={(e) => { liveData ? toggleHomeTank(e, props.Room) : showSimpleAlert("Esp is Disconnected", "red") }}
                                 type="checkbox" role="switch" id="buildLed" style={{ transform: "scale(1.8)" }} readOnly />
                        </div>
                    </div>
                </td>
            </tr>
        )
    }

    return (
        <>

            <h2 className="text-center text-dark mb-3">Water Monitoring & control</h2>
            <div id="row text-center">
                <div className='m-4 mx-auto d-flex flex-column pe-2 w-80 col-lg-12 col-xl-10'>

                    <p className='text-center text-warning'>{!liveData ? "This may be some old data" : ""}</p>

                    <div className='row'>
                        <div className="col-lg-6 mb-4">
                            <div className="card border-left-primary shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            {/* <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Last Filled</div> */}
                                            <div className="h4 mb-0 font-weight-bold text-gray-800">Buildin LED: </div>
                                        </div>
                                        <div className="col-auto me-3">
                                            <div className="container form-check form-switch form-check-reverse content-align-center mr-4">
                                                <input className="ms-2 form-check-input" name="buildLed" onClick={(e) => { liveData ? toggleCheckbox(e, espData, setEspData) : showSimpleAlert("Esp is Disconnected", "red") }}
                                                    checked={espData.buildLed} type="checkbox" role="switch" id="buildLed" style={{ transform: "scale(2.4)" }} readOnly />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="col-lg-6 mb-4">
                            <div className="card border-left-primary shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            {/* <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Last Filled</div> */}
                                            <div className="h4 mb-0 font-weight-bold text-gray-800">Motor: </div>
                                        </div>
                                        <div className="col-auto me-3">
                                            <div className="container form-check form-switch form-check-reverse content-align-center mr-4">
                                                <input className="ms-2 form-check-input" name="motorOn" onClick={(e) => { liveData ? toggleMotor(e) : showSimpleAlert("Esp is Disconnected", "red") }}
                                                    checked={espData.motorOn} type="checkbox" role="switch" id="motorSwitch" style={{ transform: "scale(2.4)" }} readOnly />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div className="input-group mb-3">
                    <input type="search" className="form-control" placeholder="Search" value={searchPattern} onChange={(e)=>setSearchPattern(e.target.value)}/>
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
                    </div>

                    <div className="main-card my-3 card">
                        <div className="card-header">User List
                            <div className="btn-actions-pane-right">
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="align-middle mb-0 table table-borderless table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th className="text-center">ID</th>
                                        <th>Name</th>
                                        <th className="text-center">Flat</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-center">Supply Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersdata && !loading ? usersdata.filter((curr) => { return curr.status === "active" && checkPattern(curr) }).map((item, id) => {
                                        return (
                                            <CurrRow key={id}
                                                ID={id + 1}
                                                Name={item.name}
                                                Room={item.room}
                                                Wing={item.wing}
                                                Status={(item.status)}
                                                Color={item.status === "active" ? "success" : "info"}
                                            />

                                        )
                                    }) :
                                        [0, 1].map((item, id) => {
                                            return (
                                                <tr key={id}><td colSpan={5}>
                                                    <div className="text-center">
                                                        <div className="spinner-border" role="status">
                                                            <span className=""></span>
                                                        </div>
                                                    </div>
                                                </td></tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default GetData