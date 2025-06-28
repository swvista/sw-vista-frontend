import React, { useState, useEffect } from "react";
import { FiCalendar, FiClock, FiInfo } from "react-icons/fi";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageHeader from "../../Components/PageHeader";
import {
  createVenueBooking,
  getAllVenues,
  getUserProposals,
} from "../../utils/authService";

export default function VenueBooking() {
  const [venue, setVenue] = useState("");
  const [eventType, setEventType] = useState("");
  const [proposal, setProposal] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [loading, setLoading] = useState(false);

  // Data from API
  const [venues, setVenues] = useState([]);
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [venuesData, proposalsData] = await Promise.all([
          getAllVenues(),
          getUserProposals(),
        ]);
        setVenues(venuesData);
        setProposals(proposalsData);
        if (venuesData.length > 0) setVenue(venuesData[0].id.toString());
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert("Failed to load data. Please try again.");
      }
    };
    fetchData();
  }, []);

  // Only approved proposals (status=1)
  const approvedProposals = proposals.filter((p) => p.status === 1);

  // Reset proposal if eventType changes away from 'event'
  useEffect(() => {
    if (eventType !== "event") setProposal("");
  }, [eventType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Calculate duration in minutes
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      const durationInMinutes = Math.round((end - start) / (1000 * 60));

      // Prepare payload according to VenueBooking model
      const bookingData = {
        venue: parseInt(venue),
        event_type: 
          eventType === "practice" ? 0 : 
          eventType === "meeting" ? 1 : 2,
        proposal: eventType === "event" ? parseInt(proposal) : null,
        booking_date: start.toISOString(),
        booking_duration: durationInMinutes,
      };

      await createVenueBooking(bookingData);

      // Reset form
      setEventType("");
      setProposal("");
      setStartDateTime("");
      setEndDateTime("");

      alert("Venue booked successfully!");
    } catch (error) {
      console.error("Booking failed:", error.response?.data || error.message);
      alert("Failed to book venue. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    const start = startDateTime && new Date(startDateTime);
    const end = endDateTime && new Date(endDateTime);
    return (
      venue &&
      eventType &&
      startDateTime &&
      endDateTime &&
      start &&
      end &&
      start < end &&
      (eventType !== "event" || proposal)
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfbff] p-10 max-sm:p-5">
      <PageHeader user={"Username"} />

      <div className="mx-auto bg-white rounded-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-1">Venue Booking Request</h2>
        <p className="text-gray-500 mb-8">
          Submit a request to book a venue for your event
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Venue Selection */}
            <div>
              <label className="block font-medium mb-1 flex items-center gap-2">
                <FiCalendar className="text-purple-500" /> Venue
              </label>
              <Select value={venue} onValueChange={setVenue}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a venue" />
                </SelectTrigger>
                <SelectContent>
                  {venues.map((v) => (
                    <SelectItem key={v.id} value={v.id.toString()}>
                      {v.name} - Capacity: {v.capacity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">
                Select the venue you want to book
              </p>
            </div>

            {/* Event Type */}
            <div>
              <label className="block font-medium mb-1 flex items-center gap-2">
                <FiInfo className="text-purple-500" /> Event Type
              </label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="practice">Practice Session</SelectItem>
                  <SelectItem value="meeting">General Body Meeting</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">
                Type of event you're planning
              </p>
            </div>

            {/* Proposals (only for event type) */}
            {eventType === "event" && (
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Attach Proposal</label>
                <Select value={proposal} onValueChange={setProposal}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select approved proposal" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedProposals.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name} - {new Date(p.requested_date).toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400 mt-1">
                  Select an approved proposal for this event
                </p>
              </div>
            )}

            {/* Start Date & Time */}
            <div>
              <label className="block font-medium mb-1 flex items-center gap-2">
                <FiClock className="text-purple-500" /> Start Date & Time
              </label>
              <Input
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                When does your booking start?
              </p>
            </div>

            {/* End Date & Time */}
            <div>
              <label className="block font-medium mb-1 flex items-center gap-2">
                <FiClock className="text-purple-500" /> End Date & Time
              </label>
              <Input
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                When does your booking end?
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEventType("");
                setProposal("");
                setStartDateTime("");
                setEndDateTime("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white"
              disabled={!isFormValid() || loading}
            >
              {loading ? "Processing..." : "Submit Booking"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
