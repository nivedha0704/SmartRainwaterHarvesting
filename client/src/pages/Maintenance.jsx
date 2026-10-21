import { useEffect, useState } from 'react';
import { Wrench, Plus, RefreshCw } from 'lucide-react';

const API = 'http://localhost:5000/api/maintenance';

function Maintenance() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    location: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    assignedTo: '',
    dueDate: '',
  });

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  });

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(API, { headers: headers() });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to load maintenance tasks.');
      setItems(Array.isArray(data) ? data : data.maintenance || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, []);

  const addTask = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to add task.');
      setMessage('Maintenance task added successfully.');
      setForm({ title: '', location: '', description: '', priority: 'Medium', status: 'Pending', assignedTo: '', dueDate: '' });
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateStatus = async (item, status) => {
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${API}/${item._id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to update task.');
      setMessage('Task status updated.');
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div><h1>Maintenance</h1><p>Track repairs, assigned work, and task progress.</p></div>
        <button className="secondary-button" onClick={loadItems}><RefreshCw size={16} /> Refresh</button>
      </div>

      {message && <p className="feedback-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="table-card">
        <div className="table-heading"><h2><Plus size={19} /> Create Maintenance Task</h2></div>
        <form className="form-grid" onSubmit={addTask}>
          <label className="form-field">Task title
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Clean storage tank" />
          </label>
          <label className="form-field">Location
            <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Enter location" />
          </label>
          <label className="form-field">Assigned to
            <input value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} placeholder="Staff name" />
          </label>
          <label className="form-field">Due date
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </label>
          <label className="form-field">Priority
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </label>
          <label className="form-field">Description
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the work required" />
          </label>
          <div className="form-actions"><button className="primary-button" type="submit"><Wrench size={17} /> Add Task</button></div>
        </form>
      </div>

      <div className="table-card">
        <div className="table-heading"><h2>Maintenance Tasks</h2><span>{items.length} tasks</span></div>
        {loading ? <p className="empty-state">Loading tasks...</p> : (
          <div className="table-scroll">
            <table className="users-table">
              <thead><tr><th>Task</th><th>Location</th><th>Priority</th><th>Assigned To</th><th>Due Date</th><th>Status</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td><td>{item.location}</td><td>{item.priority}</td>
                    <td>{item.assignedTo || '—'}</td>
                    <td>{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '—'}</td>
                    <td>
                      <select value={item.status} onChange={(e) => updateStatus(item, e.target.value)}>
                        <option>Pending</option><option>In Progress</option><option>Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan="6">No maintenance tasks found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Maintenance;