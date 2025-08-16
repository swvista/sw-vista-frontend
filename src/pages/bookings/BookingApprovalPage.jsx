import React, { useState, useEffect } from "react";
import {
  MdCalendarMonth,
  MdCheck,
  MdClose,
  MdInfo,
  MdLocationPin,
  MdSchedule,
} from "react-icons/md";
import { toast } from "react-toastify";
import {
  getPendingBookings,
  approveBooking,
  rejectBooking,
} from "../../utils/authService";
import PageHeader from "../../Components/PageHeader";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Stepper component
function Stepper({ steps, progressStage }) {
  return (
    <div className="flex items-center justify-between w-full mt-2">
      {steps.map((step, idx) => {
        let status, color, borderColor, textColor, connectorColor;
        if (idx < progressStage) {
          status = "Approved";
          color = "bg-green-600";
          borderColor = "border-green-600";
          textColor = "text-green-600";
          connectorColor = "bg-green-600";
        } else if (idx === progressStage) {
          status = "In Progress";
          color = "bg-purple-500";
          borderColor = "border-purple-500";
          textColor = "text-purple-600";
          connectorColor = "bg-purple-500";
        } else {
          status = "Pending";
          color = "bg-gray-400";
          borderColor = "border-gray-400";
          textColor = "text-gray-600";
          connectorColor = "bg-gray-300";
        }

        return (
          <React.Fragment key={step}>
            {idx > 0 && (
              <div className={`w-[15%] h-0.5 rounded ${connectorColor}`} />
            )}
            <div className="flex flex-col items-center relative">
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${color} ${borderColor} text-white`}
                title={status}
              >
                <span className="font-semibold text-xs">{idx + 1}</span>
              </div>
              <span
                className={`text-sm font-medium text-center mt-1 ${textColor}`}
              >
                {step}
                <span className="block text-xs font-medium">{status}</span>
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Booking Review inside sheet
function BookingReview({ booking, onClose }) {
  const [comments, setComments] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleApprove = async () => {
    if (window.confirm("Are you sure you want to approve this booking?")) {
      try {
        await approveBooking(booking.id);
        toast.success("Booking approved successfully!");
        onClose();
      } catch (error) {
        console.error(
          "Failed to approve booking:",
          error.response?.data || error.message
        );
        toast.error(
          error.response?.data?.error || "Failed to approve booking."
        );
      }
    }
  };

  const handleReject = async () => {
    if (window.confirm("Are you sure you want to reject this booking?")) {
      try {
        await rejectBooking(booking.id, comments);
        toast.success("Booking rejected successfully!");
        onClose();
      } catch (error) {
        console.error(
          "Failed to reject booking:",
          error.response?.data || error.message
        );
        toast.error(error.response?.data?.error || "Failed to reject booking.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div>
        <h3 className="text-xl font-bold mb-1">
          {booking.proposal_details?.name ||
            booking.event_details?.title ||
            "General Booking"}
        </h3>
        <p className="text-sm text-gray-500">
          Requester: {booking.requester_details?.username}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <p className="font-normal text-gray-500">Status</p>
          <p>{booking.status_display}</p>
        </div>
        <div>
          <p className="font-normal text-gray-500">Current Stage</p>
          <p>{booking.approval_stage}</p>
        </div>
        <div>
          <p className="font-normal text-gray-500">Created At</p>
          <p>{new Date(booking.created_at).toLocaleString()}</p>
        </div>
        <div>
          <p className="font-normal text-gray-500">Last Updated</p>
          <p>{new Date(booking.updated_at).toLocaleString()}</p>
        </div>
      </div>

      {/* Slots */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">
          Booked Slots:
        </h4>
        {booking.slots?.length > 0 ? (
          <ul className="space-y-1">
            {booking.slots.map((slot) => (
              <li key={slot.id} className="text-sm text-gray-600 ml-2">
                {slot.venue?.name} on {new Date(slot.date).toLocaleDateString()}{" "}
                from {slot.start_time} to {slot.end_time}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 ml-2">
            No specific slots booked.
          </p>
        )}
      </div>

      {/* Approval History */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">
          Approval Progress:
        </h4>
        {booking.approvals?.length > 0 ? (
          <ul className="space-y-2">
            {booking.approvals.map((approval) => (
              <li
                key={approval.id}
                className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
              >
                <p>
                  <span className="text-gray-600">Stage {approval.stage}:</span>{" "}
                  {approval.approver_name} -{" "}
                  {approval.status_display || approval.status}
                </p>
                {approval.comments && (
                  <p className="text-xs text-gray-600 ml-2">
                    Comments: {approval.comments}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1 flex justify-start gap-1 items-center">
                  <MdCalendarMonth />
                  Approved on:
                  <span className="ml-2 flex justify-start items-center">
                    {new Date(approval.approval_date).toLocaleString()}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No approval history.</p>
        )}
      </div>

      {/* Actions */}
      {booking.status === 0 && (
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex justify-end gap-3">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleApprove}
            >
              <MdCheck className="mr-2" /> Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowComments(!showComments)}
            >
              <MdClose className="mr-2" /> Reject
            </Button>
          </div>
          {showComments && (
            <div className="flex flex-col gap-2">
              <Textarea
                placeholder="Add comments for rejection..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
              <Button variant="destructive" onClick={handleReject}>
                Confirm Reject
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Booking Card
function BookingCard({ booking }) {
  const [open, setOpen] = useState(false);
  const steps = [
    "Proposal Submitted",
    "Faculty Advisor",
    "Student Council",
    "Student Welfare",
    "Security",
  ];
  const progressStage = booking.approval_stage || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Top row */}
      <div className="flex flex-wrap gap-6 items-center justify-between mb-5 pb-5 border-b border-slate-200">
        <div>
          <span className="font-bold text-lg">
            {booking.proposal_details?.name ||
              booking.event_details?.title ||
              "General Booking"}
          </span>
          <p className="text-sm text-gray-500">
            Requester: {booking.requester_details?.username}
          </p>
        </div>
        <div className="flex gap-25 text-gray-600 text-sm">
          <span>
            <span className="font-medium flex justify-center items-center gap-1 text-[#242424] mb-1">
              <MdLocationPin />
              Venue:
            </span>{" "}
            {booking.slots?.[0]?.venue?.name || "N/A"}
          </span>
          <span>
            <span className="font-medium flex justify-center items-center gap-1 text-[#242424] mb-1">
              <MdSchedule />
              Starts:
            </span>{" "}
            {booking.slots?.[0]?.date
              ? new Date(booking.slots[0].date).toLocaleString()
              : "N/A"}
          </span>
          <span>
            <span className="font-medium flex justify-center items-center gap-1 text-[#242424] mb-1">
              <MdSchedule />
              Ends:
            </span>{" "}
            {booking.slots?.[0]?.end_time || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded text-sm font-semibold">
            {booking.status_display}
          </span>

          {/* Details Button */}
          <div className="flex gap-3 justify-end">
            <Button
              onClick={() => setOpen(true)}
              className="flex items-center border bg-purple-700 rounded-sm px-4 py-2 text-sm font-medium text-white hover:bg-purple-600 hover:text-white transition"
              variant="outline"
            >
              <MdInfo className="mr-2 text-base" /> Details
            </Button>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <Stepper steps={steps} progressStage={progressStage} />

      {/* Sheet for Booking Details */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Booking Details</SheetTitle>
            <SheetDescription>
              Review and take action on this booking.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4">
            <BookingReview booking={booking} onClose={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Page
export default function BookingApprovalPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getPendingBookings();
        setBookings(response.data || []);
      } catch (error) {
        console.error("Failed to fetch pending bookings:", error);
        toast.error("Failed to load pending bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <PageHeader user={"Username"} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings for Approval</h1>
      </div>
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">No pending bookings found.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
