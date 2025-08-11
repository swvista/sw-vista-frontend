import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiMessageSquare } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from '../../Components/PageHeader';
import { getVenueBookingById, approveBooking, rejectBooking } from '../../utils/authService'; // Assuming getVenueBookingById exists
import { toast } from 'react-toastify';

export default function BookingReviewPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState('');
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                // Assuming getVenueBookingById exists in authService.js
                // If not, we'll need to add it.
                const response = await getVenueBookingById(bookingId);
                setBooking(response.data);
            } catch (error) {
                console.error("Failed to fetch booking:", error);
                toast.error("Failed to load booking details.");
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    const handleApprove = async () => {
        if (window.confirm("Are you sure you want to approve this booking?")) {
            try {
                await approveBooking(bookingId);
                toast.success("Booking approved successfully!");
                navigate('/bookings-for-approval'); // Navigate back to pending bookings list
            } catch (error) {
                console.error("Failed to approve booking:", error.response?.data || error.message);
                toast.error(error.response?.data?.error || "Failed to approve booking.");
            }
        }
    };

    const handleReject = async () => {
        if (window.confirm("Are you sure you want to reject this booking?")) {
            try {
                await rejectBooking(bookingId, comments);
                toast.success("Booking rejected successfully!");
                navigate('/bookings-for-approval'); // Navigate back to pending bookings list
            } catch (error) {
                console.error("Failed to reject booking:", error.response?.data || error.message);
                toast.error(error.response?.data?.error || "Failed to reject booking.");
            }
        }
    };

    if (loading) {
        return <div className="p-10">Loading booking details...</div>;
    }

    if (!booking) {
        return <div className="p-10">Booking not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
            <PageHeader user={"Username"} />
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">{booking.proposal_details?.name || booking.event_details?.title || 'General Booking'}</CardTitle>
                        <p className="text-sm text-gray-500">Requester: {booking.requester_details?.username}</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-md mb-6">
                            <div>
                                <p className="font-semibold">Status</p>
                                <p>{booking.status_display}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Current Stage</p>
                                <p>{booking.approval_stage}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Created At</p>
                                <p>{new Date(booking.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Last Updated</p>
                                <p>{new Date(booking.updated_at).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Booked Slots:</h4>
                            {booking.slots && booking.slots.length > 0 ? (
                                <ul className="space-y-1">
                                    {booking.slots.map(slot => (
                                        <li key={slot.id} className="text-sm text-gray-600 ml-2">
                                            {slot.venue?.name} on {new Date(slot.date).toLocaleDateString()} from {slot.start_time} to {slot.end_time}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 ml-2">No specific slots booked.</p>
                            )}
                        </div>

                        <div className="mt-6">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Approval History:</h4>
                            {booking.approvals && booking.approvals.length > 0 ? (
                                <ul className="space-y-2">
                                    {booking.approvals.map(approval => (
                                        <li key={approval.id} className="p-2 bg-gray-50 rounded-md text-sm">
                                            <p><strong>Stage {approval.stage}:</strong> {approval.approver_name} - {approval.status_display || approval.status}</p>
                                            {approval.comments && <p className="text-xs text-gray-600 ml-2">Comments: {approval.comments}</p>}
                                            <p className="text-xs text-gray-500 ml-2">Approved on: {new Date(approval.approval_date).toLocaleString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No approval history.</p>
                            )}
                        </div>

                        {booking.status === 0 && ( // Only show buttons if status is pending
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex justify-end gap-3">
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={handleApprove}
                                    >
                                        <FiCheckCircle className="mr-2" /> Approve
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => setShowComments(!showComments)}
                                    >
                                        <FiXCircle className="mr-2" /> Reject
                                    </Button>
                                </div>
                                {showComments && (
                                    <div className="flex flex-col gap-2">
                                        <Textarea
                                            placeholder="Add comments for rejection..."
                                            value={comments}
                                            onChange={(e) => setComments(e.target.value)}
                                        />
                                        <Button
                                            variant="destructive"
                                            onClick={handleReject}
                                        >
                                            <FiMessageSquare className="mr-2" /> Confirm Reject
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
