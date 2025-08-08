import React, { useState, useEffect } from "react";
import { FiCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "../../Components/PageHeader";
import { createProposal, getUserProposals } from "../../utils/authService";
import { toast } from 'react-toastify';

export default function CreateProposal() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attendees, setAttendees] = useState(0);
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(false);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setLoadingProposals(true);
    try {
      const response = await getUserProposals();
      setProposals(response.data);
    } catch (error) {
      toast.error('Failed to fetch proposals');
    } finally {
      setLoadingProposals(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const proposalData = {
        name,
        description,
        attendees
      };
      await createProposal(proposalData);
      toast.success("Proposal submitted successfully!");
      // Reset form
      setName("");
      setDescription("");
      setAttendees(0);
      // Refresh proposals list
      fetchProposals();
    } catch (error) {
      console.error("Failed to submit proposal:", error);
      toast.error(error.response?.data?.detail || "Failed to submit proposal. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case 0: // pending
        return <FiCircle className="text-yellow-500" title="Pending" />;
      case 1: // approved
        return <FiCheckCircle className="text-green-500" title="Approved" />;
      case 2: // rejected
        return <FiXCircle className="text-red-500" title="Rejected" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Header */}
      <PageHeader user="Username" />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Create Proposal Form */}
        <Card className="lg:col-span-1 shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Create New Proposal</CardTitle>
            <p className="text-gray-500 text-sm">Submit a proposal for your club's activities</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Name</label>
                <Input
                  type="text"
                  placeholder="Enter proposal name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Textarea
                  rows={4}
                  placeholder="Provide details about your proposal..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Attendees</label>
                <Input
                  type="number"
                  min={0}
                  value={attendees}
                  onChange={(e) => setAttendees(parseInt(e.target.value) || 0)}
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-100">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Proposal"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Your Proposals List */}
        <Card className="lg:col-span-2 shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Your Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProposals ? (
              <p className="text-center py-4 text-gray-500">Loading proposals...</p>
            ) : proposals.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No proposals found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proposals.map((proposal) => (
                  <Card key={proposal.id} className="shadow-sm border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{proposal.name}</h3>
                        <div className="flex items-center gap-2">
                          {renderStatusIcon(proposal.status)}
                          <span className="text-sm font-medium">
                            {proposal.status === 0 && "Pending"}
                            {proposal.status === 1 && "Approved"}
                            {proposal.status === 2 && "Rejected"}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{proposal.description}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p><strong>Attendees:</strong> {proposal.attendees}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
