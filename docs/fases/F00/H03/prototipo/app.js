const listings = [
  { id: 1, name: 'Patio de las Moras', place: 'Centro de Tunja · ejemplo', price: 680000, kind: 'private', features: ['Amoblada', 'Baño privado'], available: 'Disponible', pin: '1' },
  { id: 2, name: 'Luz de la mañana', place: 'Sector universitario · ejemplo', price: 740000, kind: 'private', features: ['Escritorio', 'Wi-Fi incluido'], available: 'Disponible', pin: '2' },
  { id: 3, name: 'La Casa del Arrayán · habitación 1', property: 'La Casa del Arrayán', place: 'Tunja · ubicación de ejemplo', price: 820000, kind: 'shared', roomFeatures: ['Ambiente tranquilo'], features: ['Patio común', 'Ambiente tranquilo'], available: 'Consulta disponibilidad', pin: '3' },
  { id: 4, name: 'La Casa del Arrayán · habitación 2', property: 'La Casa del Arrayán', place: 'Tunja · ubicación de ejemplo', price: 790000, kind: 'private', roomFeatures: ['Escritorio'], features: ['Escritorio', 'Cocina compartida'], available: 'Disponible', pin: '4' },
];

// El adjunto aprobado para revisión existe solo en la copia local ignorada por Git.
// En un checkout limpio se usa la imagen Pexels con licencia documentada.
const heroImage = document.querySelector('.hero-photo-main img');
heroImage?.addEventListener('error', () => {
  if (heroImage.dataset.fallbackApplied === 'true') return;
  heroImage.dataset.fallbackApplied = 'true';
  heroImage.src = heroImage.dataset.fallbackSrc;
  heroImage.alt = 'Dos jóvenes adultos comparten una cocina doméstica.';
  const disclosure = document.querySelector('.photo-disclosure');
  if (disclosure) disclosure.textContent = 'Foto editorial: Mizuno K / Pexels. No representa un anuncio ni un alojamiento.';
}, { once: true });

// Datos heredados del ejemplo: los espacios comunes pertenecen al inmueble, no a una habitación.
const properties = {
  'La Casa del Arrayán': { sharedSpaces: ['Patio común', 'Cocina compartida'], sharedServices: [], conditions: [], media: [] },
};

const listingList = document.querySelector('#listing-list');
const searchForm = document.querySelector('#search-form');
const queryInput = document.querySelector('#query');
const budgetSelect = document.querySelector('#budget');
const kindSelect = document.querySelector('#room-kind');
const count = document.querySelector('#result-count');
const emptyState = document.querySelector('#empty-state');
const announcement = document.querySelector('#announcement');
const sortButton = document.querySelector('#sort-button');
const favoriteIds = new Set();
let selectedListing = null;
let sortedByPrice = false;

function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
}

function illustration(listing) {
  return `<div class="room-art" role="img" aria-label="Ilustración conceptual de una habitación, no es una fotografía del inmueble">
    <svg aria-hidden="true" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="wall-${listing.id}" x2="0%" y2="100%"><stop stop-color="var(--art-wall-top)"/><stop offset="1" stop-color="var(--art-wall)"/></linearGradient>
        <linearGradient id="cover-${listing.id}" x2="0%" y2="100%"><stop stop-color="var(--art-linen)"/><stop offset="1" stop-color="var(--art-cover)"/></linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#wall-${listing.id})"/>
      <path d="M0 185H400V260H0Z" fill="var(--art-floor)"/>
      <path d="M0 183H400" stroke="var(--art-floor-line)" stroke-width="4"/>
      <circle cx="76" cy="61" r="25" fill="var(--art-sun)" opacity=".8"/>
      <rect x="245" y="32" width="112" height="122" rx="8" fill="var(--art-frame)"/>
      <rect x="253" y="40" width="96" height="106" rx="3" fill="var(--art-window)"/>
      <path d="M253 108q29-34 52-7t44-22v67h-96Z" fill="var(--art-hill)"/>
      <path d="M253 124q27-19 48 1t48-12v33h-96Z" fill="var(--art-hill-deep)"/>
      <path d="M301 41v104m-47-53h94" stroke="var(--art-frame)" stroke-width="5"/>
      <rect x="49" y="137" width="205" height="49" rx="8" fill="var(--art-headboard)"/>
      <rect x="34" y="166" width="244" height="53" rx="10" fill="var(--art-mattress)"/>
      <path d="M35 192q46-17 93 0t82 0q34-13 68 1v26H35Z" fill="url(#cover-${listing.id})"/>
      <rect x="58" y="169" width="58" height="25" rx="10" fill="var(--art-pillow)" transform="rotate(-5 58 169)"/>
      <rect x="124" y="169" width="58" height="25" rx="10" fill="var(--art-pillow)" transform="rotate(4 124 169)"/>
      <path d="M213 193q-4 11 2 26h55v-29q-28-8-57 3Z" fill="var(--art-throw)"/>
      <path d="M53 219v18m205-18v18" stroke="var(--art-wood)" stroke-width="8" stroke-linecap="round"/>
      <path d="M322 195h30l-4 22h-22Z" fill="var(--art-pot)"/>
      <path d="M337 194q-20-23-12-42m13 42q7-32 24-37m-24 37q-3-37 4-54" fill="none" stroke="var(--art-leaf)" stroke-width="5" stroke-linecap="round"/>
      <path d="M324 158q-12-11-13-24 14 4 19 17m13-11q3-15 17-22 1 16-11 26m-22 2q-2-16 7-26 8 12 4 27" fill="var(--art-leaf)"/>
      <rect x="36" y="73" width="72" height="4" rx="2" fill="var(--art-frame)" opacity=".75"/>
      <circle cx="75" cy="73" r="13" fill="var(--art-frame)"/>
    </svg>
    <span class="art-label">Ilustración de ejemplo ${listing.id}</span>
  </div>`;
}

function cardMarkup(listing) {
  const favorite = favoriteIds.has(listing.id);
  const selected = selectedListing === listing.id;
  return `<article class="listing-card${selected ? ' is-selected' : ''}" id="listing-${listing.id}" data-id="${listing.id}">
    ${illustration(listing)}
    <div class="card-content">
      <div class="card-topline">
        <span class="fiction-tag">Ejemplo ficticio</span>
        <button type="button" class="map-select-button" data-select="${listing.id}" aria-label="Mostrar ${listing.name} en el mapa" aria-pressed="${selected}">⌖</button>
        <button type="button" class="favorite-button" data-favorite="${listing.id}" aria-label="${favorite ? 'Quitar de guardados' : 'Guardar'} ${listing.name}" aria-pressed="${favorite}">${favorite ? '♥' : '♡'}</button>
      </div>
      <h3 class="card-title"><button class="detail-link" type="button" data-detail="${listing.id}">${listing.name}</button></h3>
      <p class="card-location">⌖ ${listing.place}</p>
      <ul class="feature-list">${listing.features.map(feature => `<li>${feature}</li>`).join('')}</ul>
      <div class="card-bottom"><p class="price">${formatPrice(listing.price)} <span>/ mes</span></p><span class="availability">${listing.available}</span></div>
      <button class="card-detail-button" type="button" data-detail="${listing.id}">Ver alojamiento</button>
    </div>
  </article>`;
}

function visibleListings() {
  const query = queryInput.value.trim().toLocaleLowerCase('es');
  const maxBudget = budgetSelect.value === 'all' ? Infinity : Number(budgetSelect.value);
  return listings
    .filter(item => item.price <= maxBudget)
    .filter(item => kindSelect.value === 'all' || item.kind === kindSelect.value)
    .filter(item => !query || `${item.name} ${item.place} ${item.features.join(' ')}`.toLocaleLowerCase('es').includes(query))
    .sort((a, b) => sortedByPrice ? a.price - b.price : a.id - b.id);
}

let simulatedError = false;
function renderListings() {
  const visible = visibleListings();
  listingList.innerHTML = visible.map(cardMarkup).join('');
  listingList.hidden = simulatedError;
  emptyState.hidden = visible.length > 0 || simulatedError;
  const errorState = document.querySelector('#error-state');
  if (errorState) errorState.hidden = !simulatedError;
  count.textContent = simulatedError ? 'Búsqueda no disponible' : `${visible.length} ${visible.length === 1 ? 'espacio' : 'espacios'} de ejemplo`;
  document.querySelectorAll('.map-price').forEach(button => {
    const exists = !simulatedError && visible.some(item => String(item.id) === button.dataset.listing);
    button.hidden = !exists;
    button.setAttribute('aria-pressed', String(selectedListing === Number(button.dataset.listing)));
  });
}

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  selectedListing = null;
  renderListings();
  announcement.textContent = `Búsqueda aplicada. ${count.textContent}.`;
});

sortButton.addEventListener('click', () => {
  sortedByPrice = !sortedByPrice;
  sortButton.setAttribute('aria-pressed', String(sortedByPrice));
  sortButton.innerHTML = `<span aria-hidden="true">↕</span> ${sortedByPrice ? 'Ordenado por precio' : 'Menor precio'}`;
  renderListings();
  announcement.textContent = sortedByPrice ? 'Ejemplos ordenados del menor al mayor precio.' : 'Orden original de ejemplos restaurado.';
});

listingList.addEventListener('click', event => {
  const detail = event.target.closest('[data-detail]');
  if (detail) return openDetail(Number(detail.dataset.detail));
  const select = event.target.closest('[data-select]');
  if (select) {
    const id = Number(select.dataset.select);
    const fromKeyboard = event.detail === 0;
    selectListing(id, false);
    if (window.matchMedia('(max-width: 720px)').matches) document.querySelector('#map-title').scrollIntoView({ block: 'start' });
    if (fromKeyboard) document.querySelector(`.map-price[data-listing="${id}"]`)?.focus({ preventScroll: true });
    return;
  }
  const button = event.target.closest('[data-favorite]');
  if (!button) {
    const card = event.target.closest('[data-id]');
    if (card) selectListing(Number(card.dataset.id), true);
    return;
  }
  const id = Number(button.dataset.favorite);
  favoriteIds.has(id) ? favoriteIds.delete(id) : favoriteIds.add(id);
  renderListings();
  const item = listings.find(listing => listing.id === id);
  announcement.textContent = `${item.name} ${favoriteIds.has(id) ? 'guardado en esta demostración' : 'quitado de guardados'}.`;
});

document.querySelector('#map-controls').addEventListener('click', event => {
  const button = event.target.closest('[data-listing]');
  if (!button) return;
  selectListing(Number(button.dataset.listing), true);
});

function selectListing(id, scroll) {
  selectedListing = id;
  renderListings();
  const card = document.querySelector(`#listing-${id}`);
  if (scroll) card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  announcement.textContent = `Ejemplo seleccionado. ${listings.find(item => item.id === id)?.name}.`;
}

const detailDialog = document.querySelector('#detail-dialog');
function openDetail(id) {
  const item = listings.find(listing => listing.id === id);
  if (!item) return;
  const property = item.property ? properties[item.property] : null;
  const roomFeatures = item.roomFeatures || item.features;
  const mediaStatus = property
    ? 'No hay fotografías reales de esta habitación ni de los espacios comunes en la demostración.'
    : 'No hay fotografías reales de esta habitación en la demostración.';
  document.querySelector('#detail-content').innerHTML = `<p class="eyebrow">Alojamiento de ejemplo · ${item.property || item.name}</p><h2 id="detail-title">${item.name}</h2><p class="detail-price">${formatPrice(item.price)} <span>por mes</span></p><h3>Habitación</h3><div class="detail-art">${illustration(item)}<p>Ilustración conceptual de la habitación. No es una foto del inmueble.</p></div><ul class="detail-list">${roomFeatures.map(feature => `<li>${feature}</li>`).join('')}<li>Disponibilidad: ${item.available}</li></ul>${property ? `<h3>Espacios compartidos del inmueble</h3><ul class="detail-list">${property.sharedSpaces.map(space => `<li>${space}</li>`).join('')}</ul>` : ''}<h3>Servicios y condiciones</h3><p>Datos de demostración pendientes. No se han especificado servicios ni condiciones.</p><h3>Fotografías</h3><p>${mediaStatus} La ilustración conceptual no documenta características reales.</p><h3>Ubicación aproximada</h3><p>${item.place}. Punto ficticio en el mapa esquemático.</p><h3>Contacto</h3><p>Canal de contacto simulado; no se envía información.</p><button type="button" class="primary-action" id="contact-simulated">Consultar al anunciante (demo)</button><p id="contact-feedback" class="contact-feedback" role="status" hidden>Consulta simulada. No se envió información al anunciante.</p><h3>Recorrido</h3><p>Este anuncio no incluye panorama 360°.</p><button type="button" id="open-tour">Ver estado 360°</button>`;
  detailDialog.showModal();
  document.querySelector('#contact-simulated').addEventListener('click', () => {
    const feedback = document.querySelector('#contact-feedback');
    feedback.hidden = false;
    announcement.textContent = feedback.textContent;
  });
  document.querySelector('#open-tour').addEventListener('click', () => document.querySelector('#tour-dialog').showModal());
}
document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelector('#simulate-error').addEventListener('click', () => { simulatedError = true; renderListings(); document.querySelector('#error-state').hidden = false; announcement.textContent = 'Estado de error de búsqueda simulado.'; });
document.querySelector('#reset-demo').addEventListener('click', () => { simulatedError = false; queryInput.value = ''; budgetSelect.value = 'all'; kindSelect.value = 'all'; selectedListing = null; sortedByPrice = false; sortButton.setAttribute('aria-pressed', 'false'); sortButton.innerHTML = '<span aria-hidden="true">↕</span> Menor precio'; favoriteIds.clear(); renderListings(); announcement.textContent = 'Demostración restablecida.'; });

renderListings();
