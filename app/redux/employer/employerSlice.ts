import { jwtDecode } from "jwt-decode";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { DecodedToken } from "@/app/lib/authUtils";

interface Employer {
  userId: number;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  company_name: string;
  contact_number: string;
  email: string;
  address: string;
  website: string;
  industry_type: string;
  company_description: string;
  linkedin_url: string;
}

interface EmployerState {
  employer: Employer | null;
  employers: Employer[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployerState = {
  employer: null,
  employers: [],
  loading: false,
  error: null,
};
interface EmployerResponse {
  success: boolean;
  data: Employer;
}
interface EmployerListResponse {
  success: boolean;
  data: Employer[];
}

export const addEmployerAsync = createAsyncThunk(
  "employer/addEmployerAsync",
  async (employerData: Employer, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("User not authenticated");
      }
      const decodedToken: DecodedToken = jwtDecode(authToken);
      console.log("Decoded Token:", decodedToken);
      const userId = decodedToken.userId;
      console.log("Extractedxx User ID:", userId);
      const employerPayload = { ...employerData, userId };
      const response = await axios.post(
        "https://eloquent-nature-production-3df9.up.railway.app/employer/information",
        employerPayload,
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
          error.response?.data || "Failed to save employer details"
        );
      }

      console.error("Unexpected Error:", error);
      return rejectWithValue("Unexpected error occurred");
    }
  }
);
export const fetchEmployerAsync = createAsyncThunk(
  "employer/fetchEmployerAsync",
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
      const response = await axios.get<EmployerResponse>(
        `https://eloquent-nature-production-3df9.up.railway.app/employer/information/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Employer Data:", response.data.data);
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data?.data);
        return rejectWithValue(
          error.response?.data || "Failed to fetch employer details"
        );
      }

      console.error("Unexpected Error:", error);
      return rejectWithValue("Unexpected error occurred");
    }
  }
);
export const updateEmployerAsync = createAsyncThunk(
  "employer/updateEmployerAsync",
  async (updatedEmployerData: EmployerResponse, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("User not authenticated");
      }

      const decodedToken: DecodedToken = jwtDecode(authToken);
      const userId: number = decodedToken.userId;
      const response = await axios.put(
        `https://eloquent-nature-production-3df9.up.railway.app/employer/information/${userId}`,
        updatedEmployerData,
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
          error.response?.data || "Failed to update employer details"
        );
      }

      console.error("Unexpected Error:", error);
      return rejectWithValue("Unexpected error occurred");
    }
  }
);
export const deleteEmployerAsync = createAsyncThunk(
  "employer/deleteEmployerAsync",
  async (userId: number, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("User not authenticated");
      }
      const response = await axios.delete(
        `https://eloquent-nature-production-3df9.up.railway.app/employer/information/${userId}`,
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
          error.response?.data || "Failed to delete employer details"
        );
      }

      console.error("Unexpected Error:", error);
      return rejectWithValue("Unexpected error occurred");
    }
  }
);
export const fetchAllEmployersAsync = createAsyncThunk(
  "employer/fetchAllEmployersAsync",
  async (_, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("User not authenticated");
      }

      const response = await axios.get<EmployerListResponse>(
        "https://eloquent-nature-production-3df9.up.railway.app/employer/all",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        return rejectWithValue(
          error.response?.data || "Failed to fetch all employers"
        );
      }

      console.error("Unexpected Error:", error);
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

const employerSlice = createSlice({
  name: "employer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addEmployerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addEmployerAsync.fulfilled,
        (state, action: PayloadAction<Employer>) => {
          state.loading = false;
          state.employer = action.payload;
        }
      )
      .addCase(addEmployerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchEmployerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEmployerAsync.fulfilled,
        (state, action: PayloadAction<Employer>) => {
          state.loading = false;
          state.employer = action.payload;
        }
      )
      .addCase(fetchEmployerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateEmployerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateEmployerAsync.fulfilled,
        (state, action: PayloadAction<Employer>) => {
          state.loading = false;
          state.employer = action.payload;
        }
      )
      .addCase(updateEmployerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteEmployerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployerAsync.fulfilled, (state) => {
        state.loading = false;
        state.employer = null;
      })
      .addCase(deleteEmployerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllEmployersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllEmployersAsync.fulfilled,
        (state, action: PayloadAction<Employer[]>) => {
          state.loading = false;
          state.employers = action.payload; // ✅ save array
        }
      )
      .addCase(fetchAllEmployersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default employerSlice.reducer;
