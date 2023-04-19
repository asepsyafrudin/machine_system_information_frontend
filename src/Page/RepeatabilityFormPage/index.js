import React from "react";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import RepeatabilityForm from "../../Component/RepeatabilityForm";

function RepeatabilityFormPage() {
  return (
    <div className="openaiContainer">
      <Header />
      <RepeatabilityForm />
      <Footer />
    </div>
  );
}

export default RepeatabilityFormPage;
