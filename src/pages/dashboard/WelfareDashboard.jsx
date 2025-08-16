import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaFileAlt, FaCheckCircle } from "react-icons/fa";
import { MdCheckCircle, MdHistory, MdCheck, MdClose } from "react-icons/md";
import PageHeader from "../../Components/PageHeader";
import {
  getVenueBookings,
  approveBooking,
  rejectBooking,
} from "../../utils/authService";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function FacultyDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const proposalSteps = [
    "Club",
    "Faculty Advisor",
    "Student Council",
    "Student Welfare",
    "Security",
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    try {
      const data = await getVenueBookings();
      setBookings(data);
    } catch (err) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  // Filter bookings where this faculty is an approver at stage 1
  const activeApprovals = bookings.filter(
    (booking) => (booking.status_display).toLowerCase() == filter.toLocaleLowerCase()
  );

  // Filter by status
  const filteredApprovals = activeApprovals.filter(b => 
    (b.status_display).toLowerCase() === filter.toLowerCase()
  );

  // Summary counts
  const pendingCount = activeApprovals.filter(
    b => b.status === 0 && b.approval_stage === 1
  ).length;
  const approvedCount = activeApprovals.filter(b => b.status === 1).length;
  const activeCount = activeApprovals.length;

  // Approve handler
  const handleApprove = async (bookingId) => {
    setActionLoadingId(bookingId);
    try {
      await approveBooking(bookingId);
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to approve booking.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Reject handler
  const handleReject = async (bookingId) => {
    const comments = prompt("Please provide a reason for rejection:");
    if (!comments) return;
    setActionLoadingId(bookingId);
    try {
      await rejectBooking(bookingId, comments);
      await fetchBookings();
    } catch (err) {
      alert("Failed to reject booking.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open sheet with booking details
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex p-10 max-sm:p-5">
      <div className="w-full">
        {/* <PageHeader user={"Faculty Advisor"} /> */}

        {/* Dashboard Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Student Welfare's Dashboard</h2>
          <p className="text-gray-500">Overview of approvals and club activities</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <SummaryCard
            label="Active Bookings"
            value={activeCount}
            icon={<FaCalendarAlt className="text-purple-500" />}
          />
          <SummaryCard
            label="Pending Requests"
            value={pendingCount}
            icon={<FaFileAlt className="text-yellow-500" />}
          />
          <SummaryCard
            label="Approved Requests"
            value={approvedCount}
            icon={<FaCheckCircle className="text-green-500" />}
          />
        </div>

        {/* Approval Section */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Venue Booking Approvals</h3>
            <div className="flex items-center">
              <label htmlFor="approval-filter" className="mr-2 font-medium">
                Filter:
              </label>
              <select
                id="approval-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded p-1"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-6 text-gray-400">Loading approvals...</div>
          ) : filteredApprovals.length === 0 ? (
            <div className="text-center py-6 text-gray-400">No {filter} approvals found</div>
          ) : (
            <div className="space-y-4">
              {filteredApprovals.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  steps={proposalSteps}
                  onView={() => handleViewDetails(booking)}
                  onApprove={() => handleApprove(booking.id)}
                  onReject={() => handleReject(booking.id)}
                  actionLoading={actionLoadingId === booking.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="max-w-lg w-full">
          <SheetHeader>
            <SheetTitle>Booking Details</SheetTitle>
          </SheetHeader>
          {selectedBooking && <BookingDetails booking={selectedBooking} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Booking Card Component
function BookingCard({ booking, steps, onView, onApprove, onReject, actionLoading }) {
  const startDate = new Date(booking.booking_date);
  const endDate = new Date(startDate.getTime() + booking.booking_duration * 60000);
  const isPending = booking.status_display === "Pending";
  console.log("Booking Card Rendered", booking);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-lg">{booking.proposal_details?.name || booking.event_type_display}</h4>
          <p className="text-gray-600">{booking.venue_details?.name}</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-gray-500">Participants: {booking.proposal_details?.attendees || 0}</span>
            <span className="mx-2">•</span>
            <span className="text-gray-500">
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </span>
          </div>
        </div>
        <button 
          onClick={onView}
          className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm hover:bg-purple-200"
        >
          View Details
        </button>
      </div>
      
      <div className="mt-4">
        <div className="mb-1">
          <span className="text-sm font-medium">Status: {booking.status_display}</span>
        </div>
        <Stepper steps={steps} progressStage={booking.status === 1 ? 5 : booking.approval_stage + 1} />
        
        {isPending && (
          <div className="flex gap-2 mt-4 justify-end">
            <button
              className="flex items-center border border-gray-300 rounded px-3 py-1 text-sm text-gray-700 hover:bg-red-50"
              onClick={onReject}
              disabled={actionLoading}
            >
              <MdClose className="mr-1" />
              {actionLoading ? "Processing..." : "Reject"}
            </button>
            <button
              className="flex items-center border border-purple-700 bg-purple-600 text-white rounded px-3 py-1 text-sm hover:bg-purple-700"
              onClick={onApprove}
              disabled={actionLoading}
            >
              <MdCheck className="mr-1" />
              {actionLoading ? "Processing..." : "Approve"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Booking Details Component
function BookingDetails({ booking }) {
  const startDate = new Date(booking.booking_date);
  const endDate = new Date(startDate.getTime() + booking.booking_duration * 60000);

  return (
    <div className="mt-4 space-y-4">
      <div>
        <h3 className="font-semibold text-lg">{booking.proposal_details?.name || booking.event_type_display}</h3>
        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
          <div><span className="font-medium">Venue:</span> {booking.venue_details?.name}</div>
          <div><span className="font-medium">Requester:</span> {booking.requester_details?.name}</div>
          <div><span className="font-medium">Status:</span> {booking.status_display}</div>
          <div><span className="font-medium">Stage:</span> {booking.approval_stage + 1}/5</div>
          <div><span className="font-medium">Start:</span> {startDate.toLocaleString()}</div>
          <div><span className="font-medium">End:</span> {endDate.toLocaleString()}</div>
        </div>
        
        {booking.proposal_details?.description && (
          <div className="mt-3">
            <p className="font-medium">Proposal Description:</p>
            <p className="text-gray-600">{booking.proposal_details.description}</p>
          </div>
        )}
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">Approval History</h4>
        {booking.approvals.length === 0 ? (
          <p className="text-gray-400">No approval records yet</p>
        ) : (
          <div className="space-y-2">
            {booking.approvals.map(approval => (
              <div key={approval.id} className="border rounded p-3">
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div><span className="font-medium">Stage:</span> {approval.stage + 1}</div>
                  <div><span className="font-medium">Approver:</span> {approval.approver_name}</div>
                  <div><span className="font-medium">Status:</span> 
                    <span className={`ml-1 ${
                      approval.status === 1 ? 'text-green-600' : 
                      approval.status === 2 ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {["Pending", "Approved", "Rejected"][approval.status]}
                    </span>
                  </div>
                  <div><span className="font-medium">Date:</span> {new Date(approval.approval_date).toLocaleString()}</div>
                </div>
                {approval.comments && (
                  <div className="mt-2">
                    <p className="font-medium">Comments:</p>
                    <p className="text-gray-600">{approval.comments}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Stepper Component
function Stepper({ steps, progressStage }) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, idx) => {
        const isComplete = idx < progressStage - 1;
        const isCurrent = idx === progressStage - 1;
        const status = isComplete ? "Approved" : isCurrent ? "In Progress" : "Pending";
        const bgColor = isComplete ? "bg-green-600" : isCurrent ? "bg-purple-500" : "bg-gray-400";
        const textColor = isComplete ? "text-green-600" : isCurrent ? "text-purple-600" : "text-gray-600";

        return (
          <React.Fragment key={step}>
            {idx > 0 && <div className={`flex-1 h-0.5 ${isComplete ? 'bg-green-600' : 'bg-gray-300'}`} />}
            
            <div className="flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full ${bgColor} flex items-center justify-center text-white`}>
                {isComplete ? <MdCheckCircle size={12} /> : <span className="text-xs">{idx + 1}</span>}
              </div>
              <span className={`text-xs mt-1 ${textColor}`}>{step}</span>
              <span className="text-[10px] mt-0.5 text-gray-500">{status}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Summary Card Component
function SummaryCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-lg border p-4 flex items-center gap-4">
      <div className="text-2xl bg-gray-100 p-3 rounded-full">{icon}</div>
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-gray-500 text-sm">{label}</div>
      </div>
    </div>
  );
}
