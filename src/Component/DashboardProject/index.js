import React from "react";
import { Col, Row } from "react-bootstrap";
import GraphBarProject from "../GraphBarProject";
import GraphPieProject from "../GraphPieProject";

function DashboardProject(props) {
  const { userId } = props;
  return (
    <div>
      <Row>
        <Col lg={6}>
          <div className="capabilityFormContainer">
            <div className="capabilityForm">
              {" "}
              Project Monitoring
              <GraphBarProject userId={userId} />
            </div>
          </div>
        </Col>
        <Col lg={6}>
          <div className="capabilityFormContainer">
            <div className="capabilityForm">
              {" "}
              Project Status
              <GraphPieProject userId={userId} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardProject;
