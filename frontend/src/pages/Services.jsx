import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

  return (
    <div className="section container">
      <span className="eyebrow">Treatments</span>
      <h1 style={{ marginBottom: 32 }}>Our Services</h1>

      {loading && <p>Loading services…</p>}
      {error && <p style={{ color: 'var(--color-coral-dark)' }}>{error}</p>}

      <div className="grid grid-3">
        {services.map((s) => (
          <div className="card" key={s._id}>
            <h3>{s.name}</h3>
            <p>{s.description}</p>
            <div style={{ fontWeight: 600, color: 'var(--color-forest)', marginBottom: 12 }}>
              ₹{s.price} · {s.durationMinutes} min
            </div>
            <Link to="/booking" className="btn btn-secondary" style={{ padding: '9px 18px', fontSize: '0.85rem' }}>
              Book This
            </Link>
          </div>
        ))}
      </div>

      {!loading && !error && services.length === 0 && (
        <p>No services listed yet. Please check back soon.</p>
      )}
    </div>
  );
}
