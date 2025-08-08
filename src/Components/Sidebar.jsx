import React, { useState, useEffect } from "react";
import { FaHome, FaBuilding, FaFileAlt, FaCalendarAlt, FaRegFileAlt, FaBars, FaUsersCog } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getME } from "../utils/authService"; // Correct import path

const menu = [
  { name: "Dashboard", icon: <FaHome />, path: "/councilDashboard", roles: ["facultyadvisor", "studentcouncil", "clubmember", "studentwelfare", "securityhead", "admin","ssp"] },
  { name: "Venues", icon: <FaBuilding />, path: "/venues", roles: ["facultyadvisor", "studentaouncil", "clubmember", "studentwelfare", "securityhead", "admin","ssp"] },
  { name: "Create Proposal", icon: <FaFileAlt />, path: "/createProposal", roles: ["clubmember", "facultyadvisor", "studentcouncil", "admin","ssp"] },
  { name: "Venue Booking", icon: <FaCalendarAlt />, path: "/venueBooking", roles: ["clubmember", "facultyadvisor", "studentcouncil", "admin","ssp"] },
  { name: "Submit Report", icon: <FaRegFileAlt />, path: "/submitReport", roles: ["clubmember", "facultyadvisor", "studentcouncil", "admin","ssp"] },
  { name: "All Clubs", icon: <FaRegFileAlt />, path: "/clubs", roles: ["facultyadvisor", "studentcouncil", "admin","ssp"] },
  { name: "RBAC", icon: <FaUsersCog />, path: "/rbac", roles: ["admin","ssp"] },
];

export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user on mount
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

  // Show loading state
  if (loading) {
    return (
      <div className="hidden lg:flex fixed flex-col h-screen w-[15vw] bg-[#2d1948] text-white justify-between z-40">
        <div className="p-4 text-center">Loading...</div>
      </div>
    );
  }

  // If user fetch failed
  if (!user) {
    return (
      <div className="hidden lg:flex fixed flex-col h-screen w-[15vw] bg-[#2d1948] text-white justify-between z-40">
        <div className="p-4 text-center text-red-300">Failed to load user</div>
      </div>
    );
  }

  // Filter menu items based on user role
  const filteredMenu = menu; // Temporarily disable role filtering

  const navContent = (
    <nav className="mt-2">
      <ul className="flex flex-col gap-1">
        {filteredMenu.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-5 py-3 rounded-lg transition 
                ${
                  location.pathname === item.path
                    ? "bg-[#3c2766] text-white"
                    : "hover:bg-[#3c2766] text-gray-200"
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
      <aside className="hidden lg:flex fixed flex-col h-screen w-[15vw] bg-[#2d1948] text-white justify-between z-40">
        <div>
          <div className="flex items-center gap-3 px-6 py-5 my-5 border-b border-purple-900">
            <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
              E
            </div>
            <span className="font-semibold text-lg">SW VISTA</span>
            <span className="ml-auto text-xl text-gray-400 cursor-pointer">&lt;</span>
          </div>
          {navContent}
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center text-gray-400 text-xs gap-2">
            <span className="text-lg">@</span>
            <span>v1.00</span>
          </div>
        </div>
      </aside>

      {/* Mobile/Tablet Topbar */}
      <div className="flex lg:hidden items-center justify-between bg-[#2d1948] text-white h-16 px-4 fixed top-0 left-0 right-0 z-50 shadow">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
            E
          </div>
          <span className="font-semibold text-lg">SW VISTA</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={() => setOpen(true)}
        >
          <FaBars className="text-2xl" />
        </Button>
      </div>

      {/* Mobile/Tablet Sheet Menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="p-0 bg-[#2d1948] text-white w-[85vw] max-w-xs flex flex-col justify-between">
          <div>
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center gap-3 px-6 py-5 my-5 border-b border-purple-900">
                  <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                    E
                  </div>
                  <span className="font-semibold text-lg text-white">SW VISTA</span>
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
