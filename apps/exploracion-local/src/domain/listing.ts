export type Unit = {
  id: string;
  name: string;
  kind: 'Privada' | 'Compartida';
  price: number;
  available: string;
  features: string[];
};

export type Property = {
  id: string;
  name: string;
  zone: string;
  coordinates: [longitude: number, latitude: number];
  commonFeatures: string[];
  units: Unit[];
  artwork: 'mint' | 'blue' | 'lime' | 'sand';
};

export type Listing = Property & { unit: Unit };

export type Filters = {
  zone: string;
  maxPrice: number;
  features: string[];
};

export const properties: Property[] = [
  {
    id: 'casa-arrayan', name: 'Casa del Arrayán', zone: 'Centro histórico',
    coordinates: [-73.3683, 5.5352], commonFeatures: ['Cocina compartida', 'Patio interior'], artwork: 'mint',
    units: [
      { id: 'arrayan-1', name: 'Habitación 1', kind: 'Compartida', price: 590000, available: 'Disponible', features: ['Amoblada', 'Baño compartido', 'Luz natural'] },
      { id: 'arrayan-2', name: 'Habitación 2', kind: 'Privada', price: 760000, available: 'Desde el 15 de noviembre', features: ['Amoblada', 'Escritorio', 'Baño privado'] },
    ],
  },
  {
    id: 'casa-almendro', name: 'Casa del Almendro', zone: 'Las Nieves',
    coordinates: [-73.3598, 5.5378], commonFeatures: ['Lavandería', 'Zona de estudio'], artwork: 'blue',
    units: [
      { id: 'almendro-1', name: 'Estudio independiente', kind: 'Privada', price: 890000, available: 'Disponible', features: ['Amoblada', 'Cocineta', 'Baño privado', 'Wi-Fi'] },
    ],
  },
  {
    id: 'casa-limon', name: 'Casa Limón', zone: 'Universidad',
    coordinates: [-73.3555, 5.5487], commonFeatures: ['Terraza', 'Bicicletero'], artwork: 'lime',
    units: [
      { id: 'limon-1', name: 'Habitación individual', kind: 'Privada', price: 720000, available: 'Disponible', features: ['Amoblada', 'Escritorio', 'Baño compartido'] },
      { id: 'limon-2', name: 'Habitación compartida', kind: 'Compartida', price: 480000, available: 'Cupos disponibles', features: ['Amoblada', 'Clóset', 'Luz natural'] },
    ],
  },
  {
    id: 'casa-robles', name: 'Casa de los Robles', zone: 'Santa Inés',
    coordinates: [-73.3731, 5.5421], commonFeatures: ['Jardín', 'Cocina compartida'], artwork: 'sand',
    units: [
      { id: 'robles-1', name: 'Habitación con balcón', kind: 'Privada', price: 820000, available: 'Disponible', features: ['Balcón', 'Amoblada', 'Baño privado'] },
    ],
  },
  {
    id: 'casa-sauco', name: 'Casa del Saúco', zone: 'Centro histórico',
    coordinates: [-73.3644, 5.5308], commonFeatures: ['Patio interior', 'Comedor común'], artwork: 'blue',
    units: [
      { id: 'sauco-1', name: 'Habitación luminosa', kind: 'Privada', price: 680000, available: 'Disponible', features: ['Amoblada', 'Luz natural', 'Wi-Fi'] },
    ],
  },
];

export const featureOptions = ['Amoblada', 'Baño privado', 'Escritorio', 'Luz natural', 'Wi-Fi'];

export function flattenProperties(data: Property[] = properties): Listing[] {
  return data.flatMap((property) => property.units.map((unit) => ({ ...property, unit })));
}

export function filterListings(listings: Listing[], filters: Filters): Listing[] {
  const zone = filters.zone.trim().toLocaleLowerCase('es');
  return listings.filter((listing) => {
    const matchesZone = !zone || listing.zone.toLocaleLowerCase('es').includes(zone);
    const matchesPrice = listing.unit.price <= filters.maxPrice;
    const searchable = [...listing.unit.features, ...listing.commonFeatures].map((value) => value.toLocaleLowerCase('es'));
    const matchesFeatures = filters.features.every((feature) => searchable.includes(feature.toLocaleLowerCase('es')));
    return matchesZone && matchesPrice && matchesFeatures;
  });
}
