import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaBuilding,
  FaFileAlt,
  FaCalendarAlt,
  FaRegFileAlt,
  FaBars,
  FaUsersCog,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getME } from "../utils/authService";

const menu = [
  {
    name: "Dashboard",
    icon: <FaHome />,
    path: "/dashboard",
    roles: [
      "facultyadvisor",
      "studentcouncil",
      "clubmember",
      "studentwelfare",
      "securityhead",
      "admin",
      "ssp",
    ],
  },
  {
    name: "All Venues",
    icon: <FaBuilding />,
    path: "/venues",
    roles: [
      "facultyadvisor",
      "studentaouncil",
      "clubmember",
      "studentwelfare",
      "securityhead",
      "admin",
      "ssp",
    ],
  },
  {
    name: "Venue Booking",
    icon: <FaCalendarAlt />,
    path: "/venueBooking",
    roles: ["clubmember", "facultyadvisor", "studentcouncil", "admin", "ssp"],
  },
  {
    name: "Create Event",
    icon: <FaCalendarAlt />,
    path: "/create-event",
    roles: ["clubmember", "facultyadvisor", "studentcouncil", "admin", "ssp"],
  },
  {
    name: "Events",
    icon: <FaCalendarAlt />,
    path: "/events",
    roles: ["clubmember", "facultyadvisor", "studentcouncil", "admin", "ssp"],
  },
  {
    name: "Submit Report",
    icon: <FaRegFileAlt />,
    path: "/submitReport",
    roles: ["clubmember", "facultyadvisor", "studentcouncil", "admin", "ssp"],
  },
  {
    name: "All Clubs",
    icon: <FaRegFileAlt />,
    path: "/clubs",
    roles: ["facultyadvisor", "studentcouncil", "admin", "ssp"],
  },
  {
    name: "All Proposals",
    icon: <FaFileAlt />,
    path: "/proposals",
    roles: ["facultyadvisor", "studentcouncil", "admin", "ssp"],
  },
  {
    name: "Bookings for Approval",
    icon: <FaCalendarAlt />,
    path: "/bookings-for-approval",
    roles: ["facultyadvisor", "studentcouncil", "admin", "ssp"],
  },
  {
    name: "RBAC",
    icon: <FaUsersCog />,
    path: "/rbac",
    roles: ["admin", "ssp"],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await getME();
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="hidden lg:flex fixed flex-col h-screen w-[15vw] bg-white text-gray-700 justify-between shadow-md z-40">
        <div className="p-4 text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="hidden lg:flex fixed flex-col h-screen w-[15vw] bg-white text-gray-700 justify-between shadow-md z-40">
        <div className="p-4 text-center text-red-500">Failed to load user</div>
      </div>
    );
  }

  const filteredMenu = menu; // Role-based filtering can be applied later

  const navContent = (
    <nav className="mt-4">
      <ul className="flex flex-col gap-2">
        {filteredMenu.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-5 py-3 transition 
                ${
                  location.pathname === item.path
                    ? "bg-violet-100 text-violet-700 font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              onClick={() => setOpen(false)}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-base">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed flex-col h-screen w-[15vw] bg-[#f4f6f8] text-gray-700 justify-between z-40 p-5 pr-0">
        <div className="h-full w-full bg-white rounded-lg border border-gray-200">
          <div>
            <div className="flex items-center gap-3 px-6 py-5 my-5 border-b border-gray-200">
              <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-white text-lg">
                V
              </div>
              <span className="font-semibold text-lg">SW VISTA</span>
            </div>
            {navContent}
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center text-gray-400 text-xs gap-2">
              <span className="text-lg">@</span>
              <span>v1.00</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile/Tablet Topbar */}
      <div className="flex lg:hidden items-center justify-between bg-white text-gray-700 h-16 px-4 fixed top-0 left-0 right-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-white text-lg">
            E
          </div>
          <span className="font-semibold text-lg">SW VISTA</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-700"
          onClick={() => setOpen(true)}
        >
          <FaBars className="text-2xl" />
        </Button>
      </div>

      {/* Mobile/Tablet Sheet Menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="p-0 bg-white text-gray-700 w-[85vw] max-w-xs flex flex-col justify-between shadow-lg rounded-l-xl"
        >
          <div>
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center gap-3 px-6 py-5 my-5 border-b border-gray-200">
                  <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-white text-lg">
                    E
                  </div>
                  <span className="font-semibold text-lg text-gray-700">
                    SW VISTA
                  </span>
                </div>
              </SheetTitle>
            </SheetHeader>
            {navContent}
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center text-gray-400 text-xs gap-2">
              <span className="text-lg">@</span>
              <span>v1.00</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="lg:hidden h-16" />
    </>
  );
}
