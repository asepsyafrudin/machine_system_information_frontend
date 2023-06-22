import React, { useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import TotalProject from "../TotalProject";
import Project from "../Project";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { VscProject } from "react-icons/vsc";

function NavigationProject() {
  const [actionState, setActionState] = useState(1);
  return (
    <Tab.Container
      id="left-tabs-admin"
      defaultActiveKey={"totalProject"}
      className="containerNavigation"
    >
      <Row>
        <Col sm={2} className="navigationAdmin">
          <div className="menuListAdmin tabTitle">Project Dashboard</div>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey={"totalProject"} className="tabTitle">
                <AiOutlineFundProjectionScreen style={{ marginRight: 5 }} />{" "}
                Total Project
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={"project"} className="tabTitle">
                <VscProject style={{ marginRight: 5 }} />
                Project
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={10}>
          <Tab.Content className="tabViewMenuAdmin">
            <Tab.Pane eventKey={"totalProject"}>
              <TotalProject
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"project"}>
              <Project
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
              />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}

export default NavigationProject;
