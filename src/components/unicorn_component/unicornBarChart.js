import React, { useState, useEffect } from "react";
import * as d3 from "d3";

function TopCompaniesChart(props) {
    const { offsetX, offsetY, height, width, selectedRegion } = props; // Added selectedRegion to the destructuring
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tooltip, setTooltip] = useState(null);

    const margin = { top: 50, right: 100, bottom: 50, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
   
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await d3.csv(
                    "https://gist.githubusercontent.com/Linjing9/133d453b525010219435770734e5f6f6/raw/88926cecdbd7a8d5ae43357eec3c1fd067c31fad/barchart.csv",
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
    console.log(filteredData);
    // Define scales

    const xScale = d3
    .scaleBand()
    .domain(filteredData.map(d => d.Company))
    .range([0, innerWidth])
    .padding(0.1);
    const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(filteredData, d => d.Valuation)])
    .range([innerHeight, 0]);


    const handleMouseOver = (event, d) => {
      // Set tooltip content when mouse is over the bar
      setTooltip({ company: d.Company, valuation: d.Valuation });
    };
  
    const handleMouseOut = () => {
      // Clear tooltip content when mouse leaves the bar
      setTooltip(null);
    };

    //console.log("X Scale Domain:", xScale.domain());
    //console.log("X Scale Range:", xScale.range());
    //console.log("Y Scale Domain:", yScale.domain());
    //console.log("Y Scale Range:", yScale.range());


    return (
        <svg width={width} height={height}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            {filteredData.map(d => (
               <g key={d.Company}>
              <rect
                key={d.Company}
                x={xScale(d.Company)}
                y={yScale(d.Valuation)}
                width={xScale.bandwidth()}
                height={innerHeight - yScale(d.Valuation)}
                fill="pink"
                onMouseOver={(event) => handleMouseOver(event, d)}
                onMouseOut={handleMouseOut}
              />
              {tooltip && tooltip.company === d.Company && (
                <text
                  x={xScale(d.Company) + xScale.bandwidth() / 2}
                  y={yScale(d.Valuation) - 5}
                  textAnchor="middle"
                  fill="black"
                >
                  {tooltip.valuation.toFixed(2)} billion
                </text>
              )}
            </g>
            ))}
            <g transform={`translate(0,${innerHeight})`} ref={(node) => d3.select(node).call(d3.axisBottom(xScale))} />
        <g ref={(node) => d3.select(node).call(d3.axisLeft(yScale))} />
        <text
        x={innerWidth / 2}
        y={innerHeight + margin.bottom * 0.8}
        textAnchor="middle"
        dominantBaseline="middle"
        >
        Company
        </text>
        <text
        transform="rotate(-90)"
        x={-innerHeight / 2}
        y={-margin.left * 0.8}
        textAnchor="middle"
        dominantBaseline="middle"
        >
        Valuation($ billion)
        </text>
          </g>
        </svg>
      );
    }
    export {TopCompaniesChart};