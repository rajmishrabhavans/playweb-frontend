import React from 'react'

export const CurrRow = (props) => {
    return (
        <tr>
            <td className="text-center text-muted">{props.roomNo}</td>
            <td>
                <div className="widget-heading">{props.ownerName}</div>
            </td>
            <td className="text-center">{props.wing}</td>
            <td className="text-center">
                <div className={`badge badge-${props.color}`}>{props.status}</div>
            </td>
            <td className="text-center">
                <button type="button" id="PopoverCustomT-1" className="btn btn-primary btn-sm">{props.action}</button>
            </td>
        </tr>
    )
}


export const CurrTable = () => {
    return (
        <div>

            <div className="main-card mb-3 card">
                <div className="card-header">Current supply List
                    <div className="btn-actions-pane-right">
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="align-middle mb-0 table table-borderless table-striped table-hover">
                        <thead>
                            <tr>
                                <th className="text-center">roomNo</th>
                                <th>Name</th>
                                <th className="text-center">Wing</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            <CurrRow roomNo= {1} ownerName= "Raj" wing= "A" color= "warning" status="pending" action= "Details"/>
                            <CurrRow roomNo= {2} ownerName= "Himanshu" wing= "A" color= "success" status="currently going" action= "Details"/>
                            <CurrRow roomNo= {3} ownerName= "Satyam" wing= "A" color= "info" status="upcoming" action= "Details"/>
                            
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}
