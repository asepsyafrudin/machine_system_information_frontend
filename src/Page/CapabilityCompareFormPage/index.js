import React from "react";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import CapabilityComparisonForm from "../../Component/CapabilityComparisonForm";

function CapabilityCompareFormPage() {
  return (
    <div className="openaiContainer">
      <Header />
      <CapabilityComparisonForm />
      <Footer />
    </div>
  );
}

export default CapabilityCompareFormPage;
