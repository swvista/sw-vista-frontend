import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiEye } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from '../../Components/PageHeader';
import { getPendingBookings } from '../../utils/authService'; // Need to add this
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function BookingApprovalPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await getPendingBookings();
                setBookings(response.data || []);
            } catch (error) {
                console.error("Failed to fetch pending bookings:", error);
                toast.error("Failed to load pending bookings.");
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 0: return "text-yellow-500"; // Pending
            case 1: return "text-green-500"; // Approved
            case 2: return "text-red-500";   // Rejected
            default: return "text-gray-500";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
            <PageHeader user={"Username"} />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Bookings for Approval</h1>
            </div>
            {loading ? (
                <p>Loading bookings...</p>
            ) : (
                bookings.length === 0 ? (
                    <p className="text-gray-500">No pending bookings found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bookings.map((booking) => (
                            <Card key={booking.id} className="shadow-sm border-gray-200">
                                <CardHeader>
                                    <CardTitle>{booking.proposal_details?.name || booking.event_details?.title || 'General Booking'}</CardTitle>
                                    <p className="text-sm text-gray-500">Requester: {booking.requester_details?.username}</p>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 mb-2">Status: <span className={`font-medium ${getStatusColor(booking.status)}`}>{booking.status_display}</span></p>
                                    <p className="text-sm text-gray-600 mb-2">Current Stage: {booking.approval_stage}</p>
                                    <div className="mt-3 space-y-1">
                                        <p className="text-xs text-gray-500"><strong>Booked Slots:</strong></p>
                                        {booking.slots && booking.slots.length > 0 ? (
                                            <ul className="space-y-1">
                                                {booking.slots.map(slot => (
                                                    <li key={slot.id} className="text-xs text-gray-500 ml-2">
                                                        {slot.venue?.name} on {new Date(slot.date).toLocaleDateString()} from {slot.start_time} to {slot.end_time}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-xs text-gray-500 ml-2">No specific slots booked.</p>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button asChild size="sm">
                                            <Link to={`/bookings/${booking.id}/review`}>
                                                <FiEye className="mr-1" /> Review
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}
