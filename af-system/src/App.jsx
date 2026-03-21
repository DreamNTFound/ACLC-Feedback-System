import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Homepage from "./pages/Homepage";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Homepage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
