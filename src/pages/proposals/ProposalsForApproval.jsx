import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from '../../Components/PageHeader';
import { getUserProposals } from '../../utils/authService'; // Assuming this fetches all proposals
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function ProposalsForApproval() {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const response = await getUserProposals(); // This fetches proposals by user
                // We need a way to fetch all proposals, or proposals for approval
                // For now, let's assume getUserProposals returns all proposals and we filter
                const allProposals = response.data || [];
                const pendingProposals = allProposals.filter(p => p.status === 0); // 0 is pending
                setProposals(pendingProposals);
            } catch (error) {
                console.error("Failed to fetch proposals:", error);
                toast.error("Failed to load proposals for approval.");
            } finally {
                setLoading(false);
            }
        };
        fetchProposals();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
            <PageHeader user={"Username"} />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Proposals for Approval</h1>
            </div>
            {loading ? (
                <p>Loading proposals...</p>
            ) : (
                proposals.length === 0 ? (
                    <p className="text-gray-500">No pending proposals found.</p>
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
                                        <p><strong>Status:</strong> {proposal.status_display || proposal.status}</p>
                                        <p><strong>Created:</strong> {new Date(proposal.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button asChild size="sm">
                                            <Link to={`/proposals/${proposal.id}/approve`}>
                                                <FiCheckCircle className="mr-1" /> Review
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
