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
import ProjectPage from "../ProjectPage";
import ProjectActivityPage from "../ProjectActivitypPage";
import Home from "../Home";
import RedirectPage from "../RedirectPage";
import RedirectActivityPage from "../RediectActivityPage";
import ForbiddenPage from "../ForbiddenPage";
import DocumentEngineeringPage from "../DocumentEngineeringPage";
import ListDocumentEngineeringPage from "../ListDocumentEngineeringPage";

function LayoutPage() {
  return (
    <div>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/:token" element={<Login />} />
        <Route
          path="/redirectPage/projectActivity/:activityId/:userId"
          element={<RedirectPage />}
        />
        <Route
          path="/redirectPage/document/:documentId/:userId"
          element={<RedirectPage />}
        />
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route
          path="/redirectPage/login/:projectId"
          element={<RedirectActivityPage />}
        />
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
          <Route
            path="/projectActivity/:id"
            element={<ProjectActivityPage />}
          />
          <Route path="/FTA" element={<FTAFormPage />} />
          <Route path="/FTA/:id" element={<FTAFormPage />} />
          <Route path="/FTAList" element={<FTAListPage />} />
          <Route path="/DocumentUpload" element={<DocumentEngineeringPage />} />
          <Route
            path="/ListDocumentEngineering"
            element={<ListDocumentEngineeringPage />}
          />
          <Route path="/capabilityForm/:id" element={<CapabilityFormPage />} />
          <Route path="/capabilityList" element={<ListCapabilityPage />} />
          <Route path="/dashboardUsers" element={<UserDashboardPage />} />
          <Route path="/openai" element={<Openai />} />
          <Route path="/home" element={<Home />} />
          <Route path="/searching_page" element={<SearchEnginePage />} />
          <Route path="/projectPage" element={<ProjectPage />} />
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
