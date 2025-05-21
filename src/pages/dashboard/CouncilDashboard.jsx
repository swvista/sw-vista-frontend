import {
  FaCalendarAlt,
  FaFileAlt,
  FaCheckCircle,
  FaUser,
} from "react-icons/fa";
import Sidebar from "../../Components/Sidebar";
import React from "react";
import { MdCheckCircle, MdHistory } from "react-icons/md";
import ProposalCard from "../proposals/ProposalCard";
import VenueBookingRequestCard from "../venues/VenueBookingRequestCard";
import EventDetails from "../../Components/EventDetails";
import PageHeader from "../../Components/PageHeader";
import { useNavigate } from "react-router-dom";

export default function CouncilDashboard() {
  // Example proposals array (you can map over this for multiple proposals)
  const proposals = [
    {
      eventName: "Cultural Exchange Program",
      venue: "Main Auditorium",
      participants: 300,
      startDate: "2025-05-15T10:00",
      endDate: "2025-05-15T17:00",
      progressStage: 2, // 1-5
      submittedBy: "John Doe",
      status: "Pending",
    },
    {
      eventName: "Cultural Exchange Program",
      venue: "Main Auditorium",
      participants: 300,
      startDate: "2025-05-15T10:00",
      endDate: "2025-05-15T17:00",
      progressStage: 1, // 1-5
      submittedBy: "John Doe",
      status: "Pending",
    },
    // Add more proposals here if needed
  ];

  const proposalSteps = [
    "Club",
    "Faculty Advisor",
    "Student Council",
    "Student Welfare",
    "Security",
  ];

  return (
    <div className="min-h-screen bg-[#faf8ff] flex p-10">
      <EventDetails
        request={{
          eventName: "Annual Tech Fest",
          venueName: "Main Auditorium",
          startDate: "2025-07-10T09:00",
          endDate: "2025-07-10T17:00",
          eventType: "Event",
          audienceCount: 500,
          facilities: ["Projector", "Sound System", "Stage Lighting"],
        }}
      />

      <div className="w-full">
        {/* Top Bar */}
        <PageHeader user={"Username"} />

        {/* Dashboard Title and Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              Student Council&apos;s Dashboard
            </h2>
            <p className="text-gray-500 capitalize">
              Overview of club activities
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <SummaryCard
            label="Active Bookings"
            value={0}
            icon={<FaCalendarAlt className="text-purple-500" />}
          />
          <SummaryCard
            label="Pending Requests"
            value={2}
            icon={<FaFileAlt className="text-yellow-500" />}
          />
          <SummaryCard
            label="Approved Requests"
            value={0}
            icon={<FaCheckCircle className="text-green-500" />}
          />
          <SummaryCard
            label="Total Clubs"
            value={3}
            icon={<FaUser className="text-blue-500" />}
          />
          <SummaryCard
            label="Total Events"
            value={3}
            icon={<FaUser className="text-blue-500" />}
          />
        </div>

        {/* Active Proposals Card List */}
        <SectionCard title="Active Venue Booking Requests">
          <div className="flex flex-col gap-6">
            {proposals.map((proposal, idx) => (
              <VenueBookingRequestCard
                key={idx}
                eventName={proposal.eventName}
                venue={proposal.venue}
                participants={proposal.participants}
                startDate={proposal.startDate}
                endDate={proposal.endDate}
                status={proposal.status}
                progressStage={proposal.progressStage}
                steps={proposalSteps}
                onView={() => {
                  /* handle view action */
                }}
              />
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// Summary Card Component
function SummaryCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200  p-5 flex flex-col items-start gap-2">
      <div className="flex justify-between w-full items-center">
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-lg bg-gray-100 p-3 rounded-full">{icon}</div>
      </div>
      <div className="text-gray-500 font-medium">{label}</div>
    </div>
  );
}

// Section Card Wrapper
function SectionCard({ title, children }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <span
          className="text-xl bg-none p-2 cursor-pointer rounded text-purple-700 flex items-center"
          onClick={() => {
            navigate("/venueBookingHistory");
          }}
        >
          <MdHistory />
          <p className="text-sm font-semibold pl-2">History</p>
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
}

// Stepper Component for Proposal Status (Dynamic Progress)
function Stepper({ steps, progressStage }) {
  // progressStage: 1-5 (1 means first step in progress, 5 means last step in progress)
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, idx) => {
        let status, color, borderColor, textColor, connectorColor;

        // Color and status logic (keep your existing logic)
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
            {/* Add connector BEFORE the step, except for first step */}
            {idx > 0 && (
              <div className={`w-[15%] h-0.5 rounded ${connectorColor}`} />
            )}

            <div className="flex flex-col items-center relative">
              {/* Step circle */}
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${color} ${borderColor} text-white`}
                title={status}
              >
                <span className="font-semibold text-xs">{idx + 1}</span>
              </div>

              {/* Label and status */}
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
