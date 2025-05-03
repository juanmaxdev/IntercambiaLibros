import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/perfil/:path*", "/mensajes/:path*", "/misLibros/:path*"],
};