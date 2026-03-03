import React from 'react';

export default function Royalties() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0f1a 0%, #000814 100%)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '3.8rem',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(90deg, #00f0ff, #a78bfa, #ff6bcb)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 1rem 0',
          textShadow: '0 0 40px rgba(0, 240, 255, 0.4)',
        }}
      >
        Royalties
      </h1>

      <p
        style={{
          fontSize: '1.4rem',
          maxWidth: '600px',
          opacity: 0.9,
          margin: '0 0 2.5rem 0',
          lineHeight: 1.6,
        }}
      >
        On-chain royalty splits, instant splits with collaborators, transparent distribution - powered by Solana.
        <br />
        <span style={{ fontWeight: 600, color: '#00f0ff' }}>
          Coming Soon
        </span>{' '}
        - join the waitlist to be first.
      </p>

      <div
        style={{
          background: 'rgba(0, 240, 255, 0.08)',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          borderRadius: 16,
          padding: '1.5rem 2.5rem',
          maxWidth: '520px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 240, 255, 0.12)',
        }}
      >
        <div
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#00f0ff',
            marginBottom: '1rem',
            textShadow: '0 0 20px rgba(0, 240, 255, 0.5)',
          }}
        >
          Coming Soon
        </div>

        <p style={{ fontSize: '1.1rem', opacity: 0.85, margin: '0 0 1.5rem 0' }}>
          Real-time royalty tracking • Automatic splits • Cross-platform distribution • UnitedMasters-style dashboard meets Solana speed.
        </p>

        <a
          href="https://x.com/circuit8888"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '14px 48px',
            fontSize: '1.1rem',
            fontWeight: 600,
            background: 'linear-gradient(90deg, #00f0ff, #a78bfa)',
            border: 'none',
            borderRadius: 50,
            color: '#000',
            textDecoration: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(0, 240, 255, 0.5)',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Notify Me When Live
        </a>
      </div>

      <p
        style={{
          marginTop: '4rem',
          fontSize: '0.95rem',
          opacity: 0.6,
        }}
      >
        Built for independent artists • Powered by Solana • Designed with love by Circuit Studio
      </p>
    </div>
  );
}