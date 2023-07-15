import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute(props) {
  const user = JSON.parse(localStorage.getItem("user"));
  // const token = JSON.parse(localStorage.getItem("token"));

  // useEffect(() => {
  //   axios
  //     .post(validateTokenApi, { token: token })
  //     .then((response) => {
  //       setValidate(true);
  //       console.log(response.data);
  //     })
  //     .catch((error) => console.log(error));
  // }, [token]);

  const { children } = props;
  if (user) {
    return children ? children : <Outlet />;
  }
  return <Navigate to="/" replace />;
}

export default ProtectedRoute;
