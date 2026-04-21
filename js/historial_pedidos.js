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
        document.querySelectorAll('.submenu-accordion').forEach(menu => menu.classList.remove('open'));
        document.querySelectorAll('.arrow').forEach(a => a.classList.remove('rotate'));
        if (!isOpen) {
            submenuReportes.classList.add('open');
            arrow?.classList.add('rotate');
        }
    });

    const formatoPesos = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

    // --- 2. Base de Datos Simulada MÁS DETALLADA ---
    const pedidosMock = [
        {
            id: "10550", fecha: "Hoy, 14:30", garzon: "Carlos Soto", estado: "completado", 
            tipoVenta: "Mesa 4", propina: 4500, totalCobrado: 49500,
            motivoAnulacion: null,
            platos: [
                { nombre: "Reineta a la plancha", cant: 2, subtotal: 24000 },
                { nombre: "Pisco Sour", cant: 2, subtotal: 9000 },
                { nombre: "Empanada Mariscos", cant: 4, subtotal: 12000 }
            ]
        },
        {
            id: "10551", fecha: "Hoy, 14:45", garzon: "María Paz", estado: "anulado", 
            tipoVenta: "Venta Rápida", propina: 0, totalCobrado: 15000,
            motivoAnulacion: "Cliente se arrepintió, mucha espera",
            platos: [
                { nombre: "Ceviche Mixto", cant: 1, subtotal: 15000 }
            ]
        },
        {
            id: "10552", fecha: "Hoy, 15:10", garzon: "Jorge Lillo", estado: "completado", 
            tipoVenta: "Venta Rápida", propina: 0, totalCobrado: 8500,
            motivoAnulacion: null,
            platos: [
                { nombre: "Churrasco Italiano", cant: 1, subtotal: 8500 }
            ]
        },
        {
            id: "10553", fecha: "Hoy, 16:00", garzon: "Carlos Soto", estado: "anulado", 
            tipoVenta: "Mesa 12", propina: 0, totalCobrado: 32000,
            motivoAnulacion: "Error al tomar pedido, se reingresó en ID 10554",
            platos: [
                { nombre: "Paila Marina", cant: 2, subtotal: 28000 },
                { nombre: "Bebida Express", cant: 2, subtotal: 4000 }
            ]
        }
    ];

    // Para el ejemplo, simulamos que 'hoy', 'mes' y 'ano' usan el mismo arreglo, 
    // pero en la vida real traerías datos distintos de la base de datos.
    const baseDeDatosFalsa = { hoy: pedidosMock, mes: pedidosMock, ano: pedidosMock };

    // --- 3. Filtros ---
    const selectRango = document.getElementById('filtro-rango');
    const selectEstado = document.getElementById('filtro-estado');
    const inputsCustom = document.querySelectorAll('.date-custom');
    const btnFiltrar = document.getElementById('btn-filtrar');
    const textoPeriodo = document.getElementById('texto-periodo');

    selectRango.addEventListener('change', (e) => {
        if (e.target.value === 'custom') {
            inputsCustom.forEach(el => el.classList.remove('d-none'));
        } else {
            inputsCustom.forEach(el => el.classList.add('d-none'));
        }
    });

    btnFiltrar.addEventListener('click', () => {
        const seleccionRango = selectRango.value;
        const seleccionEstado = selectEstado.value;
        
        // 1. Filtrar por fecha
        let datosAUsar = seleccionRango === 'custom' ? baseDeDatosFalsa.mes : baseDeDatosFalsa[seleccionRango];
        
        // 2. Filtrar por estado (Todos, Completado, Anulado)
        if (seleccionEstado !== 'todos') {
            datosAUsar = datosAUsar.filter(pedido => pedido.estado === seleccionEstado);
        }

        textoPeriodo.innerHTML = `Mostrando datos de: <b>${selectRango.options[selectRango.selectedIndex].text}</b>`;
        renderizarHistorial(datosAUsar);
    });

    // --- 4. Función de Renderizado (El Acordeón) ---
    function renderizarHistorial(pedidos) {
        const contenedor = document.getElementById('accordionPedidos');
        contenedor.innerHTML = '';

        if (pedidos.length === 0) {
            contenedor.innerHTML = `<div class="text-center text-muted my-5"><i class="bi bi-search fs-1"></i><p class="mt-2">No se encontraron pedidos con estos filtros.</p></div>`;
            return;
        }

        pedidos.forEach((pedido, index) => {
            const isAnulado = pedido.estado === 'anulado';
            const colorBorde = isAnulado ? 'border-anulado' : 'border-completado';
            const badgeEstado = isAnulado 
                ? `<span class="badge bg-danger bg-opacity-10 text-danger border border-danger-subtle ms-2">Anulado</span>`
                : `<span class="badge bg-success bg-opacity-10 text-success border border-success-subtle ms-2">Completado</span>`;

            const iconTipo = pedido.tipoVenta === 'Venta Rápida' ? 'bi-lightning-charge-fill text-warning' : 'bi-shop text-primary';

            // Generar lista de platos
            let listaPlatosHTML = '';
            let subtotalSinPropina = 0;
            pedido.platos.forEach(plato => {
                listaPlatosHTML += `
                    <div class="d-flex justify-content-between small border-bottom py-2">
                        <span>${plato.cant}x ${plato.nombre}</span>
                        <span class="text-muted">${formatoPesos.format(plato.subtotal)}</span>
                    </div>
                `;
                subtotalSinPropina += plato.subtotal;
            });

            // HTML del Acordeón
            const itemHTML = `
                <div class="accordion-item ${colorBorde}">
                    <h2 class="accordion-header" id="heading${pedido.id}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${pedido.id}" aria-expanded="false" aria-controls="collapse${pedido.id}">
                            <div class="d-flex justify-content-between align-items-center w-100 pe-3">
                                <div>
                                    <span class="fw-bold text-dark me-2">#${pedido.id}</span>
                                    <span class="text-muted small"><i class="bi bi-clock me-1"></i>${pedido.fecha}</span>
                                    ${badgeEstado}
                                </div>
                                <div class="text-end d-none d-md-block">
                                    <span class="fw-bold">${formatoPesos.format(pedido.totalCobrado)}</span>
                                </div>
                            </div>
                        </button>
                    </h2>
                    <div id="collapse${pedido.id}" class="accordion-collapse collapse" aria-labelledby="heading${pedido.id}" data-bs-parent="#accordionPedidos">
                        <div class="accordion-body">
                            
                            <div class="row g-4">
                                <div class="col-md-5 border-end">
                                    <h6 class="fw-bold mb-3 text-muted">Detalles de Atención</h6>
                                    <p class="mb-2 small"><i class="bi bi-person-badge text-primary me-2"></i><strong>Garzón:</strong> ${pedido.garzon}</p>
                                    <p class="mb-2 small"><i class="bi ${iconTipo} me-2"></i><strong>Tipo:</strong> ${pedido.tipoVenta}</p>
                                    
                                    ${isAnulado ? `
                                    <div class="alert alert-danger mt-3 py-2 px-3 small">
                                        <strong><i class="bi bi-exclamation-triangle me-1"></i> Motivo Anulación:</strong><br>
                                        ${pedido.motivoAnulacion}
                                    </div>` : ''}
                                </div>

                                <div class="col-md-7">
                                    <h6 class="fw-bold mb-3 text-muted">Recibo</h6>
                                    <div class="detalle-recibo">
                                        ${listaPlatosHTML}
                                        
                                        <div class="d-flex justify-content-between small mt-2">
                                            <span>Subtotal</span>
                                            <span>${formatoPesos.format(subtotalSinPropina)}</span>
                                        </div>
                                        <div class="d-flex justify-content-between small text-success">
                                            <span>Propina (Garzón)</span>
                                            <span>${formatoPesos.format(pedido.propina)}</span>
                                        </div>
                                        <div class="d-flex justify-content-between fw-bold mt-2 pt-2 border-top fs-6">
                                            <span>TOTAL COBRADO</span>
                                            <span class="${isAnulado ? 'text-decoration-line-through text-danger' : ''}">${formatoPesos.format(pedido.totalCobrado)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += itemHTML;
        });
    }

    // --- 5. Carga Inicial ---
    renderizarHistorial(baseDeDatosFalsa.hoy);

});