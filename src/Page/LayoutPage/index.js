import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../../Component/ProtectedRoute";
import Admin from "../Admin";
import Document from "../Document";
import Login from "../Login";
import SearchEnginePage from "../SearchEnginePage";
import SearchListPage from "../SearchListPage";
import UserDashboardPage from "../UserDashboardPage";
import Video from "../Video";
import Openai from "../OpenAI";

function LayoutPage() {
  return (
    <div>
      <Routes>
        <Route index element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/adminmenu" element={<Admin />} />
          <Route path="/openai" element={<Openai />} />
          <Route path="/dashboardUsers" element={<UserDashboardPage />} />
          <Route path="/searching_page" element={<SearchEnginePage />} />
          <Route
            path="/searching_page/:searchValue"
            element={<SearchListPage />}
          />
          <Route path="/video/:id" element={<Video />} />
          <Route path="/document/:id" element={<Document />} />
        </Route>
      </Routes>
    </div>
  );
}

export default LayoutPage;
