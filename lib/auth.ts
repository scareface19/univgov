import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getDb, Collections } from './mongodb';
import { User } from './types';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('[AUTH] Missing credentials');
            return null;
          }

          console.log(`[AUTH] Tentative de connexion pour: ${credentials.email}`);
          const db = await getDb();
          const user = await db
            .collection<User>(Collections.USERS)
            .findOne({ email: credentials.email });

          if (!user) {
            console.error(`[AUTH] User not found: ${credentials.email}`);
            return null;
          }

          console.log(`[AUTH] User found: ${user.email}, Active: ${user.isActive}, Has password: ${!!user.password}`);

          if (!user.isActive) {
            console.error(`[AUTH] Account is inactive: ${credentials.email}`);
            return null;
          }

          if (!user.password) {
            console.error(`[AUTH] User has no password: ${credentials.email}`);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log(`[AUTH] Password validation: ${isPasswordValid ? 'VALID' : 'INVALID'}`);

          if (!isPasswordValid) {
            console.error(`[AUTH] Invalid password for: ${credentials.email}`);
            return null;
          }

          console.log(`[AUTH] Authentication successful for: ${credentials.email}`);
          return {
            id: user._id!.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            digitalId: user.digitalId,
            permissions: user.permissions,
          };
        } catch (error: any) {
          console.error('[AUTH] Authorize error:', error.message);
          console.error('[AUTH] Stack:', error.stack);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.digitalId = user.digitalId;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.digitalId = token.digitalId;
        session.user.permissions = token.permissions;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
