
import { Link } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="glass-card w-full p-8 rounded-2xl shadow-xl text-center animate-fade-in space-y-6">
        <DotLottieReact
          src="https://lottie.host/5f9b635f-2d9d-46c8-bdd9-8522261a8c08/DD7xAgTVSK.lottie"
          loop
          autoplay
          style={{ height: "500px",width:"600px", margin: "0 auto" }}
        />
        <h2 className="text-3xl font-bold text-white">Page Not Found</h2>
         <p className="text-gray-400 mb-6">
           We couldn’t find the page you were looking for. It might have been removed or relocated.
         </p>

         <Link
           to="/"
           className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-500/20 border border-primary-500/50 text-white hover:scale-105 transition-all"
         >
           <ArrowLeftCircle size={20} />
           <span>Back to Home</span>
         </Link>
       </div>
      </div> 
  );
};

export default PageNotFound;


