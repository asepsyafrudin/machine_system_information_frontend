import React, { useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import TotalProject from "../TotalProject";
import Project from "../Project";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { VscProject } from "react-icons/vsc";
import { BsBack } from "react-icons/bs";
import { Link } from "react-router-dom";
import { GlobalConsumer } from "../../Context/store";
import { SETPROJECTEVENT } from "../../Context/const";

function NavigationProject(props) {
  const { projectEvent, dispatch } = props;
  const [actionState, setActionState] = useState(1);

  const handleEvent = (eventName) => {
    dispatch({
      type: SETPROJECTEVENT,
      payload: eventName,
    });
  };
  return (
    <Tab.Container
      id="left-tabs-admin"
      defaultActiveKey={projectEvent}
      className="containerNavigation"
    >
      <Row>
        <Col sm={2} className="navigationAdmin">
          <div className="menuListAdmin tabTitle">Project Dashboard</div>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link
                eventKey={"totalProject"}
                onClick={() => handleEvent("totalProject")}
                className="tabTitle"
              >
                <AiOutlineFundProjectionScreen style={{ marginRight: 5 }} />{" "}
                Total Project
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey={"project"}
                onClick={() => handleEvent("project")}
                className="tabTitle"
              >
                <VscProject style={{ marginRight: 5 }} />
                Project
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={{ marginTop: 30 }}>
              <Link to={"/home"}>
                <BsBack style={{ marginRight: 5 }} />
                Back To Main Menu
              </Link>
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

export default GlobalConsumer(NavigationProject);
