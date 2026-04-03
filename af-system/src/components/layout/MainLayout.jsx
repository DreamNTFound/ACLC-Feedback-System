import { Outlet } from "react-router-dom";
import Navbar from "../layout/Navbar";

export default function MainLayout() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <header className="border-b border-slate-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-10">
          <Navbar />
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          <Outlet />
        </main>
      </div>
    </>
  );
}
