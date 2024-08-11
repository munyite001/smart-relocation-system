// Select the elements
const openMobileMenu = document.querySelector('.open-mobile');
const closeMobileMenu = document.querySelector('.close-mobile');
const mobileMenu = document.querySelector('.mobile-menu');

// Add event listener for opening the mobile menu
openMobileMenu.addEventListener('click', () => {
    mobileMenu.classList.add('show');
});

// Add event listener for closing the mobile menu
closeMobileMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('show');
});
