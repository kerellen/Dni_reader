# Control de ingreso por DNI

Aplicación web sencilla para verificar DNI argentinos escaneando el QR del documento o ingresándolo manualmente. Valida contra un archivo Excel local y marca el check-in si el DNI existe.

## Características
- Escaneo con cámara del QR/PDF417 del DNI usando `BarcodeDetector` nativo.
- Ingreso manual del DNI.
- Si el Excel no existe al abrir la app se genera uno nuevo con columnas básicas.
- Permite cargar un Excel existente o descargar el actualizado.
- Posibilidad de agregar personas autorizadas directamente desde la interfaz.

## Uso
1. Instala dependencias con `npm install` y levanta el servidor con `npm start` para que los registros se guarden en el servidor (`data/registros_dni.json`).
2. Abre `http://localhost:3000` en tu navegador.
3. Si no hay datos previos, se creará un archivo vacío en el servidor para comenzar a registrar los ingresos.
4. Escanea el QR del DNI o escribe el número para registrarlo.
5. Usa "Cargar Excel" para importar un listado existente o "Descargar Excel" para guardar los cambios en CSV.

> Los datos se guardan únicamente en el servidor y se pueden descargar en formato CSV desde la interfaz.
