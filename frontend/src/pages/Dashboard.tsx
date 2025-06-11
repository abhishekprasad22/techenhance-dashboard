import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DashboardView from '../components/Dashboard';
import ChartView from '../components/ChartView';
import DataManager from '../components/DataManager';
import { Dataset } from '../types';
import { dataService } from '../services/dataService';

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'charts' | 'data'>('dashboard');
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const data = await dataService.getDatasets();
      setDatasets(data);
    } catch (error) {
      console.error('Failed to load datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDatasetSelect = async (datasetId: string) => {
    try {
      const dataset = await dataService.getDataset(datasetId);
      setSelectedDataset(dataset);
      setCurrentView('charts');
    } catch (error) {
      console.error('Failed to load dataset:', error);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView datasets={datasets} onDatasetSelect={handleDatasetSelect} />;
      case 'charts':
        return selectedDataset ? (
          <ChartView dataset={selectedDataset} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Please select a dataset to visualize</p>
          </div>
        );
      case 'data':
        return <DataManager datasets={datasets} onDatasetChange={loadDatasets} />;
      default:
        return <DashboardView datasets={datasets} onDatasetSelect={handleDatasetSelect} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={renderContent()} />
              <Route path="/*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;