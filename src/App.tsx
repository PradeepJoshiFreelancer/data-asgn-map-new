import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { groupAssignments } from "./util/JSONFormatter";
import type { DataAssignment, PlanNode } from "./util/types";
import WelcomePage from "./pages/WelcomePage";
import PlanPage from "./pages/PlanPage";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  const [formattedData, setFormattedData] = useState<PlanNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("dataAssignments");
    if (savedData) {
      try {
        const parsedData: DataAssignment[] = JSON.parse(savedData);
        const grouped = groupAssignments(parsedData);
        setFormattedData(grouped);
      } catch (err) {
        console.error("Failed to parse saved data:", err);
      }
    }
  }, []);

  // New: Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = JSON.parse(e.target?.result as string);
        const dataArray: DataAssignment[] = Array.isArray(raw)
          ? raw
          : raw.dataAssignments;
        const grouped = groupAssignments(dataArray);
        localStorage.setItem("dataAssignments", JSON.stringify(dataArray));
        setFormattedData(grouped);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Invalid JSON file");
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read file");
      setLoading(false);
    };
    reader.readAsText(file);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error};</div>;

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center my-6">
        <label>
          <input
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileChange}
            id="json-upload"
          />
          <button
            onClick={() => document.getElementById("json-upload")?.click()}
            className="bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white font-semibold py-2 px-4 rounded"
          >
            Load JSON File
          </button>
        </label>
      </div>
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
