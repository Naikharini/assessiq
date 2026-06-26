"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./Dashboard";
import ManageAssessments from "./ManageAssessments";
import CreateAssessment from "./CreateAssessment";

export default function AppShell({ children }) {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;

      case "manage":
        return <ManageAssessments />;

      case "create":
        return <CreateAssessment />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          {children ?? renderPage()}
        </main>
      </div>
    </div>
  );
}