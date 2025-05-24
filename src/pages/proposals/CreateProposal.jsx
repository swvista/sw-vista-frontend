import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import PageHeader from "../../Components/PageHeader";

export default function CreateProposal() {
  const [club, setClub] = useState("Cultural Club");
  const [eventType, setEventType] = useState("General body meet");
  const [proposalTitle, setProposalTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [description, setDescription] = useState("");
  const [specialReq, setSpecialReq] = useState("");

  return (
    <div className="min-h-screen bg-[#fcfbff] p-10 max-sm:p-5">
      {/* Header */}
      <PageHeader user="Username"/>

      {/* Back Button */}
      <Button variant="outline" className="mb-4 flex items-center gap-2 px-4 py-2">
        <span className="text-lg">&#8592;</span>
        Back
      </Button>

      {/* Main Form */}
      <div className="mx-auto bg-white rounded-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-1">Create New Proposal</h2>
        <p className="text-gray-500 mb-8">Submit a proposal for your club's activities</p>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Club */}
            <div>
              <label className="block font-medium mb-1">Club</label>
              <Select value={club} onValueChange={setClub}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select club" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cultural Club">Cultural Club</SelectItem>
                  <SelectItem value="Sports Club">Sports Club</SelectItem>
                  <SelectItem value="Technical Club">Technical Club</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">Select the club submitting this proposal</p>
            </div>
            {/* Event Type */}
            <div>
              <label className="block font-medium mb-1">Event Type</label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General body meet">General body meet</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Competition">Competition</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">Select the type of event you're proposing</p>
            </div>
            {/* Proposal Title */}
            <div>
              <label className="block font-medium mb-1">Proposal Title</label>
              <Input
                type="text"
                placeholder="Enter proposal title"
                value={proposalTitle}
                onChange={e => setProposalTitle(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">Provide a clear title for your proposal</p>
            </div>
            {/* Estimated Budget */}
            <div>
              <label className="block font-medium mb-1">Estimated Budget</label>
              <Input
                type="text"
                placeholder="Enter budget amount"
                value={budget}
                onChange={e => setBudget(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">Total budget required for the proposed activity</p>
            </div>
            {/* Timeline (full width) */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Timeline</label>
              <Input
                type="text"
                placeholder="E.g., 2 weeks, April–May 2025"
                value={timeline}
                onChange={e => setTimeline(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">Expected timeline for the proposed activity</p>
            </div>
          </div>
          {/* Proposal Description */}
          <div className="mb-6">
            <label className="block font-medium mb-1">Proposal Description</label>
            <Textarea
              rows={4}
              placeholder="Provide details about your proposal..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              Describe the purpose, goals, and expected outcomes of your proposal
            </p>
          </div>
          {/* Special Requirements */}
          <div className="mb-8">
            <label className="block font-medium mb-1">Special Requirements</label>
            <Textarea
              rows={2}
              placeholder="Any special requirements or additional information..."
              value={specialReq}
              onChange={e => setSpecialReq(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              List any special arrangements, permissions, or resources needed
            </p>
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">
              Submit Proposal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
