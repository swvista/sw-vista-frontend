import React, { useState, useEffect, useCallback } from "react";
import { FiPlus, FiEdit, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import PageHeader from "../../Components/PageHeader";
import {
  getAllVenues,
  getME,
  createVenue,
  updateVenue,
  deleteVenue,
  getVenueBookingsByVenueId,
} from "../../utils/authService";
import { toast } from 'react-toastify';

// --- Venue Edit Sheet Component ---
const VenueEditSheet = ({ isOpen, onOpenChange, onSave, venue }) => {
    const [formData, setFormData] = useState({ name: '', address: '', capacity: 0, description: '', image: null });

    useEffect(() => {
        if (venue) {
            setFormData({ ...venue, image: null }); // Don't pre-fill image for edit
        } else {
            setFormData({ name: '', address: '', capacity: 0, description: '', image: null });
        }
    }, [venue, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('address', formData.address);
        data.append('capacity', formData.capacity);
        data.append('description', formData.description);
        if (formData.image) {
            data.append('image', formData.image);
        }
        onSave(data, venue?.id);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="max-w-md w-full px-5">
                <SheetHeader>
                    <SheetTitle>{venue?.id ? 'Edit Venue' : 'Create Venue'}</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <Label htmlFor="name">Venue Name</Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
                    </div>
                    <div>
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input id="capacity" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value, 10) || 0 })} required />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                    </div>
                    <div>
                        <Label htmlFor="image">Image</Label>
                        <Input id="image" type="file" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
                    </div>
                    <Button type="submit" className="w-full">Save Venue</Button>
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

    useEffect(() => {
        const fetchVenueBookings = async () => {
            setLoadingBookings(true);
            try {
                const response = await getVenueBookingsByVenueId(venue.id);
                console.log("Fetched venue bookings:", response.data);
                setVenueBookings(response.data || []);
            } catch (error) {
                toast.error("Failed to fetch bookings for this venue.");
                console.error("Error fetching venue bookings:", error);
            } finally {
                setLoadingBookings(false);
            }
        };

        if (venue?.id) {
            fetchVenueBookings();
        }
    }, [venue?.id]);

    const toggleExpand = (bookingId) => {
        setExpandedBookingIds(prev => {
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
        <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack}><FiArrowLeft size={20} /></Button>
                    <h2 className="text-xl font-semibold">{venue.name}</h2>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-6">
                    <div><p className="font-semibold">Address</p><p>{venue.address}</p></div>
                    <div><p className="font-semibold">Capacity</p><p>{venue.capacity}</p></div>
                    <div><p className="font-semibold">Description</p><p>{venue.description}</p></div>
                    {venue.image && <div><p className="font-semibold">Image</p><img src={venue.image} alt={venue.name} className="w-32 h-32 object-cover rounded" /></div>}
                </div>

                <h3 className="text-lg font-semibold mb-4">Bookings for this Venue</h3>
                {loadingBookings ? (
                    <p>Loading bookings...</p>
                ) : venueBookings.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Requester</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {venueBookings.map(booking => (
                                <React.Fragment key={booking.id}>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            <span onClick={() => toggleExpand(booking.id)} className="cursor-pointer hover:underline">
                                                {booking.id}
                                            </span>
                                        </TableCell>
                                        <TableCell>{booking.requester_name || booking.requester?.username || booking.requester?.email || 'N/A'}</TableCell>
                                        <TableCell>{booking.status_display || booking.status || 'N/A'}</TableCell>
                                        <TableCell>{booking.slots && booking.slots.length > 0 ? new Date(booking.slots[0].date).toLocaleDateString() : 'N/A'}</TableCell>
                                    </TableRow>
                                    {expandedBookingIds.has(booking.id) && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="p-0">
                                                <div className="p-4 bg-gray-50 border-t border-b">
                                                    <h4 className="font-semibold mb-2">Booking Slots:</h4>
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
                                                                {booking.slots.map(slot => (
                                                                    <TableRow key={slot.id}>
                                                                        <TableCell>{new Date(slot.date).toLocaleDateString()}</TableCell>
                                                                        <TableCell>{slot.start_time}</TableCell>
                                                                        <TableCell>{slot.end_time}</TableCell>
                                                                        <TableCell>{slot.venue?.name || 'N/A'}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    ) : (
                                                        <p className="text-gray-500">No slots found for this booking.</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
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

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [userRes, venuesRes] = await Promise.all([
                getME(),
                getAllVenues(),
            ]);
            setLoggedInUser(userRes.data);
            setVenues(venuesRes.data || []);
        } catch (error) {
            toast.error("Failed to fetch data.");
            console.error("Data fetch error:", error);
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
        <div className="p-4 sm:p-6 md:p-10 bg-[#faf8ff] min-h-screen">
            <PageHeader user={loggedInUser?.username} />

            {selectedVenue ? (
                <VenueDetailView 
                    venue={selectedVenue} 
                    onBack={() => setSelectedVenue(null)} 
                />
            ) : (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Venues</CardTitle>
                        <Button onClick={() => handleOpenSheet()} className="bg-purple-700 hover:bg-purple-600">
                            <FiPlus size={18} className="mr-2" /> Add Venue
                        </Button>
                    </CardHeader>
                    <CardContent>
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
                                {venues.map(v => (
                                    <TableRow key={v.id}>
                                        <TableCell className="font-medium">
                                            <span onClick={() => setSelectedVenue(v)} className="cursor-pointer hover:underline">{v.name}</span>
                                        </TableCell>
                                        <TableCell>{v.address}</TableCell>
                                        <TableCell>{v.capacity}</TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenSheet(v)}><FiEdit size={18} /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteVenue(v.id)} className="text-red-600"><FiTrash2 size={18} /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
