import React, { useState } from "react";
import "./loginForm.css";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginApi } from "../../Config/API";

function LoginForm() {
  const [npk, setNpk] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { npk: npk, password: password };
    axios
      .post(loginApi, data)
      .then((response) => {
        const user = response.data.data[0];
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/searching_page");
          // dispatch(loginUser({ type: "login", payload: user }));
        } else {
          setAlert(true);
        }
      })
      .catch((err) => {
        setAlert(true);
      });
  };

  return (
    <div className="loginForm">
      <div className="loginTitle">Login</div>
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
        <div style={{ float: "right", fontSize: "15px", cursor: "pointer" }}>
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
    </div>
  );
}

export default LoginForm;
