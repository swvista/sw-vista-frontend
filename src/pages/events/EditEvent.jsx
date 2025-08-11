import React, { useState, useEffect } from 'react';
import { FiUpload } from 'react-icons/fi';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import PageHeader from '../../Components/PageHeader';
import { getEventById, updateEvent, getAllEventTypes } from '../../utils/authService';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditEvent() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [eventTypeId, setEventTypeId] = useState('');
    const [posterFile, setPosterFile] = useState(null);
    const [eventTypes, setEventTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { eventId } = useParams();

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const eventResponse = await getEventById(eventId);
                const event = eventResponse.data;
                setTitle(event.title);
                setDescription(event.description);
                setStartDate(new Date(event.start_date).toISOString().slice(0, 16));
                setEndDate(new Date(event.end_date).toISOString().slice(0, 16));
                setEventTypeId(String(event.event_type.id));

                const typesResponse = await getAllEventTypes();
                setEventTypes(typesResponse.data || []);
            } catch (error) {
                console.error("Failed to fetch event data:", error);
                toast.error("Failed to load event data.");
            }
        };
        fetchEventData();
    }, [eventId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('start_date', startDate.split('T')[0]);
        formData.append('end_date', endDate.split('T')[0]);
        formData.append('event_type_id', eventTypeId);
        if (posterFile) {
            formData.append('poster_file', posterFile);
        }

        try {
            await updateEvent(eventId, formData);
            toast.success("Event updated successfully!");
            navigate('/events');
        } catch (error) {
            console.error("Failed to update event:", error.response?.data || error.message);
            toast.error(error.response?.data?.detail || "Failed to update event.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
            <PageHeader user={"Username"} />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Event</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block font-medium mb-1">Event Title</label>
                            <Input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border rounded"
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-medium mb-1">Start Date</label>
                                <Input
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">End Date</label>
                                <Input
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Event Type</label>
                            <Select value={eventTypeId} onValueChange={setEventTypeId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {eventTypes.map((type) => (
                                        <SelectItem key={type.id} value={String(type.id)}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Event Poster</label>
                            <div className="flex items-center">
                                <label htmlFor="poster-upload" className="cursor-pointer bg-white rounded-md border border-gray-300 p-2 flex items-center">
                                    <FiUpload className="mr-2" />
                                    <span>{posterFile ? posterFile.name : 'Upload a new file'}</span>
                                </label>
                                <Input
                                    id="poster-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => setPosterFile(e.target.files[0])}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Event"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
