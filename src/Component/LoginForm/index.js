import React, { useEffect, useState } from "react";
import "./loginForm.css";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  changePasswordUserApi,
  createRequestApi,
  createTokenApi,
  deleteRequestApi,
  getRequestApi,
  getUserByEmailApi,
  loginApi,
} from "../../Config/API";
import { CHANGE_PASSWORD } from "../../Config/const";
import ModalAlert from "../ModalAlert";
import { GrValidate } from "react-icons/gr";
import { SAVEUSERLOGIN } from "../../Context/const";
import { GlobalConsumer } from "../../Context/store";

function LoginForm(props) {
  const { dispatch } = props;
  const { token } = useParams();
  const [npk, setNpk] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(false);
  const [email, setEmail] = useState("");
  const [forgetPassword, setForgetPassword] = useState(false);
  const [showModalAlert, setShowModalAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    axios.get(getRequestApi(token)).then((response) => {
      const data = response.data.data;
      if (data.length !== 0) {
        const emailChangePassword = data[0].email;
        axios.get(getUserByEmailApi(emailChangePassword)).then((response) => {
          setUser(response.data.data);
        });
      }
    });
  }, [token, user]);

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { npk: npk, password: password };
    axios
      .post(loginApi, data)
      .then((response) => {
        const user = response.data.data[0];
        const { id, username, npk, email, section, product, photo, position } =
          user;
        if (user) {
          axios
            .post(createTokenApi, user)
            .then((response) => {
              const token = response.data.data;

              localStorage.setItem("user", JSON.stringify(user));
              localStorage.setItem("token", JSON.stringify(token));
              navigate("/home");
              dispatch({
                type: SAVEUSERLOGIN,
                payload: {
                  user_id: id,
                  username: username,
                  npk: npk,
                  email: email,
                  section: section,
                  product: product,
                  photo: photo,
                  position: position,
                },
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          setAlert(true);
        }
      })
      .catch((err) => {
        setAlert(true);
      });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    const data = {
      email: email,
      request_item: CHANGE_PASSWORD,
    };
    axios.get(getUserByEmailApi(email)).then((response) => {
      const user = response.data.data;
      if (user.length !== 0) {
        axios.post(createRequestApi, data).then((response) => {
          setForgetPassword(false);
          setMessage("plase check your email");
          setShowModalAlert(true);
        });
      } else {
        setMessage("Email tidak terdaftar");
        setShowModalAlert(true);
      }
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword === confirmNewPassword) {
      const data = {
        email: user[0].email,
        password: newPassword,
      };
      axios
        .patch(changePasswordUserApi, data)
        .then((response) => {
          axios
            .delete(deleteRequestApi(token))
            .then((response) => {
              navigate("/");
              setUser([]);
              setForgetPassword(false);
              setMessage("Change Password Berhasil, Silahkan Login Kembali");
              setShowModalAlert(true);
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    } else {
      setMessage("Password tidak sama, Silahkan Check kembali");
      setShowModalAlert(true);
    }
  };

  const validatePassword = () => {
    if (newPassword !== "") {
      if (newPassword === confirmNewPassword) {
        return <GrValidate style={{ marginLeft: 10, color: "#00adeb" }} />;
      }
      return "";
    }
    return "";
  };

  return (
    <div className="loginForm">
      <div className="loginTitle">Login</div>
      {user.length !== 0 ? (
        <Form onSubmit={handleChangePassword}>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontSize: "20px" }}>Email</Form.Label>
            <Form.Control type="email" value={user[0].email} disabled />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontSize: "20px" }}>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontSize: "20px" }}>
              Re-Password {validatePassword()}
            </Form.Label>
            <Form.Control
              type="password"
              value={confirmNewPassword}
              placeholder="Enter RePassword"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </Form.Group>

          <div style={{ float: "right" }}>
            <Button type="submit">Submit</Button>
          </div>
        </Form>
      ) : forgetPassword ? (
        <Form onSubmit={handleForgotPassword}>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontSize: "20px" }}>Email</Form.Label>
            <Form.Control
              type="text"
              value={email}
              placeholder="Enter Your Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <div style={{ float: "right" }}>
            <Button type="submit">Submit</Button>
            <Button
              type="button"
              onClick={() => setForgetPassword(false)}
              style={{ marginLeft: 10 }}
              variant="success"
            >
              Back
            </Button>
          </div>
        </Form>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontSize: "20px" }}>NPK</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Please enter your NPK"
              value={npk}
              onChange={(e) => setNpk(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontSize: "20px" }}>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Please enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div
            onClick={() => setForgetPassword(!forgetPassword)}
            style={{ float: "right", fontSize: "15px", cursor: "pointer" }}
          >
            Forgot your password?
          </div>{" "}
          <br />
          <br />
          <div style={{ float: "right" }}>
            <Button type="submit">Login</Button>
          </div>
          <br />
          <br />
          <Alert
            show={alert}
            onClose={() => {
              setAlert(false);
            }}
            dismissible
          >
            User dan Password Salah
          </Alert>
        </Form>
      )}
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

export default GlobalConsumer(LoginForm);
