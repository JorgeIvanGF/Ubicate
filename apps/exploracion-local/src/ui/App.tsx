import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { Filters, Property } from '../domain/listing';
import { featureOptions, filterListings, flattenProperties, properties } from '../domain/listing';
import { PropertyArtwork } from './PropertyArtwork';

const MapAdapter = lazy(() => import('../map/MapAdapter').then((module) => ({ default: module.MapAdapter })));

type MobileView = 'map' | 'list';
const MOBILE_BREAKPOINT = 760;

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
}

export default function App() {
  const allListings = useMemo(() => flattenProperties(), []);
  const [filters, setFilters] = useState<Filters>({ zone: '', maxPrice: 1200000, features: [] });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Property | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>('map');
  const [forceMapFailure, setForceMapFailure] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [announcement, setAnnouncement] = useState('Explora alojamientos ficticios en Tunja.');
  const resultRefs = useRef<Record<string, HTMLElement | null>>({});
  const detailTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const retry = () => {
      setForceMapFailure(false);
      setRetryKey((value) => value + 1);
    };
    window.addEventListener('ubicate-map-retry', retry);
    return () => window.removeEventListener('ubicate-map-retry', retry);
  }, []);

  const visible = useMemo(() => filterListings(allListings, filters), [allListings, filters]);

  function changeFeature(feature: string) {
    setFilters((current) => ({
      ...current,
      features: current.features.includes(feature)
        ? current.features.filter((item) => item !== feature)
        : [...current.features, feature],
    }));
    setSelectedId(null);
  }

  function selectListing(id: string, fromMap = false) {
    setSelectedId(id);
    const listing = allListings.find((item) => item.unit.id === id);
    if (!listing) return;
    setAnnouncement(`${listing.name}, ${listing.unit.name} seleccionado.`);
    if (fromMap && window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches) setMobileView('list');
    if (!fromMap && window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches) setMobileView('map');
    if (fromMap) {
      window.setTimeout(() => resultRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    }
  }

  const detailProperty = detail;

  useEffect(() => {
    if (!detailProperty) return undefined;
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    const closeButton = dialog?.querySelector<HTMLButtonElement>('.dialog-close');
    closeButton?.focus();
    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setDetail(null);
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;
      const focusable = [...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])')]
        .filter((element) => element.getClientRects().length > 0);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleDialogKeys);
    return () => {
      document.removeEventListener('keydown', handleDialogKeys);
      detailTriggerRef.current?.focus();
    };
  }, [detailProperty]);

  function openDetail(listing: (typeof allListings)[number], trigger: HTMLButtonElement) {
    detailTriggerRef.current = trigger;
    setDetail(properties.find((property) => property.id === listing.id) ?? null);
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Ubícate, inicio">
          <img src="/logo-ubicate.png" alt="Ubícate" />
        </a>
        <nav className="header-nav" aria-label="Navegación principal"><span className="header-location"><span aria-hidden="true">⌖</span> Tunja, Boyacá</span><span className="demo-pill">Exploración de ejemplo</span></nav>
      </header>

      <main id="inicio">
        <section className="exploration-hero" aria-labelledby="page-title">
          <img className="exploration-hero-image" src="/hero-cocina-compartida.jpg" alt="Dos hombres cocinan juntos en una cocina compartida." width="1200" height="800" fetchPriority="high" />
          <div className="exploration-hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> TU PRÓXIMO LUGAR EMPIEZA AQUÍ</p>
            <h1 id="page-title">Encuentra tu espacio<br /><span>en Tunja.</span></h1>
            <p className="intro-copy">Explora habitaciones y alojamientos a tu ritmo. Compara opciones y encuentra la que se siente como tu próximo hogar.</p>
          </div>
          <p className="hero-image-credit">Imagen editorial: <a href="https://www.pexels.com/photo/men-cooking-at-home-13334672/" target="_blank" rel="noreferrer">Mizuno K / Pexels</a>. No representa un alojamiento ni implica respaldo.</p>
        </section>

        <section className="search-panel" aria-label="Filtros de alojamiento">
          <div className="filter-field zone-field">
            <label htmlFor="zone-filter"><span className="field-icon" aria-hidden="true">⌖</span> Zona de Tunja</label>
            <input id="zone-filter" value={filters.zone} onChange={(event) => { setFilters((current) => ({ ...current, zone: event.target.value })); setSelectedId(null); }} placeholder="Ej. Centro histórico" />
          </div>
          <div className="filter-field price-field">
            <label htmlFor="price-filter"><span className="field-icon" aria-hidden="true">$</span> Precio máximo</label>
            <select id="price-filter" value={filters.maxPrice} onChange={(event) => { setFilters((current) => ({ ...current, maxPrice: Number(event.target.value) })); setSelectedId(null); }}>
              <option value="1200000">Sin límite</option><option value="600000">Hasta $600.000</option><option value="750000">Hasta $750.000</option><option value="900000">Hasta $900.000</option>
            </select>
          </div>
          <fieldset className="feature-field">
            <legend>Características</legend>
            <div className="feature-options">{featureOptions.map((feature) => (
              <label className={`feature-chip${filters.features.includes(feature) ? ' is-active' : ''}`} key={feature}>
                <input type="checkbox" checked={filters.features.includes(feature)} onChange={() => changeFeature(feature)} />
                <span aria-hidden="true">{filters.features.includes(feature) ? '✓' : '+'}</span>{feature}
              </label>
            ))}</div>
          </fieldset>
          <button type="button" className="clear-button" onClick={() => { setFilters({ zone: '', maxPrice: 1200000, features: [] }); setSelectedId(null); setAnnouncement('Filtros limpiados. Se muestran todos los alojamientos de ejemplo.'); }}>Limpiar filtros</button>
        </section>

        <div className="results-heading">
          <div><span className="results-kicker">ALOJAMIENTOS PARA EXPLORAR</span><h2>Opciones en Tunja <span className="results-count">{visible.length}</span></h2></div>
          <p>Ubicaciones aproximadas para cuidar la privacidad.</p>
        </div>

        <div className="mobile-switch" role="group" aria-label="Cambiar vista de resultados">
          <button type="button" aria-label="Ver mapa" aria-pressed={mobileView === 'map'} className={mobileView === 'map' ? 'active' : ''} onClick={() => setMobileView('map')}>Mapa <span aria-hidden="true">⌖</span></button>
          <button type="button" aria-label={`Lista ${visible.length}, ver lista`} aria-pressed={mobileView === 'list'} className={mobileView === 'list' ? 'active' : ''} onClick={() => setMobileView('list')}>Lista <span className="tab-count">{visible.length}</span></button>
        </div>

        <section className="explore-grid" aria-label="Mapa y alojamientos">
          <section className={`map-column${mobileView === 'list' ? ' mobile-hidden' : ''}`} aria-labelledby="map-heading">
            <div className="section-title-row"><div><p className="section-label">UBÍCATE EN EL MAPA</p><h2 id="map-heading">Tunja y sus zonas</h2></div><span className="approx-badge"><i /> Puntos aproximados</span></div>
            <Suspense fallback={<div className="map-state" role="status"><h3>Preparando el mapa de Tunja</h3><p>Los filtros y la lista están disponibles mientras carga.</p></div>}>
              <MapAdapter listings={visible} selectedId={selectedId} onSelect={(id) => selectListing(id, true)} forceFailure={forceMapFailure} retryKey={retryKey} onShowList={() => setMobileView('list')} isVisible={mobileView === 'map'} />
            </Suspense>
            <div className="map-meta"><span><i className="legend-dot" /> Habitación</span><span>Acerca o arrastra para explorar</span></div>
          </section>

          <section className={`list-column${mobileView === 'map' ? ' mobile-hidden' : ''}`} aria-labelledby="list-heading">
            <div className="section-title-row"><div><p className="section-label">HECHAS PARA TU DÍA A DÍA</p><h2 id="list-heading">Lugares para ti</h2></div><span className="sort-note">Orden por relevancia</span></div>
            <div className="listing-list" aria-live="polite" aria-relevant="additions text">
              {visible.map((listing) => (
                <article className={`listing-card${selectedId === listing.unit.id ? ' is-selected' : ''}`} data-unit-id={listing.unit.id} key={listing.unit.id} ref={(element) => { resultRefs.current[listing.unit.id] = element; }}>
                  <button type="button" className="listing-main" onClick={() => selectListing(listing.unit.id)} aria-pressed={selectedId === listing.unit.id}>
                    <PropertyArtwork property={listing} compact />
                    <span className="listing-info">
                      <span className="fiction-tag">ALOJAMIENTO DE EJEMPLO</span>
                      <span className="listing-name">{listing.name}</span>
                      <span className="listing-unit">{listing.unit.name} <span>· {listing.unit.kind}</span></span>
                      <span className="listing-zone"><span aria-hidden="true">⌖</span> {listing.zone}</span>
                      <span className="listing-feature-row">{listing.unit.features.slice(0, 2).map((feature) => <span className="mini-feature" key={feature}>{feature}</span>)}</span>
                      <span className="listing-bottom"><strong>{formatPrice(listing.unit.price)} <small>/ mes</small></strong><span className="availability"><i /> {listing.unit.available}</span></span>
                    </span>
                  </button>
                  <button className="detail-arrow" type="button" aria-label={`Ver inmueble ${listing.name}`} onClick={(event) => openDetail(listing, event.currentTarget)}>↗</button>
                </article>
              ))}
              {visible.length === 0 && <div className="empty-state" role="status"><span aria-hidden="true">⌕</span><h3>No encontramos opciones con esos filtros</h3><p>Prueba con otra zona o amplía tu rango de precio.</p><button className="button button-primary" type="button" onClick={() => { setFilters({ zone: '', maxPrice: 1200000, features: [] }); setSelectedId(null); }}>Ver todos los alojamientos</button></div>}
            </div>
          </section>
        </section>

        <section className="demo-tools" aria-label="Herramientas de demostración">
          <p>Datos y ubicaciones ficticios. Esta experiencia es local y no contacta anunciantes.</p>
          <button type="button" onClick={() => setForceMapFailure(true)}>Simular caída del mapa</button>
        </section>
      </main>

      <footer className="site-footer"><img src="/logo-ubicate.png" alt="" /><span>Un lugar para empezar, en Tunja.</span><span className="footer-example">Exploración con datos ficticios</span></footer>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>

      {detailProperty && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetail(null); }}>
          <section className="property-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
            <button type="button" className="dialog-close" aria-label="Cerrar detalle" onClick={() => setDetail(null)}>×</button>
            <div className="dialog-hero"><PropertyArtwork property={detailProperty} /><span className="dialog-fiction">Inmueble de ejemplo · Tunja</span></div>
            <div className="dialog-content">
              <p className="eyebrow">{detailProperty.zone} · Ubicación aproximada</p>
              <h2 id="detail-title">{detailProperty.name}</h2>
              <p className="dialog-subtitle">Un inmueble, {detailProperty.units.length} {detailProperty.units.length === 1 ? 'espacio disponible' : 'espacios para explorar'}.</p>
              <div className="dialog-section"><div className="dialog-section-title"><h3>Sus habitaciones</h3><span>{detailProperty.units.length} unidades</span></div>
                <div className="unit-list">{detailProperty.units.map((unit) => (
                  <article className="unit-row" key={unit.id}>
                    <div className="unit-heading"><div><span className="unit-kind">{unit.kind}</span><h4>{unit.name}</h4></div><strong>{formatPrice(unit.price)}<small> / mes</small></strong></div>
                    <p>{unit.features.join(' · ')}</p><span className="unit-availability"><i /> {unit.available}</span>
                  </article>
                ))}</div>
              </div>
              <div className="dialog-section common-section"><h3>Espacios compartidos del inmueble</h3><div className="common-chips">{detailProperty.commonFeatures.map((feature) => <span key={feature}>{feature}</span>)}</div></div>
              <div className="approx-disclosure"><span aria-hidden="true">⌖</span><p><strong>Ubicación aproximada</strong><br />El punto del mapa es orientativo y no muestra una dirección exacta.</p></div>
              <div className="contact-notice"><strong>¿Te interesa este lugar?</strong><p>El contacto con anunciantes estará disponible en otra etapa. En esta exploración no se envía ningún mensaje.</p></div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
