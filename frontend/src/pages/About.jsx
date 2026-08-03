import { useEffect, useState } from 'react';
import client from '../api/client';

export default function About() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/settings')
      .then((res) => setSettings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section container" style={{ maxWidth: 760 }}>
      <span className="eyebrow">About the clinic</span>
      <h1>Care from someone who remembers your name.</h1>
      {loading && <p>Loading…</p>}
      {settings && (
        <p style={{ fontSize: '1.05rem', whiteSpace: 'pre-line' }}>{settings.aboutText}</p>
      )}
      <p>
        We treat patients of all ages — from a child's first check-up to routine care for
        grandparents — with the same attention to comfort and detail.
      </p>
      <h3 style={{ marginTop: 40 }}>Our Approach</h3>
      <p>
        Every treatment plan starts with listening. We don't push procedures you don't need,
        and we always walk you through cost and timeline before starting any work.
      </p>
    </div>
  );
}
