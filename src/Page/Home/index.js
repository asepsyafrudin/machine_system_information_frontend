import React from "react";
import Footer from "../../Component/Footer";
import Header from "../../Component/Header";
import "./home.css";
import ProjectImage from "../../Asset/ImageGeneral/Project.jpg";
import { useEffect } from "react";
import { getUserByUserIdApi } from "../../Config/API";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchImage from "../../Asset/ImageGeneral/file search.jpg";
import DocumentUploadImage from "../../Asset/ImageGeneral/document.JPG";
function Home() {
  const [position, setPosition] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      const { id } = user;
      axios.get(getUserByUserIdApi(id)).then((response) => {
        const dataUser = response.data.data;
        if (dataUser.length > 0) {
          setPosition(dataUser[0].position);
        }
      });
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="dashboard-body">
        <div className="dashboard-container">
          <div className="card-dashboard">
            <div className="card-dashboard-header">
              <img src={DocumentUploadImage} alt="rover" />
            </div>
            <div className="card-body-dashboard">
              <Link
                to={
                  position === "Administrator"
                    ? "/adminmenu"
                    : "/dashboardUsers"
                }
                style={{ textDecoration: "none" }}
              >
                <div className="tag tag-teal">Click Open Application</div>
              </Link>
              <h4>Dashboard User & Engineering Tools</h4>
              <p>
                To Make Sharing Document, Video Upload (Setting parameter
                Machine), E-Capabality, FTA Creation.
              </p>
            </div>
          </div>
          <div className="card-dashboard">
            <div className="card-dashboard-header">
              <img src={ProjectImage} alt="rover" />
            </div>
            <div className="card-body-dashboard">
              <Link to={"/projectPage"} style={{ textDecoration: "none" }}>
                <div className="tag tag-teal">Click Open Application</div>
              </Link>
              <h4>Project Dashboard</h4>
              <p>
                To Manage Your Project By Making E-Project Schedule and Todo
                List
              </p>
            </div>
          </div>
          <div className="card-dashboard">
            <div className="card-dashboard-header">
              <img src={SearchImage} alt="rover" />
            </div>
            <div className="card-body-dashboard">
              <Link to={"/searching_page"} style={{ textDecoration: "none" }}>
                <div className="tag tag-teal">Click Open Application</div>
              </Link>
              <h4>Search Engine</h4>
              <p>To Find Document Sharing, Video Upload and FTA</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
