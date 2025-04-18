import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

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
    maxAge: 30 * 60, // 30 minutos en segundos
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Siempre devolver la URL original para mantener al usuario en la misma página
      return url
    },
    // Otros callbacks...
  },
  // Otras opciones...
})
