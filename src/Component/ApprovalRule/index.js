import React from "react";
import TitleSection from "../TitleSection";
import { SlGraph } from "react-icons/sl";
import { Link } from "react-router-dom";
import CardMenuEngineering from "../CardMenuEngineering";
import GeneralManagerImage from "../../Asset/ImageGeneral/Work time-amico.png";
import DepartementManagerImage from "../../Asset/ImageGeneral/Add tasks-amico.png";
import ManagerImage from "../../Asset/ImageGeneral/Digital personal files-amico.png";
import PicImage from "../../Asset/ImageGeneral/New team members-rafiki.png";

function ApprovalRule() {
  return (
    <div className="userListContainer">
      <TitleSection
        title="Approval Rule Set Up"
        icon={<SlGraph style={{ marginRight: 5 }} />}
      />

      <div className="cardCapability">
        <Link to={"/capabilityForm"} className="link">
          <CardMenuEngineering
            image={GeneralManagerImage}
            title="Set Up General Manager"
          />
        </Link>
        <Link to={"/capabilityList"} className="link">
          <CardMenuEngineering
            image={DepartementManagerImage}
            title="Set Up Departement Manager"
          />
        </Link>
        <Link to={"/capabilityComparisonForm"} className="link">
          <CardMenuEngineering image={ManagerImage} title="Set Up Manager" />
        </Link>
        <Link to={"/FTA"} className="link">
          <CardMenuEngineering image={PicImage} title="Set Up Member" />
        </Link>
      </div>
    </div>
  );
}

export default ApprovalRule;
