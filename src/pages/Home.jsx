import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  HeartPulse,
  ShoppingBag,
  Hotel,
  Factory,
  Droplet,
  Landmark,
  Moon,
  Sun
} from "lucide-react";

const categories = [
  { name: "IT & Software", icon: <Briefcase className="w-6 h-6 text-teal-600" /> },
  { name: "Banking & Finance", icon: <Landmark className="w-6 h-6 text-indigo-600" /> },
  { name: "FMCG", icon: <ShoppingBag className="w-6 h-6 text-pink-600" /> },
  { name: "Oil & Gas", icon: <Droplet className="w-6 h-6 text-orange-600" /> },
  { name: "Manufacturing", icon: <Factory className="w-6 h-6 text-yellow-600" /> },
  { name: "Healthcare", icon: <HeartPulse className="w-6 h-6 text-red-600" /> },
  { name: "Retail", icon: <Building2 className="w-6 h-6 text-purple-600" /> },
  { name: "Hospitality", icon: <Hotel className="w-6 h-6 text-blue-600" /> },
];

export default function Home() {
  const nav = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Add/remove `dark` class to <html> when toggled
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-teal-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors">
      {/* Top gradient bar */}
      <div className="h-1 bg-gradient-to-r from-teal-500 to-indigo-600"></div>

      {/* Header */}
      <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-xl flex items-center justify-center shadow">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              INTERNSYNC - SmartMatch
            </span>
          </div>

          <div className="flex items-center gap-4">
            <nav className="text-sm text-gray-600 dark:text-gray-400 italic">
              Smart AI-based allocation engine
            </nav>
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="py-16 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Welcome to the PM Internship Portal
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Explore top departments and manage internships with{" "}
          <span className="font-semibold">AI-powered Smart Matching</span>.
        </p>
      </section>

      {/* Main content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-10 text-gray-800 dark:text-gray-100 text-center">
          Explore Departments
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => nav(`/auth?category=${encodeURIComponent(cat.name)}`)}
              className="group relative p-6 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-teal-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 group-hover:scale-110 transition transform">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-teal-600 transition">
                  {cat.name}
                </h3>
              </div>

              <div className="mt-6">
                <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-sm group-hover:shadow-md transition">
                  Click to login as HR
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/70 dark:bg-gray-900/70 backdrop-blur border-t shadow-sm mt-8">
        <div className="max-w-6xl mx-auto p-4 text-sm text-gray-600 dark:text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© {new Date().getFullYear()} PM Internship Scheme</span>
          <a
            className="text-teal-700 dark:text-teal-400 font-medium hover:underline"
            href="https://mca.gov.in"
            target="_blank"
            rel="noreferrer"
          >
            Ministry of Corporate Affairs
          </a>
        </div>
      </footer>
    </div>
  );
}
