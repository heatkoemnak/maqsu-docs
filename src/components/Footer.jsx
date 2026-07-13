import React from 'react';

const Footer = () => {
  const styles = {
    footer: {
      width: '100%',
      backgroundColor: 'var(--footer-bg)',
      color: 'var(--footer-text)',
      transition: 'all 0.3s ease',
      borderTop: '1px solid var(--border-color)',
      marginTop: '50px',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '14px 20px',
      gap: '12px',
    },
    copyright: {
      fontSize: '13px',
      opacity: '0.8',
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



