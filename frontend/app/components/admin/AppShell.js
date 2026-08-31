"use client";

import { useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./Dashboard";
import ManageAssessments from "./ManageAssessments";
import CreateAssessment from "./CreateAssessment";
import ManageResults from "./ManageResults";
import { useAuthGuard } from "../../lib/auth";

export default function AppShell() {
  useAuthGuard("admin", "/admin/login");
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;

      case "manage":
        return <ManageAssessments />;

      case "create":
        return <CreateAssessment />;

      case "results":
        return <ManageResults />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen mesh-content">
     
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="flex-1 overflow-y-auto p-6">
         <Header />
        {renderPage()}
      </main>
    </div>
  );
}