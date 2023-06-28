import React from "react";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import { useParams } from "react-router-dom";
import ProjectActivity from "../../Component/ProjectActivity";

function ProjectActivityPage() {
  const { id } = useParams();

  return (
    <div className="adminContainer">
      <Header />
      <div className="menuAdmin">
        <ProjectActivity id={id} />
      </div>
      <Footer />
    </div>
  );
}

export default ProjectActivityPage;
