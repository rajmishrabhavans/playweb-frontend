const appdata = {
    // baseUrl: "https://playwebbackend.onrender.com",
    baseUrl: "http://localhost:8000",
    // baseUrl: "http://192.168.43.14:8000"
}
export const adminInfo = {
    _id:"295179",
    name:"your name",
    email:"example@mail.co",
    phone:"9876543210",
    gender:"male",
    profilePic: require('../images/avatar3.png'),
    creationdate:"",
    societyName:"Society Name",
    societyLocation:"Society Location",
}

export const UserDetails= []

export const fetchInfo= {
    fetchTry:0,
    maxRetry:5,
    interval:1100,
}

export default appdata;