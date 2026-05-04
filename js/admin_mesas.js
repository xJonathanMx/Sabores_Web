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

    // --- 3. Lógica de Base de Datos Simulada (LocalStorage) ---
    let mesasDB = JSON.parse(localStorage.getItem('mesas_restaurante')) || [];

    const formAgregarMesa = document.getElementById('form-agregar-mesa');
    const tbodyMesas = document.getElementById('lista-mesas-tabla');

    const nombresSectores = {
        'interior': 'Interior',
        'terraza-int': 'Terraza Interior',
        'terraza-ext': 'Terraza Exterior',
        'mi-mesa': 'Mis Mesas'
    };

    // Función para renderizar la tabla
    function renderizarMesas() {
        tbodyMesas.innerHTML = ""; 
        
        if (mesasDB.length === 0) {
            tbodyMesas.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No hay mesas registradas en el sistema.</td></tr>`;
            return;
        }

        // Ordenamos las mesas por número antes de mostrarlas
        mesasDB.sort((a, b) => parseInt(a.numero) - parseInt(b.numero));

        mesasDB.forEach((mesa, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="text-muted small">#10${mesa.numero}</td>
                <td class="fw-bold fs-6">Mesa ${mesa.numero}</td>
                <td><span class="badge bg-light text-dark border">${nombresSectores[mesa.sector]}</span></td>
                <td><span class="badge bg-success">Disponible</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarMesaDB(${index}, ${mesa.numero})" title="Eliminar Mesa">
                        🗑️ Eliminar
                    </button>
                </td>
            `;
            tbodyMesas.appendChild(tr);
        });
    }

    // --- 4. Guardar Mesa con Mensaje ---
    formAgregarMesa?.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const numero = document.getElementById('numero-mesa').value;
        const sector = document.getElementById('sector-mesa').value;

        const mesaExiste = mesasDB.some(m => m.numero === numero);
        if (mesaExiste) {
            alert("❌ Ya existe una mesa con ese número. Por favor, elige otro.");
            return;
        }

        const nuevaMesa = {
            numero: numero,
            sector: sector,
            estado: 'disponible'
        };

        mesasDB.push(nuevaMesa);
        localStorage.setItem('mesas_restaurante', JSON.stringify(mesasDB));

        formAgregarMesa.reset();
        renderizarMesas();
        
        // Mensaje de éxito al guardar
        alert(`✅ ¡La Mesa ${numero} se ha guardado correctamente en el sector ${nombresSectores[sector]}!`);
    });

    // --- 5. Eliminar Mesa con Motivo Obligatorio ---
    window.eliminarMesaDB = function(index, numeroMesa) {
        // Pedimos el motivo mediante un prompt
        const motivo = prompt(`⚠️ Vas a eliminar la Mesa ${numeroMesa}.\nPor favor, ingresa el motivo de la eliminación (Obligatorio):`);

        // Verificamos que el motivo no sea nulo ni esté vacío
        if (motivo === null || motivo.trim() === "") {
            alert("❌ Acción cancelada: Es obligatorio ingresar un motivo para eliminar una mesa del sistema.");
        } else {
            // Eliminamos la mesa
            mesasDB.splice(index, 1); 
            localStorage.setItem('mesas_restaurante', JSON.stringify(mesasDB)); 
            renderizarMesas(); 
            
            // Mensaje de éxito mostrando el motivo
            alert(`🗑️ La Mesa ${numeroMesa} ha sido eliminada con éxito.\nMotivo registrado: "${motivo.trim()}"`);
        }
    };

    // Render inicial
    renderizarMesas();
});