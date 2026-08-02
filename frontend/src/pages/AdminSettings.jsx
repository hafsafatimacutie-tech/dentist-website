import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function AdminSettings() {
  const [form, setForm] = useState({ clinicName: '', address: '', phone: '', email: '', hours: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const [credForm, setCredForm] = useState({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' });
  const [credSaving, setCredSaving] = useState(false);
  const [credStatus, setCredStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    client.get('/settings')
      .then((res) => setForm(res.data))
      .catch(() => setStatus({ type: 'error', message: 'Could not load current settings.' }))
      .finally(() => setLoading(false));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateCred(field, value) {
    setCredForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setSaving(true);
    try {
      await client.put('/settings', form);
      setStatus({ type: 'success', message: 'Saved! Changes are now live on the site.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Could not save changes.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleCredSubmit(e) {
    e.preventDefault();
    setCredStatus({ type: '', message: '' });

    if (!credForm.newUsername && !credForm.newPassword) {
      setCredStatus({ type: 'error', message: 'Enter a new username and/or new password to change.' });
      return;
    }
    if (credForm.newPassword && credForm.newPassword !== credForm.confirmPassword) {
      setCredStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    setCredSaving(true);
    try {
      const res = await client.put('/auth/change-credentials', {
        currentPassword: credForm.currentPassword,
        newUsername: credForm.newUsername || undefined,
        newPassword: credForm.newPassword || undefined,
      });
      setCredStatus({ type: 'success', message: `Login credentials updated. Your username is now "${res.data.username}". Log in again with your new details next time.` });
      setCredForm({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setCredStatus({ type: 'error', message: err.response?.data?.message || 'Could not update credentials.' });
    } finally {
      setCredSaving(false);
    }
  }

  return (
    <div className="section container" style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1 style={{ margin: 0 }}>Clinic Info</h1>
        </div>
        <Link to="/admin/dashboard" className="btn btn-secondary">← Back to Bookings</Link>
      </div>
      <p style={{ marginBottom: 24 }}>
        This updates the clinic name, address, phone, and hours shown across the website — the Contact page, footer, and page title all pull from here automatically.
      </p>

      {loading ? (
        <p>Loading current settings…</p>
      ) : (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 40 }}>
          <div className="form-group">
            <label htmlFor="clinicName">Clinic Name</label>
            <input id="clinicName" value={form.clinicName} onChange={(e) => update('clinicName', e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input id="address" value={form.address} onChange={(e) => update('address', e.target.value)} />
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="hours">Hours</label>
            <input id="hours" value={form.hours} onChange={(e) => update('hours', e.target.value)} placeholder="e.g. Mon–Sat, 9:00 AM – 5:00 PM" />
          </div>

          {status.message && (
            <p style={{ color: status.type === 'error' ? 'var(--color-coral-dark)' : 'var(--color-forest)', fontWeight: 500 }}>
              {status.message}
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      )}

      <h2 style={{ marginBottom: 8 }}>Login Credentials</h2>
      <p style={{ marginBottom: 24 }}>
        Change the username and/or password you use to log into this admin panel. You'll need your current password to confirm.
      </p>
      <form onSubmit={handleCredSubmit} className="card">
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            value={credForm.currentPassword}
            onChange={(e) => updateCred('currentPassword', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newUsername">New Username (leave blank to keep current)</label>
          <input id="newUsername" value={credForm.newUsername} onChange={(e) => updateCred('newUsername', e.target.value)} />
        </div>
        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="newPassword">New Password (leave blank to keep current)</label>
            <input
              id="newPassword"
              type="password"
              value={credForm.newPassword}
              onChange={(e) => updateCred('newPassword', e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={credForm.confirmPassword}
              onChange={(e) => updateCred('confirmPassword', e.target.value)}
            />
          </div>
        </div>

        {credStatus.message && (
          <p style={{ color: credStatus.type === 'error' ? 'var(--color-coral-dark)' : 'var(--color-forest)', fontWeight: 500 }}>
            {credStatus.message}
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={credSaving}>
          {credSaving ? 'Updating…' : 'Update Login Credentials'}
        </button>
      </form>
    </div>
  );
}
