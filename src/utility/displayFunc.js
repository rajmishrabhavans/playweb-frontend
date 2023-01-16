import Cookies from "js-cookie";
import appdata from "./appdata";

//loads the progress bar
export async function loadProgBar(){
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
              const list= pointsMarked[i].classList;
              if(marked>=95){
                list.remove('marked');
                list.add('markedr');
              }else{
                list.remove('markedr');
                list.add('marked');
              }
            }
        })
    }
    
  export async function toggleCheckbox(element) {
      const name= element.target.name;
      const isChecked = element.target.checked;
      console.log(name,isChecked);
      if(name==="buildLed"){
        if(isChecked){
          updateSensorData({buildLed:true});
        }else{
          updateSensorData({buildLed:false});
        }
      }else if(name==="motorOn"){
        if(isChecked){
          updateSensorData({motorOn:true});
        }else{
          updateSensorData({motorOn:false});
        }
      }
    };

    const updateSensorData = async (updateData) => {
      // console.log(updateData);
      try {
          const res = await fetch(appdata.baseUrl + "/updateSensorData", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  cookie: Cookies.get('jwtoken'),
                  data:updateData
              })
          });

          if (res.status > 201) {
              throw new Error(res.error);
          }
          const data = await res.json();
          console.log(data.msg);

      } catch (error) {
          console.log(error);
      }
  }

    /*
    var today = new Date();
    var showdate= setInterval(function ( ) {
         var today = new Date();
          document.getElementById("datetime").innerHTML = today.toString();
    },1000);
    
    function resetFlow() {
      var xhr = new XMLHttpRequest();
      document.getElementById("flowamt").innerText = "0 ml";
      xhr.open("GET", "/reset", true);
      xhr.send();
    };
    //function flowAmount() {
    //  var xhr = new XMLHttpRequest();
    //  var flowAmt= document.getElementById("flowvalue").value
    //  xhr.open("GET", "/reset", true);
    //  xhr.send();
    //};
    
    
    // To get above water tank level
    setInterval(function ( ) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          document.getElementById("progress1").setAttribute('data-percent', this.responseText+"");
          document.getElementById("prog1").innerText = this.responseText+" ";
          var pin2= document.getElementById("14");
          
          if(pin2.checked && parseInt(this.responseText)>=95){
            pin2.checked= false;
            stopTimer("motor stopped as water level is greater than 95%");
            document.getElementById("alertmsg").innerHTML = "Turned motor off. Tank full!";
            setTimeout(function(){
                document.getElementById("alertmsg").innerHTML = "";
            }, 3000);
          }
          loadProg();
        }
      };
      xhttp.open("GET", "/wlevel1", true);
      xhttp.send();
    }, 3000 );
    
    // To get below water tank level
    setInterval(function ( ) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          document.getElementById("progress2").setAttribute('data-percent', this.responseText+"");
          document.getElementById("prog2").innerText = this.responseText+" ";
          loadProg();
        }
      };
      xhttp.open("GET", "/wlevel2", true);
      xhttp.send();
    }, 3000 );
    
    // To get flow speed
    setInterval(function ( ) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          let fdata= this.responseText;
          let fArray = fdata.split(" ");
          document.getEmentById("fspeed").innerText = fArray[0]+" ml/sec";
          document.getElementById("flowamt").innerText = fArray[1]+" ml";
          loadProg();
        }
      };
      xhttp.open("GET", "/fspeed", true);
      xhttp.send();
    }, 3000 );
    
    var dtlocal= document.getElementById("motorStartTime");
    var ontime= document.getElementById("motorStopTime");
    var pin2= document.getElementById("14");
    var tsecond = 1000;
    var tminute = tsecond * 60;
    var thour = tminute * 60;
    var tday = thour * 24;
    var timer;
    var end;
    var stopped= false;
     
     function currentdatetime(){
         var today = new Date();
         var date = today.getFullYear()+'-'+('0'+(today.getMonth()+1)).slice(-2)
         +'-'+('0'+today.getDate()).slice(-2);
         var time = ("0"+today.getHours()).slice(-2) + ":" +
         ('0'+today.getMinutes()).slice(-2) + ":"+('0'+today.getSeconds()).slice(-2);
        return (date+'T'+time);
    }
        
    function setMotorTime(){
        if(!ontime.value){alert("Enter stop motor detail");return;}
        if(ontime.value<=0 || ontime.value>100 || !Number.isInteger(Number(ontime.value))){
          alert("Enter proper values between 1 and 100");return;}
        stopped= false;
        end = new Date(inputDateTimeInMillis(0));
        
        timer = setInterval(showRemaining, 1000);
    }
    
    function inputDateTimeInMillis(motorontime){
    
        dtlocal= document.getElementById("motorStartTime");
      dtlocal.defaultValue = currentdatetime();
        const idatetime= dtlocal.value.split("T");
        let idate= idatetime[0].split("-");
        let itime= idatetime[1].split(":");
        if(!itime[2]) itime[2]="00";
        var parsedDate= Date.parse(dtlocal.value)+(motorontime*60*1000);
        return parsedDate;
    }
    
    function stopTimer(msg){
          var now = new Date();
          clearInterval(timer);
          pin2.checked= false;
          toggleCheckbox(pin2);
          stopped= true;
          end= now;
          if(msg){
          document.getElementById('countdown').innerHTML = msg;
          }
          else{
          document.getElementById('countdown').innerHTML = "Stopped!";
          }
    }
    
    function showRemaining() {
      if(stopped) return;
      var now = new Date();
      var distance = end - now;
      
      if (distance < 0) {
        if(ontime.value!== ""){
          var motorontime= parseInt(ontime.value,10);
          end = new Date(inputDateTimeInMillis(motorontime));
          pin2.checked= true;
          toggleCheckbox(pin2);
          timer = setInterval(showRemaining, 1000);
          ontime.value= "";
        }else{
          stopTimer("Task Done");
          document.getElementById('countdown').innerHTML = 'DONE!';
        
          return;
        }
      }
      var days = Math.floor(distance / tday);
      var hours = Math.floor(modulo(distance, tday) / thour);
      var minutes = Math.floor(modulo(distance, thour) / tminute);
      var seconds = Math.floor(modulo(distance, tminute) / tsecond);
      
      if(ontime.value!== ""){
        document.getElementById('countdown').innerHTML = 'Motor will start in: ';
        }
        else{
        document.getElementById('countdown').innerHTML = 'Motor will stop in: ';
        }
        if(days<0 || hours<0){days=0;hours=0;minutes=0;seconds=0}
        document.getElementById('countdown').innerHTML += days + ' days ';
        document.getElementById('countdown').innerHTML += hours + 'hrs ';
        document.getElementById('countdown').innerHTML += minutes + 'mins ';
        document.getElementById('countdown').innerHTML += seconds + 'secs';
      }
      function modulo(a,b){
      let q = parseInt(a / b);  //finding quotient (integer part only)
      let p = q * b;  //finding product
      return a - p;  //finding modulus
    }

    exports.resetFlow = resetFlow;
    exports.setMotorTime = setMotorTime;
    */
     