import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../Component/Footer";
import Header from "../../Component/Header";
import {
  deleteCommentApi,
  deleteFeedbackComment,
  getCommentByVideoIdApi,
  getUserByUserIdApi,
  getVideoByIdApi,
  postCommentApi,
  postFeedbackComment,
} from "../../Config/API";
import "./video.css";
import photoBluePrint from "../../Asset/ImageGeneral/profile.jpg";
import { Button, Col, Form, Row } from "react-bootstrap";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import { generateTime } from "../../Config/generateTime";
import PaginationTable from "../../Component/Pagination";
function Video() {
  const { id } = useParams();
  const [user, setUser] = useState("");
  const [video, setVideo] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [actionState, setActionState] = useState(0);
  const [commentId, setCommentId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [page, setPage] = useState(1);
  const [totalPageData, setTotalPageData] = useState(1);

  useEffect(() => {
    axios.get(getVideoByIdApi(id)).then((response) => {
      setVideo(response.data.data);
      const userId = response.data.data[0].user_id;
      axios.get(getUserByUserIdApi(userId)).then((response) => {
        setUser(response.data.data);
      });
    });

    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUserId(user.id);
    setCurrentUserName(user.username);
    setCurrentPhoto(user.photo);

    const fetchComment = async () => {
      const list = await axios(getCommentByVideoIdApi(id, page));
      setCommentList(list.data.data);
      setTotalPageData(list.data.totalPageData);
    };
    fetchComment();
  }, [id, comment, actionState, page]);

  const maxPagesShow = 3;
  const resetComment = () => {
    setComment("");
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    const data = {
      user_id: parseInt(currentUserId),
      video_id: parseInt(id),
      create_date: generateTime(),
      comment: comment,
    };

    axios
      .post(postCommentApi, data)
      .then((response) => {
        resetComment();
      })
      .catch((error) => console.log(error));
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
      video_id: id,
      create_date: generateTime(),
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
  const videoShow = () => {
    if (video && user) {
      return (
        <>
          <div>
            <video controls className="videoFramePage">
              <source src={video[0].video_url} type="video/mp4" />
            </video>
          </div>
          <div className="videoTitle">
            <h3>{video[0].video_name}</h3>
          </div>
          <div className="profileUser">
            <Row>
              <Col sm={1}>
                <div className="photoUserVideoCover">
                  <img
                    src={user[0].photo ? user[0].photo : photoBluePrint}
                    alt="profile"
                    className="photoUserVideo"
                  />
                </div>
              </Col>
              <Col sm={11}>
                <Row>
                  <Col>
                    <span style={{ fontWeight: "bold" }}>
                      {CapitalCaseFirstWord(user[0].username)}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <span>{video[0].create_date}</span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <div className="descriptionVideo profileUser">
            <Row>
              <Col>
                <label className="titleDescription">Product</label>
                <br />
                <span style={{ marginLeft: 5 }}>{video[0].product_name}</span>
              </Col>
              <Col>
                <label className="titleDescription">Line</label>
                <br />
                <span style={{ marginLeft: 5 }}>{video[0].line_name}</span>
              </Col>
              <Col>
                <label className="titleDescription">Machine</label>
                <br />
                <span style={{ marginLeft: 5 }}>{video[0].machine_name}</span>
              </Col>
            </Row>
            <Row>
              <Col>
                <label className="titleDescription">Description</label>
                <br />
                <span style={{ marginLeft: 5 }}>{video[0].description}</span>
              </Col>
            </Row>
          </div>
          <div className="videoComment profileUser">
            <Row>
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
            <hr />
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
                      <Col sm={5}>
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
                          {value.create_date}
                        </span>
                      </Col>
                    </Row>
                    <Row>
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
                                  <Col sm={5}>
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
                                      {value.create_date}
                                    </span>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col>
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
          </div>
        </>
      );
    } else {
      return "";
    }
  };

  return (
    <div className="videoPage">
      <Header />
      <div className="videoContent">
        <div>{videoShow()}</div>
      </div>
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

export default Video;
