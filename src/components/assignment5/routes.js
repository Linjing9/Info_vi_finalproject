import React from "react";

function Routes(props){
    const {projection, routes, selectedAirline} = props;
    // TODO: 
    // return the routes of the selected airline; 
    // If the selectedAirline is null (i.e., no airline is selected), return <g></g>.
    if (selectedAirline === null) {
        return <g></g>;
    }
    
    // Otherwise, it returns a set of lines that are the route of the airline whose AirlineID is the selectedAirline.
    const selectedRoutes = routes.filter(route => route.AirlineID === selectedAirline);
    return(
        <g>
            {selectedRoutes.map((route, idx) => {
                // Calculate the projected coordinates of the source airport
                const source = projection([route.SourceLongitude, route.SourceLatitude]);
                // Calculate the projected coordinates of the destination airport
                const destination = projection([route.DestLongitude, route.DestLatitude]);
                // Return a <line> element representing the route between source and destination
                return (
                    <line
                        key={idx}
                        x1={source[0]}
                        y1={source[1]}
                        x2={destination[0]}
                        y2={destination[1]}
                        stroke="#992a5b"
                        strokeWidth="0.1"
                    />
                );
            })}

        </g>
    )

}

export { Routes }