document.addEventListener('DOMContentLoaded', () => {
    const placeholder = document.getElementById('navbar-placeholder');

    // 1. Cargar el contenido de navbar.html
    fetch('../html/navbar.html') 
        .then(response => response.text())
        .then(data => {
            placeholder.innerHTML = data;
            
            // 2. Una vez que el HTML existe en la página, activamos el botón
            activarLogicaMenu();
        })
        .catch(error => console.error('Error cargando el navbar:', error));
});

function activarLogicaMenu() {
    const hamburger = document.getElementById('hamburger');
    const sideMenu = document.getElementById('sideMenu');
    
    // Si no tienes el overlay en el navbar.html, podrías crearlo aquí o agregarlo allá
    let overlay = document.getElementById('overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
    }

    const toggleMenu = () => {
        hamburger?.classList.toggle('active');
        sideMenu?.classList.toggle('open');
        overlay?.classList.toggle('active');
    };

    hamburger?.addEventListener('click', toggleMenu);
    overlay?.addEventListener('click', toggleMenu);
}