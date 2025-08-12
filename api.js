// API Service para Supabase
class ApiService {
    constructor() {
        this.baseUrl = SUPABASE_CONFIG.url + '/rest/v1';
        this.headers = SUPABASE_CONFIG.headers;
    }

    // Método genérico para hacer peticiones
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: this.headers,
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Para operaciones DELETE, no intentar parsear JSON
            if (options.method === 'DELETE') {
                return { success: true };
            }
            
            // Para otras operaciones, intentar parsear JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return { success: true };
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ===== ARRENDADORAS =====
    async getArrendadoras() {
        return this.request('/arrendadoras?select=*&order=id.asc');
    }

    async getArrendadora(id) {
        return this.request(`/arrendadoras?id=eq.${id}&select=*`);
    }

    async createArrendadora(data) {
        return this.request('/arrendadoras', {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });
    }

    async updateArrendadora(id, data) {
        return this.request(`/arrendadoras?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });
    }

    async deleteArrendadora(id) {
        return this.request(`/arrendadoras?id=eq.${id}`, {
            method: 'DELETE'
        });
    }

    // ===== VEHÍCULOS =====
    async getVehiculos(filters = {}) {
        let query = '/vehiculos?select=*,arrendadoras(nombre),marcas(nombre),modelos(nombre),estados_inventario(nombre)&order=id.desc';
        
        if (filters.arrendadora_id) {
            query += `&arrendadora_id=eq.${filters.arrendadora_id}`;
        }
        if (filters.estado_inventario_id) {
            query += `&estado_inventario_id=eq.${filters.estado_inventario_id}`;
        }
        if (filters.search) {
            query += `&or=(placa.ilike.*${filters.search}*,vin.ilike.*${filters.search}*)`;
        }
        
        return this.request(query);
    }

    async getVehiculo(id) {
        return this.request(`/vehiculos?id=eq.${id}&select=*,arrendadoras(nombre),marcas(nombre),modelos(nombre),estados_inventario(nombre)`);
    }

    async createVehiculo(data) {
        return this.request('/vehiculos', {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });
    }

    async updateVehiculo(id, data) {
        return this.request(`/vehiculos?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });
    }

    async deleteVehiculo(id) {
        return this.request(`/vehiculos?id=eq.${id}`, {
            method: 'DELETE'
        });
    }

    // ===== MARCAS =====
    async getMarcas() {
        return this.request('/marcas?select=*&order=nombre.asc');
    }

    async getMarca(id) {
        return this.request(`/marcas?id=eq.${id}&select=*`);
    }

    async createMarca(data) {
        return this.request('/marcas', {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });
    }

    async updateMarca(id, data) {
        return this.request(`/marcas?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });
    }

    async deleteMarca(id) {
        return this.request(`/marcas?id=eq.${id}`, {
            method: 'DELETE'
        });
    }

    // ===== MODELOS =====
    async getModelos(filters = {}) {
        let query = '/modelos?select=*,marcas(nombre)&order=nombre.asc';
        
        if (filters.marca_id) {
            query += `&marca_id=eq.${filters.marca_id}`;
        }
        if (filters.search) {
            query += `&nombre.ilike.*${filters.search}*`;
        }
        
        return this.request(query);
    }

    async getModelo(id) {
        return this.request(`/modelos?id=eq.${id}&select=*,marcas(nombre)`);
    }

    async createModelo(data) {
        return this.request('/modelos', {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });
    }

    async updateModelo(id, data) {
        return this.request(`/modelos?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });
    }

    async deleteModelo(id) {
        return this.request(`/modelos?id=eq.${id}`, {
            method: 'DELETE'
        });
    }

    // ===== ESTADOS DE INVENTARIO =====
    async getEstadosInventario() {
        return this.request('/estados_inventario?select=*&order=nombre.asc');
    }

    async getEstadoInventario(id) {
        return this.request(`/estados_inventario?id=eq.${id}&select=*`);
    }

    async createEstadoInventario(data) {
        return this.request('/estados_inventario', {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });
    }

    async updateEstadoInventario(id, data) {
        return this.request(`/estados_inventario?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });
    }

    async deleteEstadoInventario(id) {
        return this.request(`/estados_inventario?id=eq.${id}`, {
            method: 'DELETE'
        });
    }

    // ===== FOTOS DE VEHÍCULOS =====
    async getVehiculoFotos(vehiculoId) {
        return this.request(`/vehiculo_fotos?vehiculo_id=eq.${vehiculoId}&select=*&order=orden.asc`);
    }

    async createVehiculoFoto(data) {
        return this.request('/vehiculo_fotos', {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });
    }

    async deleteVehiculoFoto(id) {
        return this.request(`/vehiculo_fotos?id=eq.${id}`, {
            method: 'DELETE'
        });
    }

    // ===== ESTADÍSTICAS =====
    async getEstadisticas() {
        const [arrendadoras, vehiculos, marcas, modelos] = await Promise.all([
            this.getArrendadoras(),
            this.getVehiculos(),
            this.getMarcas(),
            this.getModelos()
        ]);

        return {
            totalArrendadoras: arrendadoras.length,
            totalVehiculos: vehiculos.length,
            totalMarcas: marcas.length,
            totalModelos: modelos.length
        };
    }

    async getVehiculosPorArrendadora() {
        return this.request('/vehiculos?select=arrendadora_id,arrendadoras(nombre)&order=arrendadora_id.asc');
    }

    // ===== UTILIDADES =====
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC'
        }).format(amount);
    }

    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CR');
    }

    getStatusBadgeClass(estadoId) {
        const statusClasses = {
            1: 'status-available',
            2: 'status-rented',
            3: 'status-maintenance',
            4: 'status-out-of-service',
            5: 'status-sold'
        };
        return statusClasses[estadoId] || 'status-available';
    }

    getStatusText(estadoId) {
        const status = ESTADOS_VEHICULO.find(s => s.id === estadoId);
        return status ? status.nombre : 'Desconocido';
    }
}

// Instancia global del servicio API
const api = new ApiService();
