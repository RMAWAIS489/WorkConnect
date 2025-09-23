"use client";
import { searchJobsAsync } from "@/app/redux/jobs/jobSlice";
import { AppDispatch } from "@/app/redux/store";
import { useState } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch} from "react-redux";
import JobListings from "@/app/components/candidate/jobs";
import InputField from "@/app/components/ui/input"; 

export default function HomePage() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  

  const handleSearch = () => {
    console.log("Searching for:", jobTitle, location);
    dispatch(searchJobsAsync({ title: jobTitle, location }));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 flex flex-col items-center justify-start pt-20 text-white">
      
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Job</h1>
        <p className="text-lg md:text-xl mb-6">Search millions of jobs from thousands of companies.</p>
      </div>

      
      <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 max-w-3xl w-full">
        <InputField
        name="jobTitle"
          placeholder="Job title, keywords, or company"
          value={jobTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobTitle(e.target.value)}
          iconBefore={<FaSearch />}
        />
        <InputField
        name="location"
          placeholder="City, state, or zip code"
          value={location}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
          iconBefore={<FaMapMarkerAlt />}
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <div className="mt-6 w-full max-w-4xl">
        <JobListings />
      </div>
    </div>
  );
}
