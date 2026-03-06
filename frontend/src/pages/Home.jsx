import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const loadParticles = async () => {
      await import('https://cdn.jsdelivr.net/npm/@tsparticles/engine@3/tsparticles.engine.min.js');
      await import('https://cdn.jsdelivr.net/npm/tsparticles-preset-stars@3/tsparticles.preset.stars.min.js');

      window.tsParticles.load('tsparticles', {
        preset: 'stars',
        background: { color: { value: 'transparent' } },
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: ['#00f0ff', '#a78bfa', '#ff6bcb', '#00aaff'] },
          shape: { type: 'circle' },
          opacity: {
            value: { min: 0.1, max: 0.6 },
            animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false },
          },
          size: {
            value: { min: 1, max: 4 },
            animation: { enable: true, speed: 2, minimumValue: 0.5, sync: false },
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: 'none',
            random: true,
            straight: false,
            outModes: 'out',
            attract: { enable: true, rotateX: 600, rotateY: 1200 },
          },
          links: { enable: false },
          glow: { enable: true, color: { value: '#00f0ff' }, opacity: 0.4 },
        },
        interactivity: {
          events: { onHover: { enable: true, mode: 'grab' }, resize: true },
          modes: { grab: { distance: 180, links: { opacity: 0.4 } } },
        },
        detectRetina: true,
      });
    };

    loadParticles().catch(console.error);

    return () => {
      window.tsParticles?.domItem(0)?.destroy();
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes glow {
          from { text-shadow: 0 0 30px rgba(0,240,255,0.4); }
          to   { text-shadow: 0 0 70px rgba(0,240,255,0.8); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.04); }
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        style={{
          minHeight: '100dvh',
          background: 'linear-gradient(135deg, #0a001f 0%, #000814 100%)',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* tsParticles background */}
        <div
          id="tsparticles"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Hero Content - now takes full vertical space since nav is removed */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(3.5rem, 9vw, 7.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(90deg, #00f0ff, #a78bfa, #ff6bcb, #00f0ff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: '#00f0ff',
              margin: '0 0 1.2rem 0',
              textShadow: '0 0 60px rgba(0, 240, 255, 0.6)',
              animation: 'glow 5s ease-in-out infinite alternate, fadeIn 1s ease-out',
            }}
          >
            CIRCUIT
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.3rem, 4.5vw, 2rem)',
              maxWidth: '780px',
              margin: '0 auto 1.8rem auto',
              lineHeight: 1.5,
              opacity: 0.92,
              fontWeight: 400,
              animation: 'fadeIn 1.2s ease-out',
            }}
          >
            Create, collaborate, and monetize on Solana with instant on-chain royalty splits.  
            The operating system for modern artists.
          </p>

          {/* Social Proof */}
          <div
            style={{
              margin: '1.5rem 0 2.5rem 0',
              fontSize: 'clamp(1rem, 3vw, 1.15rem)',
              opacity: 0.9,
              lineHeight: 1.6,
              maxWidth: '700px',
              animation: 'fadeIn 1.4s ease-out',
            }}
          >
            <div>Trusted by 800+ artists • $3.4M+ royalties split on-chain (2026)</div>
            <div>Built on Solana • Instant splits • No middlemen • Secure & decentralized</div>
          </div>

          {/* CTA Buttons - Main entry point */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              justifyContent: 'center',
              margin: '1rem 0 2rem 0',
              animation: 'fadeIn 1.6s ease-out',
            }}
          >
            <a
              href="/circuit"
              style={{
                padding: '18px 56px',
                fontSize: '1.35rem',
                fontWeight: 700,
                background: 'linear-gradient(90deg, #00f0ff, #00aaff)',
                color: '#000',
                borderRadius: 50,
                textDecoration: 'none',
                boxShadow: '0 0 35px rgba(0, 240, 255, 0.6)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                animation: 'pulse 2s infinite',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.boxShadow = '0 0 60px rgba(0, 240, 255, 0.9)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 240, 255, 0.6)';
              }}
            >
              Enter Circuit Studio →
            </a>

            <a
              href="https://x.com/circuit808"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '18px 48px',
                fontSize: '1.35rem',
                fontWeight: 700,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(0,240,255,0.45)',
                color: '#00f0ff',
                borderRadius: 50,
                textDecoration: 'none',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(0,240,255,0.18)';
                e.currentTarget.style.borderColor = '#00f0ff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.borderColor = 'rgba(0,240,255,0.45)';
              }}
            >
              Follow @circuit808
            </a>
          </div>

          {/* Wallet Connect Teaser with Coming Soon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '1.15rem',
              opacity: 0.9,
              marginBottom: '3rem',
              background: 'rgba(0,240,255,0.08)',
              padding: '12px 24px',
              borderRadius: 50,
              border: '1px solid rgba(0,240,255,0.3)',
              backdropFilter: 'blur(8px)',
              animation: 'fadeIn 1.8s ease-out',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,240,255,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span>Connect wallet & start creating royalty-smart beats</span>
            <span
              style={{
                background: 'linear-gradient(90deg, #ff6bcb, #a78bfa)',
                color: '#000',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: '0.9rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 0 15px rgba(255,107,203,0.5)',
              }}
            >
              Coming Soon
            </span>
          </div>

          {/* Scrolling marquee */}
          <div
            style={{
              width: '100%',
              overflow: 'hidden',
              marginBottom: '4rem',
              opacity: 0.7,
              fontSize: '1.1rem',
              whiteSpace: 'nowrap',
              animation: 'fadeIn 2s ease-out',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                animation: 'marquee 25s linear infinite',
              }}
            >
              KAIROS • NeonPulse • Luna808 • VoidBeats • AstroVibes • EchoChain • SpectralFlow • QuantumDrift • Circuit x Solana Artists • ...
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              KAIROS • NeonPulse • Luna808 • VoidBeats • AstroVibes • EchoChain • SpectralFlow • QuantumDrift • Circuit x Solana Artists • ...
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            padding: '1rem 2rem',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(0,240,255,0.15)',
            fontSize: '0.95rem',
            opacity: 0.9,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            animation: 'fadeIn 2.2s ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            Powered by Solana
          </div>

          <div style={{ display: 'flex', gap: '1.8rem' }}>
            <a href="/docs" style={{ color: '#00f0ff', textDecoration: 'none' }}>Docs</a>
            <a href="https://x.com/circuit808" style={{ color: '#00f0ff', textDecoration: 'none' }}>Twitter/X</a>
            <a href="#" style={{ color: '#00f0ff', textDecoration: 'none' }}>Discord</a>
            <a href="#" style={{ color: '#00f0ff', textDecoration: 'none' }}>GitHub</a>
          </div>

          <div>Audited • Secure • Decentralized</div>
        </footer>
      </div>
    </>
  );
}