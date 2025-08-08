import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createUser, updateUser, createGroup, updateGroup } from '../../utils/authService';

const UserAndRoleForms = ({ 
  activeForm, 
  onClose, 
  onUserSubmitSuccess, 
  onRoleSubmitSuccess, 
  editingUser, 
  editingRole, 
  roles, 
  permissions 
}) => {
  const [userFormState, setUserFormState] = useState({});
  const [roleFormState, setRoleFormState] = useState({});

  useEffect(() => {
    setUserFormState(editingUser || {});
  }, [editingUser]);

  useEffect(() => {
    setRoleFormState(editingRole || {});
  }, [editingRole]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    setRoleFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUserRoleChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setUserFormState(prevState => ({ ...prevState, groups: selectedOptions }));
  };

  const handleRolePermissionChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setRoleFormState(prevState => ({ ...prevState, permissions: selectedOptions }));
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userFormState.id) {
        await updateUser(userFormState.id, userFormState);
        toast.success("User updated successfully!");
      } else {
        await createUser(userFormState);
        toast.success("User created successfully!");
      }
      onUserSubmitSuccess();
    } catch (error) {
      console.error("User form submission failed:", error);
      toast.error(error.response?.data?.detail || "An error occurred.");
    }
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (roleFormState.id) {
        await updateGroup(roleFormState.id, roleFormState);
        toast.success("Role updated successfully!");
      } else {
        await createGroup(roleFormState);
        toast.success("Role created successfully!");
      }
      onRoleSubmitSuccess();
    } catch (error) {
      console.error("Role form submission failed:", error);
      toast.error(error.response?.data?.detail || "An error occurred.");
    }
  };

  return (
    <div className="p-4 border-l bg-white">
      {activeForm === 'user' && (
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <h2 className="text-xl font-bold">{editingUser?.id ? 'Edit User' : 'Add User'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" value={userFormState.name || ''} onChange={handleUserChange} className="mt-1 block w-full border rounded-md p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={userFormState.email || ''} onChange={handleUserChange} className="mt-1 block w-full border rounded-md p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Roles</label>
            <select multiple name="groups" value={userFormState.groups || []} onChange={handleUserRoleChange} className="mt-1 block w-full border rounded-md p-2">
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>
          </div>
        </form>
      )}

      {activeForm === 'role' && (
        <form onSubmit={handleRoleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold">{editingRole?.id ? 'Edit Role' : 'Add Role'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role Name</label>
            <input type="text" name="name" value={roleFormState.name || ''} onChange={handleRoleChange} className="mt-1 block w-full border rounded-md p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Permissions</label>
            <select multiple name="permissions" value={roleFormState.permissions || []} onChange={handleRolePermissionChange} className="mt-1 block w-full border rounded-md p-2">
              {permissions.map(perm => (
                <option key={perm.id} value={perm.id}>{perm.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserAndRoleForms;
