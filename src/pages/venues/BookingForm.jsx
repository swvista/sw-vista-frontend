import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiInfo, FiPlus, FiTrash2 } from 'react-icons/fi';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createVenueBooking, updateVenueBooking } from "../../utils/authService";
import { toast } from 'react-toastify';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import BookingSlotInput from './BookingSlotInput'; // Import the new component

const BookingForm = ({ venues, proposals, onBookingSuccess, onCancel, editingBooking }) => {
  const [eventType, setEventType] = useState("");
  const [proposal, setProposal] = useState("");
  const [slots, setSlots] = useState([{ venue: '', date: '', startTime: '', endTime: '' }]);
  const [loading, setLoading] = useState(false);

  // Populate form if editingBooking is provided
  useEffect(() => {
    if (editingBooking) {
      setEventType(editingBooking.proposal ? "event" : (editingBooking.event ? "event" : "practice")); // Simplified mapping
      setProposal(editingBooking.proposal?.id?.toString() || "");
      setSlots(editingBooking.slots.map(s => ({
        venue: String(s.venue.id),
        date: s.date,
        startTime: s.start_time,
        endTime: s.end_time,
      })));
    } else {
      // Reset form for new booking
      setEventType("");
      setProposal("");
      setSlots([{ venue: (Array.isArray(venues) && venues.length > 0 && String(venues[0].id)) || '', date: '', startTime: '', endTime: '' }]);
    }
  }, [editingBooking, venues]);

  const approvedProposals = proposals?.filter((p) => p.status === 1) || [];


  useEffect(() => {
    if (eventType !== "event") setProposal("");
  }, [eventType]);

  const handleSlotChange = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  const addSlot = () => {
    setSlots([...slots, { venue: (Array.isArray(venues) && venues.length > 0 && String(venues[0].id)) || '', date: '', startTime: '', endTime: '' }]);
  };

  const removeSlot = (index) => {
    const newSlots = slots.filter((_, i) => i !== index);
    setSlots(newSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        proposal: eventType === "event" ? parseInt(proposal) : null,
        event: null, // Assuming event is not directly linked for now
        slots: slots.map(slot => ({
          venue: parseInt(slot.venue),
          date: slot.date,
          start_time: slot.startTime,
          end_time: slot.endTime,
        })),
      };

      if (editingBooking) {
        await updateVenueBooking(editingBooking.id, bookingData);
        toast.success("Booking updated successfully!");
      } else {
        await createVenueBooking(bookingData);
        toast.success("Venue booked successfully!");
      }
      onBookingSuccess();
    } catch (error) {
      console.error("Booking failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.detail || "Failed to book venue. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (!eventType) return false;
    if (eventType === "event" && !proposal) return false;

    for (const slot of slots) {
      if (!slot.venue || !slot.date || !slot.startTime || !slot.endTime) return false;
      const start = new Date(`${slot.date}T${slot.startTime}`);
      const end = new Date(`${slot.date}T${slot.endTime}`);
      if (start >= end) return false;
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                  <SelectItem key={p.id} value={String(p.id)}>
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
      </div>

      {/* Dynamic Slots Section */}
      <h3 className="text-lg font-semibold mb-3">Time Slots</h3>
      {slots.map((slot, index) => (
        <BookingSlotInput
          key={index} // Use index as key for now, but ideally use a unique ID from slot if available
          slot={slot}
          index={index}
          venues={venues}
          handleSlotChange={handleSlotChange}
          removeSlot={removeSlot}
          slotsLength={slots.length}
        />
      ))}
      <Button type="button" variant="outline" onClick={addSlot} className="mb-6">
        <FiPlus className="inline-block mr-2" /> Add Another Slot
      </Button>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
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
  );
};

export default BookingForm;
