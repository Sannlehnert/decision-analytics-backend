#!/bin/bash
echo "Ejecutando migraciones..."
npm run migrar:prod
echo "Iniciando servidor..."
node src/index.js