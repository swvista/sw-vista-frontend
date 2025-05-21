import { useState } from "react";
import { FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { MdAdd, MdHistory } from "react-icons/md";
import Sidebar from "../../Components/Sidebar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import PageHeader from "../../Components/PageHeader";

const venues = [
  {
    name: "Main Auditorium",
    location: "Central Campus",
    capacity: 500,
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    status: "Available",
    features: ["Stage", "Sound System", "Projector", "+1 more"],
  },
  {
    name: "Conference Hall",
    location: "Academic Block",
    capacity: 200,
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    status: "Booked",
    features: ["Projector", "Air Conditioning", "Video Conferencing"],
  },
  {
    name: "Open-Air Theater",
    location: "South Campus",
    capacity: 1000,
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80",
    status: "Available",
    features: ["Stage", "Sound System", "Lighting"],
  },
  {
    name: "Seminar Hall",
    location: "Science Block",
    capacity: 120,
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    status: "Maintenance",
    features: ["Projector", "Air Conditioning"],
  },
  {
    name: "Sports Complex",
    location: "West Campus",
    capacity: 800,
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    status: "Available",
    features: ["Stage", "Sound System"],
  },
];

const statusColors = {
  Available: "bg-green-100 text-green-800",
  Booked: "bg-purple-100 text-purple-800",
  Maintenance: "bg-yellow-100 text-yellow-800",
};

export default function VenuePage() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  // Edit Sheet state
  const [openEdit, setOpenEdit] = useState(false);
  const [editVenue, setEditVenue] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    location: "",
    capacity: "",
    image: "",
    status: "",
    features: [],
  });

  // Open view details
  const handleViewDetails = (venue) => {
    setSelectedVenue(venue);
    setOpenDetails(true);
  };

  // Open edit sheet and prefill form
  const handleEditVenue = (venue) => {
    setEditVenue(venue);
    setEditForm({
      name: venue.name,
      location: venue.location,
      capacity: venue.capacity,
      image: venue.image,
      status: venue.status,
      features: venue.features,
    });
    setOpenEdit(true);
  };

  // Handle edit form changes
  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle features checkbox
  const handleFeatureToggle = (feature) => {
    setEditForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  return (
    <div className="flex">
      {/* Sidebar (if you want to include it) */}
      {/* <Sidebar /> */}

      <div className="min-h-screen bg-gray-50 p-10 w-full">
        {/* Header */}
        <PageHeader user="Username" />

        {/* Venues Title and Filters */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Venues</h2>
          <p className="text-gray-500">
            Browse and book venues for your events
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="🔍 Search venues by name or location..."
              className="w-full border-gray-300 bg-white"
            />
          </div>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[140px] border-gray-300 bg-white">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[140px] border-gray-300 bg-white">
                <SelectValue placeholder="Capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Capacity">Capacity</SelectItem>
                <SelectItem value="100+">100+</SelectItem>
                <SelectItem value="200+">200+</SelectItem>
                <SelectItem value="500+">500+</SelectItem>
                <SelectItem value="1000+">1000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Venue Button with Sheet */}
          <Sheet open={openAdd} onOpenChange={setOpenAdd}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="text-white px-2 py-2 cursor-pointer bg-purple-600 h-full hover:bg-purple-700 hover:text-white"
              >
                <MdAdd className="w-4 h-4 mr-1" />
                Add Venue
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-md px-5 border-none"
            >
              <SheetHeader>
                <SheetTitle>Add New Venue</SheetTitle>
                <SheetDescription>
                  Fill in the details to add a new venue.
                </SheetDescription>
              </SheetHeader>
              <form className="mt-6 flex flex-col gap-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Venue Image
                  </label>
                  <Input type="file" accept="image/*" className="w-full" />
                </div>
                {/* Venue Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Venue Name
                  </label>
                  <Input placeholder="Venue Name" className="w-full" />
                </div>
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <Input placeholder="Location" className="w-full" />
                </div>
                {/* Capacity */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Capacity
                  </label>
                  <Input
                    placeholder="Capacity"
                    type="number"
                    className="w-full"
                    min={1}
                  />
                </div>
                {/* Facilities */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Facilities
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="projector"
                        className="shadcn-checkbox"
                      />
                      <label htmlFor="projector" className="text-sm">
                        Projector
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="cctv"
                        className="shadcn-checkbox"
                      />
                      <label htmlFor="cctv" className="text-sm">
                        CCTV
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="mic"
                        className="shadcn-checkbox"
                      />
                      <label htmlFor="mic" className="text-sm">
                        Mic
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="speaker"
                        className="shadcn-checkbox"
                      />
                      <label htmlFor="speaker" className="text-sm">
                        Speaker
                      </label>
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button type="submit" className="bg-purple-600 text-white">
                    Save
                  </Button>
                  <SheetClose asChild>
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </SheetClose>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {venues.map((venue, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
            >
              {/* Venue Image and Status */}
              <div className="relative h-48 w-full">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="object-cover h-full w-full"
                />
                <span
                  className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${
                    statusColors[venue.status]
                  }`}
                >
                  {venue.status}
                </span>
              </div>
              {/* Venue Info */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg">{venue.name}</h3>
                <div className="flex items-center text-gray-500 font-medium text-sm mt-1 gap-2">
                  <FaMapMarkerAlt className="inline mr-1" />
                  {venue.location}
                </div>
                <div className="flex items-center text-gray-700 font-medium text-sm gap-2 mt-1">
                  <FaUsers className="inline mr-1" />
                  Capacity: {venue.capacity}
                </div>
                {/* Features */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {venue.features.map((feature, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-700 font-medium text-xs px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-200 rounded-sm"
                    onClick={() => handleViewDetails(venue)}
                  >
                    View Details
                  </Button>
                  <Button
                    className={`flex-1 rounded-sm ${
                      venue.status === "Available"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-gray-300 text-white cursor-not-allowed"
                    }`}
                    disabled={venue.status !== "Available"}
                  >
                    Book Now
                  </Button>
                  {/* Edit Button */}
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-200 rounded-sm"
                    onClick={() => handleEditVenue(venue)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Venue Details Sheet */}
        <Sheet open={openDetails} onOpenChange={setOpenDetails}>
          <SheetContent
            side="right"
            className="w-full max-w-md px-5 border-none"
          >
            <SheetHeader>
              <SheetTitle>
                {selectedVenue ? selectedVenue.name : "Venue Details"}
              </SheetTitle>
              <SheetDescription>
                {selectedVenue ? (
                  <>
                    <div className="mt-4">
                      <img
                        src={selectedVenue.image}
                        alt={selectedVenue.name}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                      <div className="mb-2">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            statusColors[selectedVenue.status]
                          }`}
                        >
                          {selectedVenue.status}
                        </span>
                      </div>
                      <div className="mb-2 text-gray-700">
                        <FaMapMarkerAlt className="inline mr-2" />
                        <span className="font-medium">Location:</span>{" "}
                        {selectedVenue.location}
                      </div>
                      <div className="mb-2 text-gray-700">
                        <FaUsers className="inline mr-2" />
                        <span className="font-medium">Capacity:</span>{" "}
                        {selectedVenue.capacity}
                      </div>
                      <div className="mb-2">
                        <span className="font-medium text-gray-700">
                          Features:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedVenue.features.map((feature, i) => (
                            <span
                              key={i}
                              className="bg-gray-100 text-gray-700 font-medium text-xs px-2 py-1 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  "No venue selected."
                )}
              </SheetDescription>
            </SheetHeader>
            <div className="flex justify-end mt-6">
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>

        {/* Edit Venue Sheet */}
        <Sheet open={openEdit} onOpenChange={setOpenEdit}>
          <SheetContent
            side="right"
            className="w-full max-w-md px-5 border-none"
          >
            <SheetHeader>
              <SheetTitle>Edit Venue</SheetTitle>
              <SheetDescription>
                Update the details of this venue. (Changes are not persisted in
                this demo.)
              </SheetDescription>
            </SheetHeader>
            <form className="mt-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Venue Name
                </label>
                <Input
                  value={editForm.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <Input
                  value={editForm.location}
                  onChange={(e) => handleEditChange("location", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Capacity
                </label>
                <Input
                  type="number"
                  value={editForm.capacity}
                  onChange={(e) => handleEditChange("capacity", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <Input
                  value={editForm.image}
                  onChange={(e) => handleEditChange("image", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Facilities
                </label>
                <div className="flex flex-wrap gap-4">
                  {[
                    "Stage",
                    "Sound System",
                    "Projector",
                    "Air Conditioning",
                    "Video Conferencing",
                    "Lighting",
                    "+1 more",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={feature}
                        checked={editForm.features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="shadcn-checkbox"
                      />
                      <label htmlFor={feature} className="text-sm">
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) => handleEditChange("status", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Booked">Booked</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="button" className="bg-purple-600 text-white">
                  Save
                </Button>
                <SheetClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </SheetClose>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
