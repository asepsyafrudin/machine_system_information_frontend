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
} from "../../Config/API";
import { GoSmiley } from "react-icons/go";
import Pagination from "../Pagination";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";

function UserList(props) {
  const { actionState, actionStateValue } = props;
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
  const [totalPageData, setTotalPageData] = useState(0);
  const [page, setPage] = useState(1);
  const [numberStartData, setNumberStartData] = useState(1);
  const [searchUser, setSearchUser] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (searchUser === "") {
      axios
        .get(getUsersByPageApi(page))
        .then((response) => {
          setTableUser(response.data.data);
          setTotalPageData(response.data.totalPageData);
          setNumberStartData(response.data.numberStart);
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .get(searchUserApi(searchUser, page))
        .then((response) => {
          setTableUser(response.data.data);
          setTotalPageData(response.data.totalPageData);
          setNumberStartData(response.data.numberStart);
        })
        .catch((error) => console.log(error));
    }
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
    const checkUser = await axios.get(getUserByNPKApi(npk));
    const getUser = checkUser.data.data;
    if (getUser.length === 0) {
      if (password === rePassword) {
        let formData = new FormData();
        formData.append("username", userName);
        formData.append("npk", npk);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("section", section);
        formData.append("product", product);
        formData.append("position", position);
        formData.append("photo", photo);
        if (!updateMode) {
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
        setMessage(`Password & Re Passoword doesnt Match!!`);
        setAlert(true);
      }
    } else {
      setMessage(`NPK Telah Terdaftar!!`);
      setAlert(true);
    }
  };

  const handleDelete = (e) => {
    const id = e.target.id;
    const confirm = window.confirm("Apakah mau menghapus data ini?");
    if (confirm) {
      axios.delete(deleteUserApi(id)).then((response) => {
        window.alert("Data Telah Terhapus!!");
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
      setSection(dataForEdit.section);
      setProduct(dataForEdit.product);
      setUpdateMode(true);
    }
  };

  const maxPagesShow = 3;

  const handleSetSection = (e) => {
    setProduct("");
    setSection(e.target.value);
  };

  const optionProduct = () => {
    let option = [];
    if (section === "Power Train") {
      option.push(
        <Fragment key={"power train"}>
          <option key="Common" value={"Common"}>
            Common
          </option>
          <option key="Alternator" value={"Alternator"}>
            Alternator
          </option>
          <option key="Stater" value={"Stater"}>
            Stater
          </option>
          <option key="Sparkplug" value={"Sparkplug"}>
            Sparkplug
          </option>
          <option key="VCT" value={"VCT"}>
            VCT
          </option>
          <option key="SIFS" value={"SIFS"}>
            SIFS
          </option>
          <option key="ACGS" value={"ACGS"}>
            ACGS
          </option>
          <option key="O2 Sensor 2WV" value={"O2 Sensor 2WV"}>
            O2 Sensor 2WV
          </option>
          <option key="O2 Sensor 4WV" value={"O2 Sensor 4WV"}>
            O2 Sensor 2WV
          </option>
        </Fragment>
      );
    } else {
      option.push(
        <Fragment key={"Electronic"}>
          <option key="Common" value={"Common"}>
            Common
          </option>
          <option key="ECU 2WV" value={"ECU 2WV"}>
            ECU 2WV
          </option>
          <option key="ECU 4WV" value={"ECU 4WV"}>
            ECU 4WV
          </option>
          <option key="Sonar ECU" value={"Sonar ECU"}>
            Sonar ECU
          </option>
          <option key="Meter Cluster" value={"Meter Cluster"}>
            Meter Cluster
          </option>
          <option key="WSS" value={"WSS"}>
            WSS
          </option>
          <option key="AISS" value={"AISS"}>
            AISS
          </option>
          <option key="EFI ECU" value={"EFI ECU"}>
            EFI ECU
          </option>
        </Fragment>
      );
    }
    return option;
  };

  const handleSearchUser = (e) => {
    setPage(1);
    setSearchUser(e.target.value);
  };
  return (
    <div className="userListContainer">
      <TitleSection
        title="User Registration"
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
                  <Form.Label>Section</Form.Label>
                  <Form.Select value={section} onChange={handleSetSection}>
                    <option value={""} disabled>
                      open this
                    </option>
                    <option value={"Power Train"}>Power Train</option>
                    <option value={"Electronic"}>Electronics</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Product</Form.Label>
                  <Form.Select
                    disabled={section !== "" ? false : true}
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                  >
                    <option value={""} disabled>
                      open this
                    </option>
                    {optionProduct()}
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
                    <option value={"General Manager"}>General Manager</option>
                    <option value={"Assistant General Manager"}>
                      Assistant General Manager
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
                    <td>{value.section}</td>
                    <td>{value.product}</td>
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
    </div>
  );
}

export default UserList;
