import React, { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import PageHeader from "../Components/PageHeader";

const userCategories = [
  { key: "clubMember", label: "Club Member" },
  { key: "studentCouncil", label: "Student Council" },
  { key: "studentWelfare", label: "Student Welfare" },
  { key: "facultyAdvisor", label: "Faculty Advisor" },
  { key: "securityHead", label: "Security Head" },
];

const getInitialFormState = (category) => {
  switch (category) {
    case "clubMember":
      return { name: "", learnerId: "", regNumber: "", post: "", clubName: "" };
    case "studentCouncil":
      return { name: "", learnerId: "", regNumber: "", post: "" };
    case "facultyAdvisor":
      return {
        name: "",
        email: "",
        designation: "",
        department: "",
        empId: "",
        clubName: "",
      };
    case "studentWelfare":
    case "securityHead":
      return { name: "", email: "", designation: "", empId: "" };
    default:
      return {};
  }
};

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("clubMember");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formCategory, setFormCategory] = useState("clubMember");
  const [formState, setFormState] = useState(getInitialFormState("clubMember"));
  const [users, setUsers] = useState({
    clubMember: [],
    studentCouncil: [],
    studentWelfare: [],
    facultyAdvisor: [],
    securityHead: [],
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Handle category change in the sheet
  const handleCategoryChange = (value) => {
    setFormCategory(value);
    setFormState(getInitialFormState(value));
    setEditUser(null);
  };

  // Open sheet for add/edit
  const openSheet = (user = null, category = "clubMember") => {
    setEditUser(user);
    setIsSheetOpen(true);
    setFormCategory(user ? user.category : category);
    setFormState(user ? { ...user } : getInitialFormState(category));
  };

  // Close sheet and reset
  const closeSheet = () => {
    setIsSheetOpen(false);
    setEditUser(null);
    setFormCategory("clubMember");
    setFormState(getInitialFormState("clubMember"));
  };

  // Handle Add/Edit form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editUser) {
      setUsers((prev) => ({
        ...prev,
        [formCategory]: prev[formCategory].map((u) =>
          u.id === editUser.id
            ? { ...formState, id: editUser.id, category: formCategory }
            : u
        ),
      }));
    } else {
      setUsers((prev) => ({
        ...prev,
        [formCategory]: [
          ...prev[formCategory],
          { ...formState, id: Date.now().toString(), category: formCategory },
        ],
      }));
    }
    closeSheet();
  };

  // Handle Delete
  const deleteUser = (id, category) => {
    setUsers((prev) => ({
      ...prev,
      [category]: prev[category].filter((user) => user.id !== id),
    }));
  };

  // Render form fields based on formCategory
  function renderFormFields() {
    if (formCategory === "clubMember") {
      return (
        <>
          <Input
            name="name"
            value={formState.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />
          <Input
            name="learnerId"
            value={formState.learnerId}
            onChange={handleInputChange}
            placeholder="Learner ID"
            required
          />
          <Input
            name="regNumber"
            value={formState.regNumber}
            onChange={handleInputChange}
            placeholder="Registration Number"
            required
          />
          <Input
            name="post"
            value={formState.post}
            onChange={handleInputChange}
            placeholder="Post"
            required
          />
          <Input
            name="clubName"
            value={formState.clubName}
            onChange={handleInputChange}
            placeholder="Club Name"
            required
          />
        </>
      );
    }
    if (formCategory === "studentCouncil") {
      return (
        <>
          <Input
            name="name"
            value={formState.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />
          <Input
            name="learnerId"
            value={formState.learnerId}
            onChange={handleInputChange}
            placeholder="Learner ID"
            required
          />
          <Input
            name="regNumber"
            value={formState.regNumber}
            onChange={handleInputChange}
            placeholder="Registration Number"
            required
          />
          <Input
            name="post"
            value={formState.post}
            onChange={handleInputChange}
            placeholder="Post"
            required
          />
        </>
      );
    }
    if (formCategory === "facultyAdvisor") {
      return (
        <>
          <Input
            name="name"
            value={formState.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />
          <Input
            name="email"
            value={formState.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <Input
            name="designation"
            value={formState.designation}
            onChange={handleInputChange}
            placeholder="Designation"
            required
          />
          <Input
            name="department"
            value={formState.department}
            onChange={handleInputChange}
            placeholder="Department"
            required
          />
          <Input
            name="empId"
            value={formState.empId}
            onChange={handleInputChange}
            placeholder="Employee ID"
            required
          />
          <Input
            name="clubName"
            value={formState.clubName}
            onChange={handleInputChange}
            placeholder="Club Name"
            required
          />
        </>
      );
    }
    if (formCategory === "studentWelfare" || formCategory === "securityHead") {
      return (
        <>
          <Input
            name="name"
            value={formState.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />
          <Input
            name="email"
            value={formState.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <Input
            name="designation"
            value={formState.designation}
            onChange={handleInputChange}
            placeholder="Designation"
            required
          />
          <Input
            name="empId"
            value={formState.empId}
            onChange={handleInputChange}
            placeholder="Employee ID"
            required
          />
        </>
      );
    }
    return null;
  }

  // Render table headers based on category
  function renderTableHeaders(category) {
    if (category === "clubMember") {
      return (
        <>
          <TableHead>Name</TableHead>
          <TableHead>Learner ID</TableHead>
          <TableHead>Registration No.</TableHead>
          <TableHead>Post</TableHead>
          <TableHead>Club Name</TableHead>
          <TableHead>Actions</TableHead>
        </>
      );
    }
    if (category === "studentCouncil") {
      return (
        <>
          <TableHead>Name</TableHead>
          <TableHead>Learner ID</TableHead>
          <TableHead>Registration No.</TableHead>
          <TableHead>Post</TableHead>
          <TableHead>Actions</TableHead>
        </>
      );
    }
    if (category === "facultyAdvisor") {
      return (
        <>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Designation</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Employee ID</TableHead>
          <TableHead>Club Name</TableHead>
          <TableHead>Actions</TableHead>
        </>
      );
    }
    if (category === "studentWelfare" || category === "securityHead") {
      return (
        <>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Designation</TableHead>
          <TableHead>Employee ID</TableHead>
          <TableHead>Actions</TableHead>
        </>
      );
    }
    return null;
  }

  // Render table rows for a category
  function renderTableRows(category) {
    return users[category].map((user) => (
      <TableRow key={user.id} className="border-none font-medium">
        {category === "clubMember" && (
          <>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.learnerId}</TableCell>
            <TableCell>{user.regNumber}</TableCell>
            <TableCell>{user.post}</TableCell>
            <TableCell>{user.clubName}</TableCell>
          </>
        )}
        {category === "studentCouncil" && (
          <>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.learnerId}</TableCell>
            <TableCell>{user.regNumber}</TableCell>
            <TableCell>{user.post}</TableCell>
          </>
        )}
        {category === "facultyAdvisor" && (
          <>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.designation}</TableCell>
            <TableCell>{user.department}</TableCell>
            <TableCell>{user.empId}</TableCell>
            <TableCell>{user.clubName}</TableCell>
          </>
        )}
        {(category === "studentWelfare" || category === "securityHead") && (
          <>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.designation}</TableCell>
            <TableCell>{user.empId}</TableCell>
          </>
        )}
        <TableCell>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openSheet(user, category)}
          >
            <FiEdit2 size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteUser(user.id, category)}
          >
            <FiTrash2 size={18} />
          </Button>
        </TableCell>
      </TableRow>
    ));
  }

  // When tab changes, update activeTab
  const handleTabChange = (type) => {
    setActiveTab(type);
  };

  return (
    <div className="p-10 bg-[#faf8ff] min-h-screen">
      <PageHeader user="Username" />
      <div className="flex justify-between mb-6">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="py-5 px-1 bg-slate-100">
            {userCategories.map((type) => (
              <TabsTrigger
                key={type.key}
                value={type.key}
                className="rounded-sm p-4"
              >
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button
          onClick={() => openSheet(null, activeTab)}
          className="ml-4 flex items-center gap-2"
        >
          <FiPlus size={18} /> Add User
        </Button>
      </div>

      <Tabs value={activeTab}>
        {userCategories.map((type) => (
          <TabsContent key={type.key} value={type.key}>
            <Table className="bg-white p-2 rounded-md">
              <TableHeader>
                <TableRow className="border-gray-200">
                  {renderTableHeaders(type.key)}
                </TableRow>
              </TableHeader>
              <TableBody>{renderTableRows(type.key)}</TableBody>
            </Table>
          </TabsContent>
        ))}
      </Tabs>

      <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
        <SheetContent side="right" className="max-w-md w-full px-5">
          <SheetHeader>
            <SheetTitle>
              {editUser ? "Edit User" : "Create New User"}
            </SheetTitle>
          </SheetHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block mb-1 font-medium">User Category</label>
              <Select
                value={formCategory}
                onValueChange={handleCategoryChange}
                disabled={!!editUser}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {userCategories.map((cat) => (
                    <SelectItem key={cat.key} value={cat.key}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {renderFormFields()}
            <Button type="submit" className="w-full">
              {editUser ? "Update" : "Create"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
