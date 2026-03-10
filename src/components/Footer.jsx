import React from 'react';

const Footer = () => {
  const [theme, setTheme] = React.useState('dark');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const styles = {
    footer: {
      width: '100%',
      backgroundColor: theme === 'dark' ? '#35576d' : '#f1f5f9',
      color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
      transition: 'all 0.3s ease',

    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '16px 24px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      borderBottom: theme === 'dark' ? '1px solid rgba(100, 116, 139, 0.3)' : '1px solid rgba(100, 116, 139, 0.2)',
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      flexWrap: 'wrap',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'none',
      border: 'none',
      color: 'inherit',
      cursor: 'pointer',
      fontSize: '14px',
      padding: '4px 8px',
      borderRadius: '4px',
      transition: 'opacity 0.2s ease',
    },
    privacyIcon: {
      width: '20px',
      height: '20px',
      backgroundColor: '#2563eb',
      borderRadius: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    icon: {
      width: '18px',
      height: '18px',
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      flexWrap: 'wrap',
      fontSize: '14px',
    },
    link: {
      color: 'inherit',
      textDecoration: 'none',
      transition: 'text-decoration 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    externalIcon: {
      fontSize: '11px',
    },
    copyright: {
      color: theme === 'dark' ? '#94a3b8' : '#64748b',
    },
  };

  const GlobeIcon = () => (
    <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );

  const MoonIcon = () => (
    <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );

  const SunIcon = () => (
    <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Left Section - Language & Privacy */}
        <div style={styles.leftSection}>
          <button
            style={styles.button}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <GlobeIcon />
            <span>English (United States)</span>
          </button>

          {/* <button
            style={styles.button}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <div style={styles.privacyIcon}>✓</div>
            <span>Your Privacy Choices</span>
          </button> */}

          <button
            style={styles.button}
            onClick={toggleTheme}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
            <span>Theme</span>
          </button>
        </div>

        {/* Right Section - Links */}
        <div style={styles.rightSection}>

          <a
            href="/support"
            style={styles.link}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            Support
          </a>
          <a
            href="#"
            style={styles.link}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            Privacy
            <span style={styles.externalIcon}>↗</span>
          </a>
          <a
            href="#"
            style={styles.link}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            Terms of Use
          </a>

          <span style={styles.copyright}>© MAQSU 2026</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;