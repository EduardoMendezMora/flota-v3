// Aplicación principal
class FlotaApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentModal = null;
        this.editingItem = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadDashboard();
        this.showToast('Sistema cargado correctamente', 'success');
    }

    setupEventListeners() {
        // Búsquedas
        document.getElementById('search-arrendadoras')?.addEventListener('input', this.debounce(() => this.filterArrendadoras(), 300));
        document.getElementById('search-vehiculos')?.addEventListener('input', this.debounce(() => this.filterVehiculos(), 300));
        document.getElementById('search-marcas')?.addEventListener('input', this.debounce(() => this.filterMarcas(), 300));
        document.getElementById('search-modelos')?.addEventListener('input', this.debounce(() => this.filterModelos(), 300));
        document.getElementById('search-estados')?.addEventListener('input', this.debounce(() => this.filterEstados(), 300));

        // Filtros
        document.getElementById('filter-arrendadora')?.addEventListener('change', () => this.filterVehiculos());
        document.getElementById('filter-estado')?.addEventListener('change', () => this.filterVehiculos());
        document.getElementById('filter-marca-modelo')?.addEventListener('change', () => this.filterModelos());

        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });

        // Cerrar modal con click fuera
        document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop') || e.target.id === 'modal-overlay') {
                this.closeModal();
            }
        });
    }

    // ===== NAVEGACIÓN =====
    showSection(sectionName) {
        // Ocultar todas las secciones
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar la sección seleccionada
        document.getElementById(sectionName).classList.add('active');

        // Actualizar navegación - usar las clases correctas
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.remove('active');
        });

        // Encontrar y activar el botón correcto
        const activeButton = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        this.currentSection = sectionName;

        // Cargar datos según la sección
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'arrendadoras':
                this.loadArrendadoras();
                break;
            case 'vehiculos':
                this.loadVehiculos();
                break;
            case 'marcas':
                this.loadMarcas();
                break;
            case 'modelos':
                this.loadModelos();
                break;
            case 'estados':
                this.loadEstados();
                break;
        }
    }

    // ===== DASHBOARD =====
    async loadDashboard() {
        try {
            const stats = await api.getEstadisticas();

            document.getElementById('total-arrendadoras').textContent = stats.totalArrendadoras;
            document.getElementById('total-vehiculos').textContent = stats.totalVehiculos;
            document.getElementById('total-marcas').textContent = stats.totalMarcas;
            document.getElementById('total-modelos').textContent = stats.totalModelos;

            await this.loadActividadReciente();
        } catch (error) {
            this.showToast('Error al cargar el dashboard', 'error');
        }
    }

    async loadActividadReciente() {
        try {
            const vehiculos = await api.getVehiculos({ limit: 5 });
            const container = document.getElementById('actividad-reciente');

            if (vehiculos.length === 0) {
                container.innerHTML = '<div class="activity-loading"><p class="text-gray-500">No hay actividad reciente</p></div>';
                return;
            }

            container.innerHTML = vehiculos.slice(0, 5).map(vehiculo => `
                <div class="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                    <div class="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">${vehiculo.placa}</p>
                        <p class="text-xs text-gray-500 truncate">${vehiculo.marcas?.nombre || 'Sin marca'} ${vehiculo.modelos?.nombre || 'Sin modelo'}</p>
                    </div>
                    <span class="text-xs text-gray-400 flex-shrink-0">${api.formatDate(vehiculo.created_at)}</span>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading recent activity:', error);
        }
    }

    // ===== ARRENDADORAS =====
    async loadArrendadoras() {
        try {
            const arrendadoras = await api.getArrendadoras();
            this.renderArrendadorasTable(arrendadoras);
        } catch (error) {
            this.showToast('Error al cargar arrendadoras', 'error');
        }
    }

    renderArrendadorasTable(arrendadoras) {
        const tbody = document.getElementById('arrendadoras-table');

        if (arrendadoras.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="table-loading"><div class="loading-spinner"></div><span>No hay empresas registradas</span></td></tr>';
            return;
        }

        tbody.innerHTML = arrendadoras.map(arrendadora => `
            <tr>
                <td>${arrendadora.id}</td>
                <td class="font-medium">${arrendadora.nombre}</td>
                <td>${arrendadora.identificacion_juridica || '-'}</td>
                <td>
                    <div class="flex space-x-2">
                        <button onclick="app.editArrendadora(${arrendadora.id})" class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="app.deleteArrendadora(${arrendadora.id})" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async filterArrendadoras() {
        const searchTerm = document.getElementById('search-arrendadoras').value.toLowerCase();
        const arrendadoras = await api.getArrendadoras();
        const filtered = arrendadoras.filter(a =>
            a.nombre.toLowerCase().includes(searchTerm) ||
            (a.identificacion_juridica && a.identificacion_juridica.toLowerCase().includes(searchTerm))
        );
        this.renderArrendadorasTable(filtered);
    }

    // ===== VEHÍCULOS =====
    async loadVehiculos() {
        try {
            const filters = this.getVehiculosFilters();
            const vehiculos = await api.getVehiculos(filters);
            this.renderVehiculosTable(vehiculos);
            await this.loadVehiculosFilters();
        } catch (error) {
            this.showToast('Error al cargar vehículos', 'error');
        }
    }

    getVehiculosFilters() {
        return {
            arrendadora_id: document.getElementById('filter-arrendadora')?.value || '',
            estado_inventario_id: document.getElementById('filter-estado')?.value || '',
            search: document.getElementById('search-vehiculos')?.value || ''
        };
    }

    async loadVehiculosFilters() {
        try {
            const [arrendadoras, estados] = await Promise.all([
                api.getArrendadoras(),
                api.getEstadosInventario()
            ]);

            // Llenar filtro de arrendadoras
            const arrendadoraSelect = document.getElementById('filter-arrendadora');
            if (arrendadoraSelect) {
                arrendadoraSelect.innerHTML = '<option value="">Todas las empresas</option>' +
                    arrendadoras.map(a => `<option value="${a.id}">${a.nombre}</option>`).join('');
            }

            // Llenar filtro de estados
            const estadoSelect = document.getElementById('filter-estado');
            if (estadoSelect) {
                estadoSelect.innerHTML = '<option value="">Todos los estados</option>' +
                    estados.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
            }
        } catch (error) {
            console.error('Error loading filters:', error);
        }
    }

    renderVehiculosTable(vehiculos) {
        const grid = document.getElementById('vehiculos-grid');

        if (vehiculos.length === 0) {
            grid.innerHTML = `
                <div class="vehicle-card-empty">
                    <i class="fas fa-car vehicle-card-empty-icon"></i>
                    <div class="vehicle-card-empty-text">No hay vehículos registrados</div>
                    <div class="vehicle-card-empty-subtext">Crea tu primer vehículo para comenzar</div>
                </div>
            `;
            return;
        }

        grid.innerHTML = vehiculos.map(vehiculo => `
            <div class="vehicle-card">
                <!-- Header de la tarjeta -->
                <div class="vehicle-card-header">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="vehicle-card-placa">${vehiculo.placa}</div>
                            <div class="vehicle-card-modelo">${vehiculo.marcas?.nombre || 'Sin marca'} ${vehiculo.modelos?.nombre || 'Sin modelo'}</div>
                            ${vehiculo.vin ? `<div class="text-xs text-gray-500 font-mono mt-1">VIN: ${vehiculo.vin}</div>` : ''}
                        </div>
                        <div class="flex flex-col items-end gap-1">
                            <span class="vehicle-card-badge vehicle-card-badge-id">#${vehiculo.id}</span>
                            <span class="vehicle-card-badge vehicle-card-badge-year">${vehiculo.anio || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Body de la tarjeta -->
                <div class="vehicle-card-body">
                    <div class="space-y-4">
                        <div class="vehicle-card-info">
                            <span class="vehicle-card-label">Arrendadora</span>
                            <span class="vehicle-card-value">${vehiculo.arrendadoras?.nombre || 'Sin asignar'}</span>
                        </div>
                        
                        <div class="vehicle-card-info">
                            <span class="vehicle-card-label">Estado</span>
                            <span class="vehicle-card-status ${api.getStatusBadgeClass(vehiculo.estado_inventario_id)}">
                                ${vehiculo.estados_inventario?.nombre || 'Sin estado'}
                            </span>
                        </div>
                        
                        <div class="vehicle-card-info">
                            <span class="vehicle-card-label">Precio Semanal</span>
                            <span class="vehicle-card-price">${api.formatCurrency(vehiculo.precio_semanal || 0)}</span>
                        </div>
                        
                        ${vehiculo.gastos_adms ? `
                        <div class="vehicle-card-info">
                            <span class="vehicle-card-label">Gastos Admin</span>
                            <span class="vehicle-card-gastos">${api.formatCurrency(vehiculo.gastos_adms)}</span>
                        </div>
                        ` : ''}

                        ${vehiculo.link_fotos ? `
                        <div class="vehicle-card-info">
                            <span class="vehicle-card-label">Fotos</span>
                            <a href="${vehiculo.link_fotos}" target="_blank" class="vehicle-card-fotos-link text-blue-600 hover:text-blue-800 text-sm">
                                <i class="fas fa-images mr-1"></i>Ver galería
                            </a>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Acciones de la tarjeta -->
                <div class="vehicle-card-actions">
                    <div class="vehicle-card-actions-left">
                        <span class="text-xs text-gray-500">
                            <i class="fas fa-clock mr-1"></i>
                            ${api.formatDate(vehiculo.created_at)}
                        </span>
                    </div>
                    <div class="vehicle-card-actions-right">
                        <button onclick="app.editVehiculo(${vehiculo.id})" class="vehicle-card-btn vehicle-card-btn-edit" title="Editar vehículo">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="app.deleteVehiculo(${vehiculo.id})" class="vehicle-card-btn vehicle-card-btn-delete" title="Eliminar vehículo">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async filterVehiculos() {
        await this.loadVehiculos();
    }

    // ===== MARCAS =====
    async loadMarcas() {
        try {
            const marcas = await api.getMarcas();
            this.renderMarcasTable(marcas);
        } catch (error) {
            this.showToast('Error al cargar marcas', 'error');
        }
    }

    renderMarcasTable(marcas) {
        const tbody = document.getElementById('marcas-table');

        if (marcas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="table-loading"><div class="loading-spinner"></div><span>No hay marcas registradas</span></td></tr>';
            return;
        }

        tbody.innerHTML = marcas.map(marca => `
            <tr>
                <td>${marca.id}</td>
                <td class="font-medium">${marca.nombre}</td>
                <td>-</td>
                <td>
                    <div class="flex space-x-2">
                        <button onclick="app.editMarca(${marca.id})" class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="app.deleteMarca(${marca.id})" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async filterMarcas() {
        const searchTerm = document.getElementById('search-marcas').value.toLowerCase();
        const marcas = await api.getMarcas();
        const filtered = marcas.filter(m => m.nombre.toLowerCase().includes(searchTerm));
        this.renderMarcasTable(filtered);
    }

    // ===== MODELOS =====
    async loadModelos() {
        try {
            const filters = this.getModelosFilters();
            const modelos = await api.getModelos(filters);
            this.renderModelosTable(modelos);
            await this.loadModelosFilters();
        } catch (error) {
            this.showToast('Error al cargar modelos', 'error');
        }
    }

    getModelosFilters() {
        return {
            marca_id: document.getElementById('filter-marca-modelo')?.value || '',
            search: document.getElementById('search-modelos')?.value || ''
        };
    }

    async loadModelosFilters() {
        try {
            const marcas = await api.getMarcas();
            const marcaSelect = document.getElementById('filter-marca-modelo');
            if (marcaSelect) {
                marcaSelect.innerHTML = '<option value="">Todas las marcas</option>' +
                    marcas.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('');
            }
        } catch (error) {
            console.error('Error loading marca filters:', error);
        }
    }

    renderModelosTable(modelos) {
        const tbody = document.getElementById('modelos-table');

        if (modelos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="table-loading"><div class="loading-spinner"></div><span>No hay modelos registrados</span></td></tr>';
            return;
        }

        tbody.innerHTML = modelos.map(modelo => `
            <tr>
                <td>${modelo.id}</td>
                <td class="font-medium">${modelo.nombre}</td>
                <td>${modelo.marcas?.nombre || 'Sin marca'}</td>
                <td>-</td>
                <td>
                    <div class="flex space-x-2">
                        <button onclick="app.editModelo(${modelo.id})" class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="app.deleteModelo(${modelo.id})" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async filterModelos() {
        await this.loadModelos();
    }

    // ===== ESTADOS =====
    async loadEstados() {
        try {
            const estados = await api.getEstadosInventario();
            this.renderEstadosTable(estados);
        } catch (error) {
            this.showToast('Error al cargar estados', 'error');
        }
    }

    renderEstadosTable(estados) {
        const tbody = document.getElementById('estados-table');

        if (estados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="table-loading"><div class="loading-spinner"></div><span>No hay estados registrados</span></td></tr>';
            return;
        }

        tbody.innerHTML = estados.map(estado => `
            <tr>
                <td>${estado.id}</td>
                <td class="font-medium">${estado.nombre}</td>
                <td>-</td>
                <td>
                    <div class="flex space-x-2">
                        <button onclick="app.editEstado(${estado.id})" class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="app.deleteEstado(${estado.id})" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async filterEstados() {
        const searchTerm = document.getElementById('search-estados').value.toLowerCase();
        const estados = await api.getEstadosInventario();
        const filtered = estados.filter(e => e.nombre.toLowerCase().includes(searchTerm));
        this.renderEstadosTable(filtered);
    }

    // ===== MODALES =====
    openModal(type, item = null) {
        this.currentModal = type;
        this.editingItem = item;

        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = this.getModalContent(type, item);

        const modalOverlay = document.getElementById('modal-overlay');
        modalOverlay.classList.remove('hidden');

        // Cargar datos específicos del modal después de renderizar
        setTimeout(async () => {
            try {
                switch (type) {
                    case 'vehiculo':
                        await loadVehiculoModalData();
                        break;
                    case 'modelo':
                        await loadModeloModalData();
                        break;
                }
            } catch (error) {
                console.error('Error loading modal data:', error);
            }

            // Enfocar el primer input
            const firstInput = modalContent.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    closeModal() {
        const modalOverlay = document.getElementById('modal-overlay');
        modalOverlay.classList.add('hidden');
        this.currentModal = null;
        this.editingItem = null;
    }

    getModalContent(type, item) {
        switch (type) {
            case 'arrendadora':
                return this.getArrendadoraModalContent(item);
            case 'vehiculo':
                return this.getVehiculoModalContent(item);
            case 'marca':
                return this.getMarcaModalContent(item);
            case 'modelo':
                return this.getModeloModalContent(item);
            case 'estado':
                return this.getEstadoModalContent(item);
            default:
                return '<div class="p-6">Modal no encontrado</div>';
        }
    }

    // ===== UTILIDADES =====
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ===== FUNCIONES CRUD =====
    // Arrendadoras
    async editArrendadora(id) {
        try {
            const arrendadora = await api.getArrendadora(id);
            if (arrendadora && arrendadora.length > 0) {
                this.openModal('arrendadora', arrendadora[0]);
            }
        } catch (error) {
            this.showToast('Error al cargar la arrendadora', 'error');
        }
    }

    async deleteArrendadora(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta arrendadora?')) {
            return;
        }

        try {
            await api.deleteArrendadora(id);
            this.showToast('Arrendadora eliminada correctamente', 'success');
            this.loadArrendadoras();
        } catch (error) {
            this.showToast('Error al eliminar la arrendadora', 'error');
        }
    }

    // Vehículos
    async editVehiculo(id) {
        try {
            const vehiculo = await api.getVehiculo(id);
            if (vehiculo && vehiculo.length > 0) {
                this.openModal('vehiculo', vehiculo[0]);
            }
        } catch (error) {
            this.showToast('Error al cargar el vehículo', 'error');
        }
    }

    async deleteVehiculo(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
            return;
        }

        try {
            await api.deleteVehiculo(id);
            this.showToast('Vehículo eliminado correctamente', 'success');
            this.loadVehiculos();
        } catch (error) {
            this.showToast('Error al eliminar el vehículo', 'error');
        }
    }

    // Marcas
    async editMarca(id) {
        try {
            const marca = await api.getMarca(id);
            if (marca && marca.length > 0) {
                this.openModal('marca', marca[0]);
            }
        } catch (error) {
            this.showToast('Error al cargar la marca', 'error');
        }
    }

    async deleteMarca(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta marca?')) {
            return;
        }

        try {
            await api.deleteMarca(id);
            this.showToast('Marca eliminada correctamente', 'success');
            this.loadMarcas();
        } catch (error) {
            this.showToast('Error al eliminar la marca', 'error');
        }
    }

    // Modelos
    async editModelo(id) {
        try {
            const modelo = await api.getModelo(id);
            if (modelo && modelo.length > 0) {
                this.openModal('modelo', modelo[0]);
            }
        } catch (error) {
            this.showToast('Error al cargar el modelo', 'error');
        }
    }

    async deleteModelo(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este modelo?')) {
            return;
        }

        try {
            await api.deleteModelo(id);
            this.showToast('Modelo eliminado correctamente', 'success');
            this.loadModelos();
        } catch (error) {
            this.showToast('Error al eliminar el modelo', 'error');
        }
    }

    // Estados
    async editEstado(id) {
        try {
            const estado = await api.getEstadoInventario(id);
            if (estado && estado.length > 0) {
                this.openModal('estado', estado[0]);
            }
        } catch (error) {
            this.showToast('Error al cargar el estado', 'error');
        }
    }

    async deleteEstado(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este estado?')) {
            return;
        }

        try {
            await api.deleteEstadoInventario(id);
            this.showToast('Estado eliminado correctamente', 'success');
            this.loadEstados();
        } catch (error) {
            this.showToast('Error al eliminar el estado', 'error');
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <i class="fas fa-${this.getToastIcon(type)}"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">${message}</p>
                </div>
                <div class="ml-auto pl-3">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getToastColor(type) {
        const colors = {
            success: 'green',
            error: 'red',
            warning: 'yellow',
            info: 'blue'
        };
        return colors[type] || 'blue';
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FlotaApp();
});

// Funciones globales para los botones
function showSection(sectionName) {
    if (window.app) {
        window.app.showSection(sectionName);
    }
}

function openModal(type, item = null) {
    if (window.app) {
        window.app.openModal(type, item);
    }
}