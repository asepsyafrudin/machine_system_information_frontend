import React, { useEffect, useRef, useState } from "react";
import TitleSection from "../TitleSection";
import { TfiVideoClapper } from "react-icons/tfi";
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
  deleteVideoApi,
  getAllLineApi,
  getAllMachineApi,
  getAllProductApi,
  getVideoByPageAdminApi,
  getVideoByUserIdApi,
  registerVideoApi,
  searchVideoForDashboardMenuApi,
  updateStatusVideoApi,
  updateVideoApi,
} from "../../Config/API";
import { AiOutlineFileSearch } from "react-icons/ai";
import { GoGitCompare, GoSmiley } from "react-icons/go";
import { MdDeleteForever, MdOutlineOndemandVideo } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import PaginationTable from "../Pagination";
import { MdVideoLibrary } from "react-icons/md";
import { Link } from "react-router-dom";
import ModalAlert from "../ModalAlert";

function VideoListAdmin(props) {
  const { actionState, actionStateValue } = props;
  const refVidoe = useRef();
  const [videoName, setVideoName] = useState("");
  const [video, setVideo] = useState("");
  const [description, setDescription] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [tableProduct, setTableProduct] = useState("");
  const [tableLine, setTableLine] = useState("");
  const [tableMachine, setTableMachine] = useState("");
  const [product, setProduct] = useState("");
  const [line, setLine] = useState("");
  const [machine, setMachine] = useState("");
  const [search, setSearch] = useState("");
  const [tableVideo, setTableVideo] = useState("");
  const [page, setPage] = useState(1);
  const [id, setId] = useState("");
  const [userId, setUserId] = useState("");
  const [alert, setAlert] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");
  const [userPositon, setUserPosition] = useState("");
  const [totalPageData, setTotalPageData] = useState(0);
  const [numberStartData, setNumberStartData] = useState(1);
  const [percentProgress, setPercentProgress] = useState(0);
  const [message, setMessage] = useState("");
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
          .get(searchVideoForDashboardMenuApi(search, page, userId))
          .then((response) => {
            setTableVideo(response.data.data);
            setTotalPageData(response.data.totalPageData);
            setNumberStartData(response.data.numberStart);
          })
          .catch((error) => console.log(error));
      } else {
        if (userPositon === "Administrator") {
          axios
            .get(getVideoByPageAdminApi(page))
            .then((response) => {
              setTableVideo(response.data.data);
              setTotalPageData(response.data.totalPageData);
              setNumberStartData(response.data.numberStart);
            })
            .catch((error) => console.log(error));
        } else {
          axios
            .get(getVideoByUserIdApi(userId, page))
            .then((response) => {
              setTableVideo(response.data.data);
              setTotalPageData(response.data.totalPageData);
              setNumberStartData(response.data.numberStart);
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
    setCurrentVideo("");
    setVideoName("");
    setProduct("");
    setLine("");
    setMachine("");
    setId("");
    setUpdateMode(false);
  };

  const handleRegisterVideo = (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("video_name", videoName);
    formData.append("user_id", parseInt(userId));
    formData.append("machine_id", machine);
    formData.append("description", description);
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
    if (!updateMode) {
      formData.append("video", video);
      axios
        .post(registerVideoApi, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress,
        })
        .then((response) => {
          handleResetForm();
          setMessage("Register Success!!!");
          setNotifSuccess(true);
          setAlert(false);
          setLoading(false);
          actionState(1);
          setPercentProgress(0);
        })
        .catch((error) => {
          setMessage("Internet Error");
          setAlert(true);
          console.log(error);
        });
    } else {
      if (video) {
        formData.append("video", video);
      } else {
        formData.append("video", currentVideo);
      }
      formData.append("id", id);
      axios
        .patch(updateVideoApi, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress,
        })
        .then((response) => {
          handleResetForm();
          setMessage("Update Success!!!");
          setNotifSuccess(true);
          setAlert(false);
          setLoading(false);
          actionState(1);
          setPercentProgress(0);
        })
        .catch((error) => {
          setMessage("Internet Error");
          setAlert(true);
          console.log(error);
        });
    }
  };

  const handleEdit = (e) => {
    setId(e.target.id);
    const dataEdit = tableVideo.find((value) => value.id === e.target.id);
    if (dataEdit) {
      setLine(dataEdit.line_id);
      setMachine(dataEdit.machine_id);
      setProduct(dataEdit.product_id);
      setVideo(dataEdit.video_url);
      setVideoName(dataEdit.video_name);
      setCurrentVideo(dataEdit.video_url);
      setDescription(dataEdit.description);
      setUpdateMode(true);
    }
  };
  const handleDelete = (e) => {
    setId(e.target.id);
    const confirm = window.confirm("File Video Akan di Hapus?");
    if (confirm) {
      axios
        .delete(deleteVideoApi(e.target.id))
        .then((response) => {
          setMessage("File sudah terhapus");
          setShowModalAlert(true);
          actionState(1);
          handleResetForm();
        })
        .catch((error) => console.log(error));
    }
  };

  const currentVideoDownload = () => {
    let videoFile = [];
    if (updateMode) {
      videoFile.push(
        <Form.Group as={Col} key={new Date()}>
          <Form.Label>Current video</Form.Label>
          <br />
          <Link to={`/video/${id}`} target="_blank">
            <Button>
              <MdOutlineOndemandVideo
                style={{ marginRight: 5, fontSize: 20 }}
              />
              Open Current Video
            </Button>
          </Link>
        </Form.Group>
      );
    }
    return videoFile;
  };

  const maxPagesShow = 3;

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

  const changeStatus = (e) => {
    const id = e.target.id;
    const videoEdit = tableVideo.find((value) => {
      return value.id === id;
    });
    let status = "";
    if (videoEdit.status === "Active") {
      status = "Non Active";
    } else {
      status = "Active";
    }
    const data = {
      id: id,
      status: status,
    };
    axios.patch(updateStatusVideoApi, data).then((response) => {
      setMessage("Status data telah berganti");
      setShowModalAlert(true);
      handleResetForm();
      actionState(1);
    });
  };

  return (
    <div className="userListContainer">
      <TitleSection
        title="Video Upload Form"
        icon={<TfiVideoClapper style={{ marginRight: 5 }} />}
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
                value={videoName}
                onChange={(e) => setVideoName(e.target.value)}
                placeholder="Enter Title Video"
                required
              />
            </Form.Group>
            {currentVideoDownload()}
            <Form.Group as={Col}>
              <Form.Label>Input Video</Form.Label>
              <Form.Control
                type="file"
                accept=".mp4"
                placeholder="Enter Video File"
                onChange={(e) => setVideo(e.target.files[0])}
                ref={refVidoe}
                required={updateMode ? false : true}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Video Description</Form.Label>
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
          <Alert
            show={alert}
            variant="danger"
            onClose={() => setAlert(false)}
            dismissible
          >
            Please Check Your Password!!!
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
      <div className="tableVideo">
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
            <tr>
              <th>No</th>
              <th>Video Name</th>
              <th>Product Name</th>
              <th>Line Name</th>
              <th>Machine Name</th>
              <th>Create Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableVideo ? (
              tableVideo.map((value, index) => {
                return (
                  <tr key={index}>
                    <td>{index + numberStartData}</td>
                    <td>{value.video_name}</td>
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
                        title="Edit"
                        size="sm"
                        style={{ marginRight: 2 }}
                        id={value.id}
                        onClick={handleEdit}
                        variant="success"
                      >
                        <GrEdit style={{ pointerEvents: "none" }} />
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
                      <Link to={`/video/${value.id}`}>
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
              })
            ) : (
              <tr key={new Date().getTime}>
                <td colSpan={8}> Data Tidak Di Temukan</td>
              </tr>
            )}
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

export default VideoListAdmin;
