import React, { Fragment, useEffect, useRef, useState } from "react";
import TitleSection from "../TitleSection";
import moment from "moment";

import {
  Alert,
  Button,
  Col,
  Form,
  InputGroup,
  ProgressBar,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import axios from "axios";
import {
  changeStatusDocumentApi,
  deleteDocumentApi,
  deleteFileByIdApi,
  getAllDocumentByPage,
  getAllLineApi,
  getAllMachineApi,
  getAllProductApi,
  getDocumentByUserIdAndPageApi,
  registerDocumentApi,
  searchDocumentForDashboardApi,
  updateDocumentApi,
} from "../../Config/API";
import { AiOutlineFileSearch } from "react-icons/ai";
import { GoGitCompare, GoSmiley } from "react-icons/go";
import { MdDeleteForever, MdVideoLibrary } from "react-icons/md";
import { convertFileName, convertFileType } from "../../Config/fileType";
import { IoMdDocument } from "react-icons/io";
import PaginationTable from "../Pagination";
import { Link } from "react-router-dom";
import { GrEdit } from "react-icons/gr";
import ModalAlert from "../ModalAlert";

function DocumentRegister(props) {
  const { actionState, actionStateValue } = props;
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
  const [fileType, setFileType] = useState("");
  const [message, setMessage] = useState("");
  const [percentProgress, setPercentProgress] = useState(0);
  const [totalPageData, setTotalPageData] = useState(0);
  const [numberStart, setNumberStart] = useState(1);
  const [id, setId] = useState("");
  const [showModalAlert, setShowModalAlert] = useState(false);

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
    if (userId) {
      if (search) {
        axios
          .get(searchDocumentForDashboardApi(search, page, userId))
          .then((response) => {
            setTableDocument(response.data.data);
            setNumberStart(response.data.numberStart);
            setTotalPageData(response.data.totalPageData);
          })
          .catch((error) => console.log(error));
      } else {
        if (userPositon === "Administrator") {
          axios
            .get(getAllDocumentByPage(page))
            .then((response) => {
              setTableDocument(response.data.data);
              setNumberStart(response.data.numberStart);
              setTotalPageData(response.data.totalPageData);
            })
            .catch((error) => console.log(error));
        } else {
          axios
            .get(getDocumentByUserIdAndPageApi(userId, page))
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

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
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
    actionState(1);
    setFileType("");
    setId("");
    setFileCurrent([]);
    setLoading(false);
  };

  const handleMultipleDocument = (e) => {
    const documentArray = [...e.target.files];
    setDocument(documentArray);
    setFile(e.target.files);
  };

  const handleRegisterVideo = (e) => {
    e.preventDefault();
    if (file.length <= 10) {
      let formData = new FormData();
      formData.append("title", documentTitle);
      formData.append("machine_id", machine);
      formData.append("user_id", userId);
      formData.append("file_type", fileType);
      formData.append("description", description);
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
          .post(registerDocumentApi, formData, {
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

  const maxPagesShow = 3;
  const handleDelete = (e) => {
    const confirm = window.confirm("File Document Akan di Hapus?");
    if (confirm) {
      axios
        .delete(deleteDocumentApi(e.target.id))
        .then((response) => {
          setMessage("Document Telah Terhapus!!!");
          setShowModalAlert(true);
          actionState(1);
        })
        .catch((error) => console.log(error));
    }
  };

  const changeStatus = (e) => {
    const id = e.target.id;
    const documentEdit = tableDocument.find((value) => {
      return value.id === id;
    });
    let status = "";
    if (documentEdit.status === "Active") {
      status = "Non Active";
    } else {
      status = "Active";
    }
    const data = {
      id: id,
      status: status,
    };
    axios.patch(changeStatusDocumentApi, data).then((response) => {
      setMessage("Status Data Telah Berganti");
      setShowModalAlert(true);
      handleResetForm();
      actionState(1);
    });
  };

  const handleEdit = (e) => {
    setUpdateMode(true);
    const id = e.target.id;
    const documentEdit = tableDocument.find((value) => {
      return value.id === id;
    });
    if (documentEdit) {
      setDocumentTitle(documentEdit.title);
      setProduct(documentEdit.product_id);
      setLine(documentEdit.line_id);
      setMachine(documentEdit.machine_id);
      setDescription(documentEdit.description);
      setFileCurrent(documentEdit.file);
      setFileType(documentEdit.file_type);
      setId(id);
    }
  };

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
    <div className="userListContainer">
      <TitleSection
        title="Document Upload Form"
        icon={<IoMdDocument style={{ marginRight: 5 }} />}
      />
      <div className="registerProductFormContainer">
        <Form onSubmit={handleRegisterVideo}>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Select Product</Form.Label>
              <Form.Select value={product} onChange={handleSetProduct} required>
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
                <option value={""} disabled>
                  Open This
                </option>
                <option value={"Engineering Document"}>
                  Engineering Document
                </option>
                <option value={"Engineering Report"}>Engineering Report</option>
                <option value={"Kakotora"}>Kakotora</option>
                <option value={"Update News"}>Update News</option>
                <option value={"Others"}>Others</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Input File (support multiple file)</Form.Label>
              <Form.Control
                type="file"
                accept=".png , .jpeg, .JPEG, .PNG, .pdf, .xlsx , .ppt , .pptx, .doc, .docx"
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
            <Col>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                style={{ height: 100 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
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
      <div className="tableDocument">
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">
            <AiOutlineFileSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search"
            aria-label="Search"
            aria-describedby="basic-addon1"
            value={search}
            onChange={handleSearch}
          />
        </InputGroup>
        <Table
          striped
          hover
          bordered
          size="sm"
          responsive
          style={{ fontSize: 15 }}
        >
          <thead>
            <tr style={{ textAlign: "center", alignItems: "center" }}>
              <th>No</th>
              <th>Document Title</th>
              <th>Product Name</th>
              <th>Line Name</th>
              <th>Machine Name</th>
              <th>Create Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableDocument &&
              tableDocument.map((value, index) => {
                return (
                  <tr key={index}>
                    <td>{index + numberStart}</td>
                    <td>{value.title}</td>
                    <td>{value.product_name}</td>
                    <td>{value.line_name}</td>
                    <td>{value.machine_name}</td>
                    <td>{moment(value.create_date).format("lll")}</td>
                    <td>{value.status}</td>
                    <td>
                      <Button
                        title="Delete"
                        size="sm"
                        style={{ marginRight: 2 }}
                        id={value.id}
                        onClick={handleDelete}
                      >
                        <MdDeleteForever style={{ pointerEvents: "none" }} />
                      </Button>
                      <Button
                        title="Change Status"
                        size="sm"
                        style={{ marginRight: 2 }}
                        variant="warning"
                        id={value.id}
                        onClick={changeStatus}
                      >
                        <GoGitCompare style={{ pointerEvents: "none" }} />
                      </Button>
                      <Button
                        title="Edit"
                        size="sm"
                        style={{ marginRight: 2 }}
                        id={value.id}
                        onClick={handleEdit}
                        variant="success"
                      >
                        <GrEdit style={{ pointerEvents: "none" }} />
                      </Button>
                      <Link to={`/document/${value.id}`}>
                        <Button
                          title="View"
                          size="sm"
                          style={{ marginRight: 2 }}
                          id={value.id}
                          variant="dark"
                        >
                          <MdVideoLibrary style={{ pointerEvents: "none" }} />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
      <div className="paginationTableUser">
        <PaginationTable
          totalPage={totalPageData}
          maxPagesShow={maxPagesShow}
          onChangePage={(e) => setPage(e)}
          pageActive={page}
        />
      </div>
      <ModalAlert
        show={showModalAlert}
        onHandleClose={(e) => {
          setShowModalAlert(e);
        }}
        message={message}
      />
    </div>
  );
}

export default DocumentRegister;
