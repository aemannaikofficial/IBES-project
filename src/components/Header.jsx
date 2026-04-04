const Header = () => {
  return (
    <header className="header fade-in" style={{ 
      textAlign: 'center', 
      padding: '40px 20px', 
      background: 'white', 
      borderBottom: '4px solid var(--ibes-gold)',
      marginBottom: '32px',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <img src="/ibes-logo.png" alt="IBES Logo" style={{ height: '80px', marginBottom: '16px' }} />
      <p style={{ 
        color: 'var(--ibes-navy)', 
        fontSize: '15px', 
        fontWeight: '500', 
        fontStyle: 'italic',
        maxWidth: '600px',
        margin: '0 auto 24px',
        lineHeight: '1.6',
        letterSpacing: '0.3px'
      }}>
        "Developing people with skills and knowledge that equip them for current and future employment"
      </p>
      <div style={{ height: '2px', background: 'linear-gradient(to right, transparent, var(--ibes-gold), transparent)', width: '200px', margin: '0 auto 24px' }}></div>
      <h1 style={{ 
        fontFamily: 'var(--font-display)', 
        color: 'var(--ibes-navy-dark)', 
        fontSize: '36px', 
        fontWeight: '800', 
        textTransform: 'uppercase',
        letterSpacing: '2px',
        margin: 0
      }}>
        Application Form
      </h1>
    </header>
  );
};

export default Header;
