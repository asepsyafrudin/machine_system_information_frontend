import React, { useEffect, useState } from "react";
import "./capabilityForm.css";
import TitleSection from "../TitleSection";
import { VscGraphLine } from "react-icons/vsc";
import { Button, Col, Form, Row, Tab, Table, Tabs } from "react-bootstrap";
import axios from "axios";
import {
  getAllLineApi,
  getAllMachineApi,
  getAllProductApi,
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

function CapabilityForm() {
  const [tableProduct, setTableProduct] = useState("");
  const [tableLine, setTableLine] = useState("");
  const [tableMachine, setTableMachine] = useState("");
  const [product, setProduct] = useState("");
  const [line, setLine] = useState("");
  const [machine, setMachine] = useState("");
  const [itemCheck, setItemCheck] = useState("");
  const [type, setType] = useState("");
  const [sigma, setSigma] = useState(0);
  const [standard, setStandard] = useState("");
  const [standardMax, setStandardMax] = useState("");
  const [standardMin, setStandardMin] = useState("");
  const [key, setKey] = useState("graph-capability-1");
  const [inputData, setInputData] = useState("");
  const [listData, setListData] = useState([]);
  const [actionValue, setActionValue] = useState(0);

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
  }, []);

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
    console.log(listData.length);
    const data = {
      no: listData.length + 1,
      data: inputData,
    };
    setListData([...listData, data]);
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

    if (listData.length > 0) {
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

    if (listData.length > 0) {
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

    if (listData.length > 0) {
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

  return (
    <>
      <div className="capabilityFormContainer">
        <div className="capabilityForm">
          <TitleSection
            title="FORM CAPABILITY"
            icon={<VscGraphLine style={{ marginRight: 5 }} />}
          />
          <Form>
            <Row className="mb-3" style={{ textAlign: "left" }}>
              <Form.Group as={Col}>
                <Form.Label>Select Product</Form.Label>
                <Form.Select
                  value={product}
                  onChange={handleSetProduct}
                  required
                >
                  <option value={""} disabled>
                    Open This
                  </option>
                  {productOption()}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Select Line</Form.Label>
                <Form.Select value={line} onChange={handleSetLine} required>
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
                >
                  <option value={""} disabled>
                    Open This
                  </option>
                  {machineOption()}
                </Form.Select>
              </Form.Group>
            </Row>
            <Row className="mb-3" style={{ textAlign: "left" }}>
              <Form.Group as={Col}>
                <Form.Label>Item Check</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Item Check"
                  value={itemCheck}
                  onChange={(e) => setItemCheck(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Select Type</Form.Label>
                <Form.Select value={type} onChange={handleSetType} required>
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
                <Form.Label> Standard Maximum</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Standard Maximum"
                  value={standardMax}
                  onChange={(e) => setStandardMax(e.target.value)}
                  required={type === DOUBLE_STANDARD ? true : false}
                  disabled={type === DOUBLE_STANDARD ? false : true}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label> Standard Minimum</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Standard Minumum"
                  value={standardMin}
                  onChange={(e) => setStandardMin(e.target.value)}
                  required={type === DOUBLE_STANDARD ? true : false}
                  disabled={type === DOUBLE_STANDARD ? false : true}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label> Standard</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Standard"
                  value={standard}
                  onChange={(e) => setStandard(e.target.value)}
                  required={type !== DOUBLE_STANDARD ? true : false}
                  disabled={type !== DOUBLE_STANDARD ? false : true}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Col style={{ textAlign: "right" }}>
                <Button type="submit" style={{ marginRight: 5 }}>
                  Submit
                </Button>
                <Button type="button">Clear</Button>
              </Col>
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
              <Form onSubmit={handleAddData}>
                <Row>
                  <Col sm={9}>
                    <Form.Control
                      type="number"
                      placeholder="Enter Value"
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      lang="en"
                      required
                    />
                  </Col>
                  <Col sm={3} style={{ textAlign: "right" }}>
                    <Button type="submit">ADD</Button>
                  </Col>
                </Row>
              </Form>
              <div>
                {listData.length > 0 && (
                  <Table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Data</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listData.map((value, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{value.data}</td>
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
                    sigma={sigma}
                    type={type}
                    listData={listData}
                    actionValue={actionValue}
                  />
                </Tab>
                <Tab
                  eventKey={"graph-capability-2"}
                  title="Graph Normal Distribution"
                >
                  <GraphCapabilityDistribution />
                </Tab>
              </Tabs>
            </div>
            <div className="capabilityForm">
              <TitleSection
                title="Summary"
                icon={<VscGraphLine style={{ marginRight: 5 }} />}
              />
              <div>
                <Row>
                  <Col>Average : {averageData(listData)} </Col>
                  <Col>Sigma : {sigmaData(listData)}</Col>
                  <Col>Cp : {cpData(listData)}</Col>
                  <Col>Cpk : {cpkData(listData)}</Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default CapabilityForm;
