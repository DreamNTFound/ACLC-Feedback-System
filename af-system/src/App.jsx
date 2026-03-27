import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("user");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/index" element={<Homepage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
