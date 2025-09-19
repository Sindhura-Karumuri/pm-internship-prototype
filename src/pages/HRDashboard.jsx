// src/pages/HRDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ThemeToggle from "../components/ThemeToggle";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function HRDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const deptId = localStorage.getItem("department_id");
  const hrName = localStorage.getItem("hr_name") || "HR";

  const nav = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/departments/${deptId}/posts`);
        setPosts(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch posts: " + (err?.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [deptId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );

  // Chart data
  const statsData = {
    labels: posts.map((p) => p.title),
    datasets: [
      {
        label: "Positions Filled",
        data: posts.map((p) => p.positions_filled),
        backgroundColor: "rgba(34,197,94,0.7)",
      },
      {
        label: "Total Positions",
        data: posts.map((p) => p.positions),
        backgroundColor: "rgba(59,130,246,0.7)",
      },
    ],
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="grid gap-6">
            {posts.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                No posts yet — create one.
              </div>
            )}
            {posts.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                      {p.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {p.stipend && (
                        <span className="px-3 py-1 text-xs rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
                          💰 Stipend: {p.stipend}
                        </span>
                      )}
                      {p.location_preference && (
                        <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700">
                          📍 Location: {p.location_preference}
                        </span>
                      )}
                      {p.sector && (
                        <span className="px-3 py-1 text-xs rounded-full bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-700">
                          🏢 Sector: {p.sector}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Positions: <b>{p.positions}</b>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Filled: <b>{p.positions_filled}</b>
                    </div>
                    <button
                      onClick={() => nav(`/hr/posts/${p.id}`)}
                      className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-medium shadow hover:shadow-lg transform hover:scale-105 transition"
                    >
                      View Applicants
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case "profile":
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow max-w-xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Profile
            </h2>
            <p className="text-gray-700 dark:text-gray-300">👤 Name: {hrName}</p>
            <p className="text-gray-700 dark:text-gray-300">🏢 Department ID: {deptId}</p>
          </div>
        );
      case "notifications":
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow max-w-xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Notifications
            </h2>
            <p className="text-gray-600 dark:text-gray-400">No new notifications</p>
          </div>
        );
      case "statistics":
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Statistics
            </h2>
            <Bar data={statsData} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-20 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
            Menu
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <FiX size={22} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-2">
          {["dashboard", "profile", "notifications", "statistics"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSidebarOpen(false);
              }}
              className={`text-left px-4 py-2 rounded-lg transition ${
                activeTab === tab
                  ? "bg-teal-600 text-white shadow"
                  : "hover:bg-teal-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b dark:border-gray-700 sticky top-0 z-10 shadow-sm flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            >
              <FiMenu size={22} className="text-gray-600 dark:text-gray-300" />
            </button>
            <span className="text-gray-800 dark:text-gray-100 font-semibold text-lg">
              INTERNSYNC - SmartMatch
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Hi, {hrName}
            </span>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Selected & Rejected */}
            <button
              onClick={() => nav("/hr/selected")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-teal-600 text-white font-medium shadow hover:shadow-lg transform hover:scale-105 transition"
            >
              Selected
            </button>
            <button
              onClick={() => nav("/hr/rejected")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium shadow hover:shadow-lg transform hover:scale-105 transition"
            >
              Rejected
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 flex-1">{renderContent()}</main>

        {/* Footer */}
        <footer className="bg-white/90 dark:bg-gray-900/90 backdrop-blur border-t dark:border-gray-700 shadow-sm p-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          © {new Date().getFullYear()} PM Internship Scheme |{" "}
          <a
            className="text-teal-700 dark:text-teal-400 font-medium hover:underline"
            href="https://mca.gov.in"
            target="_blank"
            rel="noreferrer"
          >
            Ministry of Corporate Affairs
          </a>
        </footer>
      </div>
    </div>
  );
}
