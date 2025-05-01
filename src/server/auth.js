import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

// Cliente Supabase para servidor (permite escritura con service role)
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
  ],
  pages: {
    signIn: "/login",
    error: "/error",
  },
  session: {
    maxAge: 30 * 60, // 30 minutos
  },
  callbacks: {
    async signIn({ user }) {
      const { email, name } = user;

      try {
        // Buscar si ya existe el usuario en Supabase
        const { data: existingUser } = await supabase
          .from("usuarios")
          .select("id")
          .eq("correo_electronico", email)
          .maybeSingle(); // ← evita error si no lo encuentra

        // Si no existe, insertarlo
        if (!existingUser) {
          const { error: insertError } = await supabase.from("usuarios").insert([
            {
              correo_electronico: email,
              nombre_usuario: name,
              fecha_registro: new Date().toISOString(),
              reputacion: 0,
              ubicacion: "No especificada",
              biografia: "Nuevo usuario",
              contrasena: null,
            },
          ]);

          if (insertError) {
            console.error("❌ Error creando usuario con Google:", insertError.message);
            return false;
          }

          console.log("✅ Usuario creado correctamente:", email);
        } else {
          console.log("ℹ️ Usuario ya registrado:", email);
        }

        return true;
      } catch (err) {
        console.error("❌ Error en signIn callback:", err);
        return false;
      }
    },

    async redirect({ url, baseUrl }) {
      return "/perfil";
    },
  },
});