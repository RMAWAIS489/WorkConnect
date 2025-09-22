"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTools,
  FaGraduationCap,
  FaBriefcase,
  FaGlobe,
  FaLinkedin,
  FaGithub,
  FaFileUpload,
} from "react-icons/fa";
import {
  createCandidateAsync,
  deleteCandidateAsync,
  fetchCandidateAsync,
  updateCandidateAsync,
} from "@/app/redux/candidate/candidateSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { getUserIdFromToken } from "@/app/lib/authUtils";
import { toast, ToastContainer, ToastPosition } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export default function CandidateProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    fullname: "",
    contact_number: "",
    email: "",
    address: "",
    skill: "",
    education: "",
    work_experience: "",
    resume_link: "",
    portfolio_link: "",
    linkedin_url: "",
    github_url: "",
  });
  const [isEditing, setIsEditing] = useState(true);
  const { candidate } = useSelector((state: RootState) => state.candidate);
  const [resume, setResume] = useState<File | null>(null);
  const router = useRouter();
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!resume) {
      alert("Please upload a resume.");
      return;
    }

    const authToken = localStorage.getItem("token");
    if (!authToken) {
      alert("User not authenticated");
      return;
    }

    // FormData object create karo
    const formDataWithFile = new FormData();

    // Resume file add karo
    formDataWithFile.append("resume", resume);

    // Baqi fields bhi add karo
    Object.keys(formData).forEach((key) => {
      formDataWithFile.append(key, formData[key as keyof typeof formData]);
    });

    try {
      await dispatch(createCandidateAsync(formDataWithFile)).unwrap();

      // Form clear karna
      setFormData({
        fullname: "",
        contact_number: "",
        email: "",
        address: "",
        skill: "",
        education: "",
        work_experience: "",
        resume_link: "",
        portfolio_link: "",
        linkedin_url: "",
        github_url: "",
      });
      setResume(null);
      
    } catch (error) {
      console.error("Failed to submit candidate:", error);
    }
  };

  const handleEdit = async () => {
    setIsEditing(false);
    try {
      await dispatch(fetchCandidateAsync()).unwrap();
    } catch (error) {
      console.error("Failed to fetch candidate:", error);
    }
  };

  const handleDelete = async () => {
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
      await dispatch(deleteCandidateAsync(userId)).unwrap();
      toast.success("Employer profile deleted successfully.", {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
      });
      setFormData({
        fullname: "",
        contact_number: "",
        email: "",
        address: "",
        skill: "",
        education: "",
        work_experience: "",
        resume_link: "",
        portfolio_link: "",
        linkedin_url: "",
        github_url: "",
      });
      setIsEditing(true);
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

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = getUserIdFromToken();
    if (!userId) {
      alert("User not authenticated");
      return;
    }
    try {
      const candidateDataWithUserId = {
        success: true,
        data: {
          ...formData,
          userId,
        },
      };
      await dispatch(updateCandidateAsync(candidateDataWithUserId));
      setIsEditing(true); // Disable editing mode after saving
      console.log("Candidate updated", candidateDataWithUserId);
      toast.success("Details Updated successfully!", {
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
    if (candidate) {
      setFormData({
        fullname: candidate.fullname || "",
        contact_number: candidate.contact_number || "",
        email: candidate.email || "",
        address: candidate.address || "",
        skill: candidate.skill || "",
        education: candidate.education || "",
        work_experience: candidate.work_experience || "",
        resume_link: candidate.resume_link || "",
        portfolio_link: candidate.portfolio_link || "",
        linkedin_url: candidate.linkedin_url || "",
        github_url: candidate.github_url || "",
      });
    } else {
      setFormData({
        fullname: "",
        contact_number: "",
        email: "",
        address: "",
        skill: "",
        education: "",
        work_experience: "",
        resume_link: "",
        portfolio_link: "",
        linkedin_url: "",
        github_url: "",
      });
    }
  }, [candidate]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 flex flex-col items-center justify-start pt-20 text-white">
      <h2 className="text-4xl font-bold mb-6">Candidate Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full text-gray-800"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            labelIcon={<FaUser />}
            label="Full Name"
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
            labelClassName="text-sm font-bold"
          />
          <InputField
            labelIcon={<FaPhone />}
            label="Contact Number"
            type="text"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
            labelClassName="text-sm font-bold"
          />
        </div>

        <InputField
          labelIcon={<FaEnvelope />}
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
          labelClassName="text-sm font-bold"
        />

        <InputField
          labelIcon={<FaMapMarkerAlt />}
          label="Address"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
          labelClassName="text-sm font-bold"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <InputField
            labelIcon={<FaTools />}
            label="Skills"
            type="text"
            name="skill"
            value={formData.skill}
            onChange={handleChange}
            className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
            labelClassName="text-sm font-bold"
          />
          <InputField
            labelIcon={<FaGraduationCap />}
            label="Education"
            type="text"
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
            labelClassName="text-sm font-bold"
          />
        </div>

        <InputField
          labelIcon={<FaBriefcase />}
          label="Work Experience"
          type="text"
          name="work_experience"
          value={formData.work_experience}
          onChange={handleChange}
          className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
          labelClassName="text-sm font-bold"
        />

        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <label htmlFor="resume" className="block text-gray-700 font-medium">
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

        <InputField
          labelIcon={<FaGlobe />}
          label="Portfolio Link"
          type="url"
          name="portfolio_link"
          value={formData.portfolio_link}
          onChange={handleChange}
          className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
          labelClassName="text-sm font-bold"
        />

        <InputField
          labelIcon={<FaLinkedin />}
          label="LinkedIn URL"
          type="url"
          name="linkedin_url"
          value={formData.linkedin_url}
          onChange={handleChange}
          className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
          labelClassName="text-sm font-bold"
        />

        <InputField
          labelIcon={<FaGithub />}
          label="GitHub URL"
          type="url"
          name="github_url"
          value={formData.github_url}
          onChange={handleChange}
          className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
          labelClassName="text-sm font-bold"
        />

        <div className="mt-6 flex justify-between items-center">
          <Button
            type="submit"
            variant="primary"
            size="md"
            beforeIcon={<FaCheck />}
          >
            Submit
          </Button>

          <div className="flex gap-4">
            {isEditing ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                beforeIcon={<FaCheck />}
                onClick={handleEdit}
              >
                Edit
              </Button>
            ) : (
              <Button
                type="button"
                variant="success"
                size="md"
                beforeIcon={<FaEdit />}
                onClick={handleSaveChanges}
                className="bg-green-600"
              >
                Update
              </Button>
            )}

            <Button
              type="button"
              variant="danger"
              size="md"
              beforeIcon={<FaTrash />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
