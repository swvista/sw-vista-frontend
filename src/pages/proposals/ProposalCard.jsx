import { FiInfo } from "react-icons/fi";
import { HiOutlinePencil } from "react-icons/hi";

export default function ProposalCard({
  eventName = "Sample Club Name",
  startDate = "03/02/2025",
  endDate = "04/02/2024",
  attendees = 150,
  endTime = "5:00 PM",
  description = "The MAHE Annual Marathon aims to promote fitness, endurance, and community participation. The event will include different run categories, hydration stations, and medical support.",
  createdAt = "02/10/2025",
  updatedAt = "02/10/2025",
  proposalStatus = "Approval Pending",
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 w-full mx-auto shadow-sm">
      {/* Top Row */}
      <div className="flex flex-wrap gap-y-4 justify-between items-start border-b border-gray-100 pb-4 mb-4">
        <div className="flex flex-col min-w-[140px]">
          <span className="text-xs text-gray-500 font-medium">Event Name</span>
          <span className="text-sm font-semibold text-gray-900">{eventName}</span>
        </div>
        <div className="flex flex-col min-w-[140px]">
          <span className="text-xs text-gray-500 font-medium">Event Start Date</span>
          <span className="text-sm font-semibold text-gray-900">{startDate}</span>
        </div>
        <div className="flex flex-col min-w-[140px]">
          <span className="text-xs text-gray-500 font-medium">Event End Date</span>
          <span className="text-sm font-semibold text-gray-900">{endDate}</span>
        </div>
        <div className="flex flex-col min-w-[120px]">
          <span className="text-xs text-gray-500 font-medium">No. of Attendees</span>
          <span className="text-sm font-semibold text-gray-900">{attendees}</span>
        </div>
        <div className="flex flex-col min-w-[100px]">
          <span className="text-xs text-gray-500 font-medium">Event End Time</span>
          <span className="text-sm font-semibold text-gray-900">{endTime}</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <span className="block text-xs font-medium text-gray-500 mb-1">Decription</span>
        <span className="text-sm text-gray-700">{description}</span>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-wrap items-center justify-between gap-y-3">
        <div className="flex gap-8">
          <div>
            <span className="block text-xs text-gray-500">Created At</span>
            <span className="text-sm text-gray-900">{createdAt}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500">Last Updated</span>
            <span className="text-sm text-gray-900">{updatedAt}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500">Proposal Status</span>
            <span className="text-sm font-semibold text-gray-900">{proposalStatus}</span>
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex items-center border border-gray-300 rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            <HiOutlinePencil className="mr-2 text-base" />
            Update
          </button>
          <button className="flex items-center border border-gray-300 rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            <FiInfo className="mr-2 text-base" />
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
