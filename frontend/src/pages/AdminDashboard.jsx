import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';

const STATUS_OPTIONS = ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'];
const INITIAL_CREDENTIAL_FORM = {
  currentPassword: '',
  newUsername: '',
  newPassword: '',
  confirmPassword: ''
};

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [credentialForm, setCredentialForm] = useState(INITIAL_CREDENTIAL_FORM);
  const [credentialMessage, setCredentialMessage] = useState('');
  const [credentialError, setCredentialError] = useState('');
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

  async function handleCredentialsChange(e) {
    e.preventDefault();
    setCredentialMessage('');
    setCredentialError('');

    if (credentialForm.newPassword && credentialForm.newPassword !== credentialForm.confirmPassword) {
      setCredentialError('New passwords do not match.');
      return;
    }

    try {
      const payload = {
        currentPassword: credentialForm.currentPassword,
        newUsername: credentialForm.newUsername.trim() || undefined,
        newPassword: credentialForm.newPassword || undefined
      };
      const res = await client.put('/auth/change-credentials', payload);
      setCredentialMessage(res.data.message || 'Credentials updated.');
      setCredentialForm(INITIAL_CREDENTIAL_FORM);
    } catch (err) {
      setCredentialError(err.response?.data?.message || 'Could not update credentials.');
    }
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
          <Link to="/admin/content" className="btn btn-secondary">Manage Content</Link>
          <Link to="/admin/gallery" className="btn btn-secondary">Manage Photos</Link>
          <button className="btn btn-secondary" onClick={logout}>Log Out</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginTop: 0 }}>Change Admin Credentials</h3>
        <form onSubmit={handleCredentialsChange}>
          <div className="form-group">
            <label>Current password</label>
            <input
              type="password"
              value={credentialForm.currentPassword}
              onChange={(e) => setCredentialForm({ ...credentialForm, currentPassword: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>New username (optional)</label>
            <input
              value={credentialForm.newUsername}
              onChange={(e) => setCredentialForm({ ...credentialForm, newUsername: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>New password (optional)</label>
            <input
              type="password"
              value={credentialForm.newPassword}
              onChange={(e) => setCredentialForm({ ...credentialForm, newPassword: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Confirm new password</label>
            <input
              type="password"
              value={credentialForm.confirmPassword}
              onChange={(e) => setCredentialForm({ ...credentialForm, confirmPassword: e.target.value })}
            />
          </div>
          {credentialError && <p style={{ color: 'var(--color-coral-dark)' }}>{credentialError}</p>}
          {credentialMessage && <p style={{ color: 'var(--color-forest)' }}>{credentialMessage}</p>}
          <button className="btn btn-primary" type="submit">Update Credentials</button>
        </form>
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
