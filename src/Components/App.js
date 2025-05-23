import { AuthProvider } from "./Context/authcontext";
import Dashboard from "./Dashboard";
import Error404 from "./Error404";
import ProtectedRoute from "./ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
