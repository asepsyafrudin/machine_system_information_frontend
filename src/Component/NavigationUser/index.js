import React, { useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import VideoListAdmin from "../VideoListAdmin";
import { CgUserlane } from "react-icons/cg";
import { MdOutlineVideoSettings } from "react-icons/md";
import UserDashboard from "../UserDashboard";
import DocumentRegister from "../DocumentRegister";
import { ImAttachment } from "react-icons/im";
import EngineeringTools from "../EngineeringTools";
import { SlGraph } from "react-icons/sl";
import { Link } from "react-router-dom";
import { BsBack } from "react-icons/bs";
import { GlobalConsumer } from "../../Context/store";
import { SETUSEREVENT } from "../../Context/const";

function NavigationUser(props) {
  const { userEvent, dispatch } = props;

  const [actionState, setActionState] = useState(1);

  const handleEvent = (eventName) => {
    dispatch({
      type: SETUSEREVENT,
      payload: eventName,
    });
  };
  console.log(userEvent);
  return (
    <Tab.Container
      id="left-tabs-admin"
      defaultActiveKey={userEvent}
      className="containerNavigation"
    >
      <Row>
        <Col sm={2} className="navigationAdmin">
          <div className="menuListAdmin tabTitle">User Dashboard</div>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link
                eventKey={"userDashboard"}
                onClick={() => handleEvent("userDashboard")}
                className="tabTitle"
              >
                <CgUserlane style={{ marginRight: 5 }} /> User Profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey={"videoList"}
                onClick={() => handleEvent("videoList")}
                className="tabTitle"
              >
                <MdOutlineVideoSettings style={{ marginRight: 5 }} />
                Video Upload
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey={"documentList"}
                onClick={() => handleEvent("documentList")}
                className="tabTitle"
              >
                <ImAttachment style={{ marginRight: 5 }} />
                Document Upload
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey={"capabilityMenu"}
                onClick={() => handleEvent("capabilityMenu")}
                className="tabTitle"
              >
                <SlGraph style={{ marginRight: 5 }} />
                Engineering Tools
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
            <Tab.Pane eventKey={"userDashboard"}>
              <UserDashboard
                title={"User Profile"}
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"videoList"}>
              <VideoListAdmin
                title={"Video Registration"}
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"documentList"}>
              <DocumentRegister
                title={"Document Registration"}
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"capabilityMenu"}>
              <EngineeringTools
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

export default GlobalConsumer(NavigationUser);
