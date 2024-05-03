import React from "react";
import { max, scaleBand, scaleLinear } from "d3";
import { XAxis, YAxis } from "./axes";


export function BarChart (props) {
    const {offsetX, offsetY, data, height, width, selectedAirline, setselectedAirline} = props;
    // Task 1: TODO
    // 1. find the maximum of the Count attribute in the data
    // 2. define the xScale and yScale
    // 3. return the bars; (Remember to use data.map());
    // 4. return <XAxis/> and <YAxis/>
    
    // Task 3. TODO
    // 1. define an arrow function color; it takes a data item, d, as input. 
    // If d.AirlineID is equal to the selectedAirline, it returns "#992a5b"; 
    // otherwiese, it returns "#2a5599".
    // 2. define a function onMouseOver; it takes a data item, d, as input,
    // and sets the selectedAirline be the d.AirlineID
    // 3. define a function onMouseOut; it has no argument, and sets the selectedAirline be null.
    // 4. adding properties, onMouseOver and onMouseOut, to the <rect> tags.

    // Note: the function of the onMouseOver properties should be an arrow function 
    // that wraps the onMouseOver you defined since it takes d as input.

    // 1. find the maximum of the Count attribute in the data
    const maxValue = max(data, d => d.Count);

    // Task 1: Define xScale and yScale
    const xScale = scaleLinear()
        .domain([0, maxValue])
        .range([0, width]);

    // for yScale, set padding to 0.2
    const yScale = scaleBand()
        .domain(data.map(d => d.AirlineName))
        .range([0, height])
        .padding(0.2);

    // Task 2:
    // 1. Define a function color
    const color = d => (selectedAirline === d.AirlineID ? "#992a5b" : "#2a5599");

    // 2. Define a function onMouseOver
    const onMouseOver = d => setselectedAirline(d.AirlineID);

    // 3. Define a function onMouseOut
    const onMouseOut = () => setselectedAirline(null);


    const bars = data.map((d, i) => (
        <rect
            key={d.ID}
            x={0}
            y={yScale(d.AirlineName)}
            width={xScale(d.Count)}
            height={yScale.bandwidth()}
            fill={color(d)} // Apply color based on selectedAirline
            onMouseOver={() => onMouseOver(d)}
            onMouseOut={onMouseOut}
        />
    ));


    return (
        <g transform={`translate(${offsetX}, ${offsetY})`}>
            {bars}
            <XAxis xScale={xScale} width={width} height={height} />
            <YAxis yScale={yScale} height={height} offsetX={offsetX} />
        </g>
    );
}