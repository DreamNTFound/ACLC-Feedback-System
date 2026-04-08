import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import logo from "../../assets/aclc-logo.png";

export default function Navbar() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <>
      <nav>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={logo}
              alt="ACLC Logo"
              className="w-10 h-10 mr-2 object-cover rounded-full"
            />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Feedback System
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Speak freely. Improve together.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="text-xs text-slate-foreground hover:text-foreground border border-border rounded-lg px-4 py-2.5 hover:bg-slate-100 transition-colors"
            >
              Logout
            </button>
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">AFS</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
