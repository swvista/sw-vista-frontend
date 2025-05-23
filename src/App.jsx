import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import ClubDasboard from "./pages/dashboard/ClubDasboard";
import { Theme } from "@radix-ui/themes";
import VenuePage from "./pages/venues/VenuePage";
import Sidebar from "./Components/Sidebar";
import CreateProposal from "./pages/proposals/CreateProposal";
import SubmitReport from "./pages/reports/SubmitReports";
import VenueBooking from "./pages/venues/VenueBooking";
import Login from "./pages/authentication/Login";
import CouncilDashboard from "./pages/dashboard/CouncilDashboard";
import ClubList from "./pages/ClubList";
import ClubDetails from "./pages/ClubDetails";
import EditClub from "./pages/EditClub";
import VenueBookingHistory from "./pages/venues/VenueBookingHistory";
import SecurityDashboard from "./pages/dashboard/SecurityDashboard";
import FacultyDashboard from "./pages/dashboard/FacultyDashboard";
import WelfareDashboard from "./pages/dashboard/WelfareDashboard";
import UserManagement from "./pages/UserManagement";

function App() {
  const location = useLocation();

  // Check if the current path is /login
  const isLoginPage = location.pathname === "/login";

  return (
    <div>
      <Theme>
        {!isLoginPage && <Sidebar />}
        <div className={isLoginPage ? "w-full ml-0" : "w-[85vw] ml-[15vw] max-sm:ml-0 max-sm:w-full max-lg:ml-0 max-lg:w-full"}>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* dashboard routes */}
            <Route path="/clubDashboard" element={<ClubDasboard />} />
            <Route path="/councilDashboard" element={<CouncilDashboard />} />
            <Route path="/securityDashboard" element={<SecurityDashboard />} />
            <Route path="/facultyDashboard" element={<FacultyDashboard />} />
            <Route path="/welfareDashboard" element={<WelfareDashboard />} />

            <Route path="/users" element={<UserManagement />} />

            <Route path="/venues" element={<VenuePage />} />
            <Route path="/venueBookingHistory" element={<VenueBookingHistory />} />
            <Route path="/editclub" element={<EditClub />} />

            <Route path="/clubDetails" element={<ClubDetails />} />
            <Route path="/clubs" element={<ClubList />} />
            <Route path="/createProposal" element={<CreateProposal />} />
            <Route path="/venueBooking" element={<VenueBooking />} />
            <Route path="/submitReport" element={<SubmitReport />} />
          </Routes>
        </div>
      </Theme>
    </div>
  );
}

export default App;
