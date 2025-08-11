
import React from 'react';
import { useLocation } from 'react-router-dom';

const ClubDetails = () => {
    const location = useLocation();
    const { club } = location.state || {};

    if (!club) {
        return <div>Club not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={club.image || 'https://via.placeholder.com/800x400'} alt={club.name} className="w-full h-96 object-cover" />
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4">{club.name}</h1>
                    <p className="text-gray-700 mb-8">{club.description}</p>

                    <h2 className="text-2xl font-bold mb-4">Members ({club.member_count})</h2>
                    <ul className="divide-y divide-gray-200">
                        {club.members.map(member => (
                            <li key={member.id} className="py-4 flex items-center">
                                <img src={`https://i.pravatar.cc/150?u=${member.email}`} alt={member.name} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <p className="text-lg font-semibold">{member.name}</p>
                                    <p className="text-gray-600">{member.email}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ClubDetails;
