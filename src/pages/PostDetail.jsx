import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const deptId = localStorage.getItem("department_id");
  const token = localStorage.getItem("token");
  const [post, setPost] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matched, setMatched] = useState(null);
  const [topApplicants, setTopApplicants] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [tieLinks, setTieLinks] = useState({});
  const [matchOption, setMatchOption] = useState("20%");
  const [emailPreview, setEmailPreview] = useState(null);
  const [sendingEmails, setSendingEmails] = useState(false);

  const API_BASE = "http://localhost:8000";

  // Load post and applicants
  useEffect(() => {
    async function load() {
      try {
        const r1 = await api.get(`/posts/${postId}`);
        setPost(r1.data);
        const r2 = await api.get(`/departments/${deptId}/posts/${postId}/applicants`);
        setApps(r2.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load post or applicants");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [postId, deptId]);

  // AI match
  async function runMatch(option) {
    try {
      const r = await api.post(`/posts/${postId}/match`, { mode: option });
      let top = r.data?.matched_top ?? [];

      if (top.length === 0) {
        top = [...apps].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      }

      if (option === "positions") {
        const numPositions = post?.positions ?? 0;
        setTopApplicants(top.slice(0, numPositions));
      } else {
        const percent = parseInt(option.replace("%", ""));
        const count = Math.ceil((percent / 100) * top.length);
        setTopApplicants(top.slice(0, count));
      }

      setMatched(r.data);
    } catch (err) {
      console.error(err);
      alert("AI match failed: " + (err?.response?.data?.detail || err.message));
    }
  }

  // Send emails
  async function sendEmails() {
    try {
      setSendingEmails(true);
      let method, value;
      if (matchOption === "positions") {
        method = "positions";
        value = post?.positions ?? 0;
      } else {
        method = "top_percent";
        value = parseInt(matchOption.replace("%", ""));
      }

      const url = `/posts/${postId}/send_top_emails?method=${method}&value=${value}`;
      const res = await api.post(url);

      // Open each email in a new tab
      res.data.emails.forEach((e) => {
        const newWindow = window.open("", "_blank", "width=800,height=700,scrollbars=yes");
        newWindow.document.write(`
          <html>
            <head>
              <title>Email to ${e.to}</title>
              <style>
                body { font-family: sans-serif; padding: 20px; background: #f9fafb; color: #111827; margin:0; }
                h2 { font-size: 1.5rem; margin-bottom: 10px; }
                p { margin: 5px 0; }
                textarea { width: 100%; height: 300px; padding: 12px; border-radius: 12px; border: 1px solid #d1d5db; background: #f3f4f6; color: #111827; resize: vertical; }
                button { padding: 10px 20px; background: linear-gradient(to right, #3b82f6, #6366f1); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 500; transition: 0.3s; }
                button:hover { transform: scale(1.05); }
              </style>
            </head>
            <body>
              <h2>✉️ Send Email</h2>
              <p><strong>To:</strong> ${e.to}</p>
              <p><strong>Subject:</strong> ${e.subject}</p>
              <textarea readonly>${e.body}</textarea>
              <button onclick="window.close()">Close</button>
            </body>
          </html>
        `);
      });

      setEmailPreview({
        content: res.data.emails.map(
          (e) => `To: ${e.to}\nSubject: ${e.subject}\nBody:\n${e.body}\n\n---\n`
        ).join(""),
        applicant_ids: res.data.emails.map(e => e.applicant_id)
      });

    } catch (err) {
      console.error(err);
      alert("Failed to send top emails: " + (err?.response?.data?.detail || err.message));
    } finally {
      setSendingEmails(false);
    }
  }

  // Select/Reject applicant
  async function selectApplicant(appId) {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ applicant_id: appId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to select candidate");
      alert(`Candidate ${data.candidate.name} selected!`);
      reloadApplicants();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  async function rejectApplicant(appId) {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ applicant_id: appId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to reject candidate");
      alert(`Candidate ${data.candidate.name} rejected!`);
      reloadApplicants();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  async function reloadApplicants() {
    const r = await api.get(`/departments/${deptId}/posts/${postId}/applicants`);
    setApps(r.data);
    const rp = await api.get(`/posts/${postId}`);
    setPost(rp.data);
  }

  // Schedule interview
  async function scheduleInterview(appId) {
    const dt = prompt("Enter ISO datetime for interview (e.g. 2025-09-20T14:00:00)");
    if (!dt) return;
    const res = await api.post(`/posts/${postId}/schedule`, {
      applicant_id: appId,
      datetime_iso: dt,
      note: "Interview scheduled",
    });
    try { await navigator.clipboard.writeText(res.data.join_url); } catch (e) {}
    const m = await api.get(`/posts/${postId}/meetings`);
    setMeetings(m.data);
    alert("Interview scheduled. Join link copied to clipboard.");
  }

  // Tie-break
  async function createTieBreak() {
    const url = prompt("Enter custom tie-break test URL (optional):");
    try {
      const r = await api.post(`/posts/${postId}/tiebreak`, { custom_link: url });
      setTieLinks(r.data.links || {});
      alert(`Created ${r.data.created} tie-break tests for score ${r.data.score}`);
    } catch (e) {
      console.error(e);
      alert("Failed to create tie-break tests");
    }
  }

  async function sendTieBreakEmails() {
    try {
      if (!tieLinks || Object.keys(tieLinks).length === 0) {
        alert("No tie-break tests created yet.");
        return;
      }
      const r = await api.post(`/posts/${postId}/tiebreak/send`, { links: tieLinks });
      alert(`Tie-break emails sent to ${r.data.sent_count} applicants`);
    } catch (err) {
      console.error(err);
      alert("Failed to send tie-break emails: " + (err?.response?.data?.detail || err.message));
    }
  }

  if (loading) return <div className="p-6 text-gray-600 dark:text-gray-300">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-300">
      {/* Post Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{post?.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{post?.description}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border border-teal-300">Stipend: {post?.stipend || "—"}</span>
          <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border border-indigo-300">Positions: {post?.positions}</span>
          <span className="px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 border border-pink-300">Filled: {post?.positions_filled}</span>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <select
            value={matchOption}
            onChange={(e) => setMatchOption(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            <option value="20%">Top 20%</option>
            <option value="30%">Top 30%</option>
            <option value="positions">By No. of Positions</option>
          </select>

          <button onClick={() => runMatch(matchOption)} className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-teal-600 text-white font-medium shadow hover:scale-105 transition-transform">Run AI Match</button>

          <button onClick={sendEmails} className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium shadow hover:bg-green-700 transition">
            {sendingEmails ? "Sending..." : "Send Emails"}
          </button>

          <button onClick={createTieBreak} className="px-5 py-2 rounded-lg bg-amber-500 text-white font-medium shadow hover:bg-amber-600 transition">Generate Tie-break Tests</button>
          <button onClick={sendTieBreakEmails} className="px-5 py-2 rounded-lg bg-purple-600 text-white font-medium shadow hover:bg-purple-700 transition">Send Tie-break Emails</button>
          <button onClick={() => window.history.back()} className="px-5 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition">Back</button>
        </div>
      </div>

      {/* Applicants */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">All Applicants</h2>
      <div className="grid gap-4">
        {apps.map((a) => (
          <div key={a.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-md transition flex justify-between items-start">
            <div>
              <div className="font-semibold text-lg text-gray-800 dark:text-gray-100">{a.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{a.email}</div>
              <div className="text-sm mt-1 text-gray-700 dark:text-gray-400">Skills: {(a.skills || []).join(", ") || "—"}</div>
              <div className="text-sm mt-1">Score: <span className="font-medium text-teal-700 dark:text-teal-400">{a.score ?? "N/A"}</span></div>
              {a.status === "selected" && <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 rounded">Selected</span>}
              {a.status === "rejected" && <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 rounded">Rejected</span>}
            </div>
            <div className="flex flex-col gap-2">
              {/* Modified: use SPA navigation */}
              <button onClick={() => navigate(`/profile/${a.id}`)} className="px-3 py-1 text-sm border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                View Profile
              </button>
              {a.status !== "selected" && a.status !== "rejected" && (
                <>
                  <button onClick={() => selectApplicant(a.id)} className="px-3 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 transition">Select</button>
                  <button onClick={() => rejectApplicant(a.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition">Reject</button>
                </>
              )}
              <button onClick={() => scheduleInterview(a.id)} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition">Schedule</button>
            </div>
          </div>
        ))}
      </div>

      {/* Meetings */}
      {meetings.length > 0 && (
        <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Scheduled Meetings</h3>
          <div className="space-y-2">
            {meetings.map((m) => (
              <div key={m.meeting_id} className="flex justify-between items-center border-b pb-2 border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-700 dark:text-gray-300">Applicant {m.applicant_id} — {m.datetime}</div>
                <a className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition" href={m.join_url} target="_blank" rel="noreferrer">Join</a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email Preview */}
      {emailPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[90%] max-w-2xl shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Email Preview</h3>
            <pre className="text-sm bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 p-4 rounded overflow-x-auto">{emailPreview.content}</pre>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setEmailPreview(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Close</button>
              <button
                onClick={() => {
                  try {
                    emailPreview.content.split('---').forEach((emailBlock, index) => {
                      const newWin = window.open("", `_blank${index}`);
                      newWin.document.write(`<pre>${emailBlock}</pre>`);
                      newWin.document.title = `Email Preview ${index + 1}`;
                    });
                    alert(`Opened ${emailPreview.applicant_ids.length} emails in new tabs`);
                    setEmailPreview(null);
                  } catch (err) {
                    console.error(err);
                    alert("Failed to open emails in new tabs");
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Send Emails
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
