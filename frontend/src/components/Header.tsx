import React from "react";
import { BarChart3, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed");
    } else {
      toast.success("Logged out");
      localStorage.clear();
      navigate("/login");
    }
  };

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

        {/* Right side: Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
