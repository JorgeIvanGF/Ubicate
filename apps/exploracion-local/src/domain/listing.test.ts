import { describe, expect, it } from 'vitest';
import { featureOptions, filterListings, flattenProperties, properties } from './listing';

describe('filtros y datos de ejemplo', () => {
  const listings = flattenProperties();

  it('combina zona, precio y características', () => {
    const result = filterListings(listings, { zone: 'Centro', maxPrice: 700000, features: ['Amoblada'] });
    expect(result.map((item) => item.unit.id)).toEqual(['arrayan-1', 'sauco-1']);
  });

  it('devuelve lista vacía sin modificar los fixtures', () => {
    expect(filterListings(listings, { zone: 'Costa', maxPrice: 100000, features: [] })).toEqual([]);
    expect(flattenProperties()).toHaveLength(7);
  });

  it('cada inmueble tiene unidades con precio y disponibilidad propios', () => {
    expect(properties.some((property) => property.units.length >= 2)).toBe(true);
    expect(listings.every((listing) => listing.unit.price > 0 && listing.unit.available.length > 0)).toBe(true);
    expect(featureOptions).toContain('Amoblada');
  });
});
