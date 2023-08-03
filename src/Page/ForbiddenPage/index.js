import React from "react";
import Footer from "../../Component/Footer";
import Header from "../../Component/Header";
import { useNavigate } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";

function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div className="dashboard-body">
        <div className="dashboard-container">
          <div className="Warning-Box">
            <Alert show={true} variant="danger">
              <Alert.Heading>Sorry </Alert.Heading>
              <p>
                “Access Denied", You Don’t Have Permission To Access This
                Project. Please Request to Member to Add You in the Project
              </p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button
                  onClick={() => navigate("/home")}
                  variant="outline-success"
                >
                  Back to Home Page
                </Button>
              </div>
            </Alert>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ForbiddenPage;
