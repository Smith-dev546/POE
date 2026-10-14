# 💰 Control de Gastos

Aplicación web para registrar ingresos y gastos personales con balance automático.
Desarrollada con **TypeScript** (sin frameworks) siguiendo la arquitectura **MVC**, y empaquetada con **Vite**.

## Funcionalidades

- Registrar movimientos (tipo, monto, categoría, descripción opcional y fecha).
- Listar movimientos ordenados del más reciente al más antiguo.
- Buscar por texto (descripción o categoría) y filtrar por tipo y categoría.
- Editar y eliminar movimientos (la eliminación pide confirmación).
- Balance, total de ingresos y total de gastos calculados automáticamente.
- Validación de datos con mensajes por campo.
- Persistencia en `localStorage`: los datos se conservan al recargar.

## Cómo ejecutarlo

Requiere [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install
npm run dev       # servidor de desarrollo (http://localhost:5173)
npm run build     # revisa tipos y genera la versión de producción en /dist
npm run preview   # sirve la versión de producción
```

## Arquitectura MVC

| Capa | Archivo | Responsabilidad |
|------|---------|-----------------|
| **Model** | `src/models/Movimiento.ts` | Clase `Movimiento`, tipos/interfaces (`MovimientoDTO`, `TipoMovimiento`) y validaciones (`Movimiento.validar`). No conoce el DOM. |
| **View** | `src/views/MovimientoView.ts` + `index.html` + `styles.css` | Lee el formulario, dibuja lista y resumen, muestra errores y el diálogo de confirmación. No contiene lógica de negocio: avisa al controlador mediante callbacks. |
| **Controller** | `src/controllers/MovimientoController.ts` | Coordina todo: CRUD, filtros, cálculo del balance y persistencia. |
| **Service** | `src/services/StorageService.ts` | Lectura/escritura genérica en `localStorage` con manejo de errores. |

Punto de entrada: `src/main.ts` crea las piezas y las conecta.

### Flujo de ejemplo (agregar un movimiento)

1. El usuario envía el formulario → la **vista** lee los datos y llama al callback.
2. El **controlador** valida con `Movimiento.validar()`. Si hay errores, la vista los muestra.
3. Si es válido, crea el `Movimiento`, lo guarda con `StorageService` y pide a la vista que se redibuje.

## Decisiones técnicas

- **TypeScript estricto** (`strict: true`): tipos unión (`'ingreso' | 'gasto'`), interfaces y modificadores `private`/`readonly`.
- **Seguridad:** el contenido del usuario se inserta con `textContent`, nunca con `innerHTML`, para evitar XSS.
- **Datos corruptos:** al cargar, los registros inválidos en `localStorage` se descartan en lugar de romper la app.
- **Precisión:** los totales se redondean a centavos para evitar errores de coma flotante.
- **Resumen global:** los totales siempre cuentan todos los movimientos; los filtros solo afectan la lista.
- **Accesibilidad:** etiquetas en todos los campos, foco visible, `<dialog>` nativo y botones con `aria-label`.

## Estructura

```
control-gastos/
├── index.html
├── package.json
├── tsconfig.json
├── src/
│   ├── main.ts
│   ├── models/Movimiento.ts
│   ├── views/MovimientoView.ts
│   ├── controllers/MovimientoController.ts
│   ├── services/StorageService.ts
│   └── styles/styles.css
└── README.md
```
