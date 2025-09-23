"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import {
  deleteEmployerAsync
} from "@/app/redux/employer/employerSlice";
import { toast, ToastContainer, ToastPosition } from "react-toastify";
import { useRouter } from "next/navigation";
import { getUserIdFromToken } from "@/app/lib/authUtils";


export default function CompanyProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const handleUpdateProfileClick = () => {
    router.push("/pages/employer/company-profile/update-profile");
  };
  const handleDeleteEmployer = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete your employer profile?"
    );
    if (!isConfirmed) {
      return; 
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      alert("User not authenticated");
      return;
    }

    try {
      await dispatch(deleteEmployerAsync(userId)).unwrap();
      toast.success("Employer profile deleted successfully.", {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
      });
      router.push("/"); 
    } catch (error) {
      toast.error("Failed to delete employer profile.", {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
      });
      console.error("Error:", error);
      alert("An error occurred while deleting the profile.");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 min-h-screen flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-semibold text-gray-800 mb-8"
      >
        Company Profile
      </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center space-y-6"
        >
          <div className="flex gap-4">
            <Button
             onClick={() => router.push("/pages/employer/company-profile/complete-profile")}
              className="bg-green-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-green-700 transition-all ease-in-out duration-300"
            >
              Complete Profile
            </Button>
            <Button
              type="button"
              onClick={handleUpdateProfileClick}
              className="bg-yellow-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transition-all ease-in-out duration-300"
            >
              Update Profile
            </Button>

            <Button
              onClick={handleDeleteEmployer}
              type="button"
              className="bg-red-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-red-600 transition-all ease-in-out duration-300"
            >
              Delete Profile
            </Button>
          </div>
        </motion.div>
      <ToastContainer />
    </div>
  );
}
