import React from "react";
import { Badge, Col, Form, Row, Table } from "react-bootstrap";
import "./totalProject.css";
import { useState } from "react";
import { useEffect } from "react";
import {
  getAllProductApi,
  getAllProjectApi,
  getAllUsersApi,
} from "../../Config/API";
import axios from "axios";
import { FaMoneyBillWaveAlt } from "react-icons/fa";
import { BiWallet } from "react-icons/bi";
import { BsListTask } from "react-icons/bs";
import PaginationTable from "../Pagination";
import { RiStarLine } from "react-icons/ri";
import moment from "moment/moment";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import { STATUSFINISH } from "../../Config/const";

function TotalProject(props) {
  const { actionStateValue } = props;
  const [filter, setFilter] = useState("");
  const [tableUser, setTableUser] = useState([]);
  const [totalItem, setTotalItem] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [totalSavingCost, setTotalSavingCost] = useState("");
  const [tableProduct, setTableProduct] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPageData, setStotalPageData] = useState(1);
  const [project, setProject] = useState([]);
  const [numberStart, setNumberStart] = useState("");

  const maxPagesShow = 3;
  useEffect(() => {
    axios
      .get(getAllProductApi)
      .then((response) => {
        setTableProduct(response.data.data);
      })
      .catch((error) => console.log(error));

    if (filter === "") {
      axios
        .get(getAllProjectApi(page))
        .then((response) => {
          const data = response.data.data;
          setProject(data);
          setStotalPageData(response.data.totalPageData);
          setNumberStart(response.data.numberStart);
          setTotalItem(data.length);
          let budget = 0;
          let saving = 0;
          if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
              budget += parseFloat(data[index].budget);
              saving += parseFloat(data[index].saving_cost);
            }
          }
          setTotalBudget(budget);
          setTotalSavingCost(saving);
        })
        .catch((error) => console.log(error));
    }

    axios
      .get(getAllUsersApi)
      .then((response) => {
        setTableUser(response.data.data);
      })
      .catch((error) => console.log(error));
  }, [filter, page, actionStateValue]);

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

  const productNameFunction = (id) => {
    const findProduct = tableProduct.find((value) => value.id === parseInt(id));
    if (findProduct) {
      return findProduct.product_name;
    } else {
      return "";
    }
  };

  const userNameFunction = (id) => {
    const findUser = tableUser.find((value) => value.id === parseInt(id));
    if (findUser) {
      return CapitalCaseFirstWord(findUser.username);
    }
    return "";
  };

  const statusFunction = (status, startDate, SOPDate) => {
    if (status === STATUSFINISH) {
      return <Badge bg="primary">Finish</Badge>;
    } else {
      let currentDate = new Date();
      let start = new Date(startDate);
      let sop = new Date(SOPDate);
      if (sop - currentDate < 0) {
        return <Badge bg="danger">Delay</Badge>;
      } else if (currentDate - start > 0) {
        return <Badge bg="success">On Progress</Badge>;
      }
    }
  };

  function convertToInternationalCurrencySystem(labelValue) {
    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e9
      ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
      : // Six Zeroes for Millions
      Math.abs(Number(labelValue)) >= 1.0e6
      ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
      : // Three Zeroes for Thousands
      Math.abs(Number(labelValue)) >= 1.0e3
      ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
      : Math.abs(Number(labelValue));
  }

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
            <span className="valueTotalProject">{totalItem} Items</span>

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
              <FaMoneyBillWaveAlt /> Rp{" "}
              {convertToInternationalCurrencySystem(totalSavingCost)}
            </span>
          </div>
        </Col>
        <Col sm={4}>
          <div className="totalProjectCard">
            <span className="titleTotalProject">Total Budget Est</span>
            <br />
            <span className="valueTotalProject">
              <BiWallet />
              Rp {convertToInternationalCurrencySystem(totalBudget)}
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
                  <th>PIC</th>
                  <th>Budget</th>
                  <th>Saving</th>
                  <th>Start Date</th>
                  <th>SOP Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {project.length > 0 ? (
                  project.map((value, index) => {
                    return (
                      <tr key={index}>
                        <td>{numberStart + index}</td>
                        <td>{value.project_name}</td>
                        <td>{productNameFunction(value.product_id)}</td>
                        <td>{userNameFunction(value.manager_id)}</td>
                        <td>{parseFloat(value.budget).toLocaleString()}</td>
                        <td>
                          {parseFloat(value.saving_cost).toLocaleString()}
                        </td>
                        <td>{moment(value.start).format("LL")}</td>
                        <td>{moment(value.finish).format("LL")}</td>
                        <td>
                          {statusFunction(
                            value.status,
                            value.start,
                            value.finish
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9}>Data is Not Available</td>
                  </tr>
                )}
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
