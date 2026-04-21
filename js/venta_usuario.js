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
    const baseDeDatosFalsa = {
        hoy: [
            { id: 1, nombre: "Carlos Soto", mesas: 24, ventas: 450000, propina: 45000, color: "#0d6efd" },
            { id: 2, nombre: "María Paz", mesas: 31, ventas: 580000, propina: 58000, color: "#198754" },
            { id: 3, nombre: "Jorge Lillo", mesas: 18, ventas: 320000, propina: 32000, color: "#fd7e14" },
            { id: 4, nombre: "Ana Morales", mesas: 20, ventas: 390000, propina: 39000, color: "#6f42c1" },
            { id: 5, nombre: "Luis Sepúlveda", mesas: 12, ventas: 210000, propina: 21000, color: "#dc3545" }
        ],
        mes: [
            { id: 2, nombre: "María Paz", mesas: 580, ventas: 12400000, propina: 1240000, color: "#198754" },
            { id: 1, nombre: "Carlos Soto", mesas: 510, ventas: 9800000, propina: 980000, color: "#0d6efd" },
            { id: 4, nombre: "Ana Morales", mesas: 460, ventas: 8900000, propina: 890000, color: "#6f42c1" },
            { id: 3, nombre: "Jorge Lillo", mesas: 390, ventas: 7100000, propina: 710000, color: "#fd7e14" },
            { id: 5, nombre: "Luis Sepúlveda", mesas: 280, ventas: 4500000, propina: 450000, color: "#dc3545" }
        ],
        ano: [
            { id: 1, nombre: "Carlos Soto", mesas: 5200, ventas: 110500000, propina: 11050000, color: "#0d6efd" },
            { id: 2, nombre: "María Paz", mesas: 4900, ventas: 98400000, propina: 9840000, color: "#198754" },
            { id: 4, nombre: "Ana Morales", mesas: 4500, ventas: 89000000, propina: 8900000, color: "#6f42c1" },
            { id: 3, nombre: "Jorge Lillo", mesas: 4100, ventas: 75000000, propina: 7500000, color: "#fd7e14" },
            { id: 5, nombre: "Luis Sepúlveda", mesas: 3100, ventas: 54000000, propina: 5400000, color: "#dc3545" }
        ]
    };

    // --- 4. Lógica de Filtros ---
    const selectRango = document.getElementById('filtro-rango');
    const inputsCustom = document.querySelectorAll('.date-custom');
    const btnFiltrar = document.getElementById('btn-filtrar');
    const textoPeriodo = document.getElementById('texto-periodo');

    // Mostrar/Ocultar campos de fecha
    selectRango.addEventListener('change', (e) => {
        if (e.target.value === 'custom') {
            inputsCustom.forEach(el => el.classList.remove('d-none'));
        } else {
            inputsCustom.forEach(el => el.classList.add('d-none'));
        }
    });

    // Evento Click en Aplicar Filtro
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
            // Simulamos datos para el rango personalizado usando los del "mes"
            datosAUsar = baseDeDatosFalsa.mes; 
            textoLabel = `Desde ${inicio} hasta ${fin}`;
        } else {
            datosAUsar = baseDeDatosFalsa[seleccion];
            textoLabel = selectRango.options[selectRango.selectedIndex].text;
        }

        textoPeriodo.innerHTML = `Mostrando datos de: <b>${textoLabel}</b>`;
        
        // Llamada a la función que actualiza la pantalla
        renderizarReporte(datosAUsar);
    });


    // --- 5. Función Principal para Dibujar los Datos ---
    function renderizarReporte(datosOriginales) {
        // Clonar y ordenar de mayor a menor propina/venta
        let datosGarzones = [...datosOriginales].sort((a, b) => b.ventas - a.ventas);

        if (datosGarzones.length > 0) {
            // Calcular el total de propinas del periodo
            const totalPropinas = datosGarzones.reduce((sum, garzon) => sum + garzon.propina, 0);

            // Identificar al Garzón Estrella (el primero tras ordenar)
            const garzonTop = datosGarzones[0];

            // Actualizar Globos Superiores
            document.getElementById('top-garzon-name').textContent = garzonTop.nombre;
            document.getElementById('top-garzon-sales').textContent = `${formatoPesos.format(garzonTop.ventas)} generados`;
            document.getElementById('total-propinas').textContent = formatoPesos.format(totalPropinas);
        }

        // Renderizar la Tabla
        const tbody = document.getElementById('usuarios-tbody');
        tbody.innerHTML = ''; // Limpiar tabla anterior

        datosGarzones.forEach(garzon => {
            // Obtener iniciales para el avatar (Ej: Carlos Soto -> CS)
            const iniciales = garzon.nombre.split(' ').map(n => n[0]).join('').substring(0, 2);

            const rowHTML = `
                <tr>
                    <td class="ps-4 py-3">
                        <div class="d-flex align-items-center">
                            <div class="avatar-circle me-3 shadow-sm" style="background-color: ${garzon.color};">
                                ${iniciales}
                            </div>
                            <div>
                                <div class="fw-bold text-dark">${garzon.nombre}</div>
                                <div class="small text-muted">ID: #00${garzon.id}</div>
                            </div>
                        </div>
                    </td>
                    <td class="text-center py-3">
                        <span class="badge bg-secondary rounded-pill fs-6">${garzon.mesas}</span>
                    </td>
                    <td class="text-end py-3 fw-semibold text-secondary">
                        ${formatoPesos.format(garzon.ventas)}
                    </td>
                    <td class="text-end pe-4 py-3">
                        <span class="propina-highlight d-inline-block">
                            ${formatoPesos.format(garzon.propina)}
                        </span>
                    </td>
                </tr>
            `;
            tbody.innerHTML += rowHTML;
        });
    }

    // --- 6. Carga inicial de la página (Por defecto "Hoy") ---
    renderizarReporte(baseDeDatosFalsa.hoy);

});