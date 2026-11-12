import './styles/styles.css';
import { USE_API } from './config';
import { UserController } from './controllers/UserController';
import { DatabaseService } from './services/Database';

(async () => {
  if (!USE_API) await DatabaseService.init(); // en modo API la BD vive en el servidor
  new UserController();
})().catch((err) => {
  console.error(err);
  document.body.innerHTML = '<p style="color:#fff;padding:2rem">❌ No se pudo iniciar la aplicación. Revisa la consola.</p>';
});
