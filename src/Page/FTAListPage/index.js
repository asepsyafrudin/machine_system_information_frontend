import React from "react";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import FTAListComponent from "../../Component/FTAListComponent";

function FTAListPage() {
  return (
    <div className="openaiContainer">
      <Header />
      <FTAListComponent />
      <Footer />
    </div>
  );
}

export default FTAListPage;
