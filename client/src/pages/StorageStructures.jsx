import { useEffect, useState } from 'react';
import { Database, MapPin, Plus, Pencil, Trash2, X, Droplets } from 'lucide-react';

const API = 'http://localhost:5000/api/storage-structures';

const emptyForm = {
  structureName: '',
  location: '',
  structureType: 'Storage Tank',
  capacityLitres: '',
  waterLevelLitres: '0',
  condition: 'Good',
  description: '',
};

function StorageStructures() {
  const [structures, setStructures] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const isAdmin = JSON.parse(localStorage.getItem('user') || '{}').role === 'Admin';

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

  async function loadStructures() {
    setLoading(true);
    setError('');
    try {
      const data = await request(API);
      setStructures(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStructures();
  }, []);

  function startAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage('');
    setError('');
    setShowForm(true);
  }

  function startEdit(structure) {
    setForm({
      structureName: structure.structureName,
      location: structure.location,
      structureType: structure.structureType,
      capacityLitres: String(structure.capacityLitres),
      waterLevelLitres: String(structure.waterLevelLitres ?? 0),
      condition: structure.condition,
      description: structure.description || '',
    });
    setEditingId(structure._id);
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
        waterLevelLitres: Number(form.waterLevelLitres),
      };

      if (payload.waterLevelLitres > payload.capacityLitres) {
        throw new Error('Water level cannot exceed total capacity.');
      }

      if (editingId) {
        await request(`${API}/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setMessage('Storage structure updated successfully.');
      } else {
        await request(API, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setMessage('Storage structure added successfully.');
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadStructures();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteStructure(id) {
    if (!window.confirm('Delete this storage structure permanently?')) return;

    setError('');
    setMessage('');
    try {
      await request(`${API}/${id}`, { method: 'DELETE' });
      setMessage('Storage structure deleted successfully.');
      await loadStructures();
    } catch (err) {
      setError(err.message);
    }
  }

  const totalCapacity = structures.reduce((sum, item) => sum + Number(item.capacityLitres || 0), 0);
  const totalWater = structures.reduce((sum, item) => sum + Number(item.waterLevelLitres || 0), 0);
  const criticalCount = structures.filter(item => item.condition === 'Critical').length;
  const isValidLevel = Number(form.waterLevelLitres) <= Number(form.capacityLitres);

  return (
    <div className="management-page">
      <div className="page-heading">
        <div>
          <h1>Storage Structures</h1>
          <p>Track rainwater tanks, recharge pits, water capacity and structure condition.</p>
        </div>
        {isAdmin && (
          <button className="primary-button" onClick={startAdd}>
            <Plus size={18} /> Add Structure
          </button>
        )}
      </div>

      <div className="management-stats">
        <div className="management-stat">
          <span className="management-stat-icon blue"><Database size={22} /></span>
          <div><p>Total Structures</p><h2>{structures.length}</h2></div>
        </div>
        <div className="management-stat">
          <span className="management-stat-icon green"><Droplets size={22} /></span>
          <div><p>Total Capacity</p><h2>{totalCapacity.toLocaleString()} L</h2></div>
        </div>
        <div className="management-stat">
          <span className="management-stat-icon purple"><Droplets size={22} /></span>
          <div><p>Water Stored</p><h2>{totalWater.toLocaleString()} L</h2></div>
        </div>
        <div className="management-stat">
          <span className="management-stat-icon amber"><MapPin size={22} /></span>
          <div><p>Critical Structures</p><h2>{criticalCount}</h2></div>
        </div>
      </div>

      {message && <div className="feedback-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="table-card management-form-card">
          <div className="table-heading">
            <h2>{editingId ? 'Edit Storage Structure' : 'Register Storage Structure'}</h2>
            <button className="icon-button" onClick={() => setShowForm(false)} aria-label="Close form">
              <X size={19} />
            </button>
          </div>
          <form className="management-form" onSubmit={handleSubmit}>
            <label>Structure Name *
              <input name="structureName" value={form.structureName} onChange={updateField} required maxLength={100} />
            </label>
            <label>Location *
              <input name="location" value={form.location} onChange={updateField} required maxLength={150} />
            </label>
            <label>Structure Type *
              <select name="structureType" value={form.structureType} onChange={updateField} required>
                <option value="Storage Tank">Storage Tank</option>
                <option value="Recharge Pit">Recharge Pit</option>
                <option value="Sump">Sump</option>
                <option value="Reservoir">Reservoir</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>Capacity (litres) *
              <input name="capacityLitres" type="number" min="1" value={form.capacityLitres} onChange={updateField} required />
            </label>
            <label>Current Water Level (litres)
              <input name="waterLevelLitres" type="number" min="0" max={form.capacityLitres || undefined} value={form.waterLevelLitres} onChange={updateField} required />
            </label>
            <label>Condition
              <select name="condition" value={form.condition} onChange={updateField}>
                <option value="Good">Good</option>
                <option value="Needs Attention">Needs Attention</option>
                <option value="Critical">Critical</option>
              </select>
            </label>
            <label className="full-field">Description
              <textarea name="description" value={form.description} onChange={updateField} rows="3" maxLength={500} />
            </label>
            {!isValidLevel && <p className="error-message full-field">Water level cannot exceed total capacity.</p>}
            <div className="management-form-actions full-field">
              <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="primary-button" disabled={saving || !isValidLevel}>
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Structure'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-card">
        <div className="table-heading">
          <h2>Registered Structures</h2>
          <span>{structures.length} records</span>
        </div>
        {loading ? <p>Loading structures...</p> : structures.length === 0 ? (
          <div className="empty-state">
            <Database size={32} />
            <h3>No storage structures yet</h3>
            <p>Add a tank, sump, reservoir or recharge pit to begin tracking water storage.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="users-table">
              <thead><tr>
                <th>Structure</th><th>Location</th><th>Type</th>
                <th>Capacity</th><th>Water Level</th><th>Condition</th>
                {isAdmin && <th>Actions</th>}
              </tr></thead>
              <tbody>
                {structures.map(item => {
                  const percentage = item.capacityLitres > 0
                    ? Math.min(100, Math.round((item.waterLevelLitres / item.capacityLitres) * 100))
                    : 0;

                  return (
                    <tr key={item._id}>
                      <td><strong>{item.structureName}</strong></td>
                      <td>{item.location}</td>
                      <td>{item.structureType}</td>
                      <td>{Number(item.capacityLitres).toLocaleString()} L</td>
                      <td>
                        <div className="water-level-cell">
                          <span>{Number(item.waterLevelLitres || 0).toLocaleString()} L ({percentage}%)</span>
                          <div className="water-level-track"><div style={{ width: `${percentage}%` }} /></div>
                        </div>
                      </td>
                      <td>
                        <span className={`system-status ${item.condition === 'Good' ? 'active' : item.condition === 'Critical' ? 'inactive' : 'maintenance'}`}>
                          {item.condition}
                        </span>
                      </td>
                      {isAdmin && (
                        <td>
                          <div className="management-actions">
                            <button className="edit-button" onClick={() => startEdit(item)}><Pencil size={15} /> Edit</button>
                            <button className="remove-user-button" onClick={() => deleteStructure(item._id)}><Trash2 size={15} /> Delete</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StorageStructures;