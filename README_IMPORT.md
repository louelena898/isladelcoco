Importar species desde Excel

Pasos:

1) Obtén la clave de servicio (service account):
   - Firebase Console > Project settings > Service accounts > Generate new private key.
   - Guarda el JSON en la raíz del proyecto como `serviceAccountKey.json`.

2) Prepara tu Excel:
   - Coloca el archivo en `data/species.xlsx`.
   - Asegúrate de que la primera hoja contiene columnas con nombres consistentes, p.ej. `name`, `scientificName`, `description`, `imageUrl`.

3) Instala dependencias (si no están):

```bash
npm install xlsx firebase-admin
```

4) Ejecuta el import:

```bash
npm run import-species
```

El script leerá las filas y creará documentos en la colección `species`.

Notas de seguridad:
- NO subas `serviceAccountKey.json` a un repositorio público.
- Para cargas grandes, considera usar batching y manejo de reintentos.
