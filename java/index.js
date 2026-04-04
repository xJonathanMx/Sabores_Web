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