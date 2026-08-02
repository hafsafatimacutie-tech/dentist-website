import { useEffect, useState } from 'react';
import client from '../api/client';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/gallery?section=gallery')
      .then((res) => setImages(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section container">
      <span className="eyebrow">Take a look inside</span>
      <h1 style={{ marginBottom: 32 }}>Our Clinic</h1>

      {loading && <p>Loading photos…</p>}

      {!loading && images.length === 0 && (
        <p>Photos coming soon — check back shortly.</p>
      )}

      <div className="grid grid-3">
        {images.map((img) => (
          <div key={img._id} style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-soft)' }}>
            <img
              src={img.url}
              alt={img.caption || 'Clinic photo'}
              style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }}
            />
            {img.caption && (
              <div style={{ padding: '10px 14px', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                {img.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
