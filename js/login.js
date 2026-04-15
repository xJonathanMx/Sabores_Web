document.addEventListener("DOMContentLoaded", function() {
    // CORRECCIÓN: '.card' con punto para que reconozca la clase de Bootstrap
    const elements = document.querySelectorAll('.card, .logo_login, h5, .mb-3, .d-grid, .alert');
    
    elements.forEach((el, index) => {
        // Estado inicial
        el.style.opacity = "0";
        el.style.transform = "scale(0.8)"; // Empieza un poco más grande para un pop más elegante
        el.style.transition = "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
        
        setTimeout(() => {
            // Estado final
            el.style.opacity = "1";
            el.style.transform = "scale(1)";
        }, 150 * index); 
    });
});