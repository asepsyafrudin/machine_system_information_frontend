import React from "react";
import "./cardVideo.css";
import Poster from "../../Asset/ImageGeneral/videodefault.jpg";
import { Link } from "react-router-dom";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";

function CardVideo(props) {
  const { src, title, create_date, id } = props;

  return (
    <div className="cardVideoContainer">
      <div className="video">
        <video controls className="videoFrame" poster={Poster}>
          <source src={src} type="video/mp4" />
        </video>
      </div>
      <div className="videoTitle">
        <span>
          <Link style={{ textDecoration: "none" }} to={`/video/${id}`}>
            {CapitalCaseFirstWord(title)}
          </Link>
        </span>
        <br />
      </div>
      <div className="createDateVideo">{create_date}</div>
      <hr />
    </div>
  );
}

export default CardVideo;
