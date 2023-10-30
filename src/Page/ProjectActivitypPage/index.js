import React, { useEffect, useState } from "react";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import { useNavigate, useParams } from "react-router-dom";
import ProjectActivity from "../../Component/ProjectActivity";
import ToDoList from "../../Component/TodoList";
import { GlobalConsumer } from "../../Context/store";
import TrialDataOnActivity from "../../Component/TrialDataOnActivity";
import DocumentProject from "../../Component/DocumentProject";
import VideoProject from "../../Component/VideoProject";
import axios from "axios";
import { getProjectByIdApi } from "../../Config/API";

function ProjectActivityPage(props) {
  const { dataChangeCount, dispatch, todoChangeCount } = props;
  const { id } = useParams();
  const [accessMember, setAccessMember] = useState(true);
  const [project, setProject] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.id;

    if (id) {
      axios
        .get(getProjectByIdApi(id), {
          signal: controller.signal,
        })
        .then((response) => {
          const project = isMounted && response.data.data[0];
          setProject(project);
          const member = project.member;
          const checkMember = member.find(
            (value) => value.user_id === parseInt(userId)
          );
          const position = user.position;
          const positionThatCanOpenProject = [
            "Departement Manager",
            "Assistant General Manager",
            "General Manager",
            "Director",
            "President",
          ];

          const checkPosition = positionThatCanOpenProject.find(
            (value) => value === position
          );
          if (!checkPosition) {
            if (!checkMember) {
              setAccessMember(false);
            }
          }
        });
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, navigate]);
  return (
    <div className="adminContainer">
      <Header />
      <div className="menuAdmin">
        <ProjectActivity
          id={id}
          dataChangeCount={dataChangeCount}
          dispatch={dispatch}
          todoChangeCount={todoChangeCount}
          accessMember={accessMember}
          memberProject={project.member}
        />
        <ToDoList
          id={id}
          dataChangeCount={dataChangeCount}
          dispatch={dispatch}
          accessMember={accessMember}
          todoChangeCount={todoChangeCount}
          memberProject={project.member}
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
