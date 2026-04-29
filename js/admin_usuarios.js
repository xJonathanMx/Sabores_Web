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

    // --- 2. Base de Datos Falsa (Usuarios) ---
    // Ajustado a solo Administrador o Garzón
    let equipo = [
        { id: 1, nombre: "Dueño Sabores", login: "admin", pass: "1234", rol: "Administrador" },
        { id: 2, nombre: "Carlos Soto", login: "carlos_s", pass: "5678", rol: "Garzón" },
        { id: 3, nombre: "María Paz", login: "mary_p", pass: "0000", rol: "Administrador" }, 
        { id: 4, nombre: "Jorge Lillo", login: "jorge_l", pass: "1111", rol: "Garzón" }
    ];

    // --- 3. Referencias al DOM ---
    const tbody = document.getElementById('tbody-usuarios');
    const contador = document.getElementById('contador-usuarios');
    const buscador = document.getElementById('buscador-tabla');
    
    const form = document.getElementById('form-usuario');
    const inputId = document.getElementById('usuario-id');
    const inputNombre = document.getElementById('usuario-nombre');
    const inputLogin = document.getElementById('usuario-login');
    const inputPass = document.getElementById('usuario-pass');
    const inputRol = document.getElementById('usuario-rol');
    
    const textoAyudaRol = document.getElementById('ayuda-rol');
    const btnCancelar = document.getElementById('btn-cancelar');
    const formTitulo = document.getElementById('form-titulo');

    // --- 4. Ayuda visual de Permisos ---
    inputRol.addEventListener('change', () => {
        const rol = inputRol.value;
        if(rol === "Administrador") {
            textoAyudaRol.innerHTML = "<span class='text-danger fw-bold'>Acceso Total:</span> Puede ver reportes, editar carta, cerrar caja y gestionar personal.";
        }
        if(rol === "Garzón") {
            textoAyudaRol.innerHTML = "<span class='text-success fw-bold'>Acceso Básico:</span> Solo puede usar la Venta Rápida y enviar comandas a cocina/barra.";
        }
    });

    // --- 5. Renderizar Tabla ---
    function renderizarTabla(filtro = "") {
        tbody.innerHTML = '';
        
        const datosAbarcar = equipo.filter(user => 
            user.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
            user.login.toLowerCase().includes(filtro.toLowerCase()) ||
            user.rol.toLowerCase().includes(filtro.toLowerCase())
        );

        contador.textContent = `${datosAbarcar.length} Usuarios`;

        if (datosAbarcar.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">No se encontró personal.</td></tr>`;
            return;
        }

        datosAbarcar.forEach(user => {
            // Colores por rol (Rojo para Admin, Verde para Garzón)
            let badgeClass = 'bg-secondary';
            if (user.rol === 'Administrador') badgeClass = 'bg-danger';
            if (user.rol === 'Garzón') badgeClass = 'bg-success';

            // Iniciales para el Avatar
            const iniciales = user.nombre.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();

            const filaHTML = `
                <tr>
                    <td class="ps-4 text-dark d-flex align-items-center">
                        <div class="avatar-circle shadow-sm">${iniciales}</div>
                        <div>
                            <span class="fw-bold d-block">${user.nombre}</span>
                        </div>
                    </td>
                    <td class="text-muted fw-semibold">@${user.login}</td>
                    <td><span class="badge ${badgeClass} px-3 py-2 rounded-pill shadow-sm">${user.rol}</span></td>
                    <td class="text-center pe-4">
                        <button class="btn btn-outline-warning btn-sm btn-accion me-1" onclick="editarUsuario(${user.id})" title="Editar Permisos">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm btn-accion" onclick="eliminarUsuario(${user.id})" title="Eliminar Acceso">
                            <i class="bi bi-person-x-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += filaHTML;
        });
    }

    // --- 6. Buscador ---
    buscador.addEventListener('input', (e) => {
        renderizarTabla(e.target.value);
    });

    // --- 7. Agregar / Actualizar Usuario ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const idNuevo = inputId.value;
        const nombreNuevo = inputNombre.value;
        const loginNuevo = inputLogin.value;
        const passNueva = inputPass.value;
        const rolNuevo = inputRol.value;

        if (idNuevo === "") {
            // Validar que el usuario no exista
            const existe = equipo.find(u => u.login === loginNuevo);
            if(existe) {
                alert("El nombre de usuario (Login) ya está en uso. Elige otro.");
                return;
            }

            const nuevoUser = {
                id: Date.now(),
                nombre: nombreNuevo,
                login: loginNuevo,
                pass: passNueva,
                rol: rolNuevo
            };
            equipo.push(nuevoUser);
            alert("¡Usuario creado con éxito! Ya puede iniciar sesión.");
        } else {
            const index = equipo.findIndex(u => u.id == idNuevo);
            if (index !== -1) {
                equipo[index].nombre = nombreNuevo;
                equipo[index].login = loginNuevo;
                if(passNueva !== "") equipo[index].pass = passNueva; // Solo actualiza si escribió algo
                equipo[index].rol = rolNuevo;
                alert("¡Permisos y datos actualizados!");
            }
        }

        limpiarFormulario();
        renderizarTabla(buscador.value);
    });

    // --- 8. Editar Usuario ---
    window.editarUsuario = function(id) {
        const user = equipo.find(u => u.id === id);
        if (user) {
            inputId.value = user.id;
            inputNombre.value = user.nombre;
            inputLogin.value = user.login;
            inputPass.value = user.pass; 
            inputRol.value = user.rol;
            
            // Disparar evento para actualizar el texto de ayuda
            inputRol.dispatchEvent(new Event('change')); 

            formTitulo.innerHTML = `<i class="bi bi-person-gear text-warning me-2"></i>Editando Usuario`;
            document.getElementById('btn-guardar').classList.replace('btn-primary', 'btn-warning');
            document.getElementById('btn-guardar').textContent = "Guardar Permisos";
            btnCancelar.classList.remove('d-none');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // --- 9. Eliminar Usuario ---
    window.eliminarUsuario = function(id) {
        const user = equipo.find(u => u.id === id);
        
        // Evitar que el Admin principal se borre por error
        if(user.login === 'admin') {
            alert("Acción denegada: No puedes eliminar al administrador principal del sistema.");
            return;
        }

        if (confirm(`¿Estás seguro de quitarle el acceso a ${user.nombre} (@${user.login})?\nYa no podrá entrar al sistema.`)) {
            equipo = equipo.filter(u => u.id !== id);
            renderizarTabla(buscador.value);
        }
    };

    // --- 10. Limpiar Formulario ---
    btnCancelar.addEventListener('click', limpiarFormulario);

    function limpiarFormulario() {
        form.reset();
        inputId.value = "";
        textoAyudaRol.innerHTML = "Selecciona un rol para ver sus permisos.";
        
        formTitulo.innerHTML = `<i class="bi bi-person-plus-fill text-primary me-2"></i>Nuevo Usuario`;
        document.getElementById('btn-guardar').classList.replace('btn-warning', 'btn-primary');
        document.getElementById('btn-guardar').textContent = "Guardar Usuario";
        btnCancelar.classList.add('d-none');
    }

    // --- Carga Inicial ---
    renderizarTabla();

});