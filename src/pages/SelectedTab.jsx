// src/pages/SelectedTab.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Download, Calendar, XCircle, ClipboardList } from "lucide-react";

export default function SelectedTab() {
  const dept = localStorage.getItem("department_id");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meetingsByPost, setMeetingsByPost] = useState({});

  useEffect(() => {
    load();
  }, [dept]);

  async function load() {
    if (!dept) return;
    setLoading(true);
    try {
      const r = await api.get(`/departments/${dept}/selected`);
      setList(r.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load selected candidates");
    } finally {
      setLoading(false);
    }
  }

  function safeDateDisplay(isoString) {
    if (!isoString) return "—";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) {
        const d2 = new Date(isoString.replace(" ", "T"));
        return isNaN(d2.getTime()) ? isoString : d2.toLocaleString();
      }
      return d.toLocaleString();
    } catch {
      return isoString;
    }
  }

  async function downloadCSV() {
    try {
      const r = await api.get(`/departments/${dept}/selected/export`, {
        responseType: "blob",
      });
      const blob = new Blob([r.data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `selected_${dept}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  }

  async function scheduleMeet(postId, applicantId) {
    const datetime = prompt(
      "Enter meeting datetime (ISO or 'YYYY-MM-DD HH:mm'):"
    );
    if (!datetime) return;
    try {
      await api.post(`/posts/${postId}/schedule`, {
        applicant_id: applicantId,
        datetime_iso: datetime,
      });
      alert("Meeting scheduled successfully.");
      await loadMeetingsForPost(postId);
    } catch (err) {
      console.error(err);
      alert("Scheduling failed: " + (err?.response?.data?.detail || err.message));
    }
  }

  async function rejectCandidate(postId, applicantId) {
    if (!window.confirm("Are you sure you want to reject this candidate?")) return;
    try {
      await api.post(`/posts/${postId}/reject`, { applicant_id: applicantId });
      alert("Candidate rejected.");
      load(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Rejection failed: " + (err?.response?.data?.detail || err.message));
    }
  }

  async function loadMeetingsForPost(postId) {
    try {
      const r = await api.get(`/posts/${postId}/meetings`);
      setMeetingsByPost((prev) => ({ ...prev, [postId]: r.data || [] }));
    } catch (err) {
      console.error(err);
      alert("Failed to load meetings for post");
    }
  }

  if (!dept) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center text-gray-600 dark:text-gray-400">
          Department not set. Please login again.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center text-gray-600 dark:text-gray-400 animate-pulse">
          Loading candidates...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-emerald-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-10 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <ClipboardList className="w-7 h-7 text-emerald-600" />
              Selected Candidates
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Department:{" "}
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {dept}
              </span>
            </p>
          </div>

          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md transition-all transform hover:scale-105"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Empty State */}
        {list.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-14 rounded-2xl shadow-md text-center text-gray-500 dark:text-gray-400">
            No candidates selected yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {list.map((s) => (
              <div
                key={s.id + s.post_id}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:scale-[1.01] border border-gray-100 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  {/* Candidate Info */}
                  <div className="flex-1 pr-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      {s.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {s.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Post:{" "}
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {s.post_id}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Selected at:{" "}
                      <span className="font-medium text-emerald-700 dark:text-emerald-400">
                        {safeDateDisplay(s.selected_at)}
                      </span>
                    </p>

                    {s.job_description ? (
                      <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                        <strong className="text-gray-800 dark:text-gray-100">
                          Job description:
                        </strong>
                        <div className="mt-1 text-gray-600 dark:text-gray-400 leading-relaxed">
                          {s.job_description}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 text-sm text-gray-400 italic">
                        No job description available.
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 items-end">
                    <button
                      onClick={() => scheduleMeet(s.post_id, s.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-all text-sm"
                    >
                      <Calendar className="w-4 h-4" /> Schedule Meet
                    </button>

                    <button
                      onClick={() => rejectCandidate(s.post_id, s.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-all text-sm"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>

                    <button
                      onClick={() => loadMeetingsForPost(s.post_id)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm rounded-lg shadow-sm"
                    >
                      View Meetings
                    </button>
                  </div>
                </div>

                {/* Meetings */}
                {meetingsByPost[s.post_id] &&
                  meetingsByPost[s.post_id].length > 0 && (
                    <div className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Scheduled Meetings
                      </h4>
                      <div className="space-y-2">
                        {meetingsByPost[s.post_id].map((m) => (
                          <div
                            key={m.meeting_id}
                            className="flex justify-between items-center bg-slate-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <div className="text-sm text-gray-700 dark:text-gray-200">
                              {m.applicant_id} — {safeDateDisplay(m.datetime)}{" "}
                              {m.note ? `· ${m.note}` : ""}
                            </div>
                            <a
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                              href={m.join_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Join
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
