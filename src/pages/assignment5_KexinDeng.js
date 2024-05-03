import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { UnicornMap } from "../components/assignment5/unicornMap";
import { BarChart } from "../components/assignment5/barChart";
import { IndustryTree } from "../components/assignment5/industryTree";
import { AirportMap } from "../components/assignment5/airportMap";
import { groupByAirline, groupByAirport } from "../components/assignment5/utils";
import { csv, json } from "d3";
import styles from '../styles/assignment5_styles.module.css'; // Import CSS styles

// Helper functions to fetch and process data
function useData(csvPath) {
  const [dataAll, setData] = React.useState(null);
  React.useEffect(() => {
    csv(csvPath).then(data => {
      data.forEach(d => {
        d.SourceLatitude = +d.SourceLatitude
        d.SourceLongitude = +d.SourceLongitude
        d.DestLatitude = +d.DestLatitude
        d.DestLongitude = +d.DestLongitude
      });
      setData(data);
    });
  }, []);
  return dataAll;
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

function Final() {
  const csvUrl = 'https://gist.githubusercontent.com/hogwild/9367e694e12bd2616205e4b3e91285d5/raw/9b451dd6bcc148c3553f550c92096a1a58e1e1e5/airline-routes.csv';
  const mapUrl = 'https://gist.githubusercontent.com/hogwild/26558c07f9e4e89306f864412fbdba1d/raw/5458902712c01c79f36dc28db33e345ee71487eb/countries.geo.json';

  const routes = useData(csvUrl);
  const map = useMap(mapUrl);
  const [selectedAirline, setselectedAirline] = React.useState(null);

  if (!map || !routes) {
    return <pre>Loading...</pre>;
  }

  let airlines = groupByAirline(routes);
  let airports = groupByAirport(routes);

  const barchart_width = 350;
  const barchart_height = 400;
  const barchart_margin = { top: 10, bottom: 20, left: 130, right: 10 };
  const barchart_inner_width = barchart_width - barchart_margin.left - barchart_margin.right;
  const barchart_inner_height = barchart_height - barchart_margin.top - barchart_margin.bottom;
  const map_width = 1000;
  const map_height = 900;
  const treemap_width = 1000;
  const treemap_height = 500;

  return (
    <Container className={styles.container}>
      <Row className={"justify-content-md-left"}>
        <Col lg={20} className={styles.h1Style}>
          <h1>Fantastic Unicorns and Where to Find Them</h1>
          <h4>Unicorn companies are a select group of privately held startups that have achieved a valuation of over $1 billion. These companies are renowned for their exceptional growth, disruptive innovation, and substantial market potential.</h4>
          <h4>Does the industry factor play a role in the success of these companies? Which are the most valuable in the world? This project takes its name from the movie Fantastic Beasts and Where to Find Them, and explores Fantastic Unicorns and Where to Find Them.</h4>
        </Col>
      </Row>
      <Row className={"justify-content-md-left"}>
        <Col lg={20} className={styles.h0Style}>
          <h1>Country View</h1>
          <h4>Are you curious where do the unicorn companies reside in?</h4>
          <h4>Hover the mouse to examine the distribution of unicorns</h4>
        </Col>
      </Row>
      <Row className={"justify-content-md-left"}>
        <Col lg={8} className={styles.svgStyle1}>
        <h2>Unicorn Map</h2>
          <UnicornMap
            width={map_width}
            height={map_height}
          />
        </Col>
        <Col lg={4} className={styles.svgStyle1}>
          <h2>Airlines</h2>
          <svg id={"barchart"} width={barchart_width} height={barchart_height}></svg>
        </Col>
      </Row>
      <Row className={"justify-content-md-left"}>
        <Col lg={20} className={styles.h2Style}>
          <h1>Industry View</h1>
          <h4>Ever wonder which industry leads to a unicorn?</h4>
          <h4>Hover the mouse to examine the industry tree map of unicorns</h4>
        </Col>
      </Row>
      <Row className={"justify-content-md-left"}>
        <Col lg={5} className={`${styles.svgContainer}`}>
          <h2 className="text-center">Industry Tree Map</h2>
            <div className={`${styles.svgWrapper}`}>
              <IndustryTree width={treemap_width} height={treemap_height} />
            </div>
        </Col>
        <Col lg={7} className={styles.svgStyle}>
          <h2>Airports</h2>
          <AirportMap
            width={map_width}
            height={map_height}
            countries={map}
            airports={airports}
            routes={routes}
            selectedAirline={selectedAirline}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Final;