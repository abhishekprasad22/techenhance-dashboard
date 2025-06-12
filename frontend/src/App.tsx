import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ChartView from "./components/ChartView";
import DataManager from "./components/DataManager";
import Recommendations from "./components/Recommendations.tsx";
import { Dataset } from "./types";
import { dataService } from "./services/dataService";
import { BrowserRouter, Route, Routes ,useNavigate} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Login from "./components/Login.tsx";
import { supabase } from "./supabaseClient.ts";

function App() {
  //const navigate = useNavigate();
  // State for current view: dashboard, charts, or data manager
  const [currentView, setCurrentView] = useState<
    "dashboard" | "charts" | "data" | "recommendations"
  >("dashboard");
  // State for all datasets
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  // State for the currently selected dataset
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  // State for loading indicator
  const [loading, setLoading] = useState(true);
//   useEffect(() => {
//   const url = new URL(window.location.href);
//   const code = url.searchParams.get("code");

//   if (code) {
//     supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
//       if (error) {
//         console.error("Failed to exchange code:", error);
//       } else {
//         console.log("Exchanged session:", data.session);
//         // ✅ Session will now be stored in localStorage
//       }
//     });
//   }
// }, []);


  // Load datasets on initial mount
  useEffect(() => {
    loadDatasets();
  }, []);

//   useEffect(() => {
//   supabase.auth.getSession().then(({ data: { session } }) => {
//     if (session) {
//       console.log("✅ Session restored after Google login", session);
//       navigate("/"); // or wherever you want
//     }
//   });

//   const {
//     data: { subscription },
//   } = supabase.auth.onAuthStateChange((_event, session) => {
//     if (session) {
//       console.log("🔄 Auth state changed:", session);
//       navigate("/dashboard");
//     }
//   });

//   return () => subscription.unsubscribe();
// }, []);


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
  // useEffect(()=>{
  //   renderContent();
  // },[currentView]);


  // //Render content based on the current view
  // const renderContent = () => {
  //   switch (currentView) {
  //     case "dashboard":
  //       navigate("/");
  //       break;
  //     case "charts":
  //       navigate("/charts");
  //       break;
  //     case "data":
  //       // Show data manager for managing datasets
  //       navigate("/data");
  //       break;
  //     case "recommendations":
  //       // Placeholder for recommendations view
  //       navigate("/recommendations");
  //       break;
  //     default:
  //       // Fallback to dashboard
  //       navigate("/");
  //       break;
  //   }
  // };

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
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard
                      datasets={datasets}
                      onDatasetSelect={handleDatasetSelect}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/charts"
                element={
                  <ProtectedRoute>
                    {selectedDataset ? (
                      <ChartView dataset={selectedDataset} />
                    ) : (
                      <div className="flex items-center justify-center h-64">
                        <p className="text-gray-400">
                        Please select a dataset to visualize
                        </p>
                      </div>
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/data"
                element={
                  <ProtectedRoute>
                    <DataManager datasets={datasets} onDatasetChange={loadDatasets} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recommendations"
                element={
                  <ProtectedRoute>
                    <Recommendations />
                  </ProtectedRoute>
                }
              />
            </Routes>
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
