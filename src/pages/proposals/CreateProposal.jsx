import React, { useState, useEffect } from "react";
import { FiCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import PageHeader from "../../Components/PageHeader";
import { createProposal, getUserProposals } from "../../utils/authService";

export default function CreateProposal() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [durationInMinutes, setDurationInMinutes] = useState(0);
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
      const data = await getUserProposals();
      setProposals(data);
    } catch (error) {
      alert('Failed to fetch proposals');
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
        requested_date: requestedDate,
        duration_in_minutes: durationInMinutes,
        attendees
      };
      await createProposal(proposalData);
      alert("Proposal submitted successfully!");
      // Reset form
      setName("");
      setDescription("");
      setRequestedDate("");
      setDurationInMinutes(0);
      setAttendees(0);
      // Refresh proposals list
      fetchProposals();
    } catch (error) {
      alert("Failed to submit proposal. Please check your data.");
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
    <div className="min-h-screen bg-[#fcfbff] p-10 max-sm:p-5">
      {/* Header */}
      <PageHeader user="Username" />

      {/* Back Button */}
      <Button variant="outline" className="mb-4 flex items-center gap-2 px-4 py-2">
        <span className="text-lg">&#8592;</span>
        Back
      </Button>

      {/* Main Form */}
      <div className="mx-auto bg-white rounded-xl border border-gray-100 p-8 mb-10">
        <h2 className="text-2xl font-bold mb-1">Create New Proposal</h2>
        <p className="text-gray-500 mb-8">Submit a proposal for your club's activities</p>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Proposal Name */}
            <div>
              <label className="block font-medium mb-1">Proposal Name</label>
              <Input
                type="text"
                placeholder="Enter proposal name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Requested Date */}
            <div>
              <label className="block font-medium mb-1">Requested Date and Time</label>
              <Input
                type="datetime-local"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                required
              />
            </div>

            {/* Duration in Minutes */}
            <div>
              <label className="block font-medium mb-1">Duration (minutes)</label>
              <Input
                type="number"
                min={0}
                value={durationInMinutes}
                onChange={(e) => setDurationInMinutes(parseInt(e.target.value) || 0)}
                required
              />
            </div>

            {/* Number of Attendees */}
            <div>
              <label className="block font-medium mb-1">Number of Attendees</label>
              <Input
                type="number"
                min={0}
                value={attendees}
                onChange={(e) => setAttendees(parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block font-medium mb-1">Description</label>
            <Textarea
              rows={4}
              placeholder="Provide details about your proposal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Proposal"}
            </Button>
          </div>
        </form>
      </div>

      {/* Proposal List Section */}
      <div className="mx-auto bg-white rounded-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-6">Your Proposals</h2>
        
        {loadingProposals ? (
          <p className="text-center py-4">Loading proposals...</p>
        ) : proposals.length === 0 ? (
          <p className="text-center py-4">No proposals found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Requested Date</th>
                  <th className="text-left py-3 px-4">Duration (min)</th>
                  <th className="text-left py-3 px-4">Attendees</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((proposal) => (
                  <tr key={proposal.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{proposal.name}</td>
                    <td className="py-3 px-4 max-w-xs truncate">{proposal.description}</td>
                    <td className="py-3 px-4">
                      {new Date(proposal.requested_date).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">{proposal.duration_in_minutes}</td>
                    <td className="py-3 px-4">{proposal.attendees}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {renderStatusIcon(proposal.status)}
                        <span>
                          {proposal.status === 0 && "Pending"}
                          {proposal.status === 1 && "Approved"}
                          {proposal.status === 2 && "Rejected"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
