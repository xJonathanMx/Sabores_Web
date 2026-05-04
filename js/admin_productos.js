document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Lógica del Menú Lateral ---
    const hamburger = document.getElementById('hamburger');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    
    const toggleMenu = () => {
        hamburger?.classList.toggle('active');
        sideMenu?.classList.toggle('open');
        overlay?.classList.toggle('active');
    };
    hamburger?.addEventListener('click', toggleMenu);
    overlay?.addEventListener('click', toggleMenu);

    const btnReportes = document.getElementById('btn-reportes');
    const submenuReportes = document.getElementById('submenu-reportes');
    const arrow = btnReportes?.querySelector('.arrow');

    btnReportes?.addEventListener('click', () => {
        const isOpen = submenuReportes.classList.contains('open');
        if (!isOpen) {
            submenuReportes.classList.add('open');
            arrow?.classList.add('rotate');
        } else {
            submenuReportes.classList.remove('open');
            arrow?.classList.remove('rotate');
        }
    });

    const formatoPesos = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

    // --- 2. Base de Datos Falsa (Actualizada a 2 categorías) ---
    let inventario = [
        { id: 1, nombre: "Paila Marina Especial", categoria: "Cocina", precio: 15000 },
        { id: 2, nombre: "Reineta a la plancha", categoria: "Cocina", precio: 12000 },
        { id: 3, nombre: "Ceviche Mixto", categoria: "Cocina", precio: 15000 },
        { id: 4, nombre: "Empanada Mariscos", categoria: "Cocina", precio: 3000 },
        { id: 5, nombre: "Pisco Sour Catedral", categoria: "Heladeria", precio: 6000 },
        { id: 6, nombre: "Bebida Express en Lata", categoria: "Heladeria", precio: 2000 },
        { id: 7, nombre: "Lomo a lo Pobre", categoria: "Cocina", precio: 13500 },
        { id: 8, nombre: "Jugo Natural Frambuesa", categoria: "Heladeria", precio: 3500 }
    ];

    // --- 3. Referencias al DOM ---
    const tbody = document.getElementById('tbody-productos');
    const contadorProductos = document.getElementById('contador-productos');
    const buscador = document.getElementById('buscador-tabla');
    
    const form = document.getElementById('form-producto');
    const inputId = document.getElementById('producto-id');
    const inputNombre = document.getElementById('producto-nombre');
    const inputCategoria = document.getElementById('producto-categoria');
    const inputPrecio = document.getElementById('producto-precio');
    const btnCancelar = document.getElementById('btn-cancelar');
    const formTitulo = document.getElementById('form-titulo');

    // --- 4. Renderizar Tabla ---
    function renderizarTabla(filtro = "") {
        tbody.innerHTML = '';
        
        const datosAbarcar = inventario.filter(prod => 
            prod.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
            prod.categoria.toLowerCase().includes(filtro.toLowerCase())
        );

        contadorProductos.textContent = `${datosAbarcar.length} Ítems Activos`;

        if (datosAbarcar.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">No se encontraron productos.</td></tr>`;
            return;
        }

        datosAbarcar.forEach(prod => {
            // Colores claros para identificar Cocina (Platos) y Barra (Bebestibles)
            let badgeClass = 'bg-secondary';
            let iconClass = 'bi-box';
            
            if (prod.categoria === 'Cocina') {
                badgeClass = 'bg-warning text-dark';
                iconClass = 'bi-fire'; // Icono de cocina
            }
            if (prod.categoria === 'Heladeria') {
                badgeClass = 'bg-info text-dark';
                iconClass = 'bi-cup-straw'; // Icono de bebida
            }

            const filaHTML = `
                <tr>
                    <td class="ps-4 fw-bold text-dark">${prod.nombre}</td>
                    <td>
                        <span class="badge ${badgeClass} bg-opacity-75 px-2 py-1">
                            <i class="bi ${iconClass} me-1"></i>${prod.categoria}
                        </span>
                    </td>
                    <td class="text-end fw-semibold text-success">${formatoPesos.format(prod.precio)}</td>
                    <td class="text-center pe-4">
                        <button class="btn btn-outline-warning btn-sm btn-accion me-1" onclick="editarProducto(${prod.id})" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm btn-accion" onclick="eliminarProducto(${prod.id})" title="Eliminar">
                            <i class="bi bi-trash3-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += filaHTML;
        });
    }

    // --- 5. Buscador en tiempo real ---
    buscador.addEventListener('input', (e) => {
        renderizarTabla(e.target.value);
    });

    // --- 6. Agregar / Actualizar Producto ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const idNuevo = inputId.value;
        const nombreNuevo = inputNombre.value;
        const catNueva = inputCategoria.value;
        const precioNuevo = parseInt(inputPrecio.value);

        if (idNuevo === "") {
            // CREAR NUEVO
            const nuevoProducto = {
                id: Date.now(),
                nombre: nombreNuevo,
                categoria: catNueva,
                precio: precioNuevo
            };
            inventario.unshift(nuevoProducto);
            alert("¡Ítem agregado con éxito a la carta!");
        } else {
            // EDITAR EXISTENTE
            const index = inventario.findIndex(p => p.id == idNuevo);
            if (index !== -1) {
                inventario[index].nombre = nombreNuevo;
                inventario[index].categoria = catNueva;
                inventario[index].precio = precioNuevo;
                alert("¡Ítem actualizado con éxito!");
            }
        }

        limpiarFormulario();
        renderizarTabla(buscador.value);
    });

    // --- 7. Editar Producto ---
    window.editarProducto = function(id) {
        const prod = inventario.find(p => p.id === id);
        if (prod) {
            inputId.value = prod.id;
            inputNombre.value = prod.nombre;
            inputCategoria.value = prod.categoria;
            inputPrecio.value = prod.precio;

            formTitulo.innerHTML = `<i class="bi bi-pencil-square text-warning me-2"></i>Editando Ítem`;
            document.getElementById('btn-guardar').classList.replace('btn-primary', 'btn-warning');
            document.getElementById('btn-guardar').textContent = "Guardar Cambios";
            btnCancelar.classList.remove('d-none');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // --- 8. Eliminar Producto ---
    window.eliminarProducto = function(id) {
        const prod = inventario.find(p => p.id === id);
        if (confirm(`¿Estás seguro de que deseas eliminar "${prod.nombre}"? Ya no aparecerá para la venta.`)) {
            inventario = inventario.filter(p => p.id !== id);
            renderizarTabla(buscador.value);
        }
    };

    // --- 9. Limpiar Formulario ---
    btnCancelar.addEventListener('click', limpiarFormulario);

    function limpiarFormulario() {
        form.reset();
        inputId.value = "";
        
        formTitulo.innerHTML = `<i class="bi bi-plus-circle text-primary me-2"></i>Agregar Nuevo Ítem`;
        document.getElementById('btn-guardar').classList.replace('btn-warning', 'btn-primary');
        document.getElementById('btn-guardar').textContent = "Guardar Ítem";
        btnCancelar.classList.add('d-none');
    }

    // --- 10. Carga Inicial ---
    renderizarTabla();

});