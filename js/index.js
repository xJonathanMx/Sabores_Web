document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LÓGICA DEL MENÚ LATERAL (HAMBURGUESA)
    const hamburger = document.getElementById('hamburger');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        sideMenu.classList.toggle('open');
        overlay.classList.toggle('active');
    };

    if (hamburger && overlay) {
        hamburger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
    }

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.side-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            sideMenu.classList.remove('open');
            overlay.classList.remove('active');
        });
    });

    // 2. ANIMACIÓN "DESLIZAR Y ENFOCAR" (Todo a la vez)
    const animatables = document.querySelectorAll('section, .mesa-card');
    animatables.forEach((el) => {
        // Estado inicial: Abajo, invisible y borroso
        el.style.opacity = "0";
        el.style.filter = "blur(10px)";
        el.style.transform = "translateY(20px)"; 
        el.style.transition = "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

        // Se ejecuta casi al instante (50ms)
        setTimeout(() => {
            el.style.opacity = "1";
            el.style.filter = "blur(0px)";
            el.style.transform = "translateY(0)";
        }, 50);
    });

    // 3. LÓGICA DE CATEGORÍAS Y PLATOS
    const platosPorCategoria = {
        mariscos: ["Paila Marina", "Machas a la Parmesana", "Ceviche Reineta"],
        carnes: ["Lomo a lo Pobre", "Parrillada", "Costillar Cerdo"],
        bebidas: ["Pisco Sour", "Bebida 500ml", "Jugo Natural"]
    };

    const selectCategoria = document.getElementById('categoria');
    const selectPlatos = document.getElementById('platos');

    if(selectCategoria && selectPlatos) {
        selectCategoria.addEventListener('change', (e) => {
            const categoria = e.target.value;
            const platos = platosPorCategoria[categoria];
            
            selectPlatos.innerHTML = ''; // Limpiar platos actuales
            
            platos.forEach(plato => {
                const option = document.createElement('option');
                option.textContent = plato;
                selectPlatos.appendChild(option);
            });
        });
    }

    // 4. LÓGICA DEL SELECTOR DE CANTIDAD (+ / -)
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