import React from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import {
  getProblemByIdApi,
  getProblemByMachineIdApi,
  sendFeedbackFtaApi,
} from "../../Config/API";
import "./FTAModalAnalysis.css";
import moment from "moment";
import { ImAttachment } from "react-icons/im";
import { Link } from "react-router-dom";

function FTAModalAnalysis(props) {
  const { search } = props;
  const { showModal, onHandleHide } = props;
  const [tableProblem, setTableProblem] = useState([]);
  const [problemId, setProblemId] = useState("");
  const [tableAnalysis1, setTableAnalysis1] = useState([]);
  const [analysis1Id, setAnalysis1Id] = useState("");
  const [tableAnalysis2, setTableAnalysis2] = useState([]);
  const [sendFeedback, setSendFeedback] = useState(false);
  const [feedBackValue, setFeedbackValue] = useState("");
  const [userId, setUserId] = useState("");

  const closeModal = () => {
    onHandleHide(false);
    setAnalysis1Id("");
    setProblemId("");
    setFeedbackValue("");
    setSendFeedback(false);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    if (search !== "") {
      axios
        .get(getProblemByMachineIdApi(search), {
          signal: controller.signal,
        })
        .then((response) => {
          const result = isMounted && response.data.data;
          setTableProblem(result);
        })
        .then((error) => console.log(error));
    }
    if (problemId !== "") {
      axios
        .get(getProblemByIdApi(problemId), {
          signal: controller.signal,
        })
        .then((response) => {
          isMounted && setTableAnalysis1(response.data.dataFTA1);
          isMounted && setTableAnalysis2(response.data.dataFTA2);
        });
    }

    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user.id);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [search, problemId]);

  const content = () => {
    if (!sendFeedback) {
      if (analysis1Id === "") {
        if (problemId === "") {
          if (tableProblem.length > 0) {
            return (
              <>
                <h4>This is Problem List:</h4> <br />
                <Table hover>
                  <tbody>
                    {tableProblem.map((value, index) => {
                      return (
                        <tr key={index}>
                          <td>{value.problem_name}</td>
                          <td>{moment(value.create_date).format("LLL")}</td>
                          <td>{value.username}</td>
                          <td>
                            <Button
                              id={value.id}
                              onClick={(e) => setProblemId(e.target.id)}
                            >
                              Choose
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </>
            );
          } else {
            return <>Please Scan by Barcode or Enter Machine Number</>;
          }
        } else {
          if (tableAnalysis1.length > 0) {
            const problemName = tableProblem.find(
              (value) => value.id === problemId
            );
            return (
              <>
                <h4>This is Potensial Factor {problemName.problem_name} : </h4>
                <Table>
                  <tbody>
                    {tableAnalysis1.map((value, index) => {
                      return (
                        <tr key={index}>
                          <td>{value.name}</td>
                          <td>
                            {value.attachment.length > 0 && (
                              <Link
                                to={value.attachment[0].file}
                                target="_blank"
                              >
                                <Button>
                                  <ImAttachment
                                    style={{ pointerEvents: "none" }}
                                  />{" "}
                                  Open Attachment
                                </Button>
                              </Link>
                            )}
                          </td>
                          <td>
                            {value.type !== "Solution" && (
                              <Button
                                id={value.id}
                                onClick={(e) => setAnalysis1Id(e.target.id)}
                              >
                                Choose
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </>
            );
          } else {
            return <>Data Is Not Available</>;
          }
        }
      } else {
        const list = tableAnalysis2.filter((value) => value.id === analysis1Id);
        const analysisName = tableAnalysis1.find(
          (value) => value.id === analysis1Id
        );

        if (list.length > 0) {
          return (
            <>
              <h4>This is Potensial Factor from {analysisName.name} :</h4>
              <Table>
                <tbody>
                  {list.map((value, index) => {
                    return (
                      <tr key={index}>
                        <td>{value.name}</td>
                        <td>
                          {value.attachment.length > 0 && (
                            <Link to={value.attachment[0].file} target="_blank">
                              <Button>
                                <ImAttachment
                                  style={{ pointerEvents: "none" }}
                                />{" "}
                                Open Attachment
                              </Button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </>
          );
        } else {
          return <>Data Is Not Available</>;
        }
      }
    } else {
      return (
        <Form>
          <Form.Label>Your Feedback</Form.Label>
          <Form.Control
            type="text"
            value={feedBackValue}
            onChange={(e) => setFeedbackValue(e.target.value)}
            placeholder="Enter Your Feedback Here"
          />
        </Form>
      );
    }
  };

  const backButton = () => {
    setFeedbackValue("");
    setSendFeedback(false);
    if (analysis1Id !== "") {
      setAnalysis1Id("");
    } else if (problemId !== "") {
      setProblemId("");
    }
  };

  const handleFeedback = () => {
    setSendFeedback(true);
  };

  const saveFeedback = () => {
    let data = {
      problem_id: problemId,
      user_id: userId,
      message: feedBackValue,
    };

    let confirm = window.confirm("Do you want to send ? ");
    if (confirm) {
      axios
        .post(sendFeedbackFtaApi, data)
        .then((response) => {
          setFeedbackValue("");
          window.alert("Feedback already send to creator");
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <Modal
      show={showModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className="bodyModalFtaAnalysis">
          {content()}
          {/* <TypeAnimationText text={content()} /> */}
        </div>
      </Modal.Body>
      <Row className="footerModalAnalysis">
        <Col sm={6} style={{ textAlign: "left" }}>
          {sendFeedback ? (
            <Button
              disabled={feedBackValue === "" ? true : false}
              type="submit"
              variant="success"
              onClick={saveFeedback}
            >
              Send to Creator
            </Button>
          ) : (
            <Button
              disabled={problemId === "" ? true : false}
              variant="success"
              onClick={handleFeedback}
            >
              Send Feedback
            </Button>
          )}
        </Col>
        <Col sm={6} style={{ textAlign: "right" }}>
          <Button
            disabled={problemId === "" ? true : false}
            onClick={backButton}
            style={{ marginRight: 2 }}
          >
            Back
          </Button>
          <Button onClick={closeModal}>Close</Button>
        </Col>
      </Row>
    </Modal>
  );
}

export default FTAModalAnalysis;
