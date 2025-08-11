import React, { useState, useEffect } from "react";
import { FiCalendar, FiClock, FiInfo, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"; // Import Sheet components
import PageHeader from "../../Components/PageHeader";
import BookingForm from "./BookingForm"; // Import the new BookingForm component
import {
  createVenueBooking,
  getAllVenues,
  getUserProposals,
  getVenueBookings,
  deleteVenueBooking, // Added delete function
} from "../../utils/authService";
import { toast } from 'react-toastify';

export default function VenueBooking() {
  const [venues, setVenues] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null); // State for editing booking

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [venuesData, proposalsData, bookingsData] = await Promise.all([
        getAllVenues(),
        getUserProposals(),
        getVenueBookings(),
      ]);
      setVenues(venuesData.data || []); // Ensure it's an array
      setProposals(proposalsData.data || []); // Ensure it's an array
      setBookings(bookingsData.data || []); // Ensure it's an array
      console.log('Raw venues data:', venuesData.data); // Debug log
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load data. Please try again.");
    }
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    setEditingBooking(null); // Clear editing state
    fetchData();
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setShowBookingForm(true);
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking? (Only pending bookings can be deleted)")) {
      try {
        await deleteVenueBooking(bookingId);
        toast.success("Booking deleted successfully!");
        fetchData();
      } catch (error) {
        console.error("Failed to delete booking:", error.response?.data || error.message);
        toast.error(error.response?.data?.error || "Failed to delete booking. Only pending bookings can be deleted.");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: return "text-yellow-500"; // Pending
      case 1: return "text-green-500"; // Approved
      case 2: return "text-red-500";   // Rejected
      default: return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <PageHeader user={"Username"} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Venue Bookings</h1>
        <Button onClick={() => { setShowBookingForm(true); setEditingBooking(null); }} className="bg-blue-600 hover:bg-blue-700 text-white">
          <FiPlus className="inline-block mr-2" /> Create New Booking
        </Button>
      </div>

      <Sheet open={showBookingForm} onOpenChange={setShowBookingForm}>
        <SheetContent className=" px-5">
          <SheetHeader>
            <SheetTitle>{editingBooking ? 'Edit Booking' : 'Create New Booking'}</SheetTitle>
          </SheetHeader>
          <BookingForm 
            venues={venues} 
            proposals={proposals} 
            onBookingSuccess={handleBookingSuccess} 
            onCancel={() => { setShowBookingForm(false); setEditingBooking(null); }} 
            editingBooking={editingBooking} // Pass editing booking
          />
        </SheetContent>
      </Sheet>

      {/* Existing Bookings List */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Your Existing Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="shadow-sm border-gray-200">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {booking.proposal_details?.name || booking.event_details?.title || 'General Booking'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Requester: {booking.requester_details?.username}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Status: <span className={`font-medium ${getStatusColor(booking.status)}`}>{booking.status_display}</span>
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Booked Slots:</h4>
                    {booking.slots && booking.slots.length > 0 ? (
                      <ul className="space-y-2">
                        {booking.slots.map(slot => (
                          <li key={slot.id} className="p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center text-sm">
                              <FiCalendar className="mr-2 text-gray-500" />
                              <span className="font-medium text-gray-700">{slot.venue?.name}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600 mt-1 ml-5">
                              <span>{new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600 mt-1 ml-5">
                              <FiClock className="mr-2" />
                              <span>{slot.start_time} - {slot.end_time}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No specific slots booked.</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Created: {new Date(booking.created_at).toLocaleString()}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditBooking(booking)}
                      disabled={booking.status !== 0} // Only allow editing pending bookings
                    >
                      <FiEdit2 className="mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteBooking(booking.id)}
                      disabled={booking.status !== 0} // Only allow deleting pending bookings
                    >
                      <FiTrash2 className="mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
