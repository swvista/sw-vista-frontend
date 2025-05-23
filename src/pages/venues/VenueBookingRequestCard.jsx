import React, { useState } from "react";
import { MdCheck, MdClose, MdInfo } from "react-icons/md";
import EventDetails from "../../Components/EventDetails";

// Stepper component (dynamic progress logic)
function Stepper({ steps, progressStage }) {
  return (
    <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start w-full gap-2">
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
            {/* Connector before the step, except for the first */}
            {idx > 0 && (
              <div className={`w-4 sm:w-[15%] h-0.5 rounded ${connectorColor} max-sm:hidden`} />
            )}
            <div className="flex flex-col items-center relative max-sm:flex-row max-sm:mb-2 max-sm:w-full">
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${color} ${borderColor} text-white`}
                title={status}
              >
                <span className="font-semibold text-xs">{idx + 1}</span>
              </div>
              <span
                className={`text-xs sm:text-sm font-medium text-center mt-1 sm:mt-0 sm:ml-0 ${textColor} max-sm:ml-2`}
              >
                {step}
                <span className="block text-[10px] sm:text-xs font-medium">{status}</span>
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// The main card component
export default function VenueBookingRequestCard({
  eventName,
  venue,
  participants,
  startDate,
  endDate,
  status,
  progressStage,
  steps,
}) {
  // shadcn sheet to show the details.
  const [sheetOpen, setSheetOpen] = useState(false);

  const bookingRequest = {
    eventName: "Annual Tech Fest",
    venueName: "Main Auditorium",
    startDate: "2025-07-10T09:00",
    endDate: "2025-07-10T17:00",
    eventType: "Event",
    audienceCount: 500,
    facilities: ["Projector", "Sound System", "Stage Lighting"],
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 sm:p-6 w-full">
      {/* using shadcn sheet to show the details */}
      <EventDetails
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        request={bookingRequest}
      />
      {/* Top Row: Booking Details */}
      <div className="flex flex-wrap gap-4 max-sm:flex-col max-sm:items-start sm:gap-6 items-center justify-between mb-5 pb-5 border-b border-slate-200">
        <div className="min-w-[140px]">
          <span className="font-bold text-base sm:text-lg">{eventName}</span>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-1 text-gray-600 text-xs sm:text-sm flex-1">
          <span>
            <span className="font-semibold">Venue:</span> {venue}
          </span>
          <span>
            <span className="font-semibold">Participants:</span> {participants}
          </span>
          <span>
            <span className="font-semibold">Start:</span>{" "}
            {new Date(startDate).toLocaleString()}
          </span>
          <span>
            <span className="font-semibold">End:</span>{" "}
            {new Date(endDate).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs font-semibold">
            {status}
          </span>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="w-full overflow-x-auto">
        <Stepper steps={steps} progressStage={progressStage} />
      </div>
      {/* Actions */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mt-5 justify-end max-sm:justify-start">
        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center border border-gray-300 rounded px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-200 hover:border-gray-300 cursor-pointer transition"
        >
          <MdInfo className="mr-2 text-base" />
          Details
        </button>
        <button className="flex items-center border border-gray-300 rounded px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-red-400 hover:border-red-600 cursor-pointer transition">
          <MdClose className="mr-2 text-base" />
          Reject
        </button>
        <button className="flex items-center border border-purple-700 bg-purple-600 text-white rounded px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:bg-purple-700 cursor-pointer transition">
          <MdCheck className="mr-2 text-base" />
          Approve
        </button>
      </div>
    </div>
  );
}
