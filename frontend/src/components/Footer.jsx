import { useEffect, useState } from 'react';
import client from '../api/client';

const DEFAULT_FOOTER = {
  title: 'SmileFit Dental Studio',
  subtitle: 'Quality dental care for your whole family.',
  body: '123 Clinic Road, Hyderabad',
  contactText: '+91 90000 00000\nhello@smilefit.example',
  rightsText: `© ${new Date().getFullYear()} SmileFit Dental Studio. All rights reserved.`
};

export default function Footer() {
  const [footer, setFooter] = useState(DEFAULT_FOOTER);

  useEffect(() => {
    client.get('/content')
      .then((res) => {
        const next = res.data?.footer || {};
        setFooter({
          ...DEFAULT_FOOTER,
          ...next,
          contactText: next.contactText || DEFAULT_FOOTER.contactText,
          rightsText: next.rightsText || DEFAULT_FOOTER.rightsText
        });
      })
      .catch(() => {
        // Keep the default footer text if the content service is unavailable.
      });
  }, []);

  const contactLines = (footer.contactText || '').split('\n').filter(Boolean);

  return (
    <footer style={{ background: 'var(--color-forest)', color: '#F5F9FF', padding: '40px 0', marginTop: 64 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 6 }}>{footer.title}</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.75 }}>{footer.subtitle}</div>
        </div>
        <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>
          {footer.body && <div>{footer.body}</div>}
          {contactLines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </div>
      <div className="container" style={{ marginTop: 24, fontSize: '0.75rem', opacity: 0.5 }}>
        {footer.rightsText}
      </div>
    </footer>
  );
}
