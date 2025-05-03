import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

// Cliente Supabase (Service Role Key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        const { data: user, error } = await supabase
          .from("usuarios")
          .select("*")
          .eq("correo_electronico", email)
          .single();

        if (error || !user) {
          throw new Error("Usuario no encontrado");
        }

        const passwordCorrecta = await bcrypt.compare(password, user.contrasena);
        if (!passwordCorrecta) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          email: user.correo_electronico,
          name: user.nombre_usuario,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
    async signIn({ user }) {
      return true;
    },
    async redirect() {
      return "/perfil";
    },
  },
});