"use client";
import { getUserIdFromToken } from "@/app/lib/authUtils";
import { fetchAppliedJobAppsAsync } from "@/app/redux/jobApp/jobAppSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Loader from "@/app/components/ui/loader";
import Card from "@/app/components/ui/card";



const CandidateAppliedJobs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appliedJobs, loading, error } = useSelector(
    (state: RootState) => state.jobApplication
  );

  const [loadingState, setLoadingState] = useState(true); 

  useEffect(() => {
    const userId = getUserIdFromToken();
    const authToken = localStorage.getItem("token");
    if (!authToken || !userId) {
      console.warn("User is not authenticated. Skipping API call.");
      return;
    }
    dispatch(fetchAppliedJobAppsAsync({ candidate_id: userId, authToken }));
    setTimeout(() => {
      setLoadingState(false);
    }, 1000);
  }, [dispatch]);
  if (loadingState) {
    return <Loader message="Loading your applied jobs..."/>;
  }

  if (loading) return <p className="text-blue-500">Loading applied jobs...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="w-full mx-auto p-6 min-h-screen shadow-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white">
      <h2 className="text-4xl font-extrabold mb-8 text-center tracking-wide drop-shadow-lg">
        🚀 Applied Jobs
      </h2>
      {appliedJobs.length > 0 ? (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {appliedJobs.map((job, index) =>
            job ? (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card className="!bg-gradient-to-br p-5 hover:shadow-xl transition-all duration-300 from-indigo-500 via-purple-600 to-pink-500 !max-w-2xl">
                  <h3 className="text-lg font-bold text-white">{job.job.title}</h3>
                  <p className="text-white/80 text-xs mb-3">
                    at <span className="font-semibold">{job.job.company_name}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-white/90 text-xs">
                    <p><span className="font-semibold">Type:</span> {job.job.job_type}</p>
                    <p><span className="font-semibold">Location:</span> {job.job.location}</p>
                    <p><span className="font-semibold">Salary:</span> {job.job.salary_range}</p>
                    <p>
                      <span className="font-semibold">Status:</span>
                      <span className={`px-2 py-1 text-white text-xs rounded-lg font-semibold shadow-md ${
                        job.job.employment_status === "Active" ? "bg-green-500" : "bg-red-500"
                      }`}>
                        {job.job.employment_status}
                      </span>
                    </p>
                    <p className="col-span-2">
                      <span className="font-semibold">Skills:</span> {job.job.skills_required}
                    </p>
                  </div>
                  <p className="text-white/90 mt-2 text-xs">
                    <span className="font-semibold">Description:</span> {job.job.description}
                  </p>
                  <div className="mt-3 flex justify-between items-center text-xs">
                    <p className="text-white/80">
                      <span className="font-semibold">Deadline:</span>{" "}
                      {new Date(job.job.application_deadline).toLocaleDateString()}
                    </p>
                    <motion.span
                      className={`px-3 py-1 text-white text-xs rounded-lg font-semibold shadow-md ${
                        job.status === "Pending" ? "bg-yellow-500"
                          : job.status === "Shortlisted" ? "bg-blue-500"
                          : job.status === "Rejected" ? "bg-red-500"
                          : job.status === "Reviewed" ? "bg-purple-500"
                          : "bg-gray-500"
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {job.status}
                    </motion.span>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key={index}
                className="p-4 border rounded-lg bg-red-500/80 text-white text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Invalid job data
              </motion.div>
            )
          )}
        </motion.div>
      ) : (
        <motion.p
          className="text-white/80 text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          You have not applied for any jobs yet.
        </motion.p>
      )}
    </div>
  );
};

export default CandidateAppliedJobs;
