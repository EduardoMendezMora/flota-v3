// Aplicación principal mejorada
class FlotaApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentModal = null;
        this.editingItem = null;
        this.modalManager = new ModalManager();
        this.loadingStates = new Map();
        this.debounceTimers = new Map();
        this.init();
    }

    async init() {
        try {
            this.setupEventListeners();
            await this.loadDashboard();
            this.showToast('Sistema cargado correctamente', 'success');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showToast('Error al cargar el sistema', 'error');
        }
    }

    setupEventListeners() {
        // Búsquedas con debounce mejorado
        this.setupSearchListeners();

        // Filtros
        this.setupFilterListeners();

        // Modal listeners
        this.setupModalListeners();

        // Network status
        this.setupNetworkListeners();
    }

    setupSearchListeners() {
        const searchInputs = [
            { id: 'search-arrendadoras', callback: () => this.filterArrendadoras() },
            { id: 'search-vehiculos', callback: () => this.filterVehiculos() },
            { id: 'search-marcas', callback: () => this.filterMarcas() },
            { id: 'search-modelos', callback: () => this.filterModelos() },
            { id: 'search-estados', callback: () => this.filterEstados() }
        ];

        searchInputs.forEach(({ id, callback }) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', (e) => {
                    this.debounce(id, callback, APP_CONFIG.debounceDelay);
                });
                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        this.clearDebounce(id);
                        callback();
                    }
                });
            }
        });
    }

    setupFilterListeners() {
        const filters = [
            { id: 'filter-arrendadora', callback: () => this.filterVehiculos() },
            { id: 'filter-estado', callback: () => this.filterVehiculos() },
            { id: 'filter-marca-modelo', callback: () => this.filterModelos() }
        ];

        filters.forEach(({ id, callback }) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', callback);
            }
        });
    }

    setupModalListeners() {
        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeModal();
            }
        });

        // Cerrar modal con click fuera
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-backdrop') || e.target.id === 'modal-overlay') {
                    this.closeModal();
                }
            });
        }
    }

    setupNetworkListeners() {
        window.addEventListener('online', () => {
            this.showToast('Conexión restaurada', 'success');
            this.refreshCurrentSection();
        });

        window.addEventListener('offline', () => {
            this.showToast('Sin conexión a internet', 'warning');
        });
    }

    // ===== UTILIDADES =====
    debounce(id, func, wait) {
        this.clearDebounce(id);
        this.debounceTimers.set(id, setTimeout(func, wait));
    }

    clearDebounce(id) {
        const timer = this.debounceTimers.get(id);
        if (timer) {
            clearTimeout(timer);
            this.debounceTimers.delete(id);
        }
    }

    setLoading(key, isLoading) {
        this.loadingStates.set(key, isLoading);
        this.updateLoadingUI(key, isLoading);
    }

    updateLoadingUI(key, isLoading) {
        const loadingElement = document.querySelector(`[data-loading="${key}"]`);
        if (loadingElement) {
            if (isLoading) {
                loadingElement.classList.add('loading');
            } else {
                loadingElement.classList.remove('loading');
            }
        }
    }

    // ===== NAVEGACIÓN =====
    showSection(sectionName) {
        try {
            // Ocultar todas las secciones
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });

            // Mostrar la sección seleccionada
            const targetSection = document.getElementById(sectionName);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Actualizar navegación
            document.querySelectorAll('.nav-item').forEach(btn => {
                btn.classList.remove('active');
            });

            const activeButton = document.querySelector(`[data-section="${sectionName}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
            }

            this.currentSection = sectionName;

            // Cargar datos según la sección
            this.loadSectionData(sectionName);
        } catch (error) {
            console.error('Error showing section:', error);
            this.showToast('Error al cargar la sección', 'error');
        }
    }

    async loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                await this.loadDashboard();
                break;
            case 'arrendadoras':
                await this.loadArrendadoras();
                break;
            case 'vehiculos':
                await this.loadVehiculos();
                break;
            case 'marcas':
                await this.loadMarcas();
                break;
            case 'modelos':
                await this.loadModelos();
                break;
            case 'estados':
                await this.loadEstados();
                break;
        }
    }

    async refreshCurrentSection() {
        await this.loadSectionData(this.currentSection);
    }

    // ===== DASHBOARD =====
    async loadDashboard() {
        this.setLoading('dashboard', true);
        try {
            const stats = await api.getEstadisticas();

            // Actualizar contadores con animación
            this.animateCounter('total-arrendadoras', stats.totalArrendadoras);
            this.animateCounter('total-vehiculos', stats.totalVehiculos);
            this.animateCounter('total-marcas', stats.totalMarcas);
            this.animateCounter('total-modelos', stats.totalModelos);

            await this.loadActividadReciente();
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showToast('Error al cargar el dashboard', 'error');
        } finally {
            this.setLoading('dashboard', false);
        }
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = parseInt(element.textContent) || 0;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    async loadActividadReciente() {
        try {
            const vehiculos = await api.getVehiculos({ limit: 5 });
            const container = document.getElementById('actividad-reciente');

            if (!container) return;

            if (vehiculos.length === 0) {
                container.innerHTML = `
                    <div class="activity-loading">
                        <p class="text-gray-500">No hay actividad reciente</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = vehiculos.slice(0, 5).map(vehiculo => `
                <div class="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-all cursor-pointer"
                     onclick="app.showSection('vehiculos')">
                    <div class="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">${vehiculo.placa}</p>
                        <p class="text-xs text-gray-500 truncate">
                            ${vehiculo.marcas?.nombre || 'Sin marca'} ${vehiculo.modelos?.nombre || 'Sin modelo'}
                        </p>
                    </div>
                    <span class="text-xs text-gray-400 flex-shrink-0">
                        ${api.formatDate(vehiculo.created_at)}
                    </span>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading recent activity:', error);
        }
    }

    // ===== ARRENDADORAS =====
    async loadArrendadoras() {
        this.setLoading('arrendadoras', true);
        try {
            const arrendadoras = await api.getArrendadoras();
            this.renderArrendadorasTable(arrendadoras);
        } catch (error) {
            console.error('Error loading arrendadoras:', error);
            this.showToast('Error al cargar arrendadoras', 'error');
        } finally {
            this.setLoading('arrendadoras', false);
        }
    }

    renderArrendadorasTable(arrendadoras) {
        const tbody = document.getElementById('arrendadoras-table');
        if (!tbody) return;

        if (arrendadoras.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="table-loading">
                        <div class="text-center py-8">
                            <i class="fas fa-building text-4xl text-gray-300 mb-4"></i>
                            <p class="text-gray-500">No hay empresas registradas</p>
                            <button onclick="app.openModal('arrendadora')" class="mt-4 text-blue-600 hover:text-blue-800">
                                Crear primera empresa
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = arrendadoras.map(arrendadora => `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="font-mono text-sm text-gray-500">#${arrendadora.id}</td>
                <td class="font-medium">${this.escapeHtml(arrendadora.nombre)}</td>
                <td class="font-mono text-sm">${arrendadora.identificacion_juridica || '-'}</td>
                <td>
                    <div class="flex space-x-2">
                        <button onclick="app.editArrendadora(${arrendadora.id})" 
                                class="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                                title="Editar arrendadora">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="app.deleteArrendadora(${arrendadora.id})" 
                                class="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                title="Eliminar arrendadora">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async filterArrendadoras() {
        const searchTerm = document.getElementById('search-arrendadoras')?.value?.toLowerCase() || '';

        try {
            const arrendadoras = await api.getArrendadoras();
            const filtered = arrendadoras.filter(a =>
                a.nombre.toLowerCase().includes(searchTerm) ||
                (a.identificacion_juridica && a.identificacion_juridica.toLowerCase().includes(searchTerm))
            );
            this.renderArrendadorasTable(filtered);
        } catch (error) {
            console.error('Error filtering arrendadoras:', error);
        }
    }

    // ===== VEHÍCULOS =====
    async loadVehiculos() {
        this.setLoading('vehiculos', true);
        try {
            const filters = this.getVehiculosFilters();
            const [vehiculos] = await Promise.all([
                api.getVehiculos(filters),
                this.loadVehiculosFilters()
            ]);
            this.renderVehiculosGrid(vehiculos);
        } catch (error) {
            console.error('Error loading vehiculos:', error);
            this.showToast('Error al cargar vehículos', 'error');
        } finally {
            this.setLoading('vehiculos', false);
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
                const currentValue = arrendadoraSelect.value;
                arrendadoraSelect.innerHTML = '<option value="">Todas las empresas</option>' +
                    arrendadoras.map(a => `<option value="${a.id}" ${currentValue == a.id ? 'selected' : ''}>${this.escapeHtml(a.nombre)}</option>`).join('');
            }

            // Llenar filtro de estados
            const estadoSelect = document.getElementById('filter-estado');
            if (estadoSelect) {
                const currentValue = estadoSelect.value;
                estadoSelect.innerHTML = '<option value="">Todos los estados</option>' +
                    estados.map(e => `<option value="${e.id}" ${currentValue == e.id ? 'selected' : ''}>${this.escapeHtml(e.nombre)}</option>`).join('');
            }
        } catch (error) {
            console.error('Error loading filters:', error);
        }
    }

    renderVehiculosGrid(vehiculos) {
        const grid = document.getElementById('vehiculos-grid');
        if (!grid) return;

        if (vehiculos.length === 0) {
            grid.innerHTML = `
                <div class="vehicle-card-empty">
                    <i class="fas fa-car vehicle-card-empty-icon"></i>
                    <div class="vehicle-card-empty-text">No hay vehículos registrados</div>
                    <div class="vehicle-card-empty-subtext">Crea tu primer vehículo para comenzar</div>
                    <button onclick="app.openModal('vehiculo')" class="mt-4 btn-primary-apple">
                        <i class="fas fa-plus"></i>
                        <span>Crear Vehículo</span>
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = vehiculos.map(vehiculo => this.renderVehiculoCard(vehiculo)).join('');
    }

    renderVehiculoCard(vehiculo) {
        const estadoClass = api.getStatusBadgeClass(vehiculo.estado_inventario_id);

        return `
            <div class="vehicle-card" data-vehicle-id="${vehiculo.id}">
                <!-- Header de la tarjeta -->
                <div class="vehicle-card-header">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <div class="vehicle-card-placa">${this.escapeHtml(vehiculo.placa)}</div>
                            <div class="vehicle-card-modelo">
                                ${this.escapeHtml(vehiculo.marcas?.nombre || 'Sin marca')} 
                                ${this.escapeHtml(vehiculo.modelos?.nombre || 'Sin modelo')}
                            </div>
                            ${vehiculo.vin ? `<div class="vehicle-card-vin">VIN: ${this.escapeHtml(vehiculo.vin)}</div>` : ''}
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
                            <span class="vehicle-card-value">${this.escapeHtml(vehiculo.arrendadoras?.nombre || 'Sin asignar')}</span>
                        </div>
                        
                        <div class="vehicle-card-info">
                            <span class="vehicle-card-label">Estado</span>
                            <span class="vehicle-card-status ${estadoClass}">
                                ${this.escapeHtml(vehiculo.estados_inventario?.nombre || 'Sin estado')}
                            </span>
                        </div>
                        
                        ${vehiculo.precio_semanal ? `
                        <div class="vehicle-card-info">
                            <span class="vehicle-card-label">Precio Semanal</span>
                            <span class="vehicle-card-price">${api.formatCurrency(vehiculo.precio_semanal)}</span>
                        </div>
                        ` : ''}
                        
                        ${vehiculo.gastos_adms ? `
                        <div class="vehicle-card-info">
                            <span class="vehicle-card-label">Gastos Admin</span>
                            <span class="vehicle-card-gastos">${api.formatCurrency(vehiculo.gastos_adms)}</span>
                        </div>
                        ` : ''}

                        ${vehiculo.link_fotos ? `
                        <div class="vehicle-card-info">
                            <span class="vehicle-card-label">Fotos</span>
                            <a href="${this.escapeHtml(vehiculo.link_fotos)}" target="_blank" class="vehicle-card-fotos-link">
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
                        <button onclick="app.editVehiculo(${vehiculo.id})" 
                                class="vehicle-card-btn vehicle-card-btn-edit" 
                                title="Editar vehículo">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="app.deleteVehiculo(${vehiculo.id})" 
                                class="vehicle-card-btn vehicle-card-btn-delete" 
                                title="Eliminar vehículo">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async filterVehiculos() {
        await this.loadVehiculos();
    }

    // ===== MARCAS =====
    async loadMarcas() {
        this.setLoading('marcas', true);
        try {
            const marcas = await api.getMarcas();
            this.renderMarcasTable(marcas);
        } catch (error) {
            console.error('Error loading marcas:', error);
            this.showToast('Error al cargar marcas', 'error');
        } finally {
            this.setLoading('marcas', false);
        }
    }

    renderMarcasTable(marcas) {
        const tbody = document.getElementById('marcas-table');
        if (!tbody) return;

        if (marcas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="table-loading">
                        <div class="text-center py-8">
                            <i class="fas fa-tag text-4xl text-gray-300 mb-4"></i>
                            <p class="text-gray-500">No hay marcas registradas</p>
                            <button onclick="app.openModal('marca')" class="mt-4 text-blue-600 hover:text-blue-800">
                                Crear primera marca
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = marcas.map(marca => `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="font-mono text-sm text-gray-500">#${marca.id}</td>
                <td class="font-medium">${this.escapeHtml(marca.nombre)}</td>
                <td class="text-gray-500">-</td>
                <td>
                    <div class="flex space-x-2">
                        <button onclick="app.editMarca(${marca.id})" 
                                class="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                                title="Editar marca">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="app.deleteMarca(${marca.id})" 
                                class="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                title="Eliminar marca">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async filterMarcas() {
        const searchTerm = document.getElementById('search-marcas')?.value?.toLowerCase() || '';

        try {
            const marcas = await api.getMarcas();
            const filtered = marcas.filter(m => m.nombre.toLowerCase().includes(searchTerm));
            this.renderMarcasTable(filtered);
        } catch (error) {
            console.error('Error filtering marcas:', error);
        }
    }

    // ===== MODELOS =====
    async loadModelos() {
        this.setLoading('modelos', true);
        try {
            const filters = this.getModelosFilters();
            const [modelos] = await Promise.all([
                api.getModelos(filters),
                this.loadModelosFilters()
            ]);
            this.renderModelosTable(modelos);
        } catch (error) {
            console.error('Error loading modelos:', error);
            this.showToast('Error al cargar modelos', 'error');
        } finally {
            this.setLoading('modelos', false);
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
                const currentValue = marcaSelect.value;
                marcaSelect.innerHTML = '<option value="">Todas las marcas</option>' +
                    marcas.map(m => `<option value="${m.id}" ${currentValue == m.id ? 'selected' : ''}>${this.escapeHtml(m.nombre)}</option>`).join('');
            }
        } catch (error) {
            console.error('Error loading marca filters:', error);
        }
    }

    renderModelosTable(modelos) {
        const tbody = document.getElementById('modelos-table');
        if (!tbody) return;

        if (modelos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="table-loading">
                        <div class="text-center py-8">
                            <i class="fas fa-cogs text-4xl text-gray-300 mb-4"></i>
                            <p class="text-gray-500">No hay modelos registrados</p>
                            <button onclick="app.openModal('modelo')" class="mt-4 text-blue-600 hover:text-blue-800">
                                Crear primer modelo
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = modelos.map(modelo => `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="font-mono text-sm text-gray-500">#${modelo.id}</td>
                <td class="font-medium">${this.escapeHtml(modelo.nombre)}</td>
                <td>${this.escapeHtml(modelo.marcas?.nombre || 'Sin marca')}</td>
                <td class="text-gray-500">-</td>
                <td>
                    <div class="flex space-x-2">
                        <button onclick="app.editModelo(${modelo.id})" 
                                class="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                                title="Editar modelo">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="app.deleteModelo(${modelo.id})" 
                                class="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                title="Eliminar modelo">
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
        this.setLoading('estados', true);
        try {
            const estados = await api.getEstadosInventario();
            this.renderEstadosTable(estados);
        } catch (error) {
            console.error('Error loading estados:', error);
            this.showToast('Error al cargar estados', 'error');
        } finally {
            this.setLoading('estados', false);
        }
    }

    renderEstadosTable(estados) {
        const tbody = document.getElementById('estados-table');
        if (!tbody) return;

        if (estados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="table-loading">
                        <div class="text-center py-8">
                            <i class="fas fa-list-check text-4xl text-gray-300 mb-4"></i>
                            <p class="text-gray-500">No hay estados registrados</p>
                            <button onclick="app.openModal('estado')" class="mt-4 text-blue-600 hover:text-blue-800">
                                Crear primer estado
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = estados.map(estado => `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="font-mono text-sm text-gray-500">#${estado.id}</td>
                <td class="font-medium">${this.escapeHtml(estado.nombre)}</td>
                <td class="text-gray-500">-</td>
                <td>
                    <div class="flex space-x-2">
                        <button onclick="app.editEstado(${estado.id})" 
                                class="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                                title="Editar estado">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="app.deleteEstado(${estado.id})" 
                                class="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                title="Eliminar estado">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async filterEstados() {
        const searchTerm = document.getElementById('search-estados')?.value?.toLowerCase() || '';

        try {
            const estados = await api.getEstadosInventario();
            const filtered = estados.filter(e => e.nombre.toLowerCase().includes(searchTerm));
            this.renderEstadosTable(filtered);
        } catch (error) {
            console.error('Error filtering estados:', error);
        }
    }

    // ===== MODALES =====
    async openModal(type, item = null) {
        try {
            this.currentModal = type;
            this.editingItem = item;

            const content = await this.modalManager.getModalContent(type, item);
            const modalContent = document.getElementById('modal-content');
            const modalOverlay = document.getElementById('modal-overlay');

            if (modalContent && modalOverlay) {
                modalContent.innerHTML = content;
                modalOverlay.classList.remove('hidden');

                // Cargar datos específicos del modal después de renderizar
                await this.modalManager.loadModalData(type, item);

                // Enfocar el primer input
                setTimeout(() => {
                    const firstInput = modalContent.querySelector('input, select, textarea');
                    if (firstInput) firstInput.focus();
                }, 100);
            }
        } catch (error) {
            console.error('Error opening modal:', error);
            this.showToast('Error al abrir el modal', 'error');
        }
    }

    closeModal() {
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) {
            modalOverlay.classList.add('hidden');
        }
        this.currentModal = null;
        this.editingItem = null;
    }

    // ===== FUNCIONES CRUD =====
    async editArrendadora(id) {
        try {
            const arrendadora = await api.getArrendadora(id);
            if (arrendadora) {
                await this.openModal('arrendadora', arrendadora);
            }
        } catch (error) {
            console.error('Error loading arrendadora:', error);
            this.showToast('Error al cargar la arrendadora', 'error');
        }
    }

    async deleteArrendadora(id) {
        if (!await this.confirmDelete('esta arrendadora')) return;

        try {
            await api.deleteArrendadora(id);
            this.showToast('Arrendadora eliminada correctamente', 'success');
            await this.loadArrendadoras();
        } catch (error) {
            console.error('Error deleting arrendadora:', error);
            this.showToast('Error al eliminar la arrendadora', 'error');
        }
    }

    async editVehiculo(id) {
        try {
            const vehiculo = await api.getVehiculo(id);
            if (vehiculo) {
                await this.openModal('vehiculo', vehiculo);
            }
        } catch (error) {
            console.error('Error loading vehiculo:', error);
            this.showToast('Error al cargar el vehículo', 'error');
        }
    }

    async deleteVehiculo(id) {
        if (!await this.confirmDelete('este vehículo')) return;

        try {
            await api.deleteVehiculo(id);
            this.showToast('Vehículo eliminado correctamente', 'success');
            await this.loadVehiculos();
        } catch (error) {
            console.error('Error deleting vehiculo:', error);
            this.showToast('Error al eliminar el vehículo', 'error');
        }
    }

    async editMarca(id) {
        try {
            const marca = await api.getMarca(id);
            if (marca) {
                await this.openModal('marca', marca);
            }
        } catch (error) {
            console.error('Error loading marca:', error);
            this.showToast('Error al cargar la marca', 'error');
        }
    }

    async deleteMarca(id) {
        if (!await this.confirmDelete('esta marca')) return;

        try {
            await api.deleteMarca(id);
            this.showToast('Marca eliminada correctamente', 'success');
            await this.loadMarcas();
        } catch (error) {
            console.error('Error deleting marca:', error);
            this.showToast('Error al eliminar la marca', 'error');
        }
    }

    async editModelo(id) {
        try {
            const modelo = await api.getModelo(id);
            if (modelo) {
                await this.openModal('modelo', modelo);
            }
        } catch (error) {
            console.error('Error loading modelo:', error);
            this.showToast('Error al cargar el modelo', 'error');
        }
    }

    async deleteModelo(id) {
        if (!await this.confirmDelete('este modelo')) return;

        try {
            await api.deleteModelo(id);
            this.showToast('Modelo eliminado correctamente', 'success');
            await this.loadModelos();
        } catch (error) {
            console.error('Error deleting modelo:', error);
            this.showToast('Error al eliminar el modelo', 'error');
        }
    }

    async editEstado(id) {
        try {
            const estado = await api.getEstadoInventario(id);
            if (estado) {
                await this.openModal('estado', estado);
            }
        } catch (error) {
            console.error('Error loading estado:', error);
            this.showToast('Error al cargar el estado', 'error');
        }
    }

    async deleteEstado(id) {
        if (!await this.confirmDelete('este estado')) return;

        try {
            await api.deleteEstadoInventario(id);
            this.showToast('Estado eliminado correctamente', 'success');
            await this.loadEstados();
        } catch (error) {
            console.error('Error deleting estado:', error);
            this.showToast('Error al eliminar el estado', 'error');
        }
    }

    async confirmDelete(itemType) {
        return new Promise((resolve) => {
            const confirmed = confirm(`¿Estás seguro de que quieres eliminar ${itemType}?`);
            resolve(confirmed);
        });
    }

    // ===== UTILIDADES =====
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <i class="fas fa-${this.getToastIcon(type)}"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">${this.escapeHtml(message)}</p>
                </div>
                <div class="ml-auto pl-3">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove after configured duration
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, APP_CONFIG.toastDuration);
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