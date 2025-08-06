import { Vehicle, ServiceLevel } from './types/types.ts';

export const VEHICLES: Vehicle[] = [
  {
    id: 'mini-truck',
    nameKey: 'vehicle_mini_truck_name',
    descriptionKey: 'vehicle_mini_truck_desc',
    capacity: 'Up to 750kg',
    icon: { name: 'truck-outline', type: 'material' },
    imageUrl: 'https://i.imgur.com/h3aWMAj.png',
    baseFare: 200,
    perKmRate: 15,
    seats: 2,
  },
  {
    id: 'pickup',
    nameKey: 'vehicle_pickup_name',
    descriptionKey: 'vehicle_pickup_desc',
    capacity: 'Up to 1.5 Ton',
    icon: { name: 'truck', type: 'material' },
    imageUrl: 'https://i.imgur.com/C5T8j1f.png',
    baseFare: 350,
    perKmRate: 20,
    seats: 3,
  },
  {
    id: 'large-truck',
    nameKey: 'vehicle_large_truck_name',
    descriptionKey: 'vehicle_large_truck_desc',
    capacity: 'Up to 5 Ton',
    icon: { name: 'truck-cargo-container', type: 'material' },
    imageUrl: 'https://i.imgur.com/sC4sEwN.png',
    baseFare: 600,
    perKmRate: 30,
    seats: 3,
  },
];

export const SERVICE_LEVEL_COSTS: Record<ServiceLevel, number> = {
    [ServiceLevel.MOVE_ONLY]: 0,
    [ServiceLevel.MOVE_LOAD]: 500,
    [ServiceLevel.MOVE_PACK_LOAD]: 1200,
};
