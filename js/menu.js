document.addEventListener("DOMContentLoaded", () => {
    const menuHTML = `
        <header class="header bg-white shadow-sm">
            <div class="container-fluid d-flex align-items-center py-2">
                <div class="hamburger me-3" id="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="logo h4 mb-0 text-primary fw-bold">
                    Sabores de Cobquecura
                </div>
            </div>
        </header>

        <aside class="side-menu shadow" id="sideMenu">
            <h2 class="h5 mb-4 text-primary">Secciones</h2>
            <nav class="nav flex-column">
                <a class="nav-link py-2" href="index.html">🏠 Inicio</a>
                <a class="nav-link py-2" href="#">👨‍🍳 Cocina</a>
                <a class="nav-link py-2" href="#">📦 Inventario</a>
                <a class="nav-link py-2" href="#">⚙️ Configuración</a>
            </nav>
        </aside>

        <div class="overlay" id="overlay"></div>
    `;

    document.getElementById("menu-container").innerHTML = menuHTML;

    // lógica del menú
    const hamburger = document.getElementById('hamburger');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        sideMenu.classList.toggle('open');
        overlay.classList.toggle('active');
    };

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
});