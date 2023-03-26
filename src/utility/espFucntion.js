import Cookies from "js-cookie";
import { fetchApi } from "./apiHelper";
import appdata from "./appdata";

// loads the progress bar that shows upper and lower waterlevel
export async function loadProgBar() {
  const circles = document.querySelectorAll('.circle');
  circles.forEach(elem => {
    var dots = elem.getAttribute('data-dots')
    var marked = elem.getAttribute('data-percent');
    // console.log(marked);
    var percent = Math.floor(dots * marked / 100);
    var rotate = 360 / dots;
    var points = "";
    for (let i = 0; i < dots; i++) {
      points += `<div class="points" style="--i: ${i}; --rot: ${rotate}deg"></div>`;
    }
    elem.innerHTML = points;
    const pointsMarked = elem.querySelectorAll('.points');

    for (let i = 0; i < percent; i++) {
      const list = pointsMarked[i].classList;
      if (marked >= 95) {
        list.remove('marked');
        list.add('markedr');
      } else {
        list.remove('markedr');
        list.add('marked');
      }
    }
  })
}

// updates the esp pin value when togglebox is clicked
export async function toggleCheckbox(element, sensorData, setSensorData) {
  const name = element.target.name;
  const isChecked = element.target.checked;
  if (isChecked)
    setSensorData({ ...sensorData, [name]: true })
  else
    setSensorData({ ...sensorData, [name]: false })
  console.log(name, isChecked);
  if (name === "buildLed") {
    if (isChecked) {
      updateSensorData({ buildLed: true });
    } else {
      updateSensorData({ buildLed: false });
    }
  } else if (name === "motorOn") {
    if (isChecked) {
      updateSensorData({ motorOn: true });
    } else {
      updateSensorData({ motorOn: false });
    }
  }
};

// updates the sensor data by the given values
export const updateSensorData = async (updateData) => {
  
  const res = await fetchApi("/updateSensorData",updateData)
  
    console.log("updateSensorData: ");
    // console.trace("updateConfig: ");
    if(res){
      console.log(res);
      return res;
    }
    return false;
}

// gets the sensor data from server
export const getSensorData = async () => {
  
  const res = await fetchApi("/getSensorData");
  
    // console.log("getSensorData: ");
    // console.log(resES.data);
    if(res){
      return res.data;
    }
    return false;
 
}

// gets the sensor data and set it to states
export const loadSensorData = async (setSensorData) => {
  
  const res = await getSensorData();
  
    // console.log("loadSensorData: ");
    // console.log(res);
    if(res){
      setSensorData(res);
      loadProgBar();
      return res;
    }
    return false;
 
}

// load configuration settings of esp data
export const loadEspConfigData = async () => {
  const res = await fetchApi("/getEspConfigData")
  
    console.log("getEspConfigData: ");
    console.log(res);
    if(res){
      return res;
    }
    return false;
}

// set config data of esp to state variables
export const setEspConfigData = async (configData) => {
  try {
    const res = await fetch(appdata.baseUrl + "/setEspConfigData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cookie: Cookies.get('jwtoken'),
        configData
      })
    });

    if (res.status > 201) {
      throw new Error(res.error);
    }
    const data = await res.json();
    updateSensorData({ updateConfigData: true })
    console.log(configData);
    // console.trace()
    console.log(data.msg);
    return data;

  } catch (error) {
    console.log(error);
    return false;
  }
}

export const fetchEspConfigData = async () => {
  
  // use token or session if login then only fetchApi should work
  const res = await fetchApi("/fetchEspConfigData")
  
    console.log("EspConfigData: ");
    console.log(res.msg);
    if(res){
      loadProgBar();
      return res.msg;
    }
    return false;
}

// saves the supply list to the database
export const saveSupplyList = async (supplyList) => {
  try {
    // console.log("cookies: "+Cookies.get('jwtoken'));
    const res = await fetch(appdata.baseUrl + "/saveSupplyList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cookie: Cookies.get('jwtoken'),
        supplyList
      })
    });

    const data = await res.json();
    if (res.status > 201) {
      console.log('res: '+data);
      throw new Error(res.error);
    }
    console.log(data);

    return data;

  } catch (error) {
    console.log("error: "+error);
    return false;
  }
}


// saves the supply list to the database
export const getSupplyList = async () => {
  
  const res = await fetchApi("/getSupplyList")
  
    console.log("supplyList: ");
    console.log(res);
    if(res.supplyList){
      loadProgBar();
      return res.supplyList.roomList;
    }else{
      return false;
    }
}

// saves the supply list to the database
export const getSupplyList2 = async () => {
  
  const res = await fetchApi("/getSupplyList")
  
    // console.log("supplyList: ");
    // console.log(res);
    if(res.supplyList){
      loadProgBar();
      return res.supplyList;
    }else{
      return false;
    }
}

// saves the supply list to the database
export const updateSupplyDetails = async (supplyDetails) => {
  
  const res = await fetchApi("/updateSupplyDetails",supplyDetails)
  
    if(res){
      console.log(res);
      return res;
    }else{
      return false;
    }
}

// gets the sensor data and set it to states
export const getHomeData = async () => {
  
  const res = await fetchApi("/getHomeData")
  
    // console.log("roomData: ");
    // console.log(res.data.roomData);
    if(res){
      loadProgBar();
      return res.data.roomData;
    }
    return false;
}


// gets the sensor data and set it to states
export const getTankInfo = async () => {
  const res = await fetchApi("/getTankInfo")
  
    console.log("tankInfo: ");
    console.log(res.tankInfo);
    if(res){
      return res.tankInfo;
    }
    return false;

  }

// updates the sensor data by the given values
export const updateHomeData = async (homeData, array = false) => {
  let udata;
  if(!array){
    udata = {
      data:[
      {
        roomNo:homeData.roomNo,
        supplyOn:homeData.supplyOn,
        resetFlow:homeData.resetFlow
      }
      ]
    }
    homeData= udata.data;
  }
  
  const res = await fetchApi("/updateHomeData",homeData)
  
    console.log("updateHomeData: ");
    console.log(res.msg);
    if(res){
      return res;
    }
    return false;
}
