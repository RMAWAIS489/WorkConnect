import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
interface Job {
  id: number;
  title: string;
  description: string;
  company_name: string;
  location: string;
  salary_range: string;
  job_type: string;
  employment_status: string;
  skills_required: string;
  application_deadline: string;
}
interface JobState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  totalActiveJobs: number;
  totalJobs: number; // ✅ total jobs
  activeJobs: number;
}

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
  totalJobs: 0,
  activeJobs: 0,
  totalActiveJobs: 0,
};
interface JobResponse {
  success: boolean;
  data: Job[]; // job data returned after successful creation
}

export const createJobAsync = createAsyncThunk(
  "jobs/createJob",
  async (jobData: Omit<Job, "id">, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/jobs/create",
        jobData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("API Response:", response.data);

      return response.data.job as Job;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Job creation failed");
    }
  }
);
export const fetchJobsAsync = createAsyncThunk(
  "jobs/fetchJobs",
  async (userId: number, { rejectWithValue }) => {
    // Accept userId as an argument
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("User not authenticated");
      }

      // Decode the JWT token
      const decodedToken: any = jwtDecode(authToken);
      console.log("Decoded Token:", decodedToken);

      // Check if the 'userId' exists in the decoded token
      if (!userId) {
        return rejectWithValue("User ID is missing in token");
      }

      console.log("Extracted User ID:", userId);

      // Make the API call using the userId
      const response = await axios.get(
        `http://localhost:5000/jobs/fetch/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("API Response:", response.data);

      // Assuming response.data is of type JobResponse
      return response.data as JobResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch jobs");
    }
  }
);
export const totalActiveJobsAsync = createAsyncThunk(
  "jobs/totalActiveJobs",
  async (userId: number, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("User not authenticated");
      }
      const decodedToken: any = jwtDecode(authToken);
      console.log("Decoded Token:", decodedToken);
      if (!userId) {
        return rejectWithValue("User ID is missing in token");
      }
      console.log("Extracted User ID:", userId);
      const response = await axios.get(
        `http://localhost:5000/jobs/ActiveJobs/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("API Response:", response.data);
      return response.data.totalActiveJobs as number;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch jobs");
    }
  }
);

export const jobUpdateAsync = createAsyncThunk(
  "jobs/updateJob",
  async (
    job: {
      id: string;
      title: string;
      description: string;
      company_name: string;
      location: string;
      salary_range: string;
      skills_required: string;
      application_deadline: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const authToken = localStorage.getItem("token"); // Get auth token

      if (!authToken) {
        return rejectWithValue({ message: "Unauthorized: No token found" });
      }

      const response = await axios.put(
        `http://localhost:5000/jobs/update/${job.id}`,
        job,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Add Authorization header
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);
export const deleteJobAsync = createAsyncThunk(
  "jobs/deleteJobAsync",
  async (jobId: number, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("User not authenticated");
      }
      await axios.delete(
        `http://localhost:5000/jobs/delete/${jobId}`, // Backend API endpoint
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return jobId; // Job ID return kar raha hai jo delete hui
    } catch (error: any) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(error.response?.data || "Failed to delete job");
    }
  }
);
export const searchJobsAsync = createAsyncThunk(
  "jobs/searchJobs",
  async (
    { title, location }: { title?: string; location?: string },
    { rejectWithValue }
  ) => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("User not authenticated");
      }

      // Query parameters add karna
      const queryParams = new URLSearchParams();
      if (title) queryParams.append("title", title);
      if (location) queryParams.append("location", location);

      console.log("Searching jobs with:", { title, location });

      // API call with search parameters
      const response = await axios.get(
        `http://localhost:5000/jobs/all/data?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("API Response:", response.data);

      return response.data as JobResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to search jobs");
    }
  }
);

export const updateEmploymentStatusAsync = createAsyncThunk(
  "jobs/updateEmploymentStatus",
  async (
    { jobId, employmentStatus }: { jobId: number; employmentStatus: string },
    { rejectWithValue }
  ) => {
    try {
      const authToken = localStorage.getItem("token");

      if (!authToken) {
        return rejectWithValue("Unauthorized: No token found");
      }

      const response = await axios.put(
        `http://localhost:5000/jobs/update/employment-status/${jobId}`,
        { employment_status: employmentStatus },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to update employment status"
      );
    }
  }
);

export const fetchJobsStatsAsync = createAsyncThunk(
  "jobs/fetchJobsStats",
  async (_, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("User not authenticated");
      }

      const response = await axios.get("http://localhost:5000/jobs/status", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("Jobs Stats Response:", response.data);

      return {
        totalJobs: response.data.totalJobs,
        activeJobs: response.data.activeJobs,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch jobs stats"
      );
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload; // Manually update jobs array
    },
  }, // Other reducers if needed
  extraReducers: (builder) => {
    builder
      .addCase(createJobAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createJobAsync.fulfilled,
        (state, action: PayloadAction<Job>) => {
          console.log("Job Added Payload:", action.payload);
          state.loading = false;
          state.jobs.push(action.payload);
        }
      )
      .addCase(createJobAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchJobsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchJobsAsync.fulfilled,
        (state, action: PayloadAction<JobResponse>) => {
          console.log("Fetched Jobs Payload:", action.payload);
          state.loading = false;
          state.jobs = action.payload.data;
        }
      )
      .addCase(fetchJobsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.jobs = [];
      })
      .addCase(jobUpdateAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(jobUpdateAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedJob = action.payload;
        const index = state.jobs.findIndex((job) => job.id === updatedJob.id);
        if (index !== -1) {
          state.jobs[index] = updatedJob;
        }
      })
      .addCase(jobUpdateAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteJobAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteJobAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter((job) => job.id !== action.payload); // Job Redux state se hata do
      })
      .addCase(deleteJobAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchJobsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchJobsAsync.fulfilled,
        (state, action: PayloadAction<JobResponse>) => {
          console.log("Search Jobs Payload:", action.payload);
          state.loading = false;
          state.jobs = action.payload.data; // Search results ko state mein store karein
        }
      )
      .addCase(searchJobsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateEmploymentStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmploymentStatusAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedJob = action.payload.data; // Assuming the response returns updated job data
        const index = state.jobs.findIndex((job) => job.id === updatedJob.id);
        if (index !== -1) {
          state.jobs[index] = updatedJob; // Update the job in the state
        }
      })
      .addCase(updateEmploymentStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(totalActiveJobsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(totalActiveJobsAsync.fulfilled, (state, action) => {
        console.log("Total Active Jobs:", action.payload);
        state.loading = false;
        state.totalActiveJobs = action.payload; // Store the active jobs count
      })
      .addCase(totalActiveJobsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchJobsStatsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobsStatsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.totalJobs = action.payload.totalJobs;
        state.activeJobs = action.payload.activeJobs;
      })
      .addCase(fetchJobsStatsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default jobSlice.reducer;
