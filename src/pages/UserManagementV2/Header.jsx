import React from 'react';

const Header = ({ onAddUser, roles, selectedRole, onSelectRole, onToggleRoles }) => {
  return (
    <div className="flex items-center justify-between h-16 px-4 bg-white border-b">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold">User Management</h1>
        <select
          value={selectedRole ? selectedRole.id : 'all'}
          onChange={(e) => onSelectRole(e.target.value === 'all' ? null : roles.find(r => r.id === parseInt(e.target.value)))}
          className="ml-4 px-2 py-1 border rounded-md"
        >
          <option value="all">All Roles</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-2 py-1 border rounded-md"
        />
        <button onClick={onAddUser} className="px-4 py-2 text-white bg-blue-600 rounded-md">
          Add User
        </button>
        <button onClick={onToggleRoles} className="px-4 py-2 text-white bg-purple-600 rounded-md">
          Roles
        </button>
        <a href="#" className="text-sm text-gray-600 hover:text-black">Help</a>
        <a href="#" className="text-sm text-gray-600 hover:text-black">Settings</a>
        <img
          src="https://via.placeholder.com/32"
          alt="User Avatar"
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default Header;
