import React, { useState, useEffect, useMemo } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import UserList from './UserList';
import UserAndRoleForms from './UserAndRoleForms';
import { getAllUsers, getAllGroups, getAllPermissions, createUser, updateUser, deleteUser, createGroup, updateGroup, deleteGroup } from '../../utils/authService';
import { toast } from 'react-toastify';

const UserManagementV2 = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [activeForm, setActiveForm] = useState(null); // 'user', 'role', null
  

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes, permissionsRes] = await Promise.all([getAllUsers(), getAllGroups(), getAllPermissions()]);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
      setPermissions(permissionsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to fetch data");
    }
  };

  const handleAddUser = () => {
    setEditingUser({});
    setActiveForm('user');
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setActiveForm('user');
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

  const handleUserSubmitSuccess = () => {
    fetchData();
    setActiveForm(null);
  };

  const handleAddRole = () => {
    setEditingRole({});
    setActiveForm('role');
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setActiveForm('role');
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await deleteGroup(roleId);
        fetchData();
        toast.success("Role deleted successfully!");
      } catch (error) {
        console.error("Failed to delete role:", error);
        toast.error("Failed to delete role.");
      }
    }
  };

  const handleRoleSubmitSuccess = () => {
    fetchData();
    setActiveForm(null);
  };

  const filteredUsers = useMemo(() => {
    if (!selectedRole) return users;
    return users.filter(user => user.groups.includes(selectedRole.id));
  }, [users, selectedRole]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar roles={roles} selectedRole={selectedRole} onSelectRole={setSelectedRole} onAddRole={handleAddRole} onEditRole={handleEditRole} onDeleteRole={handleDeleteRole} />
      <div className="flex flex-col flex-1">
        <Header onAddUser={handleAddUser} roles={roles} selectedRole={selectedRole} onSelectRole={setSelectedRole} onToggleRoles={() => setActiveForm('role')} />
        <UserList users={filteredUsers} onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} />
      </div>
      {activeForm && (
        <UserAndRoleForms
          activeForm={activeForm}
          onClose={() => setActiveForm(null)}
          onUserSubmitSuccess={handleUserSubmitSuccess}
          onRoleSubmitSuccess={handleRoleSubmitSuccess}
          editingUser={editingUser}
          editingRole={editingRole}
          roles={roles}
          permissions={permissions}
        />
      )}
    </div>
  );
};

export default UserManagementV2;