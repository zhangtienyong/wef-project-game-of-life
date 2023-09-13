document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    let currentSectionIndex = 0; // Initialize the current section index
  
    // Navbar Click events
    navLinks.forEach((link, index) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
  
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
  
        if (targetSection) {
          scrollToSection(targetSection.offsetTop);
          updateActiveLink(index);
        }
      });
    });
  
    // Scroll to the next or previous section based on arrow key press
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (currentSectionIndex > 0) {
          currentSectionIndex--;
          scrollToSection(navLinks[currentSectionIndex].getAttribute('href'));
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (currentSectionIndex < navLinks.length - 1) {
          currentSectionIndex++;
          scrollToSection(navLinks[currentSectionIndex].getAttribute('href'));
        }
      }
    });
  
    // Helper function to scroll to a specific section
    function scrollToSection(offsetTop) {
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  
    // Helper function to update the active link in the navigation bar
    function updateActiveLink(index) {
      navLinks.forEach((navLink) => {
        navLink.classList.remove('active');
      });
  
      navLinks[index].classList.add('active');
    }

  });
