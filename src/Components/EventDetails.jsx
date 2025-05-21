import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Calendar, MapPin, Users, List, Layers } from "lucide-react";

export default function EventDetails({ open, onOpenChange, request }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="max-w-xl mx-auto rounded-l-2xl p-0 border-none">
        <div className="p-6">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold mb-1">
              Venue Booking Request
            </SheetTitle>
            <div className="text-gray-500 mb-4">
              Review the details of this venue booking request.
            </div>
          </SheetHeader>
          <div className="space-y-5">
            <div>
              <div className="text-xs text-gray-500">Event Name</div>
              <div className="flex items-center gap-2 font-meddium text-sm">
                <List className="w-4 h-4 text-purple-500" />
                {request.eventName}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Venue Name</div>
              <div className="flex items-center gap-2 font-medium text-sm">
                <MapPin className="w-4 h-4 text-blue-500" />
                {request.venueName}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <div className="text-xs text-gray-500">Booking Start</div>
                <div className="flex items-center gap-2 font-medium text-sm">
                  <Calendar className="w-4 h-4 text-green-600" />
                  {new Date(request.startDate).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Booking End</div>
                <div className="flex items-center gap-2 font-medium text-sm">
                  <Calendar className="w-4 h-4 text-red-600" />
                  {new Date(request.endDate).toLocaleString()}
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Event Type</div>
              <div className="flex items-center gap-2 font-medium text-sm">
                <Layers className="w-4 h-4 text-yellow-500" />
                {request.eventType}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Expected Audience</div>
              <div className="flex items-center gap-2 font-medium text-sm">
                <Users className="w-4 h-4 text-indigo-500" />
                {request.audienceCount}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Facilities Needed</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {request.facilities && request.facilities.length > 0 ? (
                  request.facilities.map((facility, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {facility}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">None specified</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
