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
        correo_electronico: { label: "Correo", type: "text" },
        contrasena: { label: "Contraseña", type: "password" },
      },      
      async authorize(credentials) {
        const { correo_electronico, contrasena } = credentials;

        console.log("Intentando iniciar sesión con:", correo_electronico);

        const { data: user, error } = await supabase
          .from("usuarios")
          .select("*")
          .eq("correo_electronico", correo_electronico)
          .single();

        if (error) {
          console.error("Error al consultar la base de datos:", error);
          return null; // Devuelve null en lugar de lanzar un error
        }

        if (!user) {
          console.error("Usuario no encontrado con el correo:", correo_electronico);
          return null; // Devuelve null si el usuario no existe
        }

        const passwordCorrecta = await bcrypt.compare(contrasena, user.contrasena);
        if (!passwordCorrecta) {
          console.error("Contraseña incorrecta para el usuario:", correo_electronico);
          return null; // Devuelve null si la contraseña no coincide
        }

        console.log("Inicio de sesión exitoso para:", correo_electronico);

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