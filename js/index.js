document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DATOS Y ELEMENTOS ---
    const platosData = {
        mariscos: { "Paila Marina": 12500, "Machas a la Parmesana": 10500, "Ceviche Reineta": 9500 },
        carnes: { "Lomo a lo Pobre": 14000, "Parrillada": 25000, "Costillar Cerdo": 11000 },
        bebidas: { "Pisco Sour": 4500, "Bebida 500ml": 2000, "Jugo Natural": 3500 }
    };

    // Lista plana para el buscador (Lupa)
    const productosLista = [
        { nombre: "Paila Marina", precio: 12500 },
        { nombre: "Machas a la Parmesana", precio: 10500 },
        { nombre: "Ceviche Reineta", precio: 9500 },
        { nombre: "Lomo a lo Pobre", precio: 14000 },
        { nombre: "Parrillada", precio: 25000 },
        { nombre: "Costillar Cerdo", precio: 11000 },
        { nombre: "Pisco Sour", precio: 4500 },
        { nombre: "Bebida 500ml", precio: 2000 },
        { nombre: "Jugo Natural", precio: 3500 }
    ];

    const selectCategoria = document.getElementById('categoria');
    const selectPlatos = document.getElementById('platos');
    const inputCantidad = document.getElementById('input-cantidad');
    const tablaDetalle = document.getElementById('detalle-productos');
    const buscador = document.getElementById('buscador-producto');
    const listaSugerencias = document.getElementById('lista-sugerencias');
    const btnAgregar = document.querySelector('.comanda-form-side .btn-primary');

    // --- 2. FUNCIÓN UNIFICADA PARA AGREGAR (Mantiene tu formato de texto plano) ---
    function agregarATabla(nombre, precioUnitario) {
        const cantidad = parseInt(inputCantidad.value);
        const total = precioUnitario * cantidad;

        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
            <td>${cantidad}</td>
            <td>${nombre}</td>
            <td>$${total.toLocaleString('es-CL')}</td>
            <td><button class="btn btn-link btn-sm text-danger p-0 btn-eliminar">✕</button></td>
        `;

        nuevaFila.querySelector('.btn-eliminar').addEventListener('click', () => nuevaFila.remove());
        tablaDetalle.appendChild(nuevaFila);
        
        // Reset
        inputCantidad.value = 1;
        if(buscador) buscador.value = '';
    }

    // --- 3. LÓGICA DE SELECTORES (Tu forma original) ---
    if(selectCategoria && selectPlatos) {
        selectCategoria.addEventListener('change', (e) => {
            const categoria = e.target.value;
            const platos = Object.keys(platosData[categoria]);
            selectPlatos.innerHTML = ''; 
            platos.forEach(plato => {
                const option = document.createElement('option');
                option.textContent = plato;
                option.value = plato;
                selectPlatos.appendChild(option);
            });
        });
    }

    btnAgregar?.addEventListener('click', (e) => {
        e.preventDefault();
        const categoria = selectCategoria.value;
        const nombre = selectPlatos.value;
        const precio = platosData[categoria][nombre];
        agregarATabla(nombre, precio);
    });

    // --- 4. LÓGICA DE LA LUPA (Agregado instantáneo) ---
    if(buscador) {
        buscador.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            listaSugerencias.innerHTML = '';

            if (term.length < 1) {
                listaSugerencias.classList.add('d-none');
                return;
            }

            const filtrados = productosLista.filter(p => p.nombre.toLowerCase().includes(term));

            if (filtrados.length > 0) {
                filtrados.forEach(p => {
                    const li = document.createElement('li');
                    li.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center cursor-pointer";
                    li.style.cursor = "pointer";
                    li.innerHTML = `<span>${p.nombre}</span> <span class="badge bg-primary rounded-pill">$${p.precio.toLocaleString('es-CL')}</span>`;
                    
                    li.addEventListener('click', () => {
                        agregarATabla(p.nombre, p.precio);
                        listaSugerencias.classList.add('d-none');
                        buscador.focus();
                    });
                    listaSugerencias.appendChild(li);
                });
                listaSugerencias.classList.remove('d-none');
            } else {
                listaSugerencias.classList.add('d-none');
            }
        });
    }

    // --- 5. EXTRAS (Cerrar buscador, Cantidad, Menú) ---
    document.addEventListener('click', (e) => {
        if (buscador && !buscador.contains(e.target) && !listaSugerencias.contains(e.target)) {
            listaSugerencias.classList.add('d-none');
        }
    });

    document.getElementById('btn-plus')?.addEventListener('click', () => inputCantidad.value = parseInt(inputCantidad.value) + 1);
    document.getElementById('btn-minus')?.addEventListener('click', () => {
        if (parseInt(inputCantidad.value) > 1) inputCantidad.value = parseInt(inputCantidad.value) - 1;
    });

    // Menú Lateral completo//
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
    });
// Menú Lateral completo//

});

// --- 5. FUNCIÓN DE IMPRESIÓN DE PRE-CUENTA ---
const btnImprimir = document.querySelector('.bi-printer').parentElement; // Selecciona el botón de imprimir

btnImprimir?.addEventListener('click', (e) => {
    e.preventDefault();

    const filas = tablaDetalle.querySelectorAll('tr');
    if (filas.length === 0) {
        alert("No hay productos en la comanda para imprimir.");
        return;
    }

    const mesaInfo = document.getElementById('mesa-selected').textContent;
    let subtotal = 0;
    let detalleHtml = '';

    // Recorrer la tabla para obtener productos y calcular subtotal
    filas.forEach(fila => {
        const celdas = fila.querySelectorAll('td');
        const cantidad = celdas[0].textContent;
        const nombre = celdas[1].textContent;
        const totalTexto = celdas[2].textContent.replace('$', '').replace(/\./g, '');
        const totalNumerico = parseInt(totalTexto);

        subtotal += totalNumerico;

        detalleHtml += `
            <tr>
                <td>${cantidad} x ${nombre}</td>
                <td style="text-align: right;">$${totalNumerico.toLocaleString('es-CL')}</td>
            </tr>
        `;
    });

    const propina = Math.round(subtotal * 0.10);
    const totalFinal = subtotal + propina;

    // Crear ventana de impresión
    const ventanaImpresion = window.open('', '', 'width=400,height=600');
    
    ventanaImpresion.document.write(`
        <html>
        <head>
            <title>Pre-cuenta - Sabores de Cobquecura</title>
            <style>
                body { font-family: 'Courier New', Courier, monospace; font-size: 14px; padding: 20px; }
                .text-center { text-align: center; }
                .divider { border-top: 1px dashed #000; margin: 10px 0; }
                table { width: 100%; border-collapse: collapse; }
                .bold { font-weight: bold; }
                .total-section { margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="text-center">
                <h2 style="margin-bottom: 5px;">SABORES DE COBQUECURA</h2>
                <p style="margin: 0;">Pre-Cuenta de Consumo</p>
                <p style="margin: 0;">${new Date().toLocaleString()}</p>
                <p class="bold">${mesaInfo}</p>
            </div>
            
            <div class="divider"></div>
            
            <table>
                <thead>
                    <tr>
                        <th style="text-align: left;">Detalle</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${detalleHtml}
                </tbody>
            </table>
            
            <div class="divider"></div>
            
            <div class="total-section">
                <table style="width: 100%;">
                    <tr>
                        <td>SUBTOTAL:</td>
                        <td style="text-align: right;">$${subtotal.toLocaleString('es-CL')}</td>
                    </tr>
                    <tr>
                        <td>PROPINA SUGERIDA (10%):</td>
                        <td style="text-align: right;">$${propina.toLocaleString('es-CL')}</td>
                    </tr>
                    <tr class="bold" style="font-size: 16px;">
                        <td>TOTAL A PAGAR:</td>
                        <td style="text-align: right;">$${totalFinal.toLocaleString('es-CL')}</td>
                    </tr>
                </table>
            </div>
            
            <div class="divider"></div>
            <div class="text-center" style="margin-top: 20px;">
                <p>*** Gracias por su visita ***</p>
            </div>

            <script>
                window.onload = function() {
                    window.print();
                    window.close();
                };
            </script>
        </body>
        </html>
    `);

    ventanaImpresion.document.close();
});