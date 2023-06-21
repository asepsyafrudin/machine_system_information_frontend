import React from "react";
import { Button } from "react-bootstrap";
import AnalysisImage from "../../Asset/ImageGeneral/agile-method-rafiki.png";
import "./ftaPage.css";
import { useState } from "react";
import FTAModalAnalysis from "../../Component/FTAModalAnalysis";

function FTAPage(props) {
  const { searchValue } = props;
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="FTAPageContainer">
      <Button onClick={() => setShowModal(true)}>
        <img src={AnalysisImage} alt="gambar" className="imageFTAButton" />{" "}
        <br />
        "Click to Open"
      </Button>
      <FTAModalAnalysis
        showModal={showModal}
        search={searchValue}
        onHandleHide={(e) => setShowModal(e)}
      />
    </div>
  );
}

export default FTAPage;
