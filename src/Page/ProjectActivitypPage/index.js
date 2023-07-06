import React from "react";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import { useParams } from "react-router-dom";
import ProjectActivity from "../../Component/ProjectActivity";
import ToDoList from "../../Component/TodoList";
import { GlobalConsumer } from "../../Context/store";

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
      </div>
      <Footer />
    </div>
  );
}

export default GlobalConsumer(ProjectActivityPage);
