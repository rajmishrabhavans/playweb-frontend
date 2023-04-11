import { fetchApi } from "./apiHelper";
import appdata, {adminInfo } from "./appdata";
const Cookies = require('js-cookie');

//to get the admin data from the backend
export const getAdminData = async() =>{
    // console.log("cookie:",Cookies.get('jwtoken'));
    try {
        // console.log(appdata);
        const res= await fetch(appdata.baseUrl+"/getData",{
            method:"POST",
            headers:{
                "Content-Type":"application/json" 
            },
            body:JSON.stringify({
                'cookie':Cookies.get('jwtoken'),
            })
        });
        if(res.status>201){
            console.log("Cannot fetch data");
            throw new Error("Cannot fetch data, status code - ",res.status);
        }
        const data= await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return false;
    }
}

//to get the admin data and store it locally for faster processing
export const loadAdminData = async() =>{
    const data = await getAdminData();
    if(data){
        console.log(data);
        Object.entries(data).forEach((e) => {if(adminInfo[e[0]]!==undefined){adminInfo[e[0]]= e[1]}});
    }
    return data;
}

//to log out admin from the browser
export const logoutAdmin= async(appdata)=> {
    try {
        
        const res= await fetch(appdata.baseUrl+"/logout",{
            method:"POST",
            headers:{
                "Content-Type":"application/json" 
            },
            body:JSON.stringify({
                cookie:Cookies.get('jwtoken')
            })
        });
        if(res.status>201){
            throw new Error(res.Error);
        }
        // remove the existing authentication token
        console.log(res)
        
        Cookies.remove('jwtoken',{path:'/'});
        document.cookie = 'jwtoken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        const placholder = {
            _id:"295179",
            name:"your name",
            email:"example@mail.co",
            phone:"9876543210",
            gender:"male",
            creationdate:""
        }
        
        localStorage.removeItem('loggedin')
        Object.entries(placholder).forEach((e) => {if(adminInfo[e[0]]!==undefined){adminInfo[e[0]]= e[1]}});
        // console.log(adminInfo);
    } catch (error) {
        console.log(error);
    }
}

// saves the alerts to the database
export const saveTankAlerts = async (alerts) => {
    
    const res = await fetchApi("/saveAlerts",alerts)
    
      if(res){
        console.log(res);
        return res;
      }else{
        return false;
      }
  }

// gets the alerts from the database
export const getTankAlert = async (markRead=undefined) => {
    
    const res = await fetchApi("/getAlerts",markRead)
    console.log(res)
    
      if(res.adminAlerts){
        return res.adminAlerts;
      }else{
        return false;
      }
}