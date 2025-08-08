import React from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const Sidebar = ({ roles, selectedRole, onSelectRole }) => {
  return (
    <div className="w-64 h-full bg-gray-50 border-r">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Roles</h2>
        <ul>
          <li 
            onClick={() => onSelectRole(null)} 
            className={`p-2 rounded-md cursor-pointer ${!selectedRole ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>
            All Users
          </li>
          {roles.map(role => (
            <li 
              key={role.id} 
              onClick={() => onSelectRole(role)} 
              className={`p-2 rounded-md cursor-pointer ${selectedRole?.id === role.id ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>
              {role.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;