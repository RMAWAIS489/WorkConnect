"use client";
import { motion } from "framer-motion";
import { getUserIdFromToken } from "@/app/lib/authUtils";
import {
  deleteJobAsync,
  fetchJobsAsync,
  Job,
  jobUpdateAsync,
} from "@/app/redux/jobs/jobSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import InputField from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import TextAreaField from "@/app/components/ui/textarea";
import { jobTypeOptions, statusOptions } from "@/app/components/ui/constants";
import Dropdown from "@/app/components/ui/dropdown";
import Card from "@/app/components/ui/card";


const JobsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector(
    (state: RootState) => state.jobs
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [updatedJob, setUpdatedJob] = useState<Job>({
    id:0,
    title: "",
    description: "",
    company_name: "",
    location: "",
    salary_range: "",
    job_type: "",
    skills_required: "",
    employment_status: "",
    application_deadline: "",
  });

 const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

  const handleEditClick = (job: Job) => {
   
    setUpdatedJob(job);
    setIsModalOpen(true);
  };

  const handleChange = (
     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setUpdatedJob({
      ...updatedJob,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = () => {
    const updatedJobs = jobs.map((job) =>
      job.id === updatedJob.id ? { ...job, ...updatedJob } : job
    );
    dispatch({ type: "jobs/setJobs", payload: updatedJobs });
    dispatch(jobUpdateAsync(updatedJob))
      .then(() => {
        toast.success("Job updated successfully");
        setIsModalOpen(false);
      })
      .catch((err) => {
        alert("Error updating job: " + err.message);
      });
  };
useEffect(() => {
  const userId = getUserIdFromToken();
  if (!userId) {
    alert("User not authenticated");
    return;
  }
  dispatch(fetchJobsAsync(userId));
}, [dispatch]); // ✅ keep it simple


  useEffect(() => {
    console.log("Updated Jobs:", jobs); 
  }, [jobs]);

  const handleDeleteJob = (jobId: number) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      dispatch(deleteJobAsync(jobId))
        .then(() => {
          toast.success("Job deleted successfully");
        })
        .catch((err: any) => {
          toast.error("Error deleting job: " + err.message);
        });
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
       <div>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-12">
            Your All Jobs
          </h1>

          {jobs.length === 0 ? (
            <p className="text-center text-lg text-gray-500">
             {"You haven't posted any jobs yet. Start by creating a job listing!"}

            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job, index) => (
                
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -100, scale: 0.5, rotateY: 180 }}
                  animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }} 
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 120,
                    damping: 15, 
                  }}
                  
                >
                  <Card 
                  className="   "
                  >
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    {job.description}
                  </p>

                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <strong>Company:</strong> {job.company_name}
                    </p>
                    <p className="text-gray-700">
                      <strong>Location:</strong> {job.location}
                    </p>
                    <p className="text-gray-700">
                      <strong>Salary:</strong> {job.salary_range}
                    </p>
                    <p className="text-gray-700">
                      <strong>Skills Required:</strong> {job.skills_required}
                    </p>
                    <p className="text-gray-700">
                      <strong>Job Type:</strong> {job.job_type}
                    </p>
                    <p className="text-gray-700">
                      <strong>Job Status:</strong> {job.employment_status}
                    </p>
                    <p className="text-gray-700">
                      <strong>Deadline:</strong>{" "}
                      {new Date(job.application_deadline).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex justify-start items-center mt-6 gap-4">
                    <Button
                      type="button"
                      variant="edit"
                      size="md"
                      onClick={() => handleEditClick(job)}
                      className=" px-6 py-3 !rounded-full !text-lg transform hover:scale-110 transition duration-300"
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="delete"
                      size="md"
                      onClick={() => handleDeleteJob(job.id)}
                      className=" px-6 py-3 !rounded-full !text-lg transform hover:scale-110 transition duration-300"
                    >
                      Delete
                    </Button>
                  </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-8 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-3xl font-semibold mb-4">Edit Job</h2>
            <motion.form
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onSubmit={(e) => e.preventDefault()}
            >
              <InputField
                label="Job Title"
                name="title"
                type="text"
                id="title"
                value={updatedJob.title}
                onChange={handleChange}
                labelClassName="text-md "
                className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              />
              <TextAreaField
                label=" Job Description"
                name="description"
                id="description"
                value={updatedJob.description}
                onChange={handleChange}
                className="mt-2 p-4  bg-white border rounded-lg focus-within:border-black"
                
                required={true}
              />
              <InputField
                label="Company Name"
                name="company_name"
                id="company_name"
                type="text"
                value={updatedJob.company_name}
                onChange={handleChange}
                labelClassName="text-md "
                className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              />
              <InputField
                label="Location"
                name="location"
                id="location"
                type="text"
                value={updatedJob.location}
                onChange={handleChange}
                labelClassName="text-md "
                className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              />
              <InputField
                label="Salary Range"
                name="salary_range"
                id="salary_range"
                type="text"
                value={updatedJob.salary_range}
                onChange={handleChange}
                labelClassName="text-md "
                className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              />
              <InputField
                label="Skills Required"
                name="skills_required"
                id="skills_required"
                type="text"
                value={updatedJob.skills_required}
                onChange={handleChange}
                labelClassName="text-md "
                className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              />
                 <Dropdown
                label="Job Type"
                name="job_type"
                options={jobTypeOptions}
                value={updatedJob.job_type}
                onChange={handleChange}
                className="mt-2"
              />
                
                <Dropdown
                label="Job Status"
                name="employment_status"
                options={statusOptions}
                value={updatedJob.employment_status}
                onChange={handleChange}
                className="mt-2"
              />
              <InputField
                label="Application Deadline"
                name="application_deadline"
                id="application_deadline"
                type="date"
                value={
                  updatedJob.application_deadline
                    ? formatDate(updatedJob.application_deadline)
                    : ""
                }
                onChange={handleChange}
                labelClassName="text-md "
                className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
              />

              <div className="flex justify-end gap-4 mt-4">
                <Button
                  type="button"
                  variant="edit"
                  size="md"
                  onClick={handleSubmit}
                  className="!rounded-full !text-lg transform hover:scale-110 transition duration-300"
                >
                  Update
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                  className="!rounded-full !text-lg transform hover:scale-110 transition duration-300"
                >
                  Cancel
                </Button>
              </div>
            </motion.form>

            <ToastContainer />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
