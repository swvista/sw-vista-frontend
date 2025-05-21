import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdHistory } from "react-icons/md";
import PageHeader from "../Components/PageHeader";

export default function ClubDetails() {
  const members = [
    {
      name: "Alice Johnson",
      regNo: "MAHE2025001",
      department: "Mechanical Engineering",
      post: "President",
    },
    {
      name: "Bob Smith",
      regNo: "MAHE2025002",
      department: "Electrical Engineering",
      post: "Vice President",
    },
    {
      name: "Carol Lee",
      regNo: "MAHE2025003",
      department: "Computer Science",
      post: "Secretary",
    },
    {
      name: "David Kim",
      regNo: "MAHE2025004",
      department: "Civil Engineering",
      post: "Treasurer",
    },
    {
      name: "Eva Brown",
      regNo: "MAHE2025005",
      department: "Electronics",
      post: "Member",
    },
    {
      name: "Frank Green",
      regNo: "MAHE2025006",
      department: "Aerospace",
      post: "Member",
    },
  ];

  return (
    <div className="bg-[#faf8ff] min-h-screen p-10">
      {/* Header */}
      <PageHeader user={"Username"}/>

      <div className=" mx-auto bg-white rounded-lg shadow-sm p-6">
        {/* Banner */}
        <div className="bg-gray-200 rounded-lg h-64 w-full mb-6" />

        {/* Club Name, Edit */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Team Manipal Racing</h2>
          <div>
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-primary px-2 py-1 h-auto cursor-pointer"
            >
              <MdHistory className="w-4 h-4 mr-1" />
              Booking History
            </Button>

            <Button
              variant="ghost"
              className="text-gray-500 hover:text-primary px-2 py-1 h-auto cursor-pointer"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="text-sm text-gray-700 mb-2">
          Body text for your whole article or post. We’ll put in some lorem
          ipsum to show how a filled-out page might look:
        </div>
        <div className="text-sm text-gray-600 mb-6">
          Excepteur efficient emerging, minim veniam anim aute carefully curated
          Ginza conversation exquisite perfect nostrud nisi intricate Content.
          Qui international first-class nulla ut. Punctual adipisicing,
          essential lovely queen tempor eiusmod irure. Exklusive izakaya
          charming Scandinavian impeccable aute quality of life soft power
          pariatur Melbourne occaecat discerning. Qui wardrobe aliquip, et
          Porter destination Toto remarkable officia Helsinki excepteur Basset
          hound. Zürich sleepy perfect consectetur.
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-8">
          <div>
            <div className="text-gray-500">Faculty Advisor</div>
            <div className="font-medium text-gray-900">Mr. Random Name</div>
          </div>
          <div>
            <div className="text-gray-500">President</div>
            <div className="font-medium text-gray-900">Mr. Random Name</div>
          </div>
          <div>
            <div className="text-gray-500">Details Last Updated</div>
            <div className="font-medium text-gray-900">05/01/2025</div>
          </div>
          <div>
            <div className="text-gray-500">Club Type</div>
            <div className="font-medium text-gray-900">Technical</div>
          </div>
        </div>

        {/* Members Section */}
        <Table className="bg-white p-5 rounded-md mt-6">
          <TableHeader>
            <TableRow className="border-gray-300">
              <TableHead>Member Name</TableHead>
              <TableHead>Registration Number</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Post</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border-gray-200">
            {members.map((member, idx) => (
              <TableRow
                key={idx}
                className="border-gray-200 text-gray-600 hover:text-black"
              >
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.regNo}</TableCell>
                <TableCell>{member.department}</TableCell>
                <TableCell>{member.post}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
