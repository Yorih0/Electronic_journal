import { BrowserRouter, Routes, Route } from "react-router-dom";
// import AdminPage from "./pages/LoginAdmin";
import Schedule from "./pages/Schedule";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/login/admin" element={<AdminPage />} /> */}
        <Route path="/schedule" element={<Schedule />} />
        {/* <Route path="/journal" element={<GradeJournal />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;