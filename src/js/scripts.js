// Burger menu toggle
const burgerMenu = document.querySelector('#burger-menu');
const navLinks = document.querySelector('#nav-links');

// Animate mobile nav-links when opening/closing
burgerMenu.addEventListener('click', () => {
    // Remove transition if not present
    navLinks.style.transition = 'height 0.3s ease';

    if (navLinks.classList.contains('h-0')) {
        // Set initial height to 0px for animation
        navLinks.style.height = '0px';
        // Force reflow to apply the height
        void navLinks.offsetWidth;
        navLinks.classList.remove('h-0');
        // Set height to scrollHeight for animation
        navLinks.style.height = navLinks.scrollHeight + 'px';
        // After animation, remove inline height to allow responsive resizing
        setTimeout(() => {
            navLinks.style.height = '';
        }, 300);
    } else {
        // Set current height before collapsing
        navLinks.style.height = navLinks.scrollHeight + 'px';
        // Force reflow to apply the height before collapsing
        void navLinks.offsetWidth;
        navLinks.style.height = '0px';
        // After animation, add h-0 class and remove inline height
        setTimeout(() => {
            navLinks.classList.add('h-0');
            navLinks.style.height = '';
        }, 300);
    }
});

//Copyright year
const copyright = document.querySelector('#copyright_year')
copyright.textContent = new Date().getFullYear()

//Navbar highlight when scrolling
const sections = ['projects', 'about', 'skills', 'contact'];
const navLinksList = document.querySelectorAll('#nav-links li');

function highlightNav() {
    let scrollPos = window.scrollY + 80; // Offset for fixed navbar
    let found = false;
    sections.forEach((id, idx) => {
        const section = document.getElementById(id);
        if (section) {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                navLinksList.forEach(link => link.classList.remove('text-accent', 'font-bold'));
                navLinksList[idx].classList.add('bg-accent');
                navLinksList[idx].classList.remove('bg-primary-700');
                found = true;
            }else {
                navLinksList[idx].classList.remove('bg-accent');
                navLinksList[idx].classList.add('bg-primary-700');
            }
        }
    });
    if (!found) {
        navLinksList.forEach(link => link.classList.remove('text-accent', 'font-bold'));
    }
}

window.addEventListener('scroll', highlightNav);
window.addEventListener('load', highlightNav);

//Close nav when an element is clicked
navLinksList.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 768) { // Adjust breakpoint as needed
            navLinks.classList.add('h-0');
        }
    });
});

//Copy email button
document.addEventListener('DOMContentLoaded', function() {
    const copyBtn = document.getElementById('copy-email');
    if (copyBtn) {
    copyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        navigator.clipboard.writeText('yahiradrian7948@gmail.com').then(() => {
        // Create tooltip if not exists
        let tooltip = document.getElementById('copy-tooltip');
        tooltip.classList.toggle('hidden')
        setTimeout(() => {
            tooltip.classList.toggle('hidden')
        }, 1200);
        });
    });
    }
});