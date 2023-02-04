import appdata, {userInfo } from "./appdata";
const Cookies = require('js-cookie');

//to get the user data from the backend
export const getUserData = async() =>{
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

//to get the user data and store it locally for faster processing
export const loadUserData = async() =>{
    const data = await getUserData();
    if(data){
        console.log(data);
        Object.entries(data).forEach((e) => {if(userInfo[e[0]]!==undefined){userInfo[e[0]]= e[1]}});
    }
    return data;
}

//to log out user from the browser
export const logoutUser= async(appdata)=> {
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
        Cookies.remove('jwtoken',{path:''});
        const placholder = {
            _id:"295179",
            name:"your name",
            email:"example@mail.co",
            phone:"9876543210",
            gender:"male",
            creationdate:""
        }
        
        sessionStorage.removeItem('loggedin')
        Object.entries(placholder).forEach((e) => {if(userInfo[e[0]]!==undefined){userInfo[e[0]]= e[1]}});
        // console.log(userInfo);
    } catch (error) {
        console.log(error);
    }
}
