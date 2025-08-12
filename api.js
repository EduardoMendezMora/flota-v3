// API Service mejorado para Supabase - SISTEMA COMPLETO
class ApiService {
    constructor() {
        this.baseUrl = SUPABASE_CONFIG.url + '/rest/v1';
        this.headers = SUPABASE_CONFIG.headers;
        this.cache = new Map();
        this.isOnline = navigator.onLine;
        this.setupNetworkListeners();
    }

    setupNetworkListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.clearCache();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    // Método genérico mejorado para hacer peticiones
    async request(endpoint, options = {}) {
        if (!this.isOnline && !this.isCached(endpoint)) {
            throw new Error('Sin conexión a internet');
        }

        const url = `${this.baseUrl}${endpoint}`;
        const cacheKey = `${options.method || 'GET'}_${url}_${JSON.stringify(options.body || {})}`;

        // Verificar cache para GET requests
        if ((!options.method || options.method === 'GET') && this.isCached(cacheKey)) {
            return this.getFromCache(cacheKey);
        }

        const config = {
            headers: this.headers,
            ...options
        };

        try {
            const response = await this.fetchWithRetry(url, config);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Para operaciones DELETE, retornar éxito sin parsear JSON
            if (options.method === 'DELETE') {
                return { success: true };
            }

            // Para otras operaciones, intentar parsear JSON
            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = { success: true };
            }

            // Cachear GET requests exitosos
            if ((!options.method || options.method === 'GET') && data) {
                this.setCache(cacheKey, data);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw this.handleError(error);
        }
    }

    async fetchWithRetry(url, config, retries = PERFORMANCE_CONFIG.maxRetries) {
        for (let i = 0; i < retries; i++) {
            try {
                return await fetch(url, config);
            } catch (error) {
                if (i === retries - 1) throw error;
                await this.delay(PERFORMANCE_CONFIG.retryDelay * (i + 1));
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    handleError(error) {
        if (error.message.includes('Failed to fetch')) {
            return new Error(MESSAGES.error.network);
        }
        return error;
    }

    // Sistema de cache mejorado
    isCached(key) {
        if (!PERFORMANCE_CONFIG.enableCache) return false;
        const cached = this.cache.get(key);
        if (!cached) return false;

        const isExpired = Date.now() - cached.timestamp > PERFORMANCE_CONFIG.cacheTimeout;
        if (isExpired) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }

    getFromCache(key) {
        return this.cache.get(key).data;
    }

    setCache(key, data) {
        if (PERFORMANCE_CONFIG.enableCache) {
            this.cache.set(key, {
                data,
                timestamp: Date.now()
            });
        }
    }

    clearCache() {
        this.cache.clear();
    }

    invalidateCache(pattern) {
        const keysToDelete = Array.from(this.cache.keys()).filter(key =>
            key.includes(pattern)
        );
        keysToDelete.forEach(key => this.cache.delete(key));
    }

    // ===== COLABORADORES =====
    async getColaboradores() {
        return this.request('/colaboradores?select=*&order=nombre.asc');
    }

    async getColaborador(id) {
        const result = await this.request(`/colaboradores?id=eq.${id}&select=*`);
        return result?.[0] || null;
    }

    async createColaborador(data) {
        const result = await this.request('/colaboradores', {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(this.sanitizeData(data))
        });
        this.invalidateCache('colaboradores');
        return result;
    }

    async updateColaborador(id, data) {
        const result = await this.request(`/colaboradores?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(this.sanitizeData(data))
        });
        this.invalidateCache('colaboradores');
        return result;
    }

    async deleteColaborador(id) {
        const result = await this.request(`/colaboradores?id=eq.${id}`, {
            method: 'DELETE'
        });
        this.invalidateCache('colaboradores');
        return result;
    }

    // ===== TAREAS =====
    async getTareas(filters = {}) {
        let query = '/tareas?select=*,vehiculos(placa,marcas(nombre),modelos(nombre)),colaboradores!tareas_responsable_id_fkey(nombre)&order=id.desc';

        // Aplicar filtros
        const params = [];
        if (filters.vehiculo_id) {
            params.push(`vehiculo_id=eq.${filters.vehiculo_id}`);
        }
        if (filters.responsable_id) {
            params.push(`responsable_id=eq.${filters.responsable_id}`);
        }
        if (filters.estado) {
            params.push(`estado=eq.${filters.estado}`);
        }
        if (filters.prioridad) {
            params.push(`prioridad=eq.${filters.prioridad}`);
        }
        if (filters.search) {
            params.push(`or=(titulo.ilike.*${filters.search}*,descripcion.ilike.*${filters.search}*)`);
        }
        if (filters.limit) {
            params.push(`limit=${filters.limit}`);
        }

        if (params.length > 0) {
            query += '&' + params.join('&');
        }

        return this.request(query);
    }

    async getTarea(id) {
        const result = await this.request(`/tareas?id=eq.${id}&select=*,vehiculos(placa,marcas(nombre),modelos(nombre)),colaboradores!tareas_responsable_id_fkey(nombre)`);
        return result?.[0] || null;
    }

    async createTarea(data) {
        const result = await this.request('/tareas', {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(this.sanitizeTareaData(data))
        });
        this.invalidateCache('tareas');
        return result;
    }

    async updateTarea(id, data) {
        const result = await this.request(`/tareas?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(this.sanitizeTareaData(data))
        });
        this.invalidateCache('tareas');
        return result;
    }

    async deleteTarea(id) {
        const result = await this.request(`/tareas?id=eq.${id}`, {
            method: 'DELETE'
        });
        this.invalidateCache('tareas');
        return result;
    }

    // ===== TAREA COLABORADORES =====
    async getTareaColaboradores(tareaId) {
        return this.request(`/tarea_colaboradores?tarea_id=eq.${tareaId}&select=*,colaboradores(nombre)`);
    }

    async addColaboradorToTarea(tareaId, colaboradorId, rol = 'ejecutor') {
        const result = await this.request('/tarea_colaboradores', {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                tarea_id: tareaId,
                colaborador_id: colaboradorId,
                rol: rol
            })
        });
        this.invalidateCache('tarea_colaboradores');
        return result;
    }

    async removeColaboradorFromTarea(tareaId, colaboradorId) {
        const result = await this.request(`/tarea_colaboradores?tarea_id=eq.${tareaId}&colaborador_id=eq.${colaboradorId}`, {
            method: 'DELETE'
        });
        this.invalidateCache('tarea_colaboradores');
        return result;
    }

    async updateColaboradorRol(tareaId, colaboradorId, rol) {
        const result = await this.request(`/tarea_colaboradores?tarea_id=eq.${tareaId}&colaborador_id=eq.${colaboradorId}`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ rol: rol })
        });
        this.invalidateCache('tarea_colaboradores');
        return result;
    }

    // ===== TAREA COMENTARIOS =====
    async getTareaComentarios(tareaId) {
        return this.request(`/tarea_comentarios?tarea_id=eq.${tareaId}&select=*,colaboradores(nombre)&order=created_at.desc`);
    }

    async createTareaComentario(tareaId, colaboradorId, comentario) {
        const result = await this.request('/tarea_comentarios', {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                tarea_id: tareaId,
                colaborador_id: colaboradorId,
                comentario: comentario
            })
        });
        this.invalidateCache('tarea_comentarios');
        return result;
    }

    async deleteTareaComentario(id) {
        const result = await this.request(`/tarea_comentarios?id=eq.${id}`, {
            method: 'DELETE'
        });
        this.invalidateCache('tarea_comentarios');
        return result;
    }

    // ===== TAREA ADJUNTOS =====
    async getTareaAdjuntos(tareaId) {
        return this.request(`/tarea_adjuntos?tarea_id=eq.${tareaId}&select=*,colaboradores!tarea_adjuntos_subido_por_id_fkey(nombre)&order=created_at.desc`);
    }

    async createTareaAdjunto(data) {
        const result = await this.request('/tarea_adjuntos', {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(this.sanitizeData(data))
        });
        this.invalidateCache('tarea_adjuntos');
        return result;
    }

    async deleteTareaAdjunto(id) {
        const result = await this.request(`/tarea_adjuntos?id=eq.${id}`, {
            method: 'DELETE'
        });
        this.invalidateCache('tarea_adjuntos');
        return result;
    }

    // ===== ARRENDADORAS =====
    async getArrendadoras() {
        return this.request('/arrendadoras?select=*&order=nombre.asc');
    }

    async getArrendadora(id) {
        const result = await this.request(`/arrendadoras?id=eq.${id}&select=*`);
        return result?.[0] || null;
    }

    async createArrendadora(data) {
        const result = await this.request('/arrendadoras', {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(this.sanitizeData(data))
        });
        this.invalidateCache('arrendadoras');
        return result;
    }

    async updateArrendadora(id, data) {
        const result = await this.request(`/arrendadoras?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(this.sanitizeData(data))
        });
        this.invalidateCache('arrendadoras');
        return result;
    }

    async deleteArrendadora(id) {
        const result = await this.request(`/arrendadoras?id=eq.${id}`, {
            method: 'DELETE'
        });
        this.invalidateCache('arrendadoras');
        return result;
    }

    // ===== VEHÍCULOS =====
    async getVehiculos(filters = {}) {
        let query = '/vehiculos?select=*,arrendadoras(nombre),marcas(nombre),modelos(nombre),estados_inventario(nombre)&order=id.desc';

        // Aplicar filtros
        const params = [];
        if (filters.arrendadora_id) {
            params.push(`arrendadora_id=eq.${filters.arrendadora_id}`);
        }
        if (filters.estado_inventario_id) {
            params.push(`estado_inventario_id=eq.${filters.estado_inventario_id}`);
        }
        if (filters.search) {
            params.push(`or=(placa.ilike.*${filters.search}*,vin.ilike.*${filters.search}*)`);
        }
        if (filters.limit) {
            params.push(`limit=${filters.limit}`);
        }

        if (params.length > 0) {
            query += '&' + params.join('&');
        }

        return this.request(query);
    }

    async getVehiculo(id) {
        const result = await this.request(`/vehiculos?id=eq.${id}&select=*,arrendadoras(nombre),marcas(nombre),modelos(nombre),estados_inventario(nombre)`);
        return result?.[0] || null;
    }

    async createVehiculo(data) {
        const result = await this.request('/vehiculos', {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(this.sanitizeVehiculoData(data))
        });
        this.invalidateCache('vehiculos');
        return result;
    }

    async updateVehiculo(id, data) {
        const result = await this.request(`/vehiculos?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(this.sanitizeVehiculoData(data))
        });
        this.invalidateCache('vehiculos');
        return result;
    }

    async deleteVehiculo(id) {
        const result = await this.request(`/vehiculos?id=eq.${id}`, {
            method: 'DELETE'
        });
        this.invalidateCache('vehiculos');
        return result;
    }

    // ===== MARCAS =====
    async getMarcas() {
        return this.request('/marcas?select=*&order=nombre.asc');
    }

    async getMarca(id) {
        const result = await this.request(`/marcas?id=eq.${id}&select=*`);
        return result?.[0] || null;
    }

    async createMarca(data) {
        const result = await this.request('/marcas', {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(this.sanitizeData(data))
        });
        this.invalidateCache('marcas');
        return result;
    }

    async updateMarca(id, data) {
        const result = await this.request(`/marcas?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(this.sanitizeData(data))
        });
        this.invalidateCache('marcas');
        return result;
    }

    async deleteMarca(id) {
        const result = await this.request(`/marcas?id=eq.${id}`, {
            method: 'DELETE'
        });
        this.invalidateCache('marcas');
        return result;
    }

    // ===== MODELOS =====
    async getModelos(filters = {}) {
        let query = '/modelos?select=*,marcas(nombre)&order=nombre.asc';

        const params = [];
        if (filters.marca_id) {
            params.push(`marca_id=eq.${filters.marca_id}`);
        }
        if (filters.search) {
            params.push(`nombre.ilike.*${filters.search}*`);
        }

        if (params.length > 0) {
            query += '&' + params.join('&');
        }

        return this.request(query);
    }

    async getModelo(id) {
        const result = await this.request(`/modelos?id=eq.${id}&select=*,marcas(nombre)`);
        return result?.[0] || null;
    }

    async createModelo(data) {
        const result = await this.request('/modelos', {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(this.sanitizeData(data))
        });
        this.invalidateCache('modelos');
        return result;
    }

    async updateModelo(id, data) {
        const result = await this.request(`/modelos?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(this.sanitizeData(data))
        });
        this.invalidateCache('modelos');
        return result;
    }

    async deleteModelo(id) {
        const result = await this.request(`/modelos?id=eq.${id}`, {
            method: 'DELETE'
        });
        this.invalidateCache('modelos');
        return result;
    }

    // ===== ESTADOS DE INVENTARIO =====
    async getEstadosInventario() {
        return this.request('/estados_inventario?select=*&order=nombre.asc');
    }

    async getEstadoInventario(id) {
        const result = await this.request(`/estados_inventario?id=eq.${id}&select=*`);
        return result?.[0] || null;
    }

    async createEstadoInventario(data) {
        const result = await this.request('/estados_inventario', {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(this.sanitizeData(data))
        });
        this.invalidateCache('estados_inventario');
        return result;
    }

    async updateEstadoInventario(id, data) {
        const result = await this.request(`/estados_inventario?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(this.sanitizeData(data))
        });
        this.invalidateCache('estados_inventario');
        return result;
    }

    async deleteEstadoInventario(id) {
        const result = await this.request(`/estados_inventario?id=eq.${id}`, {
            method: 'DELETE'
        });
        this.invalidateCache('estados_inventario');
        return result;
    }

    // ===== ESTADÍSTICAS MEJORADAS =====
    async getEstadisticas() {
        try {
            const [arrendadoras, vehiculos, marcas, modelos, estados, colaboradores, tareas] = await Promise.all([
                this.getArrendadoras(),
                this.getVehiculos({ limit: 1000 }),
                this.getMarcas(),
                this.getModelos(),
                this.getEstadosInventario(),
                this.getColaboradores(),
                this.getTareas({ limit: 1000 })
            ]);

            // Calcular estadísticas adicionales
            const vehiculosPorEstado = this.groupByProperty(vehiculos, 'estado_inventario_id');
            const vehiculosPorArrendadora = this.groupByProperty(vehiculos, 'arrendadora_id');
            const vehiculosPorMarca = this.groupByProperty(vehiculos, 'marca_id');
            const tareasPorEstado = this.groupByProperty(tareas, 'estado');
            const tareasPorPrioridad = this.groupByProperty(tareas, 'prioridad');

            return {
                totalArrendadoras: arrendadoras.length,
                totalVehiculos: vehiculos.length,
                totalMarcas: marcas.length,
                totalModelos: modelos.length,
                totalEstados: estados.length,
                totalColaboradores: colaboradores.length,
                totalTareas: tareas.length,
                distribuciones: {
                    porEstado: vehiculosPorEstado,
                    porArrendadora: vehiculosPorArrendadora,
                    porMarca: vehiculosPorMarca
                },
                tareas: {
                    porEstado: tareasPorEstado,
                    porPrioridad: tareasPorPrioridad,
                    pendientes: tareas.filter(t => t.estado === 'pendiente').length,
                    enProgreso: tareas.filter(t => t.estado === 'en_progreso').length,
                    completadas: tareas.filter(t => t.estado === 'completada').length
                }
            };
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return {
                totalArrendadoras: 0,
                totalVehiculos: 0,
                totalMarcas: 0,
                totalModelos: 0,
                totalEstados: 0,
                totalColaboradores: 0,
                totalTareas: 0,
                distribuciones: {
                    porEstado: {},
                    porArrendadora: {},
                    porMarca: {}
                },
                tareas: {
                    porEstado: {},
                    porPrioridad: {},
                    pendientes: 0,
                    enProgreso: 0,
                    completadas: 0
                }
            };
        }
    }

    // ===== UTILIDADES DE DATOS =====
    sanitizeData(data) {
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            if (value !== null && value !== undefined && value !== '') {
                if (typeof value === 'string') {
                    sanitized[key] = value.trim();
                } else {
                    sanitized[key] = value;
                }
            } else {
                sanitized[key] = null;
            }
        }
        return sanitized;
    }

    sanitizeVehiculoData(data) {
        const sanitized = this.sanitizeData(data);

        // Validaciones específicas para vehículos
        if (sanitized.precio_semanal) {
            sanitized.precio_semanal = parseFloat(sanitized.precio_semanal);
        }
        if (sanitized.gastos_adms) {
            sanitized.gastos_adms = parseFloat(sanitized.gastos_adms);
        }
        if (sanitized.anio) {
            sanitized.anio = parseInt(sanitized.anio);
        }

        return sanitized;
    }

    sanitizeTareaData(data) {
        const sanitized = this.sanitizeData(data);

        // Validaciones específicas para tareas
        if (sanitized.vehiculo_id) {
            sanitized.vehiculo_id = parseInt(sanitized.vehiculo_id);
        }
        if (sanitized.responsable_id) {
            sanitized.responsable_id = parseInt(sanitized.responsable_id);
        }

        return sanitized;
    }

    groupByProperty(array, property) {
        return array.reduce((groups, item) => {
            const key = item[property];
            if (!groups[key]) {
                groups[key] = 0;
            }
            groups[key]++;
            return groups;
        }, {});
    }

    // ===== UTILIDADES DE FORMATO =====
    formatCurrency(amount) {
        if (!amount) return '₡0';
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatDate(dateString) {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-CR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return '-';
        }
    }

    formatDateTime(dateString) {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('es-CR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return '-';
        }
    }

    getStatusBadgeClass(estadoId) {
        const estado = ESTADOS_VEHICULO.find(s => s.id === estadoId);
        return estado ? estado.class : 'status-available';
    }

    getStatusText(estadoId) {
        const estado = ESTADOS_VEHICULO.find(s => s.id === estadoId);
        return estado ? estado.nombre : 'Desconocido';
    }

    getTareaStatusBadgeClass(estado) {
        const clases = {
            'pendiente': 'status-pending',
            'en_progreso': 'status-in-progress',
            'completada': 'status-completed',
            'cancelada': 'status-cancelled'
        };
        return clases[estado] || 'status-pending';
    }

    getTareaPrioridadBadgeClass(prioridad) {
        const clases = {
            'baja': 'priority-low',
            'media': 'priority-medium',
            'alta': 'priority-high',
            'urgente': 'priority-urgent'
        };
        return clases[prioridad] || 'priority-medium';
    }

    // ===== VALIDACIONES =====
    validatePlaca(placa) {
        if (!placa) return false;
        const cleanPlaca = placa.trim().toUpperCase();

        // Verificar contra todos los patrones válidos
        return FORM_CONSTANTS.validation.placaPatterns.some(pattern =>
            pattern.test(cleanPlaca)
        );
    }

    validateVin(vin) {
        if (!vin) return true; // VIN es opcional
        return FORM_CONSTANTS.validation.vinPattern.test(vin);
    }

    validateUrl(url) {
        if (!url) return true; // URL es opcional
        return FORM_CONSTANTS.validation.urlPattern.test(url);
    }

    validateYear(year) {
        const currentYear = new Date().getFullYear();
        return year >= FORM_CONSTANTS.minYear && year <= currentYear + 2;
    }
}

// Instancia global del servicio API
const api = new ApiService();