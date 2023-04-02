import React from "react";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import NavigationUser from "../../Component/NavigationUser";

function UserDashboardPage() {
  return (
    <div className="adminContainer">
      <Header />
      <div className="menuAdmin">
        <NavigationUser />
      </div>
      <Footer />
    </div>
  );
}

export default UserDashboardPage;
