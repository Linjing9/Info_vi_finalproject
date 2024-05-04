import React, { useEffect, useState } from "react";
import * as d3 from "d3"; 

function UnicornMap(props) {
  const { width, height, onSelectRegion } = props;
  const margin = { top: 0, right: 100, bottom: 10, left: 0 }; // Define margins
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null); // New state for selected region


  useEffect(() => {
    const fetchData = async () => {
      try {
        const worldMapData = await d3.json(
          "https://gist.githubusercontent.com/hogwild/26558c07f9e4e89306f864412fbdba1d/raw/5458902712c01c79f36dc28db33e345ee71487eb/countries.geo.json"
        );

        const unicornData = await d3.csv(
          "https://gist.githubusercontent.com/Programming-git/9df9d14a10cf8dd0c58970c71c89ff54/raw/4e0765c0634fb9bdfb22adeadb97a5b722b74c24/unicorn_country_map_manipulated.csv"
        );

        renderMap(worldMapData, unicornData); // Render the map once data is fetched
        setLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [width, height]); // Re-fetch data if width or height changes


  const handleCountryHover = (event, countryName) => {
    // Handle country hover...
    setSelectedRegion(countryName); // Update selected region state
  };
  const handleCountryClick = (event, countryName) => {
    // Handle country click...
    setSelectedRegion(countryName); // Update selected region state
    onSelectRegion(countryName); // Pass selected region to parent component
  };

  
  const renderMap = (worldData, unicornData) => {
    const unicornDataById = {};
    unicornData.forEach((d) => {
      // Convert unicorn_num to a number
      unicornDataById[d.country] = +d.unicorn_num;
    });

    // Define a purple color scale using D3's interpolatePurple
    const color = d3.scaleLinear()
      .domain([0, 1, 10, 60, 100, 500]) // Adjust the domain to reflect your data
      .range([
        "#FFF5F6", "#F89F5B", "#E53F71", "#9C3587", "#653780", "#3F1651"
      ]); // Use interpolatePurple for purple shades

    const projection = d3.geoEqualEarth()
      .fitSize([width - margin.left - margin.right, height - margin.top - margin.bottom], worldData); // Fit the projection to the provided width and height

    const path = d3.geoPath().projection(projection);

    const svg = d3.select("#map-container");

    // Clear existing SVG content
    svg.selectAll("svg").remove();

    // Append a new SVG
    const newSvg = svg
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`) // Use viewBox to control SVG view
      .style("margin", "auto")
      .style("display", "block");

    // Append legend boxes and text
    newSvg.append("rect")
      .attr("x", width - margin.right - 60)
      .attr("y", margin.top + 20)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "#3F1651");

    newSvg.append("text")
      .attr("x", width - margin.right - 30)
      .attr("y", margin.top + 32)
      .attr("alignment-baseline", "middle")
      .text(": 500+ unicorns");

    newSvg.append("rect")
      .attr("x", width - margin.right - 60)
      .attr("y", margin.top + 50)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "#653780");

    newSvg.append("text")
      .attr("x", width - margin.right - 30)
      .attr("y", margin.top + 62)
      .attr("alignment-baseline", "middle")
      .text(": 100+ unicorns");

      newSvg.append("rect")
      .attr("x", width - margin.right - 60)
      .attr("y", margin.top + 80)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "#9C3587");

    newSvg.append("text")
      .attr("x", width - margin.right - 30)
      .attr("y", margin.top + 92)
      .attr("alignment-baseline", "middle")
      .text(": 60+ unicorns");

    newSvg.append("rect")
      .attr("x", width - margin.right - 60)
      .attr("y", margin.top + 110)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "#E53F71");

    newSvg.append("text")
      .attr("x", width - margin.right - 30)
      .attr("y", margin.top + 122)
      .attr("alignment-baseline", "middle")
      .text(": 11-59 unicorns");

      newSvg.append("rect")
      .attr("x", width - margin.right - 60)
      .attr("y", margin.top + 140)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "#F89F5B");

    newSvg.append("text")
      .attr("x", width - margin.right - 30)
      .attr("y", margin.top + 152)
      .attr("alignment-baseline", "middle")
      .text(": 1-10 unicorns");

    // Render map
    newSvg.selectAll(".country")
      .data(worldData.features)
      .enter().append("path")
      .attr("class", "country")
      .attr("d", path)
      .style("fill", (d) => {
        const countryName = d.properties.name;
        const unicornPopulation = unicornDataById[countryName] || 0; // Default to 0 if data is missing
        return color(unicornPopulation);
      })
      .style("stroke", "gray") // Add stroke color for country boundaries
      .style("stroke-width", 0.5) // Add stroke width for country boundaries
      .on("mouseover", (event, d) => {
        const countryName = d.properties.name;
        if (countryName && unicornDataById[countryName]) {
          d3.select(event.currentTarget)
            .style("fill", "yellow");

          // Show dynamic tooltip next to mouse cursor
          showTooltip(event, countryName, unicornDataById[countryName]);
        }
      })
      .on("mouseout", (event, d) => {
        const countryName = d.properties.name;
        if (countryName && unicornDataById[countryName]) {
          d3.select(event.currentTarget)
            .style("fill", color(unicornDataById[countryName]));
          // Remove the tooltip when mouse moves out
          hideTooltip();
        }
      })
      .on("click", (event, d) => {
        const countryName = d.properties.name;
        setSelectedRegion(countryName);
        onSelectRegion(countryName); // Pass selected region to parent component
      });

      const showTooltip = (event, countryName, unicornCount) => {
      const tooltip = document.createElement("div");
      tooltip.innerHTML = `<strong>${countryName}</strong><br>Unicorn Companies: ${unicornCount}`;
      tooltip.style.position = "absolute";
      tooltip.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
      tooltip.style.border = "2px solid #ccc";
      tooltip.style.borderRadius = "px";
      tooltip.style.padding = "15px";
      tooltip.style.fontFamily = "Papyrus";
      tooltip.style.fontSize = "20px";
      tooltip.style.left = `${event.pageX + 10}px`;
      tooltip.style.top = `${event.pageY - 28}px`;
      tooltip.id = "map-tooltip";
      document.body.appendChild(tooltip);
    };

    const hideTooltip = () => {
      const tooltip = document.getElementById("map-tooltip");
      if (tooltip) {
        tooltip.parentNode.removeChild(tooltip);
      }
    };
  };

  return (
    <div id="map-container" style={{ width: "100%", height: "100%", position: "relative" }}>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : null}
    </div>
  );
}

export { UnicornMap };