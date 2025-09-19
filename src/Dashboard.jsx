// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Briefcase, Users, DollarSign } from "lucide-react";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const token = localStorage.getItem("token");
      const deptId = localStorage.getItem("department_id");

      try {
        const res = await fetch(
          `http://localhost:8000/departments/${deptId}/posts`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to load posts");

        setPosts(data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch posts: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-50 to-emerald-50 dark:from-gray-900 dark:via-slate-900 dark:to-emerald-950">
        <p className="text-gray-600 dark:text-gray-300 animate-pulse text-lg">
          Loading HR Dashboard...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-emerald-50 dark:from-gray-900 dark:via-slate-900 dark:to-emerald-950 p-10 transition-colors">
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-10 text-center">
        HR Dashboard
      </h1>

      {posts.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-14">
          No posts available. Create a new post to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all transform hover:scale-[1.02] flex flex-col justify-between"
            >
              {/* Title */}
              <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> {p.title}
              </h2>

              {/* Description */}
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                {p.description}
              </p>

              {/* Details */}
              <div className="space-y-2 mt-auto">
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium">Stipend:</span>{" "}
                  {p.stipend || "—"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-medium">Positions:</span> {p.positions}{" "}
                  | <span className="font-medium">Filled:</span>{" "}
                  {p.positions_filled ?? 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
