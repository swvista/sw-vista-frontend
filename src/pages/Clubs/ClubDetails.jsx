import React from "react";
import { useLocation, Link } from "react-router-dom";

// --- Reusable Child Component: MemberCard ---
// This component remains the same as it's a great way to keep the UI organized.
const MemberCard = ({ member }) => (
  <li className="py-3 sm:py-4">
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <img
          className="w-10 h-10 rounded-full"
          src={`https://i.pravatar.cc/150?u=${member.email}`}
          alt={`${member.name} avatar`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {member.name}
        </p>
        <p className="text-sm text-gray-500 truncate">{member.email}</p>
      </div>
    </div>
  </li>
);

// --- Main Component: ClubDetails (without mock data) ---
const ClubDetails = () => {
  const location = useLocation();

  // Safely destructure 'club' from location.state
  // The '|| {}' prevents an error if location.state is null or undefined
  const { club } = location.state || {};

  // Handle the case where the user navigates directly to this page
  // or if the club data wasn't passed correctly.
  if (!club) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Club Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          The data for this club was not available. Please navigate from the
          clubs list.
        </p>
        <Link
          to="/clubs" // Assuming your list page is at '/clubs'
          className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          Back to Clubs List
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="relative">
        <div className="w-full h-64 md:h-96 bg-gray-800">
          <img
            src={club.image || "https://via.placeholder.com/1200x400"}
            alt={`${club.name} banner`}
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 bg-gradient-to-t from-black to-transparent">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            {club.name}
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Description */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                About the Club
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {club.description}
              </p>
            </div>
          </div>

          {/* Right Column: Members */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                Members ({club.member_count})
              </h2>
              {club.members && club.members.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {club.members.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No members yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClubDetails;
