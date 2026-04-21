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

    // --- 2. Formateador de Moneda ---
    const formatoPesos = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
    });

    // --- 3. Base de Datos Simulada para diferentes periodos ---
    // En un sistema real, harías una llamada a tu base de datos enviando las fechas.
    const baseDeDatosFalsa = {
        hoy: [
            { metodo: "Tarjeta de Débito", monto: 950000, transacciones: 65, icono: "bi-credit-card-fill", color: "primary" },
            { metodo: "Efectivo", monto: 420000, transacciones: 32, icono: "bi-cash-stack", color: "success" },
            { metodo: "Tarjeta de Crédito", monto: 380000, transacciones: 15, icono: "bi-credit-card-2-front-fill", color: "warning" },
            { metodo: "Transferencia", monto: 200000, transacciones: 10, icono: "bi-phone-vibrate-fill", color: "info" }
        ],
        mes: [
            { metodo: "Tarjeta de Débito", monto: 18500000, transacciones: 1450, icono: "bi-credit-card-fill", color: "primary" },
            { metodo: "Efectivo", monto: 6200000, transacciones: 890, icono: "bi-cash-stack", color: "success" },
            { metodo: "Tarjeta de Crédito", monto: 9800000, transacciones: 420, icono: "bi-credit-card-2-front-fill", color: "warning" },
            { metodo: "Transferencia", monto: 3100000, transacciones: 150, icono: "bi-phone-vibrate-fill", color: "info" }
        ],
        ano: [
            { metodo: "Tarjeta de Débito", monto: 215000000, transacciones: 15400, icono: "bi-credit-card-fill", color: "primary" },
            { metodo: "Efectivo", monto: 85000000, transacciones: 9800, icono: "bi-cash-stack", color: "success" },
            { metodo: "Tarjeta de Crédito", monto: 110000000, transacciones: 4900, icono: "bi-credit-card-2-front-fill", color: "warning" },
            { metodo: "Transferencia", monto: 25000000, transacciones: 1200, icono: "bi-phone-vibrate-fill", color: "info" }
        ]
    };

    // --- 4. Lógica de Filtros ---
    const selectRango = document.getElementById('filtro-rango');
    const inputsCustom = document.querySelectorAll('.date-custom');
    const btnFiltrar = document.getElementById('btn-filtrar');
    const textoPeriodo = document.getElementById('texto-periodo');

    // Mostrar/Ocultar campos de fecha si elige "Personalizado"
    selectRango.addEventListener('change', (e) => {
        if (e.target.value === 'custom') {
            inputsCustom.forEach(el => el.classList.remove('d-none'));
        } else {
            inputsCustom.forEach(el => el.classList.add('d-none'));
        }
    });

    // Acción al hacer clic en Aplicar Filtro
    btnFiltrar.addEventListener('click', () => {
        const seleccion = selectRango.value;
        
        let datosAUsar = [];
        let textoLabel = "";

        if (seleccion === 'custom') {
            const inicio = document.getElementById('fecha-inicio').value;
            const fin = document.getElementById('fecha-fin').value;
            if(!inicio || !fin) {
                alert("Por favor, selecciona ambas fechas.");
                return;
            }
            // Simulamos que al usar custom, trae los datos de 'mes' para rellenar
            datosAUsar = baseDeDatosFalsa.mes; 
            textoLabel = `Desde ${inicio} hasta ${fin}`;
        } else {
            datosAUsar = baseDeDatosFalsa[seleccion];
            textoLabel = selectRango.options[selectRango.selectedIndex].text;
        }

        textoPeriodo.innerHTML = `Mostrando datos de: <b>${textoLabel}</b>`;
        
        // Llamamos a la función que dibuja todo de nuevo
        renderizarReporte(datosAUsar);
    });

    // --- 5. Función Principal para Renderizar ---
    function renderizarReporte(datosOriginales) {
        // Clonar y ordenar de mayor a menor monto
        let datosPagos = [...datosOriginales].sort((a, b) => b.monto - a.monto);

        // Calcular Totales Generales
        const totalIngresos = datosPagos.reduce((sum, pago) => sum + pago.monto, 0);
        const totalTransacciones = datosPagos.reduce((sum, pago) => sum + pago.transacciones, 0);

        // Llenar los Globos Superiores
        if(datosPagos.length > 0) {
            const metodoTop = datosPagos[0];
            const porcentajeTop = Math.round((metodoTop.monto / totalIngresos) * 100);

            document.getElementById('total-ingresos').textContent = formatoPesos.format(totalIngresos);
            document.getElementById('total-transacciones').textContent = `${totalTransacciones} transacciones`;
            
            document.getElementById('top-metodo-name').textContent = metodoTop.metodo;
            document.getElementById('top-metodo-porcentaje').textContent = `Representa el ${porcentajeTop}% del ingreso`;
        }

        // Renderizar Tarjetas de Desglose
        const container = document.getElementById('metodos-container');
        container.innerHTML = ''; // Limpiar contenedor

        datosPagos.forEach(pago => {
            const porcentaje = Math.round((pago.monto / totalIngresos) * 100) || 0;

            const cardHTML = `
                <div class="col-12 col-md-6">
                    <div class="card border-0 shadow-sm rounded-4 p-4 h-100 highlight-card">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="d-flex align-items-center">
                                <div class="metodo-icon bg-${pago.color}-subtle text-${pago.color} me-3">
                                    <i class="bi ${pago.icono}"></i>
                                </div>
                                <div>
                                    <h5 class="fw-bold mb-0 text-dark">${pago.metodo}</h5>
                                    <small class="text-muted">${pago.transacciones} transacciones</small>
                                </div>
                            </div>
                            <div class="text-end">
                                <h5 class="fw-bold text-dark mb-0">${formatoPesos.format(pago.monto)}</h5>
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-between text-muted small mb-1">
                            <span>Participación</span>
                            <span class="fw-bold text-${pago.color}">${porcentaje}%</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-${pago.color}" 
                                 role="progressbar" 
                                 data-width="${porcentaje}%" 
                                 style="width: 0%;" 
                                 aria-valuenow="${porcentaje}" aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });

        // Animar las barras después de renderizar
        setTimeout(() => {
            const barras = document.querySelectorAll('.progress-bar');
            barras.forEach(barra => {
                barra.style.width = barra.getAttribute('data-width');
            });
        }, 50);
    }

    // --- 6. Carga inicial de la página (Por defecto "Hoy") ---
    renderizarReporte(baseDeDatosFalsa.hoy);

});