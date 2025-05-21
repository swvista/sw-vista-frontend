"use client";

import * as React from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MdCalendarMonth } from "react-icons/md";

/**
 * DateTimePicker component
 * @param {Date|null} value - The current value (date & time)
 * @param {(date: Date) => void} onChange - Called with new date/time when user selects
 * @param {string} placeholder - Placeholder text
 */
export function DateTimePicker({ value, onChange, placeholder = "MM/DD/YYYY hh:mm aa" }) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Always work with a Date object or undefined
  const date = value || undefined;

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      // If time is not set, preserve previous time or set to 12:00 AM
      let newDate = new Date(selectedDate);
      if (date) {
        newDate.setHours(date.getHours());
        newDate.setMinutes(date.getMinutes());
      }
      onChange(newDate);
    }
  };

  const handleTimeChange = (type, val) => {
    if (date) {
      const newDate = new Date(date);
      if (type === "hour") {
        let hour = parseInt(val, 10);
        if (newDate.getHours() >= 12) hour = hour % 12 + 12;
        else hour = hour % 12;
        newDate.setHours(hour);
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(val, 10));
      } else if (type === "ampm") {
        let hour = newDate.getHours();
        if (val === "PM" && hour < 12) hour += 12;
        if (val === "AM" && hour >= 12) hour -= 12;
        newDate.setHours(hour);
      }
      onChange(newDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal border-gray-300",
            !date && "text-muted-foreground"
          )}
        >
          <MdCalendarMonth className="mr-2 h-4 w-4" />
          {date ? format(date, "MM/dd/yyyy hh:mm aa") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.slice().reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      date && ((date.getHours() % 12) || 12) === hour
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      date && date.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("minute", minute.toString())}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea>
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      date &&
                      ((ampm === "AM" && date.getHours() < 12) ||
                        (ampm === "PM" && date.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
