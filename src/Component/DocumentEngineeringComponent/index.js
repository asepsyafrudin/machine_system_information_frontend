import React, { useEffect, useRef, useState } from "react";
import TitleSection from "../TitleSection";

import {
  Alert,
  Button,
  Col,
  Form,
  ProgressBar,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import axios from "axios";
import {
  approvalManagerFileReportApi,
  deleteFileByIdApi,
  getAllDocumentByPage,
  getAllLineApi,
  getAllMachineApi,
  getAllProductApi,
  getDocumentByUserIdAndPageApi,
  getProjectByUserApi,
  searchDocumentForDashboardApi,
  updateDocumentApi,
} from "../../Config/API";

import { GoSmiley } from "react-icons/go";

import { convertFileName, convertFileType } from "../../Config/fileType";
import { IoMdDocument } from "react-icons/io";

import { Link } from "react-router-dom";

import { BsBack } from "react-icons/bs";

function DocumentEngineeringComponent(props) {
  const [position, setPosition] = useState("");
  const { actionStateValue } = props;
  const refVidoe = useRef();
  const [documentTitle, setDocumentTitle] = useState("");
  const [document, setDocument] = useState([]); //file will be transfered show
  const [file, setFile] = useState([]); //file stage
  const [description, setDescription] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [tableProduct, setTableProduct] = useState("");
  const [tableLine, setTableLine] = useState("");
  const [tableMachine, setTableMachine] = useState("");
  const [product, setProduct] = useState("");
  const [line, setLine] = useState("");
  const [machine, setMachine] = useState("");
  const [search, setSearch] = useState("");
  const [tableDocument, setTableDocument] = useState([]);
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState("");
  const [alert, setAlert] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileCurrent, setFileCurrent] = useState([]);
  const [userPositon, setUserPosition] = useState("");
  const [fileType, setFileType] = useState("Engineering Report");
  const [message, setMessage] = useState("");
  const [percentProgress, setPercentProgress] = useState(0);
  const [totalPageData, setTotalPageData] = useState(0);
  const [numberStart, setNumberStart] = useState(1);
  const [id, setId] = useState("");
  const [showModalAlert, setShowModalAlert] = useState(false);
  const [tableProject, setTableProject] = useState([]);
  const [project, setProject] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(getAllProductApi, {
        signal: controller.signal,
      })
      .then((response) => {
        setTableProduct(response.data.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(getAllLineApi, {
        signal: controller.signal,
      })
      .then((response) => {
        setTableLine(response.data.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(getAllMachineApi, {
        signal: controller.signal,
      })
      .then((response) => {
        setTableMachine(response.data.data);
      });

    axios
      .get(getProjectByUserApi(userId), {
        signal: controller.signal,
      })
      .then((response) => {
        setTableProject(response.data.data);
      })
      .catch((error) => console.log(error));

    if (userId) {
      if (search) {
        axios
          .get(searchDocumentForDashboardApi(search, page, userId), {
            signal: controller.signal,
          })
          .then((response) => {
            setTableDocument(response.data.data);
            setNumberStart(response.data.numberStart);
            setTotalPageData(response.data.totalPageData);
          })
          .catch((error) => console.log(error));
      } else {
        if (userPositon === "Administrator") {
          axios
            .get(getAllDocumentByPage(page), {
              signal: controller.signal,
            })
            .then((response) => {
              setTableDocument(response.data.data);
              setNumberStart(response.data.numberStart);
              setTotalPageData(response.data.totalPageData);
            })
            .catch((error) => console.log(error));
        } else {
          axios
            .get(getDocumentByUserIdAndPageApi(userId, page), {
              signal: controller.signal,
            })
            .then((response) => {
              setTableDocument(response.data.data);
              setNumberStart(response.data.numberStart);
              setTotalPageData(response.data.totalPageData);
            })
            .catch((error) => console.log(error));
        }
      }
    }

    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user.id);
    setUserPosition(user.position);
  }, [actionStateValue, search, userId, userPositon, page]);

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

  const projectOption = () => {
    let option = [];

    if (tableProject.length > 0) {
      for (let index = 0; index < tableProject.length; index++) {
        option.push(
          <option key={index} value={tableProject[index].id}>
            {tableProject[index].project_name}
          </option>
        );
      }
    }

    return <>{option}</>;
  };

  const handleResetForm = () => {
    setDescription("");
    refVidoe.current.value = "";
    setDocumentTitle("");
    setProduct("");
    setLine("");
    setMachine("");
    setUpdateMode(false);
    setDocument([]);

    setFileType("");
    setProject("");
    setId("");
    setFileCurrent([]);
    setLoading(false);
  };

  const handleMultipleDocument = (e) => {
    const documentArray = [...e.target.files];
    setDocument(documentArray);
    setFile(e.target.files);
  };

  const handleRegisterDocument = (e) => {
    e.preventDefault();
    if (file.length <= 10) {
      let formData = new FormData();
      formData.append("title", documentTitle);
      formData.append("machine_id", machine);
      formData.append("product_id", product);
      formData.append("user_id", userId);
      formData.append("file_type", fileType);
      formData.append("description", description);
      formData.append("project_id", project);
      for (let i = 0; i < file.length; i++) {
        formData.append("file", file[i]);
      }
      if (!updateMode) {
        formData.append("status", "Active");
        setLoading(true);
        const onUploadProgress = (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          if (percent < 100) {
            setPercentProgress(percent);
            // console.log(`${loaded} bytes of ${total} bytes. ${percent}%`);
          }
        };
        axios
          .post(approvalManagerFileReportApi, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
          })
          .then((response) => {
            setMessage(
              "Upload File Success and we have sent email to your manager!"
            );
            setNotifSuccess(true);
            setAlert(false);
            handleResetForm();
            setLoading(false);
            setPercentProgress(0);
          })
          .catch((error) => {
            console.log(error);
            setMessage("Hubungi developer");
            setAlert(true);
          });
      } else {
        formData.append("id", id);
        setLoading(true);
        const onUploadProgress = (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          if (percent < 100) {
            setPercentProgress(percent);
            // console.log(`${loaded} bytes of ${total} bytes. ${percent}%`);
          }
        };
        axios
          .patch(updateDocumentApi, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
          })
          .then((response) => {
            setMessage("Upload File Success!!");
            setNotifSuccess(true);
            setAlert(false);
            handleResetForm();
            setLoading(false);
            setPercentProgress(0);
          })
          .catch((error) => {
            console.log(error);
            setMessage("Hubungi developer");
            setAlert(true);
          });
      }
    } else {
      setMessage("File Terlalu Banyak!!!");
      alert(true);
    }
  };

  const loadingPostData = (loadingData) => {
    let loading = [];
    if (loadingData) {
      loading.push(
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
          key={new Date()}
        />
      );
    }
    return loading;
  };

  const buttonName = (loadingData) => {
    let name = "";
    if (loadingData) {
      name = "Loading...";
    } else if (updateMode) {
      name = "Update";
    } else {
      name = "Register";
    }

    return name;
  };

  // const maxPagesShow = 3;
  // const handleDelete = (e) => {
  //   const confirm = window.confirm("File Document Akan di Hapus?");
  //   if (confirm) {
  //     axios
  //       .delete(deleteDocumentApi(e.target.id))
  //       .then((response) => {
  //         setMessage("Document Telah Terhapus!!!");
  //         setShowModalAlert(true);
  //       })
  //       .catch((error) => console.log(error));
  //   }
  // };

  // const changeStatus = (e) => {
  //   const id = e.target.id;
  //   const documentEdit = tableDocument.find((value) => {
  //     return value.id === id;
  //   });
  //   let status = "";
  //   if (documentEdit.status === "Active") {
  //     status = "Non Active";
  //   } else {
  //     status = "Active";
  //   }
  //   const data = {
  //     id: id,
  //     status: status,
  //   };
  //   axios.patch(changeStatusDocumentApi, data).then((response) => {
  //     setMessage("Status Data Telah Berganti");
  //     setShowModalAlert(true);
  //     handleResetForm();
  //   });
  // };

  // const handleEdit = (e) => {
  //   setUpdateMode(true);
  //   const id = e.target.id;
  //   const documentEdit = tableDocument.find((value) => {
  //     return value.id === id;
  //   });
  //   if (documentEdit) {
  //     setDocumentTitle(documentEdit.title);
  //     setProduct(documentEdit.product_id);
  //     setLine(documentEdit.line_id);
  //     setMachine(documentEdit.machine_id);
  //     setDescription(documentEdit.description);
  //     setFileCurrent(documentEdit.file);
  //     setFileType(documentEdit.file_type);
  //     setProject(documentEdit.project_id);
  //     setId(id);
  //   }
  // };

  const handleDeleteFile = (e) => {
    const id = e.target.id;
    const confirm = window.confirm("Apakah file Akan di Hapus?");
    if (confirm) {
      axios
        .delete(deleteFileByIdApi(id))
        .then((response) => {
          setMessage("File Telah Terhapus!!!");
          setShowModalAlert(true);
          const fileData = fileCurrent.find(
            (value) => value.id === parseInt(id)
          );
          let arrayNew = fileCurrent.filter((value) => value !== fileData);
          setFileCurrent(arrayNew); // after delete file
          handleResetForm();
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <div className="capabilityFormContainer">
      <div className="capabilityForm">
        <div style={{ textAlign: "left", marginBottom: 20 }}>
          <Link
            to={position === "Administrator" ? "/adminmenu" : "/dashboardUsers"}
          >
            <Button>
              <BsBack style={{ pointerEvents: "none", marginRight: 5 }} />
              Back to Dashboard User
            </Button>
          </Link>
        </div>
        <TitleSection
          title="Create Document Engineering Report"
          icon={<IoMdDocument style={{ marginRight: 5 }} />}
        />
        <div className="registerProductFormContainer">
          <Form onSubmit={handleRegisterDocument}>
            <Row className="mb-3">
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
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="Enter Title Document"
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>File Type</Form.Label>
                <Form.Select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  required
                >
                  <option value={"Engineering Report"}>
                    Engineering Report
                  </option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Input File (support multiple file)</Form.Label>
                <Form.Control
                  type="file"
                  placeholder="Enter JPG, PNG or PDF File"
                  onChange={handleMultipleDocument}
                  ref={refVidoe}
                  multiple
                />
                *forbidden to use symbol in filenames
              </Form.Group>
            </Row>
            <Row>
              <Col>
                {document.length > 0 && (
                  <Table striped hover bordered size="sm">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>file name</th>
                        <th>file type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {document.map((value, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{convertFileName(value.name)}</td>
                            <td>{convertFileType(value.type)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                {fileCurrent.length > 0 && (
                  <div>
                    Current File
                    <Table striped hover bordered size="sm">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>file name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fileCurrent.map((value, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{convertFileName(value.name)}</td>
                              <td>
                                <Button
                                  type="button"
                                  id={value.id}
                                  onClick={handleDeleteFile}
                                >
                                  Delete file
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={4}>
                <Form.Group as={Col}>
                  <Form.Label>Link To Project (Optional)</Form.Label>
                  <Form.Select
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                  >
                    <option value={""}>Open This</option>
                    {projectOption()}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={8}>
                <Form.Group as={Col}>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    style={{ height: 100 }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col></Col>
              <Col></Col>
              <Col style={{ textAlign: "right" }}>
                <Button type="submit" style={{ marginRight: 5 }}>
                  {loadingPostData(loading)}
                  {buttonName(loading)}
                </Button>
                <Button type="button" onClick={handleResetForm}>
                  clear
                </Button>{" "}
              </Col>
            </Row>
          </Form>
          <div style={{ marginTop: 5 }}>
            {percentProgress > 0 && (
              <ProgressBar
                animated
                now={percentProgress}
                label={`${percentProgress}%`}
              />
            )}
          </div>
          <div style={{ marginTop: 5 }}>
            <Alert
              show={alert}
              variant="danger"
              onClose={() => setAlert(false)}
              dismissible
            >
              {message}
            </Alert>
          </div>
          <div style={{ marginTop: 5 }}>
            <Alert
              show={notifSuccess}
              variant="success"
              onClose={() => setNotifSuccess(false)}
              dismissible
            >
              {message}
              <GoSmiley style={{ marginLeft: 10 }} />
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentEngineeringComponent;
