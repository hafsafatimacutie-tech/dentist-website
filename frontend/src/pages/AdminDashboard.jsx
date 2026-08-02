import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';

const STATUS_OPTIONS = ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'];

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    try {
      const res = await client.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError('Could not load bookings.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      await client.put(`/bookings/${id}/status`, { status });
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
    } catch {
      setError('Could not update booking status.');
    }
  }

  function logout() {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  }

  const visible = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="section container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1 style={{ margin: 0 }}>Appointment Requests</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/admin/gallery" className="btn btn-secondary">Manage Photos</Link>
          <button className="btn btn-secondary" onClick={logout}>Log Out</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', ...STATUS_OPTIONS].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="btn"
            style={{
              padding: '8px 16px',
              fontSize: '0.8rem',
              background: filter === f ? 'var(--color-forest)' : 'transparent',
              color: filter === f ? '#fff' : 'var(--color-forest)',
              border: '1.5px solid var(--color-forest)',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'var(--color-coral-dark)' }}>{error}</p>}

      {!loading && visible.length === 0 && <p>No bookings in this view.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {visible.map((b) => (
          <div className="card" key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-forest)' }}>{b.patientName}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                {b.service?.name || 'Service'} · {b.date} at {b.time}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{b.phone} · {b.email}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className={`badge badge-${b.status}`}>{b.status}</span>
              <select
                value={b.status}
                onChange={(e) => updateStatus(b._id, e.target.value)}
                style={{ width: 'auto', padding: '8px 10px' }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
