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

    // --- 2. Base de Datos Simulada Global (Dashboard) ---
    const dashboardData = {
        hoy: {
            ingresos: 850000, propinas: 85000, pedidos: 52,
            tendencia: { labels: ['12:00', '14:00', '16:00', '18:00', '20:00', '22:00'], data: [120000, 250000, 80000, 110000, 200000, 90000] },
            mediosPago: [300000, 450000, 100000], // Efectivo, Tarjeta, Transf
            topProductos: [
                { nombre: "Reineta frita con agregado", cant: 18, total: 162000 },
                { nombre: "Paila Marina", cant: 12, total: 168000 },
                { nombre: "Pisco Sour Tradicional", cant: 22, total: 99000 }
            ],
            topGarzones: [
                { nombre: "Carlos Soto", pedidos: 24, total: 420000 },
                { nombre: "María Paz", pedidos: 18, total: 280000 }
            ]
        },
        semana: {
            ingresos: 4200000, propinas: 410000, pedidos: 280,
            tendencia: { labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], data: [350000, 400000, 380000, 520000, 750000, 1100000, 700000] },
            mediosPago: [1200000, 2400000, 600000],
            topProductos: [
                { nombre: "Paila Marina Especial", cant: 65, total: 975000 },
                { nombre: "Chupe de Jaiba", cant: 48, total: 672000 },
                { nombre: "Empanadas Mariscos", cant: 120, total: 360000 }
            ],
            topGarzones: [
                { nombre: "Carlos Soto", pedidos: 110, total: 1800000 },
                { nombre: "María Paz", pedidos: 95, total: 1400000 },
                { nombre: "Jorge Lillo", pedidos: 75, total: 1000000 }
            ]
        },
        mes: {
            ingresos: 18500000, propinas: 1820000, pedidos: 1150,
            tendencia: { labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'], data: [4200000, 4800000, 3900000, 5600000] },
            mediosPago: [5500000, 10000000, 3000000],
            topProductos: [
                { nombre: "Paila Marina Especial", cant: 280, total: 4200000 },
                { nombre: "Ceviche Cobquecura", cant: 210, total: 3150000 },
                { nombre: "Reineta a la plancha", cant: 190, total: 2280000 },
                { nombre: "Pisco Sour Catedral", cant: 350, total: 2100000 },
                { nombre: "Empanada Queso", cant: 400, total: 1000000 }
            ],
            topGarzones: [
                { nombre: "Carlos Soto", pedidos: 450, total: 7500000 },
                { nombre: "Jorge Lillo", pedidos: 380, total: 6000000 },
                { nombre: "María Paz", pedidos: 320, total: 5000000 }
            ]
        },
        ano: {
            ingresos: 95000000, propinas: 9100000, pedidos: 6500,
            tendencia: { labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], data: [22000000, 25000000, 18000000, 12000000, 9000000, 9000000] },
            mediosPago: [25000000, 55000000, 15000000],
            topProductos: [
                { nombre: "Paila Marina Especial", cant: 1500, total: 22500000 },
                { nombre: "Empanada Mariscos", cant: 2800, total: 8400000 },
                { nombre: "Ceviche Mixto", cant: 1200, total: 16800000 }
            ],
            topGarzones: [
                { nombre: "Carlos Soto", pedidos: 2500, total: 38000000 },
                { nombre: "María Paz", pedidos: 2200, total: 32000000 }
            ]
        }
    };

    let chartEvolucionInstance = null;
    let chartMediosPagoInstance = null;

    // --- 3. Lógica de Filtros ---
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
        let datosAUsar;
        let textoLabel = "";

        if (seleccion === 'custom') {
            const inicio = document.getElementById('fecha-inicio').value;
            const fin = document.getElementById('fecha-fin').value;
            if(!inicio || !fin) {
                alert("Por favor, selecciona ambas fechas."); return;
            }
            datosAUsar = dashboardData.mes; // Simulamos con los datos del mes
            textoLabel = `Desde ${inicio} hasta ${fin}`;
        } else {
            datosAUsar = dashboardData[seleccion];
            textoLabel = selectRango.options[selectRango.selectedIndex].text;
        }

        textoPeriodo.innerHTML = `Mostrando datos de: <b>${textoLabel}</b>`;
        renderizarDashboard(datosAUsar);
    });

    // --- 4. Función de Renderizado Principal ---
    function renderizarDashboard(datos) {
        
        // 4.1. Actualizar KPIs Superiores
        const ticketPromedio = datos.pedidos > 0 ? (datos.ingresos / datos.pedidos) : 0;
        
        document.getElementById('kpi-ingresos').textContent = formatoPesos.format(datos.ingresos);
        document.getElementById('kpi-propinas').textContent = formatoPesos.format(datos.propinas);
        document.getElementById('kpi-pedidos').textContent = datos.pedidos;
        document.getElementById('kpi-ticket').textContent = formatoPesos.format(ticketPromedio);

        // 4.2. Actualizar Tablas Top
        const tbodyProd = document.getElementById('tbody-productos');
        tbodyProd.innerHTML = '';
        datos.topProductos.forEach((prod, i) => {
            const medalla = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
            tbodyProd.innerHTML += `
                <tr>
                    <td class="ps-4 fw-semibold text-dark">${medalla} ${prod.nombre}</td>
                    <td class="text-center"><span class="badge bg-light text-dark border">${prod.cant}</span></td>
                    <td class="text-end pe-4 text-success">${formatoPesos.format(prod.total)}</td>
                </tr>`;
        });

        const tbodyGarzones = document.getElementById('tbody-usuarios');
        tbodyGarzones.innerHTML = '';
        datos.topGarzones.forEach((user, i) => {
            tbodyGarzones.innerHTML += `
                <tr>
                    <td class="ps-4 fw-semibold text-dark">
                        <i class="bi bi-person-circle text-muted me-2"></i>${user.nombre}
                    </td>
                    <td class="text-center text-muted small">${user.pedidos} ord.</td>
                    <td class="text-end pe-4 fw-bold text-primary">${formatoPesos.format(user.total)}</td>
                </tr>`;
        });

        // 4.3. Dibujar Gráficos
        actualizarGraficos(datos);
    }

    // --- 5. Gráficos Chart.js ---
    function actualizarGraficos(datos) {
        if (chartEvolucionInstance) chartEvolucionInstance.destroy();
        if (chartMediosPagoInstance) chartMediosPagoInstance.destroy();

        // Gráfico de Evolución (Línea + Área)
        const ctxEv = document.getElementById('chartEvolucion').getContext('2d');
        
        // Crear gradiente para la línea
        let gradient = ctxEv.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(13, 110, 253, 0.2)');   
        gradient.addColorStop(1, 'rgba(13, 110, 253, 0)');

        chartEvolucionInstance = new Chart(ctxEv, {
            type: 'line',
            data: {
                labels: datos.tendencia.labels,
                datasets: [{
                    label: 'Ventas ($)',
                    data: datos.tendencia.data,
                    borderColor: '#0d6efd',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#0d6efd',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    fill: true,
                    tension: 0.4 // Hace la línea curva suave
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { borderDash: [5, 5] } },
                    x: { grid: { display: false } }
                }
            }
        });

        // Gráfico de Medios de Pago (Doughnut)
        const ctxMp = document.getElementById('chartMediosPago').getContext('2d');
        chartMediosPagoInstance = new Chart(ctxMp, {
            type: 'doughnut',
            data: {
                labels: ['Efectivo', 'Tarjeta', 'Transferencia'],
                datasets: [{
                    data: datos.mediosPago,
                    backgroundColor: ['#198754', '#0dcaf0', '#ffc107'],
                    borderWidth: 0,
                    hoverOffset: 5
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } }
                }
            }
        });
    }

    // --- 6. Carga Inicial (Mes actual por defecto) ---
    renderizarDashboard(dashboardData.mes);

});