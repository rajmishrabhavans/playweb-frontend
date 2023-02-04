import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import Sortable from 'sortablejs';
import { ReactSortable } from "react-sortablejs";
import { getSupplyList, saveSupplyList } from '../utility/espFucntion';

// addor remove list items
const SupplyList = () => {
  const [supplyList, setSupplyList] = useState([
    { room: 1, name: 'Room1', supplyOn: false },
    { room: 2, name: 'Room2', supplyOn: false },
  ]);
  const [seed, setSeed] = useState(1);
  const reset = () => {
       setSeed(Math.random());
   }


  const manageList = (type, value) => {
    let roomlist = supplyList;
    if (type === "addListItem") {
      roomlist.push({ room: value.room, name: value.name, supplyOn: false });
      setSupplyList(roomlist);
    } else if (type === "removeListItem") {
      roomlist = roomlist.filter((e) => { return e.room !== value.room && e.name !== value.name });
      setSupplyList(roomlist)
    } else if (type === "updateListItem") {

      const index = roomlist.findIndex((obj => obj.room === value.room));
      if (index !== -1) {
        roomlist[index] = { ...roomlist[index], supplyOn: value.supplyOn };
        // console.log(roomlist[index]);
      }
      setSupplyList(roomlist)
    }
  }

  const roomError = 'range [0-10000]';
  const roomSchema = () => Yup.object({
    name: Yup.string().required("please enter room name")
      .test('Valid Character?', 'Name is Invalid', (str) => !(/[^a-zA-Z0-9_\s]+/.test(str))),
    room: Yup.number().required("enter room no.").min(0, roomError).max(10000, roomError)
  })

  // checks if room already exists
  const checkRoom = async (values) => {
    let errors = {};
    if (supplyList.filter(function (e) { return e.room === values.room; }).length > 0) {
      errors.room = "room exists"
    }
    return errors;
  }

  const { values, errors, touched, handleChange, handleSubmit, handleBlur } = useFormik({
    initialValues: { name: "", room: "" },
    validationSchema: roomSchema,
    validate: checkRoom,
    onSubmit: (values, action) => {
      manageList("addListItem", { room: values.room, name: values.name });
      action.resetForm();
    }
  })

  const toggleSupply = (room, name, isChecked,evt) => {
    // console.log(room, name, isChecked);
    manageList("updateListItem", { room, name, supplyOn: isChecked });
    reset();
    // evt.stopPropagation();

  }

  // list item
  const sList = (room, name,supplyOn,toggleSupply) => {
    return (
      <div key={room} className="row g-3 mb-4">
        <li className="list-group-item d-flex">
          <div className="col-2 col-sm-1">
            <input className="form-check-input me-1" type="checkbox" value="" id={"rm-" + room}
              checked={supplyOn} onChange={(e) => { toggleSupply(room, name, e.target.checked,e); }} />
          </div>
          <div className="col-1" >
            <label className="form-check-label roomno" htmlFor={"rm-" + room} >{room}</label>
          </div>
          <div className="col-8 col-sm-9">
            {" " + name}
          </div>
          <div className="col-1 d-flex">
            <span className='m-auto hover-pointer' onClick={() => manageList(
              "removeListItem", { room, name })} style={{ cursor: 'pointer' }}>🗑️</span>
          </div>
        </li>
      </div>
    );
  }

  const saveChanges= async()=>{
    // console.log((supplyList[0]));
    saveSupplyList(supplyList);
  }

  const loadSupplyList= async()=>{
    const slist= await getSupplyList();
    setSupplyList(slist);
    // console.log(slist);
  }
  const selectAll= async()=>{
    let slist= supplyList.map((e)=>{
      return {...e,supplyOn:true};
    });
    setSupplyList(slist);

  }
  const deselectAll= async()=>{
    let slist= supplyList.map((e)=>{
      return {...e,supplyOn:false};
    });
    setSupplyList(slist);
  }
  const sortasc= async()=>{
    let slist= supplyList.sort((a,b)=>{return a.room-b.room});
    setSupplyList(slist);
    reset()
    // console.log(slist);
  }
  const sortdec= async()=>{
    let slist= supplyList.sort((a,b)=>{return b.room-a.room});
    setSupplyList(slist);
    reset()
    // console.log(slist);
  }

  useEffect(() => {
    supplyList.forEach((e)=>{
      console.log(e);
    })
  }, [supplyList]);

  useEffect(() => {
    loadSupplyList();
    
  }, []);


  return (
    <div className='m-3'>

      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-2">
          <div className="col-sm-7">
            <input type="text" className="form-control" onBlur={handleBlur} onChange={handleChange} value={values.name}
              name='name' placeholder="name" aria-label="City" />
            <p className='ms-4 mt-1 mb-4 text-danger' >{errors.name && touched.name ? errors.name : ""}</p>
          </div>
          <div className="col-sm">
            <input type="number" className="form-control" onBlur={handleBlur} onChange={handleChange} value={values.room}
              name='room' placeholder="room" aria-label="State" />
            <p className='ms-4 mt-1 mb-4 text-danger' >{errors.room && touched.room ? errors.room : ""}</p>
          </div>
          <div className="col-sm">
            <button className='btn btn-primary' type='submit' >Add</button>
          </div>
        </div>
      </form>

      <div className='mb-3'>
        
      <button className='btn btn-secondary me-2' type='button' onClick={selectAll} >Select All</button>
      <button className='btn btn-primary me-2' type='button' onClick={deselectAll} >Deselect All</button>
      <button className='btn btn-secondary me-2' type='button' onClick={sortasc}>Sort Asc</button>
      <button className='btn btn-secondary me-2' type='button' onClick={sortdec}>Sort Dec</button>
      </div>

      <ReactSortable key={seed} list={supplyList} setList={setSupplyList} ghostClass='bg-info'>
        {supplyList.map((item) => (
          sList(item.room, item.name,item.supplyOn,toggleSupply)
        ))}
      </ReactSortable>
      
      <button className='btn btn-secondary me-2' type='button' onClick={loadSupplyList} >Cancel</button>
      <button className='btn btn-primary' type='button' onClick={saveChanges} >Save</button>

    </div>
  )
}

export default SupplyList