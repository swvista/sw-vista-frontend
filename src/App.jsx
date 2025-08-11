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
import Clubs from "./pages/Clubs/Clubs";
import ClubDetails from "./pages/Clubs/ClubDetails";
import AddClub from "./pages/Clubs/AddClub";
import EditClub from "./pages/Clubs/EditClub";
import VenueBookingHistory from "./pages/venues/VenueBookingHistory";
import SecurityDashboard from "./pages/dashboard/SecurityDashboard";
import FacultyDashboard from "./pages/dashboard/FacultyDashboard";
import WelfareDashboard from "./pages/dashboard/WelfareDashboard";
import UserManagement from "./pages/UserManagement";
import CreateEvent from "./pages/events/CreateEvent";
import EventList from "./pages/events/EventList";
import EditEvent from "./pages/events/EditEvent";
import EventDetail from "./pages/events/EventDetail";
import ProposalApproval from "./pages/proposals/ProposalApproval";
import ProposalsForApproval from "./pages/proposals/ProposalsForApproval";
import ProposalList from "./pages/proposals/ProposalList";
import BookingApprovalPage from "./pages/bookings/BookingApprovalPage";
import BookingReviewPage from "./pages/bookings/BookingReviewPage";


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

            <Route path="/rbac" element={<UserManagement />} />

            <Route path="/venues" element={<VenuePage />} />
            <Route path="/venueBookingHistory" element={<VenueBookingHistory />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/clubs/add" element={<AddClub />} />
            <Route path="/clubs/edit/:id" element={<EditClub />} />
            <Route path="/clubs/:id" element={<ClubDetails />} />
            <Route path="/createProposal" element={<CreateProposal />} />
            <Route path="/venueBooking" element={<VenueBooking />} />
            <Route path="/submitReport" element={<SubmitReport />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/edit-event/:eventId" element={<EditEvent />} />
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="/proposals/:proposalId/approve" element={<ProposalApproval />} />
            <Route path="/proposals-for-approval" element={<ProposalsForApproval />} />
            <Route path="/proposals" element={<ProposalList />} />
            <Route path="/bookings-for-approval" element={<BookingApprovalPage />} />
            <Route path="/bookings/:bookingId/review" element={<BookingReviewPage />} />
            
          </Routes>
        </div>
      </Theme>
    </div>
  );
}

export default App;
