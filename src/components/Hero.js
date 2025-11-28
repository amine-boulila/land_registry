export default function Hero() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      paddingTop: '80px'
    }}>
      <div className="container">
        <h1 style={{ fontSize: '4.5rem', marginBottom: '24px' }}>
          The Future of <br />
          <span style={{ color: '#7b3fe4', WebkitTextFillColor: '#7b3fe4' }}>Land Ownership</span>
        </h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 48px' }}>
          Secure, transparent, and immutable land registry powered by blockchain technology. 
          Buy, sell, and manage property with confidence.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <a href="/dashboard" className="glass-button" style={{ fontSize: '1.1rem', padding: '16px 32px' }}>
            Launch App
          </a>
          <a href="#features" className="glass-button" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
