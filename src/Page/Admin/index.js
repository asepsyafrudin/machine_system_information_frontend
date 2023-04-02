import React from "react";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import NavigationAdmin from "../../Component/NavigationAdmin";
import "./admin.css";

function Admin() {
  return (
    <div className="adminContainer">
      <Header />
      <div className="menuAdmin">
        <NavigationAdmin />
      </div>
      <Footer />
    </div>
  );
}

export default Admin;
