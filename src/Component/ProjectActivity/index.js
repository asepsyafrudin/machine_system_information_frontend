import React from "react";
import GanttChart from "../GanttChart";
import { ViewMode } from "gantt-task-react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "./projectActivity.css";
import {
  createActivityApi,
  getActivityByProjectIdApi,
  getAllUsersApi,
  getProjectByIdApi,
} from "../../Config/API";
import { SiStarbucks } from "react-icons/si";
import TitleSection from "../TitleSection";
import { BsPlusCircleFill, BsSave } from "react-icons/bs";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import { CHANGEDATA, SAVECHANGEDATA } from "../../Context/const";
import { FaBackward } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";

function ProjectActivity(props) {
  const { id, dataChangeCount, dispatch, todoChangeCount } = props;
  const [project, setProject] = useState([]);
  const [description, setDescription] = useState("");
  const [tableUser, setTableUser] = useState([]);
  const [activity, setActivity] = useState([]);
  const [titleProject, setTitleProject] = useState("");
  const [viewMode, setViewMode] = useState(ViewMode.Month);
  const [show, setShow] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [type, setType] = useState("");
  const [dependencies, setDepedencies] = useState("");
  const [progress, setProgress] = useState("0");
  const [idUpdate, setIdUpdate] = useState("");
  const [colWidth, setColWidth] = useState(120);
  const [showNotif, setShowNotif] = useState(false);
  const [message, setMessage] = useState(false);
  const [rowHeight, setRowHeight] = useState(50);
  const [listCellWidth, setListCellWidth] = useState(200);

  const backgroundColorDelay = (endProject, progressBar) => {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    if (parseInt(progressBar) === 100) {
      return { backgroundColor: "#A3A3FF", backgroundSelectedColor: "#A3A3FF" };
    } else if (currentDate - endProject > 0) {
      return { backgroundColor: "red", backgroundSelectedColor: "red" };
    }
  };

  useEffect(() => {
    if (id) {
      axios.get(getProjectByIdApi(id)).then((response) => {
        const dataProject = response.data.data[0];
        setTitleProject(dataProject.project_name);
        setProject(dataProject);
        setDescription(dataProject.description);

        const data = {
          name: "PE Schedule",
          id: dataProject.id,
          progress: dataProject.progress,
          type: "project",
          start: new Date(dataProject.start),
          end: new Date(dataProject.finish),
          hideChildren: false,
        };
        let activityData = [];
        activityData.push(data);

        axios
          .get(getActivityByProjectIdApi(dataProject.id))
          .then((response) => {
            const dataActivity = response.data.data;
            if (dataActivity.length > 0) {
              for (let index = 0; index < dataActivity.length; index++) {
                let pushData = {
                  id: dataActivity[index].id,
                  start: new Date(moment(dataActivity[index].start)),
                  end: new Date(moment(dataActivity[index].end)),
                  name: dataActivity[index].name,
                  progress: dataActivity[index].progress,
                  dependencies: dataActivity[index].dependencies,
                  type: dataActivity[index].type,
                  project: dataActivity[index].project,
                  styles: backgroundColorDelay(
                    new Date(moment(dataActivity[index].end)),
                    dataActivity[index].progress
                  ),
                };
                activityData.push(pushData);
              }
            }
            setActivity(activityData);
          });
      });
    }

    axios.get(getAllUsersApi).then((response) => {
      setTableUser(response.data.data);
    });
  }, [id, viewMode]);

  const resetForm = () => {
    setActivityName("");
    setFinishDate("");
    setStartDate("");
    setProgress("0");
    setType("");
    setIdUpdate("");
    setDepedencies("");
    setShow(false);
  };
  const handleAddActivity = (e) => {
    e.preventDefault();
    let data = {
      start: new Date(startDate),
      end: new Date(type === "milestone" ? startDate : finishDate),
      name: activityName,
      progress: progress,
      dependencies: dependencies === "" ? [] : [dependencies],
      type: type,
      project: project.id,
    };

    if (idUpdate === "") {
      data = { ...data, id: `${activityName}-${uuid()}` };
      setActivity((prev) => [...prev, data]);
      resetForm();
      dispatch({ type: CHANGEDATA });
    } else {
      let filterData = [];
      if (activity.length > 0) {
        for (let index = 0; index < activity.length; index++) {
          if (activity[index].id === idUpdate) {
            filterData.push({
              ...data,
              id: idUpdate,
            });
          } else {
            filterData.push(activity[index]);
          }
        }
      }
      setActivity(filterData);
      dispatch({ type: CHANGEDATA });
      resetForm();
    }
  };

  const dateParse = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  const handleDoubleClick = (task) => {
    const findData = activity.find((value) => value.id === task.id);
    if (findData) {
      setActivityName(findData.name);
      setFinishDate(dateParse(findData.end));
      setStartDate(dateParse(findData.start));
      setType(findData.type);
      setDepedencies(findData.dependencies[0]);
      setProgress(findData.progress);
      setIdUpdate(findData.id);
      setShow(true);
    }
  };

  const handleDeleteTask = (task) => {
    const confirm = window.confirm("Do you want to delete this activity?");
    if (confirm) {
      const filterData = activity.filter((value) => value.id !== task.id);
      setActivity(filterData);
      setShow(false);
      dispatch({ type: CHANGEDATA });
    }
  };

  const handleDeleteActivity = (id) => {
    const confirm = window.confirm("Do you want to delete this activity?");
    if (confirm) {
      const filterData = activity.filter((value) => value.id !== id);
      setActivity(filterData);
      resetForm("");
      setShow(false);
      dispatch({ type: CHANGEDATA });
    }
  };

  const handleSaveData = () => {
    const confirm = window.confirm("Do you Want To Save This?");
    if (confirm) {
      const dataSave = activity.filter((value) => value.type !== "project");
      axios.post(createActivityApi, dataSave).then((response) => {
        setIdUpdate("");
        setMessage("Data Already SAVE");
        setShowNotif(true);
        dispatch({ type: SAVECHANGEDATA });
      });
    }
  };

  const userNameFunction = (id) => {
    const findUser = tableUser.find((value) => value.id === parseInt(id));
    if (findUser) {
      return CapitalCaseFirstWord(findUser.username);
    }
    return "";
  };

  const navigate = useNavigate();
  const handleBackPage = () => {
    if ((dataChangeCount === 0) & (todoChangeCount === 0)) {
      navigate("/projectPage");
    } else {
      let confirm = window.confirm(
        "Your change don't save yet , do you want to next ?"
      );
      if (confirm) {
        navigate("/projectPage");
      }
    }
  };

  const handleExpanderClick = (task) => {
    setActivity(activity.map((t) => (t.id === task.id ? task : t)));
  };

  return (
    <div className="capabilityFormContainer">
      <div className="capabilityForm">
        <div style={{ textAlign: "right", marginBottom: 2 }}>
          <Row>
            <Col sm={6} style={{ textAlign: "left" }}>
              <Button style={{ marginRight: 5 }} onClick={handleBackPage}>
                <FaBackward pointerEvents={"none"} /> Back to Project Page
              </Button>
            </Col>
            <Col sm={6} style={{ textAlign: "right" }}>
              <Button style={{ marginRight: 5 }} onClick={handleSaveData}>
                <BsSave pointerEvents={"none"} /> Save
              </Button>
              <Button onClick={() => setShow(true)}>
                <BsPlusCircleFill pointerEvents={"none"} />
                Add
              </Button>
            </Col>
          </Row>
        </div>
        <TitleSection
          title={`Project Schedule ${titleProject}`}
          icon={<SiStarbucks style={{ marginRight: 5 }} />}
        />
        <div>
          <Row className="mb-3" style={{ textAlign: "left" }}>
            <Col sm={2}>PIC</Col>
            <Col sm={4}>: {userNameFunction(project.manager_id)}</Col>
            <Col sm={6} style={{ textAlign: "right" }}>
              <div className="box-plan" /> Plan
              <div className="box-actual" /> Progress
              <div className="box-delay" /> Delay
              <div className="box-milestone" /> Milestone
            </Col>
          </Row>
          <Row className="mb-3" style={{ textAlign: "left" }}>
            <Col sm={2}>Description</Col>
            <Col sm={10}>: {description}</Col>
          </Row>
        </div>
        {activity.length > 0 && (
          <GanttChart
            tasks={activity}
            viewMode={viewMode}
            listCellWidth={listCellWidth}
            columnWidth={colWidth}
            rowHeight={rowHeight}
            onExpanderClick={(task) => handleExpanderClick(task)}
            onDoubleClick={(task) => handleDoubleClick(task)}
            onDelete={(task) => handleDeleteTask(task)}
          />
        )}
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
          Column Width :
          <input
            width={50}
            type="number"
            value={colWidth}
            onChange={(e) => setColWidth(e.target.value)}
          />
          {"    "}Row Height :
          <input
            width={50}
            type="number"
            value={rowHeight}
            onChange={(e) => setRowHeight(parseInt(e.target.value))}
          />
          {"    "}List Cell Width :
          <input
            width={50}
            type="number"
            value={listCellWidth}
            onChange={(e) => setListCellWidth(parseInt(e.target.value))}
          />
        </div>
        <Modal show={show} centered className="modalAddActivity">
          <Form onSubmit={handleAddActivity}>
            <Row className="titleModalAddActivity">
              <Col sm={10}>Add Activity Here</Col>
              {idUpdate && (
                <Col sm={2}>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteActivity(idUpdate)}
                  >
                    <MdDeleteForever style={{ pointerEvents: "none" }} />
                  </Button>
                </Col>
              )}
            </Row>
            <Modal.Body>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Activity Name</Form.Label>
                  <Form.Control
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    type="text"
                    placeholder="Enter Activity Name"
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Open This
                    </option>
                    <option value="task">Task</option>
                    <option value="milestone">Milestone</option>
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Start</Form.Label>
                  <Form.Control
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    type="date"
                    placeholder="Enter Activity Name"
                    required
                  />
                </Form.Group>
              </Row>
              {type === "task" && (
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Finish</Form.Label>
                    <Form.Control
                      type="date"
                      value={finishDate}
                      onChange={(e) => setFinishDate(e.target.value)}
                      placeholder="Enter Activity Name"
                      required
                    />
                  </Form.Group>
                </Row>
              )}
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Dependencies</Form.Label>
                  <Form.Select
                    value={dependencies}
                    onChange={(e) => setDepedencies(e.target.value)}
                  >
                    <option value="">Open This</option>
                    {activity.length > 1 &&
                      activity.map((value, index) => {
                        return (
                          <option key={index} value={value.id}>
                            {value.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Progress {progress}%</Form.Label>
                  <Form.Range
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                  />
                </Form.Group>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit">ADD</Button>
              <Button variant="success" onClick={resetForm}>
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        <Modal
          show={showNotif}
          onHide={() => {
            setShowNotif(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Notification</Modal.Title>
          </Modal.Header>
          <Modal.Body>{message}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowNotif(false);
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

export default ProjectActivity;
