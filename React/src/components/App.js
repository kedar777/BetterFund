import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// Pages
import Home from "./user/Home";
import NewCampaign from "./campaigns/NewCampaign";
import CampaignDetail from "./campaigns/CampaignDetail";
import Requests from "./campaigns/Requests";
import NewRequest from "./campaigns/NewRequest";
// import ReportIssues from "./user/ReportIssues";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AdminDashboard from "./admin/AdminDashboard";
import UserDashboard from "./user/UserDashboard";
import UserProfile from "./user/UserProfile";
import FeedbackForm from "./user/Feedback";



function App() {
  return (
    <Router>
      <Routes>
        {/* Layout route */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/campaign/new" element={<NewCampaign />} />
          <Route path="/campaign/:id" element={<CampaignDetail />} />
          <Route path="/campaign/:id/requests" element={<Requests />} />
          <Route path="/campaign/:id/requests/new" element={<NewRequest />} />
          {/* <Route path="/report-issues" element={<ReportIssues />} /> */}
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        {/* Routes without main layout (like login/register) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
