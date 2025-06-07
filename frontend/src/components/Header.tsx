import React from "react";
import { BarChart3, Sparkles } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="glass-card border-b border-white/10 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <BarChart3 size={32} className="text-primary-400" />
            <Sparkles
              size={16}
              className="absolute -top-1 -right-1 text-accent-400"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">
              Data Visualizer
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
