"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { getUserIdFromToken } from "@/app/lib/authUtils";
import { fetchJobsAsync, totalActiveJobsAsync } from "@/app/redux/jobs/jobSlice";
import { fetchJobAppAsync } from "@/app/redux/jobApp/jobAppSlice";

export default function EmployerDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Extract Redux state
  const { jobs, loading, error, totalActiveJobs } = useSelector(
    (state: RootState) => state.jobs
  );
  const { jobApplications } = useSelector((state: RootState) => state.jobApplication);
console.log("these are jobs",jobs)
console.log("these are jobApplications",jobApplications)
  useEffect(() => {
    const userId = getUserIdFromToken();
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      alert("User not authenticated.");
      return;
    }
    if (!userId) {
      alert("User not authenticated");
      return;
    }

    dispatch(fetchJobsAsync(userId));
    dispatch(fetchJobAppAsync({ employer_id: userId, authToken }));
    dispatch(totalActiveJobsAsync(userId));
  }, [dispatch]);
  const jobStats = [
    { title: "Total Jobs", count: jobs?.length ?? 0, color: "bg-blue-500" },
    { title: "Active Jobs", count: totalActiveJobs ?? 0, color: "bg-green-500" },
    { title: "Applications Received", 
      count: jobApplications.length,
       color: "bg-purple-500" },
  ];

  const handleClick = () => router.push("/pages/employer/dashboard/post-job");
  const handleClickagain = () => router.push("/pages/employer/dashboard/job-details");

  return (
    <div className="p-6  bg-gray-50 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Employer Dashboard
      </motion.h1>

     
      {loading ? (
        <p className="text-center text-lg font-semibold">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {jobStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`p-6 rounded-xl shadow-md text-white ${stat.color}`}
            >
              <h3 className="text-xl font-semibold">{stat.title}</h3>
              <p className="text-3xl font-bold mt-2">{stat.count}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Job Performance Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Job Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { name: "Jan", applications: 30 },
            { name: "Feb", applications: 50 },
            { name: "Mar", applications: 80 },
            { name: "Apr", applications: 40 },
            { name: "May", applications: 90 },
          ]}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="applications" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4">
        <motion.div whileHover={{ scale: 1.1 }}>
          <Button
          size="lg"
          variant="purple"
            onClick={handleClick}
          >
            Post a New Job
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }}>
          <Button
            onClick={handleClickagain}
            size="lg"
            variant="primary"
          >
            Manage Jobs
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
