import React from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import "./totalProject.css";
import { useState } from "react";
import { useEffect } from "react";
import { getAllProductApi } from "../../Config/API";
import axios from "axios";
import { FaMoneyBillWaveAlt } from "react-icons/fa";
import { BiWallet } from "react-icons/bi";
import { BsListTask } from "react-icons/bs";
import PaginationTable from "../Pagination";
import { RiStarLine } from "react-icons/ri";

function TotalProject() {
  const [filter, setFilter] = useState("");
  const [tableProduct, setTableProduct] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPageData, setStotalPageData] = useState(1);

  const maxPagesShow = 3;
  useEffect(() => {
    axios
      .get(getAllProductApi)
      .then((response) => {
        setTableProduct(response.data.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const productOption = () => {
    let option = [];
    if (tableProduct) {
      for (let index = 0; index < tableProduct.length; index++) {
        option.push(
          <option key={index} value={tableProduct[index].id}>
            {tableProduct[index].product_name}
          </option>
        );
      }
    }
    return <>{option}</>;
  };
  return (
    <div>
      <Row>
        <Col>
          <div className="filterTotalProject">
            <Form>
              <Form.Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value={""} disabled>
                  open this to filter
                </option>
                {productOption()}
              </Form.Select>
            </Form>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm={4}>
          <div className="totalProjectCard">
            <span className="titleTotalProject">Total Project</span>
            <br />
            <span className="valueTotalProject">175 Items</span>

            <Row className="progressSummary">
              <Col sm={3} style={{ textAlign: "center" }}>
                <div className="box yellow" title="Not Yet Started" />
                <br />
                20
              </Col>
              <Col sm={3}>
                <div className="box green" title="Project On Progress" /> <br />{" "}
                20
              </Col>
              <Col sm={3}>
                <div className="box blue" title="Project Finish" /> <br /> 20
              </Col>
              <Col sm={3}>
                <div className="box red" title="Project Delay" /> <br /> 20
              </Col>
            </Row>
          </div>
        </Col>
        <Col sm={4}>
          <div className="totalProjectCard">
            <span className="titleTotalProject">Total Saving Est</span>
            <br />
            <span className="valueTotalProject">
              <FaMoneyBillWaveAlt /> Rp 175 Bill
            </span>
          </div>
        </Col>
        <Col sm={4}>
          <div className="totalProjectCard">
            <span className="titleTotalProject">Total Budget Est</span>
            <br />
            <span className="valueTotalProject">
              <BiWallet />
              175 Billion
            </span>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm={8}>
          <div className="projectList">
            <span className="titleTotalProject" style={{ marginBottom: 5 }}>
              <BsListTask style={{ marginRight: 5 }} />
              Project List
            </span>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>NO</th>
                  <th>Project Name</th>
                  <th>Product</th>
                  <th>Manager</th>
                  <th>Budget</th>
                  <th>Saving</th>
                  <th>Ratio</th>
                  <th>SOP Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Project Name</td>
                  <td>Product</td>
                  <td>Manager</td>
                  <td>Budget</td>
                  <td>Saving</td>
                  <td>Ratio</td>
                  <td>SOP Date</td>
                  <td>Status</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Project Name</td>
                  <td>Product</td>
                  <td>Manager</td>
                  <td>Budget</td>
                  <td>Saving</td>
                  <td>Ratio</td>
                  <td>SOP Date</td>
                  <td>Status</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Project Name</td>
                  <td>Product</td>
                  <td>Manager</td>
                  <td>Budget</td>
                  <td>Saving</td>
                  <td>Ratio</td>
                  <td>SOP Date</td>
                  <td>Status</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Project Name</td>
                  <td>Product</td>
                  <td>Manager</td>
                  <td>Budget</td>
                  <td>Saving</td>
                  <td>Ratio</td>
                  <td>SOP Date</td>
                  <td>Status</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Project Name</td>
                  <td>Product</td>
                  <td>Manager</td>
                  <td>Budget</td>
                  <td>Saving</td>
                  <td>Ratio</td>
                  <td>SOP Date</td>
                  <td>Status</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Project Name</td>
                  <td>Product</td>
                  <td>Manager</td>
                  <td>Budget</td>
                  <td>Saving</td>
                  <td>Ratio</td>
                  <td>SOP Date</td>
                  <td>Status</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Project Name</td>
                  <td>Product</td>
                  <td>Manager</td>
                  <td>Budget</td>
                  <td>Saving</td>
                  <td>Ratio</td>
                  <td>SOP Date</td>
                  <td>Status</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Project Name</td>
                  <td>Product</td>
                  <td>Manager</td>
                  <td>Budget</td>
                  <td>Saving</td>
                  <td>Ratio</td>
                  <td>SOP Date</td>
                  <td>Status</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Project Name</td>
                  <td>Product</td>
                  <td>Manager</td>
                  <td>Budget</td>
                  <td>Saving</td>
                  <td>Ratio</td>
                  <td>SOP Date</td>
                  <td>Status</td>
                </tr>
              </tbody>
            </Table>
            <div className="paginationTableProduct">
              <PaginationTable
                totalPage={totalPageData}
                maxPagesShow={maxPagesShow}
                onChangePage={(e) => setPage(e)}
                pageActive={page}
              />
            </div>
          </div>
        </Col>
        <Col sm={4}>
          {" "}
          <div className="projectLaunch">
            <span className="titleTotalProject">Project Launch</span>
            <br />
            <span className="valueTotalProject">
              <RiStarLine />
              Iridum Project Step #1
            </span>
            <div>
              <div>Countdown</div>
              <div>2 Days Remaining</div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default TotalProject;
