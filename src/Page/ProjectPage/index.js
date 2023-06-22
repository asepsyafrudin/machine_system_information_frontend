import React from "react";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import NavigationProject from "../../Component/NavigationProject";

function ProjectPage() {
  return (
    <div className="adminContainer">
      <Header />
      <div className="menuAdmin">
        <NavigationProject />
      </div>
      <Footer />
    </div>
  );
}

export default ProjectPage;
