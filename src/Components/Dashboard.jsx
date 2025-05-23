import React, { useState } from "react";
import { useAuth } from "./Context/authcontext";
import { Navigate, NavLink } from "react-router-dom";
import CharitiesContent from "./CharitiesContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
  const { logout } = useAuth();
  const [redirectToHome, setRedirectToHome] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      setRedirectToHome(true);
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (redirectToHome) {
    // Redirect to the login page after logout
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-48 h-screen bg-gray-50 shadow-xl fixed top-0 left-0">
        <h1 className="p-4 text-xl font-poppins font-bold">
          <span className="text-cyan-500">Hope</span>Link
        </h1>
        <nav className="mt-6 space-y-1">
          <NavLink
            to="#1"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive ? "bg-slate-200 " : "hover:bg-gray-200"
              }`
            }
          >
            Charities
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-48 flex-1 p-6">
        <div className="flex items-center place-items-center justify-between">
          <h2 className="text-xl font-semibold ">Dashboard Content</h2>
          <div className="flex place-items-center">
            <p className="font-poppins">Admin User</p>
            <button
              type="button"
              onClick={handleLogout}
              className="group flex items-center ml-4 place-items-center bg-slate-200 p-2 rounded-md hover:bg-red-600 transition duration-200 ease-in-out"
            >
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                className="group-hover:text-white text-slate-800"
              />
            </button>
          </div>
        </div>
        <div className="mt-10">
          <CharitiesContent />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
