// Configuración de Supabase
const SUPABASE_CONFIG = {
    url: 'https://yeavqyshoamtfgyyqlyb.supabase.co',
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllYXZxeXNob2FtdGZneXlxbHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTY3NjQsImV4cCI6MjA2OTkzMjc2NH0.RDkRmCYMTGgOkAnIakUR9LjlotSLstOJOuIXyNoKbFw',
    headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllYXZxeXNob2FtdGZneXlxbHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTY3NjQsImV4cCI6MjA2OTkzMjc2NH0.RDkRmCYMTGgOkAnIakUR9LjlotSLstOJOuIXyNoKbFw',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllYXZxeXNob2FtdGZneXlxbHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTY3NjQsImV4cCI6MjA2OTkzMjc2NH0.RDkRmCYMTGgOkAnIakUR9LjlotSLstOJOuIXyNoKbFw'
    }
};

// Configuraciones globales de la aplicación
const APP_CONFIG = {
    itemsPerPage: 10,
    dateFormat: 'DD/MM/YYYY',
    currency: 'CRC',
    debounceDelay: 300,
    toastDuration: 5000,
    defaultFilters: {
        arrendadora: '',
        estado: '',
        marca: ''
    },
    animation: {
        duration: 200,
        easing: 'ease'
    }
};

// Estados predefinidos para vehículos
const ESTADOS_VEHICULO = [
    { id: 1, nombre: 'Disponible', color: '#34C759', class: 'status-available' },
    { id: 2, nombre: 'Rentado', color: '#007AFF', class: 'status-rented' },
    { id: 3, nombre: 'En Mantenimiento', color: '#FF9500', class: 'status-maintenance' },
    { id: 4, nombre: 'Fuera de Servicio', color: '#FF3B30', class: 'status-out-of-service' },
    { id: 5, nombre: 'Vendido', color: '#8E8E93', class: 'status-sold' }
];

// Constantes adicionales para formularios
const FORM_CONSTANTS = {
    currentYear: new Date().getFullYear(),
    minYear: 1900,
    maxYear: new Date().getFullYear() + 2,
    placeholders: {
        placa: 'ABC123, BDH657, 835282...',
        vin: '1HGBH41JXMN109186',
        empresa: 'Rent a Car Costa Rica S.A.',
        identificacion: '3-101-672906',
        marca: 'Toyota, Honda, Ford',
        modelo: 'Corolla, Civic, Focus',
        estado: 'Disponible, En Mantenimiento',
        fotos: 'https://ejemplo.com/fotos'
    },
    validation: {
        // Patrones de placa más flexibles para diferentes formatos
        placaPatterns: [
            /^[A-Z]{3}-\d{3}$/,      // ABC-123 (estándar con guión)
            /^[A-Z]{3}\d{3}$/,       // ABC123 (estándar sin guión)
            /^[A-Z]{2,3}\d{3,4}$/,   // AB123, ABC123, AB1234, ABC1234
            /^[A-Z]{2}-\d{4}$/,      // AB-1234 (placas antiguas)
            /^\d{6}$/,               // 123456 (solo números)
            /^[A-Z]{1,3}\d{1,4}$/    // A123, AB123, ABC1234 (flexible)
        ],
        vinPattern: /^[A-HJ-NPR-Z0-9]{17}$/,
        urlPattern: /^https?:\/\/.+/
    }
};

// Mensajes del sistema
const MESSAGES = {
    success: {
        create: 'creado correctamente',
        update: 'actualizado correctamente',
        delete: 'eliminado correctamente',
        load: 'cargado correctamente'
    },
    error: {
        create: 'Error al crear',
        update: 'Error al actualizar',
        delete: 'Error al eliminar',
        load: 'Error al cargar',
        required: 'Por favor completa todos los campos obligatorios',
        network: 'Error de conexión. Intenta nuevamente.',
        validation: 'Los datos ingresados no son válidos'
    },
    confirm: {
        delete: '¿Estás seguro de que quieres eliminar este elemento?'
    }
};

// Configuración de performance
const PERFORMANCE_CONFIG = {
    enableCache: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutos
    maxRetries: 3,
    retryDelay: 1000
};

// Exportar configuraciones para uso global
window.APP_CONFIG = APP_CONFIG;
window.ESTADOS_VEHICULO = ESTADOS_VEHICULO;
window.FORM_CONSTANTS = FORM_CONSTANTS;
window.MESSAGES = MESSAGES;
window.PERFORMANCE_CONFIG = PERFORMANCE_CONFIG;