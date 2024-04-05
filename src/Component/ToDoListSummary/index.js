import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Form,
  Modal,
  ProgressBar,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import TitleSection from "../TitleSection";
import { BsListNested } from "react-icons/bs";
import "./todoSummary.css";
import axios from "axios";
import {
  createFileApi,
  deleteFileByIdApi,
  getAllProjectApi,
  getAllUsersApi,
  getCommentBySelectedId,
  getFileByIdApi,
  getTodoByUserIdApi,
  postCommentApi,
  updateTodoListByIdApi,
} from "../../Config/API";
import moment from "moment";
import { MdDoneOutline } from "react-icons/md";
import { AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import { useRef } from "react";
import PaginationTable from "../Pagination";
import { GrView } from "react-icons/gr";
import CommentCard from "../CommentCard";
import { fileName } from "../../Config/fileName";
import { getExtFileName } from "../../Config/fileType";
import { GoDesktopDownload } from "react-icons/go";
import { RiDeleteBin2Fill } from "react-icons/ri";

function ToDoListSummary(props) {
  const { userId } = props;
  const [tableTodoList, setTableTodoList] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const refAttachment = useRef();
  const [totalPageData, setTotalPageData] = useState(1);
  const [numberStart, setNumberStart] = useState("");
  const [action, setAction] = useState(0);
  const maxPagesShow = 3;
  const [page, setPage] = useState(1);
  const [assignBy, setAssignBy] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemName, setItemName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [idEdit, setIdEdit] = useState("");
  const [actual_finish, setActualFinish] = useState("");
  const [projectId, setProjectId] = useState("");
  const [file, setFile] = useState([]);
  const [percentProgress, setPercentProgress] = useState(0);
  const [tableFile, setTableFile] = useState([]);
  const [tableComment, setTableComment] = useState([]);
  const [picId, setPicId] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [message, setMessage] = useState("");
  const [tableProject, setTableProject] = useState([]);
  const [showModalMarkAsFinish, setShowModalMarkAsFinish] = useState(false);
  const [comment, setComment] = useState("");
  const [filterType, setFilterType] = useState("");
  const [activity, setActivity] = useState("");

  useEffect(() => {
    axios
      .get(getAllUsersApi)
      .then((response) => {
        setAllUser(response.data.data);
      })
      .then((error) => console.log(error));

    axios.get(getAllProjectApi).then((response) => {
      setTableProject(response.data.data);
    });
  }, [action]);

  useEffect(() => {
    if (idEdit) {
      axios
        .get(getFileByIdApi(idEdit))
        .then((response) => {
          setTableFile(response.data.data);
        })
        .catch((error) => console.log(error));
    }

    if (localStorage.getItem("user")) {
      const userTodo = JSON.parse(localStorage.getItem("user"));
      const { id } = userTodo;

      const data = {
        userId: id,
        page,
        filterType,
      };
      axios
        .post(getTodoByUserIdApi, data)
        .then((response) => {
          let filteredData = response.data.data;
          setTableTodoList(filteredData);
          setNumberStart(response.data.numberStart);
          setTotalPageData(response.data.totalPageData);
          console.log("test update data");
        })
        .catch((error) => console.log(error));
    }

    axios
      .get(getAllUsersApi)
      .then((response) => {
        setAllUser(response.data.data);
      })
      .then((error) => console.log(error));

    axios.get(getAllProjectApi).then((response) => {
      setTableProject(response.data.data);
    });

    if (idEdit) {
      axios.get(getCommentBySelectedId(idEdit)).then((response) => {
        setTableComment(response.data.data);
      });
    }
  }, [userId, page, action, idEdit, filterType]);

  const functionName = (id) => {
    const dataUser = allUser.find((value) => value.id === parseInt(id));
    if (dataUser) {
      return dataUser.username;
    }

    return "";
  };

  const statusFunction = (status, due_date) => {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    let dueDate = new Date(due_date).getTime();

    if (status === "Finish") {
      return <Badge bg="primary">Finish</Badge>;
    } else {
      if (dueDate > currentDate) {
        return <Badge bg="success">On Progress</Badge>;
      } else {
        return <Badge bg="danger">Delay</Badge>;
      }
    }
  };

  const handleEditTodoList = (e) => {
    e.preventDefault();
    if (idEdit) {
      let data = {
        id: idEdit,
        project_id: projectId,
        item: itemName,
        due_date: dueDate,
        status: status,
        user_id: assignBy,
        pic_id: picId,
        activity_name: activity,
        actual_finish: status === "Open" ? "" : actual_finish,
      };

      axios.post(updateTodoListByIdApi, data).then(() => {
        resetForm();
        setMessage("Data Already Update");
        setShowNotif(true);

        setAction((prev) => prev + 1);
      });
    }
  };

  const handleMarkAsDoneOrOpen = (e) => {
    const id = e.target.id;
    let confirm = window.confirm("Do you want to change status?");
    if (confirm) {
      const findData = tableTodoList.find((value) => value.id === id);
      let newStatus = "";
      if (findData.status === "Open") {
        newStatus = "Finish";
      } else {
        newStatus = "Open";
      }
      let data = {
        id: findData.id,
        project_id: findData.project_id,
        item: findData.item,
        due_date: findData.due_date,
        pic: findData.pic,
        status: newStatus,
        actual_finish:
          newStatus === "Finish" ? moment().format("YYYY-MM-DD") : "",
        user_id: findData.user_id,
        pic_id: findData.pic_id,
        activity_name: findData.activity_name,
      };

      axios.post(updateTodoListByIdApi, data).then((response) => {
        console.log(response.data);
        resetForm();
        setMessage("Data Already Update");
        setShowNotif(true);
        setAction((prev) => prev + 1);
      });
    }
  };

  const handleClickStatus = (e) => {
    const id = e.target.id;
    setIdEdit(id);
    setShowModalMarkAsFinish(true);

    // const id = e.target.id;
    // let confirm = window.confirm("Do you want to change status?");
    // if (confirm) {
    //   const findData = todo.find((value) => value.id === id);
    //   let newStatus = "";
    //   if (findData.status === "Open") {
    //     newStatus = "Finish";
    //   } else {
    //     newStatus = "Open";
    //   }
    //   let newListTodo = [];
    //   if (todo.length > 0) {
    //     for (let index = 0; index < todo.length; index++) {
    //       if (todo[index].id === id) {
    //         newListTodo.push({
    //           id: todo[index].id,
    //           project_id: todo[index].project_id,
    //           item: todo[index].item,
    //           due_date: todo[index].due_date,
    //           pic: todo[index].pic,
    //           status: newStatus,
    //           actual_finish: moment().format("YYYY-MM-DD"),
    //           user_id: todo[index].user_id,
    //           pic_id: todo[index].pic_id,
    //         });
    //       } else {
    //         newListTodo.push(todo[index]);
    //       }
    //     }
    //   }
    // setTodo(newListTodo);
    // }
  };

  const dateParse = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  const handleClickEdit = (e) => {
    const id = e.target.id;
    const findData = tableTodoList.find((value) => value.id === id);
    if (findData) {
      setItemName(findData.item);
      setDueDate(dateParse(findData.due_date));
      setProjectId(findData.project_id);
      setIdEdit(id);
      setStatus(findData.status);
      setAssignBy(findData.user_id);
      setPicId(findData.pic_id);
      setActivity(findData.activity_name);
      setActualFinish(findData.actual_finish);
    }
    setShow(true);
  };

  const handleEditComment = () => {
    // const id = e;
  };

  const handleChangeFile = (e) => {
    setFile([...e.target.files]);
  };

  const handleDeleteFile = (e) => {
    const id = e.target.id;
    const confirm = window.confirm("Apakah file Akan di Hapus?");
    if (confirm) {
      axios
        .delete(deleteFileByIdApi(id))
        .then(() => {
          setAction((prev) => prev + 1);
        })
        .catch((error) => console.log(error));
    }
  };
  const resetForm = () => {
    setItemName("");
    setDueDate("");
    setStatus("");
    setPicId("");
    setProjectId("");
    setAssignBy("");
    setShow(false);
  };

  const handleSendComment = () => {
    const data = {
      user_id: userId,
      selected_item: "todo",
      selected_id: idEdit,
      comment: comment,
    };
    axios.post(postCommentApi, data).then(() => {
      setComment("");
      setAction((prev) => prev + 1);
    });
  };

  const optionMember = () => {
    let option = [];
    if (idEdit) {
      const dataTodoList = tableTodoList.find((value) => value.id === idEdit);
      if (dataTodoList) {
        if (dataTodoList.user_id === parseInt(userId)) {
          const project = tableProject.find(
            (value) => value.id === dataTodoList.project_id
          );
          if (project) {
            const memberProject = project.member;
            if (memberProject) {
              for (let index = 0; index < memberProject.length; index++) {
                option.push(
                  <option key={index} value={memberProject[index].user_id}>
                    {functionName(memberProject[index].user_id)}
                  </option>
                );
              }
            }
          }
        } else {
          option.push(
            <option key={new Date().getTime()} value={picId} disabled>
              {functionName(picId)}
            </option>
          );
        }
      }
    }
    return option;
  };

  // const activityOption = () => {
  //   let option = [];
  //   if (tableActivity.length > 0) {
  //     for (let index = 0; index < tableActivity.length; index++) {
  //       option.push(
  //         <option key={index} value={tableActivity[index].name}>
  //           {tableActivity[index].name}
  //         </option>
  //       );
  //     }
  //   }
  //   return option;
  // };

  const loadingPostData = (loadingData) => {
    let loading = [];
    if (loadingData) {
      loading.push(
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
          key={new Date()}
        />
      );
    }
    return loading;
  };

  const saveAttachment = (e) => {
    e.preventDefault();
    if (file.length > 0) {
      let formData = new FormData();
      formData.append("id", idEdit);
      for (let index = 0; index < file.length; index++) {
        formData.append("file", file[index]);
      }
      const onUploadProgress = (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        if (percent < 100) {
          setPercentProgress(percent);
          // console.log(`${loaded} bytes of ${total} bytes. ${percent}%`);
        }
      };

      setLoading(true);
      axios
        .post(createFileApi, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress,
        })
        .then(() => {
          refAttachment.current.value = "";
          resetForm();
          setPercentProgress(0);
          setLoading(false);
          setAction((prev) => prev + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      
      <Row>
        <Col lg={12}>
          <div className="capabilityFormContainer">
            <div className="capabilityForm">
              <TitleSection
                title="Todo List Item"
                icon={<BsListNested style={{ marginRight: 5 }} />}
              />
              <div className="filter mb-3 col-2" style={{ textAlign: "left" }}>
                <Form.Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">Filter Todo By</option>
                  <option value="day">This Day</option>
                  <option value="week2">This Week</option>
                  <option value="month2">This Month</option>
                  <option value="week">Next Week</option>
                  <option value="month">Next Month</option>
                </Form.Select>
              </div>

              <Table responsive hover striped bordered>
                <thead>
                  <tr>
                    <th>NO</th>
                    <th>Todo List</th>
                    <th>Project</th>
                    <th>Activity</th>
                    <th>Create date</th>
                    <th>Due Date</th>
                    <th>Actual Finish</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableTodoList.map((value, index) => {
                    return (
                      <tr key={index}>
                        <td>{numberStart + index}</td>
                        <td>{value.item}</td>
                        <td>{value.project_name}</td>
                        <td>{value.activity_name}</td>
                        <td>{moment(value.create_date).format("LLL")}</td>
                        <td>{value.due_date}</td>
                        <td>
                          {" "}
                          {value.status === "Finish" ? value.actual_finish : ""}
                        </td>
                        <td>{statusFunction(value.status, value.due_date)}</td>
                        <td>
                          {value.status === "Open" ? (
                            <Button
                              id={value.id}
                              style={{ marginRight: 5 }}
                              onClick={handleMarkAsDoneOrOpen}
                              title="Mark Done"
                              size="sm"
                            >
                              <MdDoneOutline
                                style={{ pointerEvents: "none" }}
                              />
                            </Button>
                          ) : (
                            <Button
                              id={value.id}
                              style={{ marginRight: 5 }}
                              onClick={handleMarkAsDoneOrOpen}
                              variant="warning"
                              title="Mark Open"
                              size="sm"
                            >
                              <AiOutlineClose
                                style={{ pointerEvents: "none" }}
                              />
                            </Button>
                          )}
                          <Button
                            style={{ marginRight: 5 }}
                            id={value.id}
                            onClick={handleClickEdit}
                            variant="secondary"
                            title="Edit"
                            size="sm"
                          >
                            <AiOutlineEdit style={{ pointerEvents: "none" }} />
                          </Button>

                          <Button
                            variant="success"
                            id={value.id}
                            onClick={handleClickStatus}
                            title="View Attchment & Progress"
                            size="sm"
                          >
                            <GrView style={{ pointerEvents: "none" }} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
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
          </div>
        </Col>
      </Row>
      <Modal show={show} centered>
        <Form onSubmit={handleEditTodoList}>
          <Modal.Header>
            <Modal.Title>Add To Do List</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  type="text"
                  placeholder="Enter Item Name"
                  required
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  type="date"
                  placeholder="Enter Due Date"
                  required
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>PIC</Form.Label>
                <Form.Select
                  required
                  value={picId}
                  onChange={(e) => setPicId(e.target.value)}
                >
                  <option value="" disabled>
                    Open This
                  </option>
                  {optionMember()}
                </Form.Select>
              </Form.Group>
            </Row>
            {/* <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Activity</Form.Label>
                <Form.Select
                  required
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                >
                  <option value="" disabled>
                    Open This
                  </option>
                  {activityOption()}
                </Form.Select>
              </Form.Group>
            </Row> */}
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="" disabled>
                    Open This
                  </option>
                  <option value="Open">Open</option>
                  <option value="Finish">Finish</option>
                </Form.Select>
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
      <Modal
        show={showModalMarkAsFinish}
        onHide={() => {
          setShowModalMarkAsFinish(false);
        }}
        scrollable
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Progress View</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={saveAttachment}>
            <Row>
              <Col lg={8}>
                <Form.Label>Input Attachment</Form.Label>
              </Col>
              <Col lg={4} />
            </Row>
            <Row>
              <Col lg={8}>
                <Form.Control
                  multiple
                  type="file"
                  required
                  ref={refAttachment}
                  onChange={handleChangeFile}
                />
              </Col>
              <Col sm={4}>
                <Button type="submit">{loadingPostData(loading)}Submit</Button>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col>
              {percentProgress > 0 && (
                <ProgressBar
                  animated
                  now={percentProgress}
                  label={`${percentProgress}%`}
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <Table responsive hover striped bordered>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>File Name</th>
                    <th>File Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableFile.length > 0 ? (
                    tableFile.map((value, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td style={{ textAlign: "left", paddingLeft: 20 }}>
                            {fileName(value.name)}
                          </td>
                          <td>{getExtFileName(value.name)}</td>
                          <td>
                            <a
                              href={value.file}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Button size="sm" style={{ marginRight: 5 }}>
                                <GoDesktopDownload
                                  style={{
                                    marginRight: 5,
                                    pointerEvents: "none",
                                  }}
                                />
                                OPEN
                              </Button>
                            </a>
                            <Button
                              size="sm"
                              variant="danger"
                              id={value.id}
                              onClick={handleDeleteFile}
                            >
                              <RiDeleteBin2Fill
                                style={{
                                  marginRight: 5,
                                  pointerEvents: "none",
                                }}
                              />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr key={1}>
                      <td colSpan={4}>No File</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className="mb-3 mt-3">
            <Form.Control as={Col}>
              <Form.Label>Input Progress</Form.Label>
              <Form.Control
                as={"textarea"}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Control>
          </Row>
          <Row className="mb-3">
            <Button
              onClick={() => handleSendComment()}
              disabled={comment ? false : true}
            >
              Submit Progress
            </Button>
          </Row>
          <hr />
          {tableComment.map((value) => {
            return (
              <CommentCard
                userName={functionName(value.user_id)}
                date={value.create_date}
                comment={value.comment}
                onHanldeEdit={(e) => handleEditComment(e)}
              />
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModalMarkAsFinish(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ToDoListSummary;
