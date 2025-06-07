import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ChartView from "./components/ChartView";
import DataManager from "./components/DataManager";
import { Dataset } from "./types";
import { dataService } from "./services/dataService";

function App() {
  // State for current view: dashboard, charts, or data manager
  const [currentView, setCurrentView] = useState<
    "dashboard" | "charts" | "data"
  >("dashboard");
  // State for all datasets
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  // State for the currently selected dataset
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  // State for loading indicator
  const [loading, setLoading] = useState(true);

  // Load datasets on initial mount
  useEffect(() => {
    loadDatasets();
  }, []);

  // Fetch all datasets from the data service
  const loadDatasets = async () => {
    try {
      setLoading(true);
      const data = await dataService.getDatasets();
      setDatasets(data);
    } catch (error) {
      console.error("Failed to load datasets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle selection of a dataset and switch to chart view
  const handleDatasetSelect = async (datasetId: string) => {
    try {
      const dataset = await dataService.getDataset(datasetId);
      setSelectedDataset(dataset);
      setCurrentView("charts");
    } catch (error) {
      console.error("Failed to load dataset:", error);
    }
  };

  // Render content based on the current view
  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        // Show dashboard with list of datasets
        return (
          <Dashboard
            datasets={datasets}
            onDatasetSelect={handleDatasetSelect}
          />
        );
      case "charts":
        // Show chart view if a dataset is selected, otherwise prompt user
        return selectedDataset ? (
          <ChartView dataset={selectedDataset} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">
              Please select a dataset to visualize
            </p>
          </div>
        );
      case "data":
        // Show data manager for managing datasets
        return (
          <DataManager datasets={datasets} onDatasetChange={loadDatasets} />
        );
      default:
        // Fallback to dashboard
        return (
          <Dashboard
            datasets={datasets}
            onDatasetSelect={handleDatasetSelect}
          />
        );
    }
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  // Main app layout with header, sidebar, main content, and toaster notifications
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          },
        }}
      />
    </div>
  );
}

export default App;
