document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Lógica del Menú Lateral y Overlay ---
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

    // --- 2. Acordeón de Reportes ---
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

    // --- 3. Filtros de Mesas (Visual) ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Quitar clase active de todos
            filterBtns.forEach(b => {
                b.classList.remove('btn-primary', 'active');
                b.classList.add('btn-outline-primary');
            });
            // Activar el presionado
            e.target.classList.remove('btn-outline-primary');
            e.target.classList.add('btn-primary', 'active');
        });
    });

    // --- 4. Selector de Cantidad (+ / -) ---
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const inputCantidad = document.getElementById('input-cantidad');

    btnMinus?.addEventListener('click', () => {
        let actual = parseInt(inputCantidad.value) || 1;
        if (actual > 1) {
            inputCantidad.value = actual - 1;
        }
    });

    btnPlus?.addEventListener('click', () => {
        let actual = parseInt(inputCantidad.value) || 1;
        inputCantidad.value = actual + 1;
    });

    // --- 5. Base de Datos Falsa de Precios ---
    // Como no tenemos base de datos, simulamos los precios de los platos del select
    const preciosPlatos = {
        "Paila marina": 8500,
        "Lomo a lo Pobre": 12000,
        "Pisco Sour": 4500
    };

    // --- 6. Agregar a la Comanda con Notas ---
    const btnAgregar = document.getElementById('btn-agregar');
    const tbodyComanda = document.getElementById('detalle-productos');

    btnAgregar?.addEventListener('click', () => {
        const cantidad = parseInt(inputCantidad.value) || 1;
        const selectPlatos = document.getElementById('platos');
        const plato = selectPlatos.value;
        const notaInicial = document.getElementById('notas-cocina').value.trim();
        
        // Obtener el precio (si no existe en nuestro objeto falso, usamos 5000 por defecto)
        const precio = preciosPlatos[plato] || 5000; 

        agregarFilaComanda(cantidad, plato, precio, notaInicial);

        // Resetear controles después de agregar
        inputCantidad.value = 1;
        document.getElementById('notas-cocina').value = "";
    });

    function agregarFilaComanda(cantidad, nombre, precio, nota) {
        const tr = document.createElement('tr');
        
        // Generamos un ID único para la nota
        const filaId = 'plato-' + Date.now();
        tr.id = filaId;

        const total = cantidad * precio;

        // Construimos la fila con el botón de nota incluido
        tr.innerHTML = `
            <td class="fw-bold">${cantidad}</td>
            <td>
                <div class="d-flex flex-column">
                    <span class="fw-semibold">${nombre}</span>
                    <small class="text-danger fst-italic texto-nota" id="nota-${filaId}">
                        ${nota ? '👉 ' + nota : ''}
                    </small>
                </div>
            </td>
            <td>$${total.toLocaleString('es-CL')}</td>
            <td class="text-end text-nowrap">
                <button class="btn btn-sm btn-outline-warning p-1 me-1" onclick="editarNotaPlato('${filaId}')" title="Nota del plato">
                    <i class="bi bi-pencil-square">Nota</i>
                </button>
                <button class="btn btn-sm btn-outline-danger p-1" onclick="eliminarFila(this)" title="Eliminar plato">
                    ×
                </button>
            </td>
        `;
        
        tbodyComanda.appendChild(tr);
    }

    // --- 7. Funciones Globales para los Botones de la Tabla ---
    // Deben ir en window. para que los botones en el HTML (onclick) puedan encontrarlas

    window.editarNotaPlato = function(filaId) {
        const spanNota = document.getElementById(`nota-${filaId}`);
        
        // Extraemos el texto limpio (quitando el emoji de la flecha si existe)
        let notaActual = spanNota.innerText.replace('👉 ', '').trim();
        
        const nuevaNota = prompt("Ingresa las especificaciones para este plato (Ej: A la plancha, puré picante, sin sal):", notaActual);
        
        if (nuevaNota !== null) { 
            if (nuevaNota.trim() === "") {
                spanNota.innerText = ""; 
            } else {
                spanNota.innerText = "👉 " + nuevaNota.trim(); 
            }
        }
    };

    window.eliminarFila = function(boton) {
        const fila = boton.closest('tr');
        fila.remove();
    };

});