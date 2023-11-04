import React from "react";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import moment from "moment";
import { useRef } from "react";
import { useEffect } from "react";

function CommentCard(props) {
  const { userName, date, comment, onHandleEdit, photo } = props;
  const refComment = useRef("null");

  useEffect(() => {
    refComment.current.innerText = comment;
  }, [comment]);
  return (
    <div className="mb-3">
      <div className="">
        <div className="col-md-12">
          <div className="d-flex flex-column" id="comment-container">
            <div className="bg-white">
              <div className="flex-row d-flex">
                <img src={photo} width="40" className="rounded-circle" />
                <div className="d-flex flex-column justify-content-start ml-2">
                  <span className="d-block font-weight-bold name">
                    {CapitalCaseFirstWord(userName)}
                  </span>
                  <span className="date text-black-50">
                    {moment(date).format("LLL")}
                  </span>
                </div>
              </div>
              <div className="mt-3" ref={refComment}></div>
            </div>
            <div className="bg-white">
              <div className="d-flex flex-row fs-14">
                {/* <div className="p-2 cursor p-2">
                    <i className="fa fa-thumbs-o-up"></i>
                    <span className="ml-1">Like</span>
                  </div> */}
                <div className="p-2 cursor p-2">
                  <i className="fa fa-comment"></i>
                  <span className="ml-1">Edit</span>
                </div>
                {/* <div className="p-2 cursor p-2">
                    <i className="fa fa-share"></i>
                    <span className="ml-1">Share</span>
                  </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentCard;
