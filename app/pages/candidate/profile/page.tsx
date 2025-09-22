"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaEllipsisV, FaFilePdf } from "react-icons/fa";
import { fetchCandidateAsync, fetchCandidateResumeAsync } from "@/app/redux/candidate/candidateSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { getUserIdFromToken } from "@/app/lib/authUtils";
import Loader from "@/app/components/ui/loader";

export default function CandidateProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const { candidate } = useSelector((state: RootState) => state.candidate);
  console.log("resp",candidate)
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) return;
    setLoading(true); 
    dispatch(fetchCandidateAsync())
      .unwrap()
      .finally(() => setLoading(false));
      dispatch(fetchCandidateResumeAsync());
  }, [dispatch]);
  
 
  
  if (loading) {
    return <Loader message="Loading your profile..."/>; 
  }
  
  
  return (
    <div
    className="w-full min-h-screen  bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 flex flex-col items-center justify-start pt-16 text-white"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      className="flex flex-col items-center mb-6"
    >
      <div className="w-20 h-20 bg-white text-blue-800 font-bold text-3xl flex items-center justify-center rounded-full shadow-lg">
        {candidate?.fullname
          ?.split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase() || "N/A"}
      </div>
      <span className="text-2xl font-bold mt-2">{candidate?.fullname || "N/A"}</span>
    </motion.div>

   
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
      className="space-y-4 text-lg"
    >
      <div className="flex items-center gap-4">
        <FaEnvelope className="text-white" />
        <span className="font-semibold">Email:</span>
        <span>{candidate?.email || "N/A"}</span>
      </div>
      <div className="flex items-center gap-4">
        <FaPhone className="text-white" />
        <span className="font-semibold">Phone:</span>
        <span>{candidate?.contact_number || "N/A"}</span>
      </div>
      <div className="flex items-center gap-4">
        <FaMapMarkerAlt className="text-white" />
        <span className="font-semibold">Location:</span>
        <span>{candidate?.address || "N/A"}</span>
      </div>
      <div className="mt-8 w-full max-w-lg bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
  <span className="text-xl font-semibold text-gray-800 mb-4">Resume</span>
  {candidate?.resume_link ? (
    <div className="flex flex-col items-center gap-3">
      {/* Big PDF Icon */}
      <a href={candidate.resume_link} target="_blank" rel="noopener noreferrer">
        <FaFilePdf className="text-red-500 text-7xl cursor-pointer hover:text-red-600 transition" />
      </a>

      {/* Resume Info */}
      <span className="text-gray-700 text-sm italic">{candidate.resume_name || "Resume.pdf"}</span>

      {/* Buttons */}
      <div className="flex gap-4 mt-2">
        <a
          href={candidate.resume_link}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg shadow hover:bg-blue-600 transition"
        >
          View Resume
        </a>

        <a
          href={candidate.resume_link}
          download
          className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg shadow hover:bg-green-600 transition"
        >
          Download
        </a>
      </div>
    </div>
  ) : (
    <p className="text-gray-500">No resume found</p>
  )}
</div>



    </motion.div>
  </div>
  
  );
}
