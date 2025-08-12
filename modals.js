// Sistema de Modales Mejorado
class ModalManager {
    constructor() {
        this.modalData = new Map();
        this.validationRules = new Map();
        this.setupValidationRules();
    }

    setupValidationRules() {
        this.validationRules.set('arrendadora', {
            nombre: { required: true, minLength: 2 }
        });

        this.validationRules.set('vehiculo', {
            placa: { required: true, pattern: FORM_CONSTANTS.validation.placaPattern },
            marca_id: { required: true },
            modelo_id: { required: true },
            anio: { required: true, min: FORM_CONSTANTS.minYear, max: FORM_CONSTANTS.maxYear },
            arrendadora_id: { required: true },
            estado_inventario_id: { required: true },
            vin: { pattern: FORM_CONSTANTS.validation.vinPattern },
            link_fotos: { pattern: FORM_CONSTANTS.validation.urlPattern }
        });

        this.validationRules.set('marca', {
            nombre: { required: true, minLength: 2 }
        });

        this.validationRules.set('modelo', {
            nombre: { required: true, minLength: 2 },
            marca_id: { required: true }
        });

        this.validationRules.set('estado', {
            nombre: { required: true, minLength: 2 }
        });
    }

    async getModalContent(type, item = null) {
        switch (type) {
            case 'arrendadora':
                return this.getArrendadoraModal(item);
            case 'vehiculo':
                return this.getVehiculoModal(item);
            case 'marca':
                return this.getMarcaModal(item);
            case 'modelo':
                return this.getModeloModal(item);
            case 'estado':
                return this.getEstadoModal(item);
            default:
                throw new Error(`Unknown modal type: ${type}`);
        }
    }

    async loadModalData(type, item = null) {
        switch (type) {
            case 'vehiculo':
                await this.loadVehiculoData(item);
                break;
            case 'modelo':
                await this.loadModeloData(item);
                break;
        }
    }

    // ===== MODAL DE ARRENDADORAS =====
    getArrendadoraModal(item = null) {
        const isEditing = item !== null;
        const title = isEditing ? 'Editar Arrendadora' : 'Nueva Arrendadora';

        return `
            <div class="modal-minimal">
                ${this.getModalHeader(title)}
                
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
                                value="${this.escapeValue(item?.nombre)}" 
                                placeholder="${FORM_CONSTANTS.placeholders.empresa}"
                                maxlength="100"
                                required
                            >
                            <div class="validation-error" id="arrendadora-nombre-error"></div>
                        </div>
                        
                        <div class="form-field-minimal">
                            <label for="arrendadora-identificacion" class="label-minimal">
                                Identificación Jurídica
                            </label>
                            <input 
                                type="text" 
                                id="arrendadora-identificacion" 
                                class="input-minimal" 
                                value="${this.escapeValue(item?.identificacion_juridica)}" 
                                placeholder="${FORM_CONSTANTS.placeholders.identificacion}"
                                maxlength="50"
                            >
                            <div class="validation-error" id="arrendadora-identificacion-error"></div>
                        </div>
                    </form>
                </div>
                
                ${this.getModalFooter(isEditing)}
            </div>
        `;
    }

    // ===== MODAL DE VEHÍCULOS =====
    getVehiculoModal(item = null) {
        const isEditing = item !== null;
        const title = isEditing ? 'Editar Vehículo' : 'Nuevo Vehículo';

        return `
            <div class="modal-minimal modal-wide">
                ${this.getModalHeader(title)}
                
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
                                        value="${this.escapeValue(item?.placa)}" 
                                        placeholder="${FORM_CONSTANTS.placeholders.placa}"
                                        maxlength="7"
                                        style="text-transform: uppercase;"
                                        required
                                    >
                                    <div class="validation-error" id="vehiculo-placa-error"></div>
                                </div>
                                <div class="form-field-minimal">
                                    <label for="vehiculo-vin" class="label-minimal">VIN</label>
                                    <input 
                                        type="text" 
                                        id="vehiculo-vin" 
                                        class="input-minimal" 
                                        value="${this.escapeValue(item?.vin)}" 
                                        placeholder="${FORM_CONSTANTS.placeholders.vin}"
                                        maxlength="17"
                                        style="text-transform: uppercase;"
                                    >
                                    <div class="validation-error" id="vehiculo-vin-error"></div>
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
                                        min="${FORM_CONSTANTS.minYear}" 
                                        max="${FORM_CONSTANTS.maxYear}"
                                        required
                                    >
                                    <div class="validation-error" id="vehiculo-anio-error"></div>
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
                                    <div class="flex space-x-2">
                                        <select id="vehiculo-marca" class="select-minimal flex-1" required>
                                            <option value="">Seleccionar marca</option>
                                        </select>
                                        <button type="button" onclick="modalManager.createMarcaQuick()" 
                                                class="btn-secondary-small" title="Crear nueva marca">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <div class="validation-error" id="vehiculo-marca-error"></div>
                                </div>
                                <div class="form-field-minimal">
                                    <label for="vehiculo-modelo" class="label-minimal">
                                        Modelo <span class="required">*</span>
                                    </label>
                                    <div class="flex space-x-2">
                                        <select id="vehiculo-modelo" class="select-minimal flex-1" required disabled>
                                            <option value="">Primero selecciona una marca</option>
                                        </select>
                                        <button type="button" onclick="modalManager.createModeloQuick()" 
                                                class="btn-secondary-small" title="Crear nuevo modelo" disabled>
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <div class="validation-error" id="vehiculo-modelo-error"></div>
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
                                    <div class="validation-error" id="vehiculo-arrendadora-error"></div>
                                </div>
                                <div class="form-field-minimal">
                                    <label for="vehiculo-estado" class="label-minimal">
                                        Estado <span class="required">*</span>
                                    </label>
                                    <select id="vehiculo-estado" class="select-minimal" required>
                                        <option value="">Seleccionar estado</option>
                                    </select>
                                    <div class="validation-error" id="vehiculo-estado-error"></div>
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
                                    <div class="validation-error" id="vehiculo-precio-error"></div>
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
                                    <div class="validation-error" id="vehiculo-gastos-error"></div>
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
                                value="${this.escapeValue(item?.link_fotos)}" 
                                placeholder="${FORM_CONSTANTS.placeholders.fotos}"
                            >
                            <p class="help-text">URL donde se encuentran las fotos del vehículo</p>
                            <div class="validation-error" id="vehiculo-fotos-error"></div>
                        </div>
                    </form>
                </div>
                
                ${this.getModalFooter(isEditing)}
            </div>
        `;
    }

    async loadVehiculoData(item = null) {
        try {
            const [marcas, arrendadoras, estados] = await Promise.all([
                api.getMarcas(),
                api.getArrendadoras(),
                api.getEstadosInventario()
            ]);

            // Llenar select de marcas
            const marcaSelect = document.getElementById('vehiculo-marca');
            marcaSelect.innerHTML = '<option value="">Seleccionar marca</option>' +
                marcas.map(m => `<option value="${m.id}">${this.escapeHtml(m.nombre)}</option>`).join('');

            // Llenar select de arrendadoras
            const arrendadoraSelect = document.getElementById('vehiculo-arrendadora');
            arrendadoraSelect.innerHTML = '<option value="">Seleccionar arrendadora</option>' +
                arrendadoras.map(a => `<option value="${a.id}">${this.escapeHtml(a.nombre)}</option>`).join('');

            // Llenar select de estados
            const estadoSelect = document.getElementById('vehiculo-estado');
            estadoSelect.innerHTML = '<option value="">Seleccionar estado</option>' +
                estados.map(e => `<option value="${e.id}">${this.escapeHtml(e.nombre)}</option>`).join('');

            // Configurar event listeners
            marcaSelect.addEventListener('change', async (e) => {
                await this.loadModelosForMarca(e.target.value);
                this.toggleModeloButton();
            });

            // Si estamos editando, seleccionar valores
            if (item) {
                marcaSelect.value = item.marca_id || '';
                arrendadoraSelect.value = item.arrendadora_id || '';
                estadoSelect.value = item.estado_inventario_id || '';

                // Cargar modelos de la marca seleccionada
                if (item.marca_id) {
                    await this.loadModelosForMarca(item.marca_id);
                    document.getElementById('vehiculo-modelo').value = item.modelo_id || '';
                }
            }

            this.toggleModeloButton();

        } catch (error) {
            console.error('Error loading vehiculo modal data:', error);
            app.showToast('Error al cargar datos del modal', 'error');
        }
    }

    async loadModelosForMarca(marcaId) {
        try {
            const modeloSelect = document.getElementById('vehiculo-modelo');
            const modeloButton = document.querySelector('button[onclick="modalManager.createModeloQuick()"]');

            if (!marcaId) {
                modeloSelect.innerHTML = '<option value="">Primero selecciona una marca</option>';
                modeloSelect.disabled = true;
                if (modeloButton) modeloButton.disabled = true;
                return;
            }

            modeloSelect.disabled = false;
            if (modeloButton) modeloButton.disabled = false;

            const modelos = await api.getModelos({ marca_id: marcaId });
            modeloSelect.innerHTML = '<option value="">Seleccionar modelo</option>' +
                modelos.map(m => `<option value="${m.id}">${this.escapeHtml(m.nombre)}</option>`).join('');
        } catch (error) {
            console.error('Error loading modelos:', error);
        }
    }

    toggleModeloButton() {
        const marcaSelect = document.getElementById('vehiculo-marca');
        const modeloButton = document.querySelector('button[onclick="modalManager.createModeloQuick()"]');

        if (modeloButton) {
            modeloButton.disabled = !marcaSelect.value;
        }
    }

    // ===== MODAL DE MARCAS =====
    getMarcaModal(item = null) {
        const isEditing = item !== null;
        const title = isEditing ? 'Editar Marca' : 'Nueva Marca';

        return `
            <div class="modal-minimal">
                ${this.getModalHeader(title)}
                
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
                                value="${this.escapeValue(item?.nombre)}" 
                                placeholder="${FORM_CONSTANTS.placeholders.marca}"
                                maxlength="50"
                                required
                            >
                            <div class="validation-error" id="marca-nombre-error"></div>
                        </div>
                    </form>
                </div>
                
                ${this.getModalFooter(isEditing)}
            </div>
        `;
    }

    // ===== MODAL DE MODELOS =====
    getModeloModal(item = null) {
        const isEditing = item !== null;
        const title = isEditing ? 'Editar Modelo' : 'Nuevo Modelo';

        return `
            <div class="modal-minimal">
                ${this.getModalHeader(title)}
                
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
                                <div class="validation-error" id="modelo-marca-error"></div>
                            </div>
                            <div class="form-field-minimal">
                                <label for="modelo-nombre" class="label-minimal">
                                    Nombre del Modelo <span class="required">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="modelo-nombre" 
                                    class="input-minimal" 
                                    value="${this.escapeValue(item?.nombre)}" 
                                    placeholder="${FORM_CONSTANTS.placeholders.modelo}"
                                    maxlength="50"
                                    required
                                >
                                <div class="validation-error" id="modelo-nombre-error"></div>
                            </div>
                        </div>
                    </form>
                </div>
                
                ${this.getModalFooter(isEditing)}
            </div>
        `;
    }

    async loadModeloData(item = null) {
        try {
            const marcas = await api.getMarcas();
            const marcaSelect = document.getElementById('modelo-marca');
            marcaSelect.innerHTML = '<option value="">Seleccionar marca</option>' +
                marcas.map(m => `<option value="${m.id}">${this.escapeHtml(m.nombre)}</option>`).join('');

            if (item) {
                marcaSelect.value = item.marca_id || '';
            }
        } catch (error) {
            console.error('Error loading modelo modal data:', error);
            app.showToast('Error al cargar datos del modal', 'error');
        }
    }

    // ===== MODAL DE ESTADOS =====
    getEstadoModal(item = null) {
        const isEditing = item !== null;
        const title = isEditing ? 'Editar Estado' : 'Nuevo Estado';

        return `
            <div class="modal-minimal">
                ${this.getModalHeader(title)}
                
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
                                value="${this.escapeValue(item?.nombre)}" 
                                placeholder="${FORM_CONSTANTS.placeholders.estado}"
                                maxlength="50"
                                required
                            >
                            <div class="validation-error" id="estado-nombre-error"></div>
                        </div>
                    </form>
                </div>
                
                ${this.getModalFooter(isEditing)}
            </div>
        `;
    }

    // ===== COMPONENTES COMUNES =====
    getModalHeader(title) {
        return `
            <div class="modal-header-minimal">
                <div class="header-content">
                    <h2 class="modal-title">${this.escapeHtml(title)}</h2>
                    <button onclick="app.closeModal()" class="close-btn-minimal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    }

    getModalFooter(isEditing) {
        return `
            <div class="modal-footer-minimal">
                <button onclick="app.closeModal()" class="btn-cancel-minimal">
                    Cancelar
                </button>
                <button onclick="modalManager.saveCurrentModal()" class="btn-save-minimal">
                    ${isEditing ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        `;
    }

    // ===== FUNCIONES DE GUARDADO =====
    async saveCurrentModal() {
        if (!app.currentModal) return;

        try {
            const isValid = this.validateForm(app.currentModal);
            if (!isValid) return;

            const data = this.getFormData(app.currentModal);
            const isEditing = app.editingItem !== null;

            let result;
            const itemType = app.currentModal;

            if (isEditing) {
                result = await this.updateItem(itemType, app.editingItem.id, data);
                app.showToast(`${this.getItemDisplayName(itemType)} ${MESSAGES.success.update}`, 'success');
            } else {
                result = await this.createItem(itemType, data);
                app.showToast(`${this.getItemDisplayName(itemType)} ${MESSAGES.success.create}`, 'success');
            }

            app.closeModal();
            await app.loadSectionData(this.getSectionForItemType(itemType));

        } catch (error) {
            console.error(`Error saving ${app.currentModal}:`, error);
            const action = app.editingItem ? MESSAGES.error.update : MESSAGES.error.create;
            app.showToast(`${action} ${this.getItemDisplayName(app.currentModal)}`, 'error');
        }
    }

    async createItem(type, data) {
        switch (type) {
            case 'arrendadora': return await api.createArrendadora(data);
            case 'vehiculo': return await api.createVehiculo(data);
            case 'marca': return await api.createMarca(data);
            case 'modelo': return await api.createModelo(data);
            case 'estado': return await api.createEstadoInventario(data);
            default: throw new Error(`Unknown item type: ${type}`);
        }
    }

    async updateItem(type, id, data) {
        switch (type) {
            case 'arrendadora': return await api.updateArrendadora(id, data);
            case 'vehiculo': return await api.updateVehiculo(id, data);
            case 'marca': return await api.updateMarca(id, data);
            case 'modelo': return await api.updateModelo(id, data);
            case 'estado': return await api.updateEstadoInventario(id, data);
            default: throw new Error(`Unknown item type: ${type}`);
        }
    }

    getFormData(type) {
        switch (type) {
            case 'arrendadora':
                return {
                    nombre: document.getElementById('arrendadora-nombre').value.trim(),
                    identificacion_juridica: document.getElementById('arrendadora-identificacion').value.trim() || null
                };
            case 'vehiculo':
                return {
                    placa: document.getElementById('vehiculo-placa').value.trim().toUpperCase(),
                    vin: document.getElementById('vehiculo-vin').value.trim().toUpperCase() || null,
                    marca_id: parseInt(document.getElementById('vehiculo-marca').value),
                    modelo_id: parseInt(document.getElementById('vehiculo-modelo').value),
                    anio: parseInt(document.getElementById('vehiculo-anio').value),
                    arrendadora_id: parseInt(document.getElementById('vehiculo-arrendadora').value),
                    estado_inventario_id: parseInt(document.getElementById('vehiculo-estado').value),
                    precio_semanal: parseFloat(document.getElementById('vehiculo-precio').value) || null,
                    gastos_adms: parseFloat(document.getElementById('vehiculo-gastos').value) || null,
                    link_fotos: document.getElementById('vehiculo-fotos').value.trim() || null
                };
            case 'marca':
                return {
                    nombre: document.getElementById('marca-nombre').value.trim()
                };
            case 'modelo':
                return {
                    marca_id: parseInt(document.getElementById('modelo-marca').value),
                    nombre: document.getElementById('modelo-nombre').value.trim()
                };
            case 'estado':
                return {
                    nombre: document.getElementById('estado-nombre').value.trim()
                };
        }
    }

    // ===== VALIDACIONES =====
    validateForm(type) {
        const rules = this.validationRules.get(type);
        if (!rules) return true;

        let isValid = true;
        this.clearAllValidationErrors();

        for (const [fieldName, rule] of Object.entries(rules)) {
            const fieldValid = this.validateField(type, fieldName, rule);
            if (!fieldValid) isValid = false;
        }

        return isValid;
    }

    validateField(type, fieldName, rule) {
        const fieldId = `${type}-${fieldName.replace('_', '-')}`;
        const element = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);

        if (!element) return true;

        const value = element.value.trim();
        let errorMessage = '';

        // Required validation
        if (rule.required && !value) {
            errorMessage = 'Este campo es obligatorio';
        }
        // MinLength validation
        else if (rule.minLength && value.length < rule.minLength) {
            errorMessage = `Mínimo ${rule.minLength} caracteres`;
        }
        // Pattern validation
        else if (rule.pattern && value && !rule.pattern.test(value)) {
            errorMessage = this.getPatternErrorMessage(fieldName);
        }
        // Min/Max validation for numbers
        else if (rule.min && parseInt(value) < rule.min) {
            errorMessage = `Valor mínimo: ${rule.min}`;
        }
        else if (rule.max && parseInt(value) > rule.max) {
            errorMessage = `Valor máximo: ${rule.max}`;
        }

        // Show/hide error
        if (errorMessage) {
            element.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
            }
            return false;
        } else {
            element.classList.remove('error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
            return true;
        }
    }

    getPatternErrorMessage(fieldName) {
        const messages = {
            placa: 'Formato válido: ABC-123',
            vin: 'VIN debe tener 17 caracteres alfanuméricos',
            link_fotos: 'Debe ser una URL válida (http://... o https://...)'
        };
        return messages[fieldName] || 'Formato inválido';
    }

    clearAllValidationErrors() {
        document.querySelectorAll('.validation-error').forEach(error => {
            error.style.display = 'none';
        });
        document.querySelectorAll('.input-minimal.error, .select-minimal.error').forEach(input => {
            input.classList.remove('error');
        });
    }

    // ===== MODALES RÁPIDOS =====
    async createMarcaQuick() {
        const marcaNombre = prompt('Nombre de la nueva marca:');
        if (!marcaNombre?.trim()) return;

        try {
            const nuevaMarca = await api.createMarca({ nombre: marcaNombre.trim() });
            app.showToast('Marca creada correctamente', 'success');

            // Recargar las marcas en el select
            const marcas = await api.getMarcas();
            const marcaSelect = document.getElementById('vehiculo-marca');
            marcaSelect.innerHTML = '<option value="">Seleccionar marca</option>' +
                marcas.map(m => `<option value="${m.id}">${this.escapeHtml(m.nombre)}</option>`).join('');

            // Seleccionar la nueva marca
            marcaSelect.value = nuevaMarca[0].id;

            // Limpiar el select de modelos
            const modeloSelect = document.getElementById('vehiculo-modelo');
            modeloSelect.innerHTML = '<option value="">Seleccionar modelo</option>';
            modeloSelect.disabled = false;
            this.toggleModeloButton();

        } catch (error) {
            console.error('Error creating marca:', error);
            app.showToast('Error al crear la marca', 'error');
        }
    }

    async createModeloQuick() {
        const marcaId = document.getElementById('vehiculo-marca').value;
        if (!marcaId) {
            app.showToast('Primero selecciona una marca', 'error');
            return;
        }

        const modeloNombre = prompt('Nombre del nuevo modelo:');
        if (!modeloNombre?.trim()) return;

        try {
            const nuevoModelo = await api.createModelo({
                marca_id: parseInt(marcaId),
                nombre: modeloNombre.trim()
            });
            app.showToast('Modelo creado correctamente', 'success');

            // Recargar los modelos en el select
            await this.loadModelosForMarca(marcaId);

            // Seleccionar el nuevo modelo
            document.getElementById('vehiculo-modelo').value = nuevoModelo[0].id;

        } catch (error) {
            console.error('Error creating modelo:', error);
            app.showToast('Error al crear el modelo', 'error');
        }
    }

    // ===== UTILIDADES =====
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeValue(value) {
        return value ? this.escapeHtml(value) : '';
    }

    getItemDisplayName(type) {
        const names = {
            arrendadora: 'Arrendadora',
            vehiculo: 'Vehículo',
            marca: 'Marca',
            modelo: 'Modelo',
            estado: 'Estado'
        };
        return names[type] || type;
    }

    getSectionForItemType(type) {
        const sections = {
            arrendadora: 'arrendadoras',
            vehiculo: 'vehiculos',
            marca: 'marcas',
            modelo: 'modelos',
            estado: 'estados'
        };
        return sections[type] || type;
    }
}

// Instancia global del gestor de modales
const modalManager = new ModalManager();

// Funciones globales para compatibilidad
window.modalManager = modalManager;