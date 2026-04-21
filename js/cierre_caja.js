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

    // --- 2. Datos Simulados ---
    
    // Lo que hay en la caja AHORA (En vivo)
    let cajaActual = {
        efectivo: 145000,
        tarjeta: 320000,
        transferencia: 85000,
        propinas: 55000
    };

    // Historial de días pasados
    let historialCierres = [
        { fecha: "20 Abr 2026, 23:45", efectivo: 120000, tarjeta: 280000, transferencia: 50000, propinas: 45000 },
        { fecha: "19 Abr 2026, 23:30", efectivo: 95000,  tarjeta: 310000, transferencia: 65000, propinas: 47000 },
        { fecha: "18 Abr 2026, 23:55", efectivo: 180000, tarjeta: 420000, transferencia: 90000, propinas: 69000 }
    ];

    // --- 3. Funciones de Renderizado ---

    function renderizarCajaActual() {
        const total = cajaActual.efectivo + cajaActual.tarjeta + cajaActual.transferencia;

        document.getElementById('actual-total').textContent = formatoPesos.format(total);
        document.getElementById('actual-efectivo').textContent = formatoPesos.format(cajaActual.efectivo);
        document.getElementById('actual-tarjeta').textContent = formatoPesos.format(cajaActual.tarjeta);
        document.getElementById('actual-transferencia').textContent = formatoPesos.format(cajaActual.transferencia);
        document.getElementById('actual-propinas').textContent = formatoPesos.format(cajaActual.propinas);
    }

    function renderizarHistorial() {
        const tbody = document.getElementById('historial-tbody');
        tbody.innerHTML = '';

        if (historialCierres.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No hay cierres registrados.</td></tr>`;
            return;
        }

        historialCierres.forEach(cierre => {
            const totalCierre = cierre.efectivo + cierre.tarjeta + cierre.transferencia;

            const rowHTML = `
                <tr>
                    <td class="ps-4 py-3 fw-bold text-dark">
                        <i class="bi bi-calendar-check text-success me-2"></i>${cierre.fecha}
                    </td>
                    <td class="text-center py-3 text-muted">${formatoPesos.format(cierre.efectivo)}</td>
                    <td class="text-center py-3 text-muted">${formatoPesos.format(cierre.tarjeta)}</td>
                    <td class="text-center py-3 text-muted">${formatoPesos.format(cierre.transferencia)}</td>
                    <td class="text-center py-3 text-secondary fw-semibold">${formatoPesos.format(cierre.propinas)}</td>
                    <td class="text-end py-3 pe-4 fw-bold text-primary fs-6">
                        ${formatoPesos.format(totalCierre)}
                    </td>
                </tr>
            `;
            tbody.innerHTML += rowHTML;
        });
    }

    // --- 4. Acción: Cerrar Caja ---
    const btnCerrarCaja = document.getElementById('btn-cerrar-caja');

    btnCerrarCaja.addEventListener('click', () => {
        // Verificar si hay dinero que cerrar
        const totalActual = cajaActual.efectivo + cajaActual.tarjeta + cajaActual.transferencia;
        
        if (totalActual === 0 && cajaActual.propinas === 0) {
            alert("La caja ya está en cero. No hay nada que cerrar.");
            return;
        }

        const confirmar = confirm(`¿Estás seguro de cerrar la caja actual?\n\nTotal a declarar: ${formatoPesos.format(totalActual)}\nPropinas: ${formatoPesos.format(cajaActual.propinas)}`);
        
        if (confirmar) {
            // Generar fecha y hora actual
            const ahora = new Date();
            const opciones = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' };
            const fechaString = ahora.toLocaleDateString('es-CL', opciones).replace(',', '');

            // Agregar al principio del historial
            historialCierres.unshift({
                fecha: fechaString,
                efectivo: cajaActual.efectivo,
                tarjeta: cajaActual.tarjeta,
                transferencia: cajaActual.transferencia,
                propinas: cajaActual.propinas
            });

            // Reiniciar caja actual a cero
            cajaActual = { efectivo: 0, tarjeta: 0, transferencia: 0, propinas: 0 };

            // Actualizar vista
            renderizarCajaActual();
            renderizarHistorial();
            
            alert("¡Caja cerrada exitosamente! El registro se ha guardado en el historial.");
        }
    });

    // --- 5. Carga Inicial ---
    renderizarCajaActual();
    renderizarHistorial();

});