import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "../../Components/DateTimePicker";
import PageHeader from "../../Components/PageHeader";

const approvedProposals = [
  { id: "prop1", title: "Annual Fest 2025" },
  { id: "prop2", title: "Tech Symposium" },
  { id: "prop3", title: "Art Expo" },
];

export default function VenueBooking() {
  // State for controlled components
  const [venue, setVenue] = useState("");
  const [club, setClub] = useState("Cultural Club");
  const [eventType, setEventType] = useState("");
  const [proposal, setProposal] = useState(""); // For proposals dropdown
  const [eventTitle, setEventTitle] = useState("");
  const [attendees, setAttendees] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [specialReq, setSpecialReq] = useState("");
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);

  // Reset proposal if eventType changes away from 'event'
  React.useEffect(() => {
    if (eventType !== "event") setProposal("");
  }, [eventType]);

  return (
    <div className="min-h-screen bg-[#fcfbff] p-10 max-sm:p-5">
      <PageHeader user={"Username"}/>

      <div className="mx-auto bg-white rounded-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-1">Venue Booking Request</h2>
        <p className="text-gray-500 mb-8">
          Submit a request to book a venue for your event
        </p>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Venue */}
            <div>
              <label className="block font-medium mb-1">Venue</label>
              <Select value={venue} onValueChange={setVenue}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a venue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Auditorium">Main Auditorium</SelectItem>
                  <SelectItem value="Conference Hall">Conference Hall</SelectItem>
                  <SelectItem value="Open-Air Theater">Open-Air Theater</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">
                Select the venue you want to book
              </p>
            </div>
            {/* Club */}
            <div>
              <label className="block font-medium mb-1">Club</label>
              <Select value={club} onValueChange={setClub}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select club" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cultural Club">Cultural Club</SelectItem>
                  <SelectItem value="Sports Club">Sports Club</SelectItem>
                  <SelectItem value="Technical Club">Technical Club</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">
                Select the club organizing the event
              </p>
            </div>
            {/* Event Type */}
            <div>
              <label className="block font-medium mb-1">Event Type</label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="practice session">Practice Session</SelectItem>
                  <SelectItem value="general body meet">General Body Meet</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">
                Select the type of event you're planning
              </p>
            </div>
            {/* Proposals Dropdown (only if eventType is 'event') */}
            {eventType === "event" && (
              <div>
                <label className="block font-medium mb-1">Proposals</label>
                <Select value={proposal} onValueChange={setProposal}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select approved proposal" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedProposals.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400 mt-1">
                  Select an approved proposal for this event
                </p>
              </div>
            )}
            {/* Event Title */}
            <div>
              <label className="block font-medium mb-1">Event Title</label>
              <Input
                type="text"
                placeholder="Enter event title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">
                Provide a clear title for your event
              </p>
            </div>
            {/* Expected Attendees */}
            <div>
              <label className="block font-medium mb-1">
                Expected Attendees
              </label>
              <Input
                type="number"
                placeholder="Enter number of attendees"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">
                Estimated number of participants
              </p>
            </div>
            {/* Start Date & Time */}
            <div>
              <label className="block font-medium mb-1">
                Start Date & Time
              </label>
              <DateTimePicker value={startDateTime} onChange={setStartDateTime} />
              <p className="text-xs text-gray-400 mt-1">
                When does your event start?
              </p>
            </div>
            {/* End Date & Time */}
            <div>
              <label className="block font-medium mb-1">End Date & Time</label>
              <DateTimePicker value={endDateTime} onChange={setEndDateTime} />
              <p className="text-xs text-gray-400 mt-1">
                When does your event end?
              </p>
            </div>
          </div>
          {/* Event Description */}
          <div className="mb-6">
            <label className="block font-medium mb-1">Event Description</label>
            <Textarea
              rows={4}
              placeholder="Provide details about your event..."
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              Describe the purpose and activities of your event
            </p>
          </div>
          {/* Special Requirements */}
          <div className="mb-8">
            <label className="block font-medium mb-1">
              Special Requirements
            </label>
            <Textarea
              rows={2}
              placeholder="Any special requirements for the venue..."
              value={specialReq}
              onChange={(e) => setSpecialReq(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              List any special arrangements, equipment, or setup requirements
            </p>
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
