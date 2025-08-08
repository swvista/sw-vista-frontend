import React, { useState, useEffect, useMemo } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import PageHeader from "../Components/PageHeader";
import {
  getAllUsers, getME, updateUser, deleteUser, getAllGroups, createGroup, updateGroup, deleteGroup, getAllPermissions, createUser
} from "../utils/authService";
import { toast } from 'react-toastify';

const userCategories = [
    { key: "clubMember", label: "Club Member" },
    { key: "studentCouncil", label: "Student Council" },
    { key: "studentWelfare", label: "Student Welfare" },
    { key: "facultyAdvisor", label: "Faculty Advisor" },
    { key: "securityHead", label: "Security Head" },
  ];
  
  const fieldConfig = {
    name: { label: "Name", source: "user" },
    email: { label: "Email", source: "user" },
    username: { label: "Username", source: "user" },
    password: { label: "Password", source: "user" },
    learner_id: { label: "Learner ID", source: "profile" },
    reg_number: { label: "Registration No.", source: "profile" },
    club_name: { label: "Club Name", source: "profile" },
    designation: { label: "Designation", source: "profile" },
    department: { label: "Department", source: "profile" },
    emp_id: { label: "Employee ID", source: "profile" },
  };
  
  const categoryFields = {
    clubMember: ["name", "email", "username", "password", "learner_id", "reg_number", "club_name"],
    studentCouncil: ["name", "email", "username", "password", "learner_id", "reg_number"],
    facultyAdvisor: ["name", "email", "username", "password", "designation", "department", "emp_id", "club_name"],
    studentWelfare: ["name", "email", "username", "password", "designation", "emp_id"],
    securityHead: ["name", "email", "username", "password", "designation", "emp_id"],
  };
  
  const getInitialFormState = (category) => {
    const state = {};
    categoryFields[category].forEach(field => {
      state[field] = "";
    });
    return state;
  };

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("users");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetContent, setSheetContent] = useState(null); // 'user', 'role'

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  const [loggedInUser, setLoggedInUser] = useState({});

  // Form states
  const [userForm, setUserForm] = useState({ id: null, name: '', email: '', username: '', password: '', groups: [] });
  const [roleForm, setRoleForm] = useState({ id: null, name: '', permissions: [] });
  const [formCategory, setFormCategory] = useState("clubMember");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [meRes, usersRes, rolesRes, permissionsRes] = await Promise.all([
        getME(),
        getAllUsers(),
        getAllGroups(),
        getAllPermissions()
      ]);
      setLoggedInUser(meRes.data);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
      setPermissions(permissionsRes.data);
      if (!selectedRole && rolesRes.data && rolesRes.data.length > 0) {
        setSelectedRole(rolesRes.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to fetch data");
    }
  };

  const permissionOptions = useMemo(() => 
    Array.isArray(permissions) ? permissions.map(p => ({ value: p.id, label: p.name })) : []
  , [permissions]);

  const roleOptions = useMemo(() => 
    Array.isArray(roles) ? roles.map(r => ({ value: r.id, label: r.name })) : []
  , [roles]);

  const openSheet = (type, data = null) => {
    setSheetContent(type);
    if (type === 'user') {
      setUserForm(data ? { ...data, groups: data.groups || [] } : { id: null, name: '', email: '', username: '', password: '', groups: [] });
    } else if (type === 'role') {
      setRoleForm(data ? { ...data, permissions: data.permissions || [] } : { id: null, name: '', permissions: [] });
    }
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setSheetContent(null);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
        const profileData = {};
        const userData = {};
        categoryFields[formCategory].forEach(field => {
            if (fieldConfig[field].source === 'profile') {
                profileData[field] = userForm[field];
            } else {
                userData[field] = userForm[field];
            }
        });

      const payload = { ...userData, profile: profileData, groups: userForm.groups };

      if (userForm.id) {
        delete payload.password; // Do not send password on update
        await updateUser(userForm.id, payload);
        toast.success("User updated successfully!");
      } else {
        await createUser(payload, formCategory);
        toast.success("User created successfully!");
      }
      fetchData();
      closeSheet();
    } catch (error) {
      console.error("User form submission failed:", error);
      toast.error(error.response?.data?.detail || "An error occurred.");
    }
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (roleForm.id) {
        await updateGroup(roleForm.id, roleForm);
        toast.success("Role updated successfully!");
      } else {
        await createGroup(roleForm);
        toast.success("Role created successfully!");
      }
      fetchData();
      closeSheet();
    } catch (error) {
      console.error("Role form submission failed:", error);
      toast.error(error.response?.data?.detail || "An error occurred.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        fetchData();
        toast.success("User deleted successfully!");
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error("Failed to delete user.");
      }
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await deleteGroup(roleId);
        if (selectedRole && selectedRole.id === roleId) {
            setSelectedRole(roles[0] || null);
        }
        fetchData();
        toast.success("Role deleted successfully!");
      } catch (error) {
        console.error("Failed to delete role:", error);
        toast.error("Failed to delete role.");
      }
    }
  };

  const renderUserFormFields = () => {
    return categoryFields[formCategory].map(field => (
        <Input 
            key={field}
            name={field} 
            value={userForm[field] || ''} 
            onChange={(e) => setUserForm({...userForm, [field]: e.target.value})} 
            placeholder={fieldConfig[field].label} 
            required={field !== 'password' && !userForm.id} // Password is not required on edit
            type={field === 'password' ? 'password' : 'text'}
        />
    ));
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-[#faf8ff] min-h-screen">
      <PageHeader user={loggedInUser?.username} />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <TabsList className="py-3 bg-slate-100 shadow-md flex overflow-auto w-full gap-2">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>
          <Button onClick={() => openSheet(activeTab.slice(0, -1))} className="bg-purple-700 hover:bg-purple-600 w-full sm:w-auto">
            <FiPlus size={18} /> Add {activeTab.slice(0, -1)}
          </Button>
        </div>

        <TabsContent value="users">
          <Card>
            <CardHeader><CardTitle>Users</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Roles</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {Array.isArray(users) && users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{Array.isArray(user.groups) ? user.groups.map(g => roles.find(r => r.id === g)?.name).join(', ') : ''}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => openSheet('user', user)}><FiEdit2 size={18} /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} className="text-red-600"><FiTrash2 size={18} /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader><CardTitle>Roles</CardTitle></CardHeader>
                    <CardContent>
                        {Array.isArray(roles) && roles.map(role => (
                            <div key={role.id} onClick={() => setSelectedRole(role)} className={`p-2 rounded-md cursor-pointer ${selectedRole?.id === role.id ? 'bg-slate-200' : 'hover:bg-slate-100'}`}>
                                {role.name}
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>{selectedRole?.name}</CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openSheet('role', selectedRole)}>Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteRole(selectedRole.id)}>Delete</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h3 className="font-semibold mb-2">Permissions</h3>
                        <div className="space-y-1">
                        {selectedRole && Array.isArray(selectedRole.permissions) && selectedRole.permissions.map(pid => {
                            const permission = permissions.find(p => p.id === pid);
                            return <div key={pid} className="p-2 bg-slate-50 rounded-md">{permission?.name}</div>
                        })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader><CardTitle>Permissions</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Permission Name</TableHead><TableHead>Codename</TableHead></TableRow></TableHeader>
                <TableBody>
                  {Array.isArray(permissions) && permissions.map(permission => (
                    <TableRow key={permission.id}>
                      <TableCell>{permission.name}</TableCell>
                      <TableCell>{permission.codename}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
        <SheetContent className="max-w-md w-full px-5">
          <SheetHeader>
            <SheetTitle>{sheetContent === 'user' ? (userForm.id ? 'Edit User' : 'Create User') : (roleForm.id ? 'Edit Role' : 'Create Role')}</SheetTitle>
          </SheetHeader>
          {sheetContent === 'user' && (
            <form onSubmit={handleUserSubmit} className="space-y-4 mt-4">
              <Select onValueChange={setFormCategory} defaultValue={formCategory}>
                <SelectTrigger><SelectValue placeholder="Select user type" /></SelectTrigger>
                <SelectContent>
                  {userCategories.map(cat => <SelectItem key={cat.key} value={cat.key}>{cat.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {renderUserFormFields()}
              <MultiSelect options={roleOptions} value={userForm.groups} onChange={(selected) => setUserForm({...userForm, groups: selected})} placeholder="Select roles" />
              <Button type="submit" className="w-full">{userForm.id ? 'Update' : 'Create'} User</Button>
            </form>
          )}
          {sheetContent === 'role' && (
            <form onSubmit={handleRoleSubmit} className="space-y-4 mt-4">
              <Input name="name" value={roleForm.name} onChange={(e) => setRoleForm({...roleForm, name: e.target.value})} placeholder="Role Name" required />
              <MultiSelect options={permissionOptions} value={roleForm.permissions} onChange={(selected) => setRoleForm({...roleForm, permissions: selected})} placeholder="Select permissions" />
              <Button type="submit" className="w-full">{roleForm.id ? 'Update' : 'Create'} Role</Button>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}






