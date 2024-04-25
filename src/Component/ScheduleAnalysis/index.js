import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Modal,
  Row,
  Col,
  Badge,
  CloseButton,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import TitleSection from "../TitleSection";
import { BsListNested } from "react-icons/bs";
import {
  getActivityByProjectIdApi,
  getProjectByUserApi,
  getProjectByIdApi,
  getAllUsersApi,
  getAllProductApi,
  getAllProjectApi,
  getProjectBySectionIdAndPage,
} from "../../Config/API";
import GanttChart from "../GanttChart";
import { ViewMode } from "gantt-task-react";
import TaskListTable from "../TaskListTable";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import { SETFILTER } from "../../Context/const/index";
import { SETFILTERDETAIL } from "../../Context/const/index";
import { GlobalConsumer } from "../../Context/store/index";

function ScheduleReview(props) {
  const { id, filterEvent, filterDetailEvent, dispatch, pageEvent } = props;
  const [showModal, setShowModal] = useState(false);
  const [tableProject, setTableProject] = useState([]);
  const [activity, setActivity] = useState([]);
  const [section, setSection] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [monthFormat, setMonthFormat] = useState("en-US");
  const [viewMode, setViewMode] = useState(ViewMode.Month);
  const [listCellWidth, setListCellWidth] = useState(300);
  const [colWidth, setColWidth] = useState(120);
  const [rowHeight, setRowHeight] = useState(35);
  const [projectListWillReview, setProjectListWillReview] = useState([]);
  const [hiddenPlan, setHiddenPlan] = useState("Yes");
  const [openSetting, setOpenSetting] = useState(false);
  const [filterBy, setFilterBy] = useState(filterEvent);
  const [detailFilterValue, setDetailFilterValue] = useState(filterDetailEvent);
  const [tableUser, setTableUser] = useState([]);
  const [tableProduct, setTableProduct] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fiscalYear, setFiscalYear] = useState("");
  const [page, setPage] = useState(pageEvent);
  const [totalProject, setTotalProject] = useState([]);
  const [loading, setLoading] = useState(false);

  const backgroundColorDelay = (endProject, progressBar, remark) => {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);

    if (remark === "revise") {
      return {
        backgroundColor: "green",
        backgroundSelectedColor: "green",
        barProgressColor: "green",
        barBackgroundColor: "green",
        barProgressSelectedColor: "green",
      };
    } else if (parseInt(progressBar) === 100) {
      return { backgroundColor: "#A3A3FF", backgroundSelectedColor: "#A3A3FF" };
    } else if (currentDate - endProject > 0) {
      return { backgroundColor: "red", backgroundSelectedColor: "red" };
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setSection(user.section_id);
        setUserId(user.id);
      }
    }
    const user = JSON.parse(localStorage.getItem("user"));

    const position = user.position;
    const section_id = user.section_id;
    const positionThatCanOpenProject = [
      "Departement Manager",
      "Assistant General Manager",
      "General Manager",
      "Director",
      "President",
    ];

    const checkPosition = positionThatCanOpenProject.find(
      (value) => value === position
    );

    axios
      .get(getAllUsersApi)
      .then((response) => {
        const tableUserSort = response.data.data;
        setTableUser(
          tableUserSort.sort((nameA, nameB) => {
            let a = nameA.username;
            let b = nameB.username;

            if (a < b) {
              return -1;
            }
            if (a > b) {
              return 1;
            }
            return 0;
          })
        );
      })
      .catch((error) => console.log(error));

    axios
      .get(getAllProductApi)
      .then((response) => {
        setTableProduct(response.data.data);
      })
      .catch((error) => console.log(error));

    if (userId) {
      axios.get(getProjectByUserApi(userId)).then((response) => {
        const data = response.data.data;
        setTableProject(data);
      });
    }

    const filterFunctionLogicByDate = (data, fromDate, toDate) => {
      if (fromDate && toDate && data.length > 0) {
        const fromDateValue = new Date(fromDate).setDate(
          new Date(fromDate).getDate() - 1
        );
        const filterByDate = data.filter(
          (value) =>
            new Date(value.finish) > new Date(fromDateValue) &&
            new Date(value.finish) <= new Date(toDate)
        );
        setTableProject(filterByDate);
      }
    };

    const filterFunctionLogic = (
      filterItem,
      filterDetailItem,
      data,
      fromDate,
      toDate
    ) => {
      if (filterItem === "category") {
        if (data.length > 0) {
          const filterData = data.filter(
            (value) => value.category === filterDetailItem
          );

          if (fromDate && toDate) {
            const fromDateValue = new Date(fromDate).setDate(
              new Date(fromDate).getDate() - 1
            );
            const filterByDate = filterData.filter(
              (value) =>
                new Date(value.finish) >= new Date(fromDateValue) &&
                new Date(value.finish) <= new Date(toDate)
            );
            setTableProject(filterByDate);
          } else {
            setTableProject(filterData);
          }
        }
      } else if (filterItem === "rank") {
        if (data.length > 0) {
          const filterData = data.filter(
            (value) => value.rank === filterDetailItem
          );

          if (fromDate && toDate) {
            const fromDateValue = new Date(fromDate).setDate(
              new Date(fromDate).getDate() - 1
            );
            const filterByDate = filterData.filter(
              (value) =>
                new Date(value.finish) >= new Date(fromDateValue) &&
                new Date(value.finish) <= new Date(toDate)
            );

            setTableProject(filterByDate);
          } else {
            setTableProject(filterData);
          }
        }
      } else if (filterItem === "pic") {
        if (data.length > 0) {
          const filterData = data.filter(
            (value) => value.manager_id === parseInt(filterDetailItem)
          );

          if (fromDate && toDate) {
            const fromDateValue = new Date(fromDate).setDate(
              new Date(fromDate).getDate() - 1
            );
            const filterByDate = filterData.filter(
              (value) =>
                new Date(value.finish) >= new Date(fromDateValue) &&
                new Date(value.finish) <= new Date(toDate)
            );

            setTableProject(filterByDate);
          } else {
            setTableProject(filterData);
          }
        }
      } else if (filterItem === "status" && data.length > 0) {
        let filterData = [];
        if (filterDetailItem === "Delay") {
          let notCriteria = [
            "Not Yet Started",
            "On Progress",
            "Finish",
            "Waiting Detail Activity",
            "cancel",
          ];

          filterData = data.filter(
            (value) => !notCriteria.includes(value.status)
          );
        } else {
          filterData = data.filter(
            (value) => value.status === filterDetailItem
          );
        }

        if (fromDate && toDate) {
          const fromDateValue = new Date(fromDate).setDate(
            new Date(fromDate).getDate() - 1
          );
          const filterByDate = filterData.filter(
            (value) =>
              new Date(value.finish) >= new Date(fromDateValue) &&
              new Date(value.finish) <= new Date(toDate)
          );

          setTableProject(filterByDate);
        } else {
          setTableProject(filterData);
        }
      } else if (filterItem === "product") {
        if (data.length > 0) {
          const filterData = data.filter(
            (value) => value.product_id === parseInt(filterDetailItem)
          );
          if (fromDate && toDate) {
            const fromDateValue = new Date(fromDate).setDate(
              new Date(fromDate).getDate() - 1
            );
            const filterByDate = filterData.filter(
              (value) =>
                new Date(value.finish) >= new Date(fromDateValue) &&
                new Date(value.finish) <= new Date(toDate)
            );

            setTableProject(filterByDate);
          } else {
            setTableProject(filterData);
          }
        }
      }
    };

    //filter sampai sini

    if (user.position === "Administrator") {
      axios
        .get(getAllProjectApi)
        .then((response) => {
          const data = response.data.data;

          if (filterBy && detailFilterValue) {
            filterFunctionLogic(
              filterBy,
              detailFilterValue,
              data,
              fromDate,
              toDate
            );
          } else if (fromDate && toDate) {
            filterFunctionLogicByDate(data, fromDate, toDate);
          } else {
            setTableProject(data);
          }
        })
        .then((error) => console.log(error));
    } else if (checkPosition) {
      axios
        .get(getProjectBySectionIdAndPage(page, section_id))
        .then((response) => {
          const data = response.data.data;
          if (filterBy && detailFilterValue) {
            filterFunctionLogic(
              filterBy,
              detailFilterValue,
              data,
              fromDate,
              toDate
            );
          } else if (fromDate && toDate) {
            filterFunctionLogicByDate(data, fromDate, toDate);
          } else {
            setTableProject(data);
          }
        })
        .catch((error) => console.log(error));
    } else {
      if (userId) {
        axios
          .get(getProjectByUserApi(userId))
          .then((response) => {
            const responseData = response.data.data;
            if (filterBy && detailFilterValue) {
              filterFunctionLogic(
                filterBy,
                detailFilterValue,
                responseData,
                fromDate,
                toDate
              );
            } else if (fromDate && toDate) {
              filterFunctionLogicByDate(responseData, fromDate, toDate);
            } else {
              setTableProject(responseData);
            }
          })
          .catch((error) => {
            console.error("Error in axios get request:", error);
          });
      }
    }
  }, [
    viewMode,
    id,
    filterBy,
    detailFilterValue,
    userId,
    fromDate,
    toDate,
    page,
  ]);

  useEffect(() => {
    axios.get(getAllProjectApi).then((response) => {
      setTotalProject(response.data.data);
    });
  }, []);

  const handleImportActivity = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (projectListWillReview.length > 0) {
      let dataArray = [];
      for (let index = 0; index < projectListWillReview.length; index++) {
        const project = await axios.get(
          getProjectByIdApi(projectListWillReview[index])
        );
        const dataProject = project.data.data[0];
        const data = {
          no: dataArray.length + 1,
          name: dataProject.project_name,
          id: dataProject.id,
          progress: dataProject.progress,
          type: "project",
          start: new Date(dataProject.start),
          end: new Date(dataProject.finish),
          hideChildren: true,
        };
        dataArray.push(data);

        const activityData = await axios.get(
          getActivityByProjectIdApi(dataProject.id)
        );
        const dataActivity = activityData.data.data;
        if (dataActivity.length > 0) {
          for (let index2 = 0; index2 < dataActivity.length; index2++) {
            let pushData = {
              no: dataArray.length + 1,
              id: dataActivity[index2].id,
              start: new Date(moment(dataActivity[index2].start)),
              end: new Date(moment(dataActivity[index2].end)),
              name: dataActivity[index2].name,
              progress: dataActivity[index2].progress,
              dependencies: dataActivity[index2].dependencies,
              type: dataActivity[index2].type,
              project: dataActivity[index2].project,
              styles: backgroundColorDelay(
                new Date(moment(dataActivity[index2].end)),
                dataActivity[index2].progress,
                dataActivity[index2].remark
              ),
              remark: dataActivity[index2].remark,
              linkToProject: dataActivity[index2].linkToProject,
              pic: dataActivity[index2].pic,
            };
            dataArray.push(pushData);
          }
        }
      }
      setActivity(dataArray);
      setShowModal(false);
      setLoading(false);
    } else {
      window.alert("No Data In List");
    }
  };

  const deleteProject = (projectId) => {
    setProjectListWillReview(
      projectListWillReview.filter((id) => id !== projectId)
    );
  };

  const userOption = () => {
    let option = [];
    if (tableUser.length > 0) {
      for (let index = 0; index < tableUser.length; index++) {
        option.push(
          <option key={index} value={tableUser[index].id}>
            {CapitalCaseFirstWord(tableUser[index].username)}
          </option>
        );
      }
    }
    return <>{option}</>;
  };

  const productOption = () => {
    let option = [];
    if (tableProduct.length > 0) {
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

  const colorBgBadge = (value) => {
    switch (value) {
      case 1:
        return "primary";
      case 2:
        return "secondary";
      case 3:
        return "success";
      case 4:
        return "danger";
      case 5:
        return "warning";
      case 6:
        return "info";
      case 7:
        return "dark";
      default:
        break;
    }
  };

  const reset = () => {
    setShowModal(false);
  };

  const filterItemLogic = () => {
    let option = [];
    if (filterBy === "category") {
      if (section === 4) {
        option.push(
          <>
            <option key={1} value={"CO2 Neutral"}>
              CO2 Neutral
            </option>
            <option key={2} value={"Log Auto"}>
              Log Auto
            </option>
            <option key={3} value={"Vision"}>
              Vision
            </option>
            <option key={4} value={"DX"}>
              DX
            </option>
            <option key={5} value={"Layout"}>
              Layout
            </option>
          </>
        );
      } else {
        option.push(
          <>
            <option key={6} value={"New Model"}>
              New Model
            </option>
            <option key={7} value={"Quality"}>
              Quality
            </option>
            <option key={8} value={"Integrated Factory"}>
              Integrated Factory
            </option>
            <option key={9} value={"Productivity"}>
              Productivity
            </option>
            <option key={10} value={"Profit Improvement"}>
              Profit Improvement
            </option>
          </>
        );
      }
    } else if (filterBy === "rank") {
      option.push(
        <>
          <option key={11} value={"A1"}>
            A1
          </option>
          <option key={12} value={"A2"}>
            A2
          </option>
          <option key={13} value={"A3"}>
            A3
          </option>
          <option key={14} value={"B1"}>
            B1
          </option>
          <option key={15} value={"B2"}>
            B2
          </option>
          <option key={16} value={"B3"}>
            B3
          </option>
          <option key={17} value={"C1"}>
            C1
          </option>
          <option key={18} value={"C2"}>
            C2
          </option>
          <option key={19} value={"C3"}>
            C3
          </option>
        </>
      );
    } else if (filterBy === "pic") {
      return userOption();
    } else if (filterBy === "status") {
      option.push(
        <>
          <option key={20} value={"Not Yet Started"}>
            Not Yet Started
          </option>
          <option key={21} value={"On Progress"}>
            On Progress
          </option>
          <option key={22} value={"Delay"}>
            Delay
          </option>
          <option key={23} value={"Finish"}>
            Finish
          </option>
          <option key={24} value={"Waiting Detail Activity"}>
            Waiting Detail Activity
          </option>
          <option key={25} value={"cancel"}>
            cancel
          </option>
        </>
      );
    } else if (filterBy === "product") {
      return productOption();
    }
    return option;
  };

  const onHandleChangeFiscalYear = (e) => {
    const fiscalYear = e.target.value;
    setFiscalYear(fiscalYear);

    if (fiscalYear === "FY 23") {
      setFromDate("2023-04-01");
      setToDate("2024-03-31");
    } else if (fiscalYear === "FY 24") {
      setFromDate("2024-04-01");
      setToDate("2025-03-31");
    } else if (fiscalYear === "FY 25") {
      setFromDate("2025-04-01");
      setToDate("2026-03-31");
    } else {
      setFromDate("");
      setToDate("");
    }
  };

  const handleExpanderClick = (task) => {
    setActivity(activity.map((t) => (t.id === task.id ? task : t)));
  };

  const ganttChartFormat = () => {
    if (activity.length > 0) {
      return (
        <GanttChart
          tasks={activity}
          locale={monthFormat}
          viewMode={viewMode}
          listCellWidth={listCellWidth}
          columnWidth={colWidth}
          rowHeight={rowHeight}
          onExpanderClick={(task) => handleExpanderClick(task)}
          TaskListHeader={({ headerHeight }) => (
            <div
              style={{
                height: headerHeight,
                fontFamily: "sans-serif",
                fontWeight: "bold",
                paddingLeft: 10,
                margin: 0,
                marginBottom: -1,
                display: "flex",
                alignItems: "center",
              }}
            >
              Jobs
            </div>
          )}
          TaskListTable={(props) => <TaskListTable {...props} />}
        />
      );
    }
  };

  const handleAddProject = () => {
    if (selectedProjectId) {
      const checkData = projectListWillReview.find(
        (value) => value === selectedProjectId
      );
      if (!checkData) {
        setProjectListWillReview((prev) => [...prev, selectedProjectId]);
      } else {
        window.alert("Data Already Add");
      }
    }
  };

  const handleAddAllProject = () => {
    if (tableProject.length > 0) {
      for (let index = 0; index < tableProject.length; index++) {
        if (projectListWillReview.length > 0) {
          const checkData = projectListWillReview.find(
            (value) => value === tableProject[index].id
          );
          if (!checkData) {
            setProjectListWillReview((prev) => [
              ...prev,
              tableProject[index].id,
            ]);
          }
        } else {
          setProjectListWillReview((prev) => [...prev, tableProject[index].id]);
        }
      }
    }
  };

  return (
    <div className="capabilityFormContainer">
      <div className="capabilityForm">
        <Row>
          <TitleSection
            title={`Schedule Analysis Project`}
            icon={<BsListNested style={{ marginRight: 5 }} />}
          />
          <div style={{ textAlign: "right", marginBottom: 10 }}>
            <Button onClick={() => setShowModal(true)}>Select Project</Button>
          </div>
        </Row>

        <Row>{ganttChartFormat()}</Row>
        <div style={{ textAlign: "left" }}>
          <Button
            style={{ marginRight: 5 }}
            onClick={() => setViewMode(ViewMode.Day)}
          >
            Day
          </Button>
          <Button
            style={{ marginRight: 5 }}
            onClick={() => setViewMode(ViewMode.Week)}
          >
            Week
          </Button>
          <Button
            style={{ marginRight: 5 }}
            onClick={() => setViewMode(ViewMode.Month)}
          >
            Month
          </Button>

          <Button onClick={() => setOpenSetting(true)}>Setting</Button>
        </div>
        <Modal show={showModal} centered size="lg">
          <Form onSubmit={handleImportActivity}>
            <Modal.Body>
              <div style={{ marginBottom: 6 }}>
                <Row className="test2 mb-3">
                  <Form.Group as={Col}>
                    <Form.Select
                      className="form margin"
                      value={fiscalYear}
                      onChange={onHandleChangeFiscalYear}
                    >
                      <option value={""}>Fiscal Year</option>
                      <option value={"FY 23"}>FY 23</option>
                      <option value={"FY 24"}>FY 24</option>
                      <option value={"FY 25"}>FY 25</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label className="label_start">
                      Start Project
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label className="label_start">
                      Finish Project
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </Form.Group>
                </Row>
              </div>
              <div style={{ marginBottom: 5 }}>
                <Row className="col-12 mb-3">
                  <Col lg={3}>
                    <Form.Select
                      value={filterBy}
                      onChange={(e) => {
                        setFilterBy(e.target.value);
                        dispatch({
                          type: SETFILTER,
                          payload: e.target.value,
                        });
                      }}
                    >
                      <option value="">Filter By</option>
                      <option value="category">Category</option>
                      <option value="rank">Rank</option>
                      <option value="pic">PIC</option>
                      <option value="status">Status</option>
                      <option value="product">Product</option>
                    </Form.Select>
                  </Col>
                  <Col lg={3}>
                    <Form.Select
                      value={detailFilterValue}
                      onChange={(e) => {
                        setDetailFilterValue(e.target.value);
                        dispatch({
                          type: SETFILTERDETAIL,
                          payload: e.target.value,
                        });
                      }}
                    >
                      <option value="">Select Detail</option>
                      {filterItemLogic()}
                    </Form.Select>
                  </Col>
                  <Col lg={3}>
                    <Form.Select
                      value={selectedProjectId}
                      onChange={(e) => {
                        setSelectedProjectId(e.target.value);
                        dispatch({
                          type: SETFILTERDETAIL,
                          payload: e.target.value,
                        });
                      }}
                    >
                      <option value="">Select Detail</option>
                      {tableProject.map((value, index) => {
                        return (
                          <option key={index} value={value.id}>
                            {" "}
                            {value.project_name}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Col>
                  <Col lg={3}>
                    {filterBy !== "" && (
                      <Button
                        onClick={() => {
                          setFilterBy("");
                          dispatch({
                            type: SETFILTERDETAIL,
                            payload: "",
                          });
                          dispatch({
                            type: SETFILTER,
                            payload: "",
                          });
                          setFiscalYear("");
                          setFromDate("");
                          setToDate("");
                        }}
                      >
                        Reset
                      </Button>
                    )}
                  </Col>
                </Row>
              </div>

              <Row>
                <Col>
                  <Button onClick={handleAddProject} className="mb-3 me-2">
                    Add Project
                  </Button>
                  <Button
                    onClick={handleAddAllProject}
                    className="mb-3"
                    variant="success"
                  >
                    Add All
                  </Button>
                </Col>
              </Row>
              <Row className="mb-3" style={{ textAlign: "left" }}>
                <Col>
                  {projectListWillReview.length > 0
                    ? projectListWillReview.map((projectId, index) => {
                        const projects = totalProject.find(
                          (value) => value.id === projectId
                        );
                        return (
                          <Badge
                            key={index}
                            style={{ marginRight: 2 }}
                            bg={colorBgBadge(index + 1)}
                          >
                            <h6>
                              {projects
                                ? projects.project_name
                                : "Project Not Found"}
                              <CloseButton
                                onClick={() => deleteProject(projectId)}
                              />
                            </h6>
                          </Badge>
                        );
                      })
                    : "Data Is Not Available"}
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit">
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      key={new Date()}
                    />{" "}
                    Review
                  </>
                ) : (
                  "Review"
                )}
              </Button>
              <Button variant="secondary" onClick={reset}>
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        <Modal
          show={openSetting}
          onHide={() => {
            setOpenSetting(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Setting</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3">
              <Col>
                <Form.Label>Column Width</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type={"number"}
                  placeholder="Enter Column Width"
                  value={colWidth}
                  onChange={(e) => setColWidth(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Row Height</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type={"number"}
                  placeholder="Enter Row Height"
                  value={rowHeight}
                  onChange={(e) => setRowHeight(parseInt(e.target.value))}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>List Cell Width</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type={"number"}
                  placeholder="Enter List Cell Width"
                  value={listCellWidth}
                  onChange={(e) => setListCellWidth(parseInt(e.target.value))}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Month Format</Form.Label>
              </Col>
              <Col>
                <Form.Select
                  value={monthFormat}
                  style={{ width: 150, display: "inline-block" }}
                  onChange={(e) => setMonthFormat(e.target.value)}
                >
                  <option value={"ja-JP"}>Japan</option>
                  <option value={"en-US"}>English</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Hidden Plan</Form.Label>
              </Col>
              <Col>
                <Form.Select
                  value={hiddenPlan}
                  style={{ width: 100, display: "inline-block" }}
                  onChange={(e) => setHiddenPlan(e.target.value)}
                >
                  <option value={"Yes"}>Yes</option>
                  <option value={"No"}>No</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="mb-3">
              {/* <Col>
                <Form.Label>Drag Mode</Form.Label>
              </Col>
              <Col>
                <Form.Check
                  type="switch"
                  label="Drag Mode"
                  checked={switchMode}
                  onChange={() => setSwitchMode(!switchMode)}
                />
              </Col> */}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setOpenSetting(false);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default GlobalConsumer(ScheduleReview);
