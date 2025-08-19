import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ChangeRole() {
  const isAdmin = true;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/auth/admin/users")
      .then(response => {
        console.log("Fetched users:", response.data); // DEBUG
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleChangeRole = (userId, newRoleId) => {
    axios.post(`http://localhost:8080/api/auth/admin/changerole`, null, {
      params: {
        targetEmail: users.find(u => u.id === userId).email,
        newRoleId: newRoleId,
      },
    })
      .then(res => {
        alert("Role changed successfully");
        // Optionally refresh user list
      })
      .catch(err => {
        console.error("Role change failed:", err);
        alert("Role change failed");
      });
  };


  if (!isAdmin) {
    return <div className="access-denied">Access Denied. Only Admins can view this page.</div>;
  }

  return (
    <div className="admin-page">
      <table className="user-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.newRoleId !== undefined ? user.newRoleId : user.role?.id || 1} // default to 1 (User) if role.id is undefined
                  onChange={(e) => {
                    const updatedUsers = users.map(u =>
                      u.id === user.id ? { ...u, newRoleId: parseInt(e.target.value) } : u
                    );
                    setUsers(updatedUsers);
                  }}
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Campaign Creator</option>
                  <option value={3}>Donor</option>
                </select>
                <button
                  onClick={() =>
                    handleChangeRole(user.id, user.newRoleId !== undefined ? user.newRoleId : user.role?.id)
                  }
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#2c7a7b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Change
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}