# Instrucciones para correr el proyecto

## 1. Clonar el proyecto
Lo clonamos en tu máquina local usando la terminal:
```bash
git clone <URL_DEL_REPOSITORIO>
cd examen-practico-biblioteca
```

## 2. Inicializar e instalar dependencias
Ejecuta los siguientes comandos para configurar el entorno de TypeScript:

```bash
npm init -y
npm install -D typescript     
npx tsc --init 
```

## 3. Comando para correr
Para compilar el código TypeScript en tiempo real y observar los cambios automáticamente, ejecuta:

```bash
npx tsc --watch
```
