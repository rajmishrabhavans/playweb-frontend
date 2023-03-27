import React from "react";

// Import react-circular-progressbar module and styles
import {
  // CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import RadialSeparators from "./RadialSeperator";

export const FillProgress = (props) => (
    <div style={{padding:'5px',
    height: props.height?props.height:'auto',
    width: props.width?props.width:'auto',
    display:'inline-block'}}>
    {/* <div label="Default">
      <CircularProgressbar value={percentage} text={`${percentage}%`} />
    </div> */}
    <div label="Progressbar with separators">
      <CircularProgressbarWithChildren
        value={props.percent?props.percent:0}
        text={`${props.percent?props.percent:0}%`}
        strokeWidth={10}
        styles={buildStyles({
          strokeLinecap: "butt"
        })}
      >
        <RadialSeparators
          count={10}
          style={{
            background: "#fff",
            width: "2px",
            // This needs to be equal to props.strokeWidth
            height: `${10}%`
          }}
        />
      </CircularProgressbarWithChildren>
      </div>
    </div>
);

export const CardFill= (props) =>{
      
return <div className="card text-bg-white mb-3" >
  <div className="card-header bg-primary text-white fs-5">{props.title?props.title:''}</div>
  <div className="card-body">
    <div className="card-text">
        <FillProgress percent= {props.percent} width= {props.width} height= {props.height}/>
        </div>
  </div>
  <div className="mb-1 mx-2 text-center small">
    <span className="me-2">
        <i className="fas fa-circle text-primary"></i> Filled
    </span>
    <span className="me-2">
        <i className="fas fa-circle text-secondary"></i> Empty
    </span>
  </div>
</div>

}


