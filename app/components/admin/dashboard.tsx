"use client";
import { motion } from "framer-motion";
import { fetchAllCandidatesAsync } from "@/app/redux/candidate/candidateSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fetchAllEmployersAsync } from "@/app/redux/employer/employerSlice";
import { fetchTotalApplicationsAsync} from "@/app/redux/jobApp/jobAppSlice";
import { fetchJobsStatsAsync } from "@/app/redux/jobs/jobSlice";
type JobData = { month: string; jobs: number };
type JobsData = Record<number, JobData[]>;
const jobsData: JobsData = {
  2024: [
    { month: "Jan", jobs: 20 },
    { month: "Feb", jobs: 35 },
    { month: "Mar", jobs: 50 },
    { month: "Apr", jobs: 40 },
    { month: "May", jobs: 70 },
    { month: "Jun", jobs: 100 },
    { month: "Jul", jobs: 65 },
    { month: "Aug", jobs: 80 },
    { month: "Sep", jobs: 90 },
    { month: "Oct", jobs: 120 },
    { month: "Nov", jobs: 75 },
    { month: "Dec", jobs: 95 },
  ],
  2025: [
    { month: "Jan", jobs: 40 },
    { month: "Feb", jobs: 55 },
    { month: "Mar", jobs: 75 },
    { month: "Apr", jobs: 60 },
    { month: "May", jobs: 90 },
    { month: "Jun", jobs: 120 },
    { month: "Jul", jobs: 100 },
    { month: "Aug", jobs: 140 },
    { month: "Sep", jobs: 160 },
    { month: "Oct", jobs: 180 },
    { month: "Nov", jobs: 200 },
    { month: "Dec", jobs: 220 },
  ],
};





export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  // Redux state
  const { candidates, loading, error } = useSelector(
    (state: RootState) => state.candidate
  );
  const { employers, loading: employerLoading } = useSelector(
    (state: RootState) => state.employer
  );
  const {  totalApplications, loading: appLoading } = useSelector(
    (state: RootState) => state.jobApplication
  );
 const { totalJobs, activeJobs, loading: jobsLoading } = useSelector(
    (state: RootState) => state.jobs
  );
  useEffect(() => {
    dispatch(fetchAllCandidatesAsync());
    dispatch(fetchAllEmployersAsync());
     dispatch(fetchTotalApplicationsAsync());
    dispatch(fetchJobsStatsAsync());
  }, [dispatch]);

  return (
    <div className="p-6 space-y-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Total Candidates */}
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm opacity-80">Total Candidates</h2>
          <p className="text-3xl font-bold mt-2">
            {loading ? "Loading..." : candidates?.length ?? 0}
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-sm opacity-80">Total Employers</h2>
          <p className="text-3xl font-bold mt-2">
            {employerLoading ? "Loading..." : employers?.length ?? 0}
          </p>
        </motion.div>
        <motion.div
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-sm opacity-80">Total Users</h2>
          <p className="text-3xl font-bold mt-2">
            {loading || employerLoading
              ? "Loading..."
              : (candidates?.length ?? 0) + (employers?.length ?? 0)}
          </p>
        </motion.div>

        {/* Active Jobs */}
        <motion.div
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-sm opacity-80">Active Jobs</h2>
            <p className="text-3xl font-bold mt-2">
            {jobsLoading ? "Loading..." : activeJobs ?? 0}
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-sm opacity-80">Applications</h2>
          <p className="text-3xl font-bold mt-2">
          {appLoading ? "Loading..." : totalApplications ?? 0}
          </p>
        </motion.div>
      </div>

      {/* Chart Section */}
      <motion.div
      className="bg-white p-6 rounded-2xl shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header with Year Selector */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Jobs Posted per Month</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {Object.keys(jobsData).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={jobsData[selectedYear]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="jobs" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600 text-sm">
                <th className="p-3">User</th>
                <th className="p-3">Action</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {/* Row 1 */}
              <tr className="border-b hover:bg-gray-50 transition">
                <td className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    J
                  </div>
                  John Doe
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    Created a Job
                  </span>
                </td>
                <td className="p-3 text-gray-500">2025-09-17</td>
              </tr>

              {/* Row 2 */}
              <tr className="border-b hover:bg-gray-50 transition">
                <td className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold">
                    J
                  </div>
                  Jane Smith
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    Applied for Developer
                  </span>
                </td>
                <td className="p-3 text-gray-500">2025-09-16</td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-gray-50 transition">
                <td className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                    M
                  </div>
                  Michael Lee
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                    Updated Profile
                  </span>
                </td>
                <td className="p-3 text-gray-500">2025-09-15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
