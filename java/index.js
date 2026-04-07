document.addEventListener('DOMContentLoaded', () => {
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

        document.querySelectorAll('.side-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                sideMenu.classList.remove('open');
                overlay.classList.remove('active');
            });
        });
        const animatables = document.querySelectorAll('section, .mesa-card');

    animatables.forEach((el, index) => {
        el.style.opacity = "0";
        el.style.transform = "scale(0.8)";
        el.style.transition = "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";

        setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "scale(1)";
        }, 100 * index); // Efecto cascada
    });
});
// Dentro de tu DOMContentLoaded
const platosPorCategoria = {
    mariscos: ["Paila Marina", "Machas a la Parmesana", "Ceviche Reineta"],
    carnes: ["Lomo a lo Pobre", "Parrillada", "Costillar Cerdo"],
    bebidas: ["Pisco Sour", "Bebida 500ml", "Jugo Natural"]
};

const selectCategoria = document.getElementById('categoria');
const selectPlatos = document.getElementById('platos');

if(selectCategoria) {
    selectCategoria.addEventListener('change', (e) => {
        const categoria = e.target.value;
        const platos = platosPorCategoria[categoria];
        
        // Limpiar platos actuales
        selectPlatos.innerHTML = '';
        
        // Agregar nuevos platos
        platos.forEach(plato => {
            const option = document.createElement('option');
            option.textContent = plato;
            selectPlatos.appendChild(option);
        });
    });
}
document.addEventListener("DOMContentLoaded", function() {
    // ... tu lógica de hamburguesa y animaciones ...

    const btnPlus = document.getElementById('btn-plus');
    const btnMinus = document.getElementById('btn-minus');
    const inputCantidad = document.getElementById('input-cantidad');

    if (btnPlus && btnMinus && inputCantidad) {
        btnPlus.addEventListener('click', () => {
            let currentVal = parseInt(inputCantidad.value);
            inputCantidad.value = currentVal + 1;
        });

        btnMinus.addEventListener('click', () => {
            let currentVal = parseInt(inputCantidad.value);
            if (currentVal > 1) { // Evita que baje de 1
                inputCantidad.value = currentVal - 1;
            }
        });
    }
});