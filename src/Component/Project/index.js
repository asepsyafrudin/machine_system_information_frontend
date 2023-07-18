import React from "react";
import TitleSection from "../TitleSection";
import {
  Alert,
  Badge,
  Button,
  CloseButton,
  Col,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { useEffect } from "react";
import {
  createProjectApi,
  deleteProjectByProjectId,
  getAllProductApi,
  getAllUsersApi,
  getProjectByPageAndUser,
  updateProjectApi,
} from "../../Config/API";
import { useState } from "react";
import axios from "axios";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import { v4 as uuid } from "uuid";
import { STATUSOPEN } from "../../Config/const";
import { BsListNested } from "react-icons/bs";
import { RiCreativeCommonsNdFill } from "react-icons/ri";
import moment from "moment";
import PaginationTable from "../Pagination";
import { MdDeleteForever, MdEmail, MdVideoLibrary } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import { Link } from "react-router-dom";

function Project(props) {
  const { actionState, actionStateValue } = props;
  const [tableProduct, setTableProduct] = useState([]);
  const [tableProject, setTableProject] = useState([]);
  const [product, setProduct] = useState("");
  const [projectName, setProjectName] = useState("");
  const [manager, setManager] = useState("");
  const [tableUser, setTableUser] = useState([]);
  const [budget, setBudget] = useState("");
  const [savingCost, setSavingCost] = useState("");
  const [startDate, setStartDate] = useState("");
  const [sopDate, setSopDate] = useState("");
  const [memberId, setMemberId] = useState("");
  const [member, setMember] = useState([]);
  const [projectIdEdit, setProjectIdEdit] = useState("");
  const [userId, setUserId] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [numberStart, setNumberStart] = useState("");
  const [totalPageData, setStotalPageData] = useState(1);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [memberToEmail, setMemberToEmail] = useState("");
  const [memberListOfProject, setMemberListOfProject] = useState([]);
  const [totalMemberToEmail, setTotalMemberToEmail] = useState([]);
  const [bodyEmail, setBodyEmail] = useState("");
  const [subjectEmail, setSubjectEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [description, setDescription] = useState("");

  const maxPagesShow = 3;

  useEffect(() => {
    axios
      .get(getAllProductApi)
      .then((response) => {
        setTableProduct(response.data.data);
      })
      .catch((error) => console.log(error));

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

    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user.id);
    axios.get(getProjectByPageAndUser(page, user.id)).then((response) => {
      const data = response.data.data;
      setTableProject(data);
      setStotalPageData(response.data.totalPageData);
      setNumberStart(response.data.numberStart);
    });
  }, [actionStateValue, page]);

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

  const handleMember = () => {
    if (memberId !== "") {
      if (parseInt(memberId) !== parseInt(userId)) {
        const check = member.find((value) => value === parseInt(memberId));
        if (!check) {
          setMember((prev) => [...prev, parseInt(memberId)]);
        }
      }
    }
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

  const deleteMembers = (e) => {
    const id = parseInt(e.target.id);
    if (id !== userId) {
      const array = member.filter((value) => value !== id);
      setMember(array);
    } else {
      window.alert("Cannot delete");
    }
  };

  const handleReset = () => {
    setProduct("");
    setProjectName("");
    setDescription("");
    setManager("");
    setBudget("");
    setSavingCost("");
    setStartDate("");
    setSopDate("");
    setMemberId("");
    setMember([]);
    setProjectIdEdit("");
  };

  const handleSaveCreateProject = (e) => {
    e.preventDefault();
    let data = {
      product_id: product,
      project_name: projectName,
      manager_id: manager,
      budget: budget,
      saving_cost: savingCost,
      start: startDate,
      finish: sopDate,
      member: projectIdEdit ? [...member] : [...member, userId],
      user_id: userId,
      status: STATUSOPEN,
      description: description,
    };

    if (projectIdEdit) {
      let newData = { ...data, id: projectIdEdit };
      axios.put(updateProjectApi, newData);
      setMessage("Project already Update");
      setShow(true);
      handleReset();
      actionState(1);
    } else {
      let newData = { ...data, id: uuid() };
      let confirm = window.confirm("Do you want to save?");
      if (confirm) {
        axios.post(createProjectApi, newData).then((response) => {
          setMessage("Project already created");
          setShow(true);
          handleReset();
          actionState(1);
        });
      }
    }
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
  };

  const dateParse = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };
  const handleEdit = (e) => {
    const id = e.target.id;
    let confirm = window.confirm("Do you want to edit this item?");
    if (confirm) {
      let data = tableProject.find((value) => value.id === id);
      if (data) {
        setProjectIdEdit(data.id);
        setProduct(data.product_id);
        setProjectName(data.project_name);
        setManager(data.manager_id);
        setBudget(data.budget);
        setSavingCost(data.saving_cost);
        setStartDate(dateParse(data.start));
        setSopDate(dateParse(data.finish));
        setDescription(data.description);
        let memberIddata = [];
        for (let index = 0; index < data.member.length; index++) {
          memberIddata.push(data.member[index].user_id);
        }
        setMember(memberIddata);
      }
    }
  };

  // const changeStatusProject = (e) => {
  //   const id = e.target.id;
  //   const findData = tableProject.find((value) => value.id === id);
  //   let status = "";
  //   console.log(findData.status);
  //   if (findData) {
  //     if (findData.status !== STATUSFINISH) {
  //       status = "finish";
  //     } else {
  //       status = STATUSOPEN;
  //     }
  //     let confirm = window.confirm(
  //       `Do You Want to Change Status to ${status}?`
  //     );
  //     if (confirm) {
  //       const data = { id: id, status: status };
  //       axios.put(updateStatusProjectApi, data).then((response) => {
  //         setMessage("Status Project Already Changed");
  //         setShow(true);
  //         handleReset();
  //         actionState(1);
  //       });
  //     }
  //   }
  // };

  const handleSendEmail = (e) => {
    const id = e.target.id;
    let confirm = window.confirm("Do You Want to Send Email?");
    if (confirm) {
      const checkProject = tableProject.find((value) => value.id === id);
      if (checkProject) {
        let memberIddata = [];
        for (let index = 0; index < checkProject.member.length; index++) {
          memberIddata.push(checkProject.member[index].user_id);
        }
        setMemberListOfProject(memberIddata);
        setSubjectEmail(checkProject.project_name);
        setShowEmailModal(true);
      }
    }
  };

  const optionMemberToEmailFunction = () => {
    let option = [];
    if (memberListOfProject.length > 0) {
      for (let index = 0; index < memberListOfProject.length; index++) {
        option.push(
          <option key={index} value={memberListOfProject[index]}>
            {userNameFunction(memberListOfProject[index])}
          </option>
        );
      }
    }
    return option;
  };

  const handleDelete = (e) => {
    const id = e.target.id;
    let confirm = window.confirm("Do you want to delete this item?");
    if (confirm) {
      axios.delete(deleteProjectByProjectId(id)).then((response) => {
        setMessage("Project already delete");
        setShow(true);
        handleReset();
        actionState(1);
      });
    }
  };

  const handleAddToEmail = () => {
    if (memberToEmail) {
      const check = totalMemberToEmail.find(
        (value) => parseInt(value) === parseInt(memberToEmail)
      );
      if (!check) {
        setTotalMemberToEmail((prev) => [...prev, memberToEmail]);
      }
    }
  };

  const handleDeleteToEmail = (e) => {
    const id = e.target.id;
    let filter = totalMemberToEmail.filter(
      (value) => parseInt(value) !== parseInt(id)
    );
    setTotalMemberToEmail(filter);
  };

  const handleCloseModalEmail = () => {
    setShowEmailModal(false);
    setTotalMemberToEmail([]);
    setMemberToEmail("");
    setBodyEmail("");
    setShowAlert(false);
    setShowSuccess(false);
  };

  const handleSendEmailToUser = (e) => {
    e.preventDefault();
    if (totalMemberToEmail.length > 0) {
      setShowSuccess(true);
    } else {
      setShowAlert(true);
    }
  };
  return (
    <div className="capabilityFormContainer">
      <div className="capabilityForm">
        <TitleSection
          title="Create project"
          icon={<RiCreativeCommonsNdFill style={{ marginRight: 5 }} />}
        />
        <Form onSubmit={handleSaveCreateProject}>
          <Row className="mb-3" style={{ textAlign: "left" }}>
            <Form.Group as={Col}>
              <Form.Label>Select Product</Form.Label>
              <Form.Select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
              >
                <option value="" disabled>
                  Open This
                </option>
                {productOption()}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>PIC</Form.Label>
              <Form.Select
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                required
              >
                <option value="" disabled>
                  Open This
                </option>
                {userOption()}
              </Form.Select>
            </Form.Group>
          </Row>
          <Row className="mb-3" style={{ textAlign: "left" }}>
            <Form.Group as={Col}>
              <Form.Label>Budget (*Rupiah)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                lang="en"
                step={".001"}
                required
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Saving Cost Estimation (*Rupiah)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Saving Cost"
                value={savingCost}
                onChange={(e) => setSavingCost(e.target.value)}
                lang="en"
                step={".001"}
                required
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Start Project Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Form.Group>
          </Row>
          <Row className="mb-3" style={{ textAlign: "left" }}>
            <Form.Group as={Col}>
              <Form.Label>SOP Project Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Saving Cost"
                value={sopDate}
                onChange={(e) => setSopDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Choose Members to Add</Form.Label>
              <Form.Select
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
              >
                <option value="" disabled>
                  Open This
                </option>
                {userOption()}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label></Form.Label> <br />
              <Button type="button" onClick={handleMember}>
                Click to Add Member
              </Button>
            </Form.Group>
          </Row>
          <Row className="mb-3" style={{ textAlign: "left" }}>
            <Col>Our Members</Col>
          </Row>

          <Row className="mb-3" style={{ textAlign: "left" }}>
            <Col>
              {member.length > 0
                ? member.map((value, index) => {
                    return (
                      <Badge
                        key={index}
                        style={{ marginRight: 2 }}
                        bg={colorBgBadge(index + 1)}
                      >
                        <h6>
                          {CapitalCaseFirstWord(
                            tableUser.length > 0 &&
                              tableUser.find(
                                (value2) => value2.id === parseInt(value)
                              ).username
                          )}{" "}
                          <CloseButton id={value} onClick={deleteMembers} />
                        </h6>
                      </Badge>
                    );
                  })
                : "Data Is Not Available"}
            </Col>
          </Row>
          <Row className="mb-3" style={{ textAlign: "left" }}>
            <Form.Group as={Col}>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                style={{ height: 100 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Row>
          <Row className="mb-3" style={{ textAlign: "right" }}>
            <Col>
              <Button type="submit" style={{ marginRight: 5 }}>
                {projectIdEdit ? "Update" : "Save"}
              </Button>
              <Button type="button" onClick={handleReset}>
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="capabilityForm">
        <TitleSection
          title="Project List"
          icon={<BsListNested style={{ marginRight: 5 }} />}
        />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>NO</th>
              <th>Project Name</th>
              <th>Product</th>
              <th>PIC</th>
              <th>Budget</th>
              <th>Saving</th>
              <th>Start Date</th>
              <th>SOP Date</th>
              {/* <th>Last Update</th> */}
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableProject.length > 0 ? (
              tableProject.map((value, index) => {
                return (
                  <tr key={index}>
                    <td>{numberStart + index}</td>
                    <td>{value.project_name}</td>
                    <td>{productNameFunction(value.product_id)}</td>
                    <td>{userNameFunction(value.manager_id)}</td>
                    <td>{parseFloat(value.budget).toLocaleString()}</td>
                    <td>{parseFloat(value.saving_cost).toLocaleString()}</td>
                    <td>{moment(value.start).format("LL")}</td>
                    <td>{moment(value.finish).format("LL")}</td>
                    {/* <td>{moment(value.create_date).format("LL")}</td> */}
                    <td>{statusFunction(value.status, value.id)}</td>
                    <td>
                      {value.user_id === userId && (
                        <Button
                          title="Delete"
                          size="sm"
                          style={{ marginRight: 2 }}
                          id={value.id}
                          onClick={handleDelete}
                        >
                          <MdDeleteForever style={{ pointerEvents: "none" }} />
                        </Button>
                      )}
                      <Button
                        title="Edit"
                        size="sm"
                        style={{ marginRight: 2 }}
                        variant="success"
                        id={value.id}
                        onClick={handleEdit}
                      >
                        <GrEdit style={{ pointerEvents: "none" }} />
                      </Button>
                      {/* <Button
                        title="Change Status"
                        size="sm"
                        style={{ marginRight: 2 }}
                        variant="warning"
                        id={value.id}
                        onClick={changeStatusProject}
                      >
                        <GoGitCompare style={{ pointerEvents: "none" }} />
                      </Button> */}
                      <Link to={`/projectActivity/${value.id}`} target="_blank">
                        <Button
                          title="View"
                          size="sm"
                          style={{ marginRight: 2 }}
                          id={value.id}
                          variant="dark"
                        >
                          <MdVideoLibrary style={{ pointerEvents: "none" }} />
                        </Button>
                      </Link>
                      <Button
                        title="SendEmail"
                        size="sm"
                        style={{ marginRight: 2 }}
                        id={value.id}
                        variant="warning"
                        onClick={handleSendEmail}
                      >
                        <MdEmail style={{ pointerEvents: "none" }} />
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11}>Data is Not Available</td>
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
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
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
      <Modal show={showEmailModal} onHide={handleCloseModalEmail}>
        <Modal.Header closeButton>
          <Modal.Title>Send Email To Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!showSuccess ? (
            <>
              <Form onSubmit={handleSendEmailToUser}>
                <Row className="mb-3" style={{ textAlign: "left" }}>
                  <Form.Group as={Col}>
                    <Form.Label>To</Form.Label>
                    <Form.Select
                      value={memberToEmail}
                      onChange={(e) => setMemberToEmail(e.target.value)}
                    >
                      <option value="" disabled>
                        Open This
                      </option>
                      {optionMemberToEmailFunction()}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label></Form.Label> <br />
                    <Button type="button" onClick={handleAddToEmail}>
                      Add
                    </Button>
                  </Form.Group>
                </Row>
                <Row className="mb-3" style={{ textAlign: "left" }}>
                  <Col>
                    {totalMemberToEmail.length > 0
                      ? totalMemberToEmail.map((value, index) => {
                          return (
                            <Badge
                              key={index}
                              style={{ marginRight: 2 }}
                              bg={colorBgBadge(index + 1)}
                            >
                              <h6>
                                {CapitalCaseFirstWord(
                                  tableUser.length > 0 &&
                                    tableUser.find(
                                      (value2) => value2.id === parseInt(value)
                                    ).username
                                )}{" "}
                                <CloseButton
                                  id={value}
                                  onClick={handleDeleteToEmail}
                                />
                              </h6>
                            </Badge>
                          );
                        })
                      : "Data Is Not Available"}
                  </Col>
                </Row>
                <Row className="mb-3" style={{ textAlign: "left" }}>
                  <Form.Group as={Col}>
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Subject"
                      onChange={(e) => setSubjectEmail(e.target.value)}
                      value={subjectEmail}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3" style={{ textAlign: "left" }}>
                  <Form.Group as={Col}>
                    <Form.Label>Body</Form.Label>
                    <Form.Control
                      as={"textarea"}
                      style={{ height: 100 }}
                      placeholder="Enter Body"
                      onChange={(e) => setBodyEmail(e.target.value)}
                      value={bodyEmail}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Col style={{ textAlign: "left" }}>
                    <Button variant="primary" type="submit">
                      Send Email
                    </Button>
                  </Col>
                </Row>
              </Form>
              <Alert
                show={showAlert}
                variant="warning"
                onClose={() => setShowAlert(false)}
                dismissible
              >
                Please Add Users to Email
              </Alert>
            </>
          ) : (
            <Alert
              show={showSuccess}
              variant="success"
              onClose={() => setShowSuccess(false)}
              dismissible
            >
              Email Already Send to Users
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalEmail}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Project;
