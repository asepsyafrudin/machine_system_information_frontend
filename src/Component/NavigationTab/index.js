import React from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import { BsCameraVideo } from "react-icons/bs";
import { HiDocumentText } from "react-icons/hi";
import VideoListComponent from "../VideoListComponent";
import DocumentListComponent from "../DocumentListComponent";
import { BiNews } from "react-icons/bi";
import RecentlyListComponent from "../RecentlyListComponent";
import FTAPage from "../../Page/FTAPage";

function NavigationTab(props) {
  const { searchValue, pageNumber } = props;
  return (
    <Tab.Container defaultActiveKey={"document"}>
      <Row>
        <Col>
          <Nav variant="pills" className="flex-row">
            <Nav.Item>
              <Nav.Link eventKey={"document"}>
                <HiDocumentText style={{ marginRight: 5 }} />
                Document
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={"video"}>
                <BsCameraVideo style={{ marginRight: 5 }} />
                Video
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={"recently"}>
                <BiNews style={{ marginRight: 5 }} />
                Recently
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={"fta"}>
                <BiNews style={{ marginRight: 5 }} />
                Failure Tree Analysis
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
      <Row>
        <Col>
          <Tab.Content>
            <Tab.Pane eventKey={"document"}>
              <DocumentListComponent
                searchValue={searchValue}
                pageNumber={pageNumber}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"video"}>
              <VideoListComponent
                searchValue={searchValue}
                pageNumber={pageNumber}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"recently"}>
              <RecentlyListComponent
                searchValue={searchValue}
                pageNumber={pageNumber}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={"fta"}>
              <FTAPage searchValue={searchValue} pageNumber={pageNumber} />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}

export default NavigationTab;
