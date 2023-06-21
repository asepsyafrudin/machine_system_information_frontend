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
import ProtectedRouteAdmin from "../../Component/ProtectedRouteAdmin";
import CapabilityFormPage from "../CapabilityFormPage";
import ListCapabilityPage from "../ListCapabilityPage";
import RepeatabilityFormPage from "../RepeatabilityFormPage";
import CapabilityCompareFormPage from "../CapabilityCompareFormPage";
import FTAFormPage from "../FTAFormPage";
import FTAListPage from "../FTAListPage";

function LayoutPage() {
  return (
    <div>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/:token" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/capabilityForm" element={<CapabilityFormPage />} />
          <Route
            path="/repeatabilityForm"
            element={<RepeatabilityFormPage />}
          />
          <Route
            path="/capabilityComparisonForm"
            element={<CapabilityCompareFormPage />}
          />
          <Route
            path="/capabilityComparisonForm/:id"
            element={<CapabilityCompareFormPage />}
          />
          <Route path="/FTA" element={<FTAFormPage />} />
          <Route path="/FTA/:id" element={<FTAFormPage />} />
          <Route path="/FTAList" element={<FTAListPage />} />
          <Route path="/capabilityForm/:id" element={<CapabilityFormPage />} />
          <Route path="/capabilityList" element={<ListCapabilityPage />} />
          <Route path="/dashboardUsers" element={<UserDashboardPage />} />
          <Route path="/openai" element={<Openai />} />
          <Route path="/searching_page" element={<SearchEnginePage />} />
          <Route
            path="/searching_page/:searchValue"
            element={<SearchListPage />}
          />
          <Route path="/video/:id" element={<Video />} />
          <Route path="/document/:id" element={<Document />} />
          <Route element={<ProtectedRouteAdmin />}>
            <Route path="/adminmenu" element={<Admin />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default LayoutPage;
