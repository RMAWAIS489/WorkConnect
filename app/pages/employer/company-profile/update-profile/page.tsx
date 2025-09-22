"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  fetchEmployerAsync,
  updateEmployerAsync,
} from "@/app/redux/employer/employerSlice";
import { toast, ToastContainer, ToastPosition } from "react-toastify";
import { getUserIdFromToken } from "@/app/lib/authUtils";
import InputField from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import TextAreaField from "@/app/components/ui/textarea";

import { useRouter } from "next/navigation";
export default function UpdateProfile() {
  const router=useRouter()
  const dispatch = useDispatch<AppDispatch>();
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

  const { employer } = useSelector((state: RootState) => state.employer);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompanyProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("User not authenticated");
      return;
    }
    try {
      const employerDataWithUserId = {
        success: true,
        data: {
          ...companyProfile,
          userId,
        },
      };
      await dispatch(updateEmployerAsync(employerDataWithUserId));
      toast.success("Details Updated  successfully!", {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error("Error saving employer details:", error.message || error);
      toast.error("Failed to save details. Please try again.", {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    console.log("Fetching employer profile...");
    dispatch(fetchEmployerAsync());
  }, [dispatch]);

  useEffect(() => {
    if (employer) {
      console.log("Employer data received :", employer);
      setCompanyProfile({
        company_name: employer.company_name,
        contact_number: employer.contact_number,
        email: employer.email,
        address: employer.address,
        website: employer.website,
        industry_type: employer.industry_type,
        company_description: employer.company_description,
        linkedin_url: employer.linkedin_url,
      });
    }
  }, [employer]);
  return (
 
      <div className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 min-h-screen flex flex-col items-center">
        <motion.form
          onSubmit={handleSaveChanges}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-xl space-y-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-semibold  text-gray-800 mb-8"
          >
            Update Company Profile
          </motion.h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              label="Company Name"
              type="text"
              name="company_name"
              value={companyProfile.company_name}
              onChange={handleInputChange}
              className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              labelClassName="text-sm font-bold"
            />
            <InputField
              label="Contact Number"
              type="text"
              name="contact_number"
              value={companyProfile.contact_number}
              onChange={handleInputChange}
              className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              labelClassName="text-sm font-bold"
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={companyProfile.email}
              onChange={handleInputChange}
              className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              labelClassName="text-sm font-bold"
            />
            <InputField
              label="Address"
              type="text"
              name="address"
              value={companyProfile.address}
              onChange={handleInputChange}
              className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              labelClassName="text-sm font-bold"
            />
            <InputField
              label="Website"
              type="text"
              name="website"
              value={companyProfile.website}
              onChange={handleInputChange}
              className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              labelClassName="text-sm font-bold"
            />
            <InputField
              label="Industry_type"
              type="text"
              name="industry_type"
              value={companyProfile.industry_type}
              onChange={handleInputChange}
              className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              labelClassName="text-sm font-bold"
            />
            <div className="sm:col-span-2">
              <TextAreaField
                label="Company Description"
                name="company_description"
                value={companyProfile.company_description}
                onChange={handleInputChange}
                className="mt-2 p-4  bg-white border rounded-lg focus-within:border-black"
                row={4}
              />
            </div>
            <InputField
              label="LinkedIn URL"
              type="text"
              name="linkedin_url"
              value={companyProfile.linkedin_url}
              onChange={handleInputChange}
              className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              labelClassName="text-sm font-bold"
            />
          </div>

          <div className="flex gap-4 justify-end">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-all ease-in-out duration-300"
                type="submit"
              >
                Save Changes
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
              onClick={()=>router.back()}
                variant="outline"
                className="  px-8 py-3  transition-all ease-in-out duration-300"
                type="button"
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
