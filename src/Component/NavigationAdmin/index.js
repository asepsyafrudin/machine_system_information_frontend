import React, { useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import LineList from "../LineList";
import MachineList from "../MachineList";
import ProductList from "../ProductList";
import UserList from "../UserList";
import VideoListAdmin from "../VideoListAdmin";
import "./navigationAdmin.css";
import { CgUserlane } from "react-icons/cg";
import { SiAbstract, SiAtom } from "react-icons/si";
import { AiFillEdit, AiOutlinePicCenter } from "react-icons/ai";
import { BiGridAlt } from "react-icons/bi";
import { MdOutlineVideoSettings } from "react-icons/md";
import DocumentRegister from "../DocumentRegister";
import { ImAttachment } from "react-icons/im";
import UserDashboard from "../UserDashboard";
import { GrSettingsOption } from "react-icons/gr";
import EngineeringTools from "../EngineeringTools";
import { SlGraph } from "react-icons/sl";
import { BsBack } from "react-icons/bs";
import { Link } from "react-router-dom";
import SectionList from "../SectionList";
import { GlobalConsumer } from "../../Context/store";
import { SETUSEREVENT } from "../../Context/const";
import ApprovalRule from "../ApprovalRule";

function NavigationAdmin(props) {
  const { userEvent, dispatch } = props;
  const [actionState, setActionState] = useState(1);

  const handleEvent = (eventName) => {
    dispatch({
      type: SETUSEREVENT,
      payload: eventName,
    });
  };
  return (
    <Tab.Container
      id="left-tabs-admin"
      defaultActiveKey={userEvent}
      className="containerNavigation"
    >
      <Row>
        <Col sm={2} className="navigationAdmin">
          <div className="menuListAdmin tabTitle">Admin Dashboard</div>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link
                eventKey={"userDashboard"}
                onClick={() => handleEvent("userDashboard")}
                className="tabTitle"
              >
                <GrSettingsOption style={{ marginRight: 5 }} /> Admin Profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey={"userList"}
                onClick={() => handleEvent("userList")}
                className="tabTitle"
              >
                <CgUserlane style={{ marginRight: 5 }} /> User List
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey={"sectionList"}
                onClick={() => handleEvent("sectionList")}
                className="tabTitle"
              >
                <SiAbstract style={{ marginRight: 5 }} /> Section List
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey={"productList"}
                onClick={() => handleEvent("productList")}
                className="tabTitle"
              >
                <SiAtom style={{ marginRight: 5 }} /> Product List
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey={"lineList"}
                onClick={() => handleEvent("lineList")}
                className="tabTitle"
              >
                <AiOutlinePicCenter style={{ marginRight: 5 }} />
                Line List
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey={"machineList"}
                onClick={() => handleEvent("machineList")}
                className="tabTitle"
              >
                <BiGridAlt style={{ marginRight: 5 }} /> Machine List
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
                eventKey={"documentRegister"}
                onClick={() => handleEvent("documentRegister")}
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
            <Nav.Item>
              <Nav.Link
                eventKey={"approvalRule"}
                onClick={() => handleEvent("approvalRule")}
                className="tabTitle"
              >
                <AiFillEdit style={{ marginRight: 5 }} />
                Approval Rule Set Up
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
            <Tab.Pane eventKey={"sectionList"}>
              <SectionList
                title={"Section Registration"}
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"userList"}>
              <UserList
                title={"User Registration"}
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"productList"}>
              <ProductList
                title={"Product Registration"}
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"lineList"}>
              <LineList
                title={"Line Registration"}
                actionState={(value) => setActionState(actionState + value)}
                actionStateValue={actionState}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"machineList"}>
              <MachineList
                title={"Machine Registration"}
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
            <Tab.Pane eventKey={"documentRegister"}>
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
            <Tab.Pane eventKey={"approvalRule"}>
              <ApprovalRule
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

export default GlobalConsumer(NavigationAdmin);
