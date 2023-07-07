import React, { useEffect, useRef, useState } from "react";
import TitleSection from "../TitleSection";
import { VscGraphLine } from "react-icons/vsc";
import {
  Badge,
  Button,
  Col,
  FloatingLabel,
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
  deleteCapabilityApi,
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
import GraphNormalDistribution from "../GraphNormalDistribution";
import { SlEmotsmile } from "react-icons/sl";
import { FaRegSadCry } from "react-icons/fa";
import RECOMENDATION from "../../Config/recomendationOfCapability";
import { BsDiamondFill } from "react-icons/bs";
import { RiStopMiniLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import ModalAlert from "../ModalAlert";
import ModalConfirm from "../ModalConfirm";
import { ExcelRenderer } from "react-excel-renderer";
import { HiDownload } from "react-icons/hi";
import { BiExport, BiReset } from "react-icons/bi";
import CapabilityFormatExcel from "../../Asset/File/Format Excel Import Capability Comparison.xlsx";
import GraphDistribution from "../GraphDistribution";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

function CapabilityComparisonForm() {
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
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const fileRef = useRef(null);
  const [inputData2, setInputData2] = useState("");
  const [listData2, setListData2] = useState([]);

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

        if (result[0].data1.length > 0) {
          setListData(result[0].data1);
        }
        if (result[0].data2.length > 0) {
          setListData2(result[0].data2);
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

  const handleAddData2 = (e) => {
    e.preventDefault();
    const data = {
      no: listData2.length + 1,
      data: inputData2,
    };
    setListData2((prev) => [...prev, data]);
    setInputData2("");
  };

  const handleChangeFile = (event) => {
    const file = event.target.files[0];
    ExcelRenderer(file, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        setListData([]);
        const rows = response.rows;
        if (rows.length > 1) {
          for (let index = 0; index < rows.length - 1; index++) {
            let data = {
              no: listData.length + 1,
              data: rows[index + 1][1],
            };
            setListData((prev) => [...prev, data]);
          }

          for (let index = 0; index < rows.length - 1; index++) {
            let data = {
              no: listData.length + 1,
              data: rows[index + 1][2],
            };
            setListData2((prev) => [...prev, data]);
          }
        }
      }
    });
  };

  const handleDeleteData = (e) => {
    const index = e.target.id;
    let array = listData;
    array.splice(index, 1);
    setListData(array);
    setActionValue(actionValue + 1);
  };

  const handleDeleteData2 = (e) => {
    const index = e.target.id;
    let array = listData2;
    array.splice(index, 1);
    setListData2(array);
    setActionValue(actionValue + 1);
  };

  const averageData = (data) => {
    let average = 0;
    if (data.length > 0) {
      let value = 0;
      for (let index = 0; index < data.length; index++) {
        value = value + parseFloat(data[index].data);
      }
      average = value / data.length;
      let number = (Math.round(average * 1000) / 1000).toFixed(3);
      return number;
    }
    return average;
  };

  const sigmaData = (data) => {
    let sigma = 0;
    let average = averageData(data);

    if (data.length > 1) {
      let sum = 0;
      for (let index = 0; index < data.length; index++) {
        sum += Math.pow(parseFloat(data[index].data) - average, 2);
      }

      sigma = Math.sqrt(sum / (data.length - 1));
      let number = (Math.round(sigma * 1000) / 1000).toFixed(3);
      return number;
    }
    return sigma;
  };

  const cpData = (data) => {
    let cp = 0;
    let sigmaValue = sigmaData(data);
    let average = averageData(data);

    if (data.length > 1) {
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

  const cpkData = (data) => {
    let cpk = 0;
    let sigmaValue = sigmaData(data);
    let average = averageData(data);
    let centerData = (parseFloat(standardMax) + parseFloat(standardMin)) / 2;

    if (data.length > 1) {
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
      } else {
        return (
          <>
            <Badge bg="danger" style={{ fontSize: 15 }}>
              <FaRegSadCry style={{ marginRight: 5 }} /> No Good
            </Badge>
          </>
        );
      }
    }
  };

  const recomendationHandle = (data) => {
    if (data.length >= 30) {
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
              <Col sm={3}>Result : </Col>
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
    } else if (listData.length > 1 && listData.length < 30) {
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
    setListData2([]);
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
      data1: listData,
      data2: listData2,
      status: "compare",
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

  const handleConfirm = (confirm) => {
    if (confirm) {
      axios.delete(deleteCapabilityApi(id)).then((response) => {
        setMessage("Data berhasil di delete");
        setShowModalConfirm(false);
        setShowModalAlert(true);
      });
    }
  };

  const handleDeleteCapability = () => {
    setMessage("Do you want to delete it?");
    setShowModalConfirm(true);
  };

  const handleResetInputData = () => {
    setListData([]);
    setListData2([]);
    fileRef.current.value = "";
  };

  const handleExportData = () => {
    const dataExport = [];
    const totalData = Math.max(listData.length, listData2.length);
    for (let index = 0; index < totalData; index++) {
      dataExport.push({
        no: index + 1,
        data_before: listData[index].data,
        data_after: listData2[index].data,
      });
    }

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const ws1 = XLSX.utils.json_to_sheet(dataExport);
    const wb1 = { Sheets: { data: ws1 }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb1, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "data-before" + fileExtension);
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
                          <>
                            <Button
                              type="button"
                              variant="success"
                              onClick={handleBack}
                              style={{ marginRight: 5 }}
                            >
                              Back
                            </Button>
                            <Button
                              type="button"
                              variant="danger"
                              onClick={handleDeleteCapability}
                            >
                              Delete
                            </Button>
                          </>
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
                  <option value={SINGLE_STANDARD_MAX}> 1 Limit Maximum</option>
                  <option value={SINGLE_STANDARD_MIN}>
                    {" "}
                    1 Limit Mininimum
                  </option>
                  <option value={DOUBLE_STANDARD}> 2 Limit</option>
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
                <Form.Label>Purpose</Form.Label>
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
              <Row>
                <Col sm={6}>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    id="file"
                    name="file"
                    className="inputfile"
                    onChange={handleChangeFile}
                    ref={fileRef}
                  />
                </Col>
                <Col sm={6}>
                  <a
                    href={CapabilityFormatExcel}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button style={{ marginRight: 5 }} title="Download Format">
                      <HiDownload style={{ pointerEvents: "none" }} />
                    </Button>
                  </a>
                  <Button
                    title="Reset"
                    onClick={handleResetInputData}
                    style={{ marginRight: 5 }}
                  >
                    <BiReset style={{ pointerEvents: "none" }} />
                  </Button>
                  <Button title="Export Data" onClick={handleExportData}>
                    <BiExport style={{ pointerEvents: "none" }} />
                  </Button>
                </Col>
              </Row>
              {updateMode ? (
                userId === userIdDataView ? (
                  <Row>
                    <Col sm={6}>
                      <Form onSubmit={handleAddData}>
                        <Row>
                          <Col sm={8}>
                            <FloatingLabel
                              label="Data Before"
                              controlId="floatingDataBefore"
                            >
                              <Form.Control
                                type="number"
                                placeholder="Enter Value"
                                value={inputData}
                                onChange={(e) => setInputData(e.target.value)}
                                lang="en"
                                step={".001"}
                                required
                                size="sm"
                              />
                            </FloatingLabel>
                          </Col>
                          <Col sm={3} style={{ textAlign: "right" }}>
                            <Row>
                              <Col></Col>
                            </Row>
                            <Row>
                              <Col>
                                <Button type="submit">ADD</Button>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Form>
                    </Col>
                    <Col sm={6}>
                      <Form onSubmit={handleAddData2}>
                        <Row>
                          <Col sm={8}>
                            <FloatingLabel
                              label="Data After"
                              controlId="floatingDataBefore"
                            >
                              <Form.Control
                                type="number"
                                placeholder="Enter Value"
                                value={inputData2}
                                onChange={(e) => setInputData2(e.target.value)}
                                lang="en"
                                step={".001"}
                                required
                              />
                            </FloatingLabel>
                          </Col>
                          <Col sm={3} style={{ textAlign: "right" }}>
                            <Button type="submit">ADD</Button>
                          </Col>
                        </Row>
                      </Form>
                    </Col>
                  </Row>
                ) : (
                  ""
                )
              ) : (
                <Row>
                  <Col sm={6}>
                    <Form onSubmit={handleAddData}>
                      <Row>
                        <Col sm={8}>
                          <FloatingLabel
                            label="Data Before"
                            controlId="floatingDataBefore"
                          >
                            <Form.Control
                              type="number"
                              placeholder="Enter Value"
                              value={inputData}
                              onChange={(e) => setInputData(e.target.value)}
                              lang="en"
                              step={".001"}
                              required
                              size="sm"
                            />
                          </FloatingLabel>
                        </Col>
                        <Col sm={3} style={{ textAlign: "right" }}>
                          <Row>
                            <Col></Col>
                          </Row>
                          <Row>
                            <Col>
                              <Button type="submit">ADD</Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Col sm={6}>
                    <Form onSubmit={handleAddData2}>
                      <Row>
                        <Col sm={8}>
                          <FloatingLabel
                            label="Data After"
                            controlId="floatingDataBefore"
                          >
                            <Form.Control
                              type="number"
                              placeholder="Enter Value"
                              value={inputData2}
                              onChange={(e) => setInputData2(e.target.value)}
                              lang="en"
                              step={".001"}
                              required
                            />
                          </FloatingLabel>
                        </Col>
                        <Col sm={3} style={{ textAlign: "right" }}>
                          <Button type="submit">ADD</Button>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              )}

              <div>
                <Row>
                  <Col sm={6}>
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
                  </Col>
                  <Col sm={6}>
                    {listData2.length > 0 && (
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
                          {listData2.map((value, index) => {
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
                                        onClick={handleDeleteData2}
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
                                      onClick={handleDeleteData2}
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
                  </Col>
                </Row>
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
                    listData2={listData2}
                    actionValue={actionValue}
                    status="compare"
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
                    listData2={listData2}
                    actionValue={actionValue}
                    average={averageData(listData)}
                    average2={averageData(listData2)}
                    sigma2={sigmaData(listData2)}
                    status="compare"
                  />
                </Tab>
                <Tab eventKey={"graph-capability-4"} title="Graph Distribution">
                  <GraphDistribution
                    standardMax={standardMax}
                    standardMin={standardMin}
                    standard={standard}
                    sigma={sigmaData(listData)}
                    sigma2={sigmaData(listData2)}
                    type={type}
                    listData={listData}
                    listData2={listData2}
                    actionValue={actionValue}
                    average={averageData(listData)}
                    average2={averageData(listData2)}
                    status="compare"
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
                <div style={{ textAlign: "center", fontWeight: "bold" }}>
                  Data Before
                </div>
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
                <div style={{ textAlign: "center", fontWeight: "bold" }}>
                  Data After
                </div>
                <Row className="mb-3">
                  <Col>Average : {averageData(listData2)} </Col>
                  <Col>Sigma : {sigmaData(listData2)}</Col>
                  <Col>Cp : {cpData(listData2)}</Col>
                  <Col>Cpk : {cpkData(listData2)}</Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    Judgment :{" "}
                    {judgement(type, cpData(listData2), cpkData(listData2))}
                  </Col>
                </Row>
              </div>
              <TitleSection
                title="Charts Analyzer"
                icon={<VscGraphLine style={{ marginRight: 5 }} />}
              />
              <div style={{ textAlign: "center", fontWeight: "bold" }}>
                Data Before
              </div>
              <div>{recomendationHandle(listData)}</div>
              <div style={{ textAlign: "center", fontWeight: "bold" }}>
                Data After
              </div>
              <div>{recomendationHandle(listData2)}</div>
            </div>
          </Col>
        </Row>
        <ModalAlert
          show={showModalAlert}
          onHandleClose={(e) => {
            setShowModalAlert(e);
          }}
          message={message}
          type="navigate"
        />
        <ModalConfirm
          show={showModalConfirm}
          onHandleClose={(e) => {
            setShowModalConfirm(e);
          }}
          message={message}
          onHandleConfirm={(confirm) => handleConfirm(confirm)}
        />
      </div>
    </>
  );
}

export default CapabilityComparisonForm;
