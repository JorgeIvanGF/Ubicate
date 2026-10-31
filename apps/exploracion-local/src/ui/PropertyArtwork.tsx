import type { Property } from '../domain/listing';

export function PropertyArtwork({ property, compact = false }: { property: Property; compact?: boolean }) {
  return (
    <div className={`property-artwork artwork-${property.artwork}${compact ? ' artwork-compact' : ''}`} role="img" aria-label="Ilustración ficticia de habitación, no es una fotografía del alojamiento">
      <span className="art-sun" />
      <span className="art-window"><i /><i /></span>
      <span className="art-plant"><i /><i /><i /></span>
      <span className="art-bed"><i /><b /><em /></span>
      <span className="art-desk" />
      <span className="art-disclosure">Ilustración de ejemplo</span>
    </div>
  );
}
