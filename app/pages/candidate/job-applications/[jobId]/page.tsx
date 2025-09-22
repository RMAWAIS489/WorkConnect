"use client";
import { use, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaFileUpload } from "react-icons/fa";
import { RootState, AppDispatch } from "@/app/redux/store";
import { fetchCandidateAsync } from "@/app/redux/candidate/candidateSlice";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { createJobAppAsync } from "@/app/redux/jobApp/jobAppSlice";
import { toast, ToastContainer, ToastPosition } from "react-toastify";
import { useRouter } from "next/navigation";
import Dropdown from "@/app/components/ui/dropdown";
import { applicationStatusOption } from "@/app/components/ui/constants";
import { Button } from "@/app/components/ui/button";

export default function JobApplication({
  params,
}: {
  params: Promise<{ jobId: number }>;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { candidate } = useSelector((state: RootState) => state.candidate);
  const [status, setStatus] = useState("Pending");
  const [resume, setResume] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchCandidateAsync());
  }, [dispatch]);

  const unwrappedParams = use(params);
  const job_id = unwrappedParams?.jobId;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!resume) {
        alert("Please upload a resume.");
        return;
      }

      if (!job_id || !candidate) {
        alert("Missing job or candidate data.");
        return;
      }

      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("job_id", String(job_id));
      formData.append("candidate_id", candidate.id.toString());
      formData.append("status", status);

      const authToken = localStorage.getItem("token");
      if (!authToken) {
        alert("User not authenticated.");
        return;
      }

      await dispatch(
        createJobAppAsync({ formData, job_id: job_id, authToken })
      );
      console.log("Data Inserted Successfully");
      toast.success("Job Applied successful!", {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
      });
      router.push("/pages/candidate");
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("An error occurred while applying for the job.");
    }
  };
  const handleClose = () => {
    router.back();
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 flex justify-center items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto mt-10 px-4 relative">
      <Button onClick={handleClose} 
      variant="close"
      className="absolute top-3 right-6 ">
          <IoClose size={24} />
        </Button>
        {candidate ? (
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-semibold text-indigo-700 mb-6">
              Apply for Job
            </h2>
            <form onSubmit={handleSubmit}>
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Dropdown
                  label="Application Status"
                  name="employment_status"
                  options={applicationStatusOption}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-2"
                />
              </motion.div>

              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label
                  htmlFor="fullname"
                  className="block text-gray-700 font-medium"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  value={candidate.fullname}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-md mt-2 focus:ring-2 focus:ring-indigo-500 transition duration-300"
                />
              </motion.div>

              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={candidate.email}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-md mt-2 focus:ring-2 focus:ring-indigo-500 transition duration-300"
                />
              </motion.div>

              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label
                  htmlFor="resume"
                  className="block text-gray-700 font-medium"
                >
                  Upload Resume
                </label>
                <div className="flex items-center mt-2">
                  <FaFileUpload className=" text-indigo-500" />
                  <input
                    type="file"
                    id="resume"
                    onChange={(e) => setResume(e.target.files?.[0] || null)} // Update to file type
                    className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition duration-300"
                  />
                </div>
              </motion.div>
           
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                >
                  Apply Now
                </Button>
             
            </form>
            <ToastContainer />
          </motion.div>
        ) : (
          <p className="text-center text-lg text-gray-700">
            No candidate data available.
          </p>
        )}
      </div>
    </motion.div>
  );
}
