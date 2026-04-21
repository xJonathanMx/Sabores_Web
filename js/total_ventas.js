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

    // --- 3. Base de Datos Simulada MÁS COHERENTE ---
    const baseDeDatosFalsa = {
        hoy: [
            { periodo: "12:00", pedidos: 15, total: 250000 },
            { periodo: "14:00", pedidos: 28, total: 480000 },
            { periodo: "16:00", pedidos: 10, total: 120000 },
            { periodo: "18:00", pedidos: 18, total: 310000 },
            { periodo: "20:00", pedidos: 35, total: 690000 },
            { periodo: "22:00", pedidos: 12, total: 180000 }
        ],
        // Ahora el mes muestra días específicos para mayor sentido cronológico
        mes: [
            { periodo: "01 Abr", pedidos: 42, total: 750000 },
            { periodo: "05 Abr", pedidos: 38, total: 610000 },
            { periodo: "10 Abr", pedidos: 55, total: 980000 },
            { periodo: "15 Abr", pedidos: 48, total: 820000 },
            { periodo: "20 Abr", pedidos: 60, total: 1100000 },
            { periodo: "25 Abr", pedidos: 45, total: 790000 }
        ],
        ano: [
            { periodo: "Ene", pedidos: 1800, total: 32000000 },
            { periodo: "Feb", pedidos: 2100, total: 38500000 },
            { periodo: "Mar", pedidos: 1500, total: 25000000 },
            { periodo: "Abr", pedidos: 800,  total: 14000000 }
        ]
    };

    // Variables globales para destruir y recrear gráficos
    let barChartInstance = null;
    let doughnutChartInstance = null;

    // --- 4. Lógica de Filtros ---
    const selectRango = document.getElementById('filtro-rango');
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
            datosAUsar = baseDeDatosFalsa.mes; // Simulamos con los datos del mes
            textoLabel = `Desde ${inicio} hasta ${fin}`;
        } else {
            datosAUsar = baseDeDatosFalsa[seleccion];
            textoLabel = selectRango.options[selectRango.selectedIndex].text;
        }

        textoPeriodo.innerHTML = `Mostrando datos de: <b>${textoLabel}</b>`;
        renderizarReporte(datosAUsar);
    });

    // --- 5. Función Principal ---
    function renderizarReporte(datosTendencia) {
        
        // 5.1 Calcular Totales
        const ingresosTotales = datosTendencia.reduce((sum, item) => sum + item.total, 0);
        const cantidadPedidos = datosTendencia.reduce((sum, item) => sum + item.pedidos, 0);
        const ticketPromedioGlobal = cantidadPedidos > 0 ? (ingresosTotales / cantidadPedidos) : 0;

        document.getElementById('total-ingresos').textContent = formatoPesos.format(ingresosTotales);
        document.getElementById('total-pedidos').textContent = cantidadPedidos;
        document.getElementById('ticket-promedio').textContent = formatoPesos.format(ticketPromedioGlobal);

        // 5.2 Preparar arreglos para Gráficos
        const labels = [];
        const dataIngresos = [];
        const dataPedidos = [];

        // 5.3 Renderizar Tabla
        const tbody = document.getElementById('tendencia-tbody');
        tbody.innerHTML = ''; 

        datosTendencia.forEach(fila => {
            labels.push(fila.periodo);
            dataIngresos.push(fila.total);
            dataPedidos.push(fila.pedidos);

            const ticketPromedioFila = fila.pedidos > 0 ? (fila.total / fila.pedidos) : 0;

            const rowHTML = `
                <tr>
                    <td class="ps-4 py-3 fw-bold text-dark">
                        <div class="d-flex align-items-center">
                            <div class="bg-light text-secondary rounded p-2 me-3">
                                <i class="bi bi-calendar-event"></i>
                            </div>
                            ${fila.periodo}
                        </div>
                    </td>
                    <td class="text-center py-3">
                        <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill border border-primary-subtle">
                            ${fila.pedidos} pedidos
                        </span>
                    </td>
                    <td class="text-center py-3 text-muted small">
                        ${formatoPesos.format(ticketPromedioFila)}
                    </td>
                    <td class="text-end py-3 pe-4 fw-bold text-success fs-6">
                        ${formatoPesos.format(fila.total)}
                    </td>
                </tr>
            `;
            tbody.innerHTML += rowHTML;
        });

        // 5.4 Dibujar Gráficos
        actualizarGraficos(labels, dataIngresos, dataPedidos);
    }

    // --- 6. Función para Gráficos (Chart.js) ---
    function actualizarGraficos(labels, dataIngresos, dataPedidos) {
        // Destruir instancias previas si existen para evitar sobreposición
        if (barChartInstance) barChartInstance.destroy();
        if (doughnutChartInstance) doughnutChartInstance.destroy();

        // Configuración Gráfico de Barras (Ingresos)
        const ctxBar = document.getElementById('barChart').getContext('2d');
        barChartInstance = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Ingresos Brutos ($)',
                    data: dataIngresos,
                    backgroundColor: '#0d6efd',
                    borderRadius: 6,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        grid: { borderDash: [5, 5] } 
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });

        // Configuración Gráfico Circular (Distribución de Pedidos)
        const ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');
        
        // Generar colores dinámicos según la cantidad de datos
        const colores = ['#0d6efd', '#198754', '#ffc107', '#0dcaf0', '#6f42c1', '#fd7e14'];

        doughnutChartInstance = new Chart(ctxDoughnut, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: dataPedidos,
                    backgroundColor: colores.slice(0, labels.length),
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 12, padding: 15, font: {size: 11} }
                    }
                }
            }
        });
    }

    // --- 7. Carga inicial ---
    renderizarReporte(baseDeDatosFalsa.hoy);

});