// Sistema de Modales Minimalista

// ===== MODAL DE ARRENDADORAS =====
function getArrendadoraModalContent(item = null) {
    const isEditing = item !== null;
    const title = isEditing ? 'Editar Arrendadora' : 'Nueva Arrendadora';
    
    return `
        <div class="modal-minimal">
            <!-- Header Minimalista -->
            <div class="modal-header-minimal">
                <div class="header-content">
                    <h2 class="modal-title">${title}</h2>
                    <button onclick="app.closeModal()" class="close-btn-minimal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <!-- Body Minimalista -->
            <div class="modal-body-minimal">
                <form id="arrendadora-form" class="form-minimal">
                    <div class="form-field-minimal">
                        <label for="arrendadora-nombre" class="label-minimal">
                            Nombre de la Empresa <span class="required">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="arrendadora-nombre" 
                            class="input-minimal" 
                            value="${item?.nombre || ''}" 
                            placeholder="Ej: Rent a Car Costa Rica S.A."
                            required
                        >
                    </div>
                    
                    <div class="form-field-minimal">
                        <label for="arrendadora-identificacion" class="label-minimal">
                            Identificación Jurídica
                        </label>
                        <input 
                            type="text" 
                            id="arrendadora-identificacion" 
                            class="input-minimal" 
                            value="${item?.identificacion_juridica || ''}" 
                            placeholder="Ej: 3-101-672906"
                        >
                    </div>
                </form>
            </div>
            
            <!-- Footer Minimalista -->
            <div class="modal-footer-minimal">
                <button onclick="app.closeModal()" class="btn-cancel-minimal">
                    Cancelar
                </button>
                <button onclick="saveArrendadora()" class="btn-save-minimal">
                    ${isEditing ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </div>
    `;
}

// ===== MODAL DE VEHÍCULOS =====
function getVehiculoModalContent(item = null) {
    const isEditing = item !== null;
    const title = isEditing ? 'Editar Vehículo' : 'Nuevo Vehículo';
    
    return `
        <div class="modal-minimal">
            <!-- Header Minimalista -->
            <div class="modal-header-minimal">
                <div class="header-content">
                    <h2 class="modal-title">${title}</h2>
                    <button onclick="app.closeModal()" class="close-btn-minimal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <!-- Body Minimalista -->
            <div class="modal-body-minimal">
                <form id="vehiculo-form" class="form-minimal">
                    <!-- Información Básica -->
                    <div class="form-section-minimal">
                        <h3 class="section-title-minimal">
                            <i class="fas fa-info-circle"></i>
                            Información Básica
                        </h3>
                        <div class="form-grid-minimal">
                            <div class="form-field-minimal">
                                <label for="vehiculo-placa" class="label-minimal">
                                    Placa <span class="required">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="vehiculo-placa" 
                                    class="input-minimal" 
                                    value="${item?.placa || ''}" 
                                    placeholder="ABC-123"
                                    required
                                >
                            </div>
                            <div class="form-field-minimal">
                                <label for="vehiculo-vin" class="label-minimal">VIN</label>
                                <input 
                                    type="text" 
                                    id="vehiculo-vin" 
                                    class="input-minimal" 
                                    value="${item?.vin || ''}" 
                                    placeholder="1HGBH41JXMN109186"
                                >
                            </div>
                        </div>
                    </div>
                    
                    <!-- Marca y Modelo -->
                    <div class="form-section-minimal">
                        <h3 class="section-title-minimal">
                            <i class="fas fa-tags"></i>
                            Marca y Modelo
                        </h3>
                        <div class="form-grid-minimal">
                            <div class="form-field-minimal">
                                <label for="vehiculo-marca" class="label-minimal">
                                    Marca <span class="required">*</span>
                                </label>
                                <select id="vehiculo-marca" class="select-minimal" required>
                                    <option value="">Seleccionar marca</option>
                                </select>
                            </div>
                            <div class="form-field-minimal">
                                <label for="vehiculo-modelo" class="label-minimal">
                                    Modelo <span class="required">*</span>
                                </label>
                                <select id="vehiculo-modelo" class="select-minimal" required>
                                    <option value="">Seleccionar modelo</option>
                                </select>
                            </div>
                            <div class="form-field-minimal">
                                <label for="vehiculo-anio" class="label-minimal">
                                    Año <span class="required">*</span>
                                </label>
                                <input 
                                    type="number" 
                                    id="vehiculo-anio" 
                                    class="input-minimal" 
                                    value="${item?.anio || ''}" 
                                    min="1900" 
                                    max="2030" 
                                    required
                                >
                            </div>
                        </div>
                    </div>
                    
                    <!-- Asignación -->
                    <div class="form-section-minimal">
                        <h3 class="section-title-minimal">
                            <i class="fas fa-link"></i>
                            Asignación
                        </h3>
                        <div class="form-grid-minimal">
                            <div class="form-field-minimal">
                                <label for="vehiculo-arrendadora" class="label-minimal">
                                    Arrendadora <span class="required">*</span>
                                </label>
                                <select id="vehiculo-arrendadora" class="select-minimal" required>
                                    <option value="">Seleccionar arrendadora</option>
                                </select>
                            </div>
                            <div class="form-field-minimal">
                                <label for="vehiculo-estado" class="label-minimal">
                                    Estado <span class="required">*</span>
                                </label>
                                <select id="vehiculo-estado" class="select-minimal" required>
                                    <option value="">Seleccionar estado</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Información Económica -->
                    <div class="form-section-minimal">
                        <h3 class="section-title-minimal">
                            <i class="fas fa-dollar-sign"></i>
                            Información Económica
                        </h3>
                        <div class="form-grid-minimal">
                            <div class="form-field-minimal">
                                <label for="vehiculo-precio" class="label-minimal">
                                    Precio Semanal (CRC)
                                </label>
                                <div class="input-group-minimal">
                                    <span class="currency-prefix">₡</span>
                                    <input 
                                        type="number" 
                                        id="vehiculo-precio" 
                                        class="input-minimal" 
                                        value="${item?.precio_semanal || ''}" 
                                        min="0" 
                                        step="1000"
                                        placeholder="0"
                                    >
                                </div>
                            </div>
                            <div class="form-field-minimal">
                                <label for="vehiculo-gastos" class="label-minimal">
                                    Gastos Administrativos (CRC)
                                </label>
                                <div class="input-group-minimal">
                                    <span class="currency-prefix">₡</span>
                                    <input 
                                        type="number" 
                                        id="vehiculo-gastos" 
                                        class="input-minimal" 
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
                    <div class="form-field-minimal">
                        <label for="vehiculo-fotos" class="label-minimal">
                            <i class="fas fa-images"></i>
                            Link de Fotos
                        </label>
                        <input 
                            type="url" 
                            id="vehiculo-fotos" 
                            class="input-minimal" 
                            value="${item?.link_fotos || ''}" 
                            placeholder="https://ejemplo.com/fotos"
                        >
                        <p class="help-text">URL donde se encuentran las fotos del vehículo</p>
                    </div>
                </form>
            </div>
            
            <!-- Footer Minimalista -->
            <div class="modal-footer-minimal">
                <button onclick="app.closeModal()" class="btn-cancel-minimal">
                    Cancelar
                </button>
                <button onclick="saveVehiculo()" class="btn-save-minimal">
                    ${isEditing ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </div>
    `;
}

// ===== MODAL DE MARCAS =====
function getMarcaModalContent(item = null) {
    const isEditing = item !== null;
    const title = isEditing ? 'Editar Marca' : 'Nueva Marca';
    
    return `
        <div class="modal-minimal">
            <!-- Header Minimalista -->
            <div class="modal-header-minimal">
                <div class="header-content">
                    <h2 class="modal-title">${title}</h2>
                    <button onclick="app.closeModal()" class="close-btn-minimal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <!-- Body Minimalista -->
            <div class="modal-body-minimal">
                <form id="marca-form" class="form-minimal">
                    <div class="form-field-minimal">
                        <label for="marca-nombre" class="label-minimal">
                            Nombre de la Marca <span class="required">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="marca-nombre" 
                            class="input-minimal" 
                            value="${item?.nombre || ''}" 
                            placeholder="Ej: Toyota, Honda, Ford"
                            required
                        >
                    </div>
                </form>
            </div>
            
            <!-- Footer Minimalista -->
            <div class="modal-footer-minimal">
                <button onclick="app.closeModal()" class="btn-cancel-minimal">
                    Cancelar
                </button>
                <button onclick="saveMarca()" class="btn-save-minimal">
                    ${isEditing ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </div>
    `;
}

// ===== MODAL DE MODELOS =====
function getModeloModalContent(item = null) {
    const isEditing = item !== null;
    const title = isEditing ? 'Editar Modelo' : 'Nuevo Modelo';
    
    return `
        <div class="modal-minimal">
            <!-- Header Minimalista -->
            <div class="modal-header-minimal">
                <div class="header-content">
                    <h2 class="modal-title">${title}</h2>
                    <button onclick="app.closeModal()" class="close-btn-minimal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <!-- Body Minimalista -->
            <div class="modal-body-minimal">
                <form id="modelo-form" class="form-minimal">
                    <div class="form-grid-minimal">
                        <div class="form-field-minimal">
                            <label for="modelo-marca" class="label-minimal">
                                Marca <span class="required">*</span>
                            </label>
                            <select id="modelo-marca" class="select-minimal" required>
                                <option value="">Seleccionar marca</option>
                            </select>
                        </div>
                        <div class="form-field-minimal">
                            <label for="modelo-nombre" class="label-minimal">
                                Nombre del Modelo <span class="required">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="modelo-nombre" 
                                class="input-minimal" 
                                value="${item?.nombre || ''}" 
                                placeholder="Ej: Corolla, Civic, Focus"
                                required
                            >
                        </div>
                    </div>
                </form>
            </div>
            
            <!-- Footer Minimalista -->
            <div class="modal-footer-minimal">
                <button onclick="app.closeModal()" class="btn-cancel-minimal">
                    Cancelar
                </button>
                <button onclick="saveModelo()" class="btn-save-minimal">
                    ${isEditing ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </div>
    `;
}

// ===== MODAL DE ESTADOS =====
function getEstadoModalContent(item = null) {
    const isEditing = item !== null;
    const title = isEditing ? 'Editar Estado' : 'Nuevo Estado';
    
    return `
        <div class="modal-minimal">
            <!-- Header Minimalista -->
            <div class="modal-header-minimal">
                <div class="header-content">
                    <h2 class="modal-title">${title}</h2>
                    <button onclick="app.closeModal()" class="close-btn-minimal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <!-- Body Minimalista -->
            <div class="modal-body-minimal">
                <form id="estado-form" class="form-minimal">
                    <div class="form-field-minimal">
                        <label for="estado-nombre" class="label-minimal">
                            Nombre del Estado <span class="required">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="estado-nombre" 
                            class="input-minimal" 
                            value="${item?.nombre || ''}" 
                            placeholder="Ej: Disponible, En Mantenimiento, Alquilado"
                            required
                        >
                    </div>
                </form>
            </div>
            
            <!-- Footer Minimalista -->
            <div class="modal-footer-minimal">
                <button onclick="app.closeModal()" class="btn-cancel-minimal">
                    Cancelar
                </button>
                <button onclick="saveEstado()" class="btn-save-minimal">
                    ${isEditing ? 'Actualizar' : 'Crear'}
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
window.editArrendadora = (id) => app.editArrendadora(id);
window.deleteArrendadora = (id) => app.deleteArrendadora(id);
window.saveVehiculo = saveVehiculo;
window.editVehiculo = (id) => app.editVehiculo(id);
window.deleteVehiculo = (id) => app.deleteVehiculo(id);
window.saveMarca = saveMarca;
window.editMarca = (id) => app.editMarca(id);
window.deleteMarca = (id) => app.deleteMarca(id);
window.saveModelo = saveModelo;
window.editModelo = (id) => app.editModelo(id);
window.deleteModelo = (id) => app.deleteModelo(id);
window.saveEstado = saveEstado;
window.editEstado = (id) => app.editEstado(id);
window.deleteEstado = (id) => app.deleteEstado(id);
window.loadVehiculoModalData = loadVehiculoModalData;
window.loadModeloModalData = loadModeloModalData;
