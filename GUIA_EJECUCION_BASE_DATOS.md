# 🗄️ Guía de Ejecución de Cambios en Base de Datos - Flota v.3

## 📋 Resumen de Cambios

Este documento contiene las instrucciones para actualizar tu base de datos de Supabase para que coincida con el nuevo modal de vehículos que implementamos.

### 🔄 Cambios Principales

1. **Nuevas tablas de catálogos** (colores, carrocerías, combustibles, etc.)
2. **Campos adicionales en `arrendadoras`** (apoderado, cédula apoderado)
3. **Campos adicionales en `vehiculos`** (estatus, ubicación, renta semanal, etc.)
4. **Nuevas relaciones y foreign keys**
5. **Datos iniciales para catálogos**

## 🚀 Pasos de Ejecución

### **Paso 1: Acceder a Supabase**
1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto de Flota
4. Ve a **SQL Editor** en el menú lateral

### **Paso 2: Ejecutar Script Principal**
1. En el SQL Editor, crea un nuevo query
2. Copia y pega todo el contenido del archivo `supabase_database_changes.sql`
3. Haz clic en **RUN** para ejecutar el script completo

### **Paso 3: Verificar Ejecución**
El script incluye consultas de verificación al final. Deberías ver:
- Lista de tablas creadas
- Estructura actualizada de la tabla `vehiculos`

## ⚠️ Consideraciones Importantes

### **Antes de Ejecutar**
- ✅ **Hacer backup** de tu base de datos actual
- ✅ **Verificar** que no haya conflictos con datos existentes
- ✅ **Ejecutar en horario de bajo tráfico** si es posible

### **Durante la Ejecución**
- El script usa `IF NOT EXISTS` para evitar errores
- Los campos nuevos se crean como `NULL` para no afectar registros existentes
- Las foreign keys se crean después de crear las tablas referenciadas

### **Después de Ejecutar**
- Verificar que todas las tablas se crearon correctamente
- Confirmar que los campos nuevos están en la tabla `vehiculos`
- Probar la funcionalidad del nuevo modal de vehículos

## 🔍 Verificación Manual

### **Verificar Tablas Creadas**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'carrocerias', 'colores', 'combustibles', 'transmisiones', 
    'tracciones', 'estados_actuales', 'vendedores', 'whatsapp_grupos', 'apoderados'
);
```

### **Verificar Campos en Vehículos**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'vehiculos'
AND column_name IN (
    'estatus', 'ubicacion', 'renta_semanal', 'plazo_semanas',
    'cliente_actual', 'valor_adquisicion', 'fecha_adquisicion'
)
ORDER BY column_name;
```

### **Verificar Datos en Catálogos**
```sql
-- Verificar colores
SELECT COUNT(*) as total_colores FROM public.colores;

-- Verificar carrocerías
SELECT COUNT(*) as total_carrocerias FROM public.carrocerias;

-- Verificar combustibles
SELECT COUNT(*) as total_combustibles FROM public.combustibles;
```

## 🐛 Solución de Problemas

### **Error: "relation already exists"**
- El script usa `IF NOT EXISTS`, pero si ya existe la tabla, verifica que no haya conflictos
- Puedes eliminar la tabla existente y recrearla, o modificar el script

### **Error: "column already exists"**
- El script usa `IF NOT EXISTS` para columnas también
- Si la columna ya existe, verifica que sea del tipo correcto

### **Error: "foreign key constraint"**
- Asegúrate de que las tablas referenciadas existan antes de crear las foreign keys
- El script está diseñado para ejecutarse en orden secuencial

### **Error: "permission denied"**
- Verifica que tu usuario tenga permisos de `CREATE`, `ALTER`, y `INSERT`
- En Supabase, esto generalmente no es un problema

## 📊 Estructura Final Esperada

### **Nuevas Tablas**
- `carrocerias` - Tipos de carrocería de vehículos
- `colores` - Catálogo de colores
- `combustibles` - Tipos de combustible
- `transmisiones` - Tipos de transmisión
- `tracciones` - Tipos de tracción
- `estados_actuales` - Estados operativos de vehículos
- `vendedores` - Información de vendedores
- `whatsapp_grupos` - Grupos de WhatsApp
- `apoderados` - Representantes de arrendadoras

### **Campos Agregados a `vehiculos`**
- `estatus` - Estado del vehículo
- `ubicacion` - Ubicación física
- `renta_semanal` - Precio de renta semanal
- `plazo_semanas` - Plazo de contrato en semanas
- `cliente_actual` - Cliente que tiene el vehículo
- `valor_adquisicion` - Valor de compra
- `fecha_adquisicion` - Fecha de compra
- `grupo_whatsapp` - Enlace al grupo de WhatsApp
- `carroceria_id` - Referencia a tipo de carrocería
- `color_id` - Referencia a color
- `combustible_id` - Referencia a tipo de combustible
- `transmision_id` - Referencia a tipo de transmisión
- `traccion_id` - Referencia a tipo de tracción
- `apoderado_id` - Referencia a apoderado
- `vendedor_id` - Referencia a vendedor
- `whatsapp_grupo_id` - Referencia a grupo de WhatsApp
- `estado_actual_id` - Referencia a estado actual

## ✅ Checklist de Verificación

- [ ] Script ejecutado sin errores
- [ ] Todas las tablas nuevas creadas
- [ ] Campos nuevos agregados a `vehiculos`
- [ ] Foreign keys configuradas correctamente
- [ ] Datos iniciales insertados en catálogos
- [ ] Índices creados para optimización
- [ ] Modal de vehículos funciona correctamente
- [ ] Validaciones funcionan para nuevos campos
- [ ] Búsquedas y filtros funcionan

## 🎯 Próximos Pasos

1. **Probar funcionalidad** del nuevo modal de vehículos
2. **Verificar integridad** de datos existentes
3. **Actualizar frontend** si es necesario para nuevos campos
4. **Documentar** cambios realizados
5. **Capacitar usuarios** en nuevas funcionalidades

---

**📞 Soporte**: Si encuentras problemas durante la ejecución, revisa los logs de Supabase y verifica que todos los pasos se ejecutaron correctamente.
