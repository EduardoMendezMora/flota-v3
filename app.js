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
            if (e.target.id === 'modal-overlay') this.closeModal();
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

        // Actualizar navegación
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

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
                container.innerHTML = '<p class="text-gray-500">No hay actividad reciente</p>';
                return;
            }

            container.innerHTML = vehiculos.map(vehiculo => `
                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div class="flex-1">
                        <p class="text-sm font-medium">${vehiculo.placa}</p>
                        <p class="text-xs text-gray-500">${vehiculo.marcas?.nombre} ${vehiculo.modelos?.nombre}</p>
                    </div>
                    <span class="text-xs text-gray-400">${api.formatDate(vehiculo.created_at)}</span>
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
            tbody.innerHTML = '<tr><td colspan="4" class="px-4 py-8 text-center text-gray-500">No hay arrendadoras registradas</td></tr>';
            return;
        }

        tbody.innerHTML = arrendadoras.map(arrendadora => `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3">${arrendadora.id}</td>
                <td class="px-4 py-3 font-medium">${arrendadora.nombre}</td>
                <td class="px-4 py-3">${arrendadora.identificacion_juridica || '-'}</td>
                <td class="px-4 py-3">
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
                arrendadoraSelect.innerHTML = '<option value="">Todas las arrendadoras</option>' +
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
                    <div class="vehicle-card-placa">${vehiculo.placa}</div>
                    <div class="vehicle-card-modelo">${vehiculo.marcas?.nombre} ${vehiculo.modelos?.nombre}</div>
                </div>
                
                <!-- Body de la tarjeta -->
                <div class="vehicle-card-body">
                    <div class="vehicle-card-info">
                        <span class="vehicle-card-label">Año</span>
                        <span class="vehicle-card-value">${vehiculo.anio}</span>
                    </div>
                    
                    <div class="vehicle-card-info">
                        <span class="vehicle-card-label">Arrendadora</span>
                        <span class="vehicle-card-value">${vehiculo.arrendadoras?.nombre || 'Sin asignar'}</span>
                    </div>
                    
                    <div class="vehicle-card-info">
                        <span class="vehicle-card-label">Precio Semanal</span>
                        <span class="vehicle-card-price">${api.formatCurrency(vehiculo.precio_semanal || 0)}</span>
                    </div>
                    
                    <div class="vehicle-card-info">
                        <span class="vehicle-card-label">Estado</span>
                        <span class="vehicle-card-status ${api.getStatusBadgeClass(vehiculo.estado_inventario_id)}">
                            ${vehiculo.estados_inventario?.nombre || 'Sin estado'}
                        </span>
                    </div>
                </div>
                
                <!-- Acciones de la tarjeta -->
                <div class="vehicle-card-actions">
                    <button onclick="app.editVehiculo(${vehiculo.id})" class="vehicle-card-btn vehicle-card-btn-edit" title="Editar vehículo">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="app.deleteVehiculo(${vehiculo.id})" class="vehicle-card-btn vehicle-card-btn-delete" title="Eliminar vehículo">
                        <i class="fas fa-trash"></i>
                    </button>
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
            tbody.innerHTML = '<tr><td colspan="4" class="px-4 py-8 text-center text-gray-500">No hay marcas registradas</td></tr>';
            return;
        }

        tbody.innerHTML = marcas.map(marca => `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3">${marca.id}</td>
                <td class="px-4 py-3 font-medium">${marca.nombre}</td>
                <td class="px-4 py-3">-</td>
                <td class="px-4 py-3">
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
            tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">No hay modelos registrados</td></tr>';
            return;
        }

        tbody.innerHTML = modelos.map(modelo => `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3">${modelo.id}</td>
                <td class="px-4 py-3 font-medium">${modelo.nombre}</td>
                <td class="px-4 py-3">${modelo.marcas?.nombre}</td>
                <td class="px-4 py-3">-</td>
                <td class="px-4 py-3">
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
            tbody.innerHTML = '<tr><td colspan="4" class="px-4 py-8 text-center text-gray-500">No hay estados registrados</td></tr>';
            return;
        }

        tbody.innerHTML = estados.map(estado => `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3">${estado.id}</td>
                <td class="px-4 py-3 font-medium">${estado.nombre}</td>
                <td class="px-4 py-3">-</td>
                <td class="px-4 py-3">
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
        
        document.getElementById('modal-overlay').classList.remove('hidden');
        
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
        document.getElementById('modal-overlay').classList.add('hidden');
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
                    <i class="fas fa-${this.getToastIcon(type)} text-${this.getToastColor(type)}-500"></i>
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
    app.showSection(sectionName);
}

function openModal(type, item = null) {
    app.openModal(type, item);
}
