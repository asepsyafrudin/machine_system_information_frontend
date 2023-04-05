import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRouteAdmin(props) {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user.position);
  const { children } = props;
  if (user.position === "Administrator") {
    return children ? children : <Outlet />;
  }
  return <Navigate to="/" replace />;
}

export default ProtectedRouteAdmin;
