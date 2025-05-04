export { auth as middleware } from "auth"; // Usa la ruta a tu archivo server/auth.js si no está como "auth" global

export const config = {
  matcher: [
    "/perfil/:path*",
    "/api/:path*",
    "/misLibros/:path*",
    "/subirLibro/:path*",
  ],
};