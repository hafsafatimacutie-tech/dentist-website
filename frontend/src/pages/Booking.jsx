import { useEffect, useState } from 'react';
import client from '../api/client';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

export default function Booking() {
  const [services, setServices] = useState([]);
  const [takenSlots, setTakenSlots] = useState([]);
  const [form, setForm] = useState({
    patientName: '', phone: '', email: '', service: '', date: '', time: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    client.get('/services').then((res) => setServices(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.date) {
      setTakenSlots([]);
      return;
    }
    client.get(`/bookings/taken-slots/${form.date}`)
      .then((res) => setTakenSlots(res.data))
      .catch(() => setTakenSlots([]));
  }, [form.date]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!form.patientName || !form.phone || !form.email || !form.service || !form.date || !form.time) {
      setStatus({ type: 'error', message: 'Please fill in all fields before booking.' });
      return;
    }

    setSubmitting(true);
    try {
      await client.post('/bookings', form);
      setStatus({ type: 'success', message: 'Your appointment request has been received! We\'ll confirm shortly by phone or email.' });
      setForm({ patientName: '', phone: '', email: '', service: '', date: '', time: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="section container" style={{ maxWidth: 640 }}>
      <span className="eyebrow">Book an appointment</span>
      <h1 style={{ marginBottom: 8 }}>Reserve your visit</h1>
      <p style={{ marginBottom: 32 }}>Fill in your details and pick a time that works — we'll confirm your slot shortly.</p>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label htmlFor="patientName">Full Name</label>
          <input
            id="patientName"
            value={form.patientName}
            onChange={(e) => update('patientName', e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="+91 90000 00000"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="service">Service</label>
          <select id="service" value={form.service} onChange={(e) => update('service', e.target.value)}>
            <option value="">Select a treatment</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>{s.name} — ₹{s.price}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Preferred Date</label>
          <input
            id="date"
            type="date"
            min={todayStr}
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
          />
        </div>

        {form.date && (
          <div className="form-group">
            <label>Preferred Time</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TIME_SLOTS.map((slot) => {
                const taken = takenSlots.includes(slot);
                const selected = form.time === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    disabled={taken}
                    onClick={() => update('time', slot)}
                    style={{
                      padding: '9px 14px',
                      borderRadius: 999,
                      border: '1.5px solid var(--color-border)',
                      background: selected ? 'var(--color-forest)' : taken ? '#F0EEE8' : '#fff',
                      color: selected ? '#fff' : taken ? '#B8B3A6' : 'var(--color-ink)',
                      cursor: taken ? 'not-allowed' : 'pointer',
                      fontSize: '0.85rem',
                      textDecoration: taken ? 'line-through' : 'none',
                    }}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {status.message && (
          <p style={{ color: status.type === 'error' ? 'var(--color-coral-dark)' : 'var(--color-forest)', fontWeight: 500 }}>
            {status.message}
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', marginTop: 8 }}>
          {submitting ? 'Booking…' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
}
