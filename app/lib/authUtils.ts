import {jwtDecode} from "jwt-decode";
export const getUserIdFromToken = (): any | null => {
  const authToken = localStorage.getItem("token");
  if (!authToken) {
    return null;
  }
  const decodedToken: any = jwtDecode(authToken);
  return decodedToken.userId;
};

export const getemailFromToken = (): any | null => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const userObject = JSON.parse(storedUser); 
    return userObject.email
   }
};
export const getnameFromToken = (): any | null => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const userObject = JSON.parse(storedUser); 
    return userObject.name
   }
};