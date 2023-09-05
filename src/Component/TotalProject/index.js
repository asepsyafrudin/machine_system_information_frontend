import React from "react";
import { Badge, Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import "./totalProject.css";
import { useState } from "react";
import { useEffect } from "react";
import {
  getAllProductApi,
  getAllSectionApi,
  getAllUsersApi,
  searchProjectApi,
} from "../../Config/API";
import axios from "axios";
import { FaMoneyBillWaveAlt, FaSmile } from "react-icons/fa";
import { BiLoader, BiWallet } from "react-icons/bi";
import { BsFlag, BsListTask } from "react-icons/bs";
import PaginationTable from "../Pagination";
import { RiStarLine } from "react-icons/ri";
import moment from "moment/moment";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import { IoMdRainy } from "react-icons/io";
import { TfiShine } from "react-icons/tfi";
import { Link } from "react-router-dom";
import { MdVideoLibrary } from "react-icons/md";

function TotalProject(props) {
  const { actionStateValue } = props;
  const [productFilter, setProductFilter] = useState("");
  const [startFilter, setStartFilter] = useState("");
  const [endFilter, setEndFilter] = useState("");
  const [tableUser, setTableUser] = useState([]);
  const [totalItem, setTotalItem] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [totalSavingCost, setTotalSavingCost] = useState("");
  const [tableProduct, setTableProduct] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPageData, setStotalPageData] = useState(1);
  const [tableProject, setTableProject] = useState([]);
  const [projectLaunch, setProjectLaunch] = useState("");
  const [show, setShow] = useState(false);
  const [tableSection, setTableSection] = useState([]);
  const [sectionFilter, setSectionFilter] = useState("");
  const [buttonFilter, setButtonFilter] = useState("");
  const [userId, setUserId] = useState("");

  const maxPagesShow = 3;
  const dataPerPage = 10;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const projectWillBeLaunch = (data) => {
      let currentDate = new Date().getTime();
      if (data.length > 1) {
        const sorted = data.sort(
          (a, b) => new Date(a.finish) - new Date(b.finish)
        );
        const closest = sorted.find(
          (o) => new Date(o.finish) - currentDate > 0
        );
        setProjectLaunch(closest);
      } else if (data.length === 1) {
        setProjectLaunch(data[0]);
      } else {
        setProjectLaunch("");
      }
    };

    axios
      .get(getAllProductApi, {
        signal: controller.signal,
      })
      .then((response) => {
        setTableProduct(response.data.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(getAllSectionApi, {
        signal: controller.signal,
      })
      .then((response) => {
        isMounted && setTableSection(response.data.data);
      })
      .catch((error) => console.log(error));

    let data = {
      page: page,
      section_id: sectionFilter,
      product_id: productFilter,
      from_date: startFilter,
      to_date: endFilter,
      category: categoryFilter,
    };

    axios.post(searchProjectApi, data).then((response) => {
      const data = response.data.data;
      const filter = data.filter((value) => value.status !== "cancel");
      setTableProject(data);
      const totalPageData = Math.ceil(filter.length / dataPerPage);
      setStotalPageData(totalPageData);
      projectWillBeLaunch(filter);
      setTotalItem(filter.length);
      let budget = 0;
      let saving = 0;
      if (filter.length > 0) {
        for (let index = 0; index < filter.length; index++) {
          budget += parseFloat(filter[index].budget);
          saving += parseFloat(filter[index].saving_cost);
        }
      }
      setTotalBudget(budget);
      setTotalSavingCost(saving);
    });

    axios
      .get(getAllUsersApi, {
        signal: controller.signal,
      })
      .then((response) => {
        isMounted && setTableUser(response.data.data);
      })
      .catch((error) => console.log(error));

    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user.id);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [
    sectionFilter,
    productFilter,
    page,
    actionStateValue,
    startFilter,
    endFilter,
    categoryFilter,
  ]);

  const productOption = () => {
    let option = [];
    if (sectionFilter) {
      const productFilter = tableProduct.filter(
        (value) => value.section_id === parseInt(sectionFilter)
      );
      if (productFilter.length > 0) {
        for (let index = 0; index < productFilter.length; index++) {
          option.push(
            <option key={index} value={productFilter[index].id}>
              {productFilter[index].product_name}
            </option>
          );
        }
      }
    }
    return <>{option}</>;
  };

  const sectionOption = () => {
    let option = [];
    if (tableSection.length > 0) {
      for (let index = 0; index < tableSection.length; index++) {
        option.push(
          <option key={index} value={tableSection[index].id}>
            {tableSection[index].section_name}
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

  const statusFunction = (status, id) => {
    if (status !== "cancel") {
      if (status === "Finish") {
        return <Badge bg="primary">{status}</Badge>;
      } else if (status === "Not Yet Started") {
        return <Badge bg="warning">{status}</Badge>;
      } else if (status === "Waiting Detail Activity") {
        return (
          <Badge bg="light" text="dark">
            Waiting Detail Activity
          </Badge>
        );
      } else if (status === "On Progress") {
        return <Badge bg="success">{status}</Badge>;
      } else {
        return <Badge bg="danger">{status}</Badge>;
      }
    } else {
      return <Badge bg="secondary">Cancel</Badge>;
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
    let notCryteria = [
      "Not Yet Started",
      "On Progress",
      "Finish",
      "Waiting Detail Activity",
      "cancel",
    ];
    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        let checkData = notCryteria.find(
          (value) => value === data[index].status
        );
        if (!checkData) {
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

  const totalWaitingDetailActivity = (data) => {
    let count = 0;
    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        if (data[index].status === "Waiting Detail Activity") {
          count += 1;
        }
      }
    }
    return count;
  };

  const subCategoryLabel = (value) => {
    if (value) {
      return (
        <div className="label-subcategory">{CapitalCaseFirstWord(value)}</div>
      );
    }
  };

  const tableListProject = (page) => {
    const listTable = [];
    if (tableProject.length > 0) {
      const filter = tableProject.filter((value) => value.status !== "cancel");
      for (
        let index = (page - 1) * dataPerPage;
        index < page * dataPerPage && index < filter.length;
        index++
      ) {
        listTable.push(
          <tr key={index + 1}>
            <td>{index + 1}</td>
            <td>{filter[index].project_name}</td>

            <td>{productNameFunction(filter[index].product_id)}</td>
            <td>
              {filter[index].category} <br />
              {subCategoryLabel(filter[index].sub_category)}
            </td>
            <td>{userNameFunction(filter[index].manager_id)}</td>
            <td>{parseFloat(filter[index].budget).toLocaleString()}</td>
            <td>{parseFloat(filter[index].saving_cost).toLocaleString()}</td>
            <td>{moment(filter[index].start).format("LL")}</td>
            <td>{moment(filter[index].finish).format("LL")}</td>
            <td>
              {statusFunction(filter[index].status)} <br />
              {buttonView(filter[index].id)}
            </td>
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

  const buttonView = (projectId) => {
    const dataView = tableProject.find((value) => value.id === projectId);
    if (dataView) {
      const memberDataView = dataView.member.find(
        (value) => value.user_id === userId
      );
      if (memberDataView) {
        return (
          <Link to={`/projectActivity/${projectId}`}>
            <Button size="sm">
              <MdVideoLibrary style={{ pointerEvents: "none" }} />
            </Button>
          </Link>
        );
      }
    }
  };
  const tableFilter = (filter) => {
    let dataList = [];
    if (filter) {
      let dataFilter = [];
      let notCryteria = [
        "Not Yet Started",
        "On Progress",
        "Finish",
        "Waiting Detail Activity",
        "cancel",
      ];
      let checkData = notCryteria.find((value) => value === filter);

      if (checkData) {
        dataFilter = tableProject.filter((value) => value.status === filter);
      } else {
        for (let index = 0; index < tableProject.length; index++) {
          let checkData = notCryteria.find(
            (value) => value === tableProject[index].status
          );
          if (!checkData) {
            dataFilter.push(tableProject[index]);
          }
        }
      }

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
              <td style={{ textAlign: "center" }}>
                {statusFunction(dataFilter[index].status)}
                <br />
                {buttonView(dataFilter[index].id)}
              </td>
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

  const handleChangeSectionFilter = (e) => {
    const filter = e.target.value;
    setSectionFilter(filter);
    setProductFilter("");
  };

  const categoryOption = () => {
    if (productFilter && sectionFilter) {
      return (
        <>
          <option value={"New Model"}>New Model</option>
          <option value={"Quality"}>Quality</option>
          <option value={"Integrated Factory"}>Integrated Factory</option>
          <option value={"Productivity"}>Productivity</option>
          <option value={"Profit Improvement"}>Profit Improvement</option>
        </>
      );
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <div className="filterTotalProject">
            <Form>
              <Row style={{ textAlign: "left" }}>
                <Form.Group as={Col}>
                  <Form.Label>Select Section</Form.Label>
                  <Form.Select
                    value={sectionFilter}
                    onChange={handleChangeSectionFilter}
                  >
                    <option value={""} disabled>
                      open this to product filter
                    </option>
                    {sectionOption()}
                  </Form.Select>
                </Form.Group>
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
                  <Form.Label>Select Category</Form.Label>
                  <Form.Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value={""} disabled>
                      open this to product filter
                    </option>
                    {categoryOption()}
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
                <BiLoader
                  title="Waiting Detail Activity"
                  onClick={() => handleButtonFilter("Waiting Detail Activity")}
                  style={{ color: "orange", fontSize: 25, cursor: "pointer" }}
                />
                <br />
                {totalWaitingDetailActivity(tableProject)}
              </Col>
              <Col sm={3} style={{ textAlign: "center" }}>
                <BsFlag
                  title="Not Yet Started"
                  onClick={() => handleButtonFilter("Not Yet Started")}
                  style={{ color: "orange", fontSize: 25, cursor: "pointer" }}
                />
                <br />
                {totalNotYetStartedBaseOnStatusProject(tableProject)}
              </Col>
              <Col sm={3}>
                <FaSmile
                  title="Project On Progress"
                  onClick={() => handleButtonFilter("On Progress")}
                  style={{ color: "green", fontSize: 25, cursor: "pointer" }}
                />
                <br /> {totalOnProgressBaseOnStatusProject(tableProject)}
              </Col>
              <Col sm={3}>
                <TfiShine
                  title="Project Finish"
                  onClick={() => handleButtonFilter("Finish")}
                  style={{ color: "blue", fontSize: 25, cursor: "pointer" }}
                />
                <br />
                {totalFinishBaseOnStatusProject(tableProject)}
              </Col>
              <Col sm={3}>
                <IoMdRainy
                  title="Project Delay"
                  onClick={() => handleButtonFilter("Delay")}
                  style={{ color: "red", fontSize: 25, cursor: "pointer" }}
                />
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
                  <th>Category</th>
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
          <div className="filterModal">
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
          </div>
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
