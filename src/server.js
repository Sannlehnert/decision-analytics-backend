import app from './index.js';
import { configurarEntorno } from './config/entorno.js';

app.listen(configurarEntorno.puerto, () => {
  console.log('Servidor corriendo en puerto ' + configurarEntorno.puerto);
});
