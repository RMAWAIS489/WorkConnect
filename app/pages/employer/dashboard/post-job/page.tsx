"use client";
import { useState } from "react";
import { motion } from "framer-motion";

import { ToastContainer, ToastPosition, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployerSidebar from "@/app/components/employer/sidebar";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { createJobAsync } from "@/app/redux/jobs/jobSlice";
import InputField from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import TextAreaField from "@/app/components/ui/textarea";
import Dropdown from "@/app/components/ui/dropdown";
import { jobTypeOptions, statusOptions } from "@/app/components/ui/constants";
import { useRouter } from "next/navigation";

const JobPostingForm = () => {
  const router = useRouter();
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    company_name: "",
    location: "",
    salary_range: "",
    job_type: "Full-Time",
    userId: "",
    skills_required: "",
    application_deadline: "",
    employment_status: "Active",
  });
  const dispatch = useDispatch<AppDispatch>();
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };
  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(jobData);
    try {
      const resultAction = await dispatch(createJobAsync(jobData));

      console.log(resultAction);
      toast.success("Job Created successfully!", {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
      });
      setJobData({
        title: "",
        description: "",
        company_name: "",
        location: "",
        salary_range: "",
        job_type: "Full-Time",
        userId: "",
        skills_required: "",
        application_deadline: "",
        employment_status: "Active",
      });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error(" Please try again.", {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
      });
    }
  };

  return (
    
      <div className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 min-h-screen flex flex-col items-center">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-xl space-y-6"
        >
          <h1 className="text-4xl font-semibold text-gray-800 mb-8">
            Post a New Job
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              label="Job Title"
              name="title"
              type="text"
              placeholder="Enter your job title"
              value={jobData.title}
              onChange={handleInputChange}
              labelClassName="text-md "
              className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              required={true}
            />

            <TextAreaField
              label=" Job Description"
              name="description"
              value={jobData.description}
              placeholder="Enter job details..."
              onChange={handleInputChange}
              className="mt-2 p-4  bg-white border rounded-lg focus-within:border-black"
              row={4}
              required={true}
            />
            <InputField
              label="Company Name"
              name="company_name"
              type="text"
              placeholder="Enter your company name"
              value={jobData.company_name}
              onChange={handleInputChange}
              labelClassName="text-md "
              className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              required={true}
            />
            <InputField
              label="Location"
              name="location"
              type="text"
              placeholder="Enter your location"
              value={jobData.location}
              onChange={handleInputChange}
              labelClassName="text-md "
              className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              required={true}
            />
            <InputField
              label="Salary Range"
              name="salary_range"
              type="text"
              placeholder="Enter your salary range"
              value={jobData.salary_range}
              onChange={handleInputChange}
              labelClassName="text-md "
              className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              required={true}
            />
            <Dropdown
              label="Job Type"
              name="job_type"
              options={jobTypeOptions}
              value={jobData.job_type}
              onChange={handleInputChange}
              className="mt-2"
            />
            <InputField
              label="Skills Required"
              name="skills_required"
              type="text"
              placeholder="Enter skills required here"
              value={jobData.skills_required}
              onChange={handleInputChange}
              labelClassName="text-md "
              className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              required={true}
            />

            <Dropdown
              label="Job Status"
              name="employment_status"
              options={statusOptions}
              value={jobData.employment_status}
              onChange={handleInputChange}
              className="mt-2"
            />
            <InputField
              label="Application Deadline  (Optional)"
              name="application_deadline"
              type="date"
              value={jobData.application_deadline}
              onChange={handleInputChange}
              labelClassName="text-md "
              className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
            />
          </div>
          <div className="flex gap-4 justify-end">
            <Button type="submit" variant="primary" size="lg">
              Post Job
            </Button>
            <Button
              onClick={handleBack}
              type="button"
              variant="outline"
              size="lg"
            >
              Back
            </Button>
          </div>
        </motion.form>
        <ToastContainer />
      </div>
    
  );
};

export default JobPostingForm;
