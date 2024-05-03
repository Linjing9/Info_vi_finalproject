import React, { useState, useRef } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { UnicornMap } from "../components/assignment5/unicornMapLinjing";
import { TopCompaniesChart } from "../components/assignment5/unicornBarChart1";
import { IndustryTree } from "../components/assignment5/industryTree1";
import { LineChart } from "../components/assignment5/lineChart";
import styles from '../styles/assignment5_styles.module.css'; 
import {PieChart} from "../components/assignment5/pieChart";

function Final() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  
  const sec1Ref = useRef(null);
  const sec2Ref = useRef(null);
  const sec3Ref = useRef(null);
  const sec4Ref = useRef(null);

  const scrollToSection = (sectionRef) => {
    window.scrollTo({
      top: sectionRef.current.offsetTop,
      behavior: "smooth"
    });
  };

  const handleMouseOver = (region) => {
    setSelectedRegion(region);
  };

  const handleMouseOut = () => {
    setSelectedRegion(null);
  };

  const handleSelectRegion = (region) => {
    setSelectedRegion(region);
  };

  const map_width = 1300;
  const map_height = 500;
  const treemap_width = 1000;
  const treemap_height = 500;
  const linechart_width = 1500;
  const linechart_height = 450;
  const barchart_width = 700;
  const barchart_height=300;
  const piechart_width = 700;
  const piechart_height=300;
  const piechart_radius=100;

  return (
    <Container className={styles.container}>
      <section id="sec-1" ref={sec1Ref}>
        <Row className={"justify-content-md-left"}>
          <Col lg={20} className={styles.h1Style}>
          <h1 style={{
              fontFamily: 'cursive',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#ff00ff',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              textAlign: 'center',
              marginBottom: '30px'
            }}>Fantastic Unicorns and Where to Find Them</h1>
            <h4>Unicorn companies are a select group of privately held startups that have achieved a valuation of over $1 billion. These companies are renowned for their exceptional growth, disruptive innovation, and substantial market potential.</h4>
            <h4>Does the industry factor play a role in the success of these companies? Which are the most valuable in the world? This project takes its name from the movie Fantastic Beasts and Where to Find Them, and explores Fantastic Unicorns and Where to Find Them.</h4>
            <div style={{ marginBottom: '30px' }}></div>
            <div className="Final"> 
              <div className="Menu">
                <ul>
                  <h4>Want to go to Country View? Click below</h4>
                  <li 
                    className="link" 
                    onClick={() => scrollToSection(sec2Ref)} 
                    style={{
                      color: 'yellow',
                      fontSize: 'x-large',
                      marginBottom: '10px'
                    }}>
                    Country View CLICK ME
                  </li>
                  <h4>Want to go to Industry View? Click below</h4>
                  <li 
                    className="link" 
                    onClick={() => scrollToSection(sec3Ref)} 
                    style={{
                      color: 'yellow',
                      fontSize: 'x-large',
                      marginBottom: '10px'
                    }}>
                    Industry View CLICK ME
                    </li>
                  <h4>Want to go to Time View? Click below</h4>
                  <li 
                    className="link" 
                    onClick={() => scrollToSection(sec4Ref)} 
                    style={{
                      color: 'yellow',
                      fontSize: 'x-large'
                    }}>
                    Time Horizon View CLICK ME
                    </li>                </ul>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      <section id="sec-2" ref={sec2Ref}>
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
              onSelectRegion={handleSelectRegion} // Pass onSelectRegion function to UnicornMap
            />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="bar-chart">
        {selectedRegion && (
        <>
          <h2>Bar Chart for {selectedRegion}</h2>
          <div className="bar-chart"></div>
          <TopCompaniesChart
            width={barchart_width}
            height={barchart_height}
            selectedRegion={selectedRegion}
          />
        </>
        )}
        </div>

        <div className="pie-chart">
        {selectedRegion && (
        <>
          <h2>Pie Chart for {selectedRegion}</h2>
          <PieChart
            width={piechart_width}
            height={barchart_height}
            radius={piechart_radius} 
            selectedRegion={selectedRegion} // Pass selected region to PieChart component
            />
            </>
          )}
          </div>
          </div>

            <div className="scroll-down-row">
              <div className="arrow-container animated fadeInDown">
                <div className="arrow-2">
                  <i className="fa fa-angle-down"></i>
                </div>
                <div className="arrow-1 animated hinge infinite zoomIn"></div>
                <button className="scroll-button">Scroll Down</button>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      <section id="sec-3" ref={sec3Ref}>
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
        </Row>
        <Row className="scroll-down-row">
          <div className="arrow-container animated fadeInDown">
            <div className="arrow-2">
              <i className="fa fa-angle-down"></i>
            </div>
            <div className="arrow-1 animated hinge infinite zoomIn"></div>
            <button className="scroll-button">Scroll Down</button>
          </div>
        </Row>
      </section>

      <section id="sec-4" ref={sec4Ref}>
        <Row className={"justify-content-md-left"}>
          <Col lg={20} className={styles.h4Style}>
            <h1>Time Horizon</h1>
            <h4>Ever wonder to what extent does the rise of Unicorn companies correlate with world GDP?</h4>
            <h4>The time series line chart below may offer the answer</h4>
          </Col>
        </Row>
        <Row className={"justify-content-md-left"}>
          <Col lg={5} className={`${styles.svgContainer}`}>
            <h2 className="text-center">Time Series Comparison Line Chart</h2>
            <div className={`${styles.svgWrapper}`}>
              <LineChart width={linechart_width} height={linechart_height} />
            </div>
          </Col>
        </Row>
      </section>
    </Container>
  );
}

export default Final;