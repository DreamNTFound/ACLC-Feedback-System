import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";
import { authService } from "./services/authService";

function ProtectedRoute({ children, allowedRoles }) {
  const user = authService.getCurrentUser();

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RedirectBasedOnRole() {
  const user = authService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }
  if (user?.role === "student") {
    return <Navigate to="/home" replace />;
  }

  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["admin", "student"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RedirectBasedOnRole />} />

          <Route
            path="home"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
