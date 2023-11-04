import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import TitleSection from "../TitleSection";
import { BsListNested } from "react-icons/bs";
import "./todoSummary.css";
import axios from "axios";
import {
  deleteTodoListByIdApi,
  getAllProjectApi,
  getAllUsersApi,
  getCommentBySelectedId,
  getProjectByIdApi,
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
  const [tableFile, setTableFile] = useState([]);
  const [tableComment, setTableComment] = useState([]);
  const [picId, setPicId] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [message, setMessage] = useState("");
  const [tableProject, setTableProject] = useState([]);
  const [showModalMarkAsFinish, setShowModalMarkAsFinish] = useState(false);
  const [comment, setComment] = useState("");

  const refFile = useRef();

  useEffect(() => {
    if (userId) {
      axios
        .get(getTodoByUserIdApi(userId, page))
        .then((response) => {
          setTableTodoList(response.data.data);
          setNumberStart(response.data.numberStart);
          setTotalPageData(response.data.totalPageData);
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
  }, [userId, page, action, idEdit]);

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
        actual_finish: status === "Open" ? "" : actual_finish,
      };

      axios.post(updateTodoListByIdApi, data).then((response) => {
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
      };

      axios.post(updateTodoListByIdApi, data).then((response) => {
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
      setActualFinish(findData.actual_finish);
    }
    setShow(true);
  };

  const handleDelete = (e) => {
    const id = e.target.id;
    const confirm = window.confirm("Do you want to delete?");
    if (confirm) {
      axios.delete(deleteTodoListByIdApi(id)).then((response) => {
        window.alert("data already delete");
        setAction((prev) => prev + 1);
      });
    }
  };

  const handleEditComment = (e) => {
    const id = e;
  };

  const handleShowAttachment = (e) => {};

  const handleChangeFile = (e) => {};

  const saveAttachment = (e) => {};

  const handleDeleteFile = (e) => {};
  const resetForm = () => {
    setItemName("");
    setDueDate("");
    setStatus("");
    setPicId("");
    setProjectId("");
    setAssignBy("");
    setShow(false);
    setShowModalMarkAsFinish(false);
  };

  const handleSendComment = () => {
    const data = {
      user_id: userId,
      selected_item: "todo",
      selected_id: idEdit,
      comment: comment,
    };
    axios.post(postCommentApi, data).then((response) => {
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
              <Table>
                <thead>
                  <tr>
                    <th>NO</th>
                    <th>Todo List</th>
                    <th>Project</th>
                    <th>Assign By</th>
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
                        <td>{functionName(value.user_id)}</td>
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
          <Form>
            <Row>
              <Col lg={8}>
                <Form.Label>Input Attachment</Form.Label>
              </Col>
              <Col lg={4} />
            </Row>
            <Row>
              <Col lg={8}>
                <Form.Control required type="file" ref={refFile} multiple />
              </Col>
              <Col lg={4}>
                <Button type="submit">Submit Attachment</Button>
              </Col>
            </Row>
          </Form>
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
          {tableComment.map((value, index) => {
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
