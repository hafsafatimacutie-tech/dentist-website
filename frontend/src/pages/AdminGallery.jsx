import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const IMAGE_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [section, setSection] = useState('gallery');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  function loadImages() {
    client.get('/gallery').then((res) => setImages(res.data)).catch(() => {});
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function handleUpload(e) {
    e.preventDefault();
    setError('');
    if (!file) {
      setError('Please choose an image file first.');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);
    formData.append('section', section);

    setUploading(true);
    try {
      await client.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFile(null);
      setCaption('');
      loadImages();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Try a smaller image (max 5MB), JPEG/PNG/WEBP/GIF only.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this image?')) return;
    try {
      await client.delete(`/gallery/${id}`);
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch {
      setError('Could not delete image.');
    }
  }

  return (
    <div className="section container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1 style={{ margin: 0 }}>Manage Photos</h1>
        </div>
        <Link to="/admin/dashboard" className="btn btn-secondary">← Back to Bookings</Link>
      </div>

      <form onSubmit={handleUpload} className="card" style={{ marginBottom: 32 }}>
        <div className="form-group">
          <label htmlFor="image">Choose Image (JPEG, PNG, WEBP, or GIF — max 5MB)</label>
          <input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="caption">Caption (optional)</label>
            <input id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Our reception area" />
          </div>
          <div className="form-group">
            <label htmlFor="section">Where should this appear?</label>
            <select id="section" value={section} onChange={(e) => setSection(e.target.value)}>
              <option value="gallery">Gallery Page</option>
              <option value="about">About Page</option>
              <option value="hero">Homepage Feature</option>
            </select>
          </div>
        </div>
        {error && <p style={{ color: 'var(--color-coral-dark)' }}>{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {uploading ? 'Uploading…' : 'Upload Photo'}
        </button>
      </form>

      <h3 style={{ marginBottom: 16 }}>Uploaded Photos ({images.length})</h3>
      <div className="grid grid-3">
        {images.map((img) => (
          <div key={img._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <img
              src={`${IMAGE_BASE}/uploads/${img.filename}`}
              alt={img.caption || 'Uploaded photo'}
              style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
            />
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: 8 }}>
                {img.section} {img.caption && `— ${img.caption}`}
              </div>
              <button
                onClick={() => handleDelete(img._id)}
                className="btn"
                style={{ background: 'transparent', color: 'var(--color-coral-dark)', border: '1.5px solid var(--color-coral-dark)', padding: '6px 14px', fontSize: '0.8rem' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && <p>No photos uploaded yet — add your first one above.</p>}
    </div>
  );
}
