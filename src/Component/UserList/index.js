import React, { Fragment, useEffect, useState } from "react";
import TitleSection from "../TitleSection";
import { FaUserAlt } from "react-icons/fa";
import { Alert, Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import "./userList.css";
import Table from "react-bootstrap/Table";
import { MdDeleteForever } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import { AiOutlineFileSearch } from "react-icons/ai";
import { GrValidate } from "react-icons/gr";
import imageBluPrint from "../../Asset/ImageGeneral/profile.jpg";
import axios from "axios";
import {
  registerUserApi,
  deleteUserApi,
  updateUserApi,
  searchUserApi,
  getUsersByPageApi,
  getUserByNPKApi,
  getAllSectionApi,
  getAllProductApi,
} from "../../Config/API";
import { GoSmiley } from "react-icons/go";
import Pagination from "../Pagination";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import ModalAlert from "../ModalAlert";

function UserList(props) {
  const { actionState, actionStateValue, title } = props;
  const [updateMode, setUpdateMode] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [npk, setNpk] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [section, setSection] = useState("");
  const [product, setProduct] = useState("");
  const [position, setPosition] = useState("");
  const [photoPreview, setPhotoPreview] = useState(imageBluPrint);
  const [alert, setAlert] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);
  const [tableUser, setTableUser] = useState([]);
  const [tableSection, setTableSection] = useState([]);
  const [tableProduct, setTableProduct] = useState([]);
  const [totalPageData, setTotalPageData] = useState(0);
  const [page, setPage] = useState(1);
  const [numberStartData, setNumberStartData] = useState(1);
  const [searchUser, setSearchUser] = useState("");
  const [message, setMessage] = useState("");
  const [showModalAlert, setShowModalAlert] = useState(false);
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    if (searchUser === "") {
      axios
        .get(getUsersByPageApi(page), {
          signal: controller.signal,
        })
        .then((response) => {
          isMounted && setTableUser(response.data.data);
          isMounted && setTotalPageData(response.data.totalPageData);
          isMounted && setNumberStartData(response.data.numberStart);
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .get(searchUserApi(searchUser, page))
        .then((response) => {
          isMounted && setTableUser(response.data.data);
          isMounted && setTotalPageData(response.data.totalPageData);
          isMounted && setNumberStartData(response.data.numberStart);
        })
        .catch((error) => console.log(error));
    }

    axios
      .get(getAllSectionApi, {
        signal: controller.signal,
      })
      .then((response) => {
        isMounted && setTableSection(response.data.data);
      });

    axios
      .get(getAllProductApi, {
        signal: controller.signal,
      })
      .then((response) => {
        isMounted && setTableProduct(response.data.data);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [searchUser, actionStateValue, page]);

  const validatePassword = () => {
    if (password !== "") {
      if (password === rePassword) {
        return <GrValidate style={{ marginLeft: 10, color: "#00adeb" }} />;
      }
      return "";
    }
    return "";
  };

  const setImagePreview = (e) => {
    const file = e.target.files[0];
    const photoPreviewUrl = URL.createObjectURL(file);
    setPhotoPreview(photoPreviewUrl);
    setPhoto(file);
  };

  const resetImagePreview = () => {
    setPhoto("");
    setPhotoPreview(imageBluPrint);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setNpk("");
    setPhoto("");
    setPosition("");
    setProduct("");
    setSection("");
    setUserName("");
    setRePassword("");
    setPhotoPreview(imageBluPrint);
    setUpdateMode(false);
    actionState(1);
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    if (password === rePassword) {
      let formData = new FormData();
      formData.append("username", userName);
      formData.append("npk", npk);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("product_id", product);
      formData.append("position", position);
      formData.append("photo", photo);
      if (!updateMode) {
        const checkUser = await axios.get(getUserByNPKApi(npk));
        const getUser = checkUser.data.data;
        if (getUser.length === 0) {
          axios
            .post(registerUserApi, formData)
            .then((response) => {
              resetForm();
              setMessage("Register Success !!!");
              setNotifSuccess(true);
              setAlert(false);
            })
            .catch((err) => console.log(err));
        } else {
          setMessage(`NPK Telah Terdaftar!!`);
          setAlert(true);
        }
      } else {
        axios
          .patch(updateUserApi, formData)
          .then((response) => {
            resetForm();
            setMessage("Update Success !!!");
            setNotifSuccess(true);
            setAlert(false);
            setUpdateMode(false);
          })
          .catch((error) => {
            setMessage(`Function Error`);
            setAlert(true);
            console.log(error);
          })
          .finally(() => {
            resetForm();
          });
      }
    } else {
      setMessage(`Password & Re Password doesnt Match!!`);
      setAlert(true);
    }
  };

  const handleDelete = (e) => {
    const id = e.target.id;
    const confirm = window.confirm("Apakah mau menghapus data ini?");
    if (confirm) {
      axios.delete(deleteUserApi(id)).then((response) => {
        setMessage("Data Telah Terhapus");
        setShowModalAlert(true);
        resetForm();
        updateMode(false);
      });
    }
  };

  const handleEdit = (e) => {
    const id = e.target.id;
    const dataForEdit = tableUser.find((value) => {
      return value.id === parseInt(id);
    });
    if (dataForEdit) {
      setEmail(dataForEdit.email);
      setUserName(dataForEdit.username);
      setNpk(dataForEdit.npk);

      if (dataForEdit.photo === "") {
        setPhotoPreview(imageBluPrint);
      } else {
        setPhotoPreview(dataForEdit.photo);
      }
      setPhoto(dataForEdit.photo);
      setPosition(dataForEdit.position);
      setSection(dataForEdit.section_id);
      setProduct(dataForEdit.product_id);
      setUpdateMode(true);
    }
  };

  const maxPagesShow = 3;

  const handleSetSection = (e) => {
    setProduct("");
    setSection(e.target.value);
  };

  const sectionOption = () => {
    let option = [];
    if (tableSection.length > 0) {
      for (let index = 0; index < tableSection.length; index++) {
        option.push(
          <option key={index} value={tableSection[index].id}>
            {tableSection[index].section_name}
          </option>
        );
      }
    }
    return <>{option}</>;
  };

  const productOption = () => {
    let option = [];
    if (section) {
      const productFilter = tableProduct.filter(
        (value) => value.section_id === parseInt(section)
      );
      if (productFilter.length > 0) {
        for (let index = 0; index < productFilter.length; index++) {
          option.push(
            <option key={index} value={productFilter[index].id}>
              {productFilter[index].product_name}
            </option>
          );
        }
      }
    }
    return <>{option}</>;
  };

  const handleSearchUser = (e) => {
    setPage(1);
    setSearchUser(e.target.value);
  };
  return (
    <div className="userListContainer">
      <TitleSection
        title={title}
        icon={<FaUserAlt style={{ marginRight: 5 }} />}
      />
      <div className="userFormContainer">
        <Form onSubmit={handleRegisterUser}>
          <Row>
            <Col sm={8}>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>NPK</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter NPK"
                    value={npk}
                    onChange={(e) => setNpk(e.target.value)}
                    required
                    disabled={updateMode ? true : false}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Select Section</Form.Label>
                  <Form.Select value={section} onChange={handleSetSection}>
                    <option value={""} disabled>
                      open this to product filter
                    </option>
                    {sectionOption()}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Select Product</Form.Label>
                  <Form.Select
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                  >
                    <option value={""} disabled>
                      open this to product filter
                    </option>
                    {productOption()}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Position</Form.Label>
                  <Form.Select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  >
                    <option value={""} disabled>
                      open this
                    </option>
                    <option value={"President"}>President</option>
                    <option value={"Director"}>Director</option>
                    <option value={"Coordinator"}>Manager</option>
                    <option value={"General Manager"}>General Manager</option>
                    <option value={"Assistant General Manager"}>
                      Assistant General Manager
                    </option>
                    <option value={"Departement Manager"}>
                      Departement Manager
                    </option>
                    <option value={"Manager"}>Manager</option>
                    <option value={"Assistant Manager"}>
                      Assistant Manager
                    </option>
                    <option value={"Staff"}>Staff</option>
                    <option value={"Administrator"}>Administrator</option>
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>
                    Re-Password
                    {validatePassword()}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter re-password"
                    required
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="primary"
                    type="submit"
                    style={{ marginRight: 10 }}
                  >
                    {updateMode ? "Update" : "Registration"}
                  </Button>
                  <Button variant="success" type="reset" onClick={resetForm}>
                    Clear
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col sm={4}>
              <div style={{ textAlign: "center" }}>
                <Form.Label>Photo Profile</Form.Label>
              </div>
              <div style={{ textAlign: "center" }}>
                <img
                  alt="profile"
                  src={photoPreview}
                  height={200}
                  className="imageProfile"
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <input
                  type={"file"}
                  className="custom-file-input backgroundFileInput"
                  accept=".gif,.jpg,.jpeg,.png"
                  onChange={setImagePreview}
                />
                <Button
                  variant="primary"
                  type="button"
                  onClick={resetImagePreview}
                >
                  Reset
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
        <div style={{ marginTop: 5 }}>
          <Alert
            show={alert}
            variant="danger"
            onClose={() => setAlert(false)}
            dismissible
          >
            {message}
          </Alert>
        </div>
        <div style={{ marginTop: 5 }}>
          <Alert
            show={notifSuccess}
            variant="success"
            onClose={() => setNotifSuccess(false)}
            dismissible
          >
            {message} <GoSmiley style={{ marginLeft: 10 }} />
          </Alert>
        </div>
      </div>
      <div className="tableUser">
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">
            <AiOutlineFileSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search"
            aria-label="Search"
            aria-describedby="basic-addon1"
            value={searchUser}
            onChange={handleSearchUser}
          />
        </InputGroup>
        <Table
          striped
          hover
          bordered
          size="sm"
          responsive
          style={{ fontSize: 14 }}
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Npk</th>
              <th>Email</th>
              <th>Section</th>
              <th>Product</th>
              <th>Position</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableUser ? (
              tableUser.map((value, index) => {
                return (
                  <tr key={value.id}>
                    <td>{numberStartData + index}</td>
                    <td>{CapitalCaseFirstWord(value.username)}</td>
                    <td>{value.npk}</td>
                    <td>{value.email}</td>
                    <td>{value.section_name}</td>
                    <td>{value.product_name}</td>
                    <td>{value.position}</td>
                    <td>
                      <Button
                        title="Delete"
                        size="sm"
                        style={{ marginRight: 2 }}
                        id={value.id}
                        onClick={handleDelete}
                      >
                        <MdDeleteForever style={{ pointerEvents: "none" }} />
                      </Button>
                      <Button
                        title="Edit"
                        size="sm"
                        style={{ marginRight: 2 }}
                        id={value.id}
                        onClick={handleEdit}
                        variant="success"
                      >
                        <GrEdit style={{ pointerEvents: "none" }} />
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8}>Data Tidak Di Temukan</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <div className="paginationTableUser">
        <Pagination
          totalPage={totalPageData}
          maxPagesShow={maxPagesShow}
          onChangePage={(e) => setPage(e)}
          pageActive={page}
        />
      </div>
      <ModalAlert
        show={showModalAlert}
        onHandleClose={(e) => {
          setShowModalAlert(e);
        }}
        message={message}
      />
    </div>
  );
}

export default UserList;
