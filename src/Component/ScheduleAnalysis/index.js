import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import TitleSection from "../TitleSection";
import { BsListNested } from "react-icons/bs";
import {
  getActivityByProjectIdApi,
  getProjectByUserApi,
  getUserByUserIdApi,
  getProjectByIdApi,
} from "../../Config/API";
import GanttChart from "../GanttChart";
import { ViewMode } from "gantt-task-react";
import TaskListTable from "../TaskListTable";
import { SiStarbucks } from "react-icons/si";

function ScheduleAnalysis(props) {
  const { id } = props;
  const [showModal, setShowModal] = useState(false);
  const [tableProject, settableProject] = useState([]);
  const [activity, setActivity] = useState([]);
  const [section, setSection] = useState("");
  const [userId, setUserId] = useState("");
  const [category, setCategory] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [monthFormat, setMonthFormat] = useState("en-US");
  const [viewMode, setViewMode] = useState(ViewMode.Month);
  const [listCellWidth, setListCellWidth] = useState(300);
  const [colWidth, setColWidth] = useState(120);
  const [rowHeight, setRowHeight] = useState(35);
  const [titleProject, setTitleProject] = useState("");

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
      const { id } = user;
      axios.get(getUserByUserIdApi(id)).then((response) => {
        const dataUser = response.data.data;
        if (dataUser.length > 0) {
          setSection(dataUser[0].section_id);
        }
      });
    }

    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user.id);

    // if (id) {
    //   axios.get(getProjectByIdApi(id)).then((response) => {
    //     const dataProject = response.data.data[0];
    //     setTitleProject(dataProject.project_name);
    //     console.log(titleProject);
    //     let dataArray = [];
    //     const data = {
    //       name: dataProject.project_name,
    //       id: dataProject.id,
    //       progress: dataProject.progress,
    //       type: "project",
    //       start: new Date(dataProject.start),
    //       end: new Date(dataProject.finish),
    //       hideChildren: false,
    //     };
    //     dataArray.push(data);
    //   });
    // }

    if (userId) {
      axios.get(getProjectByUserApi(userId)).then((response) => {
        const data = response.data.data;
        console.log(data, "data project");
        settableProject(data);
      });
    }
  }, [userId, viewMode, id]);

  const handleImportActivity = (e) => {
    e.preventDefault();
    if (selectedProjectId) {
      axios
        .get(getActivityByProjectIdApi(selectedProjectId))
        .then((response) => {
          let dataActivity = [];
          const data = response.data.data;
          if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
              let dataArray = {
                id: data[index].id,
                start: new Date(moment(data[index].start)),
                end: new Date(moment(data[index].end)),
                name: data[index].name,
                progress: data[index].progress,
                dependencies: data[index].dependencies,
                type: data[index].type,
                project: data[index].project,
                styles: backgroundColorDelay(
                  new Date(moment(data[index].end)),
                  data[index].progress,
                  data[index].remark
                ),
                remark: data[index].remark,
                linkToProject: data[index].linkToProject,
                pic: data[index].pic,
              };
              dataActivity.push(dataArray);
            }
          }
          setActivity(dataActivity);
          console.log(activity, "activity");
        })
        .catch((error) => console.log(error));
    }
    setShowModal(false);
  };

  const reset = () => {
    setShowModal(false);
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
          // onExpanderClick={(task) => handleExpanderClick(task)}
          // onDoubleClick={(task) => handleDoubleClick(task)}
          // onDelete={(task) => handleDeleteTask(task)}
          // onDateChange={(task) => handleTaskChange(task)}
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

        <Modal show={showModal} centered>
          <Form onSubmit={handleImportActivity}>
            <Row>
              <Modal.Title style={{ paddingLeft: 25, paddingTop: 25 }}>
                Select Your Project
              </Modal.Title>
            </Row>
            <Modal.Body>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    className="mb-3"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {section === 4 ? (
                      <>
                        <option value={""}>Open This</option>
                        <option value={"CO2 Neutral"}>CO2 Neutral</option>
                        <option value={"Logistic Automation"}>
                          Logistic Automation
                        </option>
                        <option value={"Vision System"}>Vision System</option>
                        <option value={"DX"}>DX</option>
                        <option value={"Layout"}>Layout</option>
                      </>
                    ) : (
                      <>
                        <option value={""}>Open This</option>
                        <option value={"New Model"}>New Model</option>
                        <option value={"Quality"}>Quality</option>
                        <option value={"Integrated Factory"}>
                          Integrated Factory
                        </option>
                        <option value={"Productivity"}>Productivity</option>
                        <option value={"Profit Improvement"}>
                          Profit Improvement
                        </option>
                      </>
                    )}
                  </Form.Select>
                  <Form.Label>Select Project</Form.Label>
                  <Form.Select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                  >
                    <option value={""}>Open This</option>
                    {tableProject.map(
                      (project) =>
                        project.category === category && (
                          <option key={project.id} value={project.id}>
                            {project.project_name}
                          </option>
                        )
                    )}
                  </Form.Select>
                </Form.Group>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit">Add</Button>
              <Button variant="secondary" onClick={reset}>
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default ScheduleAnalysis;
