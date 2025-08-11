import React, { useState, useEffect } from 'react';
import { FiCalendar, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from '../../Components/PageHeader';
import { getAllEvents, deleteEvent } from '../../utils/authService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await getAllEvents();
                setEvents(response.data || []);
            } catch (error) {
                console.error("Failed to fetch events:", error);
                toast.error("Failed to load events.");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleDelete = async (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await deleteEvent(eventId);
                toast.success("Event deleted successfully!");
                setEvents(events.filter(event => event.id !== eventId));
            } catch (error) {
                console.error("Failed to delete event:", error.response?.data || error.message);
                toast.error("Failed to delete event.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
            <PageHeader user={"Username"} />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Events</h1>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link to="/create-event">
                        <FiPlus className="inline-block mr-2" /> Create New Event
                    </Link>
                </Button>
            </div>
            {loading ? (
                <p>Loading events...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => (
                        <Link to={`/events/${event.id}`} className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
                            <Card key={event.id} className="shadow-sm border-gray-200 flex flex-col h-full">
                                {event.poster_url && (
                                    <img src={event.poster_url} alt={event.title} className="w-full h-48 object-cover rounded-t-lg" />
                                )}
                                <CardHeader>
                                    <CardTitle>{event.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">{event.description}</p>
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <p><strong>Starts:</strong> {new Date(event.start_date).toLocaleString()}</p>
                                        <p><strong>Ends:</strong> {new Date(event.end_date).toLocaleString()}</p>
                                        <p><strong>Type:</strong> {event.event_type?.name || 'N/A'}</p>
                                        <p><strong>Creator:</strong> {event.creator?.username || 'N/A'}</p>
                                    </div>
                                </CardContent>
                                <div className="p-4 border-t border-gray-200 mt-auto">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Link to={`/edit-event/${event.id}`}>
                                                <FiEdit2 className="mr-1" /> Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(event.id);
                                            }}
                                        >
                                            <FiTrash2 className="mr-1" /> Delete
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
