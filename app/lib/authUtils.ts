import { jwtDecode } from "jwt-decode";

// Define the shape of your JWT payload
export interface DecodedToken {
  userId: number;
   role: "employer" | "admin" | "candidate";
  email?: string;
  name?: string;
  exp?: number; // optional expiry timestamp
  iat?: number; // optional issued-at timestamp
}

// Define the shape of your stored user object
interface StoredUser {
  email: string;
  name: string;
}

export const getUserIdFromToken = (): number | null => {
  const authToken = localStorage.getItem("token");
  if (!authToken) {
    return null;
  }

  try {
    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(authToken);
    return decodedToken.userId;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const getemailFromToken = (): string | null => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const userObject: StoredUser = JSON.parse(storedUser);
    return userObject.email;
  }
  return null;
};

export const getnameFromToken = (): string | null => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const userObject: StoredUser = JSON.parse(storedUser);
    return userObject.name;
  }
  return null;
};
