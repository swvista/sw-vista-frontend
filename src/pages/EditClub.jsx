import { useState } from "react";
import { Pencil, UserPlus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import PageHeader from "../Components/PageHeader";

const initialMembers = [
  {
    id: "1",
    name: "John Doe",
    registration: "REG001",
    department: "Computer Science",
    role: "President",
    email: "john.doe@example.com",
  },
  {
    id: "2",
    name: "Jane Smith",
    registration: "REG002",
    department: "Electronics",
    role: "Secretary",
    email: "jane.smith@example.com",
  },
  {
    id: "3",
    name: "Mike Johnson",
    registration: "REG003",
    department: "Mechanical",
    role: "Treasurer",
    email: "mike.johnson@example.com",
  },
];

export default function EditPage() {
  const [banner, setBanner] = useState("");
  const [clubName, setClubName] = useState("Robotics Club");
  const [description, setDescription] = useState(
    "A club dedicated to building and programming robots for various competitions and showcases."
  );
  const [president, setPresident] = useState("John Doe");
  const [facultyAdvisor, setFacultyAdvisor] = useState("Dr. Smith");
  const [clubType, setClubType] = useState("technical");
  const [members, setMembers] = useState(initialMembers);

  // For add/edit member form
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState({
    name: "",
    registration: "",
    department: "",
    role: "",
    email: "",
  });

  // Banner upload handler
  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setBanner(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Open add member form
  const handleAddMember = () => {
    setEditingMember(null);
    setMemberForm({
      name: "",
      registration: "",
      department: "",
      role: "",
      email: "",
    });
    setShowMemberForm(true);
  };

  // Open edit member form
  const handleEditMember = (member) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      registration: member.registration,
      department: member.department,
      role: member.role,
      email: member.email,
    });
    setShowMemberForm(true);
  };

  // Handle member form input changes
  const handleMemberFormChange = (field, value) => {
    setMemberForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add or update member
  const handleMemberFormSubmit = (e) => {
    e.preventDefault();
    if (
      !memberForm.name ||
      !memberForm.registration ||
      !memberForm.department ||
      !memberForm.role ||
      !memberForm.email
    ) {
      return; // You can add validation/toast here
    }
    if (editingMember) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id ? { ...m, ...memberForm } : m
        )
      );
    } else {
      setMembers((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2, 9),
          ...memberForm,
        },
      ]);
    }
    setShowMemberForm(false);
    setEditingMember(null);
    setMemberForm({
      name: "",
      registration: "",
      department: "",
      role: "",
      email: "",
    });
  };

  // Delete member
  const handleDeleteMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Cancel form
  const handleCancelForm = () => {
    setShowMemberForm(false);
    setEditingMember(null);
    setMemberForm({
      name: "",
      registration: "",
      department: "",
      role: "",
      email: "",
    });
  };

  return (
    <div className="bg-[#fcfbff] min-h-screen md:px-0">
      <div className="p-10 mx-auto space-y-8">
        <PageHeader user={"Username"}/>

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Edit Club Details</h1>
          <p className="text-gray-500 mt-1">
            Update your club information and manage members
          </p>
        </div>

        {/* Club Banner */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Club Banner</h2>
          <div className="relative h-32 md:h-40 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
            {banner ? (
              <img
                src={banner}
                alt="Club Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7M3 7a4 4 0 014-4h10a4 4 0 014 4M3 7h18"
                  />
                </svg>
                <span className="text-gray-400 text-sm mt-2">
                  No banner uploaded
                </span>
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <span className="bg-white px-3 py-1 rounded text-sm flex items-center gap-2 shadow">
                <Pencil className="h-4 w-4" />
                Change Banner
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerChange}
              />
            </label>
          </div>
        </div>

        {/* Club Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Club Information</h2>
          <form className="space-y-6">
            <div>
              <label className="block font-medium mb-1">Club Name</label>
              <Input
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder="Enter club name"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your club"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-1">President Name</label>
                <Input
                  value={president}
                  onChange={(e) => setPresident(e.target.value)}
                  placeholder="Enter president name"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Faculty Advisor
                </label>
                <Input
                  value={facultyAdvisor}
                  onChange={(e) => setFacultyAdvisor(e.target.value)}
                  placeholder="Enter faculty advisor name"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Club Type</label>
              <Select value={clubType} onValueChange={setClubType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select club type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              className="mt-2 bg-purple-600 hover:bg-purple-700 text-white"
            >
              Save Club Details
            </Button>
          </form>
        </div>

        {/* Club Members */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Club Members</h2>
            <Button
              variant="outline"
              className="bg-purple-600 hover:text-white text-white cursor-pointer hover:bg-purple-700"
              onClick={handleAddMember}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
          {/* Add/Edit Member Form */}
          {showMemberForm && (
            <form
              onSubmit={handleMemberFormSubmit}
              className="bg-[#fcfbff] border border-gray-200 rounded-xl p-6 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-1">Name</label>
                  <Input
                    value={memberForm.name}
                    onChange={(e) =>
                      handleMemberFormChange("name", e.target.value)
                    }
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Registration Number
                  </label>
                  <Input
                    value={memberForm.registration}
                    onChange={(e) =>
                      handleMemberFormChange("registration", e.target.value)
                    }
                    placeholder="Enter registration number"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Department</label>
                  <Input
                    value={memberForm.department}
                    onChange={(e) =>
                      handleMemberFormChange("department", e.target.value)
                    }
                    placeholder="Enter department"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Role</label>
                  <Input
                    value={memberForm.role}
                    onChange={(e) =>
                      handleMemberFormChange("role", e.target.value)
                    }
                    placeholder="Enter role"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block font-medium mb-1">Email</label>
                <Input
                  value={memberForm.email}
                  onChange={(e) =>
                    handleMemberFormChange("email", e.target.value)
                  }
                  placeholder="Enter email"
                />
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {editingMember ? "Update Member" : "Add Member"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelForm}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2 px-4 text-left font-medium">Name</th>
                  <th className="py-2 px-4 text-left font-medium">
                    Registration
                  </th>
                  <th className="py-2 px-4 text-left font-medium">
                    Department
                  </th>
                  <th className="py-2 px-4 text-left font-medium">Role</th>
                  <th className="py-2 px-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-gray-300 hover:bg-gray-50"
                  >
                    <td className="py-2 px-4">{member.name}</td>
                    <td className="py-2 px-4">{member.registration}</td>
                    <td className="py-2 px-4">{member.department}</td>
                    <td className="py-2 px-4">{member.role}</td>
                    <td className="py-2 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditMember(member)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
