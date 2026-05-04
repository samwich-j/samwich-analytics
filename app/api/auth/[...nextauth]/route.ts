import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { timingSafeEqual } from 'crypto';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Passphrase',
      credentials: {
        passphrase: { label: 'Passphrase', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.passphrase || !process.env.ADMIN_PASSPHRASE) return null;
        const provided = Buffer.from(credentials.passphrase);
        const expected = Buffer.from(process.env.ADMIN_PASSPHRASE);
        if (provided.length !== expected.length) return null;
        if (!timingSafeEqual(provided, expected)) return null;
        return { id: '1', name: 'Sam' };
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/login' },
});

export { handler as GET, handler as POST };
