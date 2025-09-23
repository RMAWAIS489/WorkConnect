import { DecodedToken } from "@/app/lib/authUtils";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
export interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string; 
}
interface User {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  users: UserListItem[];
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  users: [],
  token: null,
  loading: false,
  error: null,
};

export const fetchUsersAsync = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.users; 
    }catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    return rejectWithValue(error.response?.data || "Failed to fetch users");
  }
  return rejectWithValue("Failed to fetch users");
}

  }
);
export const addUserAsync = createAsyncThunk(
  "auth/addUserAsync",
  async (user: User, { rejectWithValue }) => {
    try {
      console.log("Sending Signup Data to Backend:", user);

      const response = await axios.post(
        "http://localhost:5000/users/register",
        user,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

     
      const decodedToken: DecodedToken = jwtDecode(response.data.token);
      console.log("Decoded Signup Token:", decodedToken);

      return {
        user: {
          email: user.email,
          role: decodedToken.role,
          name: decodedToken.name,
        },
        token: response.data.token,
      };
    }catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    return rejectWithValue(error.response?.data || "Signup failed");
  }
  return rejectWithValue("Signup failed");
}

  }
);

export const loginUserAsync = createAsyncThunk(
  "auth/loginUserAsync",
  async (user: User, { rejectWithValue }) => {
    try {
      console.log("Sending Data to Backend:", user);

      const response = await axios.post(
        "http://localhost:5000/users/login",
        user,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const decodedToken: DecodedToken = jwtDecode(response.data.token);
      console.log("Decoded Token:", decodedToken);

      return {
        user: {
          email: user.email,
          role: decodedToken.role,
          name: decodedToken.name,
        },
        token: response.data.token,
      };
    }catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    return rejectWithValue(error.response?.data || "Login failed");
  }
  return rejectWithValue("Login failed");
}

  }
);
export const changePasswordAsync = createAsyncThunk(
  "auth/changePassword",
  async (
    {
      currentPassword,
      newPassword,
    }: { currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/users/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    }catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    return rejectWithValue(error.response?.data || "Failed to change password");
  }
  return rejectWithValue("Failed to change password");
}

  }
);


export const updateEmailAsync = createAsyncThunk(
  "auth/updateEmail",
  async ({ newEmail }: { newEmail: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/users/update-email",
        { newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    }catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    return rejectWithValue(error.response?.data || "Failed to update email");
  }
  return rejectWithValue("Failed to update email");
}

  }
);
export const deleteAccountAsync = createAsyncThunk(
  "auth/deleteAccount",
  async ({ userId }: { userId: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        "http://localhost:5000/users/delete-account",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { userId },
        }
      );

      return response.data;
    } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    return rejectWithValue(error.response?.data || "Failed to delete account");
  }
  return rejectWithValue("Failed to delete account");
}

  }
);
export const deleteUserAsync = createAsyncThunk(
  "users/deleteUser",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:5000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    }catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    return rejectWithValue(error.response?.data || "Failed to delete user");
  }
  return rejectWithValue("Failed to delete user");
}

  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    },
    setUserRole: (state, action: PayloadAction<string>) => {
      state.user = { ...(state.user || {}), role: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(addUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("role", action.payload.user.role);
      })
      .addCase(addUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login User
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("role", action.payload.user.role); // Store role
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changePasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.loading = false;
        console.log("password changed successfully");
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Email
      .addCase(updateEmailAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmailAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) state.user.email = action.payload.newEmail;
      })
      .addCase(updateEmailAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAccountAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccountAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
      })
      .addCase(deleteAccountAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsersAsync.fulfilled,
        (state, action: PayloadAction<UserListItem[]>) => {
          state.loading = false;
          state.users = action.payload;
        }
      )
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteUserAsync.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          // deleted user ko state.users se filter out karenge
          state.users = state.users.filter(
            (user) => user.id !== action.payload
          );
        }
      )
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUserRole } = authSlice.actions;
export default authSlice.reducer;
