import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

function IndustryTree(props) {
  const { width, height } = props;
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://gist.githubusercontent.com/Programming-git/2a7b6d09e6e628be55708cd1c9a32f1e/raw/b61d8418402fd625d683b994483311c54c3112ee/unicorn_original.csv");
        const csvData = await response.text();
        const data = d3.csvParse(csvData);
        // Parse CSV data
        const parsedData = data.map(item => ({
          Company: item.Company,
          Valuation: parseFloat(item['Valuation ($B)'].replace('$', '').replace(',', '')),
          Country: item.Country,
          Industry: item.Industry
        }));
        // Group data by industry
        const groupedData = d3.group(parsedData, d => d.Industry);
        // Create hierarchy for treemap
        const root = {
          name: 'Industries',
          children: Array.from(groupedData, ([key, values]) => ({
            name: key,
            children: values.map(d => ({ name: d.Company, value: d.Valuation, country: d.Country, industry: d.Industry }))
          }))
        };
        setTreeData(root);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const industryColor = d3.scaleOrdinal(d3.schemeDark2);

  const showTooltip = (event, data) => {
    const tooltip = document.createElement("div");
    const companyname = data.name;
    const countryname = data.country;
    const industryname = data.industry;
    const valueworth = data.value;
    tooltip.innerHTML = `<strong>${companyname}</strong><br/>` +
      `Country: ${countryname}<br/>` +
      `Industry: ${industryname}<br/>` +
      `Valuation: $${valueworth.toFixed(2)}B`;
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    tooltip.style.border = "2px solid #ccc";
    tooltip.style.borderRadius = "4px";
    tooltip.style.padding = "15px";
    tooltip.style.fontFamily = "Papyrus";
    tooltip.style.fontSize = "20px";
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY - 28}px`;
    tooltip.id = "map-tooltip";
    document.body.appendChild(tooltip);

    // Change rectangle fill to yellow on hover
    d3.select(event.currentTarget)
      .attr("fill", "yellow");
  };

  const hideTooltip = (event, data) => {
    const tooltip = document.getElementById("map-tooltip");
    if (tooltip) {
      tooltip.parentNode.removeChild(tooltip);
    }
    // Revert rectangle fill to original color on mouseout
    d3.select(event.currentTarget)
      .attr("fill", industryColor(data.industry));
  };

  return (
    <div style={{ position: 'relative' }}>
      {treeData && (
        <>
          <div style={{ marginBottom: '10px' }}>
          </div>
          <svg width={width} height={height} style={{ marginLeft: '50px' }}>
            <g>
              {d3.treemap().size([width, height]).padding(2)(
                d3.hierarchy(treeData).sum(d => d.value).sort((a, b) => b.value - a.value)
              ).leaves().map((leaf, index) => (
                <g
                  key={index}
                  transform={`translate(${leaf.x0},${leaf.y0})`}
                  onMouseOver={(e) => {
                    d3.select(e.currentTarget.querySelector("rect"))
                      .attr("fill", "yellow");
                    showTooltip(e, leaf.data);
                  }}
                  onMouseOut={(e) => {
                    d3.select(e.currentTarget.querySelector("rect"))
                      .attr("fill", industryColor(leaf.data.industry));
                    hideTooltip(e, leaf.data);
                  }}
                >
                  
                  {/* Render rectangles for parent nodes */}
                  {leaf.depth === 1 && (
                    <rect
                      width={leaf.x1 - leaf.x0}
                      height={leaf.y1 - leaf.y0}
                      fill={industryColor(leaf.data.industry)}
                      stroke="white"
                    />
                  )}

                  {/* Render text for parent nodes */}
                  {leaf.depth === 1 && (
                    <text
                      x={(leaf.x0 + leaf.x1) / 2}
                      y={(leaf.y0 + leaf.y1) / 2}
                      fontSize="2em"
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {leaf.data.industry}
                    </text>
                  )}

                 {/* Render rectangles for leaf nodes */}
                 <rect
                    width={leaf.x1 - leaf.x0}
                    height={leaf.y1 - leaf.y0}
                    fill={industryColor(leaf.data.industry)}
                    stroke="white"
                  />
                </g>
              ))}
            </g>
          </svg>
        </>
      )}
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        {/* Append legend boxes and text */}
        <svg width={500} height={250}>
          {['enterprise tech', 'financial services', 'consumer and retail', 'industrials', 'media & entertainment', 'health care & life sciences', 'insurances'].map((industry, index) => (
            <g key={index}>
              <rect x={140} y={20 + index * 30} width={20} height={20} fill={industryColor(industry)} />
              <text x={170} y={32 + index * 30} alignmentBaseline="middle">{industry}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

export { IndustryTree };

