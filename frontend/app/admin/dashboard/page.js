"use client";

import { useEffect, useState } from "react";
import AppShell from "../../components/admin/AppShell";

export default function Dashboard() {
  const [assessments, setAssessments] = useState([]);

  return <AppShell />;
}