import React, { useState, useEffect } from "react";
import * as d3 from "d3";

function PieChart(props) {
  const { height, width, radius, selectedRegion } = props; // Added selectedRegion to the destructuring
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const margin = { top: 30, right: 300, bottom: 50, left: -10 };
  const innerWidth = width - margin.left - margin.right;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await d3.csv(
          "https://gist.githubusercontent.com/Linjing9/6de4a73f5b6a65c3bb348950ed0e5533/raw/50add5d93b5302cfdd76b04089742c29e5b1cedb/piechart.csv"
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
  const filteredData = selectedRegion
    ? data.filter(d => d.Country === selectedRegion)
    : [];
  //console.log(filteredData);

  // Create a map to count the number of companies in each industry
  const industryCountMap = {};
  filteredData.forEach(d => {
    industryCountMap[d.Industry] = (industryCountMap[d.Industry] || 0) + 1;
  });
  //console.log(industryCountMap);

  // Convert map into array of objects for d3 pie function
  const pieData = Object.keys(industryCountMap).map(key => ({
    industry: key,
    count: industryCountMap[key]
  }));
  //console.log(industryCountMap);

  // Define color scale for the pie chart
  const customColors = ["#F89F5B", "#FFF5F6",  "#E53F71", "#9C3587", "#653780", "#3F1651","pink"];
  // Assign custom colors to each slice of the pie chart
  const colorScale = d3.scaleOrdinal(customColors);

  // Define pie function
  const pie = d3
    .pie()
    .value(d => d.count)
    .sort(null);

  // Define arc function
  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius);
    console.log(radius);

  // Define legend
  const legend = pieData.map((d, i) => (
    <g key={i} transform={`translate(0, ${i * 20})`}>
      <rect x={innerWidth + margin.left + 10} y={i * 20} width={15} height={15} fill={colorScale(d.industry)} />
      <text x={innerWidth + margin.left + 30} y={i * 20 + 10} dy="0.35em">
        {/* Change the notation here */}
        {`${d.industry} (${d.count})`}
      </text>
    </g>
  ));

  const handleMouseOver = (event, slice) => {
    setHoveredSlice(slice);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    
  };
  const handleMouseOut = () => {
    setHoveredSlice(null);
  };

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left + width / 2 - 130},${margin.top + height / 2})`}>
        {pie(pieData).map((slice, index) => (
          <g key={index}>
            <path
              d={arc(slice)}
              fill={colorScale(slice.data.industry)}
              stroke={hoveredSlice === slice ? "black" : "white"}
              strokeWidth={hoveredSlice === slice ? 4 : 2}
              onMouseOver={(event) => handleMouseOver(event, slice)}
              onMouseOut={handleMouseOut}
            />
            {hoveredSlice === slice && (
              <text x={tooltipPosition.x} y={tooltipPosition.y} textAnchor="middle" fill="black">
                {slice.data.industry}: {slice.data.count}
                </text>
            )}
          </g>
        ))}
      </g>
      {/* Legend */}
      <g transform={`translate(${margin.left}, ${margin.top})`}>{legend}</g>
    </svg>
  );
}

export { PieChart };