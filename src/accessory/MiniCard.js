import React from 'react'

export const OneTitleCard = (props) => {
    const borderclass = `card border-left-${props.color} shadow h-100 py-2`
    const titleclass = `text-xs font-weight-bold text-${props.color} text-uppercase mb-1`;
    const iconclass = `fas fa-${props.icon?props.icon:'calendar'} fa-2x text-gray-300`;
  return (
        <div className="col-xl-3 col-md-6 mb-4">
            <div className={borderclass}>
                <div className="card-body m-1">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className={titleclass}>
                                {props.title}</div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">{props.content}</div>
                        </div>
                        <div className="col-auto">
                            <i className={iconclass}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}
export const OneProgressCard = (props) => {
    const borderClass = `card border-left-${props.color} shadow h-100 py-2`
    const progressClass = `progress-bar bg-${props.color}`;
    const percent= (props.currVol/props.totalVol)*100;
  return (
        <div className="col-lg-6 mb-4 col-12">
            <div className={borderClass}>
                <div className="card-body">
            <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">{props.title}
                    </div>
                <div className="row no-gutters align-items-center ms-2">
                        <div className="col">
                            <div className="progress progress-sm mr-2">
                                <div className={progressClass} role="progressbar" style={{width:`${percent}%`}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{`${props.currVol}/${props.totalVol}ml`}</div>
                        </div>
                    </div>
                </div>
                </div>
                </div>
            </div>
        </div>
  )
}



  
