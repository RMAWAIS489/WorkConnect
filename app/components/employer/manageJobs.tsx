"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { getUserIdFromToken } from "@/app/lib/authUtils";
import {
  fetchJobsAsync,
  updateEmploymentStatusAsync,
} from "@/app/redux/jobs/jobSlice";
import { fetchJobAppAsync } from "@/app/redux/jobApp/jobAppSlice";

export default function ManageJobs() {
  const { jobApplications } = useSelector(
    (state: RootState) => state.jobApplication
  );
  const [filter, setFilter] = useState("All");
  const dispatch = useDispatch<AppDispatch>();
  const { jobs } = useSelector((state: RootState) => state.jobs);

  const handleFilterChange = (status: string) => {
    setFilter(status);
  };
  const handleMarkAsFilled = (jobId: number, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    dispatch(
      updateEmploymentStatusAsync({ jobId, employmentStatus: newStatus })
    );
  };

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("User not authenticated");
      return;
    }
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      alert("User not authenticated.");
      return;
    }
    dispatch(fetchJobsAsync(userId));
    dispatch(fetchJobAppAsync({ employer_id: userId, authToken }));
    console.log("jobApplications:", jobApplications);
  }, [dispatch]);
  const filteredJobs = jobs.filter(
    (job: any) => filter === "All" || job.employment_status === filter
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Manage Jobs
      </motion.h1>
      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => handleFilterChange("All")}
          className={`px-6 py-3 rounded-lg ${
            filter === "All" ? "bg-purple-600 text-white" : "bg-gray-300"
          }`}
        >
          All Jobs
        </Button>
        <Button
          onClick={() => handleFilterChange("Active")}
          className={`px-6 py-3 rounded-lg ${
            filter === "Active" ? "bg-green-600 text-white" : "bg-gray-300"
          }`}
        >
          Active Jobs
        </Button>
        <Button
          onClick={() => handleFilterChange("Inactive")}
          className={`px-6 py-3 rounded-lg ${
            filter === "Inactive" ? "bg-red-600 text-white" : "bg-gray-300"
          }`}
        >
          Inactive Jobs
        </Button>
      </div>
      <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-md">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left text-gray-700">Job Title</th>
              <th className="px-4 py-2 text-left text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-gray-700">
                Applications
              </th>
              <th className="px-4 py-2 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <motion.tr
                key={job.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="border-b hover:bg-gray-100"
              >
                <td className="px-4 py-2 text-gray-700">{job.title}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      job.employment_status === "Active"
                        ? "bg-green-500"
                        : job.employment_status === "Inactive"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {job.employment_status}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-700">
                  {jobApplications.find((app) => app.jobId === job.id)
                    ?.applicationsCount || 0}
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    {job.employment_status !== "Filled" && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() =>
                          handleMarkAsFilled(job.id, job.employment_status)
                        }
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-700"
                      >
                        Mark as{" "}
                        {job.employment_status === "Active"
                          ? "Filled"
                          : "Active"}
                      </motion.button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
