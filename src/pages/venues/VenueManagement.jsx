import React, { useState, useEffect, useCallback } from "react";
import { FiPlus, FiEdit, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import PageHeader from "../../Components/PageHeader";
import {
  getAllVenues,
  getME,
  createVenue,
  updateVenue,
  deleteVenue,
  getVenueBookingsByVenueId,
} from "../../utils/authService";
import { toast } from "react-toastify";
import { MdHistory } from "react-icons/md";

// --- Venue Edit Sheet Component ---
const VenueEditSheet = ({ isOpen, onOpenChange, onSave, venue }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    capacity: 0,
    description: "",
    image: null,
  });

  useEffect(() => {
    if (venue) {
      setFormData({ ...venue, image: null }); // Don't pre-fill image for edit
    } else {
      setFormData({
        name: "",
        address: "",
        capacity: 0,
        description: "",
        image: null,
      });
    }
  }, [venue, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("capacity", formData.capacity);
    data.append("description", formData.description);
    if (formData.image) {
      data.append("image", formData.image);
    }
    onSave(data, venue?.id);
  };

  return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-md w-full px-5">
        <SheetHeader>
          <SheetTitle>{venue?.id ? "Edit Venue" : "Create Venue"}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Venue Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Venue Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: parseInt(e.target.value, 10) || 0,
                })
              }
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] })}
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Save Venue
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

// --- Venue Detail View Component ---
const VenueDetailView = ({ venue, onBack }) => {
  const [venueBookings, setVenueBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [expandedBookingIds, setExpandedBookingIds] = useState(new Set());
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    const fetchVenueBookings = async () => {
      setLoadingBookings(true);
      try {
        const response = await getVenueBookingsByVenueId(venue.id);
        setVenueBookings(response.data || []);
      } catch (error) {
        toast.error("Failed to fetch bookings for this venue.");
      } finally {
        setLoadingBookings(false);
      }
    };

    if (venue?.id) {
      fetchVenueBookings();
    }
  }, [venue?.id]);

  const toggleExpand = (bookingId) => {
    setExpandedBookingIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  return (
    <Card className="overflow-hidden shadow-lg">
      {/* Image Banner */}
      {venue.image && (
        <>
          <div
            className="w-full h-56 bg-gray-100 cursor-pointer"
            onClick={() => setIsImageOpen(true)}
          >
            <img
              src={venue.image}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
          </div>
          <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
            <DialogContent className="max-w-4xl p-0 bg-transparent shadow-none border-none">
              <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-auto rounded-lg"
              />
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-gray-100"
          >
            <FiArrowLeft size={20} />
          </Button>
          <h2 className="text-2xl font-semibold text-gray-800">{venue.name}</h2>
        </div>
      </CardHeader>

      {/* Details */}
      <CardContent className="px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 text-sm mb-8">
          <div className="bg-[#ffffff] border border-gray-200 p-4 rounded-lg">
            <p className="font-semibold text-gray-700">Address</p>
            <p className="text-gray-600">{venue.address}</p>
          </div>
          <div className="bg-[#ffffff] border border-gray-200 p-4 rounded-lg">
            <p className="font-semibold text-gray-700">Capacity</p>
            <p className="text-gray-600">{venue.capacity}</p>
          </div>
          <div className="col-span-4 bg-[#ffffff] border border-gray-200 p-4 rounded-lg">
            <p className="font-semibold text-gray-700">Description</p>
            <p className="text-gray-600">{venue.description}</p>
          </div>
        </div>

        {/* Bookings */}
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex justify-left gap-2 items-center">
          <span>
            <MdHistory />
          </span>
          Bookings for this Venue
        </h3>
        {loadingBookings ? (
          <p>Loading bookings...</p>
        ) : venueBookings.length > 0 ? (
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Booked by</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Booked On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venueBookings.map((booking) => (
                  <React.Fragment key={booking.id}>
                    <TableRow
                      onClick={() => toggleExpand(booking.id)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        {booking.id}
                      </TableCell>
                      <TableCell>
                        {booking.requester_name ||
                          booking.requester?.username ||
                          booking.requester?.email ||
                          "N/A"}
                      </TableCell>
                      <TableCell>
                        {booking.status_display || booking.status || "N/A"}
                      </TableCell>
                      <TableCell>
                        {booking.slots && booking.slots.length > 0
                          ? new Date(booking.slots[0].date).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                    {expandedBookingIds.has(booking.id) && (
                      <TableRow>
                        <TableCell colSpan={4} className="p-0">
                          <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <h4 className="font-semibold mb-2">
                              Booking Slots:
                            </h4>
                            {booking.slots && booking.slots.length > 0 ? (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Start Time</TableHead>
                                    <TableHead>End Time</TableHead>
                                    <TableHead>Venue</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {booking.slots.map((slot) => (
                                    <TableRow key={slot.id}>
                                      <TableCell>
                                        {new Date(
                                          slot.date
                                        ).toLocaleDateString()}
                                      </TableCell>
                                      <TableCell>{slot.start_time}</TableCell>
                                      <TableCell>{slot.end_time}</TableCell>
                                      <TableCell>
                                        {slot.venue?.name || "N/A"}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <p className="text-gray-500">
                                No slots found for this booking.
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-500">No bookings found for this venue.</p>
        )}
      </CardContent>
    </Card>
  );
};

// --- Main Venue Management Page ---
export default function VenueManagement() {
  const [venues, setVenues] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table"); // "table" | "card"

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [userRes, venuesRes] = await Promise.all([getME(), getAllVenues()]);
      setLoggedInUser(userRes.data);
      setVenues(venuesRes.data || []);
    } catch (error) {
      toast.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveVenue = async (formData, venueId = null) => {
    try {
      if (venueId) {
        await updateVenue(venueId, formData);
        toast.success("Venue updated successfully!");
      } else {
        await createVenue(formData);
        toast.success("Venue created successfully!");
      }
      fetchData();
      setIsSheetOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save venue.");
    }
  };

  const handleDeleteVenue = async (venueId) => {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      try {
        await deleteVenue(venueId);
        toast.success("Venue deleted successfully!");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete venue.");
      }
    }
  };

  const handleOpenSheet = (venue = null) => {
    setEditingVenue(venue);
    setIsSheetOpen(true);
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-[#f4f6f8] min-h-screen">
      <PageHeader user={loggedInUser?.username} />

      {/* Toggle for view mode */}
      <div className="mb-5">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(val) => val && setViewMode(val)}
        >
          <ToggleGroupItem value="table">Table</ToggleGroupItem>
          <ToggleGroupItem value="card">Cards</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {selectedVenue ? (
        <VenueDetailView
          venue={selectedVenue}
          onBack={() => setSelectedVenue(null)}
        />
      ) : (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Venues</CardTitle>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => handleOpenSheet()}
                className="bg-purple-700 hover:bg-purple-600"
              >
                <FiPlus size={18} className="mr-2" /> Add Venue
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "table" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {venues.map((v) => (
                    <TableRow key={v.id} onClick={() => setSelectedVenue(v)}>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell>{v.address}</TableCell>
                      <TableCell>{v.capacity}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSheet(v);
                          }}
                        >
                          <FiEdit size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteVenue(v.id);
                          }}
                          className="text-red-600"
                        >
                          <FiTrash2 size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {venues.map((v) => (
                  <Card
                    key={v.id}
                    className="cursor-pointer hover:shadow-md transition"
                    onClick={() => setSelectedVenue(v)}
                  >
                    {v.image && (
                      <img
                        src={v.image}
                        alt={v.name}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                    )}
                    <CardHeader>
                      <CardTitle>{v.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{v.address}</p>
                      <p className="text-sm text-gray-600">
                        Capacity: {v.capacity}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSheet(v);
                          }}
                        >
                          <FiEdit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteVenue(v.id);
                          }}
                        >
                          <FiTrash2 size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <VenueEditSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSave={handleSaveVenue}
        venue={editingVenue}
      />
    </div>
  );
}
