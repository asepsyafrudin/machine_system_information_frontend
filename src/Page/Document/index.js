import axios from "axios";
import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Footer from "../../Component/Footer";
import Header from "../../Component/Header";
import { getDocumentByIdApi } from "../../Config/API";
import "./document.css";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import { GoDesktopDownload } from "react-icons/go";

function Document() {
  const { id } = useParams();
  const [tableDocument, setTableDocument] = useState([]);
  useEffect(() => {
    axios.get(getDocumentByIdApi(id)).then((response) => {
      setTableDocument(response.data.data);
    });
  });

  const colorBadge = () => {
    if (tableDocument) {
      switch (tableDocument[0].file_type) {
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

  const content = () => {
    if (tableDocument.length !== 0) {
      return (
        <>
          <div className="titleDocumentDetailPage">
            {tableDocument[0].title}
          </div>
          <div className="jenisDocument">
            <Badge bg={colorBadge()}>{tableDocument[0].file_type}</Badge>
          </div>
          <Row style={{ textAlign: "left" }}>
            <Col sm={2}>Author</Col>
            <Col sm={8}>
              : {CapitalCaseFirstWord(tableDocument[0].username)}
            </Col>
          </Row>
          <Row style={{ textAlign: "left" }}>
            <Col sm={2}>Creation Date</Col>
            <Col sm={8}>: {tableDocument[0].create_date}</Col>
          </Row>
          <Row style={{ textAlign: "left" }}>
            <Col sm={2}>Product</Col>
            <Col sm={8}>: {tableDocument[0].product_name}</Col>
          </Row>
          <Row style={{ textAlign: "left" }}>
            <Col sm={2}>Line</Col>
            <Col sm={8}>: {tableDocument[0].line_name}</Col>
          </Row>
          <Row style={{ textAlign: "left" }}>
            <Col sm={2}>Machine</Col>
            <Col sm={8}>: {tableDocument[0].machine_name}</Col>
          </Row>
          <Row style={{ textAlign: "left" }}>
            <Col sm={2}>Description </Col>
            <Col sm={8}>: {tableDocument[0].description}</Col>
          </Row>
          {tableDocument[0].file.length !== 0 && (
            <Table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>File Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableDocument[0].file.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{value.name}</td>
                      <td>
                        <a href={value.file} target="_blank" rel="noreferrer">
                          <Button size="sm">
                            <GoDesktopDownload style={{ marginRight: 5 }} />
                            Download
                          </Button>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </>
      );
    }
  };

  return (
    <div className="documentContainer">
      <Header />
      <div className="documentContent">{content()}</div>
      <Footer />
    </div>
  );
}

export default Document;
