import React, { useEffect, useState } from "react";
import Logo from "../../Asset/ImageGeneral/LOGO.png";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import photoBluePrint from "../../Asset/ImageGeneral/profile.jpg";
import { Nav, NavDropdown } from "react-bootstrap";
import { RESETUSERLOGIN } from "../../Context/const";
import axios from "axios";
import { getUserByUserIdApi } from "../../Config/API";
import { GlobalConsumer } from "../../Context/store";

function Header(props) {
  const { dispatch } = props;
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState("");
  const [position, setPosition] = useState("");
  const [section, setSection] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      const { id } = user;
      axios.get(getUserByUserIdApi(id)).then((response) => {
        const dataUser = response.data.data;
        if (dataUser.length > 0) {
          setUsername(dataUser[0].username);
          setPhoto(dataUser[0].photo);
          setPosition(dataUser[0].position);
          setSection(dataUser[0].section_id);
        }
      });
    }
  }, []);
  const photoProfile = () => {
    if (photo === "") {
      return photoBluePrint;
    } else {
      return photo;
    }
  };
  const navigate = useNavigate();
  const handleClickUserProfile = () => {
    if (position === "Administrator") {
      navigate("/adminmenu");
    } else {
      navigate("/dashboardUsers");
    }

    if (section === 4) {
      console.log(section);
    }
  };

  const handleSelect = (eventKey) => {
    if (eventKey === "userDashboard") {
      if (position === "Administrator") {
        navigate("/adminmenu");
      } else {
        navigate("/dashboardUsers");
      }
    } else if (eventKey === "logout") {
      localStorage.clear();
      dispatch({
        type: RESETUSERLOGIN,
      });
      navigate("/");
    } else {
      navigate("/projectPage");
    }
  };

  const userStatusLogin = () => {
    if (username !== "") {
      return (
        <>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Hello,{" "}
              <span className="userName" onClick={handleClickUserProfile}>
                <span className="d-inline-block">
                  {CapitalCaseFirstWord(username)}
                </span>
              </span>
            </Navbar.Text>
            <Nav onSelect={handleSelect}>
              <NavDropdown
                title={
                  <div className="imageProfileCover">
                    <img
                      src={photoProfile()}
                      className="photoProfile"
                      alt="profile"
                    ></img>
                  </div>
                }
                id="nav-dropdown"
                style={{ width: 100 }}
              >
                <NavDropdown.Item eventKey="userDashboard">
                  User Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="projectDashboard">
                  Project Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="logout">logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </>
      );
    } else {
      return "";
    }
  };

  return (
    <Navbar style={{ backgroundColor: "#00adeb" }}>
      <Container>
        <Navbar.Brand>
          <Link to={"/home"}>
            <img
              alt=""
              src={Logo}
              width="40"
              height="40"
              className="d-inline-block align-top logoHeader"
            />{" "}
          </Link>
          <span className="titlePEMS">
            PROSYSTA [Production Engineering System Tools & Analysis]
          </span>
        </Navbar.Brand>
        {userStatusLogin()}
      </Container>
    </Navbar>
  );
}

export default GlobalConsumer(Header);
