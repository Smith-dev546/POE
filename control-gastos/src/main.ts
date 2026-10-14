import './styles/styles.css';
import { MovimientoController } from './controllers/MovimientoController';
import type { MovimientoDTO } from './models/Movimiento';
import { StorageService } from './services/StorageService';
import { MovimientoView } from './views/MovimientoView';

const storage = new StorageService<MovimientoDTO>('control-gastos:movimientos');
const vista = new MovimientoView();
new MovimientoController(vista, storage).iniciar();
