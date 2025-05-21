import React from "react";

/**
 * SummaryCard component
 * @param {string} label - The label to display (e.g. "Active Bookings")
 * @param {number|string} value - The value to display (e.g. 5)
 * @param {React.ReactNode} icon - The icon to display (e.g. <FaCalendarAlt />)
 */
export function SummaryCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col items-start gap-2">
      <div className="flex justify-between w-full items-center">
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-lg bg-gray-100 p-3 rounded-full">{icon}</div>
      </div>
      <div className="text-gray-500 font-medium">{label}</div>
    </div>
  );
}
