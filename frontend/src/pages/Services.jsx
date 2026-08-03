import { useEffect, useState } from 'react';
import client from '../api/client';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/services')
      .then((res) => setServices(res.data))
      .catch(() => setError('Could not load services right now. Please try again shortly.'))
      .finally(() => setLoading(false));
  }, []);

  // Group services by category, preserving first-seen category order
  const categoryOrder = [];
  const grouped = {};
  services.forEach((s) => {
    const cat = s.category || 'Other';
    if (!grouped[cat]) {
      grouped[cat] = [];
      categoryOrder.push(cat);
    }
    grouped[cat].push(s);
  });

  return (
    <div className="section container">
      <span className="eyebrow">Treatments</span>
      <h1 style={{ marginBottom: 32 }}>Our Services</h1>

      {loading && <p>Loading services…</p>}
      {error && <p style={{ color: 'var(--color-coral-dark)' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {categoryOrder.map((cat) => (
          <details key={cat} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <summary
              style={{
                cursor: 'pointer',
                listStyle: 'none',
                padding: '18px 24px',
                fontWeight: 600,
                fontSize: '1.05rem',
                color: 'var(--color-forest)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {cat}
              <span aria-hidden="true" style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>▾</span>
            </summary>
            <div style={{ padding: '0 24px 20px' }}>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {grouped[cat].map((s) => (
                  <li key={s._id} style={{ marginBottom: 10 }}>
                    <span style={{ fontWeight: 500 }}>{s.name}</span>
                    {s.description && (
                      <div style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }}>{s.description}</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>

      {!loading && !error && services.length === 0 && (
        <p>No services listed yet. Please check back soon.</p>
      )}
    </div>
  );
}

