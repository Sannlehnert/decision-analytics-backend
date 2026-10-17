# Backend Docker — Fase 1C

## Imagen y arranque

```sh
docker build -t decision-analytics-backend:tpo-docker .
```

La imagen usa `node:22-bookworm-slim`, instala el lockfile con `npm ci --omit=dev`
y ejecuta `node src/server.js` como usuario `node` (sin root). No contiene `.env`,
Git, tests, mocks, seeds ni dependencias de desarrollo. El puerto predeterminado
es 3000. No se modificaron dependencias ni el lockfile.

`npm start`, `npm run dev` y el wrapper compatible `sh start.sh` usan ahora
`src/server.js`. Importar `src/index.js` devuelve Express sin abrir un puerto;
actualizar cualquier plataforma que todavía ejecute `node src/index.js`.
Ninguna de estas entradas ejecuta migraciones o seeds.

## Variables

Copiar `.env.example` a `.env` y reemplazar los valores de ejemplo. Inyectar las
variables al iniciar el contenedor (`--env-file .env`); nunca copiarlas a la imagen.
El archivo `.env` ya está excluido por Git.

| Variable | Uso / valor predeterminado |
| --- | --- |
| `NODE_ENV` | `production` en la imagen |
| `PUERTO` | Puerto interno, 3000 por defecto |
| `JWT_SECRETO` | Secreto aleatorio propio; obligatorio para autenticación |
| `JWT_EXPIRACION` | Duración JWT; `2h` por defecto |
| `DB_HOST` | Nombre del servicio PostgreSQL, por ejemplo `db` |
| `DB_PUERTO` | Puerto PostgreSQL; 5432 por defecto en conexión y migraciones |
| `DB_NOMBRE` | Base de datos de la aplicación |
| `DB_USUARIO` | Usuario PostgreSQL |
| `DB_CLAVE` | Contraseña PostgreSQL |
| `CORS_ORIGIN` | Un origen exacto, por ejemplo `http://app.decision.lab.test`; sin `/` final ni rutas |
| `API_PUBLIC_URL` | URL pública incluyendo `/api`, por ejemplo `http://api.decision.lab.test/api`; fallback relativo `/api` |
| `DATABASE_URL` | Alternativa compatible existente; ahora también soportada por migraciones. Evitar mezclar con `DB_*` |

En producción, omitir `CORS_ORIGIN` deshabilita permisos CORS. En desarrollo el
origen predeterminado es `http://localhost:5173`. No se interpretan listas ni `*`.
Un origen diferente no recibe `Access-Control-Allow-Origin`; CORS es una política
del navegador, no reemplaza autenticación ni bloquea clientes HTTP directos.
Las peticiones sin Origin (healthcheck, CLI) siguen funcionando. JWT no cambió.

## Migraciones one-shot

Con PostgreSQL disponible en una red Docker llamada `decision-net`:

```sh
docker run --rm --network decision-net --env-file .env decision-analytics-backend:tpo-docker npm run migrar:prod
docker run -d --name decision-api --network decision-net --env-file .env -p 127.0.0.1:3000:3000 decision-analytics-backend:tpo-docker
```

`DB_HOST` debe resolver dentro de esa red. El primer comando debe finalizar con
código 0 antes de iniciar la API. Es reutilizable e idempotente: Knex registra las
migraciones aplicadas. El CLI Knex es dependencia de producción y está en la imagen.
No se ejecutan seeds; sus archivos tampoco se incluyen en la imagen.

Para el futuro Compose, usar la misma imagen en un servicio one-shot con
`command: ["npm", "run", "migrar:prod"]` y `restart: "no"`. Esperar PostgreSQL sano
y luego la finalización exitosa del migrador antes de iniciar `api`. Si se hereda
el HEALTHCHECK de la imagen en el servicio migrador, deshabilitarlo allí.
También se podrá ejecutar `docker compose run --rm migrate` cuando ese servicio exista.
No se creó un Compose global en esta fase.

## Healthcheck

`GET /api/health` es público y ejecuta realmente `SELECT 1` con las mismas opciones
de conexión que la API. Usa un cliente PostgreSQL separado, con límites de 2 s
para conexión y consulta, y lo cierra al finalizar. No modifica el pool de negocio.

- 200: `{"status":"ok","database":"up"}`.
- 503: `{"status":"unavailable","database":"down"}`.

No devuelve errores internos ni credenciales y envía `Cache-Control: no-store`.
Verifica conectividad, no versión del esquema: el migrador sigue siendo necesario.
La imagen incluye un HEALTHCHECK mediante Node, sin requerir curl: cada 30 s,
timeout 6 s, inicio 10 s, tres fallos. Docker marca `unhealthy`; eso por sí solo
no reinicia el contenedor.

```sh
curl -i http://localhost:3000/api/health
docker inspect --format '{{.State.Health.Status}}' decision-api
```

## Nginx Proxy Manager y Compose final

- Dirigir `api.decision.lab.test` a `api:3000` preservando `/api` y `/api-docs`.
- Frontend: `app.decision.lab.test`; al compilarlo, usar la URL pública de API.
- Configurar `CORS_ORIGIN` y `API_PUBLIC_URL` con el esquema real (HTTP del laboratorio
  o HTTPS cuando se configure TLS). Swagger se sirve en `/api-docs`.
- Mantener PostgreSQL en una red interna con volumen persistente. Conectar NPM y
  API por una red compartida; evitar publicar el puerto API al host cuando NPM
  sea su entrada. Usar reinicio y apagado adecuados; `init: true` puede habilitarse.
- `trust proxy` permanece desactivado: no hay uso de `req.ip`, `req.protocol`,
  cookies secure ni redirecciones que lo requiera. TLS puede terminar en NPM.
  Si se incorporan estas funciones, configurar proxies confiables concretos
  según la topología, nunca habilitar confianza universal sin revisar la red.
- Revisar exposición de Swagger y frecuencia/acceso a healthcheck según el entorno.

## Validación realizada

Entorno: Docker Desktop Linux, Node 22.23.3 y PostgreSQL 16 temporal, sin datos
existentes ni puertos de PostgreSQL publicados. Credenciales efímeras de prueba.

| Comando / prueba | Resultado |
| --- | --- |
| `docker build -t decision-analytics-backend:tpo-docker .` | Correcto; ejecutó `npm ci --omit=dev` |
| `npm ci` en contenedor Node 22 separado | Correcto, instalación limpia de la suite |
| `npm test` contra PostgreSQL temporal migrado | 2 suites, 7 tests aprobados, salida normal sin forzar cierre |
| `npm run migrar:prod` desde la imagen | Tres migraciones aplicadas en base vacía |
| Repetición con `DATABASE_URL` | `Already up to date`, código 0 |
| Arranque mediante CMD de imagen | API disponible, sin migraciones implícitas |
| Health con BD disponible / detenida / recuperada | 200 / 503 / 200 |
| Health usando solo `DATABASE_URL` | 200 |
| Docker HEALTHCHECK | `healthy` |
| Origen permitido, ajeno y preflight OPTIONS | Cabeceras CORS correctas; preflight 204 |
| Swagger servido | URL pública configurada presente |
| Inspección del runtime | UID no root; sin `.env`, `.git`, tests, seeds o Jest |
| `git diff --check` | Correcto |

Para repetir Jest, usar una base **descartable**, aplicar migraciones y ejecutar
`npm ci` y `npm test` con `DB_*` y `JWT_SECRETO` de prueba. La suite existente borra
usuarios, decisiones y resultados en su preparación: nunca apuntarla a producción.
Jest usa `--experimental-vm-modules` por los módulos ESM existentes. No se
reescribieron los tests ni las migraciones.

## Deuda pendiente

`npm ci` informó 15 vulnerabilidades totales (2 bajas, 5 moderadas, 7 altas,
1 crítica). `npm audit --omit=dev --json` informó 6 de producción: 1 baja,
2 moderadas, 2 altas y 1 crítica. Incluye `proxy-addr` (crítica), `brace-expansion`
y `js-yaml` (altas), además de `body-parser`, `morgan` y `qs`.
No se ejecutó `npm audit fix` ni se modificaron versiones. Priorizar una revisión
de dependencias y exposición antes de publicar en Internet; la auditoría no es
una prueba de explotabilidad de cada hallazgo en esta aplicación.

Pendientes: prueba integrada del Compose/NPM/frontend, TLS y políticas de backup.
La etiqueta base es móvil: para una entrega reproducible, fijar un digest validado
y definir su actualización de seguridad.
