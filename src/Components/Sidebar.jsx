import React, { useState } from "react";
import { FaHome, FaBuilding, FaFileAlt, FaCalendarAlt, FaRegFileAlt, FaBars } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
  const [open, setOpen] = useState(false);

  // Shared navigation content
  const navContent = (
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
          {navContent}
        </div>
        {/* Bottom section */}
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
      {/* Spacer for mobile topbar */}
      <div className="lg:hidden h-16" />
    </>
  );
}
