# Sitio Web - Parroquia San Marcos Evangelista (Paraíso, Tabasco)

Sitio web funcional construido con **Next.js** (para desplegar en **Vercel**) y
**Supabase** (base de datos Postgres + almacenamiento de imágenes/comprobantes).
Incluye panel de administración con usuario y contraseña para gestionar todo el
contenido del sitio.

---

## 1. Crear el proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta (gratis).
2. Crea un **nuevo proyecto** (elige una contraseña para la base de datos y
   guárdala, aunque no la necesitarás para este sitio).
3. Cuando el proyecto esté listo, ve a **SQL Editor** (menú lateral) → **New query**.
4. Abre el archivo `supabase/schema.sql` de este proyecto, copia **todo** su
   contenido, pégalo en el editor SQL de Supabase y da clic en **Run**.
   - Esto crea todas las tablas, la información inicial (horarios, sacramentos,
     datos de contacto, etc.), el usuario administrador y el bucket de
     almacenamiento `uploads` para imágenes y comprobantes.
5. Ve a **Project Settings** (ícono de engrane) → **API**. Ahí encontrarás:
   - **Project URL** → la usarás como `SUPABASE_URL`
   - **service_role** (en "Project API keys", sección "secret") → la usarás
     como `SUPABASE_SERVICE_ROLE_KEY`

   ⚠️ La `service_role` key tiene acceso total a tu base de datos. **Nunca** la
   compartas ni la pongas en código público. En este proyecto solo se usa en el
   servidor (Vercel), nunca se envía al navegador.

---

## 2. Desplegar en Vercel

1. Entra a [vercel.com](https://vercel.com) y crea una cuenta (puedes usar tu
   cuenta de GitHub).
2. Sube este proyecto a un repositorio de GitHub (puedes arrastrar la carpeta a
   [github.com/new](https://github.com/new) usando "uploading an existing file"
   o usar GitHub Desktop).
3. En Vercel, da clic en **Add New... → Project** y selecciona ese repositorio.
4. Antes de dar clic en "Deploy", abre la sección **Environment Variables** y
   agrega:

   | Nombre | Valor |
   |---|---|
   | `SUPABASE_URL` | la "Project URL" de tu proyecto Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | la "service_role" key de Supabase |
   | `ADMIN_SESSION_SECRET` | un texto largo y aleatorio (ej. genera uno en https://1password.com/password-generator/ con 40+ caracteres) |

5. Da clic en **Deploy**. En unos minutos tendrás tu sitio en una URL como
   `https://tu-proyecto.vercel.app`.
6. (Opcional) En **Project Settings → Domains** puedes conectar tu propio
   dominio (ej. `www.parroquiasanmarcos.org`).

---

## 3. Entrar al panel de administración

1. Ve a `https://tu-proyecto.vercel.app/admin/login`
2. Usuario: **admin**
3. Contraseña inicial: **CambiarEsta123**

> ⚠️ **Cambia esta contraseña en cuanto entres**, desde "Cambiar contraseña" en
> el menú del panel.

---

## 4. ¿Qué puedes administrar desde el panel?

| Sección del panel | Qué controla en el sitio público |
|---|---|
| **Datos generales / Sobre nosotros** | Dirección, teléfono, correo, Facebook, coordenadas del templo (mapa de Contacto), historia, misión, visión y texto sobre el patrono. |
| **Horarios de misa** | Tabla de horarios de misa en Inicio y en Horarios. |
| **Atención de oficina** | Tabla de horarios de oficina parroquial. |
| **Sacramentos / requisitos** | Lista de sacramentos, descripción y requisitos (uno por línea) en la página de Sacramentos. |
| **Grupos y movimientos** | Tarjetas de grupos parroquiales (nombre, horario, contacto, imagen). |
| **Ermitas** | Ermitas que pertenecen a la parroquia: nombre, descripción, ubicación, coordenadas (para el mapa) e imagen. |
| **Eventos / avisos** | Avisos y eventos en Inicio y en Eventos. |
| **Galería de fotos** | Fotos con categoría, mostradas en la Galería. |
| **Calendario litúrgico** | Fechas, celebraciones y color litúrgico. |
| **Solicitudes de sacramentos** | Ver las solicitudes enviadas desde el formulario público, revisar comprobantes adjuntos, cambiar estado (Pendiente / En revisión / Aprobado / Rechazado), agregar notas internas e **imprimir la boleta**. |

### Cómo obtener las coordenadas (latitud/longitud) de una ermita

1. Abre [Google Maps](https://maps.google.com) y busca el lugar.
2. Da clic derecho exactamente sobre el punto en el mapa.
3. Copia las coordenadas que aparecen (ej. `18.39611, -93.21278`).
4. Pega el primer número en "Latitud" y el segundo en "Longitud" en el panel.

---

## 5. Solicitudes de sacramentos en línea

En "Sacramentos", cualquier persona puede:

- Ver los requisitos de cada sacramento (Bautismo, Primera Comunión,
  Confirmación, Matrimonio, XV años).
- Llenar un formulario con su nombre, datos de contacto y un mensaje.
- Subir fotos o PDF de sus comprobantes.

Esa información llega al panel, en "Solicitudes de sacramentos", donde se puede:

- Ver los datos y los comprobantes adjuntos.
- Cambiar el estado de la solicitud.
- Escribir notas internas.
- Imprimir una **boleta** con folio, datos y espacios de firma.

---

## 6. Logo de la parroquia

Para mostrar un logo, sube un archivo llamado **`logo.png`** dentro de la carpeta
`public/` del proyecto (junto a `favicon.ico`) y vuelve a desplegar. Si no subes
nada, el sitio funciona igual sin mostrar logo.

---

## 7. Noticias del Vaticano

La sección "Noticias" obtiene automáticamente las publicaciones más recientes de
**Vatican News** (vaticannews.va) mediante su feed RSS público. No requiere
configuración adicional.

---

## 8. Desarrollo local (opcional)

Si quieres probar cambios en tu computadora antes de subirlos:

```bash
npm install
cp .env.local.example .env.local
# edita .env.local con tus datos reales de Supabase
npm run dev
```

Abre `http://localhost:3000`.

---

## 9. Estructura del proyecto

```
app/
├── (public)/        páginas públicas (Inicio, Horarios, Sacramentos, etc.)
├── admin/           panel de administración (protegido por login)
├── api/             endpoints (login admin, solicitudes públicas)
├── components/      componentes compartidos (header, footer, mapas, formularios)
└── globals.css      estilos del sitio público

lib/
├── supabaseAdmin.js conexión a Supabase (servidor)
├── auth.js          sesión del panel admin (cookie firmada)
├── settings.js       datos generales del sitio
├── tablesConfig.js   definición de las secciones administrables
├── vaticanNews.js    feed de Vatican News
└── actions/          acciones del servidor (guardar/editar/eliminar contenido)

supabase/
└── schema.sql        script para crear la base de datos en Supabase
```

---

## 10. Siguientes pasos recomendados

1. Cambia la contraseña del admin.
2. Completa "Datos generales" (historia, misión, visión, dirección, teléfono real).
3. Actualiza horarios de misa y de oficina.
4. Agrega las ermitas reales con su ubicación.
5. Agrega los grupos y movimientos reales.
6. Sube fotos a la galería.
7. Revisa y ajusta los requisitos de cada sacramento según las normas de la diócesis.
