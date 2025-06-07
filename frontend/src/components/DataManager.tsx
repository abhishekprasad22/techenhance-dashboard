import React, { useState } from "react";
import { Upload, Plus, Trash2, Download, FileText, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { Dataset } from "../types";
import { dataService } from "../services/dataService";

interface DataManagerProps {
  datasets: Dataset[];
  onDatasetChange: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({
  datasets,
  onDatasetChange,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      toast.error("Please select a CSV file");
      return;
    }

    setIsUploading(true);
    try {
      await dataService.uploadCSV(file);
      toast.success("Dataset uploaded successfully!");
      onDatasetChange();
    } catch (error) {
      toast.error("Failed to upload dataset");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleDeleteDataset = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await dataService.deleteDataset(id);
      toast.success("Dataset deleted successfully");
      onDatasetChange();
    } catch (error) {
      toast.error("Failed to delete dataset");
      console.error("Delete error:", error);
    }
  };

  const generateSampleData = async (type: string, name: string) => {
    try {
      await dataService.generateData(type, { name, count: 50 });
      toast.success(`${name} generated successfully!`);
      onDatasetChange();
      setShowGenerator(false);
    } catch (error) {
      toast.error("Failed to generate data");
      console.error("Generation error:", error);
    }
  };

  const sampleDataTypes = [
    {
      type: "linear",
      name: "Linear Trend Data",
      description: "Dataset with linear progression",
    },
    {
      type: "normal",
      name: "Normal Distribution",
      description: "Bell curve distributed data",
    },
    {
      type: "exponential",
      name: "Exponential Growth",
      description: "Exponentially growing data",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Data Manager</h1>
          <p className="text-gray-400">
            Upload, manage, and organize your datasets
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowGenerator(true)}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <Zap size={16} />
            <span>Generate Data</span>
          </button>

          <label className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform">
            <Upload size={16} />
            <span>{isUploading ? "Uploading..." : "Upload CSV"}</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Sample Data Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-md w-full mx-4 animate-scale-in">
            <h3 className="text-xl font-semibold text-white mb-4">
              Generate Sample Data
            </h3>
            <div className="space-y-3">
              {sampleDataTypes.map((sample) => (
                <button
                  key={sample.type}
                  onClick={() => generateSampleData(sample.type, sample.name)}
                  className="w-full glass-button p-4 rounded-lg text-left hover:bg-white/20 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <Zap size={20} className="text-accent-400" />
                    <div>
                      <h4 className="font-medium text-white">{sample.name}</h4>
                      <p className="text-sm text-gray-400">
                        {sample.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowGenerator(false)}
              className="w-full mt-4 px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Datasets List */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Your Datasets</h2>
          <span className="text-sm text-gray-400">
            {datasets.length} datasets
          </span>
        </div>

        <div className="space-y-4">
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              className="glass-card p-4 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary-500/20 rounded-lg">
                    <FileText size={20} className="text-primary-400" />
                  </div>

                  <div>
                    <h3 className="font-medium text-white">{dataset.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                      <span>
                        {dataset.dataPoints || dataset.data?.length || 0} points
                      </span>
                      <span>•</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          dataset.type === "time_series"
                            ? "bg-blue-500/20 text-blue-300"
                            : dataset.type === "categorical"
                            ? "bg-purple-500/20 text-purple-300"
                            : dataset.type === "distribution"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {dataset.type.replace("_", " ")}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(dataset.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleDeleteDataset(dataset.id, dataset.name)
                    }
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2
                      size={16}
                      className="text-red-400 hover:text-red-300"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {datasets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 flex items-center justify-center">
              <Plus size={24} className="text-primary-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              No datasets yet
            </h3>
            <p className="text-gray-400 mb-6">
              Upload a CSV file or generate sample data to get started
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowGenerator(true)}
                className="glass-button px-6 py-3 rounded-lg flex items-center space-x-2"
              >
                <Zap size={16} />
                <span>Generate Sample</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataManager;
