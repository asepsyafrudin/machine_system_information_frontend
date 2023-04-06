import React from "react";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import CapabilityForm from "../../Component/CapabilityForm";

function CapabilityFormPage() {
  return (
    <div className="openaiContainer">
      <Header />
      <CapabilityForm />
      <Footer />
    </div>
  );
}

export default CapabilityFormPage;
