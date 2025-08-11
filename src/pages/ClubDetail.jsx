import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiUsers, FiPlus } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from '../Components/PageHeader';
import { getClubDetails, getClubMembers, addClubMember, removeClubMember, deleteClub } from '../utils/authService'; // Assuming these exist
import { toast } from 'react-toastify';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllUsers } from '../utils/authService'; // To get list of users for adding members

export default function ClubDetail() {
    const { clubId } = useParams();
    const navigate = useNavigate();
    const [club, setClub] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]); // For adding new members
    const [selectedUserId, setSelectedUserId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clubResponse = await getClubDetails(clubId);
                setClub(clubResponse.data);

                const membersResponse = await getClubMembers(clubId);
                setMembers(membersResponse.data);

                const usersResponse = await getAllUsers(); // Fetch all users
                setUsers(usersResponse.data);
            } catch (error) {
                console.error("Failed to fetch club details:", error);
                toast.error("Failed to load club details.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [clubId]);

    const handleAddMember = async () => {
        if (!selectedUserId) {
            toast.error("Please select a user to add.");
            return;
        }
        try {
            await addClubMember(clubId, selectedUserId);
            toast.success("Member added successfully!");
            // Re-fetch members
            const membersResponse = await getClubMembers(clubId);
            setMembers(membersResponse.data);
            setSelectedUserId(''); // Clear selection
        } catch (error) {
            console.error("Failed to add member:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to add member.");
        }
    };

    const handleRemoveMember = async (userId) => {
        if (window.confirm("Are you sure you want to remove this member?")) {
            try {
                await removeClubMember(clubId, userId);
                toast.success("Member removed successfully!");
                // Re-fetch members
                const membersResponse = await getClubMembers(clubId);
                setMembers(membersResponse.data);
            } catch (error) {
                console.error("Failed to remove member:", error.response?.data || error.message);
                toast.error(error.response?.data?.message || "Failed to remove member.");
            }
        }
    };

    const handleDeleteClub = async () => {
        if (window.confirm("Are you sure you want to delete this club? This action cannot be undone.")) {
            try {
                await deleteClub(clubId);
                toast.success("Club deleted successfully!");
                navigate('/clubs'); // Navigate back to club list
            } catch (error) {
                console.error("Failed to delete club:", error.response?.data || error.message);
                toast.error(error.response?.data?.message || "Failed to delete club.");
            }
        }
    };

    if (loading) {
        return <div className="p-10">Loading club details...</div>;
    }

    if (!club) {
        return <div className="p-10">Club not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
            <PageHeader user={"Username"} />
            <div className="max-w-4xl mx-auto">
                <Card>
                    {club.image && (
                        <img src={club.image} alt={club.name} className="w-full h-64 object-cover rounded-t-lg" />
                    )}
                    <CardHeader>
                        <CardTitle className="text-3xl">{club.name}</CardTitle>
                        <p className="text-sm text-gray-500">{club.description}</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-md mb-6">
                            <div>
                                <p className="font-semibold">President</p>
                                <p>{club.president_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Faculty Advisor</p>
                                <p>{club.faculty_advisor_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Total Members</p>
                                <p>{club.member_count}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Total Events</p>
                                <p>{club.total_events}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Created At</p>
                                <p>{new Date(club.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Last Updated</p>
                                <p>{new Date(club.updated_at).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mb-6">
                            <Button
                                variant="outline"
                                onClick={() => navigate(`/edit-club/${club.id}`)}
                            >
                                <FiEdit2 className="mr-2" /> Edit Club
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteClub}
                            >
                                <FiTrash2 className="mr-2" /> Delete Club
                            </Button>
                        </div>

                        <h3 className="text-xl font-bold mb-4 flex items-center"><FiUsers className="mr-2" /> Club Members</h3>
                        <div className="mb-4 flex gap-2">
                            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Select user to add" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map(user => (
                                        <SelectItem key={user.id} value={String(user.id)}>{user.username}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleAddMember}>
                                <FiPlus className="mr-2" /> Add Member
                            </Button>
                        </div>
                        {members.length === 0 ? (
                            <p className="text-gray-500">No members found for this club.</p>
                        ) : (
                            <ul className="space-y-2">
                                {members.map(member => (
                                    <li key={member.id} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm border border-gray-200">
                                        <span>{member.user.username} ({member.user.name})</span>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleRemoveMember(member.user.id)}
                                        >
                                            Remove
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
