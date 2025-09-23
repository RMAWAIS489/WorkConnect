"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  fetchJobAppAsync,
  JobApplication,
  updateJobAppStatusAsync,
} from "@/app/redux/jobApp/jobAppSlice";
import { getUserIdFromToken } from "@/app/lib/authUtils";
import { Dialog, DialogTitle } from "@headlessui/react";
import * as Select from "@radix-ui/react-select";
import { Button } from "../ui/button";
import Dropdown from "../ui/dropdown";
import { applicationStatusOptions} from "../ui/constants";
interface JobWithApplications {
  jobTitle: string;
  jobId: number;
  applications: JobApplication[];
  applicationsCount: number;
}
export default function ViewApplications() {
  const dispatch = useDispatch<AppDispatch>();
  const { jobApplications } = useSelector(
    (state: RootState) => state.jobApplication
  );

  const [filteredApplications, setFilteredApplications] = useState<JobWithApplications[]>([]);
  const [filterJobTitle, setFilterJobTitle] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication|null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

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
    dispatch(fetchJobAppAsync({ employer_id: userId, authToken }));
  }, [dispatch]);

  useEffect(() => {
    if (jobApplications.length > 0) {
      filterApplications(filterJobTitle, filterStatus);
    }
  }, [jobApplications, filterJobTitle, filterStatus]);

  const handleJobTitleFilterChange = (title: string) => {
    setFilterJobTitle(title);
  };

  const handleStatusFilterChange = (status: string) => {
    setFilterStatus(status);
  };

  const filterApplications = (title: string, status: string) => {
    let filtered = jobApplications;
    if (title !== "All") {
      filtered = filtered.filter((job) => job.jobTitle === title);
    }
    if (status !== "All") {
      filtered = filtered
        .map((job) => ({
          ...job,
          applications: job.applications.filter(
            (app) => app.status === status
          ),
        }))
        .filter((job) => job.applications.length > 0); 
    }
    setFilteredApplications(filtered);
  };

  const handleResumeDownload = (resumeUrl: string) => {
    if (resumeUrl) {
      const link = document.createElement("a");
      link.href = resumeUrl;
      link.download = resumeUrl.split("/").pop() || "resume.pdf";
      link.click();
    } else {
      console.error("Invalid resume URL.");
    }
  };

  const openModal = (application: JobApplication) => {
    setSelectedApplication(application);
    setNewStatus(application.status);
    setIsModalOpen(true);
  };

  const updateStatus = () => {
    if (!selectedApplication || !newStatus) return;
    const authToken = localStorage.getItem("token") || "";
    dispatch(
      updateJobAppStatusAsync({
        applicationId: selectedApplication.id,
        status: newStatus,
        authToken,
      })
    );
    setIsModalOpen(false);
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        View Applications
      </motion.h1>
      <div className="flex gap-4 mb-6">
        <select
          onChange={(e) => handleJobTitleFilterChange(e.target.value)}
          className="px-6 py-3 rounded-lg border border-gray-300"
        >
          <option value="All">All Job Titles</option>
          {jobApplications.map((job, index) => (
            <option key={index} value={job.jobTitle}>
              {job.jobTitle}
            </option>
          ))}
        </select>
        <Dropdown
                options={applicationStatusOptions}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className=" px-6 py-3 !w-40"
              />
      </div>
      <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-md">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left text-gray-700">
                Applicant Name
              </th>
              <th className="px-4 py-2 text-left text-gray-700">Job Title</th>
              <th className="px-4 py-2 text-left text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((job, jobIndex) => (
              <React.Fragment key={jobIndex}>
                {job.applications.map((application:JobApplication, appIndex: number) => (
                  <motion.tr
                    key={appIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="border-b hover:bg-gray-100"
                  >
                    <td className="px-4 py-2 text-gray-700">
                      {application.applicantName}
                    </td>
                    <td className="px-4 py-2 text-gray-700">{job.jobTitle}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-white ${
                          application.status === "Pending"
                            ? "bg-yellow-500"
                            : application.status === "Shortlisted"
                            ? "bg-blue-500"
                            : application.status === "Rejected"
                            ? "bg-red-500"
                            : application.status === "Reviewed"
                            ? "bg-purple-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <motion.div whileHover={{ scale: 1.1 }}>
                          <Button
                            variant="primary"
                            size="md"
                            onClick={() =>
                              handleResumeDownload(application.resume)
                            }
                          >
                            Download Resume
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }}>
                          <Button
                            variant="success"
                            size="md"
                            onClick={() => openModal(application)}
                          >
                            Update Status
                          </Button>
                        </motion.div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30"
      >
        <div className="bg-white p-6 rounded-lg shadow-xl w-1/3">
          <DialogTitle className="text-xl font-bold mb-4">
            Update Application Status
          </DialogTitle>
          <Select.Root value={newStatus} onValueChange={setNewStatus}>
            <Select.Trigger className="w-full px-4 py-2 bg-gray-200 rounded-lg cursor-pointer">
              {newStatus}
            </Select.Trigger>
            <Select.Content className="bg-white shadow-md rounded-lg">
              <Select.Item value="Pending">Pending</Select.Item>
              <Select.Item value="Reviewed">Reviewed</Select.Item>
              <Select.Item value="Shortlisted">Shortlisted</Select.Item>
              <Select.Item value="Rejected">Rejected</Select.Item>
            </Select.Content>
          </Select.Root>
          <button
            onClick={updateStatus}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
          >
            Update
          </button>
        </div>
      </Dialog>
    </div>
  );
}
