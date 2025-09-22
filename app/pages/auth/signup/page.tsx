"use client";
import Link from "next/link";
import { addUserAsync, setUserRole } from "@/app/redux/user/slice";
import { AppDispatch } from "@/app/redux/store";
import { useState } from "react";
import { ToastContainer, ToastPosition, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import InputField from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { jwtDecode } from "jwt-decode";
enum UserRole {
  employer = "employer",
  candidate = "candidate",
  admin = "admin",
}
export default function SignUp() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: UserRole.candidate,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await dispatch(addUserAsync(user)).unwrap();
    console.log("Signup Successful:", response);

    setUser({ name: "", email: "", password: "", role: UserRole.candidate });

    const decodedToken: any = jwtDecode(response.token);
    console.log("Decoded Signup Token:", decodedToken);

    dispatch(setUserRole(decodedToken.role));
    localStorage.setItem("role", decodedToken.role);
    localStorage.setItem("authToken", response.token);

    toast.success("Signup successful!", {
      position: "top-right" as ToastPosition,
      autoClose: 3000,
    });

    // ✅ Redirect based on role (same as login)
    if (decodedToken.role === "employer") {
      router.push("/pages/employer/dashboard");
    } else if (decodedToken.role === "admin") {
      router.push("/pages/admin/dashboard");
    } else if (decodedToken.role === "candidate") {
      router.push("/pages/candidate");
    } else {
      console.error("Unknown role:", decodedToken.role);
    }
  } catch (err: any) {
    console.error(err);
    if (err.response && err.response.status === 409) {
      toast.error(err.response.data.message || "User with this email already exists!", {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
      });
    } else {
      toast.error("An error occurred. Please try again.", {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
      });
    }
  }
};

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     await dispatch(addUserAsync(user)).unwrap();
  //     toast.success("SignUp successful!", {
  //       position: "top-right" as ToastPosition,
  //       autoClose: 3000,
  //     });
  //     router.push("/pages/signin");
  //     setUser({ name: "", email: "", password: "", role: UserRole.candidate });
  //   } catch (err: any) {
  //     console.error(err);
  //     if (err.response && err.response.status === 409) {
  //       toast.error(err.response.data.message || "User with this email already exists!", {
  //         position: "top-right" as ToastPosition,
  //         autoClose: 3000,
  //       });
  //     } else {
  //       toast.error("An error occurred. Please try again.", {
  //         position: "top-right" as ToastPosition,
  //         autoClose: 3000,
  //       });
  //     }
  //   }
  // };
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-8 w-96 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
        <InputField
          label="Name"
          name="name"
          type="text"
          placeholder="Enter your Name"
          value={user.name}
          onChange={handleChange}
          className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
          required={true}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your Email"
          value={user.email}
          onChange={handleChange}
          className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
          required={true}
        />
        <div className="relative">
          <InputField
            label="Password"
            name ="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            value={user.password}
            onChange={handleChange}
           className="w-full mt-1 bg-white p-2 border rounded-lg focus-within:border-black"
           required={true}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Role</label>
          <div className="flex items-center border-2 rounded-lg px-3 py-2 bg-white focus-within:border-orange-500">
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="w-full border-none outline-none bg-transparent"
              required
            >
              <option value={UserRole.employer}>Employer</option>
              <option value={UserRole.candidate}>Candidate</option>
              {/* <option value={UserRole.admin}>Admin</option> */}
            </select>
          </div>
        </div>
        <Button type="submit" variant="primary" size="md" isLoading={false}
        className="!rounded-full">
  Sign Up
</Button>
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/pages/auth/signin">
            <button className="text-blue-500 border-b-2 border-transparent hover:text-blue-700 transition-all">
              Sign in
            </button>
          </Link>
        </p>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
      <ToastContainer />
    </div>
  );
}
