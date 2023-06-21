import React from "react";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import FTAForm from "../../Component/FTAForm";

function FTAFormPage() {
  return (
    <div className="openaiContainer">
      <Header />
      <FTAForm />
      <Footer />
    </div>
  );
}

export default FTAFormPage;
