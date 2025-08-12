// Configuración de Supabase
const SUPABASE_CONFIG = {
    url: 'https://yeavqyshoamtfgyyqlyb.supabase.co',
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllYXZxeXNob2FtdGZneXlxbHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTY3NjQsImV4cCI6MjA2OTkzMjc2NH0.RDkRmCYMTGgOkAnIakUR9LjlotSLstOJOuIXyNoKbFw',
    headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllYXZxeXNob2FtdGZneXlxbHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTY3NjQsImV4cCI6MjA2OTkzMjc2NH0.RDkRmCYMTGgOkAnIakUR9LjlotSLstOJOuIXyNoKbFw',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllYXZxeXNob2FtdGZneXlxbHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTY3NjQsImV4cCI6MjA2OTkzMjc2NH0.RDkRmCYMTGgOkAnIakUR9LjlotSLstOJOuIXyNoKbFw'
    }
};

// Configuraciones globales
const APP_CONFIG = {
    itemsPerPage: 10,
    dateFormat: 'DD/MM/YYYY',
    currency: 'CRC',
    defaultFilters: {
        arrendadora: '',
        estado: '',
        marca: ''
    }
};

// Estados predefinidos para vehículos
const ESTADOS_VEHICULO = [
    { id: 1, nombre: 'Disponible' },
    { id: 2, nombre: 'Rentado' },
    { id: 3, nombre: 'En Mantenimiento' },
    { id: 4, nombre: 'Fuera de Servicio' },
    { id: 5, nombre: 'Vendido' }
];

// Tipos de combustible
const TIPOS_COMBUSTIBLE = [
    { id: 1, nombre: 'Gasolina' },
    { id: 2, nombre: 'Diesel' },
    { id: 3, nombre: 'Eléctrico' },
    { id: 4, nombre: 'Híbrido' },
    { id: 5, nombre: 'Gas' }
];

// Tipos de transmisión
const TIPOS_TRANSMISION = [
    { id: 1, nombre: 'Manual' },
    { id: 2, nombre: 'Automático' },
    { id: 3, nombre: 'CVT' }
];

// Tipos de tracción
const TIPOS_TRACCION = [
    { id: 1, nombre: '2WD' },
    { id: 2, nombre: '4WD' },
    { id: 3, nombre: 'AWD' }
];

// Tipos de carrocería
const TIPOS_CARROCERIA = [
    { id: 1, nombre: 'Sedán' },
    { id: 2, nombre: 'SUV' },
    { id: 3, nombre: 'Pickup' },
    { id: 4, nombre: 'Van' },
    { id: 5, nombre: 'Hatchback' },
    { id: 6, nombre: 'Wagon' }
];

// Colores comunes
const COLORES = [
    { id: 1, nombre: 'Blanco' },
    { id: 2, nombre: 'Negro' },
    { id: 3, nombre: 'Gris' },
    { id: 4, nombre: 'Plateado' },
    { id: 5, nombre: 'Azul' },
    { id: 6, nombre: 'Rojo' },
    { id: 7, nombre: 'Verde' },
    { id: 8, nombre: 'Amarillo' },
    { id: 9, nombre: 'Naranja' },
    { id: 10, nombre: 'Marrón' }
];
