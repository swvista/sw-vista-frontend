import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiMessageSquare } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from '../../Components/PageHeader';
import { getProposalById, rejectProposal, approveProposal } from '../../utils/authService';
import { toast } from 'react-toastify';

export default function ProposalApproval() {
    const { proposalId } = useParams();
    const navigate = useNavigate();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState('');
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        const fetchProposal = async () => {
            try {
                const response = await getProposalById(proposalId);
                setProposal(response.data);
            } catch (error) {
                console.error("Failed to fetch proposal:", error);
                toast.error("Failed to load proposal details.");
            } finally {
                setLoading(false);
            }
        };
        fetchProposal();
    }, [proposalId]);

    const handleApprove = async () => {
        if (window.confirm("Are you sure you want to approve this proposal?")) {
            try {
                const updatedProposal = { ...proposal, status: 1 }; // 1 for approved
                await approveProposal(proposalId);
                toast.success("Proposal approved successfully!");
                navigate('/proposals'); // Navigate to a proposals list page
            } catch (error) {
                console.error("Failed to approve proposal:", error.response?.data || error.message);
                toast.error(error.response?.data?.detail || "Failed to approve proposal.");
            }
        }
    };

    const handleReject = async () => {
        if (window.confirm("Are you sure you want to reject this proposal?")) {
            try {
                await rejectProposal(proposalId, comments);
                toast.success("Proposal rejected successfully!");
                navigate('/proposals'); // Navigate to a proposals list page
            } catch (error) {
                console.error("Failed to reject proposal:", error.response?.data || error.message);
                toast.error(error.response?.data?.status || "Failed to reject proposal.");
            }
        }
    };

    if (loading) {
        return <div className="p-10">Loading proposal details...</div>;
    }

    if (!proposal) {
        return <div className="p-10">Proposal not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
            <PageHeader user={"Username"} />
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">{proposal.name}</CardTitle>
                        <p className="text-sm text-gray-500">Submitted by: {proposal.user?.username}</p>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-gray-700 mb-6">{proposal.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-md mb-6">
                            <div>
                                <p className="font-semibold">Attendees</p>
                                <p>{proposal.attendees}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Status</p>
                                <p>{proposal.status_display || proposal.status}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Created At</p>
                                <p>{new Date(proposal.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Last Updated</p>
                                <p>{new Date(proposal.updated_at).toLocaleString()}</p>
                            </div>
                        </div>

                        {proposal.status === 0 && ( // Only show buttons if status is pending
                            <div className="flex flex-col gap-4">
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