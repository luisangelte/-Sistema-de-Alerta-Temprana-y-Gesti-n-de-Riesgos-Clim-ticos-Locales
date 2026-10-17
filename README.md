# -Sistema-de-Alerta-Temprana-y-Gesti-n-de-Riesgos-Clim-ticos-Locales
busca apoyar la identificación, seguimiento y gestión de situaciones relacionadas con riesgos climáticos que sean de mayor preocupación como ejemplo las zonas costeras y para organizar el desarrollo se utiliza la metodología Scrum

## Módulo de alertas climáticas

El prototipo permite registrar reportes de riesgo y obtener una evaluación preliminar basada en reglas. La evaluación usa severidad, población expuesta estimada, vulnerabilidad y confianza del pronóstico. Sus resultados son apoyo para revisión humana: no son pronósticos meteorológicos ni alertas oficiales.

### Requisitos para iniciar

1. Configura las variables de PostgreSQL en el archivo local `.env` (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME`) y define `PORT=4000`.
2. Asegúrate de que exista el esquema `users` en la base de datos.
3. Inicia el servidor con `npm run dev`. Debe mostrar que el servidor y PostgreSQL arrancaron correctamente.

### Rutas

Las rutas de alertas requieren un JWT en el encabezado `Authorization: Bearer <token>`.

| Método | Ruta | Función |
| --- | --- | --- |
| POST | `/api/alerts` | Registra un reporte y guarda la evaluación sugerida. |
| GET | `/api/alerts` | Lista las alertas registradas. |
| GET | `/api/alerts/:id` | Consulta una alerta por su identificador. |
| PATCH | `/api/alerts/:id/review` | Registra la decisión humana `aprobada` o `rechazada` y notas opcionales. |

Para obtener el token, inicia sesión en `POST /api/login` con las credenciales de un usuario existente. En Postman, selecciona `Authorization > Bearer Token` para las solicitudes protegidas.

### Ejemplo para crear una alerta

Envía este JSON a `POST /api/alerts` con el token:

```json
{
  "title": "Posible inundación en zona rural",
  "description": "Reporte de aumento del nivel del río.",
  "department": "Departamento",
  "municipality": "Municipio",
  "vereda": "Nombre de la vereda",
  "hazardType": "inundacion",
  "severity": 4,
  "exposedPopulationEstimate": 250,
  "exposedPopulationSource": "Estimación comunitaria",
  "populationReferenceDate": "2026-10-17",
  "vulnerability": 4,
  "forecastConfidence": 70
}
```

`populationReferenceDate` usa el formato `AAAA-MM-DD`. La población expuesta es una estimación suministrada con su fuente y fecha; este prototipo todavía no la calcula automáticamente a partir de mapas.
