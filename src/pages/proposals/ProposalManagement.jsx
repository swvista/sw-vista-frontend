import React, { useState, useEffect, useCallback } from "react";
import { FiPlus, FiEdit, FiTrash2, FiArrowLeft, FiCheckCircle, FiXCircle, FiMessageSquare } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import PageHeader from "../../Components/PageHeader";
import {
  getAllProposals,
  getME,
  createProposal,
  updateProposal,
  deleteProposal,
  approveProposal,
  rejectProposal,
} from "../../utils/authService";
import { toast } from 'react-toastify';

// --- Proposal Edit Sheet Component ---
const ProposalEditSheet = ({ isOpen, onOpenChange, onSave, proposal }) => {
    const [formData, setFormData] = useState({ name: '', description: '', attendees: 0 });

    useEffect(() => {
        if (proposal) {
            setFormData(proposal);
        } else {
            setFormData({ name: '', description: '', attendees: 0 });
        }
    }, [proposal, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="max-w-md w-full px-5">
                <SheetHeader>
                    <SheetTitle>{proposal?.id ? 'Edit Proposal' : 'Create Proposal'}</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <Label htmlFor="name">Proposal Name</Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                    </div>
                    <div>
                        <Label htmlFor="attendees">Number of Attendees</Label>
                        <Input id="attendees" type="number" value={formData.attendees} onChange={(e) => setFormData({ ...formData, attendees: parseInt(e.target.value, 10) || 0 })} required />
                    </div>
                    <Button type="submit" className="w-full">Save Proposal</Button>
                </form>
            </SheetContent>
        </Sheet>
    );
};

// --- Proposal Detail View Component ---
const ProposalDetailView = ({ proposal, onBack, onApprove, onReject }) => {
    const [comments, setComments] = useState('');
    const [showComments, setShowComments] = useState(false);

    if (!proposal) return null;

    const getStatusInfo = (status) => {
        switch (status) {
            case 0: return { text: 'Pending', color: 'text-yellow-600' };
            case 1: return { text: 'Approved', color: 'text-green-600' };
            case 2: return { text: 'Rejected', color: 'text-red-600' };
            default: return { text: 'Unknown', color: 'text-gray-600' };
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack}><FiArrowLeft size={20} /></Button>
                    <h2 className="text-xl font-semibold">{proposal.name}</h2>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">{proposal.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-6">
                    <div><p className="font-semibold">Submitted By</p><p>{proposal.user?.username || 'N/A'}</p></div>
                    <div><p className="font-semibold">Attendees</p><p>{proposal.attendees}</p></div>
                    <div><p className="font-semibold">Status</p><p className={getStatusInfo(proposal.status).color}>{getStatusInfo(proposal.status).text}</p></div>
                    <div><p className="font-semibold">Created At</p><p>{new Date(proposal.created_at).toLocaleString()}</p></div>
                </div>

                {proposal.status === 0 && (
                    <div className="flex flex-col gap-4 pt-4 border-t">
                        <div className="flex justify-end gap-3">
                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => onApprove(proposal.id)}><FiCheckCircle className="mr-2" /> Approve</Button>
                            <Button variant="destructive" onClick={() => setShowComments(!showComments)}><FiXCircle className="mr-2" /> Reject</Button>
                        </div>
                        {showComments && (
                            <div className="flex flex-col gap-2">
                                <Textarea placeholder="Add comments for rejection..." value={comments} onChange={(e) => setComments(e.target.value)} />
                                <Button variant="destructive" onClick={() => onReject(proposal.id, comments)}><FiMessageSquare className="mr-2" /> Confirm Reject</Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// --- Main Proposal Management Page ---
export default function ProposalManagement() {
    const [proposals, setProposals] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingProposal, setEditingProposal] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [userRes, proposalsRes] = await Promise.all([getME(), getAllProposals()]);
            setLoggedInUser(userRes.data);
            setProposals(proposalsRes.data || []);
        } catch (error) {
            toast.error("Failed to fetch data.");
            console.error("Data fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async (proposalData) => {
        try {
            if (proposalData.id) {
                await updateProposal(proposalData.id, proposalData);
                toast.success("Proposal updated successfully!");
            } else {
                await createProposal(proposalData);
                toast.success("Proposal created successfully!");
            }
            fetchData();
            setIsSheetOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.detail || "Failed to save proposal.");
        }
    };

    const handleDelete = async (proposalId) => {
        if (window.confirm("Are you sure you want to delete this proposal?")) {
            try {
                await deleteProposal(proposalId);
                toast.success("Proposal deleted successfully!");
                fetchData();
            } catch (error) {
                toast.error("Failed to delete proposal.");
            }
        }
    };

    const handleApprove = async (proposalId) => {
        if (window.confirm("Are you sure you want to approve this proposal?")) {
            try {
                await approveProposal(proposalId);
                toast.success("Proposal approved successfully!");
                fetchData();
                setSelectedProposal(null);
            } catch (error) {
                toast.error(error.response?.data?.detail || "Failed to approve proposal.");
            }
        }
    };

    const handleReject = async (proposalId, comments) => {
        if (window.confirm("Are you sure you want to reject this proposal?")) {
            try {
                await rejectProposal(proposalId, comments);
                toast.success("Proposal rejected successfully!");
                fetchData();
                setSelectedProposal(null);
            } catch (error) {
                toast.error(error.response?.data?.status || "Failed to reject proposal.");
            }
        }
    };

    const handleOpenSheet = (proposal = null) => {
        setEditingProposal(proposal);
        setIsSheetOpen(true);
    };

    const getStatusComponent = (status) => {
        const statusMap = {
            0: { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
            1: { text: 'Approved', color: 'bg-green-100 text-green-800' },
            2: { text: 'Rejected', color: 'bg-red-100 text-red-800' },
        };
        const { text, color } = statusMap[status] || { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>{text}</span>;
    };

    if (loading) {
        return <div className="p-10">Loading...</div>;
    }

    return (
        <div className="p-4 sm:p-6 md:p-10 bg-[#faf8ff] min-h-screen">
            <PageHeader user={loggedInUser?.username} />

            {selectedProposal ? (
                <ProposalDetailView 
                    proposal={selectedProposal} 
                    onBack={() => setSelectedProposal(null)} 
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            ) : (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Proposals</CardTitle>
                        <Button onClick={() => handleOpenSheet()} className="bg-purple-700 hover:bg-purple-600">
                            <FiPlus size={18} className="mr-2" /> Add Proposal
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Submitted By</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Attendees</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {proposals.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">
                                            <span onClick={() => setSelectedProposal(p)} className="cursor-pointer hover:underline">{p.name}</span>
                                        </TableCell>
                                        <TableCell>{p.user?.username || 'N/A'}</TableCell>
                                        <TableCell>{getStatusComponent(p.status)}</TableCell>
                                        <TableCell>{p.attendees}</TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenSheet(p)}><FiEdit size={18} /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-red-600"><FiTrash2 size={18} /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            <ProposalEditSheet 
                isOpen={isSheetOpen} 
                onOpenChange={setIsSheetOpen} 
                onSave={handleSave} 
                proposal={editingProposal} 
            />
        </div>
    );
}
