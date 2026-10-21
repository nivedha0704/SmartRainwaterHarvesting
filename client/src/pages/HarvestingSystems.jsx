import { useEffect, useState } from 'react';
import { Droplets, MapPin, Plus, Pencil, Trash2, X, Activity } from 'lucide-react';

const API = 'http://localhost:5000/api/harvesting-systems';

const emptyForm = {
  systemName: '',
  location: '',
  collectionMethod: 'Rooftop',
  capacityLitres: '',
  status: 'Active',
  description: '',
};

function HarvestingSystems() {
  const [systems, setSystems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  async function request(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Request failed.');
    return data;
  }

  async function loadSystems() {
    setLoading(true);
    setError('');
    try {
      const data = await request(API);
      setSystems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSystems();
  }, []);

  function startAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage('');
    setError('');
    setShowForm(true);
  }

  function startEdit(system) {
    setForm({
      systemName: system.systemName,
      location: system.location,
      collectionMethod: system.collectionMethod,
      capacityLitres: String(system.capacityLitres),
      status: system.status,
      description: system.description || '',
    });
    setEditingId(system._id);
    setMessage('');
    setError('');
    setShowForm(true);
  }

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        ...form,
        capacityLitres: Number(form.capacityLitres),
      };

      if (editingId) {
        await request(`${API}/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setMessage('Harvesting system updated successfully.');
      } else {
        await request(API, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setMessage('Harvesting system added successfully.');
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadSystems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteSystem(id) {
    if (!window.confirm('Delete this harvesting system permanently?')) return;

    setError('');
    setMessage('');
    try {
      await request(`${API}/${id}`, { method: 'DELETE' });
      setMessage('Harvesting system deleted successfully.');
      await loadSystems();
    } catch (err) {
      setError(err.message);
    }
  }

  const totalCapacity = systems.reduce(
    (total, system) => total + Number(system.capacityLitres || 0), 0
  );
  const activeCount = systems.filter(system => system.status === 'Active').length;
  const maintenanceCount = systems.filter(
    system => system.status === 'Needs Maintenance'
  ).length;
  const isAdmin = JSON.parse(localStorage.getItem('user') || '{}').role === 'Admin';

  return (
    <div className="management-page">
      <div className="page-heading">
        <div>
          <h1>Harvesting Systems</h1>
          <p>Manage rainwater collection systems, capacity and operational status.</p>
        </div>
        {isAdmin && (
          <button className="primary-button" onClick={startAdd}>
            <Plus size={18} /> Add System
          </button>
        )}
      </div>

      <div className="management-stats">
        <div className="management-stat">
          <span className="management-stat-icon blue"><Droplets size={22} /></span>
          <div><p>Total Systems</p><h2>{systems.length}</h2></div>
        </div>
        <div className="management-stat">
          <span className="management-stat-icon green"><Activity size={22} /></span>
          <div><p>Active Systems</p><h2>{activeCount}</h2></div>
        </div>
        <div className="management-stat">
          <span className="management-stat-icon purple"><MapPin size={22} /></span>
          <div><p>Total Capacity</p><h2>{totalCapacity.toLocaleString()} L</h2></div>
        </div>
        <div className="management-stat">
          <span className="management-stat-icon amber"><Activity size={22} /></span>
          <div><p>Needs Maintenance</p><h2>{maintenanceCount}</h2></div>
        </div>
      </div>

      {message && <div className="feedback-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="table-card management-form-card">
          <div className="table-heading">
            <h2>{editingId ? 'Edit Harvesting System' : 'Register Harvesting System'}</h2>
            <button className="icon-button" onClick={() => setShowForm(false)} aria-label="Close form">
              <X size={19} />
            </button>
          </div>
          <form className="management-form" onSubmit={handleSubmit}>
            <label>System Name *
              <input name="systemName" value={form.systemName} onChange={updateField} required maxLength={100} />
            </label>
            <label>Location *
              <input name="location" value={form.location} onChange={updateField} required maxLength={150} />
            </label>
            <label>Collection Method *
              <select name="collectionMethod" value={form.collectionMethod} onChange={updateField} required>
                <option value="Rooftop">Rooftop</option>
                <option value="Surface Runoff">Surface Runoff</option>
                <option value="Both">Both</option>
              </select>
            </label>
            <label>Capacity (litres) *
              <input name="capacityLitres" type="number" min="1" value={form.capacityLitres} onChange={updateField} required />
            </label>
            <label>Status
              <select name="status" value={form.status} onChange={updateField}>
                <option value="Active">Active</option>
                <option value="Needs Maintenance">Needs Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
            <label className="full-field">Description
              <textarea name="description" value={form.description} onChange={updateField} rows="3" maxLength={500} />
            </label>
            <div className="management-form-actions full-field">
              <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="primary-button" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add System'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-card">
        <div className="table-heading">
          <h2>Registered Systems</h2>
          <span>{systems.length} records</span>
        </div>
        {loading ? <p>Loading systems...</p> : systems.length === 0 ? (
          <div className="empty-state">
            <Droplets size={32} />
            <h3>No harvesting systems yet</h3>
            <p>Add your first system to start tracking collection and capacity.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="users-table">
              <thead><tr>
                <th>System</th><th>Location</th><th>Method</th>
                <th>Capacity</th><th>Status</th>{isAdmin && <th>Actions</th>}
              </tr></thead>
              <tbody>
                {systems.map(system => (
                  <tr key={system._id}>
                    <td><strong>{system.systemName}</strong></td>
                    <td>{system.location}</td>
                    <td>{system.collectionMethod}</td>
                    <td>{Number(system.capacityLitres).toLocaleString()} L</td>
                    <td><span className={`system-status ${system.status === 'Active' ? 'active' : system.status === 'Inactive' ? 'inactive' : 'maintenance'}`}>{system.status}</span></td>
                    {isAdmin && (
                      <td>
                        <div className="management-actions">
                          <button className="edit-button" onClick={() => startEdit(system)}><Pencil size={15} /> Edit</button>
                          <button className="remove-user-button" onClick={() => deleteSystem(system._id)}><Trash2 size={15} /> Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default HarvestingSystems;