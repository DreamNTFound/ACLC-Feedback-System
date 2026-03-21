export default function Navbar() {
  return (
    <>
      <nav>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Anonymous Feedback
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Speak freely. Improve together.
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">AF</span>
          </div>
        </div>
      </nav>
    </>
  );
}
