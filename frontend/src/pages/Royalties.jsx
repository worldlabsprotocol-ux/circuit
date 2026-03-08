import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Connection, clusterApiUrl } from '@solana/web3.js';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Royalties() {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(2.5); // Mock lifetime earnings
  const [pendingEarnings, setPendingEarnings] = useState(1.3);
  const [royaltiesData, setRoyaltiesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const connection = new Connection(clusterApiUrl('devnet'));

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
      fetchRoyalties();
    }
  }, [connected, publicKey]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const bal = await connection.getBalance(publicKey);
      setBalance((bal / 1e9).toFixed(4)); // SOL with 4 decimals
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      setBalance('Error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoyalties = () => {
    // Mock data - in real version query your royalty program or token accounts
    setRoyaltiesData([
      {
        beatName: 'Neon Pulse',
        earnings: 0.5,
        status: 'Pending',
        collaborators: [{ name: 'You', share: 70 }, { name: 'Remixer1', share: 30 }],
      },
      {
        beatName: '808 Galaxy',
        earnings: 1.2,
        status: 'Claimed',
        collaborators: [{ name: 'You', share: 100 }],
      },
      {
        beatName: 'Solar Bounce',
        earnings: 0.8,
        status: 'Pending',
        collaborators: [{ name: 'You', share: 60 }, { name: 'VocalistX', share: 40 }],
      },
    ]);
  };

  const handleClaim = (beatName) => {
    alert(`Claiming royalties for "${beatName}" – Coming Soon! (Mock action)`);
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(135deg, #0a0f1a 0%, #000814 100%)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Header + Wallet Balance */}
      <div style={{ width: '100%', maxWidth: 900, marginBottom: '2rem', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(90deg, #00f0ff, #a78bfa, #ff6bcb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 1rem 0',
            textShadow: '0 0 40px rgba(0, 240, 255, 0.4)',
          }}
        >
          Royalties Dashboard
        </h1>

        {connected ? (
          <div
            style={{
              fontSize: '1.3rem',
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: 16,
              padding: '1rem 1.5rem',
              display: 'inline-block',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 30px rgba(0, 240, 255, 0.15)',
            }}
          >
            <strong>Wallet Balance:</strong> {loading ? 'Loading...' : `${balance || '0.00'} SOL`}
            <br />
            <span style={{ fontSize: '1rem', opacity: 0.8 }}>
              Lifetime Royalties Earned: <strong>{totalEarnings.toFixed(2)} SOL</strong> (Pending: {pendingEarnings.toFixed(2)} SOL)
            </span>
          </div>
        ) : (
          <div style={{ margin: '1rem 0' }}>
            <WalletMultiButton
              style={{
                background: 'linear-gradient(90deg, #00f0ff, #a78bfa)',
                color: '#000',
                padding: '14px 40px',
                borderRadius: 50,
                fontWeight: 600,
                boxShadow: '0 0 25px rgba(0, 240, 255, 0.5)',
                fontSize: '1.1rem',
              }}
            />
            <p style={{ marginTop: '1rem', opacity: 0.8 }}>
              Connect wallet to view your royalties
            </p>
          </div>
        )}
      </div>

      {/* Main Royalties Panel */}
      <div
        style={{
          background: 'rgba(0, 240, 255, 0.06)',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          borderRadius: 20,
          padding: '2rem',
          maxWidth: 900,
          width: '100%',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 12px 40px rgba(0, 240, 255, 0.12)',
        }}
      >
        <h2 style={{ fontSize: '2.2rem', color: '#00f0ff', marginBottom: '1.5rem', textShadow: '0 0 20px rgba(0, 240, 255, 0.4)' }}>
          Your Royalties
        </h2>

        {royaltiesData.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.8rem' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0.8rem 1rem', color: '#a78bfa', fontWeight: 600 }}>Beat Name</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem 1rem', color: '#a78bfa', fontWeight: 600 }}>Earnings</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem 1rem', color: '#a78bfa', fontWeight: 600 }}>Collaborators</th>
                  <th style={{ textAlign: 'center', padding: '0.8rem 1rem', color: '#a78bfa', fontWeight: 600 }}>Status</th>
                  <th style={{ textAlign: 'center', padding: '0.8rem 1rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {royaltiesData.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: 12,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}
                  >
                    <td style={{ padding: '1.2rem 1rem', borderTopLeftRadius: 12, borderBottomLeftRadius: 12, fontWeight: 500 }}>
                      {item.beatName}
                    </td>
                    <td style={{ padding: '1.2rem 1rem' }}>
                      <strong>{item.earnings.toFixed(2)} SOL</strong>
                    </td>
                    <td style={{ padding: '1.2rem 1rem', fontSize: '0.95rem', opacity: 0.9 }}>
                      {item.collaborators.map(c => `${c.name} (${c.share}%)`).join(', ')}
                    </td>
                    <td style={{ padding: '1.2rem 1rem', color: item.status === 'Pending' ? '#ffcc00' : '#00ff85' }}>
                      {item.status}
                    </td>
                    <td style={{ textAlign: 'center', padding: '1.2rem 1rem', borderTopRightRadius: 12, borderBottomRightRadius: 12 }}>
                      <button
                        disabled
                        onClick={() => handleClaim(item.beatName)}
                        style={{
                          padding: '10px 28px',
                          background: item.status === 'Pending' ? 'linear-gradient(90deg, #ff6bcb, #a78bfa)' : '#333',
                          border: 'none',
                          borderRadius: 50,
                          color: '#fff',
                          fontWeight: 600,
                          cursor: 'not-allowed',
                          opacity: 0.6,
                          boxShadow: item.status === 'Pending' ? '0 0 20px rgba(255,107,203,0.3)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                        title="Coming Soon – Royalties claiming launching soon!"
                      >
                        {item.status === 'Pending' ? 'Claim' : 'Claimed'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontSize: '1.3rem', opacity: 0.8, margin: '2rem 0' }}>
            No royalties earned yet. Create and mint beats in Studio to start earning!
          </p>
        )}

        {/* Embedded Google Form Waitlist */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          background: 'rgba(0, 240, 255, 0.06)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          borderRadius: 20,
          backdropFilter: 'blur(16px)',
          boxShadow: '0 12px 40px rgba(0, 240, 255, 0.15)',
        }}>
          <h3 style={{
            fontSize: '1.8rem',
            color: '#00f0ff',
            marginBottom: '1rem',
            textShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
          }}>
            Join the Royalties Waitlist
          </h3>

          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '1.5rem' }}>
            Be the first to know when on-chain royalty splits, auto-payouts, and the full dashboard go live.
          </p>

          {/* Your Google Form Embedded Here */}
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdmp6TE_mySRDgpt40oddhvsYM-Qs58Nvdt8QgS65lOgowiGA/viewform?embedded=true"
            width="100%"
            height="900"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Circuit Royalties Waitlist"
            style={{ borderRadius: 16, background: 'rgba(0,0,0,0.3)', minHeight: '600px' }}
          >
            Loading form...
          </iframe>

          <p style={{ marginTop: '1.5rem', fontSize: '0.95rem', opacity: 0.7 }}>
            Your data is private and will only be used for Circuit updates. Follow{' '}
            <a
              href="https://x.com/circuit808"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#00f0ff', textDecoration: 'underline', fontWeight: 600 }}
            >
              @circuit808
            </a>{' '}
            for launch updates.
          </p>
        </div>
      </div>

      <footer
        style={{
          marginTop: 'auto',
          padding: '3rem 0 1rem',
          fontSize: '0.95rem',
          opacity: 0.6,
          textAlign: 'center',
        }}
      >
        On-chain royalty splits • Automatic distribution • Powered by Solana Mobile • Built for independent artists
      </footer>
    </div>
  );
}