import React from "react";

function PageHeader({user}) {
  return (
    <div className="flex justify-between items-center mb-5 pb-5 border-b border-gray-200">
      <h1 className="text-lg font-semibold">Welcome, {user}</h1>
      <div className="flex items-center gap-4">
        <span className="bg-white border rounded px-3 py-1 text-sm font-medium">
          Role: club
        </span>
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="profile"
          className="w-9 h-9 rounded-full border"
        />
      </div>
    </div>
  );
}

export default PageHeader;
