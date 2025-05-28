import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

// Cliente Supabase para servidor (permite escritura con service role)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Credenciales',
      credentials: {
        correo_electronico: { label: 'Correo', type: 'text' },
        contrasena: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { correo_electronico, contrasena } = credentials;

          if (!correo_electronico || !contrasena) {
            return null;
          }

          const { data: user, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('correo_electronico', correo_electronico)
            .single();

          if (error || !user) {
            return null;
          }

          // Si no hay contraseña en la BD (usuario de Google), no permitir login con credenciales
          if (!user.contrasena) {
            return null;
          }

          const passwordCorrecta = await bcrypt.compare(contrasena, user.contrasena);
          if (!passwordCorrecta) {
            return null;
          }

          return {
            id: user.id,
            email: user.correo_electronico,
            name: user.nombre_usuario,
          };
        } catch (error) {
          console.error('Error en authorize:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const { email, name } = user;

      try {
        if (!email || !name) {
          throw new Error('Datos incompletos para crear el usuario.');
        }

        const { data: existingUser, error: queryError } = await supabase
          .from('usuarios')
          .select('id')
          .eq('correo_electronico', email)
          .maybeSingle();

        if (!existingUser) {
          const { error: insertError } = await supabase.from('usuarios').insert([
            {
              correo_electronico: email,
              nombre_usuario: name,
              fecha_registro: new Date().toISOString(),
              reputacion: 0,
              ubicacion: 'No especificada',
              biografia: 'Nuevo usuario',
              contrasena: null,
            },
          ]);

          if (insertError) {
            throw new Error('Error al crear el usuario. Inténtalo de nuevo.');
          }
        }

        return true;
      } catch (err) {
        console.error('Error en signIn callback:', err);
        return false;
      }
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },

    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
  },
});

export const getServerSession = auth;
