import React from "react";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import { useParams } from "react-router-dom";
import ProjectActivity from "../../Component/ProjectActivity";
import ToDoList from "../../Component/TodoList";
import { GlobalConsumer } from "../../Context/store";
import TrialDataOnActivity from "../../Component/TrialDataOnActivity";
import DocumentProject from "../../Component/DocumentProject";
import VideoProject from "../../Component/VideoProject";

function ProjectActivityPage(props) {
  const { dataChangeCount, dispatch, todoChangeCount } = props;
  const { id } = useParams();

  return (
    <div className="adminContainer">
      <Header />
      <div className="menuAdmin">
        <ProjectActivity
          id={id}
          dataChangeCount={dataChangeCount}
          dispatch={dispatch}
          todoChangeCount={todoChangeCount}
        />
        <ToDoList
          id={id}
          dataChangeCount={dataChangeCount}
          dispatch={dispatch}
          todoChangeCount={todoChangeCount}
        />
        <TrialDataOnActivity id={id} />
        <DocumentProject id={id} />
        <VideoProject id={id} />
      </div>
      <Footer />
    </div>
  );
}

export default GlobalConsumer(ProjectActivityPage);
