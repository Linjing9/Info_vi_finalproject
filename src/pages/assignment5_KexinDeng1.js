import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import { csv, json } from "d3";
import { Row, Col, Container } from "react-bootstrap";

import { groupByAirline, groupByAirport } from "../components/assignment5/utils";
import { AirportMap }  from "../components/assignment5/airportMap";
import { BarChart } from "../components/assignment5/barChart";
// Import the CSS file
import styles from '../styles/assignment5_styles.module.css';


// try load the csv
const mapUrl = 'https://gist.githubusercontent.com/hogwild/26558c07f9e4e89306f864412fbdba1d/raw/5458902712c01c79f36dc28db33e345ee71487eb/countries.geo.json';

  
  function final() {
    const [selectedAirline, setselectedAirline] = React.useState(null);
    const [unicornsData, setUnicornsData] = useState(null);
    const csvUrlunicorn = '../src/data/List_of_Unicorns_in_the_World.csv';
    
    useEffect(() => {
      const fetchUnicornsData = async () => {
        try {
          const data = await csv(csvUrlunicorn);
          setUnicornsData(data);
        } catch (error) {
          console.error('Error fetching unicorn data:', error);
        }
      };

      fetchUnicornsData();
    }, []); // Empty dependency array ensures the effect runs only once after the initial render

    if (!unicornsData) {
      return <div>Non...</div>;
    }
    
    function useMap(jsonPath) {
      const [data, setData] = React.useState(null);
      React.useEffect(() => {
        json(jsonPath).then(geoJsonData => {
          setData(geoJsonData);
        })
      }, []);
      return data;
    }

    let airlines = groupByAirline(routes);
    let airports = groupByAirport(routes);
  
    return (
      <Container className={styles.container}>
        <Row className={"justify-content-md-left"}>
          <Col lg={20} className={styles.h1Style}>
            <h1>Fantastic Unicorns and Where to Find Them</h1>
          </Col>
        </Row>
        <Row className={"justify-content-md-left"}>
          <Col lg={5} className={styles.svgStyle}>
            <h2>Airlines</h2>
            <svg id={"barchart"} width={barchart_width} height={barchart_height}>
              <BarChart
                offsetX={barchart_margin.left}
                offsetY={barchart_margin.top}
                height={barchart_inner_height}
                width={barchart_inner_width}
                data={airlines}
                selectedAirline={selectedAirline}
                setselectedAirline={setselectedAirline}
              />
            </svg>
          </Col>
          <Col lg={7} className={styles.svgStyle}>
            <h2>Airports</h2>
            <svg id={"map"} width={map_width} height={map_height}>
              <AirportMap
                width={map_width}
                height={map_height}
                countries={map}
                airports={airports}
                routes={routes}
                selectedAirline={selectedAirline}
              />
            </svg>
          </Col>
        </Row>
        <Row className="justify-content-md-left">
        <Col lg={5} className={styles.svgStyle}>
            <h2>Airlines</h2>
            <ul>
              {unicornsData.map((unicorn) => (
                <li key={unicorn.id}>
                  {unicorn.Company} - Valuation: {unicorn['Valuation ($B)']} - Country: {unicorn.Country}
                </li>
              ))}
            </ul>
          </Col>
      </Row>
      </Container>
    );
  }
  
  export default final;