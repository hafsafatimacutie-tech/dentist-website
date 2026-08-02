import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const IMAGE_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

export default function Home() {
  const [galleryPreview, setGalleryPreview] = useState([]);

  useEffect(() => {
    client.get('/gallery?section=gallery')
      .then((res) => setGalleryPreview(res.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Full-bleed hero with real background photo */}
      <section
        style={{
          position: 'relative',
          minHeight: '78vh',
          display: 'flex',
          alignItems: 'flex-end',
          backgroundImage:
            'linear-gradient(180deg, rgba(20,36,26,0.15) 0%, rgba(20,36,26,0.75) 100%), url(https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1600&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container" style={{ paddingBottom: 72, paddingTop: 140 }}>
          <span
            className="eyebrow"
            style={{ color: '#F3E9DA', background: 'rgba(255,255,255,0.12)', padding: '6px 14px', borderRadius: 999 }}
          >
            ✦ Newly opened in Hyderabad — now welcoming patients
          </span>
          <h1 style={{ color: '#fff', maxWidth: 640, marginTop: 18 }}>
            A brand-new clinic, built around your comfort from day one.
          </h1>
          <p style={{ color: '#EDE7DA', fontSize: '1.1rem', maxWidth: 520 }}>
            We just opened our doors — modern equipment, a calm space, and a
            team that takes the time to explain every step. Be one of our first patients.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 28 }}>
            <Link to="/booking" className="btn btn-primary">Book an Appointment</Link>
            <Link to="/services" className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}>
              View Services
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-sand)' }}>
        <div className="container">
          <span className="eyebrow">Why patients choose us</span>
          <h2 style={{ marginBottom: 32 }}>Care built around your schedule</h2>
          <div className="grid grid-3">
            <div className="card">
              <h3>Instant Booking</h3>
              <p>Pick a service, pick a slot, done — no back-and-forth calls to find a time that works.</p>
            </div>
            <div className="card">
              <h3>Transparent Pricing</h3>
              <p>Every treatment is listed with clear pricing upfront, so there's never a surprise at checkout.</p>
            </div>
            <div className="card">
              <h3>Gentle, Modern Care</h3>
              <p>Modern equipment and a calm, judgment-free environment — especially for anxious first visits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery preview - pulls real uploaded images if any exist */}
      {galleryPreview.length > 0 && (
        <section className="section">
          <div className="container">
            <span className="eyebrow">Inside our clinic</span>
            <h2 style={{ marginBottom: 32 }}>A space designed to put you at ease</h2>
            <div className="grid grid-3">
              {galleryPreview.map((img) => (
                <div key={img._id} style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-soft)' }}>
                  <img
                    src={`${IMAGE_BASE}/uploads/${img.filename}`}
                    alt={img.caption || 'Clinic photo'}
                    style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <Link to="/gallery" className="btn btn-secondary">View Full Gallery</Link>
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2>Ready when you are.</h2>
          <p style={{ maxWidth: 480, margin: '0 auto 24px' }}>
            Booking takes less than two minutes. Choose your treatment and preferred time below.
          </p>
          <Link to="/booking" className="btn btn-primary">Book Appointment</Link>
        </div>
      </section>
    </div>
  );
}
