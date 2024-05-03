import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

function LineChart({ width, height }) {
  const svgRef = useRef(null);
  const [data, setData] = useState(null);

  const margin = { top: 50, right: 450, bottom: 50, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://gist.githubusercontent.com/Linjing9/513b600042d7d9e4120922e9c4508c12/raw/203e2c7e64cb97f2a424ca0a70fd312ce2d0a7c4/linechart.csv"
        );
        const csvData = await response.text();
        const parsedData = d3.csvParse(csvData, d => ({
          date: new Date(d.date),
          number: +d.number,
          worldGDP: +d.worldGDP,
          Healthcare: +d.Healthcare
        }));
        setData(parsedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      const svg = d3.select(svgRef.current);

      const xScale = d3
        .scaleTime()
        .domain([d3.min(data, d => d.date), d3.max(data, d => d.date)])
        .range([0, innerWidth]);

      const yScaleGDP = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.worldGDP)])
        .range([innerHeight, 0]);

      const yScaleUnicorns = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.number)])
        .range([innerHeight, 0]);

      const yScaleHealthcare=d3
        .scaleLinear()
        .domain([0,d3.max(data, d => d.Healthcare)])
        .range([innerHeight, 0]);

      const xAxis = d3.axisBottom(xScale).tickSizeOuter(0).ticks(10);
      const yAxisGDP = d3.axisLeft(yScaleGDP).tickSizeOuter(0).ticks(8);
      const yAxisUnicorns = d3.axisRight(yScaleUnicorns).tickSizeOuter(0).ticks(8);
      // Add a new y-axis for healthcare data
      const yAxisHealthcare = d3.axisRight(yScaleHealthcare).tickSizeOuter(0).ticks(8);
      svg
      .append("g")
      .attr("class", "y-axis-healthcare")
      .call(yAxisHealthcare)
      .attr("transform", `translate(${width - margin.right+500}, ${margin.top})`)
      .selectAll("text")
      .attr("font-size", "14px");

      svg.select(".x-axis")
        .call(xAxis)
        .attr("transform", `translate(${margin.left}, ${innerHeight + margin.top})`)
        .selectAll("text")
        .attr("font-size", "14px");

      svg.select(".y-axis-gdp")
        .call(yAxisGDP)
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .selectAll("text")
        .attr("font-size", "14px");

      svg.select(".y-axis-unicorns")
        .call(yAxisUnicorns)
        .attr("transform", `translate(${width - margin.right}, ${margin.top})`)
        .selectAll("text")
        .attr("font-size", "14px");
      
      // Append rectangles for crisis periods
      const crisisPeriods = [
        { start: new Date("2007-01-01"), end: new Date("2009-12-31"), label: "Great Financial Crisis" },
        { start: new Date("2020-01-01"), end: new Date("2022-12-31"), label: "COVID-19 Crisis" }
      ];

      svg.selectAll(".crisis-period")
        .data(crisisPeriods)
        .enter()
        .append("rect")
        .attr("class", "crisis-period")
        .attr("x", d => xScale(d.start) + margin.left)
        .attr("y", margin.top)
        .attr("width", d => xScale(d.end) - xScale(d.start))
        .attr("height", innerHeight)
        .attr("fill", "#d3d3d3"); // Darker grey background color

      // Append crisis labels
      svg.selectAll(".crisis-label")
        .data(crisisPeriods)
        .enter()
        .append("text")
        .attr("class", "crisis-label")
        .attr("x", d => (xScale(d.start) + xScale(d.end)) / 2 + margin.left)
        .attr("y", margin.top + innerHeight / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "#000")
        .text(d => d.label);

      const lineGDP = d3
        .line()
        .x(d => xScale(d.date))
        .y(d => yScaleGDP(d.worldGDP));

      const lineUnicorns = d3
        .line()
        .x(d => xScale(d.date))
        .y(d => yScaleUnicorns(d.number));
      
      const lineHealthcare = d3
        .line()
        .x(d => xScale(d.date))
        .y(d => yScaleHealthcare(d.Healthcare));

      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red") 
        .attr("stroke-width", 4)
        .attr("d", lineHealthcare)
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      
      const showTooltip = (event, d) => {
          const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "rgba(255, 255, 255, 0.9)")
            .style("border", "2px solid #ccc")
            .style("border-radius", "4px")
            .style("padding", "15px")
            .style("font-family", "Papyrus")
            .style("font-size", "20px")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 28}px`)
            .attr("id", "map-tooltip");
        
          if (d3.select(event.currentTarget).attr("fill") === "pink") {
            tooltip.html(
              `Number of Unicorn Companies: ${d.number}`
            );
          } else if (d3.select(event.currentTarget).attr("fill") === "purple") {
            tooltip.html(
              `World GDP: ${d.worldGDP}`
            );
          } else if (d3.select(event.currentTarget).attr("fill") === "red") {
            tooltip.html(
              ` Proportion of Healthcare Companies: ${d.Healthcare}`
            );
          }
        };
      const hideTooltip = () => {
          // Remove tooltip element
          d3.select("#map-tooltip").remove();
          };

      
// Append circles for data points on pink line
      svg.selectAll(".circle-pink")
       .data(data)
       .enter()
       .append("circle")
       .attr("class", "circle")
       .attr("cx", d => xScale(d.date) + margin.left)
       .attr("cy", d => yScaleUnicorns(d.number) + margin.top)
       .attr("r", 5)
       .attr("fill", "pink")
       .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).attr("r", 9); // Increase circle size on hover
        showTooltip(event, d);
       })
       .on("mouseout", () => {
        d3.select(event.currentTarget).attr("r", 5); // Restore original circle size on mouseout
          hideTooltip();
       });

// Append circles for data points on the purple line
      svg.selectAll(".circle-purple")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "circle-purple")
      .attr("cx", d => xScale(d.date) + margin.left)
      .attr("cy", d => yScaleGDP(d.worldGDP) + margin.top)
      .attr("r", 5)
      .attr("fill", "purple")
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).attr("r", 9); // Increase circle size on hover
          showTooltip(event, d);
      })
      .on("mouseout", () => {
          d3.select(event.currentTarget).attr("r", 5); // Restore original circle size on mouseout
          hideTooltip();
});

// Append circles for data points on the red line
      svg.selectAll(".circle-red")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "circle-red")
        .attr("cx", d => xScale(d.date) + margin.left)
        .attr("cy", d => yScaleHealthcare(d.Healthcare) + margin.top)
        .attr("r", 5)
        .attr("fill", "red")
        .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).attr("r", 9); // Increase circle size on hover
            showTooltip(event, d);
})
        .on("mouseout", () => {
            d3.select(event.currentTarget).attr("r", 5); // Restore original circle size on mouseout
            hideTooltip();
});

      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "purple")
        .attr("stroke-width", 4)
        .attr("d", lineGDP)
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "pink")
        .attr("stroke-width", 4)
        .attr("d", lineUnicorns)
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      svg
        .append("text")
        .attr("transform", `translate(${margin.left + innerWidth / 2}, ${height - margin.bottom / 3})`)
        .style("text-anchor", "middle")
        .attr("font-size", "16px")
        .text("Year");

      svg
        .append("text")
        .attr("transform", `rotate(-90)`)
        .attr("y", margin.left - 40)
        .attr("x", -innerHeight / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-size", "16px")
        .text("World GDP")
        .attr("dx", "-5em") // Adjust the position to the left
        .attr("dy", "-2em"); // Adjust the position upwards

      svg
        .append("text")
        .attr("transform", `rotate(90)`)
        .attr("y", -width + margin.right + 60)
        .attr("x", innerHeight / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-size", "16px")
        .text("Number of Unicorn Companies")
        .attr("dx", "3em") // Adjust the position to the right
        .attr("dy", "-6em"); // Adjust the position upwards
      

        svg
        .append("text")
        .attr("transform", `rotate(90)`)
        .attr("y", -width + margin.right -500)
        .attr("x", innerHeight / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-size", "16px")
        .text("Proportion of unicorns")
        .attr("dx", "3em") // Adjust the position to the right
        .attr("dy", "-6em"); // Adjust the position upwards


      // Append color boxes with line meanings
      // Append color boxes with line meanings
        svg.append("rect")
        .attr("x", width - margin.right + 50)
        .attr("y", margin.top)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "purple");

        svg.append("text")
        .attr("x", width - margin.right + 75) // Adjusted x-coordinate here
        .attr("y", margin.top + 15)
        .attr("alignment-baseline", "middle")
        .text(": World GDP");

        svg.append("rect")
        .attr("x", width - margin.right + 50)
        .attr("y", margin.top + 30)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "pink");

        svg.append("text")
        .attr("x", width - margin.right + 75) // Adjusted x-coordinate here
        .attr("y", margin.top + 45)
        .attr("alignment-baseline", "middle")
        .text(": Number of Unicorn Companies");

        svg.append("rect")
        .attr("x", width - margin.right + 50)
        .attr("y", margin.top + 65)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "red");

        svg.append("text")
        .attr("x", width - margin.right + 75) // Adjusted x-coordinate here
        .attr("y", margin.top + 75)
        .attr("alignment-baseline", "middle")
        .text(": Proportion of Healthcare Companies to all Unicorns");



        <g className="y-axis-unicorns" transform={`translate(${width - margin.right}, ${margin.top})`} />
    }
  }, [data, width, height, innerWidth, innerHeight, margin.left, margin.bottom, margin.right]);


  return (
    <svg width={width} height={height} ref={svgRef}>
      <g className="x-axis" transform={`translate(${margin.left}, ${innerHeight + margin.top})`} />
      <g className="y-axis-gdp" transform={`translate(${margin.left}, ${margin.top})`} />
      <g className="y-axis-unicorns" transform={`translate(${width - margin.right}, ${margin.top})`} />
      <g className="y-axis-healthcare" transform={`translate(${width - margin.right}, ${margin.top})`} />
    </svg>
  );
}
export { LineChart };