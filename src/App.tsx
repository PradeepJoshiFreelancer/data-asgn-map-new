import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { groupAssignments } from "./util/JSONFormatter";
import type { DataAssignment, PlanNode } from "./util/types";
import WelcomePage from "./pages/WelcomePage";
import PlanPage from "./pages/PlanPage";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  const [formattedData, setFormattedData] = useState<PlanNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/dataAssignmentsNew.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((raw) => {
        const dataArray: DataAssignment[] = Array.isArray(raw)
          ? raw
          : raw.dataAssignments;
        const grouped = groupAssignments(dataArray);
        setFormattedData(grouped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage plans={formattedData} />} />
          <Route path="/:planId" element={<PlanPage plans={formattedData} />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
