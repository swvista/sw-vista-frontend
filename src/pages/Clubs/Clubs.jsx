
import React, { useState, useEffect } from 'react';
import { getAllClubsDetails, deleteClub } from '../../utils/authService';
import { Link } from 'react-router-dom';

const Clubs = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await getAllClubsDetails();
                setClubs(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchClubs();
    }, []);

    const handleDelete = async (id) => {
        const clubToDelete = clubs.find(club => club.id === id);
        if (clubToDelete.member_count > 0) {
            alert("Cannot delete a club with members. Please remove all members first.");
            return;
        }

        if (window.confirm('Are you sure you want to delete this club?')) {
            try {
                await deleteClub(id);
                setClubs(clubs.filter(club => club.id !== id));
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while deleting the club.');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Clubs</h1>
                <Link to="/clubs/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Club
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {clubs.map(club => (
                    <div key={club.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img src={club.image || 'https://via.placeholder.com/300'} alt={club.name} className="w-full h-48 object-cover" />
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-2">{club.name}</h2>
                            <p className="text-gray-700 mb-4">{club.description}</p>
                            <div className="flex justify-between items-center">
                                <Link to={`/clubs/${club.id}`} state={{ club }} className="text-blue-500 hover:underline">View Details</Link>
                                <div>
                                    <Link to={`/clubs/edit/${club.id}`} className="text-gray-500 hover:text-gray-700 mr-4">Edit</Link>
                                    <button onClick={() => handleDelete(club.id)} className="text-red-500 hover:text-red-700">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Clubs;
