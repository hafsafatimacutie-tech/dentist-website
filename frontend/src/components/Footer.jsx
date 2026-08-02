export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-forest)', color: '#EDE7DA', padding: '40px 0', marginTop: 64 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 6 }}>Bright Smile Dental Clinic</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.75 }}>Quality dental care for your whole family.</div>
        </div>
        <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>
          <div>123 Clinic Road, Hyderabad</div>
          <div>+91 90000 00000</div>
          <div>hello@brightsmile.example</div>
        </div>
      </div>
      <div className="container" style={{ marginTop: 24, fontSize: '0.75rem', opacity: 0.5 }}>
        © {new Date().getFullYear()} Bright Smile Dental Clinic. All rights reserved.
      </div>
    </footer>
  );
}
