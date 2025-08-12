// Sistema de Modales Mejorado

// ===== MODAL DE ARRENDADORAS =====
function getArrendadoraModalContent(item = null) {
    const isEditing = item !== null;
    const title = isEditing ? 'Editar Arrendadora' : 'Nueva Arrendadora';
    const icon = isEditing ? 'fa-edit' : 'fa-plus';
    
    return `
        <div class="modal-container">
            <!-- Header -->
            <div class="modal-header">
                <div class="flex items-center">
                    <i class="fas ${icon} text-blue-600 mr-3"></i>
                    <h2 class="text-xl font-bold text-gray-800">${title}</h2>
                </div>
                <button onclick="app.closeModal()" class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- Body -->
            <div class="modal-body">
                <form id="arrendadora-form" class="space-y-6">
                    <!-- Nombre -->
                    <div class="form-field">
                        <label for="arrendadora-nombre" class="form-label">
                            <i class="fas fa-building mr-2"></i>Nombre de la Empresa
                        </label>
                        <input 
                            type="text" 
                            id="arrendadora-nombre" 
                            class="form-input" 
                            value="${item?.nombre || ''}" 
                            placeholder="Ej: Rent a Car Costa Rica S.A."
                            required
                        >
                        <p class="form-help">Nombre completo de la empresa arrendadora</p>
                    </div>
                    
                    <!-- Identificación Jurídica -->
                    <div class="form-field">
                        <label for="arrendadora-identificacion" class="form-label">
                            <i class="fas fa-id-card mr-2"></i>Identificación Jurídica
                        </label>
                        <input 
                            type="text" 
                            id="arrendadora-identificacion" 
                            class="form-input" 
                            value="${item?.identificacion_juridica || ''}" 
                            placeholder="Ej: 3-101-672906"
                        >
                        <p class="form-help">Número de identificación legal (opcional)</p>
                    </div>
                </form>
            </div>
            
            <!-- Footer -->
            <div class="modal-footer">
                <button onclick="app.closeModal()" class="btn-cancel">
                    <i class="fas fa-times mr-2"></i>Cancelar
                </button>
                <button onclick="saveArrendadora()" class="btn-save">
                    <i class="fas fa-save mr-2"></i>${isEditing ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </div>
    `;
}

// ===== MODAL DE VEHÍCULOS =====
function getVehiculoModalContent(item = null) {
    const isEditing = item !== null;
    const title = isEditing ? 'Editar Vehículo' : 'Nuevo Vehículo';
    const icon = isEditing ? 'fa-edit' : 'fa-car';
    
    return `
        <div class="modal-container">
            <!-- Header -->
            <div class="modal-header">
                <div class="flex items-center">
                    <i class="fas ${icon} text-blue-600 mr-3"></i>
                    <h2 class="text-xl font-bold text-gray-800">${title}</h2>
                </div>
                <button onclick="app.closeModal()" class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- Body -->
            <div class="modal-body">
                <form id="vehiculo-form" class="space-y-6">
                    <!-- Información Básica -->
                    <div class="form-section">
                        <h3 class="section-title">
                            <i class="fas fa-info-circle mr-2"></i>Información Básica
                        </h3>
                        <div class="form-grid">
                            <div class="form-field">
                                <label for="vehiculo-placa" class="form-label">Placa *</label>
                                <input 
                                    type="text" 
                                    id="vehiculo-placa" 
                                    class="form-input" 
                                    value="${item?.placa || ''}" 
                                    placeholder="ABC-123"
                                    required
                                >
                            </div>
                            <div class="form-field">
                                <label for="vehiculo-vin" class="form-label">VIN</label>
                                <input 
                                    type="text" 
                                    id="vehiculo-vin" 
                                    class="form-input" 
                                    value="${item?.vin || ''}" 
                                    placeholder="1HGBH41JXMN109186"
                                >
                            </div>
                        </div>
                    </div>
                    
                    <!-- Marca y Modelo -->
                    <div class="form-section">
                        <h3 class="section-title">
                            <i class="fas fa-tags mr-2"></i>Marca y Modelo
                        </h3>
                        <div class="form-grid">
                            <div class="form-field">
                                <label for="vehiculo-marca" class="form-label">Marca *</label>
                                <select id="vehiculo-marca" class="form-select" required>
                                    <option value="">Seleccionar marca</option>
                                </select>
                            </div>
                            <div class="form-field">
                                <label for="vehiculo-modelo" class="form-label">Modelo *</label>
                                <select id="vehiculo-modelo" class="form-select" required>
                                    <option value="">Seleccionar modelo</option>
                                </select>
                            </div>
                            <div class="form-field">
                                <label for="vehiculo-anio" class="form-label">Año *</label>
                                <input 
                                    type="number" 
                                    id="vehiculo-anio" 
                                    class="form-input" 
                                    value="${item?.anio || ''}" 
                                    min="1900" 
                                    max="2030" 
                                    required
                                >
                            </div>
                        </div>
                    </div>
                    
                    <!-- Asignación -->
                    <div class="form-section">
                        <h3 class="section-title">
                            <i class="fas fa-link mr-2"></i>Asignación
                        </h3>
                        <div class="form-grid">
                            <div class="form-field">
                                <label for="vehiculo-arrendadora" class="form-label">Arrendadora *</label>
                                <select id="vehiculo-arrendadora" class="form-select" required>
                                    <option value="">Seleccionar arrendadora</option>
                                </select>
                            </div>
                            <div class="form-field">
                                <label for="vehiculo-estado" class="form-label">Estado *</label>
                                <select id="vehiculo-estado" class="form-select" required>
                                    <option value="">Seleccionar estado</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Información Económica -->
                    <div class="form-section">
                        <h3 class="section-title">
                            <i class="fas fa-dollar-sign mr-2"></i>Información Económica
                        </h3>
                        <div class="form-grid">
                            <div class="form-field">
                                <label for="vehiculo-precio" class="form-label">Precio Semanal (CRC)</label>
                                <div class="input-group">
                                    <span class="input-prefix">₡</span>
                                    <input 
                                        type="number" 
                                        id="vehiculo-precio" 
                                        class="form-input" 
                                        value="${item?.precio_semanal || ''}" 
                                        min="0" 
                                        step="1000"
                                        placeholder="0"
                                    >
                                </div>
                            </div>
                            <div class="form-field">
                                <label for="vehiculo-gastos" class="form-label">Gastos Administrativos (CRC)</label>
                                <div class="input-group">
                                    <span class="input-prefix">₡</span>
                                    <input 
                                        type="number" 
                                        id="vehiculo-gastos" 
                                        class="form-input" 
                                        value="${item?.gastos_adms || ''}" 
                                        min="0" 
                                        step="1000"
                                        placeholder="0"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Fotos -->
                    <div class="form-field">
                        <label for="vehiculo-fotos" class="form-label">
                            <i class="fas fa-images mr-2"></i>Link de Fotos
                        </label>
                        <input 
                            type="url" 
                            id="vehiculo-fotos" 
                            class="form-input" 
                            value="${item?.link_fotos || ''}" 
                            placeholder="https://ejemplo.com/fotos"
                        >
                        <p class="form-help">URL donde se encuentran las fotos del vehículo</p>
                    </div>
                </form>
            </div>
            
            <!-- Footer -->
            <div class="modal-footer">
                <button onclick="app.closeModal()" class="btn-cancel">
                    <i class="fas fa-times mr-2"></i>Cancelar
                </button>
                <button onclick="saveVehiculo()" class="btn-save">
                    <i class="fas fa-save mr-2"></i>${isEditing ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </div>
    `;
}

// ===== MODAL DE MARCAS =====
function getMarcaModalContent(item = null) {
    const isEditing = item !== null;
    const title = isEditing ? 'Editar Marca' : 'Nueva Marca';
    const icon = isEditing ? 'fa-edit' : 'fa-tag';
    
    return `
        <div class="modal-container">
            <!-- Header -->
            <div class="modal-header">
                <div class="flex items-center">
                    <i class="fas ${icon} text-blue-600 mr-3"></i>
                    <h2 class="text-xl font-bold text-gray-800">${title}</h2>
                </div>
                <button onclick="app.closeModal()" class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- Body -->
            <div class="modal-body">
                <form id="marca-form" class="space-y-6">
                    <div class="form-field">
                        <label for="marca-nombre" class="form-label">
                            <i class="fas fa-tag mr-2"></i>Nombre de la Marca
                        </label>
                        <input 
                            type="text" 
                            id="marca-nombre" 
                            class="form-input" 
                            value="${item?.nombre || ''}" 
                            placeholder="Ej: Toyota, Honda, Ford"
                            required
                        >
                        <p class="form-help">Nombre del fabricante del vehículo</p>
                    </div>
                </form>
            </div>
            
            <!-- Footer -->
            <div class="modal-footer">
                <button onclick="app.closeModal()" class="btn-cancel">
                    <i class="fas fa-times mr-2"></i>Cancelar
                </button>
                <button onclick="saveMarca()" class="btn-save">
                    <i class="fas fa-save mr-2"></i>${isEditing ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </div>
    `;
}

// ===== MODAL DE MODELOS =====
function getModeloModalContent(item = null) {
    const isEditing = item !== null;
    const title = isEditing ? 'Editar Modelo' : 'Nuevo Modelo';
    const icon = isEditing ? 'fa-edit' : 'fa-car-side';
    
    return `
        <div class="modal-container">
            <!-- Header -->
            <div class="modal-header">
                <div class="flex items-center">
                    <i class="fas ${icon} text-blue-600 mr-3"></i>
                    <h2 class="text-xl font-bold text-gray-800">${title}</h2>
                </div>
                <button onclick="app.closeModal()" class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- Body -->
            <div class="modal-body">
                <form id="modelo-form" class="space-y-6">
                    <div class="form-grid">
                        <div class="form-field">
                            <label for="modelo-marca" class="form-label">
                                <i class="fas fa-tag mr-2"></i>Marca *
                            </label>
                            <select id="modelo-marca" class="form-select" required>
                                <option value="">Seleccionar marca</option>
                            </select>
                        </div>
                        <div class="form-field">
                            <label for="modelo-nombre" class="form-label">
                                <i class="fas fa-car-side mr-2"></i>Nombre del Modelo *
                            </label>
                            <input 
                                type="text" 
                                id="modelo-nombre" 
                                class="form-input" 
                                value="${item?.nombre || ''}" 
                                placeholder="Ej: Corolla, Civic, Focus"
                                required
                            >
                        </div>
                    </div>
                    <p class="form-help">Selecciona la marca y especifica el nombre del modelo</p>
                </form>
            </div>
            
            <!-- Footer -->
            <div class="modal-footer">
                <button onclick="app.closeModal()" class="btn-cancel">
                    <i class="fas fa-times mr-2"></i>Cancelar
                </button>
                <button onclick="saveModelo()" class="btn-save">
                    <i class="fas fa-save mr-2"></i>${isEditing ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </div>
    `;
}

// ===== MODAL DE ESTADOS =====
function getEstadoModalContent(item = null) {
    const isEditing = item !== null;
    const title = isEditing ? 'Editar Estado' : 'Nuevo Estado';
    const icon = isEditing ? 'fa-edit' : 'fa-clipboard-list';
    
    return `
        <div class="modal-container">
            <!-- Header -->
            <div class="modal-header">
                <div class="flex items-center">
                    <i class="fas ${icon} text-blue-600 mr-3"></i>
                    <h2 class="text-xl font-bold text-gray-800">${title}</h2>
                </div>
                <button onclick="app.closeModal()" class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- Body -->
            <div class="modal-body">
                <form id="estado-form" class="space-y-6">
                    <div class="form-field">
                        <label for="estado-nombre" class="form-label">
                            <i class="fas fa-clipboard-list mr-2"></i>Nombre del Estado
                        </label>
                        <input 
                            type="text" 
                            id="estado-nombre" 
                            class="form-input" 
                            value="${item?.nombre || ''}" 
                            placeholder="Ej: Disponible, En Mantenimiento, Alquilado"
                            required
                        >
                        <p class="form-help">Estado actual del vehículo en el inventario</p>
                    </div>
                </form>
            </div>
            
            <!-- Footer -->
            <div class="modal-footer">
                <button onclick="app.closeModal()" class="btn-cancel">
                    <i class="fas fa-times mr-2"></i>Cancelar
                </button>
                <button onclick="saveEstado()" class="btn-save">
                    <i class="fas fa-save mr-2"></i>${isEditing ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </div>
    `;
}

// ===== FUNCIONES CRUD MEJORADAS =====

// Arrendadoras
async function saveArrendadora() {
    const nombre = document.getElementById('arrendadora-nombre').value.trim();
    const identificacion = document.getElementById('arrendadora-identificacion').value.trim();
    
    if (!nombre) {
        app.showToast('El nombre de la empresa es obligatorio', 'error');
        return;
    }
    
    const data = {
        nombre,
        identificacion_juridica: identificacion || null
    };
    
    try {
        if (app.editingItem) {
            await api.updateArrendadora(app.editingItem.id, data);
            app.showToast('Arrendadora actualizada correctamente', 'success');
        } else {
            await api.createArrendadora(data);
            app.showToast('Arrendadora creada correctamente', 'success');
        }
        
        app.closeModal();
        app.loadArrendadoras();
    } catch (error) {
        app.showToast('Error al guardar la arrendadora', 'error');
    }
}

async function editArrendadora(id) {
    try {
        const arrendadora = await api.getArrendadora(id);
        if (arrendadora && arrendadora.length > 0) {
            app.openModal('arrendadora', arrendadora[0]);
        }
    } catch (error) {
        app.showToast('Error al cargar la arrendadora', 'error');
    }
}

async function deleteArrendadora(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta arrendadora?')) {
        return;
    }
    
    try {
        await api.deleteArrendadora(id);
        app.showToast('Arrendadora eliminada correctamente', 'success');
        app.loadArrendadoras();
    } catch (error) {
        app.showToast('Error al eliminar la arrendadora', 'error');
    }
}

// Vehículos
async function loadVehiculoModalData() {
    try {
        const [marcas, arrendadoras, estados] = await Promise.all([
            api.getMarcas(),
            api.getArrendadoras(),
            api.getEstadosInventario()
        ]);
        
        // Llenar select de marcas
        const marcaSelect = document.getElementById('vehiculo-marca');
        marcaSelect.innerHTML = '<option value="">Seleccionar marca</option>' +
            marcas.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('');
        
        // Llenar select de arrendadoras
        const arrendadoraSelect = document.getElementById('vehiculo-arrendadora');
        arrendadoraSelect.innerHTML = '<option value="">Seleccionar arrendadora</option>' +
            arrendadoras.map(a => `<option value="${a.id}">${a.nombre}</option>`).join('');
        
        // Llenar select de estados
        const estadoSelect = document.getElementById('vehiculo-estado');
        estadoSelect.innerHTML = '<option value="">Seleccionar estado</option>' +
            estados.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
        
        // Si estamos editando, seleccionar valores
        if (app.editingItem) {
            marcaSelect.value = app.editingItem.marca_id || '';
            arrendadoraSelect.value = app.editingItem.arrendadora_id || '';
            estadoSelect.value = app.editingItem.estado_inventario_id || '';
            
            // Cargar modelos de la marca seleccionada
            if (app.editingItem.marca_id) {
                await loadModelosForMarca(app.editingItem.marca_id);
                document.getElementById('vehiculo-modelo').value = app.editingItem.modelo_id || '';
            }
        }
        
        // Event listener para cargar modelos cuando cambie la marca
        marcaSelect.addEventListener('change', async (e) => {
            await loadModelosForMarca(e.target.value);
        });
        
    } catch (error) {
        app.showToast('Error al cargar datos del modal', 'error');
    }
}

async function loadModelosForMarca(marcaId) {
    try {
        const modelos = await api.getModelos({ marca_id: marcaId });
        const modeloSelect = document.getElementById('vehiculo-modelo');
        modeloSelect.innerHTML = '<option value="">Seleccionar modelo</option>' +
            modelos.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('');
    } catch (error) {
        console.error('Error loading modelos:', error);
    }
}

async function saveVehiculo() {
    const placa = document.getElementById('vehiculo-placa').value.trim();
    const vin = document.getElementById('vehiculo-vin').value.trim();
    const marcaId = document.getElementById('vehiculo-marca').value;
    const modeloId = document.getElementById('vehiculo-modelo').value;
    const anio = document.getElementById('vehiculo-anio').value;
    const arrendadoraId = document.getElementById('vehiculo-arrendadora').value;
    const estadoId = document.getElementById('vehiculo-estado').value;
    const precio = document.getElementById('vehiculo-precio').value;
    const gastos = document.getElementById('vehiculo-gastos').value;
    const fotos = document.getElementById('vehiculo-fotos').value.trim();
    
    if (!placa || !marcaId || !modeloId || !anio || !arrendadoraId || !estadoId) {
        app.showToast('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    const data = {
        placa,
        vin: vin || null,
        marca_id: parseInt(marcaId),
        modelo_id: parseInt(modeloId),
        anio: parseInt(anio),
        arrendadora_id: parseInt(arrendadoraId),
        estado_inventario_id: parseInt(estadoId),
        precio_semanal: precio ? parseFloat(precio) : null,
        gastos_adms: gastos ? parseFloat(gastos) : null,
        link_fotos: fotos || null
    };
    
    try {
        if (app.editingItem) {
            await api.updateVehiculo(app.editingItem.id, data);
            app.showToast('Vehículo actualizado correctamente', 'success');
        } else {
            await api.createVehiculo(data);
            app.showToast('Vehículo creado correctamente', 'success');
        }
        
        app.closeModal();
        app.loadVehiculos();
    } catch (error) {
        app.showToast('Error al guardar el vehículo', 'error');
    }
}

async function editVehiculo(id) {
    try {
        const vehiculo = await api.getVehiculo(id);
        if (vehiculo && vehiculo.length > 0) {
            app.openModal('vehiculo', vehiculo[0]);
            await loadVehiculoModalData();
        }
    } catch (error) {
        app.showToast('Error al cargar el vehículo', 'error');
    }
}

async function deleteVehiculo(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
        return;
    }
    
    try {
        await api.deleteVehiculo(id);
        app.showToast('Vehículo eliminado correctamente', 'success');
        app.loadVehiculos();
    } catch (error) {
        app.showToast('Error al eliminar el vehículo', 'error');
    }
}

// Marcas
async function saveMarca() {
    const nombre = document.getElementById('marca-nombre').value.trim();
    
    if (!nombre) {
        app.showToast('El nombre de la marca es obligatorio', 'error');
        return;
    }
    
    const data = { nombre };
    
    try {
        if (app.editingItem) {
            await api.updateMarca(app.editingItem.id, data);
            app.showToast('Marca actualizada correctamente', 'success');
        } else {
            await api.createMarca(data);
            app.showToast('Marca creada correctamente', 'success');
        }
        
        app.closeModal();
        app.loadMarcas();
    } catch (error) {
        app.showToast('Error al guardar la marca', 'error');
    }
}

async function editMarca(id) {
    try {
        const marca = await api.getMarca(id);
        if (marca && marca.length > 0) {
            app.openModal('marca', marca[0]);
        }
    } catch (error) {
        app.showToast('Error al cargar la marca', 'error');
    }
}

async function deleteMarca(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta marca?')) {
        return;
    }
    
    try {
        await api.deleteMarca(id);
        app.showToast('Marca eliminada correctamente', 'success');
        app.loadMarcas();
    } catch (error) {
        app.showToast('Error al eliminar la marca', 'error');
    }
}

// Modelos
async function loadModeloModalData() {
    try {
        const marcas = await api.getMarcas();
        const marcaSelect = document.getElementById('modelo-marca');
        marcaSelect.innerHTML = '<option value="">Seleccionar marca</option>' +
            marcas.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('');
        
        if (app.editingItem) {
            marcaSelect.value = app.editingItem.marca_id || '';
        }
    } catch (error) {
        app.showToast('Error al cargar datos del modal', 'error');
    }
}

async function saveModelo() {
    const marcaId = document.getElementById('modelo-marca').value;
    const nombre = document.getElementById('modelo-nombre').value.trim();
    
    if (!marcaId || !nombre) {
        app.showToast('Por favor completa todos los campos', 'error');
        return;
    }
    
    const data = {
        marca_id: parseInt(marcaId),
        nombre
    };
    
    try {
        if (app.editingItem) {
            await api.updateModelo(app.editingItem.id, data);
            app.showToast('Modelo actualizado correctamente', 'success');
        } else {
            await api.createModelo(data);
            app.showToast('Modelo creado correctamente', 'success');
        }
        
        app.closeModal();
        app.loadModelos();
    } catch (error) {
        app.showToast('Error al guardar el modelo', 'error');
    }
}

async function editModelo(id) {
    try {
        const modelo = await api.getModelo(id);
        if (modelo && modelo.length > 0) {
            app.openModal('modelo', modelo[0]);
            await loadModeloModalData();
        }
    } catch (error) {
        app.showToast('Error al cargar el modelo', 'error');
    }
}

async function deleteModelo(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este modelo?')) {
        return;
    }
    
    try {
        await api.deleteModelo(id);
        app.showToast('Modelo eliminado correctamente', 'success');
        app.loadModelos();
    } catch (error) {
        app.showToast('Error al eliminar el modelo', 'error');
    }
}

// Estados
async function saveEstado() {
    const nombre = document.getElementById('estado-nombre').value.trim();
    
    if (!nombre) {
        app.showToast('El nombre del estado es obligatorio', 'error');
        return;
    }
    
    const data = { nombre };
    
    try {
        if (app.editingItem) {
            await api.updateEstadoInventario(app.editingItem.id, data);
            app.showToast('Estado actualizado correctamente', 'success');
        } else {
            await api.createEstadoInventario(data);
            app.showToast('Estado creado correctamente', 'success');
        }
        
        app.closeModal();
        app.loadEstados();
    } catch (error) {
        app.showToast('Error al guardar el estado', 'error');
    }
}

async function editEstado(id) {
    try {
        const estado = await api.getEstadoInventario(id);
        if (estado && estado.length > 0) {
            app.openModal('estado', estado[0]);
        }
    } catch (error) {
        app.showToast('Error al cargar el estado', 'error');
    }
}

async function deleteEstado(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este estado?')) {
        return;
    }
    
    try {
        await api.deleteEstadoInventario(id);
        app.showToast('Estado eliminado correctamente', 'success');
        app.loadEstados();
    } catch (error) {
        app.showToast('Error al eliminar el estado', 'error');
    }
}

// Extender la clase FlotaApp con los métodos de modales
Object.assign(FlotaApp.prototype, {
    getArrendadoraModalContent,
    getVehiculoModalContent,
    getMarcaModalContent,
    getModeloModalContent,
    getEstadoModalContent
});

// Funciones globales
window.saveArrendadora = saveArrendadora;
window.editArrendadora = editArrendadora;
window.deleteArrendadora = deleteArrendadora;
window.saveVehiculo = saveVehiculo;
window.editVehiculo = editVehiculo;
window.deleteVehiculo = deleteVehiculo;
window.saveMarca = saveMarca;
window.editMarca = editMarca;
window.deleteMarca = deleteMarca;
window.saveModelo = saveModelo;
window.editModelo = editModelo;
window.deleteModelo = deleteModelo;
window.saveEstado = saveEstado;
window.editEstado = editEstado;
window.deleteEstado = deleteEstado;
window.loadVehiculoModalData = loadVehiculoModalData;
window.loadModeloModalData = loadModeloModalData;
