import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { User, Mail, MapPin, Award, Briefcase } from "lucide-react";

export default function Profile() {
  const { applicantId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const r = await api.get(`/applicants/${applicantId}`);
        setData(r.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [applicantId]);

  if (loading)
    return <div className="p-6 text-gray-600 dark:text-gray-300">Loading...</div>;
  if (!data)
    return <div className="p-6 text-gray-600 dark:text-gray-300">No profile found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow hover:shadow-lg transition">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-teal-500 text-white text-2xl font-bold shadow-md">
            {data.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" /> {data.name}
            </h1>
            <div className="text-gray-600 dark:text-gray-300 flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4" /> {data.email}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-slate-50 dark:bg-gray-700 rounded-xl border dark:border-gray-600 flex flex-col hover:shadow-md transition">
            <div className="text-xs uppercase text-gray-500 dark:text-gray-400">AI Match Score</div>
            <div className="text-lg font-semibold text-teal-700 dark:text-teal-400">{data.score ?? "N/A"}</div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-gray-700 rounded-xl border dark:border-gray-600 flex flex-col hover:shadow-md transition">
            <div className="text-xs uppercase text-gray-500 dark:text-gray-400">Qualification</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-500" /> {data.qualifications || "—"}
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-gray-700 rounded-xl border dark:border-gray-600 flex flex-col hover:shadow-md transition">
            <div className="text-xs uppercase text-gray-500 dark:text-gray-400">Location</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-pink-500" /> {data.location || "—"}
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-gray-700 rounded-xl border dark:border-gray-600 flex flex-col hover:shadow-md transition">
            <div className="text-xs uppercase text-gray-500 dark:text-gray-400">Social Category</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">{data.social_category || "—"}</div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-gray-700 rounded-xl border dark:border-gray-600 flex flex-col hover:shadow-md transition">
            <div className="text-xs uppercase text-gray-500 dark:text-gray-400">Rural / Aspirational District</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">{data.rural ? "Yes" : "No"}</div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-gray-700 rounded-xl border dark:border-gray-600 flex flex-col hover:shadow-md transition">
            <div className="text-xs uppercase text-gray-500 dark:text-gray-400">Past Participation</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">{data.past_participation ? "Yes" : "No"}</div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Skills</div>
          <div className="flex flex-wrap gap-2">
            {(data.skills || []).map((s) => (
              <span
                key={s}
                className="px-3 py-1 bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-full text-sm hover:bg-teal-100 dark:hover:bg-teal-800 transition"
              >
                {s}
              </span>
            ))}
            {(!data.skills || data.skills.length === 0) && (
              <span className="text-gray-400 dark:text-gray-500">No skills listed</span>
            )}
          </div>
        </div>

        {/* Sector Interests */}
        <div>
          <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-500" /> Sector Interests
          </div>
          <div className="flex flex-wrap gap-2">
            {(data.sector_interests || []).map((s) => (
              <span
                key={s}
                className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-full text-sm hover:bg-indigo-100 dark:hover:bg-indigo-800 transition"
              >
                {s}
              </span>
            ))}
            {(!data.sector_interests || data.sector_interests.length === 0) && (
              <span className="text-gray-400 dark:text-gray-500">No sector interests listed</span>
            )}
          </div>
        </div>

        {/* Resume (optional) */}
        {data.resume_url && (
          <div className="mt-6">
            <a
              href={data.resume_url}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-5 py-2 bg-gradient-to-r from-indigo-600 to-teal-600 text-white rounded-lg shadow hover:shadow-lg hover:scale-105 transition-transform"
            >
              Download Resume
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
