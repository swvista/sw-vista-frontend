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
import { useState, useEffect } from "react";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import PageHeader from "../../Components/PageHeader";
import { useNavigate } from "react-router-dom";
import { getAllClubs, getApprovedProposals, submitReport } from "../../utils/authService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "react-toastify";

export default function SubmitReportPage() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState("");
  const [proposals, setProposals] = useState([]);
  const [proposalId, setProposalId] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [participantCount, setParticipantCount] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [outcomes, setOutcomes] = useState("");
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch clubs and proposals on mount
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const clubData = await getAllClubs();
        setClubs(clubData);
        if (clubData.length > 0) setClubId(String(clubData[0].id));
        const proposalData = await getApprovedProposals();
        // Only keep proposals with status === 1 (approved)
        const approved = proposalData.filter(p => p.status === 1);
        setProposals(approved);
        if (approved.length > 0) setProposalId(String(approved[0].id));
      } catch (error) {
        toast.error("Failed to load clubs or proposals");
      }
    }
    fetchInitialData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("club", clubId);
      formData.append("proposal", proposalId);
      formData.append("title", reportTitle);
      formData.append("participant_count", participantCount);
      formData.append("content", reportContent);
      formData.append("outcomes", outcomes);
      files.forEach(file => {
        formData.append("attachments", file);
      });

      await submitReport(formData);
      toast.success("Report submitted successfully!");
      navigate("/reports");
    } catch (error) {
      console.error("Report submission failed:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbff] p-10 max-sm:p-5">
      <PageHeader user="Username"/>
      <Button
        variant="outline"
        className="mb-6 flex items-center gap-2 px-4 py-2"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="text-base" />
        Back
      </Button>

      <div className="mx-auto bg-white rounded-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-1">Submit Event Report</h2>
        <p className="text-gray-500 mb-8">
          Report the outcomes of your club's event
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Club Dropdown */}
            <div>
              <label className="block font-medium mb-1">Club</label>
              <Select value={clubId} onValueChange={setClubId} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select club" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map(club => (
                    <SelectItem key={club.id} value={String(club.id)}>
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">
                Select the club submitting this report
              </p>
            </div>
            {/* Proposal Dropdown */}
            <div>
              <label className="block font-medium mb-1">Proposal</label>
              <Select value={proposalId} onValueChange={setProposalId} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select proposal" />
                </SelectTrigger>
                <SelectContent>
                  {proposals.map(proposal => (
                    <SelectItem key={proposal.id} value={String(proposal.id)}>
                      {proposal.name} ({new Date(proposal.requested_date).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">
                Select the proposal this report is about
              </p>
            </div>
            {/* Report Title */}
            <div>
              <label className="block font-medium mb-1">Report Title</label>
              <Input
                placeholder="Enter report title"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Provide a clear title for your report
              </p>
            </div>
            {/* Participant Count */}
            <div>
              <label className="block font-medium mb-1">
                Participant Count
              </label>
              <Input
                type="number"
                placeholder="Number of participants"
                value={participantCount}
                onChange={(e) => setParticipantCount(e.target.value)}
                required
                min={0}
              />
              <p className="text-xs text-gray-400 mt-1">
                Total number of participants who attended the event
              </p>
            </div>
          </div>
          {/* Report Content */}
          <div>
            <label className="block font-medium mb-1">Report Content</label>
            <Textarea
              placeholder="Provide details about the event..."
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
              required
              minLength={100}
              rows={5}
            />
            <p className="text-xs text-gray-400 mt-1">
              Describe how the event went, activities conducted, and any challenges faced
            </p>
          </div>
          {/* Outcomes & Achievements */}
          <div>
            <label className="block font-medium mb-1">
              Outcomes & Achievements
            </label>
            <Textarea
              placeholder="List the outcomes and achievements of the event..."
              value={outcomes}
              onChange={(e) => setOutcomes(e.target.value)}
              required
              minLength={50}
              rows={3}
            />
            <p className="text-xs text-gray-400 mt-1">
              Describe what was achieved through this event
            </p>
          </div>
          {/* Attachments */}
          <div>
            <label className="block font-medium mb-1">Attachments</label>
            <label
              htmlFor="file-upload"
              className="w-full border-2 border-dashed border-gray-200 rounded-lg py-8 flex flex-col items-center justify-center bg-gray-50 text-center cursor-pointer"
            >
              <FaUpload className="mx-auto text-2xl text-gray-400 mb-2" />
              <p className="text-gray-600 font-medium">
                Click to upload files or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supported formats: PDF, DOCX, JPG, PNG (max 10MB each)
              </p>
              {files.length > 0 && (
                <p className="text-xs text-purple-600 mt-2">
                  {files.length} file{files.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.docx,.jpg,.png"
              onChange={handleFileChange}
            />
            <p className="text-xs text-gray-400 mt-2">
              Upload photos, attendance sheets, or any other relevant documents
            </p>
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </div>
      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Report Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this report? You won't be able to edit it after submission.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium">Club:</span>
              <span className="col-span-2">
                {clubs.find(c => c.id === parseInt(clubId))?.name || "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium">Proposal:</span>
              <span className="col-span-2">
                {proposals.find(p => p.id === parseInt(proposalId))?.name || "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium">Title:</span>
              <span className="col-span-2">{reportTitle}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={confirmSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Confirm Submission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
