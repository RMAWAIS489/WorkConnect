"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

interface EmployerSidebarProps {
  isSidebarOpen: boolean; 
  toggleSidebar: () => void; 
}

export default function EmployerSidebar({ isSidebarOpen, toggleSidebar }: EmployerSidebarProps) {
  const pathname = usePathname(); 
  const router = useRouter();
  const getActiveButton = (): string | null => {
    if (pathname === '/pages/employer/dashboard'||pathname === '/pages/employer/dashboard/post-job'||pathname === '/pages/employer/dashboard/job-details') {
      return 'dashboard';
    }
    else if (pathname === '/pages/employer/manage-jobs') {
      return 'manageJobs';
    } else if (pathname === '/pages/employer/view-applications') {
      return 'viewApplications';
    } else if (pathname === '/pages/employer/company-profile'||pathname === '/pages/employer/company-profile/complete-profile'||pathname === '/pages/employer/company-profile/update-profile') {
      return 'companyProfile';
    }
    else if (pathname === '/pages/employer/settings') {
      return 'settings';
    }
    return null;
  };

  const activeButton = getActiveButton(); 
  const handleLinkClick = (link: string) => {
    router.push(link);
  };
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user'); 
    localStorage.removeItem('role');
    router.push('/pages/auth/signin'); 
  };
  return (
    <>
      <div
        className={`card w-60 fixed bg-white p-5 shadow-md shadow-purple-200/50 rounded-md h-screen transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 -right-10 p-2 bg-purple-600 text-white rounded-full shadow-lg"
        >
          {isSidebarOpen ? '<' : '>'}
        </button>

        <ul className="w-full flex flex-col gap-0">
         
          <li className="flex items-center cursor-pointer p-4 w-full whitespace-nowrap">
            
              <button
                onClick={() => handleLinkClick("/pages/employer/dashboard")}

                className={`p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner text-gray-700 transition-all ease-linear flex items-center gap-2 ${
                   pathname === "/pages/employer/dashboard"||activeButton === 'dashboard'
                    ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
                    : ''
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M14,10V22H4a2,2,0,0,1-2-2V10Z"></path>
                  <path fill="currentColor" d="M22,10V20a2,2,0,0,1-2,2H16V10Z"></path>
                  <path fill="currentColor" d="M22,4V8H2V4A2,2,0,0,1,4,2H20A2,2,0,0,1,22,4Z"></path>
                </svg>
                Dashboard
              </button>
           
          </li>
          <li className="flex items-center cursor-pointer p-4 w-full whitespace-nowrap">
            
              <button
              onClick={()=>handleLinkClick("/pages/employer/manage-jobs")}
                className={`p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner text-gray-700 transition-all ease-linear flex items-center gap-2 ${
                   pathname === "/pages/employe/manage-jobs"||activeButton === 'manageJobs'
                    ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
                    : ''
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M4,2V22H16V10L22,10V2A2,2,0,0,1,20,4H6A2,2,0,0,1,4,2Z"></path>
                </svg>
                Manage Jobs
              </button>
            
          </li>
          <li className="flex items-center cursor-pointer p-4 w-full whitespace-nowrap">
            
              <button
              onClick={()=>handleLinkClick("/pages/employer/view-applications")}
                className={`p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner text-gray-700 transition-all ease-linear flex items-center gap-2 ${
                   pathname === "/pages/employe/view-applications"||activeButton === 'viewApplications'
                    ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
                    : ''
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M18,14H6V6H18V14Z"></path>
                  <path fill="currentColor" d="M20,18H4V16H20V18Z"></path>
                </svg>
                View Applications
              </button>
            
          </li>
          <li className="flex items-center cursor-pointer p-4 w-full whitespace-nowrap">
            
              <button
               onClick={()=>handleLinkClick("/pages/employer/company-profile")}
                className={`p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner text-gray-700 transition-all ease-linear flex items-center gap-2 ${
                  pathname === "/pages/employe/company-profile" ||activeButton === 'companyProfile'
                    ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
                    : ''
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,7C9.79,7 8,8.79 8,11C8,13.21 9.79,15 12,15C14.21,15 16,13.21 16,11C16,8.79 14.21,7 12,7ZM12,13C10.89,13 10,12.11 10,11C10,9.89 10.89,9 12,9C13.11,9 14,9.89 14,11C14,12.11 13.11,13 12,13ZM12,2C6.48,2 2,6.48 2,11C2,12.66 2.29,14.25 2.81,15.63C4.11,14.57 5.77,14 7.5,14C9.19,14 10.75,14.48 12,15.04C13.25,14.48 14.81,14 16.5,14C18.23,14 19.89,14.57 21.19,15.63C21.71,14.25 22,12.66 22,11C22,6.48 17.52,2 12,2Z"></path>
                </svg>
                Company Profile
              </button>
            
          </li>
          <li className="flex items-center cursor-pointer p-4 w-full whitespace-nowrap">
           
           <button
           onClick={()=>handleLinkClick("/pages/employer/settings")}
              className={`p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner text-gray-700 transition-all ease-linear flex items-center gap-2 ${
                pathname === "/pages/employe/settings" || activeButton === 'settings'
                  ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
                  : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="M5,2C3.34315,2 2,3.34315 2,5V19C2,20.6569 3.34315,22 5,22H14.5C15.8807,22 17,20.8807 17,19.5V16.7326C16.8519,16.647 16.7125,16.5409 16.5858,16.4142C15.9314,15.7598 15.8253,14.7649 16.2674,14H13C11.8954,14 11,13.1046 11,12C11,10.8954 11.8954,10 13,10H16.2674C15.8253,9.23514 15.9314,8.24015 16.5858,7.58579C16.7125,7.4591 16.8519,7.35296 17,7.26738V4.5C17,3.11929 15.8807,2 14.5,2H5Z"></path>
              </svg>
              Settings
            </button>
           
          </li>
          <li className="flex items-center cursor-pointer p-4 w-full whitespace-nowrap">
            <button
             onClick={handleLogout}
              className={`p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner text-gray-700 transition-all ease-linear flex items-center gap-2 ${
                activeButton === 'logout'
                  ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
                  : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17.2929 14.2929C16.9024 14.6834 16.9024 15.3166 17.2929 15.7071C17.6834 16.0976 18.3166 16.0976 18.7071 15.7071L21.6201 12.7941C21.6351 12.7791 21.6497 12.7637 21.6637 12.748C21.87 12.5648 22 12.2976 22 12C22 11.7024 21.87 11.4352 21.6637 11.252C21.6497 11.2363 21.6351 11.2209 21.6201 11.2059L18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289C16.9024 8.68342 16.9024 9.31658 17.2929 9.70711L18.5858 11H13C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13H18.5858L17.2929 14.2929Z"></path>
                <path fill="currentColor" d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H14.5C15.8807 22 17 20.8807 17 19.5V16.7326C16.8519 16.647 16.7125 16.5409 16.5858 16.4142C15.9314 15.7598 15.8253 14.7649 16.2674 14H13C11.8954 14 11 13.1046 11 12C11 10.8954 11.8954 10 13 10H16.2674C15.8253 9.23514 15.9314 8.24015 16.5858 7.58579C16.7125 7.4591 16.8519 7.35296 17 7.26738V4.5C17 3.11929 15.8807 2 14.5 2H5Z"></path>
              </svg>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}