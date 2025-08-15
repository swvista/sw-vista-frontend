import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createUser, updateUser, createGroup, updateGroup, getAllClubs } from '../../utils/authService';

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
  const [userType, setUserType] = useState('');
  const [profileData, setProfileData] = useState({});
  const [clubs, setClubs] = useState([]);

  console.log('UserAndRoleForms roles:', roles);
  console.log('UserAndRoleForms userType:', userType);


  useEffect(() => {
    if (editingUser) {
      setUserFormState(editingUser);
      // Note: This does not set the userType or profileData, as the editing logic might be different.
      // This implementation focuses on the creation part as requested.
    } else {
      setUserFormState({});
      setUserType('');
      setProfileData({});
    }
  }, [editingUser]);

  useEffect(() => {
    setRoleFormState(editingRole || {});
  }, [editingRole]);

  useEffect(() => {
    if (userType === 'clubMember' || userType === 'facultyAdvisor') {
      const fetchClubs = async () => {
        try {
          const response = await getAllClubs();
          setClubs(response.data);
        } catch (error) {
          console.error("Failed to fetch clubs:", error);
          toast.error("Failed to fetch clubs.");
        }
      };
      fetchClubs();
    }
  }, [userType]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevState => ({ ...prevState, [name]: value }));
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
      const userData = { ...userFormState, profile: profileData };
      if (userFormState.id) {
        await updateUser(userFormState.id, userData);
        toast.success("User updated successfully!");
      } else {
        await createUser(userData, userType);
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

  const renderProfileFields = () => {
    switch (userType) {
      case 'clubMember':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Learner ID</label>
              <input type="text" name="learner_id" value={profileData.learner_id || ''} onChange={handleProfileChange} className="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Number</label>
              <input type="text" name="reg_number" value={profileData.reg_number || ''} onChange={handleProfileChange} className="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Club</label>
              <select name="club" value={profileData.club || ''} onChange={handleProfileChange} className="mt-1 block w-full border rounded-md p-2">
                <option value="">Select a club</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>
          </>
        );
      case 'studentCouncil':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Learner ID</label>
              <input type="text" name="learner_id" value={profileData.learner_id || ''} onChange={handleProfileChange} className="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Number</label>
              <input type="text" name="reg_number" value={profileData.reg_number || ''} onChange={handleProfileChange} className="mt-1 block w-full border rounded-md p-2" />
            </div>
          </>
        );
      case 'facultyAdvisor':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <input type="text" name="designation" value={profileData.designation || ''} onChange={handleProfileChange} className="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input type="text" name="department" value={profileData.department || ''} onChange={handleProfileChange} className="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee ID</label>
              <input type="text" name="emp_id" value={profileData.emp_id || ''} onChange={handleProfileChange} className="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Club</label>
              <select name="club" value={profileData.club || ''} onChange={handleProfileChange} className="mt-1 block w-full border rounded-md p-2">
                <option value="">Select a club</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>
          </>
        );
      case 'studentWelfare':
      case 'securityHead':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <input type="text" name="designation" value={profileData.designation || ''} onChange={handleProfileChange} className="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee ID</label>
              <input type="text" name="emp_id" value={profileData.emp_id || ''} onChange={handleProfileChange} className="mt-1 block w-full border rounded-md p-2" />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  console.log("test")
  return (
    <div className="p-4 border-l bg-white overflow-y-auto h-full">
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
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" value={userFormState.password || ''} onChange={handleUserChange} className="mt-1 block w-full border rounded-md p-2" required={!editingUser?.id} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Roles</label>
            <select multiple name="groups" value={userFormState.groups || []} onChange={handleUserRoleChange} className="mt-1 block w-full border rounded-md p-2">
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">User Type</label>
            <select name="userType" value={userType} onChange={(e) => setUserType(e.target.value)} className="mt-1 block w-full border rounded-md p-2">
              <option value="">Regular User</option>
              <option value="clubMember">Club Member</option>
              <option value="studentCouncil">Student Council</option>
              <option value="facultyAdvisor">Faculty Advisor</option>
              <option value="studentWelfare">Student Welfare</option>
              <option value="securityHead">Security Head</option>
            </select>
          </div>
          {renderProfileFields()}
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