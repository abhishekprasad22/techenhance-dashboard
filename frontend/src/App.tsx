import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import LoadingSpinner from "./components/LoadingSpinner";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <>{children}</> : <Navigate to="/" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              }
            />
            <Route
              path="/auth"
              element={
                <PublicRoute>
                  <AuthPage />
                </PublicRoute>
              }
            />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>

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
      </Router>
    </AuthProvider>
  );
}

export default App;

// import React from "react";
// import {
//   createBrowserRouter,
//   RouterProvider,
//   createRoutesFromElements,
//   Route,
// } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext";
// import { useAuth } from "./contexts/AuthContext";
// import LandingPage from "./pages/LandingPage";
// import AuthPage from "./pages/AuthPage";
// import Dashboard from "./pages/Dashboard";
// import AuthCallback from "./pages/AuthCallback";
// import LoadingSpinner from "./components/LoadingSpinner";

// // Add error boundary
// class ErrorBoundary extends React.Component<
//   { children: React.ReactNode },
//   { hasError: boolean }
// > {
//   constructor(props: { children: React.ReactNode }) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div>Something went wrong. Please refresh the page.</div>;
//     }
//     return this.props.children;
//   }
// }

// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (!user) {
//     return <Navigate to="/auth" replace />;
//   }

//   return <>{children}</>;
// };

// const router = createBrowserRouter(
//   [
//     {
//       path: "/",
//       element: <LandingPage />,
//     },
//     {
//       path: "/auth",
//       element: <AuthPage />,
//     },
//     {
//       path: "/auth/callback",
//       element: <AuthCallback />,
//     },
//     {
//       path: "/dashboard/*",
//       element: (
//         <ProtectedRoute>
//           <Dashboard />
//         </ProtectedRoute>
//       ),
//     },
//   ],
//   {
//     future: {
//       v7_startTransition: true,
//       v7_relativeSplatPath: true,
//     },
//   }
// );

// function App() {
//   return (
//     <ErrorBoundary>
//       <AuthProvider>
//         <RouterProvider router={router} />
//       </AuthProvider>
//     </ErrorBoundary>
//   );
// }

// export default App;
