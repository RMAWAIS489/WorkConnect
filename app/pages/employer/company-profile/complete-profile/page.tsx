"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { addEmployerAsync } from "@/app/redux/employer/employerSlice";
import { toast, ToastContainer, ToastPosition } from "react-toastify";
import { useRouter } from "next/navigation";
import { getUserIdFromToken } from "@/app/lib/authUtils";
import InputField from "@/app/components/ui/input";
import TextAreaField from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";

export default function CompleteProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [companyProfile, setCompanyProfile] = useState({
    company_name: "",
    contact_number: "",
    email: "",
    address: "",
    website: "",
    industry_type: "",
    company_description: "",
    linkedin_url: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompanyProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("User not authenticated");
      return;
    }
    try {
      const employerDataWithUserId = { ...companyProfile, userId };
      await dispatch(addEmployerAsync(employerDataWithUserId)).unwrap();
      toast.success("Profile completed successfully!", {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
      });
      router.push("/pages/employer/dashboard");
    } catch (error) {
      console.error("Error saving employer profile:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
      });
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
        Complete Your Company Profile
      </motion.h1>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        onSubmit={handleSaveChanges}
        className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-xl space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="Company Name"
            type="text"
            name="company_name"
            placeholder="Enter your company name"
            className="w-full mt-1 bg-white p-2 border  focus-within:border-black"
            labelClassName="text-sm font-bold"
            value={companyProfile.company_name}
            onChange={handleInputChange}
          />
          <div className="sm:col-span-2">
            <TextAreaField
              label="Company Description"
              name="company_description"
              placeholder="Enter company details..."
              className="mt-2 p-4  bg-white border rounded-lg focus-within:border-black"
              row={4}
              value={companyProfile.company_description}
              onChange={handleInputChange}
            />
          </div>
          <InputField
            label="Contact Number"
            type="text"
            name="contact_number"
            placeholder="Enter contact number"
            className="w-full mt-1 bg-white p-2 border  focus-within:border-black"
            labelClassName="text-sm font-bold"
            value={companyProfile.contact_number}
            onChange={handleInputChange}
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            placeholder="Enter company email"
            value={companyProfile.email}
            className="w-full mt-1 bg-white p-2 border  focus-within:border-black"
            labelClassName="text-sm font-bold"
            onChange={handleInputChange}
          />
          <InputField
            label="Address"
            type="text"
            name="address"
            placeholder="Enter company address"
            className="w-full mt-1 bg-white p-2 border  focus-within:border-black"
            labelClassName="text-sm font-bold"
            value={companyProfile.address}
            onChange={handleInputChange}
          />
          <InputField
            label="Website"
            type="text"
            name="website"
            placeholder="Enter company website"
            className="w-full mt-1 bg-white p-2 border  focus-within:border-black"
            labelClassName="text-sm font-bold"
            value={companyProfile.website}
            onChange={handleInputChange}
          />
          <InputField
            label="Industry Type"
            type="text"
            name="industry_type"
            placeholder="Enter industry type"
            className="w-full mt-1 bg-white p-2 border  focus-within:border-black"
            labelClassName="text-sm font-bold"
            value={companyProfile.industry_type}
            onChange={handleInputChange}
          />

          <InputField
            label="LinkedIn URL"
            type="text"
            name="linkedin_url"
            placeholder="Enter LinkedIn profile URL"
            className="w-full mt-1 bg-white p-2 border  focus-within:border-black"
            labelClassName="text-sm font-bold"
            value={companyProfile.linkedin_url}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex gap-4 justify-end">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-all ease-in-out duration-300"
              type="submit"
            >
              Save Profile
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="outline"
              className="px-8 py-3 transition-all ease-in-out duration-300"
              type="button"
              onClick={() => router.back()}
            >
              Back
            </Button>
          </motion.div>
        </div>
      </motion.form>
      <ToastContainer />
    </div>
  );
}
