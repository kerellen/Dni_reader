# Control de ingreso por DNI

Aplicación web sencilla para verificar DNI argentinos escaneando el QR del documento o ingresándolo manualmente. Valida contra un archivo Excel local y marca el check-in si el DNI existe.

## Características
- Escaneo con cámara del QR del DNI (usa `html5-qrcode`).
- Ingreso manual del DNI.
- Si el Excel no existe al abrir la app se genera uno nuevo con columnas básicas.
- Permite cargar un Excel existente o descargar el actualizado.
- Posibilidad de agregar personas autorizadas directamente desde la interfaz.

## Uso
1. Abre `index.html` en tu navegador (no necesita servidor).
2. Si no hay datos previos, se creará un Excel vacío en el almacenamiento local del navegador.
3. Escanea el QR del DNI o escribe el número para registrarlo.
4. Usa "Cargar Excel" para importar un listado existente o "Descargar Excel" para guardar los cambios.

> La información se almacena en el navegador. Si deseas mantenerla, descarga el archivo antes de borrar los datos del navegador.
