// Portafolio de Smith Méndez
document.documentElement.classList.add('js');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Año del pie de página
document.getElementById('year').textContent = new Date().getFullYear();

// 2. Texto que se escribe solo
const frases = ['interfaces con React', 'proyectos en producción', 'código limpio con Git y GitHub'];
const typed = document.getElementById('typed');
if (reduce) {
  typed.textContent = frases[0];
} else {
  let f = 0, c = 0, borrando = false;
  (function escribir() {
    const frase = frases[f];
    typed.textContent = frase.slice(0, c);
    if (!borrando && c === frase.length) { borrando = true; return setTimeout(escribir, 1600); }
    if (borrando && c === 0) { borrando = false; f = (f + 1) % frases.length; }
    c += borrando ? -1 : 1;
    setTimeout(escribir, borrando ? 35 : 70);
  })();
}

// 3. Secciones que aparecen al hacer scroll
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduce) {
  const ver = new IntersectionObserver((items) => {
    items.forEach((i) => { if (i.isIntersecting) { i.target.classList.add('visible'); ver.unobserve(i.target); } });
  }, { threshold: 0.12 });
  reveals.forEach((r) => ver.observe(r));
} else {
  reveals.forEach((r) => r.classList.add('visible'));
}

// 4. Menú: marca la sección activa
const links = document.querySelectorAll('.menu a');
const secciones = [...links].map((a) => document.querySelector(a.getAttribute('href')));
if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver((items) => {
    items.forEach((i) => {
      if (i.isIntersecting) {
        links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + i.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secciones.forEach((s) => s && spy.observe(s));
}

// 5. Cabecera con borde al bajar y botón de volver arriba
const header = document.querySelector('.header');
const subir = document.getElementById('subir');
function alScroll() {
  header.classList.toggle('scrolled', window.scrollY > 20);
  subir.hidden = window.scrollY < 600;
}
window.addEventListener('scroll', alScroll, { passive: true });
alScroll();
subir.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

// 6. Formulario: contador, validación y envío por correo
const form = document.getElementById('form');
const estado = document.getElementById('estado');
const mensaje = document.getElementById('mensaje');
const contador = document.getElementById('contador');
mensaje.addEventListener('input', () => { contador.textContent = mensaje.value.length + ' / 500'; });

form.addEventListener('submit', (e) => {
  e.preventDefault();
  estado.className = 'status';
  if (mensaje.value.trim().length < 10) {
    estado.textContent = 'Escribe un mensaje de al menos 10 caracteres.';
    estado.classList.add('error');
    mensaje.focus();
    return;
  }
  const asunto = 'Contacto desde tu portafolio: ' + form.nombre.value.trim();
  const cuerpo = mensaje.value.trim() + '\n\n' + form.nombre.value.trim() + '\n' + form.correo.value.trim();
  window.location.href = 'mailto:Smithmendez098@gmail.com?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);
  estado.textContent = 'Se abrió tu aplicación de correo. Envía el mensaje desde ahí.';
  estado.classList.add('ok');
  form.reset();
  contador.textContent = '0 / 500';
});