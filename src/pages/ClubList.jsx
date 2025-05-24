import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MoreVertical } from "lucide-react";
import { FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import PageHeader from "../Components/PageHeader";
import { useNavigate } from "react-router-dom";

export default function ClubList() {
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const navigate = useNavigate();

  // Mock data - replace with your actual data source
  const clubs = [
    {
      id: "1",
      name: "Tech Innovators",
      type: "technical",
      memberCount: 45,
      totalEvents: 12,
      facultyAdvisor: "Dr. Smith",
      president: "John Doe",
    },
    {
      id: "1",
      name: "Tech Innovators",
      type: "technical",
      memberCount: 45,
      totalEvents: 12,
      facultyAdvisor: "Dr. Smith",
      president: "John Doe",
    },
    // Add more clubs...
  ];

  // Filtered clubs
  const filteredClubs = clubs.filter((club) => {
    const matchesSearch = [club.name, club.president, club.facultyAdvisor].some(
      (field) => field.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesType = selectedType === "all" || club.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4 p-10 max-sm:p-5 bg-[#faf8ff] min-h-screen rounded">
      {/* Header */}
      <PageHeader user="Username" />
      {/* Venues Title and Filters */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Clubs</h2>
        <p className="text-gray-500 capitalize">View and manage all clubs</p>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4  w-full">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="🔍 Search venues by name or location..."
              className="w-full border-gray-300 bg-white"
            />
          </div>
          <div className="flex gap-2">
            <Select className="">
              <SelectTrigger className="w-[140px] border-gray-300 bg-white">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ToggleGroup
          type="single"
          value={viewMode}
          className="border border-gray-300 cursor-pointer"
          onValueChange={(value) => setViewMode(value)}
        >
          <ToggleGroupItem value="table" aria-label="Table view">
            Table
          </ToggleGroupItem>
          <ToggleGroupItem value="card" aria-label="Card view">
            Cards
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Content */}
      {viewMode === "table" ? (
        <Table className="bg-white p-5 rounded-md">
          <TableHeader>
            <TableRow className="border-gray-300">
              <TableHead>Club Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Faculty Advisor</TableHead>
              <TableHead>President</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border-gray-200">
            {filteredClubs.map((club) => (
              <TableRow
                key={club.id}
                className="border-gray-200 text-gray-600 hover:text-black"
              >
                <TableCell className="font-medium">{club.name}</TableCell>
                <TableCell>{club.type}</TableCell>
                <TableCell>{club.memberCount}</TableCell>
                <TableCell>{club.totalEvents}</TableCell>
                <TableCell>{club.facultyAdvisor}</TableCell>
                <TableCell>{club.president}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={()=>{navigate("/editclub")}}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={()=>{navigate("/editclub")}}>Manage</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col max-w-xs">
            {/* Venue Image and Status */}
            <div className="relative h-48 w-full">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                alt="Main Auditorium"
                className="object-cover h-full w-full"
              />
            </div>
            {/* Venue Info */}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg">Cultural Club</h3>
              <div className="flex items-center text-gray-500 font-medium text-sm mt-1 gap-2">
                <FaMapMarkerAlt className="inline mr-1" />
                FA - Mr. Smith
              </div>
              <div className="flex items-center text-gray-700 font-medium text-sm gap-2 mt-1">
                <FaUsers className="inline mr-1" />
                President - Rohit Raj
              </div>
              <div className="flex items-center text-gray-700 font-medium text-sm gap-2 mt-1">
                <FaUsers className="inline mr-1" />
                Members: 15
              </div>
              {/* Features */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-gray-100 text-gray-700 font-medium text-xs px-2 py-1 rounded-full">
                  Technical
                </span>
              </div>
              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-200 rounded-sm"
                  onClick={()=>{navigate("/editclub")}}
                >
                  Manage
                </Button>
                <Button className="flex-1 rounded-sm bg-purple-600 hover:bg-purple-700 text-white"
                onClick={()=>{navigate("/clubDetails")}}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
