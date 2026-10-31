import { useCallback, useEffect, useRef, useState } from 'react';
import { Map as MapLibreMap, Marker as MapLibreMarker, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import type { Listing } from '../domain/listing';

setWorkerUrl(workerUrl);

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
const TUNJA_CENTER: [number, number] = [-73.3678, 5.5358];

type MapAdapterProps = {
  listings: Listing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  forceFailure: boolean;
  retryKey: number;
  onShowList: () => void;
  isVisible: boolean;
};

export function MapAdapter({ listings, selectedId, onSelect, forceFailure, retryKey, onShowList, isVisible }: MapAdapterProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<MapLibreMarker[]>([]);
  const selectRef = useRef(onSelect);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  selectRef.current = onSelect;

  useEffect(() => {
    if (forceFailure || !hostRef.current) {
      setStatus('error');
      return undefined;
    }
    setStatus('loading');
    let styleLoaded = false;
    const map = new MapLibreMap({
      container: hostRef.current,
      style: STYLE_URL,
      center: TUNJA_CENTER,
      zoom: 13,
      minZoom: 11,
      maxZoom: 18,
      cooperativeGestures: true,
    });
    mapRef.current = map;
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');

    const onStyleLoad = () => {
      styleLoaded = true;
      setStatus('ready');
    };
    const onError = () => {
      setStatus('error');
    };
    map.once('style.load', onStyleLoad);
    map.on('error', onError);
    const timeout = window.setTimeout(() => {
      if (!styleLoaded) setStatus('error');
    }, 15000);

    return () => {
      window.clearTimeout(timeout);
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [forceFailure, retryKey]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== 'ready' || !isVisible) return;
    const frame = window.requestAnimationFrame(() => map.resize());
    return () => window.cancelAnimationFrame(frame);
  }, [isVisible, status]);

  useEffect(() => {
    const handleResize = () => {
      const map = mapRef.current;
      if (!map || !isVisible) return;
      window.requestAnimationFrame(() => map.resize());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isVisible]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== 'ready') return;
    markersRef.current.forEach((marker) => marker.remove());
    const buttonsByUnitId = new Map<string, HTMLButtonElement>();
    markersRef.current = listings.map((listing) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `map-price-marker${selectedId === listing.unit.id ? ' is-selected' : ''}`;
      button.dataset.unitId = listing.unit.id;
      buttonsByUnitId.set(listing.unit.id, button);
      button.textContent = `$${Math.round(listing.unit.price / 1000)}k`;
      button.setAttribute('aria-label', `$${Math.round(listing.unit.price / 1000)}k, ${listing.name}, ${listing.unit.name}, ${listing.unit.price.toLocaleString('es-CO')} pesos al mes`);
      button.setAttribute('aria-pressed', String(selectedId === listing.unit.id));
      button.addEventListener('click', () => selectRef.current(listing.unit.id));
      const markerShell = document.createElement('div');
      markerShell.className = 'marker-shell';
      markerShell.append(button);
      const colocated = listings.filter((candidate) => candidate.coordinates[0] === listing.coordinates[0] && candidate.coordinates[1] === listing.coordinates[1]);
      const siblingIndex = colocated.findIndex((candidate) => candidate.unit.id === listing.unit.id);
      const offset = colocated.length > 1 ? [(siblingIndex - (colocated.length - 1) / 2) * 72, 0] as [number, number] : [0, 0] as [number, number];
      const marker = new MapLibreMarker({ element: markerShell, anchor: 'bottom', offset }).setLngLat(listing.coordinates).addTo(map);
      return marker;
    });
    if (selectedId) {
      const selected = listings.find((listing) => listing.unit.id === selectedId);
      if (selected) map.easeTo({ center: selected.coordinates, duration: 300 });
      const selectedButton = buttonsByUnitId.get(selectedId);
      if (selectedButton && isVisible) window.requestAnimationFrame(() => selectedButton.focus({ preventScroll: true }));
    }
  }, [listings, selectedId, status, isVisible]);

  const retry = useCallback(() => window.dispatchEvent(new CustomEvent('ubicate-map-retry')), []);

  return (
    <div className="map-frame" aria-label="Mapa de alojamientos ficticios de Tunja">
      <div className="map-canvas" ref={hostRef} aria-hidden={status !== 'ready'} />
      {status !== 'ready' && (
        <div className="map-state" role={status === 'error' ? 'alert' : 'status'}>
          <span className="map-state-icon" aria-hidden="true">{status === 'error' ? '!' : '⌖'}</span>
          <h3>{status === 'error' ? 'El mapa no está disponible' : 'Cargando el mapa de Tunja'}</h3>
          <p>{status === 'error' ? 'Puedes seguir explorando con la lista y los filtros. Las ubicaciones son aproximadas.' : 'La lista y los filtros están disponibles mientras carga.'}</p>
          {status === 'error' && <div className="map-state-actions"><button type="button" className="button button-secondary" onClick={retry}>Reintentar mapa</button><button type="button" className="button button-secondary mobile-list-action" onClick={onShowList}>Ver lista</button></div>}
        </div>
      )}
      <span className="map-approx-note">Ubicaciones aproximadas de ejemplo</span>
    </div>
  );
}

export { STYLE_URL };
