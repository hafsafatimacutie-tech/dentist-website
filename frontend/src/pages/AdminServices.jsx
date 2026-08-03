import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ name: '', description: '', price: '', durationMinutes: '30' });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  function loadServices() {
    setLoading(true);
    client.get('/services')
      .then((res) => setServices(res.data))
      .catch(() => setError('Could not load services.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadServices();
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function resetForm() {
    setForm({ name: '', description: '', price: '', durationMinutes: '30' });
    setEditingId(null);
  }

  function startEdit(service) {
    setForm({
      name: service.name,
      description: service.description,
      price: String(service.price),
      durationMinutes: String(service.durationMinutes),
    });
    setEditingId(service._id);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.name || !form.description || !form.price) {
      setError('Please fill in name, description, and price.');
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      durationMinutes: Number(form.durationMinutes) || 30,
    };

    setSaving(true);
    try {
      if (editingId) {
        await client.put(`/services/${editingId}`, payload);
      } else {
        await client.post('/services', payload);
      }
      resetForm();
      loadServices();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this service.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this service? It will no longer be bookable.')) return;
    try {
      await client.delete(`/services/${id}`);
      loadServices();
    } catch {
      setError('Could not remove this service.');
    }
  }

  return (
    <div className="section container" style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1 style={{ margin: 0 }}>Manage Services</h1>
        </div>
        <Link to="/admin/dashboard" className="btn btn-secondary">← Back to Bookings</Link>
      </div>
      <p style={{ marginBottom: 24 }}>
        These are the treatments patients can choose from on the Booking page. Add at least one service, or the booking form will have nothing to select.
      </p>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 32 }}>
        <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Service' : 'Add a New Service'}</h3>
        <div className="form-group">
          <label htmlFor="name">Service Name</label>
          <input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Teeth Cleaning" />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input id="description" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="e.g. Routine cleaning and polish" />
        </div>
        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="price">Price (₹)</label>
            <input id="price" type="number" min="0" value={form.price} onChange={(e) => update('price', e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="durationMinutes">Duration (minutes)</label>
            <input id="durationMinutes" type="number" min="5" step="5" value={form.durationMinutes} onChange={(e) => update('durationMinutes', e.target.value)} />
          </div>
        </div>

        {error && <p style={{ color: 'var(--color-coral-dark)' }}>{error}</p>}

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update Service' : 'Add Service'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h3>Current Services ({services.length})</h3>
      {loading && <p>Loading…</p>}
      {!loading && services.length === 0 && (
        <p style={{ color: 'var(--color-coral-dark)', fontWeight: 500 }}>
          No services yet — patients cannot book anything until you add at least one above.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {services.map((s) => (
          <div className="card" key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-forest)' }}>{s.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>{s.description}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>₹{s.price} · {s.durationMinutes} min</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => startEdit(s)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Edit
              </button>
              <button
                onClick={() => handleDelete(s._id)}
                className="btn"
                style={{ background: 'transparent', color: 'var(--color-coral-dark)', border: '1.5px solid var(--color-coral-dark)', padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
