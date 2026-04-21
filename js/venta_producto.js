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

    // --- 2. Datos Simulados de Ventas ---
    const datosVentas = [
        { nombre: "Paila Marina", ventas: 145, categoria: "Mariscos" },
        { nombre: "Lomo a lo Pobre", ventas: 95, categoria: "Carnes" },
        { nombre: "Ceviche Reineta", ventas: 110, categoria: "Mariscos" },
        { nombre: "Pisco Sour", ventas: 85, categoria: "Bebidas" },
        { nombre: "Bebida 500ml", ventas: 50, categoria: "Bebidas" },
        { nombre: "Machas a la Parmesana", ventas: 40, categoria: "Mariscos" },
        { nombre: "Costillar Cerdo", ventas: 28, categoria: "Carnes" },
        { nombre: "Jugo Natural", ventas: 12, categoria: "Bebidas" }
    ];

    // --- 3. Procesamiento de Datos ---
    
    // Ordenar de mayor a menor ventas
    datosVentas.sort((a, b) => b.ventas - a.ventas);

    // Identificar Extremos
    const productoTop = datosVentas[0];
    const productoFlop = datosVentas[datosVentas.length - 1];
    const maxVentas = productoTop.ventas; // El valor máximo para calcular los porcentajes del 100%

    // Llenar los Globos (Tarjetas Superiores)
    document.getElementById('top-product-name').textContent = productoTop.nombre;
    document.getElementById('top-product-sales').innerHTML = `<b>${productoTop.ventas}</b> unidades vendidas`;
    
    document.getElementById('bottom-product-name').textContent = productoFlop.nombre;
    document.getElementById('bottom-product-sales').innerHTML = `<b>${productoFlop.ventas}</b> unidades vendidas`;

    document.getElementById('total-productos-badge').textContent = `${datosVentas.length} Productos`;

    // --- 4. Renderizar la Lista con Barras de Progreso ---
    const container = document.getElementById('ranking-container');
    container.innerHTML = '';

    datosVentas.forEach((producto, index) => {
        // Calcular porcentaje basado en el producto más vendido (que será el 100%)
        const porcentaje = Math.round((producto.ventas / maxVentas) * 100);
        
        // Determinar color de la barra (Verde > 60%, Amarillo > 30%, Rojo < 30%)
        let colorClass = 'bar-low';
        if (porcentaje >= 60) colorClass = 'bar-high';
        else if (porcentaje >= 30) colorClass = 'bar-medium';

        // Crear la fila
        const itemHTML = `
            <div class="product-item d-flex align-items-center mb-3">
                
                <div class="col-4 col-md-3 text-truncate pe-2">
                    <span class="text-muted fw-bold me-2">#${index + 1}</span> 
                    <span class="fw-semibold text-dark">${producto.nombre}</span>
                    <div class="small text-muted d-block d-md-none">${producto.ventas} ventas</div>
                </div>

                <div class="col-6 col-md-7 px-2">
                    <div class="progress shadow-sm">
                        <div class="progress-bar progress-bar-striped progress-bar-animated ${colorClass}" 
                             role="progressbar" 
                             data-width="${porcentaje}%" 
                             style="width: 0%;" 
                             aria-valuenow="${porcentaje}" aria-valuemin="0" aria-valuemax="100">
                        </div>
                    </div>
                </div>

                <div class="col-2 text-end d-none d-md-block fw-bold text-secondary">
                    ${producto.ventas} <span class="small fw-normal">u.</span>
                </div>
                
            </div>
        `;
        container.innerHTML += itemHTML;
    });

    // --- 5. Animación de las barras al cargar ---
    // Un pequeño timeout para que el navegador dibuje el HTML primero, y luego expanda las barras
    setTimeout(() => {
        const barras = document.querySelectorAll('.progress-bar');
        barras.forEach(barra => {
            const width = barra.getAttribute('data-width');
            barra.style.width = width;
        });
    }, 100);

});