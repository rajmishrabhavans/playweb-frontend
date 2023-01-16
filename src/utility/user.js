const { userInfo } = require("./appdata");
const Cookies = require('js-cookie');

export const getUserData =async(appdata)=>{
    // console.log(Cookies.get());
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
        }
        const data= await res.json();
        Object.entries(data).forEach((e) => {if(userInfo[e[0]]!==undefined){userInfo[e[0]]= e[1]}});
        return data;
    } catch (error) {
        console.log(error);
    }
}


export const logoutUser= async(appdata)=> {
    try {
        // console.log(appdata);
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
        // setIsAuthenticated(false);
        Cookies.remove('jwtoken',{path:''});
        const placholder = {
            _id:"295179",
            name:"your name",
            email:"example@mail.co",
            phone:"9876543210",
            gender:"male",
            creationdate:""
        }
        // console.log(sessionStorage.getItem('loggedin'));
        sessionStorage.removeItem('loggedin')
        // console.log(sessionStorage.getItem('loggedin'));
        Object.entries(placholder).forEach((e) => {if(userInfo[e[0]]!==undefined){userInfo[e[0]]= e[1]}});
        // console.log(userInfo);
    } catch (error) {
        console.log(error);
    }
}
