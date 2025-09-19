import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api"; // axios instance with baseURL

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function HRAuth() {
  const q = useQuery();
  const category = q.get("category") || "General";
  const nav = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    department_id: category.replace(/\s+/g, "_"),
  });

  async function submit(e) {
    e.preventDefault();
    try {
      if (isRegister) {
        await api.post("/auth/register", form);
        alert("✅ Registered successfully! Now log in.");
        setIsRegister(false);
      } else {
        const res = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("department_id", res.data.department_id);
        localStorage.setItem("hr_name", res.data.name);
        nav("/hr/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Auth error: " + (err?.response?.data?.detail || err.message));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors p-6">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition">
        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-2 text-center bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
          {isRegister ? "HR Register" : "HR Login"}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
          Category:{" "}
          <span className="font-semibold text-teal-700 dark:text-teal-400">
            {category}
          </span>
        </p>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {isRegister && (
            <>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
                className="w-full px-4 py-3 border rounded-lg bg-white/60 dark:bg-gray-800/60 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition"
              />
              <input
                required
                value={form.department_id}
                onChange={(e) =>
                  setForm({ ...form, department_id: e.target.value })
                }
                placeholder="Department ID"
                className="w-full px-4 py-3 border rounded-lg bg-white/60 dark:bg-gray-800/60 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition"
              />
            </>
          )}
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-lg bg-white/60 dark:bg-gray-800/60 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition"
          />
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg bg-white/60 dark:bg-gray-800/60 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-sm text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-teal-700 dark:text-teal-400 hover:underline font-medium transition"
          >
            {isRegister
              ? "Already have an account? Login"
              : "New user? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
