import React, { Fragment, useEffect, useState } from "react";
import { Alert, Button, Form, Row, Col, Toast } from "react-bootstrap";
import { GoSmiley } from "react-icons/go";
import TitleSection from "../TitleSection";
import imageBluPrint from "../../Asset/ImageGeneral/profile.jpg";
import axios from "axios";
import { FaUserAlt } from "react-icons/fa";
import {
  changeStatusNotification,
  checkUserPassword,
  getNotificationByUserId,
  getUserByUserIdApi,
  updateUserApi,
} from "../../Config/API";
import { GrValidate } from "react-icons/gr";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import moment from "moment/moment";

function UserDashboard(props) {
  const { actionState, actionStateValue } = props;
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setOldPassword(user.password);
    const id = parseInt(user.id);
    axios(getUserByUserIdApi(id)).then((response) => {
      const dataForEdit = response.data.data;
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
      setSection(dataForEdit[0].section);
      setProduct(dataForEdit[0].product);
    });
    axios.get(getNotificationByUserId(id)).then((response) => {
      setTableNotification(response.data.data);
    });
  }, [actionStateValue]);

  const resetForm = () => {
    setMessage("");
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
          formData.append("product", product);
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
          setAlert(true);
        }
      } else {
        setMessage("Your Current Password Wrong!!");
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
    setPhoto("");
    setPhotoPreview(imageBluPrint);
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

  const handleCloseNotif = (e) => {
    const id = e.target.id;
    axios.patch(changeStatusNotification(id)).then((response) => {
      actionState(1);
    });
  };

  return (
    <div>
      <div className="userListContainer">
        <TitleSection
          title="User Profile"
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
                    <Form.Label>Section</Form.Label>
                    <Form.Select
                      disabled={!updateMode}
                      value={section}
                      onChange={handleSetSection}
                    >
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
                      disabled={section && updateMode ? false : true}
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
                      disabled={!updateMode}
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
                          onClick={(e) => setUpdateMode(false)}
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
                            Mengomentari Video Anda , Klik{" "}
                            <a href={value.link}>LINK</a>,{" "}
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
      </Row>
    </div>
  );
}

export default UserDashboard;
