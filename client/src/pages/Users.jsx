import { useEffect, useState } from 'react';
import { Users, UserPlus, Trash2, RefreshCw } from 'lucide-react';

const API = 'http://localhost:5000/api/users';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Inspector',
  });

  const request = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.error || 'Request failed.');
    return data;
  };

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await request(API);
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const addUser = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      await request(API, {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setMessage('User added successfully.');
      setForm({ name: '', email: '', password: '', role: 'Inspector' });
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeUser = async (user) => {
    if (user.role === 'Admin') {
      setError('Admin accounts cannot be removed.');
      return;
    }

    if (!window.confirm(`Remove ${user.name}? This action cannot be undone.`)) return;

    setMessage('');
    setError('');

    try {
      await request(`${API}/${user._id}`, { method: 'DELETE' });
      setUsers((current) => current.filter((item) => item._id !== user._id));
      setMessage('User removed successfully.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>User Management</h1>
          <p>Create accounts and manage system access.</p>
        </div>
        <button className="secondary-button" onClick={loadUsers}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {message && <p className="feedback-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="table-card">
        <div className="table-heading">
          <h2><Users size={20} /> Add New User</h2>
        </div>
        <form className="form-grid" onSubmit={addUser}>
          <label className="form-field">
            Full name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" />
          </label>
          <label className="form-field">
            Email address
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" />
          </label>
          <label className="form-field">
            Password (minimum 12 characters)
            <input required minLength={12} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Create a password" />
          </label>
          <label className="form-field">
            Role
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="Inspector">Inspector</option>
              <option value="Maintenance Staff">Maintenance Staff</option>
            </select>
          </label>
          <div className="form-actions">
            <button className="primary-button" type="submit"><UserPlus size={17} /> Add User</button>
          </div>
        </form>
      </div>

      <div className="table-card">
        <div className="table-heading">
          <h2>Registered Users</h2>
          <span>{users.length} users</span>
        </div>
        {loading ? <p className="empty-state">Loading users...</p> : (
          <div className="table-scroll">
            <table className="users-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td><span className="status">{user.status || 'Active'}</span></td>
                    <td>
                      {user.role !== 'Admin' && (
                        <button className="remove-user-button" onClick={() => removeUser(user)}>
                          <Trash2 size={15} /> Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan="5">No users found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersPage;