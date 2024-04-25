import React from "react";
import TitleSection from "../TitleSection";
import { SlGraph } from "react-icons/sl";
import "./capabilityMenu.css";
import { Link } from "react-router-dom";
import CardMenuEngineering from "../CardMenuEngineering";
import CapabiityFormImage from "../../Asset/ImageGeneral/Performance overview-rafiki.png";
import CapabilityListImage from "../../Asset/ImageGeneral/Reading list-rafiki.png";
import FTAImage from "../../Asset/ImageGeneral/Robotics-amico.png";
import CapabilityCompareImage from "../../Asset/ImageGeneral/Data analysis-rafiki.png";
import FTAListImage from "../../Asset/ImageGeneral/Completed-rafiki.png";

function EngineeringTools() {
  return (
    <div className="userListContainer">
      <TitleSection
        title="Engineering Tools"
        icon={<SlGraph style={{ marginRight: 5 }} />}
      />

      <div className="cardCapability">
        <Link to={"/capabilityForm"} className="link">
          <CardMenuEngineering
            image={CapabiityFormImage}
            title="Create Capability"
          />
        </Link>
        <Link to={"/capabilityList"} className="link">
          <CardMenuEngineering
            image={CapabilityListImage}
            title="List of Capability"
          />
        </Link>
        <Link to={"/capabilityComparisonForm"} className="link">
          <CardMenuEngineering
            image={CapabilityCompareImage}
            title="Capability Comparison"
          />
        </Link>
        <Link to={"/FTA"} className="link">
          <CardMenuEngineering image={FTAImage} title="Failure Tree Analysis" />
        </Link>
        <Link to={"/FTAList"} className="link">
          <CardMenuEngineering image={FTAListImage} title="FTA List" />
        </Link>
        <Link to={"/DocumentUpload"} className="link">
          <CardMenuEngineering
            image={FTAListImage}
            title="Upload Document Engineering"
          />
        </Link>
        <Link to={"/ListDocumentEngineering"} className="link">
          <CardMenuEngineering
            image={FTAListImage}
            title="View Document Engineering"
          />
        </Link>
      </div>
    </div>
  );
}

export default EngineeringTools;
