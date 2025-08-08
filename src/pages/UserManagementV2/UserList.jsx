import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const UserList = ({ users, onEditUser, onDeleteUser }) => {
  return (
    <div className="p-4">
      <table className="w-full bg-white border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Roles</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.groups.join(', ')}</td>
              <td className="p-2">
                <button onClick={() => onEditUser(user)} className="mr-2">
                  <FiEdit2 />
                </button>
                <button onClick={() => onDeleteUser(user.id)} className="text-red-600">
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;