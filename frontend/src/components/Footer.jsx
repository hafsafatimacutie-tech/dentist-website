import { useEffect, useState } from 'react';
import client from '../api/client';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    client.get('/settings').then((res) => setSettings(res.data)).catch(() => {});
  }, []);

  const clinicName = settings?.clinicName || 'SmileFit Dental Studio';

  return (
    <footer style={{ background: 'var(--color-forest)', color: '#EDE7DA', padding: '40px 0', marginTop: 64 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 6 }}>{clinicName}</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.75 }}>Quality dental care for your whole family.</div>
        </div>
        {settings && (
          <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>
            <div>{settings.address}</div>
            <div>{settings.phone}</div>
            <div>{settings.email}</div>
          </div>
        )}
      </div>
      <div className="container" style={{ marginTop: 24, fontSize: '0.75rem', opacity: 0.5 }}>
        © {new Date().getFullYear()} {clinicName}. All rights reserved.
      </div>
    </footer>
  );
}
