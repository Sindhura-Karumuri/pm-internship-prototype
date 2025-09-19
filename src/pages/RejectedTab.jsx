// src/pages/RejectedTab.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { XCircle, Mail } from "lucide-react";

export default function RejectedTab() {
  const dept = localStorage.getItem("department_id");
  const [list, setList] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const r = await api.get(`/departments/${dept}/rejected`);
        setList(r.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load rejected candidates");
      }
    }
    load();
  }, [dept]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-8 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            Rejected Candidates
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Department: <span className="font-medium">{dept}</span>
          </p>
        </div>

        {/* Empty state */}
        {list.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-lg text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              No candidates rejected yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {list.map((c) => (
              <div
                key={c.email + c.post_id}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-center">
                  {/* Candidate Info */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {c.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" /> {c.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Post:{" "}
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {c.post_id}
                      </span>
                    </p>
                  </div>

                  {/* Status */}
                  <div className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 shadow-sm">
                    ❌ Rejected (Mail Sent)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
