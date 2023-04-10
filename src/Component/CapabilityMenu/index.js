import React from "react";
import TitleSection from "../TitleSection";
import { SlGraph } from "react-icons/sl";
import "./capabilityMenu.css";
import { VscGraphLine } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { ImList } from "react-icons/im";

function CapabilityMenu() {
  return (
    <div className="userListContainer">
      <TitleSection
        title="Menu Capability"
        icon={<SlGraph style={{ marginRight: 5 }} />}
      />

      <div className="cardCapability">
        <div className="ag-format-container">
          <div className="ag-courses_box">
            <div className="ag-courses_item">
              <Link to={"/capabilityForm"} className="ag-courses-item_link">
                <div className="ag-courses-item_bg"></div>
                <div className="ag-courses-item_title">
                  <VscGraphLine style={{ marginRight: 5 }} />
                  Create Capability Form
                </div>
              </Link>
            </div>
            <div className="ag-courses_item">
              <Link to={"/capabilityList"} className="ag-courses-item_link">
                <div className="ag-courses-item_bg"></div>
                <div className="ag-courses-item_title">
                  <ImList style={{ marginRight: 5 }} /> List Capability Data
                </div>
                {/* 
                <div className="ag-courses-item_date-box">
                  Start:
                  <span className="ag-courses-item_date">04.11.2022</span>
                </div> */}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CapabilityMenu;
