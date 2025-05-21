import { FaHome, FaBuilding, FaFileAlt, FaCalendarAlt, FaRegFileAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { name: "Dashboard", icon: <FaHome />, path: "/councilDashboard" },
  { name: "Venues", icon: <FaBuilding />, path: "/venues" },
  { name: "Create Proposal", icon: <FaFileAlt />, path: "/createProposal" },
  { name: "Venue Booking", icon: <FaCalendarAlt />, path: "/venueBooking" },
  { name: "Submit Report", icon: <FaRegFileAlt />, path: "/submitReport" },
  { name: "All Clubs", icon: <FaRegFileAlt />, path: "/clubs" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="flex fixed flex-col h-screen w-[15vw] bg-[#2d1948] text-white justify-between">
      {/* Top section */}
      <div>
        {/* Logo and App Name */}
        <div className="flex items-center gap-3 px-6 py-5 my-5 border-b border-purple-900">
          <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
            E
          </div>
          <span className="font-semibold text-lg">SW VISTA</span>
          <span className="ml-auto text-xl text-gray-400 cursor-pointer">&lt;</span>
        </div>
        {/* Navigation */}
        <nav className="mt-2">
          <ul className="flex flex-col gap-1">
            {menu.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-5 py-3 rounded-lg transition 
                  ${
                    location.pathname === item.path
                      ? "bg-[#3c2766] text-white"
                      : "hover:bg-[#3c2766] text-gray-200"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-base">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* Bottom section */}
      <div className="px-6 py-4">
        <div className="flex items-center text-gray-400 text-xs gap-2">
          <span className="text-lg">@</span>
          <span>v1.00</span>
        </div>
      </div>
    </aside>
  );
}
