import React, { Fragment, useEffect, useState } from "react";
import { Alert, Button, Form, Row, Col, Toast, Table } from "react-bootstrap";
import { GoSmiley } from "react-icons/go";
import TitleSection from "../TitleSection";
import imageBluPrint from "../../Asset/ImageGeneral/profile.jpg";
import axios from "axios";
import { FaUserAlt } from "react-icons/fa";
import {
  changeStatusNotification,
  checkUserPassword,
  getAllProductApi,
  getAllSectionApi,
  getNotificationByUserId,
  getUserByUserIdApi,
  resetPhotoProfileApi,
  updateUserApi,
} from "../../Config/API";
import { GrApps, GrValidate } from "react-icons/gr";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import moment from "moment/moment";

function UserDashboard(props) {
  const { actionState, actionStateValue, title } = props;
  const [id, setId] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [npk, setNpk] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [section, setSection] = useState("");
  const [product, setProduct] = useState("");
  const [position, setPosition] = useState("");
  const [photoPreview, setPhotoPreview] = useState(imageBluPrint);
  const [alert, setAlert] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [message, setMessage] = useState("");
  const [tableNotification, setTableNotification] = useState([]);
  const [tableSection, setTableSection] = useState([]);
  const [tableProduct, setTableProduct] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const user = JSON.parse(localStorage.getItem("user"));
    setOldPassword(user.password);
    const id = parseInt(user.id);
    setId(id);
    axios(getUserByUserIdApi(id), {
      signal: controller.signal,
    }).then((response) => {
      const dataForEdit = isMounted && response.data.data;
      setEmail(dataForEdit[0].email);
      setUserName(dataForEdit[0].username);
      setNpk(dataForEdit[0].npk);

      if (dataForEdit[0].photo === "") {
        setPhotoPreview(imageBluPrint);
      } else {
        setPhotoPreview(dataForEdit[0].photo);
      }
      setPhoto(dataForEdit[0].photo);
      setPosition(dataForEdit[0].position);
      setSection(dataForEdit[0].section_id);
      setProduct(dataForEdit[0].product_id);
    });

    axios
      .get(getNotificationByUserId(id), {
        signal: controller.signal,
      })
      .then((response) => {
        isMounted && setTableNotification(response.data.data);
      });

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
  }, [actionStateValue]);

  const resetForm = () => {
    setPassword("");
    setCurrentPassword("");
    setRePassword("");
    setUpdateMode(false);
  };

  const handleUpdateUser = async (e) => {
    if (updateMode) {
      e.preventDefault();
      const passwordData = {
        reTypePassword: currentPassword,
        oldPassword: oldPassword,
      };
      const checkPassword = await axios.post(checkUserPassword, passwordData);
      if (checkPassword.data.data) {
        if (password === rePassword) {
          let formData = new FormData();
          formData.append("username", userName);
          formData.append("npk", npk);
          formData.append("email", email);
          formData.append("password", password);
          formData.append("section", section);
          formData.append("product_id", product);
          formData.append("position", position);
          formData.append("photo", photo);
          axios
            .patch(updateUserApi, formData)
            .then((response) => {
              setMessage("Update Successfully");

              setNotifSuccess(true);
              resetForm();
              setAlert(false);
              actionState(1);
            })
            .catch((error) => console.log(error));
        } else {
          setMessage("Please Check New Password, New Password is not Same");
          setNotifSuccess(false);
          setAlert(true);
        }
      } else {
        setMessage("Your Current Password Wrong!!");
        setNotifSuccess(false);
        setAlert(true);
      }
    }
  };

  const handleSetSection = (e) => {
    setProduct("");
    setSection(e.target.value);
  };

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
    axios.patch(resetPhotoProfileApi(id)).then((response) => {
      setPhoto("");
      setPhotoPreview(imageBluPrint);
    });
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

  const handleCloseNotif = (e) => {
    const id = e.target.id;
    axios.patch(changeStatusNotification(id)).then((response) => {
      actionState(1);
    });
  };

  const cancelHandle = () => {
    setUpdateMode(false);
    resetForm();
    setAlert(false);
    setNotifSuccess(false);
  };
  return (
    <div>
      <div className="userListContainer">
        <TitleSection
          title={title}
          icon={<FaUserAlt style={{ marginRight: 5 }} />}
        />
        <div className="userFormContainer">
          <Form onSubmit={handleUpdateUser}>
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
                      disabled={!updateMode}
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
                      disabled
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
                      disabled={!updateMode}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Select Section</Form.Label>
                    <Form.Select
                      value={section}
                      onChange={handleSetSection}
                      disabled={!updateMode}
                    >
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
                      disabled={!updateMode}
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
                      disabled={!updateMode}
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
                  {updateMode && (
                    <>
                      <Form.Group as={Col}>
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                          disabled={!updateMode}
                          type="password"
                          placeholder="Enter current password"
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group as={Col}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          disabled={!updateMode}
                          type="password"
                          placeholder="Enter new password"
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
                          placeholder="Enter new password"
                          required
                          value={rePassword}
                          disabled={!updateMode}
                          onChange={(e) => setRePassword(e.target.value)}
                        />
                      </Form.Group>
                    </>
                  )}
                </Row>
                <Row>
                  <Col>
                    {updateMode ? (
                      <>
                        <Button
                          variant="primary"
                          type="submit"
                          style={{ marginRight: 10 }}
                        >
                          {" "}
                          Update
                        </Button>
                        <Button
                          variant="primary"
                          type="button"
                          style={{ marginRight: 10 }}
                          onClick={cancelHandle}
                        >
                          {" "}
                          cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="primary"
                        type="button"
                        style={{ marginRight: 10 }}
                        onClick={(e) => setUpdateMode(true)}
                      >
                        {" "}
                        Edit
                      </Button>
                    )}
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
                    disabled={!updateMode}
                  />
                  <Button
                    variant="primary"
                    type="button"
                    onClick={resetImagePreview}
                    disabled={!updateMode}
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
      </div>
      <Row>
        <Col sm={6}>
          <div className="dashboardNotifListContainer">
            <TitleSection
              title="User Notification"
              icon={<FaUserAlt style={{ marginRight: 5 }} />}
            />
            <Row className="mb-3">
              <Col sm={12}>
                {tableNotification.length !== 0 &&
                  tableNotification.map((value, index) => {
                    return (
                      <div id={value.id} key={index}>
                        <Toast
                          show={true}
                          bg="info"
                          id={value.id}
                          key={index}
                          defaultValue={value.id}
                          style={{ width: 500 }}
                        >
                          <Toast.Header closeButton={false}>
                            <img
                              src={value.photo}
                              className="rounded me-2"
                              alt=""
                              height={30}
                            />

                            <strong className="me-auto">
                              {CapitalCaseFirstWord(value.username)}
                            </strong>
                            <small>{moment(value.create_date).fromNow()}</small>
                          </Toast.Header>
                          <Toast.Body>
                            {value.type === "document"
                              ? "Mengomentari document anda klik"
                              : "Mengomentari video anda klik"}{" "}
                            , Klik <a href={value.link}>LINK</a>,{" "}
                            <Button
                              style={{ fontSize: 12 }}
                              id={value.id}
                              onClick={handleCloseNotif}
                            >
                              Close
                            </Button>
                          </Toast.Body>
                        </Toast>
                      </div>
                    );
                  })}
              </Col>
            </Row>
          </div>
        </Col>
        <Col sm={6}>
          <div className="dashboardNotifListContainer">
            <TitleSection
              title="Other Application"
              icon={<GrApps style={{ marginRight: 5 }} />}
            />
            <Table responsive>
              <tbody>
                <tr>
                  <td style={{ textAlign: "left" }}>
                    EPIC [e-Part and Inventory Control]
                  </td>
                  <td style={{ textAlign: "left" }}>
                    <a
                      href="http://172.31.3.216/PTICDNIA/index.php"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button size="sm">Open</Button>
                    </a>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default UserDashboard;
