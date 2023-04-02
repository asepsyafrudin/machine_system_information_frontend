import React from "react";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import OpenaiComponent from "../../Component/OpenaiComponent";
import "./openai.css";

function Openai() {
  return (
    <div className="openaiContainer">
      <Header />
      <OpenaiComponent />
      <Footer />
    </div>
  );
}

export default Openai;
