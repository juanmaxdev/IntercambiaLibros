import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

// Cliente Supabase para servidor (usar service role key)
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
    signIn: "/login", // Página de login personalizada
    error: "/error",  // Página de error personalizada
  },
  session: {
    maxAge: 30 * 60, // 30 minutos en segundos
  },
  callbacks: {
    async signIn({ user }) {
      const { email, name } = user;

      try {
        // Buscar si el usuario ya existe en la tabla "usuarios"
        const { data: existingUser, error: fetchError } = await supabase
          .from("usuarios")
          .select("id")
          .eq("correo_electronico", email)
          .single();

        if (fetchError) {
          console.error("❌ Error buscando usuario:", fetchError.message);
          return false;
        }

        if (!existingUser) {
          // Insertar nuevo usuario si no existe
          const { error: insertError } = await supabase.from("usuarios").insert([
            {
              correo_electronico: email,
              nombre_usuario: name,
              fecha_registro: new Date().toISOString(),
              reputacion: 0,
              ubicacion: "No especificada",
              biografia: "Nuevo usuario",
              contrasena: null, // no hay contraseña para Google
            },
          ]);

          if (insertError) {
            console.error("❌ Error creando usuario con Google:", insertError.message);
            return false;
          }

          console.log("✅ Usuario creado correctamente con Google:", email);
        } else {
          console.log("ℹ️ Usuario ya registrado, continúa login:", email);
        }

        return true; // Permitir login
      } catch (err) {
        console.error("❌ Error inesperado en signIn callback:", err);
        return false;
      }
    },

    async redirect({ url, baseUrl }) {
      // Opcional: siempre redirigir al perfil tras login
      return "/perfil";
    },
  },
});