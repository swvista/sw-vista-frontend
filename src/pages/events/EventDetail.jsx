import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from '../../Components/PageHeader';
import { getEventById } from '../../utils/authService';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

export default function EventDetail() {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { eventId } = useParams();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await getEventById(eventId);
                setEvent(response.data);
            } catch (error) {
                console.error("Failed to fetch event:", error);
                toast.error("Failed to load event details.");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    if (loading) {
        return <div className="p-10">Loading event details...</div>;
    }

    if (!event) {
        return <div className="p-10">Event not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
            <PageHeader user={"Username"} />
            <div className="max-w-4xl mx-auto">
                <Card>
                    {event.poster_url && (
                        <img src={event.poster_url} alt={event.title} className="w-full h-96 object-cover rounded-t-lg" />
                    )}
                    <CardHeader>
                        <CardTitle className="text-3xl">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-gray-700 mb-6">{event.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-md">
                            <div className="flex items-center">
                                <FiCalendar className="mr-3 text-gray-500" />
                                <div>
                                    <p className="font-semibold">Start Date</p>
                                    <p>{new Date(event.start_date).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FiCalendar className="mr-3 text-gray-500" />
                                <div>
                                    <p className="font-semibold">End Date</p>
                                    <p>{new Date(event.end_date).toLocaleString()}</p>
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold">Event Type</p>
                                <p>{event.event_type?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Created By</p>
                                <p>{event.creator?.username || 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
