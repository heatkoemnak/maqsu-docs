import React from 'react';

const Footer = () => {
  const [theme, setTheme] = React.useState('dark');

  // Load saved theme on mount
  React.useEffect(() => {
    const savedTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const styles = {
    footer: {
      width: '100%',
      backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
      color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
      transition: 'all 0.3s ease',
      borderTop: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
      marginTop: '50px',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      gap: '12px',
    },
    copyright: {
      fontSize: '13px',
      opacity: '0.6',
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.copyright}>
          © {new Date().getFullYear()} MAQSU Documentation. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;



