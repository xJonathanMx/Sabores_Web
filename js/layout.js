document.addEventListener('DOMContentLoaded', () => {

    // MENU HAMBURGUESA
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

    // ACORDEÓN PRO (solo uno abierto)
    const btnReportes = document.getElementById('btn-reportes');
    const submenuReportes = document.getElementById('submenu-reportes');
    const arrow = btnReportes?.querySelector('.arrow');

    btnReportes?.addEventListener('click', () => {

        const isOpen = submenuReportes.classList.contains('open');

        // cerrar todos
        document.querySelectorAll('.submenu-accordion').forEach(menu => {
            menu.classList.remove('open');
        });

        document.querySelectorAll('.arrow').forEach(a => {
            a.classList.remove('rotate');
        });

        // abrir si estaba cerrado
        if (!isOpen) {
            submenuReportes.classList.add('open');
            arrow.classList.add('rotate');
        }
    });

});