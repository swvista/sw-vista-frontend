import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from '../Components/PageHeader';
import { createClub, getClubDetails, updateClub } from '../utils/authService'; // Assuming these exist
import { toast } from 'react-toastify';

export default function ClubForm() {
    const { clubId } = useParams(); // Will be undefined for create, defined for edit
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null); // For file input
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (clubId) {
            setIsEditing(true);
            const fetchClub = async () => {
                try {
                    const response = await getClubDetails(clubId);
                    const club = response.data;
                    setName(club.name);
                    setDescription(club.description);
                    // Note: Image display for existing image is more complex, might need a separate URL state
                } catch (error) {
                    console.error("Failed to fetch club for editing:", error);
                    toast.error("Failed to load club for editing.");
                }
            };
            fetchClub();
        }
    }, [clubId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        try {
            if (isEditing) {
                await updateClub(clubId, formData);
                toast.success("Club updated successfully!");
            } else {
                await createClub(formData);
                toast.success("Club created successfully!");
            }
            navigate('/clubs'); // Navigate back to club list
        } catch (error) {
            console.error("Failed to save club:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to save club.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
            <PageHeader user={"Username"} />
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">{isEditing ? 'Edit Club' : 'Create New Club'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block font-medium mb-1">Club Name</label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Description</label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="4"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Club Image</label>
                                <Input
                                    type="file"
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={loading}
                                >
                                    {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Club" : "Create Club")}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
