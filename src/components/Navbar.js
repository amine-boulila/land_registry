'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  return (
    <nav className="glass-panel" style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '1200px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
      padding: '16px 32px'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #fff, #7b3fe4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        <Link href="/">LandRegistry</Link>
      </div>
      
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 500 }}>Home</Link>
        <Link href="/dashboard" style={{ fontWeight: 500 }}>Dashboard</Link>
        <ConnectButton />
      </div>
    </nav>
  );
}
