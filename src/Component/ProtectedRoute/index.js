import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute(props) {
  const user = JSON.parse(localStorage.getItem("user"));
  const { children } = props;
  if (user) {
    return children ? children : <Outlet />;
  }
  return <Navigate to="/" replace />;
}

export default ProtectedRoute;
