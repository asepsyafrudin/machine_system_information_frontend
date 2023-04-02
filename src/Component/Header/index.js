import React, { useEffect, useState } from "react";
import Logo from "../../Asset/ImageGeneral/LOGO.png";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import photoBluePrint from "../../Asset/ImageGeneral/profile.jpg";
import { Nav, NavDropdown, OverlayTrigger, Tooltip } from "react-bootstrap";

function Header() {
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState("");
  const [position, setPosition] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      setUsername(user.username);
      setPhoto(user.photo);
      setPosition(user.position);
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
  };

  const goToSearchEngine = () => {
    navigate("/searching_page");
  };

  const handleSelect = (eventKey) => {
    localStorage.clear();
    navigate("/");
  };

  const userTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Open User Dashbord
    </Tooltip>
  );

  const userStatusLogin = () => {
    if (username !== "") {
      return (
        <>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Hello,{" "}
              <span className="userName" onClick={handleClickUserProfile}>
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 400 }}
                  overlay={userTooltip}
                >
                  <span className="d-inline-block">
                    {CapitalCaseFirstWord(username)}
                  </span>
                </OverlayTrigger>
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
                      onClick={handleClickUserProfile}
                    ></img>
                  </div>
                }
                id="nav-dropdown"
                style={{ width: 100 }}
              >
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
          <Link to={"/searching_page"}>
            <img
              alt=""
              src={Logo}
              width="40"
              height="40"
              className="d-inline-block align-top logoHeader"
              onClick={goToSearchEngine}
            />{" "}
          </Link>
          <span className="titlePEMS">
            PRESYSTA [Production Engineering System Tools & Analysis]
          </span>
        </Navbar.Brand>
        {userStatusLogin()}
      </Container>
    </Navbar>
  );
}

export default Header;
