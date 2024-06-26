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

import GanttChart from "../GanttChart";
import { ViewMode } from "gantt-task-react";
import TaskListTable from "../TaskListTable";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import { SETFILTER } from "../../Context/const/index";
import { SETFILTERDETAIL } from "../../Context/const/index";
import { GlobalConsumer } from "../../Context/store/index";
import "./scheduleAnalysis.css";
import { round } from "../../Config/function";

function ScheduleReview(props) {
  const {
    id,
    filterEvent,
    filterDetailEvent,
    dispatch,
    pageEvent,
    tableUser,
    tableProduct,
    tableProject,
    totalProject,
    userId,
    userData,
  } = props;
  const [showModal, setShowModal] = useState(false);

  const [activity, setActivity] = useState([]);
  const [filterProject, setFilterProject] = useState([]);
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

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fiscalYear, setFiscalYear] = useState("");
  const [loading, setLoading] = useState(false);

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
      setFilterProject(filterByDate);
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
          setFilterProject(filterByDate);
        } else {
          setFilterProject(filterData);
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

          setFilterProject(filterByDate);
        } else {
          setFilterProject(filterData);
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

          setFilterProject(filterByDate);
        } else {
          setFilterProject(filterData);
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
        filterData = data.filter((value) => value.status === filterDetailItem);
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

        setFilterProject(filterByDate);
      } else {
        setFilterProject(filterData);
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

          setFilterProject(filterByDate);
        } else {
          setFilterProject(filterData);
        }
      }
    }
  };

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

  const handleImportActivity = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (projectListWillReview.length > 0) {
      let dataArray = [];
      for (let index = 0; index < projectListWillReview.length; index++) {
        const projectData = totalProject.find(
          (value) => value.id === projectListWillReview[index]
        );

        // const project = await axios.get(
        //   getProjectByIdApi(projectListWillReview[index])
        // );
        const dataProject = projectData;
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

        // const activityData = await axios.get(
        //   getActivityByProjectIdApi(dataProject.id)
        // );

        const getDetail = async () => {
          const dataActivity = dataProject.activityData;
          if (dataActivity.length > 0) {
            for (let index2 = 0; index2 < dataActivity.length; index2++) {
              let pushData = {
                id: dataActivity[index2].id,
                start: new Date(moment(dataActivity[index2].start)),
                end: new Date(moment(dataActivity[index2].end)),
                name: dataActivity[index2].name,
                progress: dataActivity[index2].progress,
                dependencies: dataActivity[index2].dependencies,
                type: dataActivity[index2].type,
                project: dataProject.id,
                styles: backgroundColorDelay(
                  new Date(moment(dataActivity[index2].end)),
                  dataActivity[index2].progress,
                  dataActivity[index2].remark
                ),
                remark: dataActivity[index2].remark,
                linkToProject: dataActivity[index2].linkToProject,
                pic: dataActivity[index2].pic,
              };
              await dataArray.push(pushData);
            }
          }
        };
        await getDetail();
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
      if (userData.section_id === 4) {
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

  const onHandleChangeFiscalYear = (data) => {
    const { fiscalYear, status } = data;
    setFiscalYear(fiscalYear);
    if (fiscalYear === "FY 23") {
      const fromDate = "2023-04-01";
      const toDate = "2024-03-31";
      filterFunctionLogicByDate(totalProject, fromDate, toDate, status);
    } else if (fiscalYear === "FY 24") {
      const fromDate = "2024-04-01";
      const toDate = "2025-03-31";
      filterFunctionLogicByDate(totalProject, fromDate, toDate, status);
    } else if (fiscalYear === "FY 25") {
      const fromDate = "2025-04-01";
      const toDate = "2026-03-31";
      filterFunctionLogicByDate(totalProject, fromDate, toDate, status);
    } else {
      const fromDate = "";
      const toDate = "";
      filterFunctionLogicByDate(totalProject, fromDate, toDate, status);
    }
  };

  const handleExpanderClick = (task) => {
    setActivity(activity.map((t) => (t.id === task.id ? task : t)));
  };

  const handleTooltip = (task) => {
    const dataProject = totalProject.find((value) => value.id === task.id);
    console.log(dataProject);

    return (
      <div className="box-progress">
        <div>
          <b>{task.name}</b>
        </div>
        <div>Progress : {round(task.progress, 2)}%</div>
        {dataProject && (
          <div>
            Summary Progress : <br />
            <div
              dangerouslySetInnerHTML={{ __html: dataProject.summary_progress }}
            />
          </div>
        )}
      </div>
    );
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
          TooltipContent={({ task }) => handleTooltip(task)}
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
    if (filterProject.length > 0) {
      for (let index = 0; index < filterProject.length; index++) {
        if (projectListWillReview.length > 0) {
          const checkData = projectListWillReview.find(
            (value) => value === filterProject[index].id
          );
          if (!checkData) {
            setProjectListWillReview((prev) => [
              ...prev,
              filterProject[index].id,
            ]);
          }
        } else {
          setProjectListWillReview((prev) => [...prev, tableProject[index].id]);
        }
      }
    }
  };

  const handleFilterTableProject = (data) => {
    const { fiscalYear, filterBy, detailFilterValue } = data;
    if (fiscalYear && filterBy && detailFilterValue) {
      if (fiscalYear === "FY 23") {
        const fromDate = "2023-04-01";
        const toDate = "2024-03-31";
        filterFunctionLogic(
          filterBy,
          detailFilterValue,
          totalProject,
          fromDate,
          toDate
        );
      } else if (fiscalYear === "FY 24") {
        const fromDate = "2024-04-01";
        const toDate = "2025-03-31";
        filterFunctionLogic(
          filterBy,
          detailFilterValue,
          totalProject,
          fromDate,
          toDate
        );
      } else if (fiscalYear === "FY 25") {
        const fromDate = "2025-04-01";
        const toDate = "2026-03-31";
        filterFunctionLogic(
          filterBy,
          detailFilterValue,
          totalProject,
          fromDate,
          toDate
        );
      } else {
        const fromDate = "";
        const toDate = "";
        filterFunctionLogic(
          filterBy,
          detailFilterValue,
          totalProject,
          fromDate,
          toDate
        );
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
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Select
                    value={fiscalYear}
                    onChange={(e) => {
                      onHandleChangeFiscalYear({ fiscalYear: e.target.value });
                      handleFilterTableProject({ fiscalYear: e.target.value });
                    }}
                  >
                    <option value={""}>Fiscal Year</option>
                    <option value={"FY 23"}>FY 23</option>
                    <option value={"FY 24"}>FY 24</option>
                    <option value={"FY 25"}>FY 25</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Select
                    value={filterBy}
                    onChange={(e) => {
                      setFilterBy(e.target.value);
                      dispatch({
                        type: SETFILTER,
                        payload: e.target.value,
                      });
                      handleFilterTableProject({
                        filterBy: e.target.value,
                        fiscalYear: fiscalYear,
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
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Select
                    value={detailFilterValue}
                    onChange={(e) => {
                      setDetailFilterValue(e.target.value);
                      dispatch({
                        type: SETFILTERDETAIL,
                        payload: e.target.value,
                      });
                      handleFilterTableProject({
                        fiscalYear: fiscalYear,
                        filterBy: filterBy,
                        detailFilterValue: e.target.value,
                      });
                    }}
                  >
                    <option value="">Select Detail</option>
                    {filterItemLogic()}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col}>
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
                    {filterProject.map((value, index) => {
                      return (
                        <option key={index} value={value.id}>
                          {" "}
                          {value.project_name}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col}>
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
                        setProjectListWillReview([]);
                        setFilterProject([]);
                      }}
                    >
                      Reset
                    </Button>
                  )}
                </Form.Group>
              </Row>
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
