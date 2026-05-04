'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

export default function LoginPage() {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      passphrase,
      redirect: false,
    });

    setLoading(false);

    if (result?.ok) {
      router.push('/planner');
    } else {
      setError('Incorrect passphrase. Please try again.');
      setPassphrase('');
    }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100%', padding: 24,
    }}>
      <div style={{
        width: '100%', maxWidth: 380,
        background: 'var(--sidebar-bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 32px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Icon name="lock" size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            Sign in
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textAlign: 'center' }}>
            Enter your passphrase to access Planner & Notes
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            placeholder="Passphrase"
            value={passphrase}
            onChange={e => setPassphrase(e.target.value)}
            autoFocus
            style={{
              width: '100%', padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${error ? 'var(--danger, #c0392b)' : 'var(--border)'}`,
              background: 'var(--bg)', color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)', outline: 'none',
              fontFamily: 'var(--font-ui)', boxSizing: 'border-box',
            }}
          />

          {error && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--danger, #c0392b)', margin: 0 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !passphrase}
            style={{
              width: '100%', padding: '11px 0',
              borderRadius: 'var(--radius-md)',
              background: loading || !passphrase ? 'var(--border)' : 'var(--accent)',
              color: loading || !passphrase ? 'var(--text-muted)' : '#fff',
              border: 'none', fontWeight: 600,
              fontSize: 'var(--text-sm)', cursor: loading || !passphrase ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-ui)', transition: 'all var(--trans-fast)',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
