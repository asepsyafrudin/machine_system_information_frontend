import React, { useEffect } from "react";
// import { Col, Container, Row } from "react-bootstrap";
import Footer from "../../Component/Footer";
import { useNavigate, useParams } from "react-router-dom";
import LoginFormRedirectToActivity from "../../Component/LoginFormRedirectToActivity";
import Header from "../../Component/Header";

function RedirectActivityPage() {
  const { projectId } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate(`/projectActivity/${projectId}`);
    }
  }, [navigate, projectId]);
  return (
    <div className="loginPage">
      <Header />
      <div className="loginContent">
        <div className="loginFormBox">
          <LoginFormRedirectToActivity projectId={projectId} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RedirectActivityPage;
