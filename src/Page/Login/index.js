import React, { useEffect } from "react";
// import { Col, Container, Row } from "react-bootstrap";
import Footer from "../../Component/Footer";
import Header from "../../Component/Header";
import "./login.css";
import LoginForm from "../../Component/LoginForm";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/searching_page");
    }
  }, [navigate]);
  return (
    <div className="loginPage">
      <Header />
      <div className="loginContent">
        <div className="loginFormBox">
          <LoginForm />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
