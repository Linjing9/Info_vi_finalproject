import React, { useState, useEffect } from "react";
import * as d3 from "d3";

function TopCompaniesChart(props) {
    const { offsetX, offsetY, height, width, selectedRegion } = props; // Added selectedRegion to the destructuring
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const margin = { top: 50, right: 100, bottom: 50, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await d3.csv(
                    "https://gist.githubusercontent.com/Linjing9/133d453b525010219435770734e5f6f6/raw/ec84bb2b0d6bdc74ebc00c59b9bc1249fa17b566/barchart.csv",
                    // Converter function to ensure Valuation is treated as a number
                    d => ({
                        ...d,
                        Valuation: parseFloat(d.Valuation.trim()) // Trim whitespace and convert to a number
                    })
                );
                setData(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);
    if (loading) return <text>Loading...</text>;
    if (error) return <text>Error: {error}</text>;

    // Filter data based on selected region
    const filteredData = selectedRegion ? data.filter(d => d.Country === selectedRegion) : [];

    let maximumValue = 0;
    if (filteredData.length > 0) {
        maximumValue = parseFloat(filteredData[0].Valuation); // Initialize with the first Valuation value
        filteredData.forEach(d => {
            //console.log("Valuation before parsing:", d.Valuation); // Log Valuation before parsing
            const valuation = parseFloat(d.Valuation);
            //console.log("Valuation after parsing:", valuation); // Log Valuation after parsing
            if (!isNaN(valuation) && valuation > maximumValue) {
                maximumValue = valuation;
            }
        });
    }
    maximumValue = parseFloat(maximumValue.toFixed(2)); // Round to 2 decimal places
    console.log(filteredData);
    console.log(maximumValue);
    const xScale = d3.scaleLinear().range([0, width]).domain([0, maximumValue]).nice();
    const yScale = d3.scaleBand().range([0, height]).domain(filteredData.map(a => a.Company)).padding(0.2) //The domain is the list of ailines name
    //console.log("y's domain:", yScale.domain());
    //console.log("x's domain:", xScale.domain());

    const defaultOffsetX = 50; // Default offsetX value if not a number
    const defaultOffsetY = 50; // Default offsetY value if not a number
    const svgWidth = typeof width === 'number' && typeof offsetX === 'number' ? width + offsetX : width + defaultOffsetX;
    const svgHeight = typeof height === 'number' && typeof offsetY === 'number' ? height + offsetY : height + defaultOffsetY;
    console.log(svgWidth);
    console.log(svgHeight);


    return (
        <svg width={svgWidth} height={svgHeight}>
            <g transform={`translate(${offsetX}, ${offsetY})`}>
                {/* Draw Rectangles */}
                {filteredData.map(d => (
                    <rect
                        key={d.Company}
                        x={0}
                        y={yScale(d.Company)}
                        width={xScale(d.Valuation)}
                        height={yScale.bandwidth()}
                        stroke="black"
                    />
                ))}
            </g>
                {/* Draw Y-Axis */}
                <g transform={`translate(${offsetX}, ${offsetY})`}>
                    {yScale.domain().map((domainValue, i) => {
                        console.log(yScale(domainValue), i)
                        return(<>
                        <line x1={50} y1={0} x2={50} y2={height} stroke="black" />
                        <text
                            key={i}
                            x={50}
                            y={yScale(domainValue)}// + yScale.bandwidth() / 2}
                            dy=".35em"
                            textAnchor="end"
                        >
                            {domainValue}
                        </text>
                        </>)
                    })}
                </g>
                {/* Draw X-Axis */}
                <g transform={`translate(0, ${height-50})`}>
                    <line x1={0} y1={0} x2={width} y2={0} stroke="black" />
                    <text
                        x={width}
                        y={10}
                        dy=".71em"
                        textAnchor="end"
                    >
                        Valuation
                    </text>
                </g>
        </svg>
    );
}

export { TopCompaniesChart };