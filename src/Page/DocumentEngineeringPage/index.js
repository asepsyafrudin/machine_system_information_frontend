import React from "react";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import DocumentEngineeringComponent from "../../Component/DocumentEngineeringComponent";

function DocumentEngineeringPage() {
  return (
    <div className="openaiContainer">
      <Header />
      <DocumentEngineeringComponent />
      <Footer />
    </div>
  );
}

export default DocumentEngineeringPage;
