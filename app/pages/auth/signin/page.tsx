"use client";
import Link from "next/link";
import { FaGoogle, FaApple } from "react-icons/fa";
import { loginUserAsync, setUserRole } from "@/app/redux/user/slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import InputField from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

const SignIn = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = user;
    if (!email || !password) {
      toast.error("Email and password are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      const response = await dispatch(
        loginUserAsync({ email, password })
      ).unwrap();
      console.log("Login Successful:", response);
      setUser({ email: "", password: "" });
      const decodedToken: any = jwtDecode(response.token);
      console.log("Decoded Token:", decodedToken);
      dispatch(setUserRole(decodedToken.role));
      localStorage.setItem("role", decodedToken.role);
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
      });
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
      toast.error(err.response?.data?.message || "Invalid credentials!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 ">
      <form
        className="flex flex-col gap-4 bg-white p-8 w-96 rounded-2xl shadow-lg"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign In
        </h2>

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
            name="password"
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

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <label className="text-gray-600">Remember me</label>
          </div>
          <span className="text-blue-600 cursor-pointer">Forgot password?</span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={false}
          className="!rounded-full"
        >
          Sign In
        </Button>

        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/pages/auth/signup">
            <button className="text-blue-500 border-b-2 border-transparent dark:hover:text-blue-700 transition-all">
              Sign Up
            </button>
          </Link>
        </p>
        <p className="text-center text-gray-500">Or sign in with</p>
        <div className="flex justify-center gap-4">
          <Button
            
            size="md"
            className="border !rounded-full !bg-white !text-gray-700 "
            beforeIcon={<FaGoogle className="text-red-500 " size={20} />}
          >
            Google
          </Button>
          <Button
            
            size="md"
            className="border !rounded-full !bg-white !text-gray-700 "
            beforeIcon={<FaApple className="text-black" size={20} />}
          >
            Apple
          </Button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
