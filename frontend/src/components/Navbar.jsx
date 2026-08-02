import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header style={styles.header}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.logo}>Bright Smile</Link>
        <nav style={styles.nav}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                ...styles.link,
                color: location.pathname === l.to ? 'var(--color-coral)' : 'var(--color-forest)'
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link to="/booking" className="btn btn-primary" style={{ padding: '10px 22px' }}>
          Book Appointment
        </Link>
      </div>
    </header>
  );
}

const styles = {
  header: {
    borderBottom: '1px solid var(--color-border)',
    background: 'rgba(250, 247, 241, 0.92)',
    backdropFilter: 'blur(6px)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '1.3rem',
    color: 'var(--color-forest)',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    gap: 28,
  },
  link: {
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '0.95rem',
  },
};
