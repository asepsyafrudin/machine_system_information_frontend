import React from "react";
import "./titleSection.css";

function TitleSection(props) {
  const { title, icon } = props;

  return (
    <div className="titleSectionContainer">
      {icon} {title}
    </div>
  );
}

export default TitleSection;
