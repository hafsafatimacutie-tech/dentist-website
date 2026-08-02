import { useEffect, useState } from 'react';
import client from '../api/client';

export default function Contact() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/settings')
      .then((res) => setSettings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section container" style={{ maxWidth: 640 }}>
      <span className="eyebrow">Get in touch</span>
      <h1 style={{ marginBottom: 24 }}>Visit or reach out</h1>
      {loading && <p>Loading…</p>}
      {settings && (
        <div className="card">
          <p><strong>Address:</strong> {settings.address}</p>
          <p><strong>Phone:</strong> {settings.phone}</p>
          <p><strong>Email:</strong> {settings.email}</p>
          <p><strong>Hours:</strong> {settings.hours}</p>
        </div>
      )}
    </div>
  );
}
