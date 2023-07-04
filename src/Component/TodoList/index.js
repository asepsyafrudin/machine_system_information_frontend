import React, { useEffect } from "react";
import { RiTodoFill } from "react-icons/ri";
import { useParams } from "react-router-dom";
import TitleSection from "../TitleSection";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { Badge, Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { BsPlusCircleFill, BsSave } from "react-icons/bs";
import moment from "moment";
import axios from "axios";
import {
  createAndUpdateTodoApi,
  getAllUsersApi,
  getTodoByProjectIdApi,
  getUserByUserIdApi,
} from "../../Config/API";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";

function ToDoList() {
  const { id } = useParams();
  const [tableUser, setTableUser] = useState([]);
  const [show, setShow] = useState(false);
  const [todo, setTodo] = useState([]);
  const [itemName, setItemName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState("");
  const [pic, setPic] = useState("");
  const [idEdit, setIdEdit] = useState("");
  const [message, setMessage] = useState("");
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
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
      .get(getTodoByProjectIdApi(id))
      .then((response) => {
        setTodo(response.data.data);
      })
      .catch((error) => console.log(error));
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      axios.get(getUserByUserIdApi(user.id)).then((response) => {
        const dataUser = response.data.data;
        if (dataUser.length > 0) {
          setUserId(dataUser[0].id);
        }
      });
    }
  }, [id]);

  const handleSaveData = () => {
    let confirm = window.confirm("Do You Want to Save Todo List?");
    if (confirm) {
      axios.post(createAndUpdateTodoApi, todo).then((response) => {
        setMessage("Your Data Already Save");
        setShowNotif(true);
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
          } else {
            newListTodo.push(todo[index]);
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
    }
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
                    <td>{index + 1}</td>
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
                        Click to {value.status === "Open" ? "Finish" : "Open"}
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
                      >
                        Delete
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
    </div>
  );
}

export default ToDoList;
