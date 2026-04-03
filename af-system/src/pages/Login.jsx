import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [usn, setUsn] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user?.role === "admin") {
      navigate("/admin-dashboard");
    } else if (user?.role === "student") {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const user = await authService.login(usn, password, role);
      if (user.role === "admin") {
        authService.login(usn, password, role);
        navigate("/admin-dashboard");
      } else if (user.role === "student") {
        authService.login(usn, password, role);
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white text-xl font-bold mb-4">
              AF
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Anonymous Feedback
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Speak freely. Improve together.
            </p>
          </div>
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="flex border-b border-border">
              <button
                onClick={() => setRole("student")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors bg-primary/5 text-primary border-b-2 border-primary ${
                  role === "student"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-600"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-graduation-cap-icon lucide-graduation-cap w-4 h-4"
                >
                  <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                  <path d="M22 10v6" />
                  <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                </svg>
                <span>Student</span>
              </button>
              <button
                onClick={() => setRole("admin")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors bg-primary/5 text-primary border-b-2 border-primary ${
                  role === "admin"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-600"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                <span>Admin</span>
              </button>
            </div>
            {role === "student" && (
              <div className="p-6">
                <div className="space-y-5">
                  <div className="flex items-start gap-3 bg-slate-200 rounded-xl p-4 border border-slate-200/15">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-10 h-10 text-indigo-600 font-bold"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                      />
                    </svg>
                    <p className="text-sm text-slate-600">
                      Your Identity is{" "}
                      <span className="font-semibold">
                        never stored or shared.
                      </span>{" "}
                      Only your USN is used to let you in — feedback remains
                      fully anonymous.
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Universal Student Number (USN)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g 12345678"
                      value={usn}
                      onChange={(e) => setUsn(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-1.5">
                      Enter your USN to access the feedback board
                    </p>
                  </div>
                  <button
                    onClick={handleLogin}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors shadow h-9 px-4 py-2 w-full bg-indigo-600 hover:bg-indigo/90 text-white"
                  >
                    Continue as Student
                  </button>
                </div>
              </div>
            )}
            {role === "admin" && (
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="admin"
                      value={usn}
                      onChange={(e) => setUsn(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
                    />
                  </div>
                  <button
                    onClick={handleLogin}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors shadow h-9 px-4 py-2 w-full bg-indigo-600 hover:bg-indigo/90 text-white"
                  >
                    Sign in as Admin
                  </button>
                  <p className="text-xs text-center text-slate-600">
                    Demo credentials: admin / admin123
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
