
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sermons from "./pages/Sermons";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AppointmentBooking from "./pages/AppointmentBooking";
import Give from "./pages/Give";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

import ProtectedRoute from "./admin/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sermons" element={<Sermons />} />
      <Route path="/give" element={<Give />} />
      <Route path="/admin" element={<AdminLogin />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/book-appointment" element={<AppointmentBooking />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
