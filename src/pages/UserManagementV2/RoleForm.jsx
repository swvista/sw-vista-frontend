import React, { useState, useEffect } from 'react';

const RoleForm = ({ isOpen, onClose, onSubmit, role, permissions }) => {
  const [formState, setFormState] = useState({ ...role });

  useEffect(() => {
    setFormState({ ...role });
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handlePermissionChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormState(prevState => ({ ...prevState, permissions: selectedOptions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{role.id ? 'Edit Role' : 'Add Role'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role Name</label>
            <input
              type="text"
              name="name"
              value={formState.name || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Permissions</label>
            <select
              multiple
              name="permissions"
              value={formState.permissions || []}
              onChange={handlePermissionChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {permissions.map(perm => (
                <option key={perm.id} value={perm.id}>{perm.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleForm;
