import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface JobApplication {
  id: number;
  job: {
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
  };
  candidate: {
    id: number;
    fullname: string;
    contact_number: string;
    email: string;
    address: string;
    skill: string;
    education: string;
    work_experience: string;
    resume_link: string;
    portfolio_link: string;
    linkedin_url: string;
    github_url: string;
  };
  status: string;
  resume: string;
}

interface JobAppState {
  jobApplications: {
    jobTitle: string;
    applications: JobApplication[];
    applicationsCount: number;
    jobId: number;
  }[];
  jobApplication: JobApplication | null;
  appliedJobs: JobApplication[];
  totalApplications: number;
  loading: boolean;
  error: string | null;
}

const initialState: JobAppState = {
  jobApplications: [],
  appliedJobs: [],
  jobApplication: null,
    totalApplications: 0,  
  loading: false,
  error: null,
};

export const createJobAppAsync = createAsyncThunk(
  "jobApplication/createJobAppAsync",
  async (
    {
      formData,
      job_id,
      authToken,
    }: { formData: FormData; job_id: number; authToken: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/jobapplication/apply/${job_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.jobApplication;
    } catch (error: any) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(error.response?.data || "Failed to apply for job");
    }
  }
);
export const fetchJobAppAsync = createAsyncThunk(
  "jobApplication/fetchJobAppAsync",
  async (
    { employer_id, authToken }: { employer_id: number; authToken: string },
    { rejectWithValue }
  ) => {
    console.log("Auth Token:", authToken); // Log to verify token is valid
    try {
      const response = await axios.get(
        `http://localhost:5000/jobapplication/fetchApplications`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            employer_id,
          },
        }
      );
      return response.data.jobApplications;
    } catch (error: any) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Failed to fetch job applications"
      );
    }
  }
);
export const fetchAppliedJobAppsAsync = createAsyncThunk(
  "jobApplication/fetchAppliedJobAppsAsync",
  async (
    { candidate_id, authToken }: { candidate_id: number; authToken: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("API Call Initiated with:", {
        candidate_id,
        authToken,
      });

      const response = await axios.get(
        `http://localhost:5000/jobapplication/fetchAppliedApplications`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: { candidate_id },
        }
      );

      console.log("API Response Data:", response.data); // ✅ Debug API Response

      return response.data.appliedJobs;
    } catch (error: any) {
      console.error("API Error:", error.response?.data); // ✅ Debug API Error Response
      return rejectWithValue(
        error.response?.data || "Failed to fetch applied job applications"
      );
    }
  }
);

export const updateJobAppStatusAsync = createAsyncThunk(
  "jobApplication/updateJobAppStatusAsync",
  async (
    {
      applicationId,
      status,
      authToken,
    }: { applicationId: number; status: string; authToken: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/jobapplication/updatestatus/${applicationId}`,
        { status }, // Send status in request body
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data; // Backend se updated job application return hoga
    } catch (error: any) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Failed to update job application status"
      );
    }
  }
);
export const fetchTotalApplicationsAsync = createAsyncThunk<
  number, // return type
  void,   // argument type
  { rejectValue: string } // error type
>(
  "jobApplication/fetchTotalApplications",
  async (_, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/jobapplication/all", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // backend response: { success: true, totalApplications: 21 }
      return response.data.totalApplications as number;
    } catch (error: any) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch total applications");
    }
  }
);

const jobAppSlice = createSlice({
  name: "jobApplication",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createJobAppAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createJobAppAsync.fulfilled,
        (state, action: PayloadAction<JobApplication>) => {
          state.loading = false;
          state.jobApplication = action.payload;
        }
      )
      .addCase(createJobAppAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchJobAppAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchJobAppAsync.fulfilled,
        (
          state,
          action: PayloadAction<
            {
              jobTitle: string;
              jobId: number;
              applications: JobApplication[];
            }[]
          >
        ) => {
          state.loading = false;
          state.jobApplications = action.payload.map((job) => ({
            ...job,
            applicationsCount: job.applications.length,
          }));
        }
      )
      .addCase(fetchJobAppAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.jobApplications = [];
      })
      .addCase(fetchAppliedJobAppsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAppliedJobAppsAsync.fulfilled,
        (state, action: PayloadAction<JobApplication[]>) => {
          state.loading = false;
          state.appliedJobs = action.payload;
          console.log("Dispatched Applied Jobs:", action.payload);
        }
      )
      .addCase(fetchAppliedJobAppsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateJobAppStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateJobAppStatusAsync.fulfilled,
        (state, action: PayloadAction<JobApplication>) => {
          state.loading = false;

          // Find the application in state and update its status
          state.jobApplications = state.jobApplications.map((job) => ({
            ...job,
            applications: job.applications.map((app) =>
              app.id === action.payload.id
                ? { ...app, status: action.payload.status }
                : app
            ),
          }));
        }
      )
      .addCase(updateJobAppStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
       .addCase(fetchTotalApplicationsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalApplicationsAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.totalApplications = action.payload;
      })
      .addCase(fetchTotalApplicationsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});

export default jobAppSlice.reducer;
