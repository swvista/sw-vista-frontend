import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from '../../Components/PageHeader';
import { getAllProposals } from '../../utils/authService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function ProposalList() {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                // For now, using getUserProposals. We might need a dedicated getAllProposals later.
                const response = await getAllProposals();
                setProposals(response.data || []);
            } catch (error) {
                console.error("Failed to fetch proposals:", error);
                toast.error("Failed to load proposals.");
            } finally {
                setLoading(false);
            }
        };
        fetchProposals();
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
                <h1 className="text-2xl font-bold">All Proposals</h1>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link to="/createProposal">
                        <FiPlus className="inline-block mr-2" /> Create New Proposal
                    </Link>
                </Button>
            </div>
            {loading ? (
                <p>Loading proposals...</p>
            ) : (
                proposals.length === 0 ? (
                    <p className="text-gray-500">No proposals found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {proposals.map((proposal) => (
                            <Card key={proposal.id} className="shadow-sm border-gray-200">
                                <CardHeader>
                                    <CardTitle>{proposal.name}</CardTitle>
                                    <p className="text-sm text-gray-500">Submitted by: {proposal.user?.username}</p>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">{proposal.description}</p>
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <p><strong>Attendees:</strong> {proposal.attendees}</p>
                                        <p><strong>Status:</strong> <span className={`font-medium ${getStatusColor(proposal.status)}`}>{proposal.status_display || proposal.status}</span></p>
                                        <p><strong>Created:</strong> {new Date(proposal.created_at).toLocaleString()}</p>
                                        <p><strong>Last Updated:</strong> {new Date(proposal.updated_at).toLocaleString()}</p>
                                    </div>
                                    {/* Add action buttons here if needed, e.g., View Details, Edit, Delete */}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}
