"use client";

import { getemailFromToken, getnameFromToken } from "@/app/lib/authUtils";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  FaBookmark,
  FaCog,
  FaQuestionCircle,
  FaStar,
  FaUser,
  FaUserCircle,
  FaUserShield,
} from "react-icons/fa";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";


export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const capitalizeFirstLetter = (name: string | null) => {
    if (!name) return "";
    const firstWord = name.split(" ")[0];
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
  };
  const handleLinkClick = (link: string) => {
    router.push(link);
  };

  useEffect(() => {
    const name = getnameFromToken();
    if (name) {
      setUserName(capitalizeFirstLetter(name));
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      const userEmail = getemailFromToken();
      setEmail(userEmail ?? "");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    router.push("/");
  };
  return (
    <nav className="relative w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 py-4 shadow-lg">
      <div className="flex items-center justify-between px-6 max-w-screen-xl mx-auto">
        <div className="flex items-center space-x-3">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white hover:text-indigo-100 transition-all duration-300 cursor-pointer">
         WorkConnect
          </span>
        </div>
        <div className="lg:hidden flex items-center space-x-4">
          {!userName ? (
            <>
              <Link href="/pages/auth/signin" passHref>
                <span className="text-white hover:text-indigo-100 text-sm lg:text-base font-medium border-b-2 border-transparent hover:border-white transition-all duration-300 cursor-pointer">
                  Login
                </span>
              </Link>
              <Link href="/pages/auth/signup" passHref>
                <span className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs sm:text-sm md:text-base lg:text-lg font-medium py-1 px-4 sm:px-5 md:px-6 lg:px-6 rounded-md shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
                  Sign Up
                </span>
              </Link>
            </>
          ) : (
            <span className="text-white text-lg font-medium flex items-center space-x-2">
              <FaUserCircle className="text-xl" />
              <span>{userName}</span>
            </span>
          )}
        </div>
        <button
          className="lg:hidden p-2 text-white hover:text-indigo-100 transition-all duration-300"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="[&>svg]:w-8 [&>svg]:stroke-white/80">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>
        <div className="hidden lg:flex items-center space-x-8">
          <span
            onClick={() => handleLinkClick("/pages/candidate")}
            className={`text-white text-lg font-medium transition-all duration-300 cursor-pointer relative group ${
              pathname === "/pages/candidate"
                ? "text-indigo-100 border-b-2 border-white"
                : "hover:text-indigo-100"
            }`}
          >
            Home
          </span>

          <span
            onClick={() => handleLinkClick("/")}
            className={`text-white text-lg font-medium transition-all duration-300 cursor-pointer relative group ${
              pathname === "/" ? "text-indigo-100" : "hover:text-indigo-100"
            }`}
          >
            Company Reviews
          </span>

          <span
            onClick={() => handleLinkClick("/pages/candidate/applied-jobs")}
            className={`text-white text-lg font-medium transition-all duration-300 cursor-pointer relative group  ${
              pathname === "/pages/candidate/applied-jobs"
                ? "text-indigo-100 border-b-2 border-white"
                : "hover:text-indigo-100"
            }`}
          >
            Applied Jobs
          </span>

          <span
            onClick={() => handleLinkClick("/pages/candidate/complete-profile")}
            className={`text-white text-lg font-medium transition-all duration-300 cursor-pointer relative group ${
              pathname === "/pages/candidate/complete-profile"
                ? "text-indigo-100 border-b-2 border-white"
                : "hover:text-indigo-100"
            }`}
          >
            Complete Profile
          </span>
        </div>
        <div className="hidden lg:flex items-center space-x-4 relative">
          {!userName ? (
            <>
              <Link href="/pages/auth/signin" passHref>
                <span className="text-white hover:text-indigo-100 text-lg font-medium cursor-pointer">
                  Login
                </span>
              </Link>
              <Link href="/pages/auth/signup" passHref>
                <span className="bg-indigo-700 hover:bg-indigo-800 text-white text-lg font-medium py-2 px-6 rounded-md shadow-md cursor-pointer">
                  Sign Up
                </span>
              </Link>
            </>
          ) : (
            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={toggleDropdown}
              >
                <FaUserCircle className="text-2xl text-white" />
                <span className="text-white text-lg font-medium">
                  {userName}
                </span>
              </div>
              {dropdownOpen && (
                <div className="z-50 absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md  flex flex-col overflow-hidden">
                  <span className="block text-center text-gray-900">
                    {email}
                  </span>

                  <div className="mt-4 flex flex-col items-start gap-1">
                    <Button
                      variant="profile"
                      type="button"
                      size="md"
                      beforeIcon={<FaUser />}
                      className="focus:outline-none focus:ring-0 "
                      onClick={()=>handleLinkClick("/pages/candidate/profile")}
                    >
                      Profile
                    </Button>
                    <Button
                      variant="profile"
                      type="button"
                      size="md"
                      onClick={()=>handleLinkClick("/pages/candidate/my-jobs")}
                      beforeIcon={<FaBookmark />}
                      className="focus:outline-none focus:ring-0 "
                    >
                      My jobs
                    </Button>
                    <Button
                      variant="profile"
                      type="button"
                      size="md"
                      beforeIcon={<FaStar />}
                      className="focus:outline-none focus:ring-0 "
                    >
                      My reviews
                    </Button>
                    <Button
                      variant="profile"
                      type="button"
                      size="md"
                      beforeIcon={<FaCog />}
                      className="focus:outline-none focus:ring-0 "
                       onClick={()=>handleLinkClick("/pages/candidate/settings")}
                    >
                      Settings
                    </Button>
                    <Button
                      variant="profile"
                      type="button"
                      size="md"
                      beforeIcon={<FaQuestionCircle />}
                      className="focus:outline-none focus:ring-0 "
                    >
                      Help
                    </Button>
                    <Button
                      variant="profile"
                      type="button"
                      size="md"
                      beforeIcon={<FaUserShield />}
                      className="focus:outline-none focus:ring-0 "
                    >
                      Privacy center
                    </Button>
                  </div>

                  <div className=" mt-3 border-t border-gray-300">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-center font-bold  text-blue-800 py-3 rounded-b-md hover:bg-blue-100 hover:text-blue-900 transition flex items-center justify-center"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div
        className={`lg:hidden bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="px-6 py-4">
          <Link href="/pages/candidate" passHref>
            <span className="text-white block py-2 cursor-pointer hover:text-gray-700">Home</span>
          </Link>
          <Link href="#" passHref>
            <span className="text-white block py-2 cursor-pointer hover:text-gray-700">
              Company Reviews
            </span>
          </Link>
          <Link href="/pages/candidate/applied-jobs" passHref>
            <span className="text-white block py-2 cursor-pointer hover:text-gray-700">
              Applied Jobs
            </span>
          </Link>
          <Link href="/pages/candidate/complete-profile" passHref>
            <span className="text-white block py-2 cursor-pointer hover:text-gray-700">
              Complete Profile
            </span>
          </Link>
         
            <Link
             href="/pages/candidate/profile" passHref>
             <span className="text-white block py-2 cursor-pointer hover:text-gray-700">
              Profile
             </span>
            </Link>
            <Link
             href="/pages/candidate/my-jobs" passHref>
             <span className="text-white block py-2 cursor-pointer hover:text-gray-700">
              My jobs
             </span>
            </Link>
            <Link
             href="/pages/candidate/reviews" passHref>
             <span className="text-white block py-2 cursor-pointer hover:text-gray-700">
              My reviews
             </span>
            </Link>
            <Link
             href="/pages/candidate/settings" passHref>
             <span className="text-white block py-2 cursor-pointer hover:text-gray-700">
              Settings
             </span>
            </Link>
            <Link
             href="/pages/candidate/help" passHref>
             <span className="text-white block py-2 cursor-pointer hover:text-gray-700">
              Help
             </span>
            </Link>
            <Link
             href="/pages/candidate/privacy-center" passHref>
             <span className="text-white block py-2 cursor-pointer hover:text-gray-700">
              Privacy center
             </span>
            </Link>
            <Link
             href="/pages/candidate/sign-out" passHref>
             <span onClick={handleLogout} className="text-white block py-2 cursor-pointer hover:text-gray-700">
              Sign out
             </span>
            </Link>
        </div>
      </div>
    </nav>
  );
}
