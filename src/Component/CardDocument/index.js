import React from "react";
import { Badge, Col, Row } from "react-bootstrap";
import "./cardDocument.css";
import "@fontsource/roboto";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import { Link } from "react-router-dom";
import moment from "moment";

function CardDocument(props) {
  const { title, fileType, username, description, createDate, id } = props;

  const colorBadge = () => {
    if (fileType) {
      switch (fileType) {
        case "Engineering Document":
          return "primary";
        case "Engineering Report":
          return "success";
        case "Kakotora":
          return "secondary";
        case "Update News":
          return "info";
        case "Others":
          return "dark";
        default:
          break;
      }
    }
  };

  return (
    <div className="cardDocumentContainer">
      <Row>
        <Col xs={12} md={8}>
          <div className="titleDocument">
            <Link className="linkTitle" to={`/document/${id}`}>
              {CapitalCaseFirstWord(title)}
            </Link>
          </div>
        </Col>
        <Col xs={6} md={4}>
          <div className="jenisDocument">
            <Badge bg={colorBadge()}>{fileType}</Badge>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="description_document">{description}</div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="createdByDocument">
            <span>
              Created by : {CapitalCaseFirstWord(username)} , Last Update :{" "}
              {moment(createDate).fromNow()}
            </span>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default CardDocument;
