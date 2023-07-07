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

function NavigationUser() {
  const [actionState, setActionState] = useState(1);
  return (
    <Tab.Container
      id="left-tabs-admin"
      defaultActiveKey={"userDashboard"}
      className="containerNavigation"
    >
      <Row>
        <Col sm={2} className="navigationAdmin">
          <div className="menuListAdmin tabTitle">User Dashboard</div>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey={"userDashboard"} className="tabTitle">
                <CgUserlane style={{ marginRight: 5 }} /> User Profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={"videoList"} className="tabTitle">
                <MdOutlineVideoSettings style={{ marginRight: 5 }} />
                Video Upload
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={"documentList"} className="tabTitle">
                <ImAttachment style={{ marginRight: 5 }} />
                Document Upload
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={"capabilityMenu"} className="tabTitle">
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
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"videoList"}>
              <VideoListAdmin
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"documentList"}>
              <DocumentRegister
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

export default NavigationUser;
