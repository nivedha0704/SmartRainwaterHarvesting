import { useEffect, useState } from 'react';
import { ClipboardCheck, Plus, RefreshCw } from 'lucide-react';

const API = 'http://localhost:5000/api/inspections';

function Inspections() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    location: '',
    inspector: '',
    condition: 'Good',
    notes: '',
  });

  async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const text = await response.text();
    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(
        'The server returned HTML instead of JSON. Check that the backend is running on port 5000.'
      );
    }

    if (!response.ok) {
      throw new Error(
        data.message || data.error || `Request failed (${response.status}).`
      );
    }

    return data;
  }

  async function loadItems() {
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest(API);
      setItems(
        Array.isArray(data)
          ? data
          : Array.isArray(data.inspections)
            ? data.inspections
            : []
      );
    } catch (err) {
      setError(err.message || 'Unable to load inspection records.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function addInspection(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await apiRequest(API, {
        method: 'POST',
        body: JSON.stringify(form),
      });

      setMessage('Inspection recorded successfully.');
      setForm({
        location: '',
        inspector: '',
        condition: 'Good',
        notes: '',
      });

      await loadItems();
    } catch (err) {
      setError(err.message || 'Unable to save inspection.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="inspections-page">
      <div className="page-heading">
        <div>
          <h1>Inspections</h1>
          <p>Record and monitor rainwater harvesting system inspections.</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={loadItems}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {message && <p className="feedback-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="table-card">
        <div className="table-heading">
          <h2>
            <Plus size={19} />
            Record Inspection
          </h2>
        </div>

        <form className="form-grid" onSubmit={addInspection}>
          <label className="form-field">
            Location
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter tank or building location"
              required
            />
          </label>

          <label className="form-field">
            Inspector Name
            <input
              name="inspector"
              value={form.inspector}
              onChange={handleChange}
              placeholder="Enter inspector name"
              required
            />
          </label>

          <label className="form-field">
            Condition
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
            >
              <option value="Good">Good</option>
              <option value="Needs Attention">Needs Attention</option>
              <option value="Critical">Critical</option>
            </select>
          </label>

          <label className="form-field">
            Inspection Notes
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Enter observations"
            />
          </label>

          <div className="form-actions">
            <button
              className="primary-button"
              type="submit"
              disabled={saving}
            >
              <ClipboardCheck size={17} />
              {saving ? 'Saving...' : 'Save Inspection'}
            </button>
          </div>
        </form>
      </div>

      <div className="table-card">
        <div className="table-heading">
          <h2>Inspection Records</h2>
          <span>{items.length} records</span>
        </div>

        {loading ? (
          <p className="empty-state">Loading inspections...</p>
        ) : (
          <div className="table-scroll">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Inspector</th>
                  <th>Date</th>
                  <th>Condition</th>
                  <th>Notes</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.location}</td>
                    <td>{item.inspector}</td>
                    <td>
                      {item.inspectionDate
                        ? new Date(item.inspectionDate).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>
                      <span className="status">{item.condition}</span>
                    </td>
                    <td>{item.notes || '—'}</td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan="5">No inspection records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inspections;