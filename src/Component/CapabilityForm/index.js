import React, { useEffect, useState } from "react";
import "./capabilityForm.css";
import TitleSection from "../TitleSection";
import { VscGraphLine } from "react-icons/vsc";
import {
  Badge,
  Button,
  Col,
  Form,
  Row,
  Spinner,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import axios from "axios";
import {
  createCapabilityApi,
  getAllLineApi,
  getAllMachineApi,
  getAllProductApi,
  getCapabilityByIdApi,
  updateCapabilityApi,
} from "../../Config/API";
import {
  DOUBLE_STANDARD,
  FOUR_SIGMA,
  SINGLE_STANDARD_MAX,
  SINGLE_STANDARD_MIN,
  THREE_SIGMA,
} from "../../Config/const";
import GraphCapabilityLine from "../GraphCapabilityLine";
import GraphCapabilityDistribution from "../GraphCapabilityDistribution";
import GraphNormalDistribution from "../GraphNormalDistribution";
import { SlEmotsmile } from "react-icons/sl";
import { FaRegSadCry } from "react-icons/fa";
import RECOMENDATION from "../../Config/recomendationOfCapability";
import { BsDiamondFill } from "react-icons/bs";
import { RiStopMiniLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import ModalAlert from "../ModalAlert";

function CapabilityForm() {
  const { id } = useParams();
  const [userId, setUserId] = useState("");
  const [userIdDataView, setUserIdDataView] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [tableProduct, setTableProduct] = useState("");
  const [tableLine, setTableLine] = useState("");
  const [tableMachine, setTableMachine] = useState("");
  const [product, setProduct] = useState("");
  const [line, setLine] = useState("");
  const [machine, setMachine] = useState("");
  const [partName, setPartName] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [remark, setRemark] = useState("");
  const [itemCheck, setItemCheck] = useState("");
  const [type, setType] = useState("");
  const [sigma, setSigma] = useState("");
  const [standard, setStandard] = useState("");
  const [standardMax, setStandardMax] = useState("");
  const [standardMin, setStandardMin] = useState("");
  const [key, setKey] = useState("graph-capability-1");
  const [inputData, setInputData] = useState("");
  const [listData, setListData] = useState([]);
  const [actionValue, setActionValue] = useState(0);
  const [showModalAlert, setShowModalAlert] = useState(false);
  const [message, setMessage] = useState("");

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

    axios.get(getCapabilityByIdApi(id)).then((response) => {
      const result = response.data.data;
      if (result.length > 0) {
        setMachine(result[0].machine_id);
        setUserIdDataView(result[0].user_id);
        setProduct(result[0].product_id);
        setLine(result[0].line_id);
        setPartName(result[0].part_name);
        setPartNumber(result[0].part_number);
        setType(result[0].type);
        setItemCheck(result[0].item_check);
        setSigma(result[0].sigma);
        if (result[0].type === DOUBLE_STANDARD) {
          setStandardMax(result[0].standard_max);
          setStandardMin(result[0].standard_min);
        } else {
          setStandard(result[0].standard);
        }
        setRemark(result[0].description);
        if (result[0].data.length > 0) {
          setListData(result[0].data);
        }
        setUpdateMode(true);
      }
    });

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserId(user.id);
    }
  }, [id, updateMode]);

  const handleSetProduct = (e) => {
    setProduct(e.target.value);
    setLine("");
    setMachine("");
  };

  const handleSetLine = (e) => {
    setLine(e.target.value);
    setMachine("");
  };
  const productOption = () => {
    let option = [];
    if (tableProduct) {
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
    if (product && tableLine) {
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
    if (line && tableMachine) {
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

  const handleSetType = (e) => {
    setType(e.target.value);
    setStandard("");
    setStandardMax("");
    setStandardMin("");
  };

  const handleAddData = (e) => {
    e.preventDefault();
    const data = {
      no: listData.length + 1,
      data: inputData,
    };
    setListData((prev) => [...prev, data]);
    setInputData("");
  };

  const handleDeleteData = (e) => {
    const index = e.target.id;
    let array = listData;
    array.splice(index, 1);
    setListData(array);
    setActionValue(actionValue + 1);
  };

  const averageData = (listData) => {
    let average = 0;
    if (listData.length > 0) {
      let value = 0;
      for (let index = 0; index < listData.length; index++) {
        value = value + parseFloat(listData[index].data);
      }
      average = value / listData.length;
      let number = (Math.round(average * 1000) / 1000).toFixed(3);
      return number;
    }
    return average;
  };

  const sigmaData = (listData) => {
    let sigma = 0;
    let average = averageData(listData);

    if (listData.length > 1) {
      let sum = 0;
      for (let index = 0; index < listData.length; index++) {
        sum += Math.pow(parseFloat(listData[index].data) - average, 2);
      }

      sigma = Math.sqrt(sum / (listData.length - 1));
      let number = (Math.round(sigma * 1000) / 1000).toFixed(3);
      return number;
    }
    return sigma;
  };

  const cpData = (listData) => {
    let cp = 0;
    let sigmaValue = sigmaData(listData);
    let average = averageData(listData);

    if (listData.length > 1) {
      if (type === DOUBLE_STANDARD) {
        cp =
          (parseFloat(standardMax) - parseFloat(standardMin)) /
          (2 * parseInt(sigma) * sigmaValue);
      } else if (type === SINGLE_STANDARD_MAX) {
        cp = (parseFloat(standard) - average) / (parseInt(sigma) * sigmaValue);
      } else if (type === SINGLE_STANDARD_MIN) {
        cp = (average - parseFloat(standard)) / (parseInt(sigma) * sigmaValue);
      }
      let number = (Math.round(cp * 100) / 100).toFixed(2);
      return number;
    }
    return cp;
  };

  const cpkData = (listData) => {
    let cpk = 0;
    let sigmaValue = sigmaData(listData);
    let average = averageData(listData);
    let centerData = (parseFloat(standardMax) + parseFloat(standardMin)) / 2;

    if (listData.length > 1) {
      if (type === DOUBLE_STANDARD) {
        if (average > centerData) {
          cpk =
            (parseFloat(standardMax) - average) /
            (parseInt(sigma) * sigmaValue);
        } else {
          cpk =
            (average - parseFloat(standardMin)) /
            (parseInt(sigma) * sigmaValue);
        }
      } else {
        cpk = "-";
        return cpk;
      }
    }
    let number = (Math.round(cpk * 100) / 100).toFixed(2);
    return number;
  };

  const judgement = (type, cp, cpk) => {
    if (type === DOUBLE_STANDARD) {
      if (cp > 1.33 && cpk > 1.33) {
        return (
          <>
            <Badge bg="success" style={{ fontSize: 15 }}>
              <SlEmotsmile style={{ marginRight: 5 }} /> Good
            </Badge>
          </>
        );
      } else {
        return (
          <>
            <Badge bg="danger" style={{ fontSize: 15 }}>
              <FaRegSadCry style={{ marginRight: 5 }} /> No Good
            </Badge>
          </>
        );
      }
    } else if (type === SINGLE_STANDARD_MAX || type === SINGLE_STANDARD_MIN) {
      if (cp > 1.33) {
        return (
          <>
            <Badge bg="success" style={{ fontSize: 15 }}>
              <SlEmotsmile style={{ marginRight: 5 }} /> Good
            </Badge>
          </>
        );
      }
      return (
        <>
          <Badge bg="danger" style={{ fontSize: 15 }}>
            <FaRegSadCry style={{ marginRight: 5 }} /> No Good
          </Badge>
        </>
      );
    }
  };

  const recomendationHandle = () => {
    if (listData.length >= 24) {
      const data = RECOMENDATION(
        listData,
        standardMax,
        standardMin,
        sigmaData(listData),
        type,
        cpData(listData),
        cpkData(listData)
      ); //return object data ;

      if (data.role.length > 0) {
        return (
          <>
            <Row style={{ textAlign: "left" }} className="mb-3">
              <Col sm={3}>Analyzing Result : </Col>
              <Col sm={9}>
                {data.role.map((value, index) => {
                  return (
                    <Row key={index}>
                      <Col>
                        <Row>
                          <Col>{value}</Col>
                        </Row>
                      </Col>
                    </Row>
                  );
                })}
              </Col>
            </Row>

            {data.category.map((value, index) => {
              return (
                <div key={index} className="mb-3">
                  <Row style={{ textAlign: "left" }}>
                    <Col>
                      <BsDiamondFill /> {value.title}
                    </Col>
                  </Row>

                  {value.item.map((value, index) => {
                    return (
                      <Row style={{ textAlign: "left" }} key={index}>
                        <Col>
                          <div style={{ marginLeft: 30 }}>
                            <RiStopMiniLine />
                            {value}
                          </div>
                        </Col>
                      </Row>
                    );
                  })}
                </div>
              );
            })}
          </>
        );
      } else {
        return (
          <Row>
            <Col>Everything is OK</Col>
          </Row>
        );
      }
    } else if (listData.length > 1 && listData.length < 24) {
      return (
        <>
          <Spinner animation="grow" variant="primary" />
          <Spinner animation="grow" variant="secondary" />
          <Spinner animation="grow" variant="success" />
          <Spinner animation="grow" variant="danger" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="info" />
        </>
      );
    }
  };

  const handleReset = () => {
    setProduct("");
    setLine("");
    setMachine("");
    setPartName("");
    setPartNumber("");
    setRemark("");
    setItemCheck("");
    setType("");
    setSigma("");
    setStandard("");
    setStandardMax("");
    setStandardMin("");
    setInputData("");
    setListData([]);
  };

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/capabilityList");
  };

  const handleSave = (e) => {
    e.preventDefault();
    let data = {
      user_id: userId,
      machine_id: machine,
      part_name: partName,
      part_number: partNumber,
      item_check: itemCheck,
      type: type,
      sigma: sigma,
      standard: standard,
      standard_max: standardMax,
      standard_min: standardMin,
      description: remark,
      data: listData,
    };
    if (!updateMode) {
      axios
        .post(createCapabilityApi, data)
        .then((response) => {
          handleReset();
          setMessage("Data Berhasil di Input");
          setShowModalAlert(true);
        })
        .then((error) => console.log(error));
    } else {
      data = { ...data, id: id };
      axios.patch(updateCapabilityApi, data).then((response) => {
        setMessage("Data Berhasil di Update");
        setShowModalAlert(true);
      });
    }
  };

  const doubleStandardDisabled = () => {
    if (type === DOUBLE_STANDARD) {
      if (updateMode) {
        if (userId === userIdDataView) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    }
    return true;
  };

  const singleStandardDisabled = () => {
    if (type !== DOUBLE_STANDARD && type !== "") {
      if (updateMode) {
        if (userId === userIdDataView) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="capabilityFormContainer">
        <div className="capabilityForm">
          <Form onSubmit={handleSave}>
            {updateMode
              ? userId === userIdDataView
                ? listData.length > 0 && (
                    <Row className="mb-3">
                      <Col style={{ textAlign: "right" }}>
                        <Button type="submit" style={{ marginRight: 5 }}>
                          {updateMode ? "Update" : "Save"}
                        </Button>
                        {updateMode ? (
                          <Button
                            type="button"
                            variant="success"
                            onClick={handleBack}
                          >
                            Back
                          </Button>
                        ) : (
                          <Button type="button" onClick={handleReset}>
                            Clear
                          </Button>
                        )}
                      </Col>
                    </Row>
                  )
                : ""
              : listData.length > 0 && (
                  <Row className="mb-3">
                    <Col style={{ textAlign: "right" }}>
                      <Button type="submit" style={{ marginRight: 5 }}>
                        {updateMode ? "Update" : "Save"}
                      </Button>
                      {updateMode ? (
                        <Button
                          type="button"
                          variant="success"
                          onClick={handleBack}
                        >
                          Back
                        </Button>
                      ) : (
                        <Button type="button" onClick={handleReset}>
                          Clear
                        </Button>
                      )}
                    </Col>
                  </Row>
                )}

            <TitleSection
              title="FORM CAPABILITY"
              icon={<VscGraphLine style={{ marginRight: 5 }} />}
            />
            <Row className="mb-3" style={{ textAlign: "left" }}>
              <Form.Group as={Col}>
                <Form.Label>Select Product</Form.Label>
                <Form.Select
                  value={product}
                  onChange={handleSetProduct}
                  required
                  disabled={
                    updateMode
                      ? userId === userIdDataView
                        ? false
                        : true
                      : false
                  }
                >
                  <option value={""} disabled>
                    Open This
                  </option>
                  {productOption()}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Select Line</Form.Label>
                <Form.Select
                  value={line}
                  onChange={handleSetLine}
                  required
                  disabled={
                    updateMode
                      ? userId === userIdDataView
                        ? false
                        : true
                      : false
                  }
                >
                  <option value={""} disabled>
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
                  disabled={
                    updateMode
                      ? userId === userIdDataView
                        ? false
                        : true
                      : false
                  }
                >
                  <option value={""} disabled>
                    Open This
                  </option>
                  {machineOption()}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Part Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Part Name"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  disabled={
                    updateMode
                      ? userId === userIdDataView
                        ? false
                        : true
                      : false
                  }
                />
              </Form.Group>
            </Row>
            <Row className="mb-3" style={{ textAlign: "left" }}>
              <Form.Group as={Col}>
                <Form.Label>Part Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Part Number"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  disabled={
                    updateMode
                      ? userId === userIdDataView
                        ? false
                        : true
                      : false
                  }
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Item Check</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Item Check"
                  value={itemCheck}
                  onChange={(e) => setItemCheck(e.target.value)}
                  disabled={
                    updateMode
                      ? userId === userIdDataView
                        ? false
                        : true
                      : false
                  }
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Select Type</Form.Label>
                <Form.Select
                  value={type}
                  onChange={handleSetType}
                  required
                  disabled={
                    updateMode
                      ? userId === userIdDataView
                        ? false
                        : true
                      : false
                  }
                >
                  <option value={""} disabled>
                    Open This
                  </option>
                  <option value={SINGLE_STANDARD_MAX}> 1 Batasan Max</option>
                  <option value={SINGLE_STANDARD_MIN}> 1 Batasan Min</option>
                  <option value={DOUBLE_STANDARD}> 2 Batasan</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Sigma</Form.Label>
                <Form.Select
                  value={sigma}
                  onChange={(e) => setSigma(e.target.value)}
                  required
                  disabled={
                    updateMode
                      ? userId === userIdDataView
                        ? false
                        : true
                      : false
                  }
                >
                  <option value={""} disabled>
                    Open This
                  </option>
                  <option value={THREE_SIGMA}> 3 Sigma</option>
                  <option value={FOUR_SIGMA}> 4 Sigma</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Row className="mb-3" style={{ textAlign: "left" }}>
              <Form.Group as={Col}>
                <Form.Label> Standard Minimum</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Standard Minumum"
                  value={standardMin}
                  onChange={(e) => setStandardMin(e.target.value)}
                  required={type === DOUBLE_STANDARD ? true : false}
                  disabled={doubleStandardDisabled()}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label> Standard Maximum</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Standard Maximum"
                  value={standardMax}
                  onChange={(e) => setStandardMax(e.target.value)}
                  required={type === DOUBLE_STANDARD ? true : false}
                  disabled={doubleStandardDisabled()}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label> Standard</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Standard"
                  value={standard}
                  onChange={(e) => setStandard(e.target.value)}
                  required={
                    type !== DOUBLE_STANDARD && type !== "" ? true : false
                  }
                  disabled={singleStandardDisabled()}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Remark</Form.Label>
                <Form.Control
                  as="textarea"
                  style={{ height: 100 }}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  disabled={
                    updateMode
                      ? userId === userIdDataView
                        ? false
                        : true
                      : false
                  }
                ></Form.Control>
              </Form.Group>
            </Row>
          </Form>
        </div>
      </div>
      <div className="capabilityFormContainer">
        <Row>
          <Col sm={4}>
            <div className="capabilityForm">
              <TitleSection
                title="Data Input"
                icon={<VscGraphLine style={{ marginRight: 5 }} />}
              />
              {updateMode ? (
                userId === userIdDataView ? (
                  <Form onSubmit={handleAddData}>
                    <Row>
                      <Col sm={9}>
                        <Form.Control
                          type="number"
                          placeholder="Enter Value"
                          value={inputData}
                          onChange={(e) => setInputData(e.target.value)}
                          lang="en"
                          step={".001"}
                          required
                        />
                      </Col>
                      <Col sm={3} style={{ textAlign: "right" }}>
                        <Button type="submit">ADD</Button>
                      </Col>
                    </Row>
                  </Form>
                ) : (
                  ""
                )
              ) : (
                <Form onSubmit={handleAddData}>
                  <Row>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        placeholder="Enter Value"
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        lang="en"
                        step={".001"}
                        required
                      />
                    </Col>
                    <Col sm={3} style={{ textAlign: "right" }}>
                      <Button type="submit">ADD</Button>
                    </Col>
                  </Row>
                </Form>
              )}

              <div>
                {listData.length > 0 && (
                  <Table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Data</th>
                        {updateMode ? (
                          userId === userIdDataView ? (
                            <th>Action</th>
                          ) : (
                            ""
                          )
                        ) : (
                          <th>Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {listData.map((value, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{value.data}</td>
                            {updateMode ? (
                              userId === userIdDataView ? (
                                <td>
                                  <Button
                                    id={index}
                                    type="button"
                                    size="sm"
                                    onClick={handleDeleteData}
                                  >
                                    Delete
                                  </Button>
                                </td>
                              ) : (
                                ""
                              )
                            ) : (
                              <td>
                                <Button
                                  id={index}
                                  type="button"
                                  size="sm"
                                  onClick={handleDeleteData}
                                >
                                  Delete
                                </Button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </div>
            </div>
          </Col>
          <Col sm={8}>
            <div className="capabilityForm">
              <TitleSection
                title="Graph"
                icon={<VscGraphLine style={{ marginRight: 5 }} />}
              />
              <Tabs
                id="tabs-graph"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
              >
                <Tab eventKey={"graph-capability-1"} title="Graph Line">
                  <GraphCapabilityLine
                    standardMax={standardMax}
                    standardMin={standardMin}
                    standard={standard}
                    sigma={sigmaData(listData)}
                    type={type}
                    listData={listData}
                    actionValue={actionValue}
                  />
                </Tab>
                <Tab eventKey={"graph-capability-2"} title="Graph Histogram">
                  <GraphCapabilityDistribution
                    standardMax={standardMax}
                    standardMin={standardMin}
                    standard={standard}
                    sigma={sigmaData(listData)}
                    type={type}
                    listData={listData}
                    actionValue={actionValue}
                    average={averageData(listData)}
                  />
                </Tab>
                <Tab
                  eventKey={"graph-capability-3"}
                  title="Graph Normal Distribution"
                >
                  <GraphNormalDistribution
                    standardMax={standardMax}
                    standardMin={standardMin}
                    standard={standard}
                    sigma={sigmaData(listData)}
                    type={type}
                    listData={listData}
                    actionValue={actionValue}
                    average={averageData(listData)}
                  />
                </Tab>
              </Tabs>
            </div>
            <div className="capabilityForm">
              <TitleSection
                title="Summary"
                icon={<VscGraphLine style={{ marginRight: 5 }} />}
              />
              <div>
                <Row className="mb-3">
                  <Col>Average : {averageData(listData)} </Col>
                  <Col>Sigma : {sigmaData(listData)}</Col>
                  <Col>Cp : {cpData(listData)}</Col>
                  <Col>Cpk : {cpkData(listData)}</Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    Judgment :{" "}
                    {judgement(type, cpData(listData), cpkData(listData))}
                  </Col>
                </Row>
              </div>
              <TitleSection
                title="Charts Analyzer"
                icon={<VscGraphLine style={{ marginRight: 5 }} />}
              />
              {recomendationHandle()}
            </div>
          </Col>
        </Row>
        <ModalAlert
          show={showModalAlert}
          onHandleClose={(e) => {
            setShowModalAlert(e);
          }}
          message={message}
        />
      </div>
    </>
  );
}

export default CapabilityForm;
