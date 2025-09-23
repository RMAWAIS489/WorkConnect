import { DecodedToken } from "@/app/lib/authUtils";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface Candidate {
  id: number;
  userId: number;
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
}

interface CandidateState {
  candidate: Candidate | null;
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
}

interface CreateCandidateResponse {
  message: string;
  candidate: Candidate;
}

// Initial State
const initialState: CandidateState = {
  candidate: null,
  candidates: [],
  loading: false,
  error: null,
};
interface CandidateResponse {
  success: boolean;
  data: Candidate;
}

export const createCandidateAsync = createAsyncThunk<
  CreateCandidateResponse,
  FormData
>(
  "candidate/createCandidate",
  async (candidateFormData, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("User not authenticated");
      }

      const response = await axios.post(
        "http://localhost:5000/candidate/information",
        candidateFormData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    }  catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error("API Error:", error.response?.data);
    return rejectWithValue(
      error.response?.data || "Failed to create candidate"
    );
  }

  console.error("Unexpected Error:", error);
  return rejectWithValue("Unexpected error occurred");
}
  }
);

export const fetchCandidateAsync = createAsyncThunk(
  "candidate/fetchCandidateAsync",
  async (_, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("User not authenticated");
      }
      const decodedToken: DecodedToken = jwtDecode(authToken);
      console.log("Decoded Token2:", decodedToken);
      const userId = decodedToken.userId;
      console.log("Extracted User ID2:", userId);
      const response = await axios.get<CandidateResponse>(
        `http://localhost:5000/candidate/information/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Candidate Data:", response.data.data);
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data?.data);
        return rejectWithValue(
          error.response?.data || "Failed to fetch candidate details"
        );
      }
      console.error("Unexpected Error:", error);
      return rejectWithValue("Unexpected error");
    }
  }
);

export const updateCandidateAsync = createAsyncThunk(
  "candidate/updateCandidateAsync",
  async (updatedCandidateData: CandidateResponse, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("User not authenticated");
      }

      const decodedToken: DecodedToken = jwtDecode(authToken);
      const userId: number = decodedToken.userId;
      const response = await axios.put(
        `http://localhost:5000/candidate/information/${userId}`,
        updatedCandidateData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API Sent Data:", updatedCandidateData);
      console.log("API Response:", response.data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        return rejectWithValue(
          error.response?.data || "Failed to update candidate details"
        );
      }

      console.error("Unexpected Error:", error);
      return rejectWithValue("Unexpected error occurred");
    }
  }
);
export const deleteCandidateAsync = createAsyncThunk(
  "candidate/deleteCandidateAsync",
  async (userId: number, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("User not authenticated");
      }
      const response = await axios.delete(
        `http://localhost:5000/candidate/information/${userId}`,
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
    console.error("API Error:", error.response?.data);
    return rejectWithValue(
      error.response?.data || "Failed to delete candidate details"
    );
  }

  console.error("Unexpected Error:", error);
  return rejectWithValue("Unexpected error occurred");
}
  }
);
export const fetchCandidateResumeAsync = createAsyncThunk(
  "candidate/fetchCandidateResumeAsync",
  async (_, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("User not authenticated");
      }

      const decodedToken: DecodedToken = jwtDecode(authToken);
      const userId = decodedToken.userId;

      const response = await axios.get(
        `http://localhost:5000/candidate/resume/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.resume_link;
    } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error("API Error:", error.response?.data);
    return rejectWithValue(
      error.response?.data || "Failed to fetch candidate resume"
    );
  }

  console.error("Unexpected Error:", error);
  return rejectWithValue("Unexpected error occurred");
}
  }
);
// ✅ New thunk: fetch all candidates
export const fetchAllCandidatesAsync = createAsyncThunk(
  "candidate/fetchAllCandidatesAsync",
  async (_, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("User not authenticated");
      }

      const response = await axios.get<ApiResponse<Candidate[]>>(
        "http://localhost:5000/candidate/all",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ ab response.data.data safe hoga
      return response.data.data;
    } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error("API Error:", error.response?.data);
    return rejectWithValue(
      error.response?.data || "Failed to fetch all candidates"
    );
  }

  console.error("Unexpected Error:", error);
  return rejectWithValue("Unexpected error occurred");
}
  }
);

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    setCandidate: (state, action: PayloadAction<Candidate | null>) => {
      state.candidate = action.payload;
    },
    resetCandidate: (state) => {
      state.candidate = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCandidateAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCandidateAsync.fulfilled,
        (state, action: PayloadAction<CreateCandidateResponse>) => {
          state.loading = false;
          state.candidate = action.payload.candidate;
        }
      )
      .addCase(createCandidateAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCandidateAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCandidateAsync.fulfilled,
        (state, action: PayloadAction<Candidate>) => {
          state.loading = false;
          state.candidate = action.payload;
        }
      )
      .addCase(fetchCandidateAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCandidateAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCandidateAsync.fulfilled,
        (state, action: PayloadAction<Candidate>) => {
          state.loading = false;
          state.candidate = action.payload;
        }
      )
      .addCase(updateCandidateAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCandidateAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCandidateAsync.fulfilled, (state) => {
        state.loading = false;
        state.candidate = null;
      })
      .addCase(deleteCandidateAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCandidateResumeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateResumeAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (state.candidate) {
          state.candidate.resume_link = action.payload;
        }
      })
      .addCase(fetchCandidateResumeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllCandidatesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllCandidatesAsync.fulfilled,
        (state, action: PayloadAction<Candidate[]>) => {
          state.loading = false;
          state.candidates = action.payload;
        }
      )
      .addCase(fetchAllCandidatesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCandidate, resetCandidate } = candidateSlice.actions;

export default candidateSlice.reducer;
