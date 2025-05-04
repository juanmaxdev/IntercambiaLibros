import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcrypt";

// Cliente Supabase para servidor (permite escritura con service role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY)

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
    async signIn({ user }) {
      const { email, name } = user;

      try {
        if (!email || !name) {
          console.error("❌ Datos incompletos para crear el usuario:", { email, name });
          throw new Error("Datos incompletos para crear el usuario.");
        }

        // Buscar si ya existe el usuario en Supabase
        const { data: existingUser } = await supabase
          .from("usuarios")
          .select("id")
          .eq("correo_electronico", email)
          .maybeSingle();

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
            throw new Error("Error al crear el usuario. Inténtalo de nuevo.");
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

    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
  },
});

// Exportamos getServerSession para uso en rutas API
export const getServerSession = auth
