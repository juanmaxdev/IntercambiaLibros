# IntercambiaLibros - Plataforma de Intercambio de Libros

## Índice
- [Introducción](#introducción)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [API Endpoints](#api-endpoints)
- [Autenticación](#autenticación)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Contribución](#contribución)

## Introducción

IntercambiaLibros es una plataforma web que permite a los usuarios intercambiar libros entre sí. Los usuarios pueden registrarse, subir sus libros disponibles para intercambio, buscar libros de otros usuarios, iniciar conversaciones, proponer intercambios y gestionar sus donaciones.

La aplicación está diseñada para fomentar la lectura y crear una comunidad de lectores que puedan compartir sus libros de manera sencilla y eficiente.

## Tecnologías

El proyecto utiliza las siguientes tecnologías:

- **Frontend**:
  - Next.js (App Router)
  - React
  - Bootstrap 5
  - CSS
  - JavaScript/JSX

- **Backend**:
  - Next.js API Routes
  - NextAuth.js para autenticación

- **Base de Datos**:
  - Supabase (PostgreSQL)

- **Almacenamiento**:
  - Supabase Storage para imágenes de portadas de libros

## Estructura del Proyecto

/
├── app/                    # Directorio principal de Next.js App Router
│   ├── api/                # API Routes
│   │   ├── auth/           # Endpoints de autenticación
│   │   ├── chat/           # Endpoints de mensajería
│   │   ├── contacto/       # Endpoints de formulario de contacto
│   │   ├── generos/        # Endpoints de géneros literarios
│   │   ├── intercambios/   # Endpoints de gestión de intercambios
│   │   ├── libros/         # Endpoints de gestión de libros
│   │   ├── mensajes/       # Endpoints de notificaciones y mensajes
│   │   ├── perfil/         # Endpoints de gestión de perfil
│   │   └── reportes/       # Endpoints de reportes
│   ├── footer/             # Páginas de información legal y sobre el proyecto
│   ├── hooks/              # Custom hooks
│   ├── libros/             # Páginas relacionadas con libros
│   ├── perfil/             # Páginas de perfil de usuario
│   ├── styles/             # Estilos CSS
│   └── subirLibro/         # Página para subir nuevos libros
├── components/             # Componentes React reutilizables
│   ├── books/              # Componentes relacionados con libros
│   ├── carousel/           # Componentes de carruseles
│   ├── footer/             # Componentes del pie de página
│   ├── forms/              # Componentes de formularios
│   ├── home/               # Componentes de la página principal
│   ├── nav/                # Componentes de navegación
│   ├── opiniones/          # Componentes de reseñas y opiniones
│   └── perfil/             # Componentes del perfil de usuario
├── lib/                    # Bibliotecas y utilidades
│   └── supabase.js         # Configuración de Supabase
├── server/                 # Lógica del servidor
│   └── auth.js             # Configuración de autenticación
├── services/               # Servicios para interactuar con la API
└── utils/                  # Utilidades generales


## Funcionalidades

### Gestión de Usuarios
- **Registro de usuarios**: Los usuarios pueden registrarse con correo electrónico y contraseña o con Google.
- **Inicio de sesión**: Sistema de autenticación seguro con NextAuth.js.
- **Perfil de usuario**: Cada usuario tiene un perfil personalizable con información básica.
- **Edición de perfil**: Los usuarios pueden actualizar su información personal, ubicación y biografía.

### Gestión de Libros
- **Subir libros**: Los usuarios pueden subir libros para intercambio con detalles como título, autor, género, estado, etc.
- **Buscar libros**: Búsqueda avanzada por título, autor, género o ubicación.
- **Ver detalles**: Página detallada para cada libro con toda su información.
- **Favoritos**: Los usuarios pueden marcar libros como favoritos para acceder rápidamente.
- **Comentarios y valoraciones**: Sistema de comentarios y valoraciones para libros.

### Intercambios
- **Proponer intercambios**: Los usuarios pueden proponer intercambios de libros a otros usuarios.
- **Gestionar propuestas**: Aceptar, rechazar o negociar propuestas de intercambio.
- **Confirmar intercambios**: Sistema de confirmación mutua para completar intercambios.
- **Historial**: Registro completo de intercambios realizados.

### Donaciones
- **Marcar libros para donación**: Opción para marcar libros como donación sin esperar intercambio.
- **Explorar donaciones**: Sección específica para ver libros disponibles para donación.

### Mensajería
- **Chat entre usuarios**: Sistema de mensajería privada entre usuarios.
- **Notificaciones**: Alertas de nuevos mensajes y actualizaciones de intercambios.
- **Historial de conversaciones**: Acceso al historial completo de conversaciones.

### Reportes
- **Sistema de reportes**: Los usuarios pueden reportar contenido inapropiado o problemas.
- **Formulario de contacto**: Canal directo para comunicarse con los administradores.

## API Endpoints

### Autenticación
- `POST /api/auth/[...nextauth]` - Endpoints de NextAuth.js para autenticación

### Libros
- `GET /api/libros` - Obtener todos los libros disponibles
- `GET /api/libros/[id]` - Obtener información detallada de un libro específico
- `GET /api/libros/usuario` - Obtener libros subidos por un usuario específico
- `POST /api/libros/subirLibros` - Subir un nuevo libro al sistema
- `GET /api/libros/favoritos` - Obtener lista de libros favoritos del usuario
- `POST /api/libros/favoritos` - Añadir un libro a favoritos
- `DELETE /api/libros/favoritos` - Eliminar un libro de favoritos
- `GET /api/libros/favoritos/verificar` - Verificar si un libro está en favoritos
- `GET /api/libros/comentarios` - Obtener comentarios de un libro específico
- `POST /api/libros/comentarios` - Añadir un comentario a un libro
- `GET /api/libros/donaciones` - Obtener libros disponibles para donación
- `GET /api/libros/intercambios` - Obtener libros disponibles para intercambio

### Géneros
- `GET /api/generos` - Obtener lista de todos los géneros literarios

### Intercambios
- `GET /api/intercambios` - Obtener intercambios del usuario actual
- `POST /api/intercambios` - Crear una nueva propuesta de intercambio
- `PATCH /api/intercambios` - Actualizar el estado de un intercambio (aceptar/rechazar)
- `POST /api/intercambios/confirmar` - Confirmar la entrega de un intercambio

### Mensajes
- `GET /api/mensajes` - Obtener mensajes de una conversación específica
- `POST /api/mensajes` - Enviar un nuevo mensaje a otro usuario
- `GET /api/mensajes/notificaciones` - Obtener notificaciones de mensajes no leídos

### Perfil
- `GET /api/perfil` - Obtener información del perfil del usuario actual
- `PUT /api/perfil` - Actualizar información del perfil
- `POST /api/perfil/registro` - Registrar un nuevo usuario
- `POST /api/perfil/login` - Iniciar sesión con credenciales

### Contacto y Reportes
- `POST /api/contacto` - Enviar un mensaje de contacto o reporte
- `POST /api/reportes` - Enviar un reporte sobre contenido o usuario

## Autenticación

El proyecto utiliza NextAuth.js para la autenticación, con soporte para:

1. **Autenticación con credenciales**: Email y contraseña
2. **Autenticación con proveedores externos**: Google


La configuración de autenticación se encuentra en `server/auth.js` y los endpoints en `app/api/auth/[...nextauth]/route.js`.

### Flujo de autenticación:

1. El usuario introduce sus credenciales en el modal de login
2. Las credenciales se envían a NextAuth.js
3. NextAuth.js verifica las credenciales contra la base de datos Supabase
4. Si son correctas, se crea una sesión JWT para el usuario
5. El usuario es redirigido a la página principal o a la página solicitada


### Seguridad

- Las contraseñas se almacenan hasheadas con bcrypt
- Las sesiones utilizan JWT con una duración configurable
- Se implementa protección CSRF
- Los usuarios de Google se registran automáticamente en la base de datos
  
## Instalación


1. Clona el repositorio:

git clone https://github.com/tu-usuario/bookswap.git

2. Instala las dependencias:

npm install

3. Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secreto_seguro

# Supabase

NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio_de_supabase

# Google (opcional)

GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_client_secret_de_google

## Configuración

### Supabase

1. Crea una cuenta en [Supabase](https://supabase.com/)
2. Crea un nuevo proyecto
3. Ejecuta los scripts SQL para crear las tablas necesarias
4. Configura las políticas de seguridad para las tablas
5. Configura el almacenamiento para las imágenes de portadas de libros
6. Copia las credenciales a tu archivo `.env.local`


### NextAuth.js

1. Genera una clave secreta segura para NEXTAUTH_SECRET:
2. Configura los proveedores de autenticación en `server/auth.js`
3. Si utilizas Google, crea un proyecto en [Google Cloud Console](https://console.cloud.google.com/) y configura las credenciales OAuth


### Bootstrap

El proyecto utiliza Bootstrap 5 para los estilos. Los archivos CSS y JS de Bootstrap deben estar disponibles en:

- `/assets/bootstrap/css/bootstrap.min.css`
- `/assets/bootstrap/js/bootstrap.bundle.min.js`


## Uso

1. Inicia el servidor de desarrollo:

npm run dev

1. Abre [http://localhost:3000](http://localhost:3000) en tu navegador


### Funcionalidades principales:

#### Registro e inicio de sesión

- Haz clic en "Iniciar sesión" en la barra de navegación
- Completa el formulario con tus datos o utiliza Google
- Para registrarte, haz clic en "Regístrate" en el modal de inicio de sesión


#### Explorar libros

- Navega por la página principal para ver los libros destacados
- Utiliza la barra de búsqueda para encontrar libros específicos
- Filtra por géneros en la sección correspondiente


#### Subir un libro

- Accede a la página "Subir Libro" desde el menú de usuario
- Completa el formulario con los detalles del libro
- Sube una imagen de la portada (opcional)
- Indica si es para intercambio o donación


#### Gestionar perfil

- Accede a tu perfil desde el menú de usuario
- Edita tu información personal, ubicación y biografía
- Visualiza estadísticas de tus libros, favoritos y comentarios


#### Proponer intercambios

- Visita la página de detalles de un libro
- Haz clic en "Proponer intercambio"
- Selecciona uno de tus libros para ofrecer
- Envía la propuesta al propietario


#### Gestionar intercambios

- Accede a la sección de mensajes desde tu perfil
- Revisa las propuestas de intercambio recibidas
- Acepta, rechaza o negocia las propuestas
- Confirma cuando el intercambio se ha completado


#### Enviar mensajes

- Visita el perfil de otro usuario
- Utiliza la opción de contacto en la página de detalles de un libro
- Accede a tu bandeja de mensajes para ver conversaciones anteriores


## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un nuevo Pull Request


### Guía de estilo

- Utiliza ESLint y Prettier para mantener un código limpio y consistente
- Sigue las convenciones de nomenclatura existentes
- Escribe pruebas para las nuevas funcionalidades
- Documenta las nuevas funcionalidades y cambios importantes


### Reportar problemas

Si encuentras algún problema o tienes alguna sugerencia, por favor crea un issue en el repositorio con la siguiente información:

- Descripción detallada del problema
- Pasos para reproducirlo
- Comportamiento esperado
- Capturas de pantalla (si aplica)
- Entorno (navegador, sistema operativo, etc.)

## 📞 Contacto

Para cualquier consulta o sugerencia, por favor contacta a través de [correo electrónico](intercambiolibros@intercambios.com).

---

Desarrollado con ❤️ por @juanmaxdev @tomcat7733.
