import React, { useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import TotalProject from "../TotalProject";
import Project from "../Project";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { AiOutlineHistory, AiOutlineInbox } from "react-icons/ai";
import { VscProject } from "react-icons/vsc";
import { BsBack } from "react-icons/bs";
import { Link } from "react-router-dom";
import { GlobalConsumer } from "../../Context/store";
import { SETPROJECTEVENT } from "../../Context/const";
import { useEffect } from "react";
import ToDoListSummary from "../ToDoListSummary";
import AssignmentSummary from "../AssignmentSummary";
import ScheduleReview from "../ScheduleAnalysis";

function NavigationProject(props) {
  const { projectEvent, dispatch } = props;
  const [actionState, setActionState] = useState(1);
  const [userId, setUserId] = useState("");

  const handleEvent = (eventName) => {
    dispatch({
      type: SETPROJECTEVENT,
      payload: eventName,
    });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.id;
    setUserId(userId);
  }, []);
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
                My Project
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey={"myDashboard"}
                onClick={() => handleEvent("myDashboard")}
                className="tabTitle"
              >
                <AiOutlineFundProjectionScreen style={{ marginRight: 5 }} />
                Todo List Summary
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey={"assignmentSummary"}
                onClick={() => handleEvent("assignmentSummary")}
                className="tabTitle"
              >
                <AiOutlineHistory style={{ marginRight: 5 }} />
                Assignment List Summary
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey={"scheduleAnalysis"}
                onClick={() => handleEvent("scheduleAnalysis")}
                className="tabTitle"
              >
                <AiOutlineInbox style={{ marginRight: 5 }} />
                Schedule Review
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
            <Tab.Pane eventKey={"myDashboard"}>
              <ToDoListSummary
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
                userId={userId}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"assignmentSummary"}>
              <AssignmentSummary
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
                userId={userId}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"scheduleAnalysis"}>
              <ScheduleReview />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}

export default GlobalConsumer(NavigationProject);
