# Plataforma de Intercambio de Libros

IntercambiaLibros es una plataforma web que permite a los usuarios intercambiar, donar y descubrir libros. El proyecto está construido con Next.js y utiliza Supabase como base de datos.

## 📚 Características Principales

- **Intercambio de Libros**: Los usuarios pueden publicar libros para intercambio y contactar a otros usuarios para realizar intercambios.
- **Donaciones**: Sistema de donación de libros para quienes desean regalar sus libros a otros usuarios.
- **Catálogo de Libros**: Exploración de libros por géneros, novedades y búsqueda.
- **Sistema de Usuarios**: Registro, inicio de sesión y perfiles de usuario.
- **Mensajería**: Sistema de mensajes entre usuarios para coordinar intercambios.
- **Notificaciones**: Alertas sobre nuevos mensajes, solicitudes de intercambio y más.
- **Favoritos**: Los usuarios pueden marcar libros como favoritos para acceder a ellos fácilmente.
- **Comentarios**: Sistema de comentarios en los libros para compartir opiniones.

## 🛠️ Tecnologías Utilizadas

- **Frontend**:
  - Next.js (App Router)
  - React
  - Bootstrap
  - CSS personalizado

- **Backend**:
  - Next.js API Routes
  - Supabase (PostgreSQL)

- **Autenticación**:
  - NextAuth.js
  - Google OAuth

- **Almacenamiento**:
  - Supabase Storage para imágenes de libros y perfiles

## 📁 Estructura del Proyecto


/
├── app/                      # Directorio principal de la aplicación Next.js
│   ├── api/                  # API Routes para el backend
│   │   ├── auth/             # Endpoints de autenticación
│   │   ├── chat/             # Endpoints para el sistema de chat
│   │   ├── contacto/         # Endpoints para el formulario de contacto
│   │   ├── generos/          # Endpoints para gestionar géneros literarios
│   │   ├── intercambios/     # Endpoints para gestionar intercambios
│   │   ├── libros/           # Endpoints para gestionar libros
│   │   ├── mensajes/         # Endpoints para el sistema de mensajería
│   │   ├── notificaciones/   # Endpoints para notificaciones
│   │   ├── perfil/           # Endpoints para gestionar perfiles
│   │   └── reportes/         # Endpoints para sistema de reportes
│   ├── footer/               # Páginas relacionadas con el footer
│   ├── hooks/                # Custom hooks de React
│   ├── layout.jsx            # Layout principal de la aplicación
│   ├── libros/               # Páginas relacionadas con libros
│   │   ├── donaciones/       # Página de donaciones
│   │   ├── generos/          # Página de géneros
│   │   ├── novedades/        # Página de novedades
│   │   ├── search/           # Página de búsqueda
│   │   └── [id]/             # Página de detalle de libro
│   ├── page.jsx              # Página principal (Home)
│   ├── perfil/               # Páginas relacionadas con el perfil
│   ├── styles/               # Estilos CSS
│   └── subirLibro/           # Página para subir libros
├── components/               # Componentes reutilizables
│   ├── books/                # Componentes relacionados con libros
│   ├── carousel/             # Componentes de carrusel
│   ├── footer/               # Componentes del footer
│   ├── forms/                # Componentes de formularios
│   ├── home/                 # Componentes de la página principal
│   ├── nav/                  # Componentes de navegación
│   ├── opiniones/            # Componentes de opiniones/comentarios
│   └── perfil/               # Componentes del perfil
├── lib/                      # Bibliotecas y utilidades
│   └── supabase.js           # Configuración de Supabase
├── server/                   # Código del servidor
│   └── auth.js               # Configuración de autenticación
├── services/                 # Servicios para interactuar con la API
└── utils/                    # Utilidades generales


## 🔄 Flujos Principales

### Intercambio de Libros
1. El usuario sube un libro para intercambio
2. Otro usuario ve el libro y solicita un intercambio
3. El propietario recibe una notificación y acepta/rechaza
4. Los usuarios coordinan el intercambio a través del sistema de mensajes

### Donación de Libros
1. El usuario sube un libro marcándolo como donación
2. Otros usuarios pueden ver los libros disponibles para donación
3. Un usuario interesado solicita la donación
4. El donante y el receptor coordinan la entrega

### Exploración de Libros
1. Los usuarios pueden explorar libros por géneros
2. Ver las últimas novedades añadidas
3. Buscar libros por título, autor o descripción
4. Filtrar resultados por diferentes criterios

## 🔧 Configuración y Despliegue

### Variables de Entorno

NEXT_PUBLIC_BASE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key


### Instalación

1. Clonar el repositorio:
\`\`\`bash
git clone https://github.com/tu-usuario/bookswap.git
cd bookswap
\`\`\`

2. Instalar dependencias:
\`\`\`bash
npm install
\`\`\`

3. Configurar variables de entorno:
Crea un archivo `.env.local` en la raíz del proyecto y añade las variables mencionadas anteriormente.

4. Iniciar el servidor de desarrollo:
\`\`\`bash
npm run dev
\`\`\`

5. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 📊 Estructura de la Base de Datos

### Tablas Principales

- **usuarios**: Información de los usuarios registrados
- **libros**: Catálogo de libros disponibles
- **generos**: Géneros literarios
- **intercambios**: Registro de intercambios entre usuarios
- **donaciones**: Registro de donaciones
- **mensajes**: Sistema de mensajería
- **notificaciones**: Sistema de notificaciones
- **favoritos**: Libros marcados como favoritos
- **comentarios**: Comentarios en los libros

## 🤝 Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más información.

## 📞 Contacto

Para cualquier consulta o sugerencia, por favor contacta a través de [correo electrónico](intercambiolibros@intercambios.com).

---

Desarrollado con ❤️.
