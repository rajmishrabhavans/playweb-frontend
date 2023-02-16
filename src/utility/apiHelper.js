import Cookies from "js-cookie";
import appdata from "./appdata";

export const fetchApi = async (path,data=undefined) => {
    try {
      const res = await fetch(appdata.baseUrl + path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cookie: Cookies.get('jwtoken'),
          data
        })
      });
  
      if (res.status > 201) {
        throw new Error(res.error);
      }
      const rdata = await res.json();
      return rdata;
  
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  