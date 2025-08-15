import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FiPlus, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import PageHeader from "../Components/PageHeader";
import {
  getAllUsers, getME, updateUser, deleteUser, getAllGroups, updateGroup, getAllPermissions, createUser, getAllClubs, createGroup
} from "../utils/authService";
import { toast } from 'react-toastify';

// --- Component for User Details View ---
const UserDetailView = ({ user, allRoles, allClubs, allPermissions, onBack, onUserUpdate, onRolesUpdated, categoryFields, fieldConfig }) => {
    const [activeTab, setActiveTab] = useState('details');
    const [formData, setFormData] = useState(null);
    const [initialFormData, setInitialFormData] = useState(null);
    const [userEffectivePermissions, setUserEffectivePermissions] = useState(new Set());
    const [initialEffectivePermissions, setInitialEffectivePermissions] = useState(new Set());
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (user) {
            const [firstName, ...lastNameParts] = user.name ? user.name.split(' ') : ['', ''];
            const lastName = lastNameParts.join(' ');

            const initialData = {
                ...JSON.parse(JSON.stringify(user)),
                first_name: user.first_name || firstName,
                last_name: user.last_name || lastName,
            };
            setFormData(initialData);
            setInitialFormData(initialData);
        }
    }, [user]);

    useEffect(() => {
        if (formData && formData.groups && allRoles.length > 0) {
            const effectivePerms = new Set();
            formData.groups.forEach(groupId => {
                const role = allRoles.find(r => r.id === groupId);
                if (role && role.permissions) {
                    role.permissions.forEach(permId => effectivePerms.add(permId));
                }
            });
            setUserEffectivePermissions(effectivePerms);

            if (!initialEffectivePermissions.size) {
                 setInitialEffectivePermissions(effectivePerms);
            }
        }
    }, [formData, allRoles, initialEffectivePermissions.size]);

    useEffect(() => {
        if (formData && initialFormData) {
            const detailsChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData);
            const permissionsChanged = JSON.stringify(Array.from(userEffectivePermissions).sort()) !== JSON.stringify(Array.from(initialEffectivePermissions).sort());
            setIsDirty(detailsChanged || permissionsChanged);
        }
    }, [formData, initialFormData, userEffectivePermissions, initialEffectivePermissions]);

    const handleInputChange = (e, source = 'user') => {
        const { name, value } = e.target;
        setFormData(prev => {
            if (source === 'profile') {
                return { ...prev, profile: { ...(prev.profile || {}), [name]: value } };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleCheckboxChange = (name, checked) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleClubChange = (clubId) => {
        setFormData(prev => ({ ...prev, profile: { ...(prev.profile || {}), club: clubId } }));
    };

    const handleSave = async () => {
        try {
            const { name, password, profile, ...userData } = formData;
            const userPayload = { ...userData, profile, groups: formData.groups };

            const updatedUserRes = await updateUser(user.id, userPayload);

            toast.success("User details updated successfully!");

            const fullNewName = `${formData.first_name || ''} ${formData.last_name || ''}`.trim();
            const finalUpdatedUser = { ...updatedUserRes.data, name: fullNewName };

            onUserUpdate(finalUpdatedUser);
            setInitialFormData(formData);
            setInitialEffectivePermissions(new Set(userEffectivePermissions));
            setIsDirty(false);

        } catch (error) {
            console.error("Failed to update user:", error);
            toast.error(error.response?.data?.detail || "Failed to update user.");
        }
    };

    const roleNameToCategoryKey = (name) => {
        if (!name) return '';
        return name.charAt(0).toLowerCase() + name.slice(1).replace(/\s+/g, '');
    };

    const visibleProfileFields = useMemo(() => {
        const fields = new Set();
        if (!formData || !formData.groups || !allRoles.length || !categoryFields) return [];

        const userRoleNames = formData.groups.map(groupId => {
            const role = allRoles.find(r => r.id === groupId);
            return role ? role.name : null;
        }).filter(Boolean);

        userRoleNames.forEach(roleName => {
            const categoryKey = roleNameToCategoryKey(roleName);
            const fieldsForRole = categoryFields[categoryKey];
            if (fieldsForRole) {
                fieldsForRole.forEach(fieldKey => {
                    if (fieldConfig[fieldKey]?.source === 'profile') {
                        fields.add(fieldKey);
                    }
                });
            }
        });
        return Array.from(fields);
    }, [formData, allRoles, categoryFields, fieldConfig]);

    const DetailInput = ({ label, name, value, source = 'user', type = 'text', placeholder = '' }) => (
        <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor={name} className="text-right">{label}</Label>
            <Input id={name} name={name} value={value || ''} onChange={(e) => handleInputChange(e, source)} className="col-span-2" type={type} placeholder={placeholder} />
        </div>
    );

    if (!formData) return <div>Loading...</div>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack}><FiArrowLeft size={20} /></Button>
                    <h2 className="text-xl font-semibold">{`${formData.first_name} ${formData.last_name}`}</h2>
                </div>
                {isDirty && <Button onClick={handleSave}>Save</Button>}
            </CardHeader>
            <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="details">User Details</TabsTrigger>
                        <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
                        <TabsTrigger value="more-info">More Info</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="pt-4">
                        <div className="space-y-4 max-w-md">
                            <DetailInput label="First Name" name="first_name" value={formData.first_name} />
                            <DetailInput label="Last Name" name="last_name" value={formData.last_name} />
                            <DetailInput label="Email" name="email" value={formData.email} type="email" />
                            <DetailInput label="Username" name="username" value={formData.username} />

                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label className="text-right">Access</Label>
                                <div className="col-span-2 flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="is_active" name="is_active" checked={!!formData.is_active} onCheckedChange={(checked) => handleCheckboxChange('is_active', checked)} />
                                        <Label htmlFor="is_active" className="font-normal">Active</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="is_staff" name="is_staff" checked={!!formData.is_staff} onCheckedChange={(checked) => handleCheckboxChange('is_staff', checked)} />
                                        <Label htmlFor="is_staff" className="font-normal">Staff</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="is_superuser" name="is_superuser" checked={!!formData.is_superuser} onCheckedChange={(checked) => handleCheckboxChange('is_superuser', checked)} />
                                        <Label htmlFor="is_superuser" className="font-normal">Superuser</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 items-center gap-4 pt-4 border-t">
                                <Label className="text-right">Date Joined</Label>
                                <p className="col-span-2 text-sm text-gray-500">{formData.date_joined ? new Date(formData.date_joined).toLocaleString() : 'N/A'}</p>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label className="text-right">Last Login</Label>
                                <p className="col-span-2 text-sm text-gray-500">{formData.last_login ? new Date(formData.last_login).toLocaleString() : 'Never'}</p>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="roles" className="pt-4">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Assigned Roles</h3>
                                <MultiSelect
                                    options={allRoles.map(r => ({ value: r.id, label: r.name }))}
                                    value={formData.groups || []}
                                    onChange={(selected) => setFormData(prev => ({ ...prev, groups: selected }))}
                                    placeholder="Select roles"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Effective Permissions</h3>
                                <p className="text-sm text-gray-500 mb-4">Permissions are inherited from the roles above. Changing roles will update these permissions.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {allPermissions.map(permission => (
                                        <div key={permission.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`perm-${permission.id}`}
                                                checked={userEffectivePermissions.has(permission.id)}
                                                disabled
                                            />
                                            <Label htmlFor={`perm-${permission.id}`} className="font-normal text-gray-600">{permission.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="more-info" className="pt-4">
                        {formData.profile ? (
                             <div className="space-y-4 max-w-md">
                                {visibleProfileFields.length > 0 ? visibleProfileFields.map(fieldKey => {
                                    const config = fieldConfig[fieldKey];
                                    if (fieldKey === 'club') {
                                        return (
                                            <div key={fieldKey} className="grid grid-cols-3 items-center gap-4">
                                                <Label className="text-right">Club</Label>
                                                <Select onValueChange={handleClubChange} value={formData.profile.club?.toString() || ''}>
                                                    <SelectTrigger className="col-span-2"><SelectValue placeholder="Select a club" /></SelectTrigger>
                                                    <SelectContent>
                                                        {allClubs.map(club => (
                                                            <SelectItem key={club.id} value={club.id.toString()}>{club.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        );
                                    }
                                    return <DetailInput key={fieldKey} label={config.label} name={fieldKey} value={formData.profile[fieldKey]} source="profile" />;
                                }) : <p className="text-gray-500">No specific profile information for the selected role(s).</p>}
                            </div>
                        ) : <p className="text-gray-500">This user does not have an extended profile.</p>}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

const userCategories = [
    {key:"regularUser",label:"Regular User"},
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
    club: { label: "Club", source: "profile" },
    designation: { label: "Designation", source: "profile" },
    department: { label: "Department", source: "profile" },
    emp_id: { label: "Employee ID", source: "profile" },
  };
  
  const categoryFields = {
    regularUser:["name","email","username","password"],
    clubMember: ["name", "email", "username", "password", "learner_id", "reg_number", "club"],
    studentCouncil: ["name", "email", "username", "password", "learner_id", "reg_number"],
    facultyAdvisor: ["name", "email", "username", "password", "designation", "department", "emp_id", "club"],
    studentWelfare: ["name", "email", "username", "password", "designation", "emp_id"],
    securityHead: ["name", "email", "username", "password", "designation", "emp_id"],
  };

// --- Component for Role Creation/Editing ---
const RoleEditSheet = ({ isOpen, onOpenChange, onSave, role, allPermissions }) => {
    const [formData, setFormData] = useState({ name: '', permissions: [] });

    useEffect(() => {
        if (role) {
            setFormData({
                name: role.name || '',
                permissions: role.permissions || [],
            });
        } else {
            setFormData({ name: '', permissions: [] });
        }
    }, [role, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...role, ...formData });
    };

    const permissionOptions = allPermissions.map(p => ({ value: p.id, label: p.name }));

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="max-w-md w-full px-5">
                <SheetHeader>
                    <SheetTitle>{role?.id ? 'Edit Role' : 'Create Role'}</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Role Name"
                        required
                    />
                    <div className="space-y-2">
                        <Label>Permissions</Label>
                        <MultiSelect
                            options={permissionOptions}
                            value={formData.permissions}
                            onChange={(selected) => setFormData({ ...formData, permissions: selected })}
                            placeholder="Select permissions"
                        />
                    </div>
                    <Button type="submit" className="w-full">Save Role</Button>
                </form>
            </SheetContent>
        </Sheet>
    );
};

// --- Component for Role Details View ---
const RoleDetailView = ({ role, allPermissions, onBack, onRoleUpdate }) => {
    const [currentPermissions, setCurrentPermissions] = useState(new Set(role.permissions || []));
    const [initialPermissions, setInitialPermissions] = useState(new Set(role.permissions || []));
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        const permissionsChanged = JSON.stringify(Array.from(currentPermissions).sort()) !== JSON.stringify(Array.from(initialPermissions).sort());
        setIsDirty(permissionsChanged);
    }, [currentPermissions, initialPermissions]);

    const handlePermissionToggle = (permissionId) => {
        setCurrentPermissions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(permissionId)) {
                newSet.delete(permissionId);
            } else {
                newSet.add(permissionId);
            }
            return newSet;
        });
    };

    const handleSave = () => {
        const updatedRole = { ...role, permissions: Array.from(currentPermissions) };
        onRoleUpdate(updatedRole).then(() => {
            setInitialPermissions(new Set(currentPermissions));
            setIsDirty(false);
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack}><FiArrowLeft size={20} /></Button>
                    <h2 className="text-xl font-semibold">{role.name}</h2>
                </div>
                {isDirty && <Button onClick={handleSave}>Save</Button>}
            </CardHeader>
            <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allPermissions.map(permission => (
                        <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`role-perm-${permission.id}`}
                                checked={currentPermissions.has(permission.id)}
                                onCheckedChange={() => handlePermissionToggle(permission.id)}
                            />
                            <Label htmlFor={`role-perm-${permission.id}`} className="font-normal">{permission.name}</Label>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};


// --- Main User Management Component ---
export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  
  const [isUserSheetOpen, setIsUserSheetOpen] = useState(false);
  const [isRoleSheetOpen, setIsRoleSheetOpen] = useState(false);
  const [userForm, setUserForm] = useState({});
  const [formCategory, setFormCategory] = useState("clubMember");

  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingRole, setEditingRole] = useState(null);

  const roleOptions = useMemo(() => 
    Array.isArray(roles) ? roles.map(r => ({ value: r.id, label: r.name })) : []
  , [roles]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const roleMatch = roleFilter === 'all' || (user.groups && user.groups.includes(parseInt(roleFilter)));
      const statusMatch = statusFilter === 'all' || statusFilter === 'active';
      return roleMatch && statusMatch;
    });
  }, [users, roleFilter, statusFilter]);

  const fetchData = useCallback(async () => {
    try {
      const [meRes, usersRes, rolesRes, permissionsRes, clubsRes] = await Promise.all([
        getME(), getAllUsers(), getAllGroups(), getAllPermissions(), getAllClubs()
      ]);
      setLoggedInUser(meRes.data);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
      setPermissions(permissionsRes.data);
      setClubs(clubsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to fetch data");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUserSelect = (user) => setSelectedUser(user);
  const handleBackToList = () => setSelectedUser(null);
  const handleRoleSelect = (role) => setSelectedRole(role);
  const handleBackToRoleList = () => setSelectedRole(null);

  const handleUserUpdate = (updatedUser) => {
    setSelectedUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleRoleUpdate = async (updatedRoleData) => {
    try {
        await updateGroup(updatedRoleData.id, updatedRoleData);
        toast.success("Role updated successfully!");
        fetchData();
        setSelectedRole(updatedRoleData);
    } catch (error) {
        console.error("Failed to update role:", error);
        toast.error(error.response?.data?.detail || "Failed to update role.");
    }
  };

  const openAddUserSheet = () => {
    setUserForm({ name: '', email: '', username: '', password: '', groups: [] });
    setFormCategory('clubMember');
    setIsUserSheetOpen(true);
  };

  const handleUserCreateSubmit = async (e) => {
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

      await createUser(payload, formCategory);
      toast.success("User created successfully!");
      fetchData();
      setIsUserSheetOpen(false);
    } catch (error) {
      console.error("User form submission failed:", error);
      toast.error(error.response?.data?.detail || "An error occurred.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        setSelectedUser(null); 
        fetchData();
        toast.success("User deleted successfully!");
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error("Failed to delete user.");
      }
    }
  };

  const openAddRoleSheet = () => {
    setEditingRole(null);
    setIsRoleSheetOpen(true);
  };

  const handleSaveRole = async (roleData) => {
    try {
        if (roleData.id) {
            await updateGroup(roleData.id, roleData);
            toast.success("Role updated successfully!");
        } else {
            await createGroup({ name: roleData.name, permissions: roleData.permissions });
            toast.success("Role created successfully!");
        }
        fetchData();
        setIsRoleSheetOpen(false);
    } catch (error) {
        console.error("Failed to save role:", error);
        toast.error(error.response?.data?.detail || "Failed to save role.");
    }
  };
  
  const renderUserFormFields = () => {
    return categoryFields[formCategory].map(field => {
        if (field === 'club') {
            return (
                <Select key={field} onValueChange={(value) => setUserForm({...userForm, [field]: value})} value={userForm[field] || ''}>
                    <SelectTrigger><SelectValue placeholder="Select a club" /></SelectTrigger>
                    <SelectContent>
                        {clubs.map(club => (
                            <SelectItem key={club.id} value={club.id}>{club.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        }
        return (
            <Input 
                key={field}
                name={field} 
                value={userForm[field] || ''} 
                onChange={(e) => setUserForm({...userForm, [field]: e.target.value})} 
                placeholder={fieldConfig[field].label} 
                required={field !== 'password'}
                type={field === 'password' ? 'password' : 'text'}
            />
        );
    });
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-[#faf8ff] min-h-screen">
      <PageHeader user={loggedInUser?.username} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
            {selectedUser ? (
                <UserDetailView 
                    user={selectedUser} 
                    allRoles={roles} 
                    allClubs={clubs}
                    allPermissions={permissions}
                    onBack={handleBackToList}
                    onUserUpdate={handleUserUpdate}
                    onRolesUpdated={fetchData}
                    categoryFields={categoryFields}
                    fieldConfig={fieldConfig}
                />
            ) : (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Users</CardTitle>
                        <Button onClick={openAddUserSheet} className="bg-purple-700 hover:bg-purple-600">
                            <FiPlus size={18} className="mr-2" /> Add User
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="role-filter">Role</Label>
                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                    <SelectTrigger id="role-filter" className="w-48">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        {roles.map(role => (
                                            <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="status-filter">Status</Label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger id="status-filter" className="w-48">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {Array.isArray(filteredUsers) && filteredUsers.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <span onClick={() => handleUserSelect(user)} className="cursor-pointer hover:underline">
                                            {user.name}
                                        </span>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{Array.isArray(user.groups) ? user.groups.map(g => roles.find(r => r.id === g)?.name).join(', ') : ''}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-700"><FiTrash2 size={18} /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </TabsContent>
        <TabsContent value="roles" className="mt-4">
            {selectedRole ? (
                <RoleDetailView 
                    role={selectedRole}
                    allPermissions={permissions}
                    onBack={handleBackToRoleList}
                    onRoleUpdate={handleRoleUpdate}
                />
            ) : (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Roles</CardTitle>
                        <Button onClick={openAddRoleSheet}>
                            <FiPlus size={18} className="mr-2" /> Add Role
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Role Name</TableHead>
                                    <TableHead>Permissions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.map(role => (
                                    <TableRow key={role.id} onClick={() => handleRoleSelect(role)} className="cursor-pointer hover:bg-gray-50">
                                        <TableCell className="font-medium">{role.name}</TableCell>
                                        <TableCell>{role.permissions?.length || 0}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </TabsContent>
      </Tabs>

      <Sheet open={isUserSheetOpen} onOpenChange={setIsUserSheetOpen}>
        <SheetContent className="max-w-md w-full px-5">
          <SheetHeader>
            <SheetTitle>Create User</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleUserCreateSubmit} className="space-y-4 mt-4">
              <Select onValueChange={setFormCategory} defaultValue={formCategory}>
                <SelectTrigger><SelectValue placeholder="Select user type" /></SelectTrigger>
                <SelectContent>
                  {userCategories.map(cat => <SelectItem key={cat.key} value={cat.key}>{cat.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {renderUserFormFields()}
              <MultiSelect options={roleOptions} value={userForm.groups || []} onChange={(selected) => setUserForm({...userForm, groups: selected})} placeholder="Select roles" />
              <Button type="submit" className="w-full">Create User</Button>
            </form>
        </SheetContent>
      </Sheet>

      <RoleEditSheet
        isOpen={isRoleSheetOpen}
        onOpenChange={setIsRoleSheetOpen}
        onSave={handleSaveRole}
        role={editingRole}
        allPermissions={permissions}
      />
    </div>
  );
}
