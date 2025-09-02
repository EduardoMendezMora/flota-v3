# 🚗 Sistema de Pestañas para Vehículos

## 📋 Descripción General

Este sistema implementa un modal con pestañas para la gestión completa de vehículos, reemplazando el modal simple anterior. Cada pestaña maneja una funcionalidad específica del vehículo, proporcionando una interfaz organizada y fácil de usar.

## 🎯 Funcionalidades Implementadas

### 1. **Información General** 
- Formulario completo de datos del vehículo
- Solo la placa es requerida (validación actualizada)
- Campos organizados en columnas lógicas

### 2. **Galería de Fotos**
- Visualización de fotos del vehículo
- Subida de nuevas fotos (hasta 30)
- Gestión de orden y descripciones
- Eliminación lógica de fotos

### 3. **Tareas Relacionadas**
- Lista de tareas asociadas al vehículo
- Filtros por estado y prioridad
- Creación de nuevas tareas
- Vista de asignaciones y fechas

### 4. **Inspecciones**
- Gestión de machotes de inspección
- Creación de nuevas inspecciones
- Resultados de pruebas individuales
- Generación automática de tareas para fallas

### 5. **Bitácora y Comentarios**
- Chat estilo WhatsApp para el vehículo
- Comentarios de diferentes usuarios
- Adjuntar archivos e imágenes
- Historial de conversaciones

### 6. **Kilometraje**
- Registros inmutables del odómetro
- Historial cronológico
- Evidencia fotográfica opcional
- Filtros por período

### 7. **Dispositivos GPS**
- Gestión de múltiples dispositivos
- Información de modelo, serie y SIM
- Comentarios con imágenes
- Estado de dispositivos

### 8. **Solicitudes de Repuestos**
- Solicitudes específicas del vehículo
- Filtros por estado y prioridad
- Asignación de responsables
- Seguimiento completo

## 🏗️ Arquitectura del Sistema

### Frontend
- **`modals.js`**: Generación del HTML de las pestañas
- **`vehiculo-tabs.js`**: Lógica de gestión de pestañas
- **`styles.css`**: Estilos personalizados para las pestañas
- **`app.js`**: Integración con el sistema principal

### Backend (Supabase)
- **13 nuevas tablas** para todas las funcionalidades
- **Triggers automáticos** para timestamps y tareas
- **Row Level Security (RLS)** habilitado
- **Índices optimizados** para consultas frecuentes

## 🔧 Instalación y Configuración

### 1. Base de Datos
```sql
-- Ejecutar el archivo completo en Supabase
supabase_database_changes.sql
```

### 2. Archivos Frontend
- Asegurar que todos los archivos JS estén incluidos en `index.html`
- Verificar que Bootstrap 5.3.2 esté cargado
- Confirmar que Font Awesome esté disponible

### 3. Verificación
```bash
# Abrir test-tabs.html en el navegador
# Verificar que no hay errores en la consola
# Probar la apertura del modal con pestañas
```

## 📱 Uso del Sistema

### Abrir Modal con Pestañas
```javascript
// Para editar un vehículo existente
window.app.openModal('vehiculo', vehiculoData);

// Para crear un nuevo vehículo
window.app.openModal('vehiculo');
```

### Navegación entre Pestañas
```javascript
// Cambiar a una pestaña específica
window.vehiculoTabsManager.switchTab('galeria');

// Obtener pestaña actual
const currentTab = window.vehiculoTabsManager.currentTab;
```

### Cargar Contenido de Pestaña
```javascript
// Cargar contenido de una pestaña específica
window.vehiculoTabsManager.loadTabContent('tareas');

// Refrescar contenido
window.vehiculoTabsManager.refreshTareasVehiculo();
```

## 🎨 Estilos y Diseño

### Características del Diseño
- **Minimalista Apple-inspired**: Limpio y moderno
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Consistente**: Uso uniforme de Bootstrap y componentes personalizados
- **Accesible**: Navegación clara y estados visuales definidos

### Clases CSS Principales
```css
.modal-with-tabs          /* Modal más ancho para pestañas */
.vehiculo-tabs            /* Contenedor principal de pestañas */
.tab-navigation           /* Navegación de pestañas */
.tab-button               /* Botones individuales de pestaña */
.tab-content              /* Contenido de las pestañas */
.tab-pane                 /* Pane individual de pestaña */
```

## 🔌 APIs Implementadas

### Funciones Principales
```javascript
// Galería
await window.api.getVehiculoFotos(vehiculoId);
await window.api.uploadVehiculoFoto(vehiculoId, fotoData);

// Tareas
await window.api.getVehiculoTareas(vehiculoId, filtros);

// Inspecciones
await window.api.getVehiculoInspecciones(vehiculoId, filtros);
await window.api.crearInspeccion(inspeccionData);

// Bitácora
await window.api.getVehiculoBitacora(vehiculoId);
await window.api.enviarMensajeBitacora(mensajeData);

// Kilometraje
await window.api.getVehiculoKilometraje(vehiculoId);
await window.api.registrarKilometraje(kilometrajeData);

// GPS
await window.api.getVehiculoGPS(vehiculoId);
await window.api.agregarDispositivoGPS(gpsData);

// Repuestos
await window.api.getSolicitudesRepuestos(filtros);
await window.api.crearSolicitudRepuesto(solicitudData);
```

## 🧪 Testing

### Archivo de Prueba
- **`test-tabs.html`**: Página independiente para probar las pestañas
- Incluye mocks de API y app para testing aislado
- Permite probar cada funcionalidad individualmente

### Comandos de Prueba
```javascript
// Probar pestaña específica
testTab('galeria');

// Abrir modal completo
testVehiculoTabs();

// Verificar estado del manager
console.log(window.vehiculoTabsManager.currentTab);
```

## 🚀 Próximos Pasos

### Funcionalidades Pendientes
1. **Subida de archivos**: Implementar drag & drop para fotos
2. **Chat en tiempo real**: WebSockets para bitácora
3. **Notificaciones push**: Alertas para tareas y inspecciones
4. **Reportes**: Exportación de datos de pestañas
5. **Búsqueda avanzada**: Filtros más sofisticados

### Optimizaciones
1. **Lazy loading**: Cargar contenido solo cuando sea necesario
2. **Caché**: Almacenar datos frecuentemente accedidos
3. **Paginación**: Para listas largas de elementos
4. **Offline**: Funcionalidad básica sin conexión

## 🐛 Solución de Problemas

### Problemas Comunes
1. **Pestañas no cargan**: Verificar que `vehiculo-tabs.js` esté incluido
2. **Errores de API**: Confirmar que las tablas de Supabase estén creadas
3. **Estilos no aplican**: Verificar que `styles.css` esté cargado
4. **Modal no abre**: Confirmar que `modals.js` esté funcionando

### Debug
```javascript
// Verificar estado del sistema
console.log('API disponible:', !!window.api);
console.log('App disponible:', !!window.app);
console.log('Tabs Manager:', !!window.vehiculoTabsManager);

// Verificar pestaña actual
console.log('Pestaña actual:', window.vehiculoTabsManager?.currentTab);
```

## 📚 Referencias

### Documentación
- [Bootstrap 5.3.2](https://getbootstrap.com/docs/5.3/)
- [Font Awesome 6.4.0](https://fontawesome.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)

### Archivos Relacionados
- `supabase_database_changes.sql`: Esquema de base de datos
- `BOOTSTRAP_MIGRATION.md`: Guía de migración a Bootstrap
- `styles.css`: Estilos personalizados del sistema

---

## ✅ Estado del Proyecto

**Estado**: ✅ **COMPLETADO - Frontend + Backend**
**Última actualización**: Diciembre 2024
**Versión**: 1.0.0

El sistema de pestañas está completamente implementado y funcional. Todas las APIs están conectadas y el frontend maneja correctamente la navegación y carga de contenido.
