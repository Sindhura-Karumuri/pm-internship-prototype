import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HRAuth from "./pages/HRAuth";
import HRDashboard from "./pages/HRDashboard";
import PostDetail from "./pages/PostDetail";
import SelectedTab from "./pages/SelectedTab";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import RejectedTab from "./pages/RejectedTab";
import { AlertCircle } from "lucide-react";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-emerald-50 dark:from-gray-900 dark:via-slate-900 dark:to-emerald-950 transition-colors">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<HRAuth />} />

          {/* Protected HR routes */}
          <Route
            path="/hr/dashboard"
            element={
              <ProtectedRoute>
                <HRDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/posts/:postId"
            element={
              <ProtectedRoute>
                <PostDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/selected"
            element={
              <ProtectedRoute>
                <SelectedTab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/rejected"
            element={
              <ProtectedRoute>
                <RejectedTab />
              </ProtectedRoute>
            }
          />

          {/* Public profile view */}
          <Route path="/profile/:applicantId" element={<Profile />} />

          {/* Fallback 404 */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-screen text-center p-10">
                <AlertCircle className="w-16 h-16 text-red-500 mb-6 animate-bounce" />
                <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-2">
                  404
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Page Not Found
                </p>
                <a
                  href="/"
                  className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition-all transform hover:scale-105"
                >
                  Go Back Home
                </a>
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
