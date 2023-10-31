import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Row, Table } from "react-bootstrap";
import GraphBarProject from "../GraphBarProject";
import GraphPieProject from "../GraphPieProject";
import TitleSection from "../TitleSection";
import { BsListNested } from "react-icons/bs";
import axios from "axios";
import { getAllUsersApi, getTodoByUserIdApi } from "../../Config/API";
import moment from "moment";
import { MdDoneOutline } from "react-icons/md";
import { AiOutlineClose, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { CgAttachment } from "react-icons/cg";
import { useRef } from "react";

function ToDoListSummary(props) {
  const { userId } = props;
  const [tableTodoList, setTableTodoList] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const refAttachment = useRef();
  useEffect(() => {
    if (userId) {
      axios
        .get(getTodoByUserIdApi(userId))
        .then((response) => {
          setTableTodoList(response.data.data);
        })
        .catch((error) => console.log(error));
    }

    axios
      .get(getAllUsersApi)
      .then((response) => {
        setAllUser(response.data.data);
      })
      .then((error) => console.log(error));
  }, [userId]);

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

  const handleClickStatus = (e) => {
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
    // const id = e.target.id;
    // const findData = todo.find((value) => value.id === id);
    // if (findData) {
    //   setItemName(findData.item);
    //   setDueDate(dateParse(findData.due_date));
    //   setIdEdit(id);
    //   setStatus(findData.status);
    //   setPic(findData.pic);
    //   setPicId(findData.pic_id);
    // }
    // setShow(true);
  };

  const handleDelete = (e) => {
    // const id = e.target.id;
    // const confirm = window.confirm("Do you want to delete this activity?");
    // if (confirm) {
    //   const filterData = todo.filter((value) => value.id !== id);
    //   axios
    //     .delete(deleteTodoListByIdApi(id))
    //     .then((response) => {
    //       setTodo(filterData);
    //     })
    //     .catch((error) => console.log(error));
    // }
  };

  const handleShowAttachment = (e) => {
    // const id = e.target.id;
    // if (todoChangeCount === 0) {
    //   setIdTodo(id);
    //   setShowModalAttachment(true);
    // } else {
    //   setMessage("Please Save Your Data First");
    //   setShowNotif(true);
    // }
  };

  const handleChangeFile = (e) => {
    // setFile([...e.target.files]);
  };

  const saveAttachment = (e) => {
    // e.preventDefault();
    // if (file.length > 0) {
    //   let formData = new FormData();
    //   formData.append("id", idTodo);
    //   for (let index = 0; index < file.length; index++) {
    //     formData.append("file", file[index]);
    //   }
    //   const onUploadProgress = (progressEvent) => {
    //     const { loaded, total } = progressEvent;
    //     let percent = Math.floor((loaded * 100) / total);
    //     if (percent < 100) {
    //       setPercentProgress(percent);
    //       // console.log(`${loaded} bytes of ${total} bytes. ${percent}%`);
    //     }
    //   };
    //   setLoading(true);
    //   axios
    //     .post(createFileApi, formData, {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //       onUploadProgress,
    //     })
    //     .then((response) => {
    //       refAttachment.current.value = "";
    //       resetForm();
    //       setPercentProgress(0);
    //       setActionState((prev) => prev + 1);
    //       setLoading(false);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // }
  };

  const handleDeleteFile = (e) => {
    // const id = e.target.id;
    // const confirm = window.confirm("Apakah file Akan di Hapus?");
    // if (confirm) {
    //   axios
    //     .delete(deleteFileByIdApi(id))
    //     .then((response) => {})
    //     .catch((error) => console.log(error));
    // }
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
                        <td>{index + 1}</td>
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
                              onClick={handleClickStatus}
                              title="Mark Done"
                            >
                              <MdDoneOutline
                                style={{ pointerEvents: "none" }}
                              />
                            </Button>
                          ) : (
                            <Button
                              id={value.id}
                              style={{ marginRight: 5 }}
                              onClick={handleClickStatus}
                              variant="warning"
                              title="Mark Open"
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
                          >
                            <AiOutlineEdit style={{ pointerEvents: "none" }} />
                          </Button>
                          <Button
                            variant="danger"
                            id={value.id}
                            onClick={handleDelete}
                            style={{ marginRight: 5 }}
                            title="Delete"
                          >
                            <AiOutlineDelete
                              style={{ pointerEvents: "none" }}
                            />
                          </Button>
                          <Button
                            variant="success"
                            id={value.id}
                            onClick={handleShowAttachment}
                            ref={refAttachment}
                            title="Attachment"
                          >
                            <CgAttachment style={{ pointerEvents: "none" }} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ToDoListSummary;
