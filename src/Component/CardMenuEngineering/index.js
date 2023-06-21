import React from "react";
import "./cardMenuEngineering.css";

function CardMenuEngineering(props) {
  return (
    <div className="card-menu-container">
      <img src={props.image} alt="gambar" className="image-card-engineering" />
      <div className="titleMenu">{props.title}</div>
      <div className="Description">{props.description}</div>
    </div>
  );
}

export default CardMenuEngineering;
