import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import "./openaiComponent.css";
import photoBluePrint from "../../Asset/ImageGeneral/profile.jpg";
import photoRobot from "../../Asset/ImageGeneral/robotai.jpg";
import { openaiApi } from "../../Config/API";
import { BsChatLeft } from "react-icons/bs";
import axios from "axios";
import TypeAnimationText from "../TypeAnimationText";

function OpenaiComponent() {
  const [inputText, setInputText] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [wait, setWait] = useState(false);

  const [userPhoto, setUserPhoto] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    const user = JSON.parse(localStorage.getItem("user"));
    setUserPhoto(user.photo);
  }, [userPhoto, chatLog]);

  const hanldeSubmit = (e) => {
    e.preventDefault();
    let dataUser = {
      role: "user",
      message: inputText,
    };

    let dataBot = {
      role: "bot",
      message: "",
    };
    setChatLog([...chatLog, dataUser, dataBot]);
    setWait(true);
    const dataPrompt = {
      prompt: inputText,
    };

    axios
      .post(openaiApi, dataPrompt)
      .then((response) => {
        let newData = {
          role: "bot",
          message: response.data.bot,
        };
        setChatLog([...chatLog, dataUser, newData]);
        setWait(false);
        setInputText("");
      })
      .catch((error) => console.log(error));
  };

  const handleReset = () => {
    setInputText("");
  };
  return (
    <div className="openaicontent">
      <div>
        <Form onSubmit={hanldeSubmit}>
          <Row>
            <Col sm={8}>
              <InputGroup>
                <InputGroup.Text id="basic-addon1">
                  <BsChatLeft />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter Everything You Want , Everything You Need"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                  }}
                />
              </InputGroup>
            </Col>
            <Col sm={4} style={{ textAlign: "left" }}>
              {" "}
              <Button type="submit" style={{ marginRight: 5 }}>
                Submit
              </Button>
              <Button type="button" onClick={handleReset}>
                Clear
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="chatOpenai">
        {chatLog.length > 0 &&
          chatLog.map((value, index) => {
            return (
              <Row key={index} className="mb-3">
                <Col sm={1}>
                  {value.role === "user" ? (
                    <div className="photoUserVideoCover">
                      <img
                        src={userPhoto ? userPhoto : photoBluePrint}
                        alt="profile"
                        className="photoUserVideo"
                      />
                    </div>
                  ) : (
                    <div className="photoUserVideoCover">
                      <img
                        src={photoRobot}
                        alt="profile"
                        className="photoUserVideo"
                      />
                    </div>
                  )}
                </Col>
                <Col sm={10} style={{ textAlign: "left" }}>
                  {value.role === "user" ? (
                    value.message
                  ) : index === chatLog.length - 1 ? (
                    wait ? (
                      <>
                        {" "}
                        "Robot Sedang Berpikir, Tunggu Dulu Yaa.."
                        <Spinner animation="border" variant="primary" />
                      </>
                    ) : (
                      <>
                        <TypeAnimationText text={value.message} />{" "}
                      </>
                    )
                  ) : (
                    value.message
                  )}
                </Col>
              </Row>
            );
          })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default OpenaiComponent;
