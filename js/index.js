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
    // --- 3. Filtros de Mesas (Visual y Funcional) ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const mesas = document.querySelectorAll('.mesa-card'); // Capturamos todas las mesas

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 1. Cambiar la apariencia de los botones
            filterBtns.forEach(b => {
                b.classList.remove('btn-primary', 'active');
                b.classList.add('btn-outline-primary');
            });
            e.target.classList.remove('btn-outline-primary');
            e.target.classList.add('btn-primary', 'active');

            // 2. Lógica para filtrar las mesas
            const filtroSeleccionado = e.target.getAttribute('data-filter');

            mesas.forEach(mesa => {
                const categoriaMesa = mesa.getAttribute('data-category');
                
                // Si el botón es "all" o si la categoría de la mesa coincide con el botón
                if (filtroSeleccionado === 'all' || categoriaMesa === filtroSeleccionado) {
                    mesa.classList.remove('d-none'); // Quitamos la clase que oculta (mostramos la mesa)
                } else {
                    mesa.classList.add('d-none'); // Agregamos la clase de Bootstrap para ocultarla
                }
            });
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
    //eliminar mesa
    // --- 8. Guardar Comanda ---
    const btnGuardarComanda = document.getElementById('btn-guardar');
    
    btnGuardarComanda?.addEventListener('click', () => {
        // Validamos si hay productos en la tabla (opcional pero recomendado)
        const productosEnTabla = document.querySelectorAll('#detalle-productos tr');
        
        if (productosEnTabla.length === 0) {
            alert("⚠️ No puedes guardar una comanda vacía. Agrega productos primero.");
            return;
        }

        // Mostrar mensaje de éxito
        alert("✅ ¡La comanda se ha guardado correctamente!");
        
        // (Opcional) Aquí puedes limpiar la tabla y los inputs después de guardar
        // document.getElementById('detalle-productos').innerHTML = "";
    });

    // --- 9. Eliminar Mesa (Con motivo obligatorio) ---
    const btnEliminarMesa = document.getElementById('btn-eliminar-mesa');

    btnEliminarMesa?.addEventListener('click', () => {
        // Pedimos el motivo mediante un prompt
        const motivo = prompt("⚠️ Para eliminar la mesa, debes ingresar un motivo (Obligatorio):");

        // Verificamos si el usuario presionó cancelar (null) o si dejó el texto en blanco
        if (motivo === null || motivo.trim() === "") {
            alert("❌ Acción cancelada: Es obligatorio ingresar un motivo para eliminar la mesa.");
        } else {
            // Si hay un motivo válido, mostramos éxito
            alert(`🗑️ Mesa eliminada con éxito.\nMotivo registrado: "${motivo.trim()}"`);
            
            // Aquí iría tu lógica real para liberar la mesa en la base de datos
            // y quizás limpiar el panel de la comanda actual.
            document.getElementById('detalle-productos').innerHTML = "";
        }
    });

});