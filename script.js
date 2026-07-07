document.addEventListener('DOMContentLoaded', () => {
  // --- Navigation & Sticky Header ---
  const header = document.querySelector('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  // Add scrolled class when page is scrolled down
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check immediately on load

  // Mobile Menu Toggle
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu when clicking a link
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // --- Sobre Nosotros Slider / Carousel ---
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.querySelector('.slider-dots');
  const prevBtn = document.querySelector('.slider-control-prev');
  const nextBtn = document.querySelector('.slider-control-next');
  let currentSlide = 0;
  let slideInterval;
  const intervalTime = 6000; // 6 seconds

  // Create dot indicators
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    if (index === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Ir a la diapositiva ${index + 1}`);
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slider-dot');

  // Function to show a specific slide
  const showSlide = (n) => {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Wrap around index
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  };

  // Next slide
  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  // Previous slide
  const prevSlide = () => {
    showSlide(currentSlide - 1);
  };

  // Slide manual control listeners
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetTimer();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetTimer();
  });

  // Dot navigation click events
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetTimer();
    });
  });

  // Autoplay Slider Timer
  const startTimer = () => {
    slideInterval = setInterval(nextSlide, intervalTime);
  };

  const resetTimer = () => {
    clearInterval(slideInterval);
    startTimer();
  };

  // Start slider autoplay
  startTimer();

  // --- Active Nav Links on Scroll (Intersection Observer) ---
  const sections = document.querySelectorAll('section, .hero');
  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -40% 0px', // Adjusted margins for navigation offset
    threshold: 0.1
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));

  // --- Form Contact Redirection & WhatsApp Text filling ---
  const contactForm = document.getElementById('contactForm');
  const whatsappBtn = document.getElementById('whatsappBtn');

  // Handle standard form submit (simulated premium logic)
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('email').value;
      const company = document.getElementById('company').value;
      const message = document.getElementById('message').value;

      // Premium success micro-interaction
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      submitBtn.style.backgroundColor = 'var(--brand-green)';
      
      setTimeout(() => {
        submitBtn.textContent = '✓ Mensaje Enviado';
        
        // Custom popup or alert
        alert(`¡Gracias ${name}! Tu mensaje ha sido enviado exitosamente. Nos pondremos en contacto contigo en tu correo ${email} o teléfono ${phone} a la brevedad.`);
        
        contactForm.reset();
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = 'var(--brand-orange)';
        }, 3000);
      }, 1500);
    });
  }

  // Handle WhatsApp button click (fills text and redirects)
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      // Extract form values (if user has started typing, otherwise pre-fill a general message)
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const company = document.getElementById('company').value.trim();
      const message = document.getElementById('message').value.trim();
      
      let baseMessage = 'Hola Tradicom S.A., me gustaría recibir más información sobre sus servicios de transporte y logística.';
      
      if (name) {
        baseMessage = `Hola Tradicom S.A., mi nombre es ${name}.`;
        if (company) {
          baseMessage += ` Escribo en representación de la empresa ${company}.`;
        }
        if (message) {
          baseMessage += ` Mi consulta es la siguiente: ${message}`;
        } else {
          baseMessage += ` Me gustaría recibir información sobre sus servicios de transporte.`;
        }
      }
      
      // Target phone number: let's use a standard template. 
      // Replace with your real business number including country code (e.g. +57 for Colombia, +593 for Ecuador, etc.)
      // We will use a mock number 593999999999 (Tradicom representation)
      const businessPhone = '593999999999'; 
      const encodedText = encodeURIComponent(baseMessage);
      const waUrl = `https://wa.me/${businessPhone}?text=${encodedText}`;
      
      // Redirect in new window
      window.open(waUrl, '_blank');
    });
  }
});
