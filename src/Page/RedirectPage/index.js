import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getUserByUserIdApi } from "../../Config/API";

function RedirectPage(props) {
  const { activityId, userId, documentId } = useParams();
  console.log(activityId, userId);
  const [login, setLogin] = useState(false);
  useEffect(() => {
    if (userId) {
      axios.get(getUserByUserIdApi(userId)).then((response) => {
        const user = response.data.data[0];
        localStorage.setItem("user", JSON.stringify(user));
        setLogin(true);
      });
    }
  }, [userId]);

  const navigate = useNavigate();

  const waitingRedirect = () => {
    if (login === false) {
      return (
        <>
          <Spinner animation="grow" variant="success" />
          <Spinner animation="grow" variant="danger" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="info" />
          <Spinner animation="grow" variant="light" />
          <Spinner animation="grow" variant="dark" />
        </>
      );
    } else if (documentId) {
      navigate(`/document/${documentId}`);
    } else if (activityId) {
      navigate(`/projectActivity/${activityId}`);
    }
  };

  return <>{waitingRedirect()}</>;
}

export default RedirectPage;
