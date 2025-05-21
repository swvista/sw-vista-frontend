import React, { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Eye } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Header } from "@radix-ui/themes/components/table";
import PageHeader from "../../Components/PageHeader";

// ---- MOCK DATA ----
const venues = [
  { id: "v1", name: "Main Auditorium", location: "Central Campus", capacity: 500 },
  { id: "v2", name: "Conference Hall", location: "Academic Block", capacity: 200 },
  { id: "v3", name: "Open-Air Theater", location: "South Campus", capacity: 1000 },
];

const venueBookingRequests = [
  {
    id: "b1",
    clubId: "c1",
    venueId: "v1",
    eventTitle: "Annual Fest",
    eventDescription: "A grand annual celebration with performances and awards.",
    status: "approved",
    startDate: "2025-06-10T16:00:00Z",
    endDate: "2025-06-10T20:00:00Z",
    submittedBy: "Alice",
    submittedAt: "2025-05-01T12:00:00Z",
  },
  {
    id: "b2",
    clubId: "c1",
    venueId: "v2",
    eventTitle: "Tech Symposium",
    eventDescription: "A gathering of tech enthusiasts and experts.",
    status: "pending",
    startDate: "2025-07-15T10:00:00Z",
    endDate: "2025-07-15T15:00:00Z",
    submittedBy: "Bob",
    submittedAt: "2025-06-05T09:30:00Z",
  },
  {
    id: "b3",
    clubId: "c2",
    venueId: "v3",
    eventTitle: "Cultural Night",
    eventDescription: "An evening of music, dance, and drama.",
    status: "rejected",
    startDate: "2025-08-20T18:00:00Z",
    endDate: "2025-08-20T22:00:00Z",
    submittedBy: "Charlie",
    submittedAt: "2025-07-10T14:15:00Z",
  },
];
// ---- END MOCK DATA ----

function StatusBadge({ status }) {
  let color =
    status === "approved"
      ? "bg-green-500"
      : status === "pending"
      ? "bg-yellow-500"
      : "bg-red-500";
  let textColor =
    status === "pending" ? "text-gray-900" : "text-white";
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${color} ${textColor}`}
      style={{ letterSpacing: "0.04em" }}
    >
      {status.toUpperCase()}
    </span>
  );
}

export default function VenueBookingHistory() {
  const clubId = "c1"; // Hardcoded for demo

  // Get all venue booking requests for this club
  const bookings = venueBookingRequests.filter(
    (booking) => booking.clubId === clubId
  );

  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const selectedBooking = selectedBookingId
    ? bookings.find((booking) => booking.id === selectedBookingId)
    : null;

  const handleViewDetails = (bookingId) => {
    setSelectedBookingId(bookingId);
  };

  const handleCloseSheet = () => {
    setSelectedBookingId(null);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "PPP p");
  };

  const getVenueById = (venueId) => venues.find((v) => v.id === venueId);

  return (
    <div className="space-y-8 p-10 mx-auto">
      {/* Header */}
      <PageHeader user={"Username"}/>
      <h2 className="text-2xl font-bold mb-2">Venue Booking History</h2>
      <div className="overflow-x-auto rounded-lg shadow border border-gray-400 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-gray-300">
              <TableHead>Event Name</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-left">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border-gray-300">
            {bookings.length > 0 ? (
              bookings.map((booking) => {
                const venue = getVenueById(booking.venueId);
                return (
                  <TableRow
                    key={booking.id}
                    className="hover:bg-gray-100 transition-colors border-gray-300"
                  >
                    <TableCell className="font-medium">
                      {booking.eventTitle}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {venue?.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {format(new Date(booking.startDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(booking.id)}
                        className="flex items-center gap-2 border-purple-700 bg-purple-600 text-white cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  <p className="text-muted-foreground">No venue bookings found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Sheet for detail view */}
      <Sheet open={!!selectedBooking} onOpenChange={handleCloseSheet}>
        <SheetContent
          side="right"
          className="max-w-md w-full px-8 py-8 bg-white border-none shadow-lg"
        >
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">
              {selectedBooking?.eventTitle || "Booking Details"}
            </SheetTitle>
          </SheetHeader>
          {selectedBooking && (
            <div className="space-y-8 mt-6">
              {/* Event Information */}
              <section>
                <h3 className="font-medium text-muted-foreground mb-2">
                  Event Information
                </h3>
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold">Title:</span>{" "}
                    {selectedBooking.eventTitle}
                  </div>
                  <div>
                    <span className="font-semibold">Description:</span>{" "}
                    {selectedBooking.eventDescription}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    <StatusBadge status={selectedBooking.status} />
                  </div>
                </div>
              </section>

              {/* Venue Information */}
              <section>
                <h3 className="font-medium text-muted-foreground mb-2">
                  Venue Information
                </h3>
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold">Venue:</span>{" "}
                    {getVenueById(selectedBooking.venueId)?.name}
                  </div>
                  <div>
                    <span className="font-semibold">Location:</span>{" "}
                    {getVenueById(selectedBooking.venueId)?.location}
                  </div>
                  <div>
                    <span className="font-semibold">Capacity:</span>{" "}
                    {getVenueById(selectedBooking.venueId)?.capacity} people
                  </div>
                </div>
              </section>

              {/* Booking Schedule */}
              <section>
                <h3 className="font-medium text-muted-foreground mb-2">
                  Booking Schedule
                </h3>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    From {formatDate(selectedBooking.startDate)} to{" "}
                    {formatDate(selectedBooking.endDate)}
                  </span>
                </div>
              </section>

              {/* Submission Details */}
              <section>
                <h3 className="font-medium text-muted-foreground mb-2">
                  Submission Details
                </h3>
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold">Submitted by:</span>{" "}
                    {selectedBooking.submittedBy}
                  </div>
                  <div>
                    <span className="font-semibold">Submitted on:</span>{" "}
                    {formatDate(selectedBooking.submittedAt)}
                  </div>
                </div>
              </section>
              <SheetClose asChild>
                <Button variant="outline" className="w-full mt-2">
                  Close
                </Button>
              </SheetClose>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
