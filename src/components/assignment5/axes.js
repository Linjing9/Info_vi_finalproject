import React from "react";

export { XAxis, YAxis };
//TODO: complete the YAxis
// 1.Draw the y-axis, using <line>;
// 2.Draw the ticks, using yScale.domain() to get the ticks (i.e., names of airlines);
// For each tick line, we set x1={-5}, x2={0}, y1 and y2 are the half of yScale.bandwidth()
// For the tick text, we set style={{textAnchor: 'start', fontSize:'10px'}}, x={-offsetX+10},y={yScale.bandwidth()/2}
function YAxis(props) {
    const { yScale, height, offsetX } = props;

    // Calculate the width of the axis line
    const axisWidth = offsetX || 1;

    return (
        <g>
            {/* Draw the y-axis line */}
            <line x1={0} y1={0} x2={0} y2={height} stroke='black' />

            {/* Draw the ticks */}
            {yScale.domain().map((tickValue, index) => (
                <g key={tickValue} transform={`translate(0, ${yScale(tickValue) + yScale.bandwidth() / 2})`}>
                    {/* Draw tick lines */}
                    <line x1={-5} x2={0} stroke="black" />

                    {/* Draw tick text */}
                    <text style={{ textAnchor: 'start', fontSize: '10px' }} x={-axisWidth + 10}>
                        {tickValue}
                    </text>
                </g>
            ))}
        </g>
    );
}

function XAxis(props) {
    const { xScale, width, height} = props;

    return <g transform={`translate(${0}, ${height})`}>
        {<line x2={width} stroke='black'/>}
        {xScale.ticks(5).map(tickValue => 
            <g key={tickValue} transform={`translate(${xScale(tickValue)}, ${0})`}>
                <line y2={10} stroke='black' />
                <text style={{ textAnchor:'end', fontSize:'10px' }} x={5} y={20}>
                    {tickValue}
                </text>
            </g>
        )}
    </g>
    
}