import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUser, getAllUsers, getME, updateUser, deleteUser, getAllClubs } from "../utils/authService";
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

// Custom hook for responsive Sheet side
function useMobileSheetSide() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile ? "bottom" : "right";
}

const userCategories = [
  { key: "clubMember", label: "Club Member", roleId: 4 },
  { key: "studentCouncil", label: "Student Council", roleId: 5 },
  { key: "studentWelfare", label: "Student Welfare", roleId: 6 },
  { key: "facultyAdvisor", label: "Faculty Advisor", roleId: 7 },
  { key: "securityHead", label: "Security Head", roleId: 8 },
];

const fieldConfig = {
  name: { label: "Name", source: "user" },
  email: { label: "Email", source: "user" },
  learner_id: { label: "Learner ID", source: "profile" },
  reg_number: { label: "Registration No.", source: "profile" },
  club_name: { label: "Club Name", source: "profile" },
  post: { label: "Post", source: "profile" }, // <-- Added
  designation: { label: "Designation", source: "profile" },
  department: { label: "Department", source: "profile" },
  emp_id: { label: "Employee ID", source: "profile" },
};

const categoryFields = {
  clubMember: ["name", "email", "learner_id","post", "reg_number", "club_name"], // <-- Added post here
  studentCouncil: ["name", "email", "learner_id", "reg_number"],
  facultyAdvisor: ["name", "email", "designation", "department", "emp_id", "club_name"],
  studentWelfare: ["name", "email", "designation", "emp_id"],
  securityHead: ["name", "email", "designation", "emp_id"],
};


const getInitialFormState = (category) => {
  const state = {};
  categoryFields[category].forEach(field => {
    state[field] = "";
  });
  return state;
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
  const [clubs, setClubs] = useState([]); // <-- NEW
  const [clubsList, setClubsList] = useState([]);
  const sheetSide = useMobileSheetSide();
  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchClubs();
  }, []);

  const fetchUsers = async () => {
    try {
      const me = await getME();
      setLoggedInUser(me.data);
      const data = await getAllUsers();
      const categorized = userCategories.reduce((acc, cat) => {
        acc[cat.key] = data
          .filter(u => u.role?.name === cat.key)
          .map(u => ({ ...u, profile: u.profile || {} }));
        return acc;
      }, {});
      setUsers(categorized);
    } catch (error) {
      console.error("Failed to fetch users:", error?.response?.data || error?.message || error);
    }
  };

  // Fetch clubs for dropdown
  const fetchClubs = async () => {
    try {
      const data = await getAllClubs();
      console.log("Fetched clubs:", data);
      setClubs(data);
      setClubsList(data.map(club => ({ value: club.name, label: club.name })));
    } catch (err) {
      setClubs([]);
    }
  };

  const handleInputChange = (e) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategoryChange = (value) => {
    setFormCategory(value);
    setFormState(getInitialFormState(value));
  };

  const openSheet = (user = null, category = "clubMember") => {
    setEditUser(user);
    setFormCategory(category);
    if (user) {
      const filled = getInitialFormState(category);
      categoryFields[category].forEach(field => {
        if (fieldConfig[field].source === "profile") {
          filled[field] = user.profile?.[field] || "";
        } else {
          filled[field] = user[field] || "";
        }
      });
      setFormState(filled);
    } else {
      setFormState(getInitialFormState(category));
    }
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setEditUser(null);
    setFormCategory("clubMember");
    setFormState(getInitialFormState("clubMember"));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const missing = categoryFields[formCategory].filter(f => !formState[f]);
    if (missing.length) {
      return alert(`Missing required fields: ${missing.join(", ")}`);
    }
    try {
      const roleId = userCategories.find(cat => cat.key === formCategory)?.roleId;
      const payload = {
        id: editUser?.id,
        username: formState.name.toLowerCase().replace(/\s/g, ""),
        name: formState.name,
        email: formState.email,
        role: roleId,
        profile: extractProfile(formState, formCategory),
      };
      if (!editUser) {
        payload.password = "test1234";
      }
      if (editUser) {
        await updateUser(payload, formCategory);
        alert('User updated successfully!');
      } else {
        await createUser(payload, formCategory);
        alert('User created successfully!');
      }
      await fetchUsers();
      closeSheet();
    } catch (err) {
      console.error("Operation failed:", err.response?.data || err.message);
      alert(`Failed to ${editUser ? 'update' : 'create'} user. Check console for details.`);
    }
  };

  const extractProfile = (state, category) => {
    const profile = {};
    categoryFields[category].forEach(field => {
      if (fieldConfig[field].source === "profile") {
        profile[field] = state[field];
      }
    });
    return profile;
  };

  const handleDelete = async (user, category) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await deleteUser(user);
        setUsers(prev => ({
          ...prev,
          [category]: prev[category].filter(u => u.id !== user.id)
        }));
        alert('User deleted successfully!');
      } catch (err) {
        console.error("Delete failed:", err.response?.data || err.message);
        alert("Failed to delete user. Check console for details.");
      }
    }
  };

  // Render form fields
  const renderFormFields = () => {
  return categoryFields[formCategory].map(field => {
    if (field === "club_name") {
      return (
        <div key={field}>
          <label className="block font-medium mb-1">Club</label>
          <Select
            value={formState[field] || ""}
            onValueChange={val =>
              setFormState(prev => ({ ...prev, [field]: val }))
            }
          >
            <SelectTrigger>
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
        </div>
      );
    }
    // Default input for other fields
    return (
      <Input
        key={field}
        name={field}
        value={formState[field] || ""}
        onChange={handleInputChange}
        placeholder={fieldConfig[field].label}
        required
        className="w-full"
      />
    );
  });
};


  // Render table headers
  const renderTableHeaders = (category) => (
    <>
      {categoryFields[category].map(field => (
        <TableHead key={field}>{fieldConfig[field].label}</TableHead>
      ))}
      <TableHead>Actions</TableHead>
    </>
  );

  // Render table rows
  const renderTableRows = (category) => (
    users[category]?.map(user => (
      <TableRow key={user.id}>
        {categoryFields[category].map(field => {
          const value = fieldConfig[field].source === "profile"
            ? user.profile?.[field] || "-"
            : user[field] || "-";
          return <TableCell key={field}>{value}</TableCell>;
        })}
        <TableCell>
          <Button variant="ghost" size="icon" onClick={() => openSheet(user, category)}>
            <FiEdit2 size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(user, category)}
            className="text-red-600 hover:text-red-800"
          >
            <FiTrash2 size={18} />
          </Button>
        </TableCell>
      </TableRow>
    ))
  );

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-[#faf8ff] min-h-screen">
      <PageHeader user={loggedInUser?.username} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="py-3 bg-slate-100 shadow-md flex overflow-auto w-full gap-2">
            {userCategories.map(type => (
              <TabsTrigger key={type.key} value={type.key}>{type.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button onClick={() => openSheet(null, activeTab)} className="bg-purple-700 hover:bg-purple-600 w-full sm:w-auto">
          <FiPlus size={18} /> Add User
        </Button>
      </div>

      <Tabs value={activeTab}>
        {userCategories.map(type => (
          <TabsContent key={type.key} value={type.key}>
            <Table className="bg-white rounded-md">
              <TableHeader>
                <TableRow>
                  {renderTableHeaders(type.key)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableRows(type.key)}
              </TableBody>
            </Table>
          </TabsContent>
        ))}
      </Tabs>

      <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
        <SheetContent side={sheetSide} className="max-w-md w-full px-5">
          <SheetHeader>
            <SheetTitle>{editUser ? "Edit User" : "Create New User"}</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
            <label className="block font-medium">User Category</label>
            <Select
              value={formCategory}
              onValueChange={handleCategoryChange}
              disabled={!!editUser}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {userCategories.map(cat => (
                  <SelectItem key={cat.key} value={cat.key}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {renderFormFields()}
            <Button type="submit" className="w-full">
              {editUser ? "Update User" : "Create User"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
