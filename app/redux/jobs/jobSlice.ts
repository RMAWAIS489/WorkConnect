import { DecodedToken } from "@/app/lib/authUtils";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
export interface Job {
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
  totalJobs: number;
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
  data: Job[];
}

export const createJobAsync = createAsyncThunk(
  "jobs/createJob",
  async (jobData: Omit<Job, "id">, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.post(
        "https://eloquent-nature-production-3df9.up.railway.app/jobs/create",
        jobData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("API Response:", response.data);

      return response.data.job as Job;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "Job creation failed");
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

export const fetchAllJobsAsync = createAsyncThunk(
  "jobs/fetchAllJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://eloquent-nature-production-3df9.up.railway.app/jobs/all"
      );

      console.log("Fetched All Jobs:", response.data);

      return response.data as JobResponse;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "Failed to fetch jobs");
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);


export const fetchJobsAsync = createAsyncThunk(
  "jobs/fetchJobs",
  async (userId: number | null, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("User not authenticated");
      }

      const decodedToken: DecodedToken = jwtDecode(authToken);
      console.log("Decoded Token:", decodedToken);

      if (!userId) {
        return rejectWithValue("User ID is missing in token");
      }

      console.log("Extracted User ID:", userId);
      const response = await axios.get(
        `https://eloquent-nature-production-3df9.up.railway.app/jobs/fetch/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("API Response:", response.data);
      return response.data as JobResponse;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "Failed to fetch jobs");
      }
      return rejectWithValue("Unexpected error occurred");
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
      const decodedToken: DecodedToken = jwtDecode(authToken);
      console.log("Decoded Token:", decodedToken);
      if (!userId) {
        return rejectWithValue("User ID is missing in token");
      }
      console.log("Extracted User ID:", userId);
      const response = await axios.get(
        `https://eloquent-nature-production-3df9.up.railway.app/jobs/ActiveJobs/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("API Response:", response.data);
      return response.data.totalActiveJobs as number;
    } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    return rejectWithValue(error.response?.data || "Failed to fetch jobs");
  }
  return rejectWithValue("Failed to fetch jobs");
}

  }
);

export const jobUpdateAsync = createAsyncThunk(
  "jobs/updateJob",
  async (job: Job, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");

      if (!authToken) {
        return rejectWithValue({ message: "Unauthorized: No token found" });
      }

      const response = await axios.put(
        `https://eloquent-nature-production-3df9.up.railway.app/jobs/update/${job.id}`,
        job,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || { message: "Something went wrong" }
        );
      }
      return rejectWithValue({ message: "Something went wrong" });
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
      await axios.delete(`https://eloquent-nature-production-3df9.up.railway.app/jobs/delete/${jobId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      return jobId;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        return rejectWithValue(error.response?.data || "Failed to delete job");
      }
      console.error("Unexpected Error:", error);
      return rejectWithValue("Failed to delete job");
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

      const queryParams = new URLSearchParams();
      if (title) queryParams.append("title", title);
      if (location) queryParams.append("location", location);

      console.log("Searching jobs with:", { title, location });

      const response = await axios.get(
        `https://eloquent-nature-production-3df9.up.railway.app/jobs/all/data?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("API Response:", response.data);

      return response.data as JobResponse;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "Failed to search jobs");
      }
      return rejectWithValue("Failed to search jobs");
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
        `https://eloquent-nature-production-3df9.up.railway.app/jobs/update/employment-status/${jobId}`,
        { employment_status: employmentStatus },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Failed to update employment status"
        );
      }
      return rejectWithValue("Failed to update employment status");
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

      const response = await axios.get("https://eloquent-nature-production-3df9.up.railway.app/jobs/status", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("Jobs Stats Response:", response.data);

      return {
        totalJobs: response.data.totalJobs,
        activeJobs: response.data.activeJobs,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Failed to fetch jobs stats"
        );
      }
      return rejectWithValue("Failed to fetch jobs stats");
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
  },
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
      .addCase(fetchAllJobsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllJobsAsync.fulfilled, (state, action) => {
        console.log("Fetched Jobs Payload:", action.payload);
        state.loading = false;
        state.jobs = action.payload.data;
      })
      .addCase(fetchAllJobsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.jobs = [];
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
        state.jobs = state.jobs.filter((job) => job.id !== action.payload); 
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
          state.jobs = action.payload.data;
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
        const updatedJob = action.payload.data; 
        const index = state.jobs.findIndex((job) => job.id === updatedJob.id);
        if (index !== -1) {
          state.jobs[index] = updatedJob; 
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
        state.totalActiveJobs = action.payload; 
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
