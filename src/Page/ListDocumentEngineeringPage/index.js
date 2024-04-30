import React from "react";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import ListDocumentEngineeringComponent from "../../Component/ListDocumentEngineeringComponent";

function ListDocumentEngineeringPage() {
  return (
    <div className="openaiContainer">
      <Header />
      <ListDocumentEngineeringComponent />
      <Footer />
    </div>
  );
}

export default ListDocumentEngineeringPage;
