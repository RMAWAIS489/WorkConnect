"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllJobsAsync, searchJobsAsync } from "@/app/redux/jobs/jobSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { FaMapMarkerAlt, FaBriefcase, FaDollarSign } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Card from "../ui/card";


export default function JobListings() {
   const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector((state: RootState) => state.jobs);
  

 const handleApplyclick = (jobId: number) => {
  console.log("Apply clicked for jobId:", jobId);

  const token = localStorage.getItem("token");

  if (token) {
    // ✅ If logged in → go to job application page
    router.push(`/pages/candidate/job-applications/${jobId}`);
  } else {
    // 🚫 If not logged in → go to login page
    router.push("/pages/auth/signin");
  }
};

  useEffect(() => {
    dispatch(fetchAllJobsAsync());
  }, [dispatch]);

  if (loading) return <div className="text-center text-lg font-semibold">Loading jobs...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
<div className="max-w-6xl mx-auto mt-10 px-4 flex justify-start">
  <div className="w-full md:w-3/4">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-6">Latest Job Openings</h2>
    <div className="grid gap-6 grid-cols-1">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <Card
            key={job.id}
            className="!max-w-xl"
          >
            <div>
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">{job.title}</h3>
              <p className="text-gray-600 mb-4 font-medium">{job.company_name}</p>
              <div className="flex items-center text-gray-600 text-sm mb-3">
                <FaMapMarkerAlt className="mr-2 text-indigo-500" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-3">
                <FaBriefcase className="mr-2 text-green-500" />
                <span>{job.job_type} | {job.employment_status}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-4">
                <FaDollarSign className="mr-2 text-yellow-500" />
                <span>{job.salary_range}</span>
              </div>
              <p className="text-gray-700 line-clamp-4 mb-6">{job.description}</p>
            </div>
            <Button 
            size="md"
            onClick={() => handleApplyclick(job.id)}
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 !w-32 shadow-md transition-all"
            >
              Apply Now
            </Button>
          </Card>
        ))
      ) : (
        <p className="text-gray-500 text-center col-span-full">No jobs found.</p>
      )}
    </div>
  </div>
</div>

  

  );
}
