import React, { useEffect, useRef } from "react";
import { RiDeleteBin2Fill, RiTodoFill } from "react-icons/ri";
import TitleSection from "../TitleSection";
import { useState } from "react";
import { v4 as uuid } from "uuid";
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
import { BsPlusCircleFill, BsSave } from "react-icons/bs";
import moment from "moment";
import axios from "axios";
import {
  createAndUpdateTodoApi,
  createFileApi,
  deleteFileByIdApi,
  getFileByIdApi,
  getTodoByProjectIdApi,
  getUserByUserIdApi,
} from "../../Config/API";
import { CgAttachment } from "react-icons/cg";
import { fileName } from "../../Config/fileName";
import { getExtFileName } from "../../Config/fileType";
import { GoDesktopDownload } from "react-icons/go";
import { SAVETODO, TODOCHANGECOUNT } from "../../Context/const";
import PaginationTable from "../Pagination";

function ToDoList(props) {
  const { id, dispatch, todoChangeCount } = props;
  const refAttachment = useRef();
  const [show, setShow] = useState(false);
  const [todo, setTodo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemName, setItemName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState("");
  const [pic, setPic] = useState("");
  const [idEdit, setIdEdit] = useState("");
  const [file, setFile] = useState([]);
  const [tableFile, setTableFile] = useState([]);
  const [message, setMessage] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [idTodo, setIdTodo] = useState("");
  const [showModalAttachment, setShowModalAttachment] = useState(false);
  const [percentProgress, setPercentProgress] = useState(0);
  const [actionState, setActionState] = useState(0);
  const [updateValue, setUpdateValue] = useState(0);
  const [totalPageData, setTotalPageData] = useState(1);
  const [page, setPage] = useState(1);
  const [numberStart, setNumberStart] = useState("");

  const maxPagesShow = 3;

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;
    if (idTodo) {
      axios
        .get(getFileByIdApi(idTodo))
        .then((response) => {
          isMounted && setTableFile(response.data.data);
        })
        .catch((error) => console.log(error));
    }
    axios
      .get(getTodoByProjectIdApi(id, page))
      .then((response) => {
        isMounted && setTodo(response.data.data);
        isMounted && setNumberStart(response.data.numberStart);
        isMounted && setTotalPageData(response.data.totalPageData);
      })
      .catch((error) => console.log(error));
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      axios.get(getUserByUserIdApi(user.id)).then((response) => {
        const dataUser = response.data.data;
        if (dataUser.length > 0) {
          isMounted && setUserId(dataUser[0].id);
        }
      });
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, idTodo, actionState, updateValue, page]);

  const handleSaveData = () => {
    let confirm = window.confirm("Do You Want to Save Todo List?");
    if (confirm) {
      axios.post(createAndUpdateTodoApi, todo).then((response) => {
        setMessage("Your Data Already Save");
        setShowNotif(true);
        dispatch({ type: SAVETODO });
        setUpdateValue((prev) => prev + 1);
      });
    }
  };

  const resetForm = () => {
    setItemName("");
    setDueDate("");
    setStatus("");
    setPic("");
    setShow(false);
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    let data = {
      project_id: id,
      item: itemName,
      due_date: dueDate,
      status: status,
      pic: pic,
      user_id: userId,
    };

    if (idEdit) {
      let newListTodo = [];
      if (todo.length > 0) {
        for (let index = 0; index < todo.length; index++) {
          if (todo[index].id === idEdit) {
            newListTodo.push({
              ...data,
              id: idEdit,
              actual_finish: status === "Finish" && todo[index].actual_finish,
            });

            dispatch({ type: TODOCHANGECOUNT });
          } else {
            newListTodo.push(todo[index]);

            dispatch({ type: TODOCHANGECOUNT });
          }
        }
      }

      setTodo(newListTodo);

      resetForm();
      setIdEdit("");
    } else {
      data = {
        ...data,
        id: uuid(),
        actual_finish: status === "Finish" ? moment().format("YYYY-MM-DD") : "",
      };
      setTodo((prev) => [...prev, data]);
      dispatch({ type: TODOCHANGECOUNT });
      resetForm();
    }
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
    const id = e.target.id;
    let confirm = window.confirm("Do you want to change status?");
    if (confirm) {
      const findData = todo.find((value) => value.id === id);
      let newStatus = "";
      if (findData.status === "Open") {
        newStatus = "Finish";
      } else {
        newStatus = "Open";
      }

      let newListTodo = [];
      if (todo.length > 0) {
        for (let index = 0; index < todo.length; index++) {
          if (todo[index].id === id) {
            newListTodo.push({
              id: todo[index].id,
              project_id: todo[index].project_id,
              item: todo[index].item,
              due_date: todo[index].due_date,
              pic: todo[index].pic,
              status: newStatus,
              actual_finish: moment().format("YYYY-MM-DD"),
              user_id: todo[index].user_id,
            });
          } else {
            newListTodo.push(todo[index]);
          }
        }
      }
      setTodo(newListTodo);
      dispatch({ type: TODOCHANGECOUNT });
    }
  };

  const dateParse = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  const handleClickEdit = (e) => {
    const id = e.target.id;
    const findData = todo.find((value) => value.id === id);
    if (findData) {
      setItemName(findData.item);
      setDueDate(dateParse(findData.due_date));
      setIdEdit(id);
      setStatus(findData.status);
      setPic(findData.pic);
    }
    setShow(true);
  };

  const handleDelete = (e) => {
    const id = e.target.id;
    const confirm = window.confirm("Do you want to delete this activity?");
    if (confirm) {
      const filterData = todo.filter((value) => value.id !== id);
      setTodo(filterData);
      dispatch({ type: TODOCHANGECOUNT });
    }
  };

  const handleShowAttachment = (e) => {
    const id = e.target.id;
    if (todoChangeCount === 0) {
      setIdTodo(id);
      setShowModalAttachment(true);
    } else {
      setMessage("Please Save Your Data First");
      setShowNotif(true);
    }
  };

  const handleChangeFile = (e) => {
    setFile([...e.target.files]);
  };

  const saveAttachment = (e) => {
    e.preventDefault();
    if (file.length > 0) {
      let formData = new FormData();
      formData.append("id", idTodo);
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

        .then((response) => {
          refAttachment.current.value = "";
          resetForm();
          setPercentProgress(0);
          setActionState((prev) => prev + 1);
          setLoading(false);
          dispatch({ type: SAVETODO });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleDeleteFile = (e) => {
    const id = e.target.id;
    const confirm = window.confirm("Apakah file Akan di Hapus?");
    if (confirm) {
      axios
        .delete(deleteFileByIdApi(id))
        .then((response) => {
          setActionState(actionState + 1);
          dispatch({ type: TODOCHANGECOUNT });
        })
        .catch((error) => console.log(error));
    }
  };

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

  return (
    <div className="capabilityFormContainer">
      <div className="capabilityForm">
        <div style={{ textAlign: "right", marginBottom: 2 }}>
          <Button style={{ marginRight: 5 }} onClick={handleSaveData}>
            <BsSave pointerEvents={"none"} /> Save
          </Button>
          <Button onClick={() => setShow(true)}>
            <BsPlusCircleFill pointerEvents={"none"} />
            Add
          </Button>
        </div>
        <TitleSection
          title="To Do List"
          icon={<RiTodoFill style={{ marginRight: 5 }} />}
        />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>No</th>
              <th>Item</th>
              <th>Due Date</th>
              <th>PIC</th>
              <th>Status</th>
              <th>Actual Finish</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {todo.length > 0 ? (
              todo.map((value, index) => {
                return (
                  <tr key={index}>
                    <td>{index + numberStart}</td>
                    <td>{value.item}</td>
                    <td>{value.due_date}</td>
                    <td>{value.pic}</td>
                    <td>{statusFunction(value.status, value.due_date)}</td>
                    <td>
                      {value.status === "Finish" ? value.actual_finish : ""}
                    </td>
                    <td>
                      <Button
                        id={value.id}
                        style={{ marginRight: 5 }}
                        onClick={handleClickStatus}
                      >
                        Status {value.status === "Open" ? "Finish" : "Open"}
                      </Button>
                      <Button
                        style={{ marginRight: 5 }}
                        id={value.id}
                        onClick={handleClickEdit}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        id={value.id}
                        onClick={handleDelete}
                        style={{ marginRight: 5 }}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="success"
                        id={value.id}
                        onClick={handleShowAttachment}
                        ref={refAttachment}
                      >
                        <CgAttachment style={{ pointerEvents: "none" }} />
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7}>To Do List is Not Available</td>
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
      <Modal show={show} centered>
        <Form onSubmit={handleAddActivity}>
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
                <Form.Control
                  value={pic}
                  onChange={(e) => setPic(e.target.value)}
                  type="text"
                  placeholder="Enter PIC"
                  required
                />
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
        show={showModalAttachment}
        centered
        onHide={() => {
          setShowModalAttachment(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Attachment List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={saveAttachment}>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Upload Here</Form.Label>
                <Row>
                  <Col sm={8}>
                    <Form.Control
                      multiple
                      type="file"
                      required
                      ref={refAttachment}
                      onChange={handleChangeFile}
                    />
                  </Col>
                  <Col sm={4}>
                    <Button type="submit">
                      {loadingPostData(loading)}Submit
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Row>
          </Form>
          {percentProgress > 0 && (
            <ProgressBar
              animated
              now={percentProgress}
              label={`${percentProgress}%`}
            />
          )}
          <Table>
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
                        <a href={value.file} target="_blank" rel="noreferrer">
                          <Button size="sm" style={{ marginRight: 5 }}>
                            <GoDesktopDownload
                              style={{ marginRight: 5, pointerEvents: "none" }}
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
                            style={{ marginRight: 5, pointerEvents: "none" }}
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModalAttachment(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ToDoList;
