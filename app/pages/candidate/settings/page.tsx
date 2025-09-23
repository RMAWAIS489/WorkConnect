"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Switch } from "@headlessui/react";
import {
  LockClosedIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  changePasswordAsync,
  deleteAccountAsync,
  updateEmailAsync,
} from "@/app/redux/user/slice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { getemailFromToken, getUserIdFromToken } from "@/app/lib/authUtils";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import InputField from "@/app/components/ui/input";

export default function AccountSettings() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.users);
  const [enabled, setEnabled] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [newEmail, setNewEmail] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldEmail, setOldEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleChangePassword = async () => {
    try {
      const result = await dispatch(changePasswordAsync(passwords));
      console.log("✅ Password change response:", result);
    } catch (error) {
      console.error("❌ Error changing password:", error);
    }
    setPasswordModalOpen(false);
  };
  const handleUpdateEmail = async () => {
    try {
      const response = await dispatch(updateEmailAsync({ newEmail }));

      if (response?.payload?.success) {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          const userData = JSON.parse(storedUser);

          if (userData && typeof userData === "object") {
            userData.email = newEmail;
            localStorage.setItem("user", JSON.stringify(userData));
            console.log("Updated Email in LocalStorage:", newEmail);
            setOldEmail(newEmail);
          } else {
            console.error("Invalid user data in localStorage.");
          }
        } else {
          console.error("No user data found in localStorage.");
        }
      }
      setEmailModalOpen(false);
    } catch (error) {
      console.error("Failed to update email:", error);
    }
  };
  const handleDeleteAccount = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error("User ID not found.");
        return;
      }
      const response = await dispatch(deleteAccountAsync({ userId }));
      console.log("it is response", response);
      if (response?.payload?.success) {
        console.log("Account deleted successfully.");
      }
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
  useEffect(() => {
    const email = getemailFromToken();
    setOldEmail(email ?? "");
  }, [isEmailModalOpen]);
  return (
    <div className="w-full  min-h-[521px]  bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 flex flex-col items-center justify-start pt-16 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto p-6 mt-[-30px]"
      >
        <h2 className="text-3xl font-bold text-white mb-6">
          Account Settings 🔐
        </h2>
        <div className="rounded-xl p-5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LockClosedIcon className="h-6 w-6 text-white" />
            <h3 className="text-lg font-medium">Change Password</h3>
          </div>
          <Button

            variant="primary"
            size="md"
            onClick={() => setPasswordModalOpen(true)}
            className="focus:outline-none focus:ring-0 "
          >
            Edit
          </Button>
        </div>
        <div className="  rounded-xl p-5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EnvelopeIcon className="h-6 w-6 text-white" />
            <h3 className="text-lg font-medium">Manage Email</h3>
          </div>
          <Button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-0 "
            onClick={() => setEmailModalOpen(true)}
          >
            Edit
          </Button>
        </div>
        <div className=" rounded-xl p-5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="h-6 w-6 text-white" />
            <h3 className="text-lg font-medium">
              Enable Two-Factor Authentication
            </h3>
          </div>
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`${
              enabled ? "bg-green-600" : "bg-gray-400"
            } relative inline-flex h-6 w-11 items-center rounded-full transition`}
          >
            <span
              className={`${
                enabled ? "translate-x-6 " : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>
        <div className="rounded-xl p-5  flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrashIcon className="h-6 w-6 text-white" />
            <h3 className="text-lg font-medium text-white">Delete Account</h3>
          </div>
          <div>
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition focus:outline-none focus:ring-0 "
            >
              Delete Account
            </Button>
            {isOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h2 className="text-gray-700 text-lg font-bold mb-4">Are you sure?</h2>
                  <p className="text-gray-600 mb-4">
                    This action cannot be undone. Your account will be
                    permanently deleted.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <Button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        handleDeleteAccount();
                        setIsOpen(false);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <Dialog
          open={isPasswordModalOpen}
          onClose={() => setPasswordModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
            <DialogPanel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <DialogTitle className="text-lg font-bold">
                  Change Password
                </DialogTitle>
                <XMarkIcon
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => setPasswordModalOpen(false)}
                />
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <InputField
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Old Password"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <InputField
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setPasswordModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
        <Dialog
          open={isEmailModalOpen}
          onClose={() => setEmailModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
            <DialogPanel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <DialogTitle className="text-lg font-bold">
                  Update Email
                </DialogTitle>
                <XMarkIcon
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => setEmailModalOpen(false)}
                />
              </div>
              <div className="space-y-4">
                <input
                  type="email"
                  value={oldEmail}
                  readOnly
                  className="w-full p-2 bg-white border  rounded-lg focus:outline-none"
                />
                <InputField
                  type="email"
                  placeholder="New Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setEmailModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateEmail}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </motion.div>
      </div>
   
  );
}
