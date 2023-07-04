import React from "react";
import { Badge, Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import "./totalProject.css";
import { useState } from "react";
import { useEffect } from "react";
import {
  getAllProductApi,
  getAllProjectApi,
  getAllUsersApi,
  searchProjectApi,
} from "../../Config/API";
import axios from "axios";
import { FaMoneyBillWaveAlt } from "react-icons/fa";
import { BiWallet } from "react-icons/bi";
import { BsListTask } from "react-icons/bs";
import PaginationTable from "../Pagination";
import { RiStarLine } from "react-icons/ri";
import moment from "moment/moment";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";

function TotalProject(props) {
  const { actionStateValue } = props;
  const [productFilter, setProductFilter] = useState("");
  const [startFilter, setStartFilter] = useState("");
  const [endFilter, setEndFilter] = useState("");
  const [tableUser, setTableUser] = useState([]);
  const [totalItem, setTotalItem] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [totalSavingCost, setTotalSavingCost] = useState("");
  const [tableProduct, setTableProduct] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPageData, setStotalPageData] = useState(1);
  const [tableProject, setTableProject] = useState([]);
  const [projectLaunch, setProjectLaunch] = useState("");
  const [show, setShow] = useState(false);
  const [buttonFilter, setButtonFilter] = useState("");

  const maxPagesShow = 3;
  const dataPerPage = 5;

  useEffect(() => {
    const projectWillBeLaunch = (data) => {
      let currentDate = new Date().getTime();
      if (data.length > 0) {
        const sorted = data.sort(
          (a, b) => new Date(a.finish) - new Date(b.finish)
        );
        const closest = sorted.find(
          (o) => new Date(o.finish) - currentDate > 0
        );
        setProjectLaunch(closest);
      } else {
        setProjectLaunch("");
      }
    };

    axios
      .get(getAllProductApi)
      .then((response) => {
        setTableProduct(response.data.data);
      })
      .catch((error) => console.log(error));

    if (productFilter === "") {
      if (startFilter !== "" && endFilter !== "") {
        let data = {
          page: page,
          product_id: productFilter,
          from_date: startFilter,
          to_date: endFilter,
        };

        axios.post(searchProjectApi, data).then((response) => {
          const data = response.data.data;
          setTableProject(data);
          const totalPageData = Math.ceil(data.length / dataPerPage);
          setStotalPageData(totalPageData);
          projectWillBeLaunch(data);
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
        });
      } else {
        axios
          .get(getAllProjectApi)
          .then((response) => {
            const data = response.data.data;
            setTableProject(data);
            const totalPageData = Math.ceil(data.length / dataPerPage);
            setStotalPageData(totalPageData);
            projectWillBeLaunch(data);
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
    } else {
      if (startFilter !== "" && endFilter !== "") {
        let data = {
          page: page,
          product_id: productFilter,
          from_date: startFilter,
          to_date: endFilter,
        };

        axios.post(searchProjectApi, data).then((response) => {
          const data = response.data.data;
          setTableProject(data);
          const totalPageData = Math.ceil(data.length / dataPerPage);
          setStotalPageData(totalPageData);
          projectWillBeLaunch(data);
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
        });
      } else {
        let sendData = {
          page: page,
          product_id: parseInt(productFilter),
          from_date: startFilter,
          to_date: endFilter,
        };

        axios.post(searchProjectApi, sendData).then((response) => {
          const data = response.data.data;
          setTableProject(data);
          const totalPageData = Math.ceil(data.length / dataPerPage);
          setStotalPageData(totalPageData);
          projectWillBeLaunch(data);
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
        });
      }
    }

    axios
      .get(getAllUsersApi)
      .then((response) => {
        setTableUser(response.data.data);
      })
      .catch((error) => console.log(error));
  }, [productFilter, page, actionStateValue, startFilter, endFilter]);

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

  const statusFunction = (status) => {
    if (status === "Finish") {
      return <Badge bg="primary">{status}</Badge>;
    } else if (status === "Not Yet Started") {
      return <Badge bg="warning">{status}</Badge>;
    } else if (status === "Delay") {
      return <Badge bg="danger">{status}</Badge>;
    } else {
      return <Badge bg="success">{status}</Badge>;
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

  const totalNotYetStartedBaseOnStatusProject = (data) => {
    let count = 0;
    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        if (data[index].status === "Not Yet Started") {
          count += 1;
        }
      }
    }
    return count;
  };

  const totalOnProgressBaseOnStatusProject = (data) => {
    let count = 0;
    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        if (data[index].status === "On Progress") {
          count += 1;
        }
      }
    }
    return count;
  };

  const totalDelayBaseOnStatusProject = (data) => {
    let count = 0;
    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        if (data[index].status === "Delay") {
          count += 1;
        }
      }
    }
    return count;
  };

  const totalFinishBaseOnStatusProject = (data) => {
    let count = 0;
    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        if (data[index].status === "Finish") {
          count += 1;
        }
      }
    }
    return count;
  };

  const tableListProject = (page) => {
    const listTable = [];
    if (tableProject.length > 0) {
      for (
        let index = (page - 1) * dataPerPage;
        index < page * dataPerPage && index < tableProject.length;
        index++
      ) {
        listTable.push(
          <tr key={index + 1}>
            <td>{index + 1}</td>
            <td>{tableProject[index].project_name}</td>
            <td>{productNameFunction(tableProject[index].product_id)}</td>
            <td>{userNameFunction(tableProject[index].manager_id)}</td>
            <td>{parseFloat(tableProject[index].budget).toLocaleString()}</td>
            <td>
              {parseFloat(tableProject[index].saving_cost).toLocaleString()}
            </td>
            <td>{moment(tableProject[index].start).format("LL")}</td>
            <td>{moment(tableProject[index].finish).format("LL")}</td>
            <td>{statusFunction(tableProject[index].status)}</td>
          </tr>
        );
      }
    } else {
      listTable.push(
        <tr key={1}>
          <td colSpan={9}>Data is Not Available</td>
        </tr>
      );
    }

    return listTable;
  };

  const tableFilter = (filter) => {
    let dataList = [];
    if (filter) {
      let dataFilter = tableProject.filter((value) => value.status === filter);
      if (dataFilter.length > 0) {
        for (let index = 0; index < dataFilter.length; index++) {
          dataList.push(
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{dataFilter[index].project_name}</td>
              <td>{productNameFunction(dataFilter[index].product_id)}</td>
              <td>{userNameFunction(dataFilter[index].manager_id)}</td>
              <td>{moment(dataFilter[index].start).format("LL")}</td>
              <td>{moment(dataFilter[index].finish).format("LL")}</td>
              <td>{statusFunction(dataFilter[index].status)}</td>
            </tr>
          );
        }
      } else {
        dataList.push(
          <tr key={1}>
            <td colSpan={9}>Data is Not Available</td>
          </tr>
        );
      }
    }

    return dataList;
  };

  const handleButtonFilter = (filter) => {
    setButtonFilter(filter);
    setShow(true);
  };
  return (
    <div>
      <Row>
        <Col>
          <div className="filterTotalProject">
            <Form>
              <Row style={{ textAlign: "left" }}>
                <Form.Group as={Col}>
                  <Form.Label>Select Product</Form.Label>
                  <Form.Select
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                  >
                    <option value={""} disabled>
                      open this to product filter
                    </option>
                    {productOption()}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Start Project</Form.Label>
                  <Form.Control
                    type="date"
                    value={startFilter}
                    onChange={(e) => setStartFilter(e.target.value)}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>End Project</Form.Label>
                  <Form.Control
                    type="date"
                    value={endFilter}
                    onChange={(e) => setEndFilter(e.target.value)}
                  />
                </Form.Group>
              </Row>
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
                <div
                  className="box yellow"
                  title="Not Yet Started"
                  onClick={() => handleButtonFilter("Not Yet Started")}
                />
                <br />
                {totalNotYetStartedBaseOnStatusProject(tableProject)}
              </Col>
              <Col sm={3}>
                <div
                  className="box green"
                  title="Project On Progress"
                  onClick={() => handleButtonFilter("On Progress")}
                />{" "}
                <br /> {totalOnProgressBaseOnStatusProject(tableProject)}
              </Col>
              <Col sm={3}>
                <div
                  className="box blue"
                  title="Project Finish"
                  onClick={() => handleButtonFilter("Finish")}
                />{" "}
                <br /> {totalFinishBaseOnStatusProject(tableProject)}
              </Col>
              <Col sm={3}>
                <div
                  className="box red"
                  title="Project Delay"
                  onClick={() => handleButtonFilter("Delay")}
                />{" "}
                <br /> {totalDelayBaseOnStatusProject(tableProject)}
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
              <tbody>{tableListProject(page)}</tbody>
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
            <span className="titleTotalProject">Closest SOP Projects</span>
            <br />
            <span className="valueTotalProject">
              <RiStarLine />
              {projectLaunch.project_name}
            </span>
            <div>
              <div>Countdown</div>
              <div>
                {projectLaunch !== "" &&
                  moment(projectLaunch.finish).startOf("day").fromNow()}
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Project List "{buttonFilter}"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>NO</th>
                <th>Project Name</th>
                <th>Product</th>
                <th>PIC</th>
                <th>Start Date</th>
                <th>SOP Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>{tableFilter(buttonFilter)}</tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShow(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TotalProject;
