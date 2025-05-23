import React, { useState } from "react";
import { useAuth } from "./Context/authcontext";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const [redirectTo, setRedirectTo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const role = await login(email, password);

      if (role === "admin") {
        setRedirectTo("/admin-dashboard");
      } else {
        setError("You are not authorized as an admin");
      }
    } catch (error) {
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="login-container w-full min-h-screen flex justify-center items-center bg-slate-100">
      <div className="login-card relative bg-white rounded-lg flex min-w-96 gap-8 shadow-xl">
        <div className="right-side p-8">
          <div className="head-card mb-4">
            <img
              className="w-80 mt-2 ml-2 absolute -top-36 -left-20"
              src="/assets/HopeLink-Logo.png"
              alt="logo"
            />
          </div>

          <div className="body-card">
            <h2 className="text-3xl font-poppins font-semibold text-center mt-10 mb-3">
              Welcome <span className="text-cyan-500">Admin!</span>
            </h2>
            <p className="font-poppins text-sm text-center mb-6">
              Please enter your credentials.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 font-semibold text-xs">{error}</p>
              )}
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full mt-3 bg-cyan-500 text-white py-3 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                >
                  Login
                </button>
                <p className="text-xs text-center mt-2 text-gray-400 font-poppins">
                  Can't log in? Contact IT support.
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="left-side">
          <img
            className="min-w-full min-h-full brightness-50 rounded-r-lg"
            src="/assets/admin-login.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
