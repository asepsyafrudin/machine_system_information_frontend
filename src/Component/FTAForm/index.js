import React from "react";
import TitleSection from "../TitleSection";
import { ImTree } from "react-icons/im";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useState } from "react";
import ModalFTAForm from "../ModalFTAForm";
import { useEffect } from "react";
import {
  createFtaLv1Api,
  createFtaLv2Api,
  createProblemApi,
  deleteFileByIdApi,
  deleteProblemByIdApi,
  getAllLineApi,
  getAllMachineApi,
  getAllProductApi,
  getFileByIdApi,
  getProblemByIdApi,
} from "../../Config/API";
import axios from "axios";
import "./FTAForm.css";
import { BsFillPlayFill } from "react-icons/bs";
import { FIRSTANALYSIS, SECONDANALYSIS } from "../../Config/const";
import { getExtFileName } from "../../Config/fileType";
import { v4 as uuid } from "uuid";
import { useNavigate, useParams } from "react-router-dom";

function FTAForm() {
  const { id } = useParams();
  const [product, setProduct] = useState("");
  const [line, setLine] = useState("");
  const [machine, setMachine] = useState("");
  const [problemName, setProblemName] = useState("");
  const [tableProduct, setTableProduct] = useState([]);
  const [tableLine, setTableLine] = useState([]);
  const [tableMachine, setTableMachine] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("");
  const [analysis1, setAnalysis1] = useState([]);
  const [analysis2, setAnalysis2] = useState([]);
  const [idAnalysis, setIdAnalysis] = useState("");
  const [dataEdit, setDataEdit] = useState("");
  const [userId, setUserId] = useState("");
  const [showAfterSave, setShowAfterSave] = useState(false);

  useEffect(() => {
    axios
      .get(getAllProductApi)
      .then((response) => {
        setTableProduct(response.data.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(getAllLineApi)
      .then((response) => {
        setTableLine(response.data.data);
      })
      .catch((error) => console.log(error));

    axios.get(getAllMachineApi).then((response) => {
      setTableMachine(response.data.data);
    });

    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user.id);

    if (id) {
      axios.get(getProblemByIdApi(id)).then((response) => {
        const data = response.data.data[0];
        setProblemName(data.problem_name);
        setMachine(data.machine_id);
        setProduct(data.product_id);
        setLine(data.line_id);
        setAnalysis1(response.data.dataFTA1);
        setAnalysis2(response.data.dataFTA2);
      });
    }
  }, [id]);

  const productOption = () => {
    let option = [];
    if (tableProduct.length > 0) {
      for (let index = 0; index < tableProduct.length; index++) {
        option.push(
          <option key={index} value={tableProduct[index].id}>
            {tableProduct[index].product_name}
          </option>
        );
      }
    }
    return <>{option}</>;
  };

  const lineOption = () => {
    let option = [];
    if (product && tableLine.length > 0) {
      const lineFilter = tableLine.filter(
        (value) =>
          value.product_id === parseInt(product) && value.status === "Active"
      );
      if (lineFilter) {
        for (let index = 0; index < lineFilter.length; index++) {
          option.push(
            <option key={index} value={lineFilter[index].id}>
              {lineFilter[index].line_name}
            </option>
          );
        }
      }
    }

    return <>{option}</>;
  };

  const machineOption = () => {
    let option = [];
    if (line && tableMachine.length > 0) {
      const machineFilter = tableMachine.filter(
        (value) => value.line_id === parseInt(line) && value.status === "Active"
      );

      if (machineFilter) {
        for (let index = 0; index < machineFilter.length; index++) {
          option.push(
            <option key={index} value={machineFilter[index].id}>
              {machineFilter[index].machine_name}
            </option>
          );
        }
      }
    }

    return <>{option}</>;
  };

  const handleFirstAnalysis = (e) => {
    const mode = e.target.id;
    setMode(mode);
    setIdAnalysis(uuid());
    setShowModal(true);
  };

  const handleSecondAnalysis = (e) => {
    const id = e.target.id;
    setMode(SECONDANALYSIS);
    setIdAnalysis(id);
    setShowModal(true);
  };

  const handleSaveAnalysis = (saveData) => {
    let data = saveData;
    if (mode === FIRSTANALYSIS) {
      const checkData = analysis1.find((value) => value.id === data.id);
      if (checkData) {
        const oldData = analysis1.filter((value) => value.id !== data.id);
        oldData.push(data);
        setAnalysis1(oldData);
        setMode("");
      } else {
        setAnalysis1((prev) => [...prev, data]);
        setMode("");
      }
    } else if (mode === SECONDANALYSIS) {
      const checkData = analysis2.find(
        (value) => value.idAnalysis2 === data.id
      );
      if (checkData) {
        const oldData = analysis2.filter(
          (value) => value.idAnalysis2 !== data.id
        );

        oldData.push({
          id: checkData.id,
          type: data.type,
          name: data.name,
          attachment: data.attachment,
          idAnalysis2: data.id,
        });

        setAnalysis2(oldData);
        setMode("");
      } else {
        let newData = { ...data, idAnalysis2: uuid() };
        setAnalysis2((prev) => [...prev, newData]);
        setMode("");
      }
    }
  };

  const handleDeleteAnalysis1 = (e) => {
    const id = e.target.id;
    const newData = analysis1.filter((value) => value.id !== id);
    setAnalysis1(newData);
  };

  const handleDeleteAnalysis2 = (e) => {
    const id = e.target.id;
    const newData = analysis2.filter((value) => value.idAnalysis2 !== id);
    setAnalysis2(newData);
  };

  const handleEditAnalysis1 = (e) => {
    const id = e.target.id;
    setMode(FIRSTANALYSIS);
    const dataForEdit = analysis1.find((value) => value.id === id);
    if (dataForEdit) {
      setDataEdit(dataForEdit);
      setIdAnalysis(id);
    }
    setShowModal(true);
  };

  const handleEditAnalysis2 = (e) => {
    const id = e.target.id;
    setMode(SECONDANALYSIS);
    const dataForEdit = analysis2.find((value) => value.idAnalysis2 === id);
    if (dataForEdit) {
      setDataEdit(dataForEdit);
      setIdAnalysis(id);
    }
    setShowModal(true);
  };

  const handleSolution = (id) => {
    const solution = analysis2.filter((value) => value.id === id);
    let arraySolutionTable = [];
    if (solution.length > 0) {
      for (let index = 0; index < solution.length; index++) {
        arraySolutionTable.push(
          <Table style={{ marginLeft: 20, textAlign: "left" }} key={index}>
            <tbody>
              <tr style={{ textAlign: "left" }}>
                <td>
                  <BsFillPlayFill />
                  Solution
                </td>
                <td>{solution[index].name} </td>
                <td>
                  <Button
                    type="button"
                    variant="primary"
                    id={solution[index].idAnalysis2}
                    onClick={handleEditAnalysis2}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    type="button"
                    variant="secondary"
                    id={solution[index].idAnalysis2}
                    onClick={handleDeleteAnalysis2}
                  >
                    Delete
                  </Button>
                </td>
              </tr>

              <tr>
                <td colSpan={3}>
                  <table className="tableAttachment">
                    <tbody>
                      {solution[index].attachment.map((value, index2) => {
                        return (
                          <tr key={index2}>
                            <td>{index2 + 1}</td>
                            <td>{value.name}</td>
                            <td>{getExtFileName(value.name)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </Table>
        );
      }
    }
    return arraySolutionTable;
  };

  const handleReset = () => {
    setProduct("");
    setLine("");
    setMachine("");
    setIdAnalysis("");
    setDataEdit("");
    setMode("");
  };

  const navigate = useNavigate();

  const handleSaveFTA = async (e) => {
    e.preventDefault();
    const problemId = uuid();
    const dataProblem = {
      id: problemId,
      machine_id: machine,
      user_id: userId,
      problem_name: problemName,
    };

    const saveProblem = async () => {
      await axios
        .post(createProblemApi, dataProblem)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    };

    const saveAnalysis1 = async () => {
      if (analysis1.length > 0) {
        for (let index = 0; index < analysis1.length; index++) {
          const formDataAnalysis1 = new FormData();
          formDataAnalysis1.append("id", analysis1[index].id);
          formDataAnalysis1.append("problem_id", problemId);
          formDataAnalysis1.append("type", analysis1[index].type);
          formDataAnalysis1.append("description", analysis1[index].name);
          if (analysis1[index].attachment.length > 0) {
            formDataAnalysis1.append("file", analysis1[index].attachment[0]);
          }
          const response = await axios.post(createFtaLv1Api, formDataAnalysis1);
          console.log(response);
        }
      } else {
        setShowAfterSave(true);
      }
    };

    const saveAnalysis2 = async () => {
      if (analysis2.length > 0) {
        for (let index = 0; index < analysis2.length; index++) {
          const formDataAnalysis2 = new FormData();
          formDataAnalysis2.append("id", analysis2[index].idAnalysis2);
          formDataAnalysis2.append("level1_id", analysis2[index].id);
          formDataAnalysis2.append("description", analysis2[index].name);
          formDataAnalysis2.append("type", analysis2[index].type);
          if (analysis2[index].attachment.length > 0) {
            formDataAnalysis2.append("file", analysis2[index].attachment[0]);
          }

          const response = await axios.post(createFtaLv2Api, formDataAnalysis2);
          console.log(response);
        }
      } else {
        setShowAfterSave(true);
      }
    };

    if (id) {
      if (analysis1.length > 0) {
        for (let index = 0; index < analysis1.length; index++) {
          axios.get(getFileByIdApi(analysis1[index].id)).then((response) => {
            const dataCheck = response.data.data;
            if (dataCheck.length > 0) {
              axios.delete(deleteFileByIdApi(analysis1[index].id));
            }
          });
        }
      }

      if (analysis2.length > 0) {
        for (let index = 0; index < analysis2.length; index++) {
          axios
            .get(getFileByIdApi(analysis2[index].idAnalysis2))
            .then((response) => {
              const dataCheck = response.data.data;
              if (dataCheck.length > 0) {
                axios.delete(deleteFileByIdApi(analysis2[index].idAnalysis2));
              }
            });
        }
      }

      axios.delete(deleteProblemByIdApi(id)).then(async (response) => {
        await saveProblem();
        await saveAnalysis1();
        await saveAnalysis2();
      });
    } else {
      await saveProblem();
      await saveAnalysis1();
      await saveAnalysis2();
    }
    setShowAfterSave(true);
    setTimeout(() => {
      navigate("/ftaList");
    }, [1000]);
  };

  const handleHideModal = (e) => {
    setShowModal(e);
    setIdAnalysis("");
    setDataEdit("");
    setMode("");
  };
  return (
    <div className="capabilityFormContainer">
      <div className="capabilityForm">
        <TitleSection
          title="Create FTA"
          icon={<ImTree style={{ marginRight: 5 }} />}
        />
        <Form onSubmit={handleSaveFTA}>
          <Row style={{ textAlign: "right" }}>
            <Col>
              <Button
                type="submit"
                variant="primary"
                style={{ marginRight: 5 }}
              >
                Save
              </Button>
              <Button type="button" variant="secondary" onClick={handleReset}>
                Reset
              </Button>
            </Col>
          </Row>
          <Row className="mb-3" style={{ textAlign: "left" }}>
            <Form.Group as={Col}>
              <Form.Label>Select Product</Form.Label>
              <Form.Select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
              >
                <option value="" disabled>
                  Open This
                </option>
                {productOption()}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Select Line</Form.Label>
              <Form.Select
                value={line}
                onChange={(e) => setLine(e.target.value)}
                required
              >
                <option value="" disabled>
                  Open This
                </option>
                {lineOption()}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Select Machine</Form.Label>
              <Form.Select
                value={machine}
                onChange={(e) => setMachine(e.target.value)}
                required
              >
                <option value="" disabled>
                  Open This
                </option>
                {machineOption()}
              </Form.Select>
            </Form.Group>
          </Row>
          <Row className="mb-3" style={{ textAlign: "left" }}>
            <Form.Group as={Col}>
              <Form.Label>Problem</Form.Label>
              <Form.Control
                as={"textarea"}
                value={problemName}
                onChange={(e) => setProblemName(e.target.value)}
              />
            </Form.Group>
          </Row>
          <Row style={{ textAlign: "right" }}>
            <Col>
              <Button
                id={FIRSTANALYSIS}
                variant="success"
                onClick={handleFirstAnalysis}
              >
                ADD Analysis
              </Button>
            </Col>
          </Row>
        </Form>
        {analysis1.map((value, index) => {
          return (
            <div className="analysis-card-list" key={index}>
              <Table style={{ textAlign: "left" }}>
                <tbody>
                  <tr style={{ textAlign: "left" }}>
                    <td>{value.type}</td>
                    <td>{value.name}</td>
                    <td>
                      <Button
                        type="button"
                        variant="primary"
                        id={value.id}
                        onClick={handleEditAnalysis1}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        type="button"
                        variant="secondary"
                        id={value.id}
                        onClick={handleDeleteAnalysis1}
                      >
                        Delete
                      </Button>{" "}
                      {value.type === "Causative Factor" && (
                        <Button
                          type="button"
                          variant="success"
                          id={value.id}
                          onClick={handleSecondAnalysis}
                        >
                          Add Solution
                        </Button>
                      )}
                    </td>
                  </tr>

                  <tr key={index}>
                    <td colSpan={3}>
                      <table className="tableAttachment">
                        <tbody>
                          {value.attachment.map((value2, index2) => {
                            return (
                              <tr key={index2}>
                                <td>{index2 + 1}</td>
                                <td>{value2.name}</td>
                                <td>{getExtFileName(value2.name)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </Table>
              {handleSolution(value.id)}
            </div>
          );
        })}

        <ModalFTAForm
          onSave={(e) => handleSaveAnalysis(e)}
          showModal={showModal}
          id={idAnalysis}
          mode={mode}
          onHandleHide={(e) => handleHideModal(e)}
          dataEdit={dataEdit}
        />

        <Modal show={showAfterSave} onHide={(e) => setShowAfterSave(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Notification</Modal.Title>
          </Modal.Header>
          <Modal.Body>Data Tersimpan</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAfterSave(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default FTAForm;
