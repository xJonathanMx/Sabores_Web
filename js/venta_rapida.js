// --- ESTADO DE LA VENTA (CARRITO) ---
let carrito = [];

// --- DATOS PARA EL BUSCADOR ---
// Lista plana basada en los options de tu HTML
const productosLista = [
    { nombre: "Tacos al Pastor", precio: 5000, categoria: "comida" },
    { nombre: "Enchiladas", precio: 4000, categoria: "comida" },
    { nombre: "Empanada de Pino", precio: 2500, categoria: "empanadas" },
    { nombre: "Bebida Lata 350cc", precio: 1500, categoria: "bebidas" }
];
function renderizarSelectProductos(filtroCategoria = "todas") {
    const select = document.getElementById('producto-select');
    // Limpiamos las opciones actuales
    select.innerHTML = '<option value="" selected disabled>Seleccione un producto...</option>';
    
    productosLista.forEach(p => {
        if (filtroCategoria === "todas" || p.categoria === filtroCategoria) {
            const option = document.createElement('option');
            option.value = p.nombre;
            option.setAttribute('data-precio', p.precio);
            option.textContent = `${p.nombre} - $${p.precio.toLocaleString('es-CL')}`;
            select.appendChild(option);
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    renderizarSelectProductos();

    // LÓGICA DE BOTONES DE CATEGORÍA
    const botonesCategoria = document.querySelectorAll('#contenedor-categorias .filter-btn');
    botonesCategoria.forEach(boton => {
        boton.addEventListener('click', (e) => {
            // 1. Quitar el estado activo (color sólido) de todos los botones
            botonesCategoria.forEach(b => {
                b.classList.remove('btn-primary', 'active');
                b.classList.add('btn-outline-primary');
            });
            
            // 2. Poner el estado activo al botón que se clickeó
            const btnSeleccionado = e.target;
            btnSeleccionado.classList.remove('btn-outline-primary');
            btnSeleccionado.classList.add('btn-primary', 'active');

            // 3. Filtrar los productos en el Select
            const categoria = btnSeleccionado.getAttribute('data-categoria');
            renderizarSelectProductos(categoria);
        });
    });
    // 1. Configuración del Menú Lateral (Hamburger)
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
     // =========================
    // ACORDEÓN PRO (solo uno abierto)
    // =========================
    const btnReportes = document.getElementById('btn-reportes');
    const submenuReportes = document.getElementById('submenu-reportes');
    const arrow = btnReportes.querySelector('.arrow');

    btnReportes.addEventListener('click', () => {

        const isOpen = submenuReportes.classList.contains('open');

        // Cerrar todos
        document.querySelectorAll('.submenu-accordion').forEach(menu => {
            menu.classList.remove('open');
        });

        document.querySelectorAll('.arrow').forEach(a => {
            a.classList.remove('rotate');
        });

        // Abrir solo si estaba cerrado
        if (!isOpen) {
            submenuReportes.classList.add('open');
            arrow.classList.add('rotate');
        }
        // Menú Lateral completo//
    });
    // 2. Configuración de los botones de Cantidad (+ y -)
    const inputCantidad = document.getElementById('input-cantidad');
    document.getElementById('btn-plus')?.addEventListener('click', () => {
        inputCantidad.value = parseInt(inputCantidad.value) + 1;
    });
    
    document.getElementById('btn-minus')?.addEventListener('click', () => {
        if (parseInt(inputCantidad.value) > 1) {
            inputCantidad.value = parseInt(inputCantidad.value) - 1;
        }
    });

    // 3. Botón Agregar Producto (Desde el Select tradicional)
    document.getElementById('btn-agregar').addEventListener('click', agregarProducto);

    // --- 4. LÓGICA DE LA LUPA (Buscador Rápido) ---
    const buscador = document.getElementById('buscador-producto');
    const listaSugerencias = document.getElementById('lista-sugerencias');

    if (buscador) {
        buscador.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            listaSugerencias.innerHTML = '';

            if (term.length < 1) {
                listaSugerencias.classList.add('d-none');
                return;
            }

            // Filtrar productos
            const filtrados = productosLista.filter(p => p.nombre.toLowerCase().includes(term));

            if (filtrados.length > 0) {
                filtrados.forEach(p => {
                    const li = document.createElement('li');
                    li.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center cursor-pointer";
                    li.style.cursor = "pointer";
                    li.innerHTML = `<span>${p.nombre}</span> <span class="badge bg-primary rounded-pill">$${p.precio.toLocaleString('es-CL')}</span>`;
                    
                    // Acción al hacer clic en una sugerencia
                    li.addEventListener('click', () => {
                        const cantidad = parseInt(inputCantidad.value);
                        const subtotal = p.precio * cantidad;

                        // Agregar directamente al arreglo del carrito
                        carrito.push({ nombre: p.nombre, cantidad: cantidad, precio: p.precio, subtotal: subtotal });

                        // Actualizar vista y resetear
                        renderizarTabla();
                        listaSugerencias.classList.add('d-none');
                        buscador.value = ''; // Limpiar el buscador
                        buscador.focus();
                        inputCantidad.value = 1; // Resetear cantidad a 1
                    });
                    
                    listaSugerencias.appendChild(li);
                });
                listaSugerencias.classList.remove('d-none');
            } else {
                listaSugerencias.classList.add('d-none');
            }
        });
    }

    // Cerrar buscador al hacer clic afuera
    document.addEventListener('click', (e) => {
        if (buscador && !buscador.contains(e.target) && !listaSugerencias.contains(e.target)) {
            listaSugerencias.classList.add('d-none');
        }
    });
});

// --- FUNCIONES DEL CARRITO ---

function agregarProducto() {
    const select = document.getElementById('producto-select');
    const opcionSeleccionada = select.options[select.selectedIndex];
    const cantidad = parseInt(document.getElementById('input-cantidad').value);

    // Validar que se haya seleccionado un producto
    if (!select.value) {
        alert("Por favor, selecciona un producto primero.");
        return;
    }

    const nombre = select.value;
    const precio = parseInt(opcionSeleccionada.getAttribute('data-precio'));
    const subtotal = precio * cantidad;

    // Agregar al array del carrito
    carrito.push({ nombre, cantidad, precio, subtotal });

    // Resetear los inputs después de agregar
    select.selectedIndex = 0;
    document.getElementById('input-cantidad').value = 1;

    // Actualizar la vista
    renderizarTabla();
}

function renderizarTabla() {
    const tbody = document.getElementById('tabla-body');
    tbody.innerHTML = ''; // Limpiar la tabla actual
    let total = 0;

    // Recorrer el carrito y crear las filas
    carrito.forEach((item, index) => {
        total += item.subtotal;

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="fw-medium">${item.nombre}</td>
            <td class="text-center">${item.cantidad}</td>
            <td class="text-end text-muted">$${item.precio.toLocaleString('es-CL')}</td>
            <td class="text-end fw-bold">$${item.subtotal.toLocaleString('es-CL')}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-danger border-0" onclick="eliminarProducto(${index})">
                    <i class="bi bi-x-lg"></i>
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });

    // Actualizar el texto del Total
    document.getElementById('total-text').textContent = `$${total.toLocaleString('es-CL')}`;
}

function eliminarProducto(index) {
    // Quita el elemento de la lista según su posición
    carrito.splice(index, 1);
    renderizarTabla();
}

// --- FUNCIONES DE LOS BOTONES DE ACCIÓN ---

function vaciarCuenta() {
    if(carrito.length === 0) return; // Si ya está vacío, no hacer nada

    if (confirm("¿Estás seguro de que deseas vaciar la cuenta?")) {
        carrito = [];
        renderizarTabla();
    }
}

function pagar() {
    if (carrito.length === 0) {
        alert("No hay productos en la cuenta para cobrar.");
        return;
    }

    // 1. Obtener el total actual
    const total = document.getElementById('total-text').textContent;
    
    // 2. Obtener qué método de pago está seleccionado (Efectivo, Débito, etc.)
    const metodoPagoSeleccionado = document.querySelector('input[name="metodoPago"]:checked').value;

    // 3. Confirmar con el usuario incluyendo el método de pago
    if (confirm(`¿Confirmar pago por ${total} usando ${metodoPagoSeleccionado}?`)) {
        
        alert(`¡Pago de ${total} con ${metodoPagoSeleccionado} procesado con éxito!`);
        
        // 4. Limpiar todo para el siguiente cliente
        carrito = [];
        renderizarTabla();
        
        // Volver a seleccionar "Efectivo" por defecto
        document.getElementById('pago-efectivo').checked = true;
    }
}