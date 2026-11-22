const wheel = document.querySelector('.dial-wheel');
const status = document.querySelector('.dial-status');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let busy = false;

async function dial(link) {
  if (busy) return;
  busy = true;
  wheel.classList.add('is-dialling');
  const label = link.querySelector('.dial-label').textContent;
  status.textContent = `Dialling ${label}…`;
  // Each hole rotates clockwise to the fixed stop at the lower right.
  const startAngle = parseFloat(link.style.getPropertyValue('--angle'));
  const rotation = ((135 - startAngle) % 360 + 360) % 360;
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  wheel.style.transform = `rotate(${rotation}deg)`;
  await delay(reduced.matches ? 0 : 750);
  status.textContent = `Connected · ${label}`;
  const target = document.querySelector(link.hash);
  if (target) {
    target.scrollIntoView({behavior:reduced.matches ? 'instant' : 'smooth',block:'start'});
    history.replaceState(null, '', link.hash);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex','-1');
    target.focus({preventScroll:true});
  }
  await delay(reduced.matches ? 0 : 450);
  wheel.style.transform = 'rotate(0deg)';
  await delay(reduced.matches ? 0 : 650);
  wheel.classList.remove('is-dialling');
  busy = false;
}
wheel.addEventListener('click', event => {
  const link = event.target.closest('[data-dial]');
  if (!link) return;
  event.preventDefault();
  dial(link);
});
wheel.addEventListener('dragstart', event => event.preventDefault());
