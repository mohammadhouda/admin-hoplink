import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPlus,
  faXmark,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { auth, database } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set, onValue } from "firebase/database";
import { signInWithEmailAndPassword } from "firebase/auth";

function CharitiesContent() {
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [charities, setCharities] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    category: "",
    adminPassword: "",
  });
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const usersRef = ref(database, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const loadedCharities = [];
      for (let id in data) {
        if (data[id].role === "charity") {
          loadedCharities.push({ id, ...data[id] });
        }
      }
      setCharities(loadedCharities);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  function handleFormChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleCreateAccountClick() {
    setShowForm(true);
  }

  function handleChange(e) {
    setSearchValue(e.target.value);
  }

  const handleDelete = async (uid) => {
    try {
      setDeletingId(uid);

      const token = await auth.currentUser.getIdToken(true);
      const res = await fetch(
        "https://us-central1-hopelink-cca2d.cloudfunctions.net/deleteUserAndData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ uid }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
    } catch (err) {
      console.error("Function call failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCharities = charities.filter((charity) =>
    charity.name.toLowerCase().includes(searchValue.toLocaleLowerCase())
  );

  const charitiesPerPage = 7;
  const indexOfLastCharity = currentPage * charitiesPerPage;
  const indexOfFirstCharity = indexOfLastCharity - charitiesPerPage;
  const currentCharities = filteredCharities.slice(
    indexOfFirstCharity,
    indexOfLastCharity
  );
  const totalPages = Math.ceil(filteredCharities.length / charitiesPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { email, password, name, category, adminPassword } = formData;

      const adminEmail = auth.currentUser.email;
      await createUserWithEmailAndPassword(auth, email, password);
      const userId = auth.currentUser.uid;

      await set(ref(database, `users/${userId}`), {
        name,
        email,
        role: "charity",
        category,
        dateAdded: new Date().toISOString().split("T")[0],
      });

      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        category: "",
        adminPassword: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <h2 className="font-poppins text-lg">Charities Accounts</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <input
              type="search"
              placeholder="Search for charities"
              value={searchValue}
              onChange={handleChange}
              className="pl-8 pr-2 py-1 border backdrop:blur-sm border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <button
            onClick={handleCreateAccountClick}
            className="bg-cyan-500 font-semibold p-1 px-2 text-white rounded-md hover:bg-cyan-600 transition duration-200 ease-in-out"
          >
            <FontAwesomeIcon className="text-sm mr-1" icon={faPlus} />
            Add Charity
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              onClick={() => setShowForm(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h3 className="text-lg font-semibold mb-4">
              Create Charity Account
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="">Select category</option>
                  <option value="General">General</option>
                  <option value="Food">Food</option>
                  <option value="Education">Education</option>
                  <option value="Medical">Medical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  name="adminPassword"
                  value={formData.adminPassword}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {loading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-cyan-500"></div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600"
                >
                  Create Account
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Charities Table */}
      <div className="mt-10 overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Date Added</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filteredCharities.length > 0 ? (
              currentCharities.map((charity) => (
                <tr
                  key={charity.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 font-semibold text-black first-letter:uppercase">
                    {charity.name}
                  </td>
                  <td className="py-3 px-6">{charity.email}</td>
                  <td className="py-3 px-6">{charity.category}</td>
                  <td className="py-3 px-6">
                    {new Date(charity.dateAdded).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleDelete(charity.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      {deletingId === charity.id ? (
                        <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      ) : (
                        <FontAwesomeIcon icon={faTrash} />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No charities found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            disabled={loading}
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === i + 1
                ? "bg-cyan-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
export default CharitiesContent;
