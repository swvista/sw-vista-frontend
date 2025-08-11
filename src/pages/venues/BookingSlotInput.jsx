import React from "react";
import { FiCalendar, FiTrash2 } from "react-icons/fi";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

/**
 * slot shape example:
 * {
 *   venue: "1",
 *   date: "2025-08-10", // ISO (yyyy-MM-dd) or ""
 *   startTime: "09:00",
 *   endTime: "10:00"
 * }
 */
const BookingSlotInput = ({
  slot,
  index,
  venues,
  handleSlotChange,
  removeSlot,
  slotsLength,
}) => {
  // Convert stored string -> Date (for Calendar)
  const selectedDate = slot?.date ? new Date(slot.date) : undefined;

  const onDateSelect = (date) => {
    // Save in ISO yyyy-MM-dd for backend-friendliness
    handleSlotChange(index, "date", date ? format(date, "yyyy-MM-dd") : "");
  };

  return (
    <Card className="mb-4 border-gray-200 shadow-sm">
      <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Venue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Venue
          </label>
          <Select
            value={slot.venue ?? ""}
            onValueChange={(value) => handleSlotChange(index, "venue", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a venue" />
            </SelectTrigger>
            <SelectContent>
              {venues?.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.name} — Capacity: {v.capacity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button" /* important: avoid form submit */
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !selectedDate ? "text-muted-foreground" : ""
                }`}
              >
                <FiCalendar className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 z-50"
              align="start"
              sideOffset={8}
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <Input
            type="time"
            value={slot.startTime ?? ""}
            onChange={(e) => handleSlotChange(index, "startTime", e.target.value)}
            required
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <Input
            type="time"
            value={slot.endTime ?? ""}
            onChange={(e) => handleSlotChange(index, "endTime", e.target.value)}
            required
          />
        </div>
      </CardContent>

      {slotsLength > 1 && (
        <div className="px-4 pb-4">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => removeSlot(index)}
          >
            <FiTrash2 className="mr-1" /> Remove Slot
          </Button>
        </div>
      )}
    </Card>
  );
};

export default BookingSlotInput;
