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
import { useState } from "react";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import PageHeader from "../../Components/PageHeader";

export default function SubmitReportPage() {
  const [club, setClub] = useState("Cultural Club");
  const [event, setEvent] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [participantCount, setParticipantCount] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [outcomes, setOutcomes] = useState("");
  // File upload logic can be added as needed

  return (
    <div className="min-h-screen bg-[#fcfbff] p-10">
      {/* Header */}
      <PageHeader user="Username"/>
      {/* Back Button */}
      <Button
        variant="outline"
        className="mb-6 flex items-center gap-2 px-4 py-2"
      >
        <FaArrowLeft className="text-base" />
        Back
      </Button>

      {/* Main Card */}
      <div className="mx-auto bg-white rounded-xl border border-gray-100 p-8">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-1">Submit Event Report</h2>
        <p className="text-gray-500 mb-8">
          Report the outcomes of your club's event
        </p>

        {/* Form */}
        <form className="space-y-6">
          {/* Two-column section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <p className="text-xs text-gray-400 mt-1">
                Select the club submitting this report
              </p>
            </div>
            {/* Event */}
            <div>
              <label className="block font-medium mb-1">Event</label>
              <Select value={event} onValueChange={setEvent}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual Fest">Annual Fest</SelectItem>
                  <SelectItem value="Workshop 2025">Workshop 2025</SelectItem>
                  <SelectItem value="Sports Day">Sports Day</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">
                Select the event this report is about
              </p>
            </div>
            {/* Report Title */}
            <div>
              <label className="block font-medium mb-1">Report Title</label>
              <Input
                placeholder="Enter report title"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
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
            />
            <p className="text-xs text-gray-400 mt-1">
              Describe how the event went, activities conducted, and any
              challenges faced
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
                Supported formats: PDF, DOCX, JPG, PNG (max 10MB)
              </p>
            </label>

            <input
              id="file-upload"
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.docx,.jpg,.png"
            />

            <p className="text-xs text-gray-400 mt-2">
              Upload photos, attendance sheets, or any other relevant documents
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              Submit Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
