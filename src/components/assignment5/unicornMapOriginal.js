import React, { useEffect, useState } from "react";
import * as d3 from "d3"; // Import D3 library

function UnicornMap(props) {
  const { width, height } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const renderMap = (worldData, unicornData) => {
    const unicornDataById = {};
    unicornData.forEach((d) => {
      // Convert unicorn_num to a number
      unicornDataById[d.country] = +d.unicorn_num;
    });

    // Define a purple color scale using D3's interpolatePurple
    const color = d3.scaleLinear()
      .domain([0, 1, 5, 10, 20, 500]) // Adjust the domain to reflect your data
      .range([
        "#FFF5F6", "#e65c9c", "#cf268a", "#af1281", "#6b0772", "#360167"
      ]); // Use interpolatePurple for purple shades

    const projection = d3.geoMercator()
      .fitSize([width, height], worldData); // Fit the projection to the provided width and height

    const path = d3.geoPath().projection(projection);

    const svg = d3.select("#map-container");

    // Clear existing SVG content
    svg.selectAll("svg").remove();

    // Append a new SVG
    const newSvg = svg
      .append("svg")
      .attr("width", width)
      .attr("height", height * 3/4)
      .attr("viewBox", `0 0 ${width} ${height * 3/4}`) // Use viewBox to control SVG view
      .style("margin-left", "0%")
      .style("margin-right", "0%")
      .style("margin-up", "0%")
      .style("margin-down", "0%"); // Adjust left margin for alignment


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