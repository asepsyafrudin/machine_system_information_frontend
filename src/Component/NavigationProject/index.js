import React, { useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import TotalProject from "../TotalProject";
import Project from "../Project";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { AiOutlineHistory, AiOutlineInbox } from "react-icons/ai";
import { VscProject } from "react-icons/vsc";
import { BsBack } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { GlobalConsumer } from "../../Context/store";
import { SETPROJECTEVENT } from "../../Context/const";
import { useEffect } from "react";
import ToDoListSummary from "../ToDoListSummary";
import AssignmentSummary from "../AssignmentSummary";
import ScheduleReview from "../ScheduleAnalysis";
import axios from "axios";
import {
  getAllProductApi,
  getAllProjectApi,
  getAllUsersApi,
  getProjectBySectionIdAndPage,
  getProjectByUserApi,
} from "../../Config/API";

function NavigationProject(props) {
  const { projectEvent, dispatch } = props;
  const [actionState, setActionState] = useState(1);
  const [tableUser, setTableUser] = useState([]);
  const [tableProduct, setTableProduct] = useState([]);
  const [tableProject, setTableProject] = useState([]);
  const [dataForGraph, setDataForGraph] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userPosition, setUserPosition] = useState("");
  const [userSection, setUserSection] = useState("");
  const [userId, setUserId] = useState("");
  const [admin, setAdmin] = useState(false);
  const [userData, setUserData] = useState("");
  const [totalProject, setTotalProject] = useState([]);

  const handleEvent = (eventName) => {
    dispatch({
      type: SETPROJECTEVENT,
      payload: eventName,
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(getAllProductApi)
      .then((response) => {
        setTableProduct(response.data.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(getAllUsersApi)
      .then((response) => {
        const tableUserSort = response.data.data;
        setTableUser(
          tableUserSort.sort((nameA, nameB) => {
            let a = nameA.username;
            let b = nameB.username;

            if (a < b) {
              return -1;
            }
            if (a > b) {
              return 1;
            }
            return 0;
          })
        );
      })
      .catch((error) => console.log(error));

    const user = JSON.parse(localStorage.getItem("user"));
    setUserData(user);
    setUserId(user.id);
    setUserEmail(user.email);
    const position = user.position;
    setUserPosition(position);
    const section_id = user.section_id;
    setUserSection(section_id);
    const positionThatCanOpenProject = [
      "Departement Manager",
      "Assistant General Manager",
      "General Manager",
      "Director",
      "President",
    ];

    const checkPosition = positionThatCanOpenProject.find(
      (value) => value === position
    );

    if (user.position === "Administrator") {
      setAdmin(true);
      axios
        .get(getAllProjectApi)
        .then((response) => {
          const responseData = response.data.data;
          setDataForGraph(responseData);
          setTableProject(responseData);
          setTotalProject(responseData);
        })
        .then((error) => console.log(error));
    } else if (checkPosition) {
      axios
        .get(getProjectBySectionIdAndPage(1, section_id))
        .then((response) => {
          const responseData = response.data.data;
          setDataForGraph(responseData);
          setTableProject(responseData);
          setTotalProject(responseData);
        })
        .catch((error) => console.log(error));
    } else {
      if (userId) {
        axios
          .get(getProjectByUserApi(userId))
          .then((response) => {
            const responseData = response.data.data;
            setDataForGraph(responseData);
            setTableProject(responseData);
            setTotalProject(responseData);
          })
          .catch((error) => {
            console.error("Error in axios get request:", error);
          });
      }
    }
  }, [userId]);

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
                tableUser={tableUser}
                tableProduct={tableProduct}
                tableProject={tableProject}
                userId={userId}
                userData={userData}
                userEmail={userEmail}
                userPosition={userPosition}
                userSection={userSection}
                admin={admin}
                dataForGraph={dataForGraph}
                totalProject={totalProject}
                onChangeTableProject={(e) => setTableProject(e)}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"project"}>
              <Project
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
                tableUser={tableUser}
                tableProduct={tableProduct}
                tableProject={tableProject}
                userId={userId}
                userData={userData}
                userEmail={userEmail}
                userPosition={userPosition}
                userSection={userSection}
                admin={admin}
                dataForGraph={dataForGraph}
                totalProject={totalProject}
                onChangeTableProject={(e) => setTableProject(e)}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"myDashboard"}>
              <ToDoListSummary
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
                tableUser={tableUser}
                tableProduct={tableProduct}
                tableProject={tableProject}
                userId={userId}
                userData={userData}
                userEmail={userEmail}
                userPosition={userPosition}
                userSection={userSection}
                admin={admin}
                dataForGraph={dataForGraph}
                totalProject={totalProject}
                onChangeTableProject={(e) => setTableProject(e)}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"assignmentSummary"}>
              <AssignmentSummary
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
                tableUser={tableUser}
                tableProduct={tableProduct}
                tableProject={tableProject}
                userId={userId}
                userData={userData}
                userEmail={userEmail}
                userPosition={userPosition}
                userSection={userSection}
                admin={admin}
                dataForGraph={dataForGraph}
                totalProject={totalProject}
                onChangeTableProject={(e) => setTableProject(e)}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"scheduleAnalysis"}>
              <ScheduleReview
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
                tableUser={tableUser}
                tableProduct={tableProduct}
                tableProject={tableProject}
                userId={userId}
                userData={userData}
                userEmail={userEmail}
                userPosition={userPosition}
                userSection={userSection}
                admin={admin}
                dataForGraph={dataForGraph}
                totalProject={totalProject}
                onChangeTableProject={(e) => setTableProject(e)}
              />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}

export default GlobalConsumer(NavigationProject);
