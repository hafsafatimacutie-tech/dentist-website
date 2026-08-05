import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function AdminSettings() {
  const [form, setForm] = useState({
    clinicName: '', address: '', phone: '', email: '', hours: '', aboutText: '',
    heroTag: '', heroHeadline: '', heroSubtext: '',
    whyChooseUsEyebrow: '', whyChooseUsHeading: '',
    whyChooseUsItems: [
      { title: 'Instant Booking', description: 'Pick a service, pick a slot, done — no back-and-forth calls to find a time that works.' },
      { title: 'Transparent Pricing', description: "Every treatment is listed with clear pricing upfront, so there's never a surprise at checkout." },
      { title: 'Gentle, Modern Care', description: 'Modern equipment and a calm, judgment-free environment — especially for anxious first visits.' },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const [credForm, setCredForm] = useState({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' });
  const [credSaving, setCredSaving] = useState(false);
  const [credStatus, setCredStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    client.get('/settings')
      .then((res) => setForm((f) => ({
        ...f,
        ...res.data,
        whyChooseUsItems: res.data.whyChooseUsItems?.length ? res.data.whyChooseUsItems : f.whyChooseUsItems,
      })))
      .catch(() => setStatus({ type: 'error', message: 'Could not load current settings.' }))
      .finally(() => setLoading(false));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateWhyItem(index, field, value) {
    setForm((f) => {
      const items = [...f.whyChooseUsItems];
      items[index] = { ...items[index], [field]: value };
      return { ...f, whyChooseUsItems: items };
    });
  }

  function addWhyItem() {
    setForm((f) => ({ ...f, whyChooseUsItems: [...f.whyChooseUsItems, { title: '', description: '' }] }));
  }

  function removeWhyItem(index) {
    setForm((f) => ({ ...f, whyChooseUsItems: f.whyChooseUsItems.filter((_, i) => i !== index) }));
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
          <div className="form-group">
            <label htmlFor="aboutText">About Page Text</label>
            <textarea
              id="aboutText"
              value={form.aboutText}
              onChange={(e) => update('aboutText', e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}
            />
          </div>

          <h3 style={{ marginTop: 32, marginBottom: 4 }}>Homepage Banner</h3>
          <p style={{ fontSize: '0.85rem', marginBottom: 16 }}>
            This is the big text visitors see first. Useful to update once "newly opened" no longer applies.
          </p>
          <div className="form-group">
            <label htmlFor="heroTag">Small Tag Line (above the headline)</label>
            <input id="heroTag" value={form.heroTag} onChange={(e) => update('heroTag', e.target.value)} placeholder="e.g. ✦ Trusted dental care in Hyderabad" />
          </div>
          <div className="form-group">
            <label htmlFor="heroHeadline">Main Headline</label>
            <input id="heroHeadline" value={form.heroHeadline} onChange={(e) => update('heroHeadline', e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="heroSubtext">Subtext (short paragraph below headline)</label>
            <textarea
              id="heroSubtext"
              value={form.heroSubtext}
              onChange={(e) => update('heroSubtext', e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}
            />
          </div>

          <h3 style={{ marginTop: 32, marginBottom: 4 }}>Why Choose Us Section</h3>
          <p style={{ fontSize: '0.85rem', marginBottom: 16 }}>
            The three cards on the homepage explaining why patients should book with you.
          </p>
          <div className="form-group">
            <label htmlFor="whyChooseUsEyebrow">Small Tag Line</label>
            <input
              id="whyChooseUsEyebrow"
              value={form.whyChooseUsEyebrow}
              onChange={(e) => update('whyChooseUsEyebrow', e.target.value)}
              placeholder="e.g. Why patients choose us"
            />
          </div>
          <div className="form-group">
            <label htmlFor="whyChooseUsHeading">Heading</label>
            <input
              id="whyChooseUsHeading"
              value={form.whyChooseUsHeading}
              onChange={(e) => update('whyChooseUsHeading', e.target.value)}
              placeholder="e.g. Care built around your schedule"
            />
          </div>

          {form.whyChooseUsItems.map((item, i) => (
            <div
              key={i}
              className="card"
              style={{ marginBottom: 16, background: 'var(--color-sand)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong>Card {i + 1}</strong>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => removeWhyItem(i)}
                  style={{ padding: '4px 10px', fontSize: '0.85rem' }}
                >
                  Remove
                </button>
              </div>
              <div className="form-group">
                <label htmlFor={`whyTitle-${i}`}>Title</label>
                <input
                  id={`whyTitle-${i}`}
                  value={item.title}
                  onChange={(e) => updateWhyItem(i, 'title', e.target.value)}
                  placeholder="e.g. Instant Booking"
                />
              </div>
              <div className="form-group">
                <label htmlFor={`whyDesc-${i}`}>Description</label>
                <textarea
                  id={`whyDesc-${i}`}
                  value={item.description}
                  onChange={(e) => updateWhyItem(i, 'description', e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addWhyItem}
            style={{ marginBottom: 24 }}
          >
            + Add Card
          </button>

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
