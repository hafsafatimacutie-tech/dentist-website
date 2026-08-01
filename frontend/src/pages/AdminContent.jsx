import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const DEFAULTS = {
  hero: { title: 'A brand-new clinic, built around your comfort from day one.', subtitle: 'Modern care, calm surroundings, and appointments that fit your schedule.' },
  about: { title: 'About our clinic', subtitle: 'Patient-first care in a warm, welcoming space.' },
  contact: { title: 'Contact us', subtitle: 'We would love to hear from you.' },
  footer: {
    title: 'SmileFit Dental Studio',
    subtitle: 'Quality dental care for your whole family.',
    body: '123 Clinic Road, Hyderabad',
    contactText: '+91 90000 00000\nhello@smilefit.example',
    rightsText: '© 2026 SmileFit Dental Studio. All rights reserved.'
  }
};

export default function AdminContent() {
  const [content, setContent] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/content')
      .then((res) => {
        const next = { ...DEFAULTS, ...(res.data || {}) };
        setContent({
          hero: { ...DEFAULTS.hero, ...(next.hero || {}) },
          about: { ...DEFAULTS.about, ...(next.about || {}) },
          contact: { ...DEFAULTS.contact, ...(next.contact || {}) },
          footer: { ...DEFAULTS.footer, ...(next.footer || {}) }
        });
      })
      .catch(() => setError('Could not load content.'))
      .finally(() => setLoading(false));
  }, []);

  async function saveSection(section) {
    setSaving(true);
    setError('');
    try {
      await client.put(`/content/${section}`, content[section]);
    } catch {
      setError('Could not save content.');
    } finally {
      setSaving(false);
    }
  }

  function updateField(section, field, value) {
    setContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  }

  return (
    <div className="section container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1 style={{ margin: 0 }}>Manage Website Content</h1>
        </div>
        <Link to="/admin/dashboard" className="btn btn-secondary">← Back to Dashboard</Link>
      </div>

      {loading && <p>Loading content…</p>}
      {error && <p style={{ color: 'var(--color-coral-dark)' }}>{error}</p>}

      {Object.entries(content).map(([section, values]) => (
        <div key={section} className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ textTransform: 'capitalize', marginTop: 0 }}>{section} section</h3>
          <div className="form-group">
            <label>Title</label>
            <input
              value={values.title || ''}
              onChange={(e) => updateField(section, 'title', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Subtitle</label>
            <textarea
              rows="3"
              value={values.subtitle || ''}
              onChange={(e) => updateField(section, 'subtitle', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{section === 'footer' ? 'Address' : 'Body'}</label>
            <textarea
              rows="5"
              value={values.body || ''}
              onChange={(e) => updateField(section, 'body', e.target.value)}
            />
          </div>
          {section === 'footer' && (
            <>
              <div className="form-group">
                <label>Contact details</label>
                <textarea
                  rows="4"
                  value={values.contactText || ''}
                  onChange={(e) => updateField(section, 'contactText', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Rights text</label>
                <input
                  value={values.rightsText || ''}
                  onChange={(e) => updateField(section, 'rightsText', e.target.value)}
                />
              </div>
            </>
          )}
          <button className="btn btn-primary" onClick={() => saveSection(section)} disabled={saving}>
            {saving ? 'Saving…' : `Save ${section}`}
          </button>
        </div>
      ))}
    </div>
  );
}
