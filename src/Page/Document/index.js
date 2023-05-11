import axios from "axios";
import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Form, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Footer from "../../Component/Footer";
import Header from "../../Component/Header";
import moment from "moment";
import {
  deleteCommentApi,
  deleteFeedbackComment,
  getCommentByVideoIdApi,
  getDocumentByIdApi,
  getUserByUserIdApi,
  postCommentApi,
  postFeedbackComment,
} from "../../Config/API";
import "./document.css";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import { GoDesktopDownload } from "react-icons/go";
import photoBluePrint from "../../Asset/ImageGeneral/profile.jpg";
import PaginationTable from "../../Component/Pagination";
import { fileName } from "../../Config/fileName";
import { getExtFileName } from "../../Config/fileType";

function Document() {
  const { id } = useParams();
  const [tableDocument, setTableDocument] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [actionState, setActionState] = useState(0);
  const [commentId, setCommentId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [page, setPage] = useState(1);
  const [totalPageData, setTotalPageData] = useState(1);

  useEffect(() => {
    axios.get(getDocumentByIdApi(id)).then((response) => {
      setTableDocument(response.data.data);
    });

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      axios.get(getUserByUserIdApi(user.id)).then((response) => {
        const dataUser = response.data.data;
        if (dataUser.length > 0) {
          setCurrentUserId(dataUser[0].id);
          setCurrentPhoto(dataUser[0].photo);
          setCurrentUserName(dataUser[0].username);
        }
      });
    }

    const fetchComment = async () => {
      const list = await axios(getCommentByVideoIdApi(id, page));
      setCommentList(list.data.data);
      setTotalPageData(list.data.totalPageData);
    };
    fetchComment();
  }, [id, comment, actionState, page]);

  const colorBadge = () => {
    if (tableDocument) {
      switch (tableDocument[0].file_type) {
        case "Engineering Document":
          return "primary";
        case "Engineering Report":
          return "success";
        case "Kakotora":
          return "secondary";
        case "Update News":
          return "info";
        case "Others":
          return "dark";
        default:
          break;
      }
    }
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    const data = {
      user_id: parseInt(currentUserId),
      selected_id: id,
      selected_item: "document",
      comment: comment,
    };

    axios
      .post(postCommentApi, data)
      .then((response) => {
        resetComment();
      })
      .catch((error) => console.log(error));
  };

  const maxPagesShow = 3;
  const resetComment = () => {
    setComment("");
  };

  const handleDeleteComment = (e) => {
    const confirm = window.confirm("Apakah Ingin Di Hapus?");
    if (confirm) {
      axios.delete(deleteCommentApi(e.target.id)).then((response) => {
        resetComment();
        setActionState(actionState + 1);
        alert("Komentar Telah di Hapus");
      });
    }
  };

  const handleFeedBackComment = (e) => {
    e.preventDefault();
    let data = {
      comment_id: commentId,
      user_id: currentUserId,
      feedback: feedback,
      selected_id: id,
      selected_item: "document",
    };
    axios
      .post(postFeedbackComment, data)
      .then((response) => {
        resetComment();
        setFeedback("");
        setCommentId("");
        setActionState(actionState + 1);
      })
      .catch((error) => console.log(error));
  };

  const handleDeleteFeedback = (e) => {
    const id = e.target.id;
    const confirm = window.confirm("Apakah ingin di hapus?");
    if (confirm) {
      axios
        .delete(deleteFeedbackComment(id))
        .then((response) => {
          resetComment();
          setFeedback("");
          setActionState(actionState + 1);
        })
        .catch((error) => console.log(error));
    }
  };
  const content = () => {
    if (tableDocument.length !== 0) {
      return (
        <>
          <div className="titleDocumentDetailPage">
            {tableDocument[0].title}
          </div>
          <div className="jenisDocument">
            <Badge bg={colorBadge()}>{tableDocument[0].file_type}</Badge>
          </div>
          <Row style={{ textAlign: "left" }}>
            <Col sm={2}>Author</Col>
            <Col sm={8}>
              : {CapitalCaseFirstWord(tableDocument[0].username)}
            </Col>
          </Row>
          <Row style={{ textAlign: "left" }}>
            <Col sm={2}>Creation Date</Col>
            <Col sm={8}>
              :{" "}
              {moment(tableDocument[0].create_date).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </Col>
          </Row>
          <Row style={{ textAlign: "left" }}>
            <Col sm={2}>Product</Col>
            <Col sm={8}>: {tableDocument[0].product_name}</Col>
          </Row>
          <Row style={{ textAlign: "left" }}>
            <Col sm={2}>Line</Col>
            <Col sm={8}>: {tableDocument[0].line_name}</Col>
          </Row>
          <Row style={{ textAlign: "left" }}>
            <Col sm={2}>Machine</Col>
            <Col sm={8}>: {tableDocument[0].machine_name}</Col>
          </Row>
          <Row style={{ textAlign: "left" }}>
            <Col sm={2}>Status Document </Col>
            <Col sm={8}>: {tableDocument[0].status}</Col>
          </Row>
          <Row style={{ textAlign: "left" }}>
            <Col sm={2}>Description </Col>
            <Col sm={8}>: {tableDocument[0].description}</Col>
          </Row>

          {tableDocument[0].file.length !== 0 && (
            <Table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>File Name</th>
                  <th>File Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableDocument[0].file.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td style={{ textAlign: "left", paddingLeft: 20 }}>
                        {fileName(value.name)}
                      </td>
                      <td>{getExtFileName(value.name)}</td>
                      <td>
                        <a href={value.file} target="_blank" rel="noreferrer">
                          <Button size="sm">
                            <GoDesktopDownload style={{ marginRight: 5 }} />
                            OPEN
                          </Button>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
          <Row
            style={{ textAlign: "left" }}
            className="mt-5 commentDocumentContainer"
          >
            <Col sm={1}>
              <div className="photoUserVideoCover">
                <img
                  src={currentPhoto ? currentPhoto : photoBluePrint}
                  alt="profile"
                  className="photoUserVideo"
                />
              </div>
            </Col>
            <Col sm={11}>
              <Row>
                <Col>
                  <span style={{ fontWeight: "bold" }}>
                    {CapitalCaseFirstWord(currentUserName)}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form onSubmit={handlePostComment}>
                    <Form.Control
                      type="text"
                      placeholder="Enter Your Comment"
                      value={comment}
                      required
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div style={{ textAlign: "right", marginTop: 10 }}>
                      <Button
                        variant="primary"
                        size="sm"
                        type="submit"
                        disabled={comment ? false : true}
                      >
                        Comment
                      </Button>
                    </div>
                  </Form>
                </Col>
              </Row>
            </Col>
          </Row>
          {commentList.map((value, index) => {
            return (
              <Row key={index} className="commentContainer">
                <Col sm={1}>
                  <div className="photoUserVideoCover">
                    <img
                      src={value.photo ? value.photo : photoBluePrint}
                      alt="profile"
                      className="photoUserVideo"
                    />
                  </div>
                </Col>
                <Col sm={11}>
                  <Row>
                    <Col sm={5} style={{ textAlign: "left" }}>
                      <span style={{ fontWeight: "bold" }}>
                        {CapitalCaseFirstWord(value.username)}
                      </span>
                    </Col>
                    <Col sm={3}>
                      <span
                        id={value.id}
                        className={"buttonReply"}
                        type="button"
                        onClick={(e) => setCommentId(e.target.id)}
                      >
                        Balas
                      </span>
                      {value.user_id === currentUserId && (
                        <span
                          id={value.id}
                          variant="danger"
                          className={"buttonReply"}
                          type="button"
                          onClick={handleDeleteComment}
                        >
                          Delete
                        </span>
                      )}
                    </Col>
                    <Col sm={4} style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 12 }}>
                        {moment(value.create_date).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </span>
                    </Col>
                  </Row>
                  <Row style={{ textAlign: "left" }}>
                    <Col>
                      <p>{value.comment}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {parseInt(commentId) === parseInt(value.id) && (
                        <Form onSubmit={handleFeedBackComment}>
                          <Form.Control
                            type="text"
                            placeholder="Enter Your Comment"
                            value={feedback}
                            required
                            onChange={(e) => setFeedback(e.target.value)}
                          />
                          <div style={{ textAlign: "right", marginTop: 10 }}>
                            <Button
                              variant="primary"
                              size="sm"
                              type="submit"
                              disabled={feedback ? false : true}
                              style={{ marginRight: 5 }}
                            >
                              Comment
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              type="button"
                              onClick={(e) => setCommentId("")}
                            >
                              Batal
                            </Button>
                          </div>
                        </Form>
                      )}
                      {value.feedback.map((value, index) => {
                        return (
                          <Row key={index} className="commentContainer">
                            <Col sm={1}>
                              <div className="photoUserVideoCover">
                                <img
                                  src={
                                    value.photo ? value.photo : photoBluePrint
                                  }
                                  alt="profile"
                                  className="photoUserVideo"
                                />
                              </div>
                            </Col>
                            <Col sm={11}>
                              <Row>
                                <Col sm={5} style={{ textAlign: "left" }}>
                                  <span style={{ fontWeight: "bold" }}>
                                    {CapitalCaseFirstWord(value.username)}
                                  </span>
                                </Col>
                                <Col sm={3}>
                                  {value.user_id === currentUserId && (
                                    <span
                                      id={value.id}
                                      variant="danger"
                                      type="button"
                                      className={"buttonReply"}
                                      onClick={handleDeleteFeedback}
                                    >
                                      Delete
                                    </span>
                                  )}
                                </Col>
                                <Col sm={4} style={{ textAlign: "right" }}>
                                  <span style={{ fontSize: 12 }}>
                                    {moment(value.create_date).format(
                                      "MMMM Do YYYY, h:mm:ss a"
                                    )}
                                  </span>
                                </Col>
                              </Row>
                              <Row>
                                <Col style={{ textAlign: "left" }}>
                                  <p>{value.feedback}</p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        );
                      })}
                    </Col>
                  </Row>
                </Col>
              </Row>
            );
          })}
        </>
      );
    }
  };

  return (
    <div className="documentContainer">
      <Header />
      <div className="documentContent">{content()}</div>
      <div className="paginationVideo">
        <PaginationTable
          totalPage={totalPageData}
          maxPagesShow={maxPagesShow}
          onChangePage={(e) => setPage(e)}
          pageActive={page}
        />
      </div>
      <Footer />
    </div>
  );
}

export default Document;
