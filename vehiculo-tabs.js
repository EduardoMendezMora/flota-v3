// =====================================================
// SISTEMA DE PESTAÑAS PARA VEHÍCULOS
// =====================================================

class VehiculoTabsManager {
    constructor() {
        this.currentTab = 'general';
        this.currentVehiculoId = null;
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupEventListeners();
    }

    // Configurar navegación de pestañas
    setupTabNavigation() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-button')) {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            }
        });
    }

    // Configurar event listeners
    setupEventListeners() {
        // Filtros de tareas
        document.addEventListener('change', (e) => {
            if (e.target.id === 'filtro-estado-tareas') {
                this.filterTareas();
            }
            if (e.target.id === 'filtro-prioridad-tareas') {
                this.filterTareas();
            }
        });

        // Filtros de inspecciones
        document.addEventListener('change', (e) => {
            if (e.target.id === 'filtro-estado-inspecciones') {
                this.filterInspecciones();
            }
            if (e.target.id === 'filtro-machote-inspecciones') {
                this.filterInspecciones();
            }
        });

        // Filtros de kilometraje
        document.addEventListener('change', (e) => {
            if (e.target.id === 'filtro-periodo-kilometraje') {
                this.filterKilometraje();
            }
        });

        // Filtros de GPS
        document.addEventListener('change', (e) => {
            if (e.target.id === 'filtro-estado-gps') {
                this.filterGPS();
            }
        });

        // Filtros de repuestos
        document.addEventListener('change', (e) => {
            if (e.target.id === 'filtro-estado-repuestos') {
                this.filterRepuestos();
            }
            if (e.target.id === 'filtro-prioridad-repuestos') {
                this.filterRepuestos();
            }
        });

        // Mensaje de bitácora
        document.addEventListener('keypress', (e) => {
            if (e.target.id === 'mensaje-bitacora' && e.key === 'Enter') {
                e.preventDefault();
                this.enviarMensajeBitacora();
            }
        });
    }

    // Cambiar de pestaña
    switchTab(tabName) {
        // Ocultar todas las pestañas
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });

        // Desactivar todos los botones
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });

        // Mostrar pestaña seleccionada
        const targetPane = document.getElementById(`tab-${tabName}`);
        if (targetPane) {
            targetPane.classList.add('active');
        }

        // Activar botón seleccionado
        const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }

        this.currentTab = tabName;

        // Cargar contenido de la pestaña
        this.loadTabContent(tabName);
    }

    // Cargar contenido de la pestaña
    async loadTabContent(tabName) {
        if (!this.currentVehiculoId) return;

        try {
            switch (tabName) {
                case 'galeria':
                    await this.loadGaleria();
                    break;
                case 'tareas':
                    await this.loadTareas();
                    break;
                case 'inspecciones':
                    await this.loadInspecciones();
                    break;
                case 'bitacora':
                    await this.loadBitacora();
                    break;
                case 'kilometraje':
                    await this.loadKilometraje();
                    break;
                case 'gps':
                    await this.loadGPS();
                    break;
                case 'repuestos':
                    await this.loadRepuestos();
                    break;
            }
        } catch (error) {
            console.error(`Error cargando pestaña ${tabName}:`, error);
            this.showError(`Error cargando ${tabName}`);
        }
    }

    // ===== PESTAÑA: GALERÍA =====
    async loadGaleria() {
        const container = document.getElementById(`galeria-vehiculo-${this.currentVehiculoId}`);
        if (!container) return;

        try {
            container.innerHTML = `
                <div class="galeria-loading">
                    <i class="fas fa-spinner fa-spin fa-2x"></i>
                    <p>Cargando galería...</p>
                </div>
            `;

            // Aquí iría la llamada a la API para obtener las fotos
            // const fotos = await api.getVehiculoFotos(this.currentVehiculoId);
            
            // Por ahora, mostrar mensaje de implementación
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-images fa-3x text-muted mb-3"></i>
                    <h5 class="mb-2">Galería de Fotos</h5>
                    <p class="text-muted mb-3">Funcionalidad en desarrollo</p>
                    <button class="btn btn-primary" onclick="vehiculoTabsManager.uploadFoto()">
                        <i class="fas fa-upload me-2"></i>
                        Subir Foto
                    </button>
                </div>
            `;
        } catch (error) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h5 class="mb-2">Error al cargar galería</h5>
                    <p class="text-muted mb-3">${error.message}</p>
                    <button class="btn btn-outline-primary" onclick="vehiculoTabsManager.loadGaleria()">
                        <i class="fas fa-redo me-2"></i>
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    // ===== PESTAÑA: TAREAS =====
    async loadTareas() {
        const container = document.getElementById(`tareas-vehiculo-${this.currentVehiculoId}`);
        if (!container) return;

        try {
            container.innerHTML = `
                <div class="tareas-loading">
                    <i class="fas fa-spinner fa-spin fa-2x"></i>
                    <p>Cargando tareas...</p>
                </div>
            `;

            // Aquí iría la llamada a la API para obtener las tareas
            // const tareas = await api.getTareasVehiculo(this.currentVehiculoId);
            
            // Por ahora, mostrar mensaje de implementación
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-tasks fa-3x text-muted mb-3"></i>
                    <h5 class="mb-2">Tareas del Vehículo</h5>
                    <p class="text-muted mb-3">Funcionalidad en desarrollo</p>
                    <button class="btn btn-primary" onclick="vehiculoTabsManager.crearTareaVehiculo()">
                        <i class="fas fa-plus me-2"></i>
                        Nueva Tarea
                    </button>
                </div>
            `;
        } catch (error) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h5 class="mb-2">Error al cargar tareas</h5>
                    <p class="text-muted mb-3">${error.message}</p>
                    <button class="btn btn-outline-primary" onclick="vehiculoTabsManager.loadTareas()">
                        <i class="fas fa-redo me-2"></i>
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    // ===== PESTAÑA: INSPECCIONES =====
    async loadInspecciones() {
        const container = document.getElementById(`inspecciones-vehiculo-${this.currentVehiculoId}`);
        if (!container) return;

        try {
            container.innerHTML = `
                <div class="inspecciones-loading">
                    <i class="fas fa-spinner fa-spin fa-2x"></i>
                    <p>Cargando inspecciones...</p>
                </div>
            `;

            // Aquí iría la llamada a la API para obtener las inspecciones
            // const inspecciones = await api.getVehiculoInspecciones(this.currentVehiculoId);
            
            // Por ahora, mostrar mensaje de implementación
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-clipboard-check fa-3x text-muted mb-3"></i>
                    <h5 class="mb-2">Inspecciones del Vehículo</h5>
                    <p class="text-muted mb-3">Funcionalidad en desarrollo</p>
                    <button class="btn btn-primary" onclick="vehiculoTabsManager.nuevaInspeccion()">
                        <i class="fas fa-plus me-2"></i>
                        Nueva Inspección
                    </button>
                </div>
            `;
        } catch (error) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h5 class="mb-2">Error al cargar inspecciones</h5>
                    <p class="text-muted mb-3">${error.message}</p>
                    <button class="btn btn-outline-primary" onclick="vehiculoTabsManager.loadInspecciones()">
                        <i class="fas fa-redo me-2"></i>
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    // ===== PESTAÑA: BITÁCORA =====
    async loadBitacora() {
        const container = document.getElementById(`bitacora-vehiculo-${this.currentVehiculoId}`);
        if (!container) return;

        try {
            container.innerHTML = `
                <div class="bitacora-loading">
                    <i class="fas fa-spinner fa-spin fa-2x"></i>
                    <p>Cargando bitácora...</p>
                </div>
            `;

            // Aquí iría la llamada a la API para obtener la bitácora
            // const bitacora = await api.getVehiculoBitacora(this.currentVehiculoId);
            
            // Por ahora, mostrar mensaje de implementación
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-comments fa-3x text-muted mb-3"></i>
                    <h5 class="mb-2">Bitácora del Vehículo</h5>
                    <p class="text-muted mb-3">Funcionalidad en desarrollo</p>
                    <p class="text-muted small">Escribe un comentario en el campo de arriba para comenzar</p>
                </div>
            `;
        } catch (error) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h5 class="mb-2">Error al cargar bitácora</h5>
                    <p class="text-muted mb-3">${error.message}</p>
                    <button class="btn btn-outline-primary" onclick="vehiculoTabsManager.loadBitacora()">
                        <i class="fas fa-redo me-2"></i>
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    // ===== PESTAÑA: KILOMETRAJE =====
    async loadKilometraje() {
        const container = document.getElementById(`kilometraje-vehiculo-${this.currentVehiculoId}`);
        if (!container) return;

        try {
            container.innerHTML = `
                <div class="kilometraje-loading">
                    <i class="fas fa-spinner fa-spin fa-2x"></i>
                    <p>Cargando historial...</p>
                </div>
            `;

            // Aquí iría la llamada a la API para obtener el kilometraje
            // const kilometraje = await api.getVehiculoKilometraje(this.currentVehiculoId);
            
            // Por ahora, mostrar mensaje de implementación
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-tachometer-alt fa-3x text-muted mb-3"></i>
                    <h5 class="mb-2">Historial de Kilometraje</h5>
                    <p class="text-muted mb-3">Funcionalidad en desarrollo</p>
                    <button class="btn btn-primary" onclick="vehiculoTabsManager.nuevoRegistroKilometraje()">
                        <i class="fas fa-plus me-2"></i>
                        Nuevo Registro
                    </button>
                </div>
            `;
        } catch (error) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h5 class="mb-2">Error al cargar kilometraje</h5>
                    <p class="text-muted mb-3">${error.message}</p>
                    <button class="btn btn-outline-primary" onclick="vehiculoTabsManager.loadKilometraje()">
                        <i class="fas fa-redo me-2"></i>
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    // ===== PESTAÑA: GPS =====
    async loadGPS() {
        const container = document.getElementById(`gps-vehiculo-${this.currentVehiculoId}`);
        if (!container) return;

        try {
            container.innerHTML = `
                <div class="gps-loading">
                    <i class="fas fa-spinner fa-spin fa-2x"></i>
                    <p>Cargando dispositivos GPS...</p>
                </div>
            `;

            // Aquí iría la llamada a la API para obtener los dispositivos GPS
            // const dispositivos = await api.getVehiculoGPS(this.currentVehiculoId);
            
            // Por ahora, mostrar mensaje de implementación
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-satellite-dish fa-3x text-muted mb-3"></i>
                    <h5 class="mb-2">Dispositivos GPS</h5>
                    <p class="text-muted mb-3">Funcionalidad en desarrollo</p>
                    <button class="btn btn-primary" onclick="vehiculoTabsManager.nuevoDispositivoGPS()">
                        <i class="fas fa-plus me-2"></i>
                        Nuevo Dispositivo
                    </button>
                </div>
            `;
        } catch (error) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h5 class="mb-2">Error al cargar dispositivos GPS</h5>
                    <p class="text-muted mb-3">${error.message}</p>
                    <button class="btn btn-outline-primary" onclick="vehiculoTabsManager.loadGPS()">
                        <i class="fas fa-redo me-2"></i>
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    // ===== PESTAÑA: REPUESTOS =====
    async loadRepuestos() {
        const container = document.getElementById(`repuestos-vehiculo-${this.currentVehiculoId}`);
        if (!container) return;

        try {
            container.innerHTML = `
                <div class="repuestos-loading">
                    <i class="fas fa-spinner fa-spin fa-2x"></i>
                    <p>Cargando solicitudes...</p>
                </div>
            `;

            // Aquí iría la llamada a la API para obtener las solicitudes de repuestos
            // const repuestos = await api.getVehiculoRepuestos(this.currentVehiculoId);
            
            // Por ahora, mostrar mensaje de implementación
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-tools fa-3x text-muted mb-3"></i>
                    <h5 class="mb-2">Solicitudes de Repuestos</h5>
                    <p class="text-muted mb-3">Funcionalidad en desarrollo</p>
                    <button class="btn btn-primary" onclick="vehiculoTabsManager.nuevaSolicitudRepuesto()">
                        <i class="fas fa-plus me-2"></i>
                        Nueva Solicitud
                    </button>
                </div>
            `;
        } catch (error) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h5 class="mb-2">Error al cargar solicitudes</h5>
                    <p class="text-muted mb-3">${error.message}</p>
                    <button class="btn btn-outline-primary" onclick="vehiculoTabsManager.loadRepuestos()">
                        <i class="fas fa-redo me-2"></i>
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    // ===== FUNCIONES DE FILTRADO =====
    filterTareas() {
        // Implementar filtrado de tareas
        console.log('Filtrando tareas...');
    }

    filterInspecciones() {
        // Implementar filtrado de inspecciones
        console.log('Filtrando inspecciones...');
    }

    filterKilometraje() {
        // Implementar filtrado de kilometraje
        console.log('Filtrando kilometraje...');
    }

    filterGPS() {
        // Implementar filtrado de GPS
        console.log('Filtrando GPS...');
    }

    filterRepuestos() {
        // Implementar filtrado de repuestos
        console.log('Filtrando repuestos...');
    }

    // ===== FUNCIONES DE ACCIÓN =====
    uploadFoto() {
        // Implementar subida de foto
        console.log('Subiendo foto...');
        app.showToast('Funcionalidad en desarrollo', 'info');
    }

    crearTareaVehiculo() {
        // Implementar creación de tarea
        console.log('Creando tarea...');
        app.showToast('Funcionalidad en desarrollo', 'info');
    }

    nuevaInspeccion() {
        // Implementar nueva inspección
        console.log('Nueva inspección...');
        app.showToast('Funcionalidad en desarrollo', 'info');
    }

    enviarMensajeBitacora() {
        const input = document.getElementById('mensaje-bitacora');
        if (!input || !input.value.trim()) return;

        // Implementar envío de mensaje
        console.log('Enviando mensaje:', input.value);
        app.showToast('Funcionalidad en desarrollo', 'info');
        
        // Limpiar input
        input.value = '';
    }

    nuevoRegistroKilometraje() {
        // Implementar nuevo registro de kilometraje
        console.log('Nuevo registro de kilometraje...');
        app.showToast('Funcionalidad en desarrollo', 'info');
    }

    nuevoDispositivoGPS() {
        // Implementar nuevo dispositivo GPS
        console.log('Nuevo dispositivo GPS...');
        app.showToast('Funcionalidad en desarrollo', 'info');
    }

    nuevaSolicitudRepuesto() {
        // Implementar nueva solicitud de repuesto
        console.log('Nueva solicitud de repuesto...');
        app.showToast('Funcionalidad en desarrollo', 'info');
    }

    // ===== FUNCIONES DE REFRESH =====
    refreshGaleria() {
        this.loadGaleria();
    }

    refreshTareasVehiculo() {
        this.loadTareas();
    }

    refreshInspecciones() {
        this.loadInspecciones();
    }

    refreshBitacora() {
        this.loadBitacora();
    }

    refreshKilometraje() {
        this.loadKilometraje();
    }

    refreshGPS() {
        this.loadGPS();
    }

    refreshRepuestos() {
        this.loadRepuestos();
    }

    // ===== FUNCIONES DE GESTIÓN =====
    manageMachotes() {
        // Implementar gestión de machotes
        console.log('Gestionando machotes...');
        app.showToast('Funcionalidad en desarrollo', 'info');
    }

    adjuntarArchivoBitacora() {
        // Implementar adjuntar archivo
        console.log('Adjuntando archivo...');
        app.showToast('Funcionalidad en desarrollo', 'info');
    }

    // ===== UTILIDADES =====
    setVehiculoId(id) {
        this.currentVehiculoId = id;
    }

    showError(message) {
        app.showToast(message, 'error');
    }

    showSuccess(message) {
        app.showToast(message, 'success');
    }

    showInfo(message) {
        app.showToast(message, 'info');
    }
}

// Instancia global del gestor de pestañas
const vehiculoTabsManager = new VehiculoTabsManager();

// Funciones globales para compatibilidad
window.vehiculoTabsManager = vehiculoTabsManager;
