/*
  Orders seed (5 rows)
  Usage:
    - Run with ts-node or compile + run with node
    - Example: npx ts-node --esm src/backend/db/seeds/orders.seed.ts

  Notes:
    - Uses real Google Places place_id values for loading/offloading locations.
    - country field uses the literal country name ("Mozambique").
    - state field contains a district name (Maputo districts like KaMavota, KaMaxakeni, etc.).
*/

import { db } from '..';
import { order } from '../schema';

const ORG_ID = 'uS9XJgdh9CFxAZcSUuMu9zoHWTe7y7Xr';

const now = new Date();
const days = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

const ORDERS = [
	{
		shipperId: ORG_ID,
		shipperName: 'Seed Shipper A',
		loadingAddress: [
			{
				address: 'Av. 24 de Julho 123, Bairro Central',
				placeId: 'ChIJm31W5gKb5h4RBAJv-jOV6Sk',
				country: 'Mozambique',
				state: 'KaMavota',
			},
		],
		expectedLoadingDate: days(1),
		offloadingAddress: [
			{
				address: 'Rua José Mateus 45, Polana',
				placeId: 'ChIJ45wxuKOb5h4RdIf7LKlYo4s',
				country: 'Mozambique',
				state: 'KaMaxakeni',
			},
		],
		expectedOffloadingDate: days(3),
		distance: 120,
		expectedTrucks: 1,
		route: 'national',
		share: 'subscribers',
		status: 'open',
		price: 120000,
		currency: 'MZN',
	},
	{
		shipperId: ORG_ID,
		shipperName: 'Seed Shipper B',
		loadingAddress: [
			{
				address: 'Av. Eduardo Mondlane 200, Natikiri',
				placeId: 'ChIJx-q1ANlJxhgRFp1zocKCyjk',
				country: 'Mozambique',
				state: 'Natikiri',
			},
		],
		expectedLoadingDate: days(2),
		offloadingAddress: [
			{
				address: 'Estrada Nacional Nº 13, Bairro Natikiri',
				placeId: 'ChIJFYE7CpY1xhgRgMV0cn6b_-Y',
				country: 'Mozambique',
				state: 'Natikiri',
			},
		],
		expectedOffloadingDate: days(4),
		distance: 300,
		expectedTrucks: 1,
		route: 'national',
		share: 'non-subscribers',
		status: 'open',
		price: 300000,
		currency: 'MZN',
	},
	{
		shipperId: ORG_ID,
		shipperName: 'Seed Shipper C',
		loadingAddress: [
			{
				address: 'Seed Loading St 3, Zambezia (Quelimane)',
				placeId: 'ChIJO4170wn00hgRp-EMPnY2SLI',
				country: 'Mozambique',
				state: 'Quelimane',
			},
		],
		expectedLoadingDate: days(3),
		offloadingAddress: [
			{
				address: 'Seed Offload Ave 3, Zambezia',
				placeId: 'ChIJO4170wn00hgRp-EMPnY2SLI',
				country: 'Mozambique',
				state: 'Quelimane',
			},
		],
		expectedOffloadingDate: days(6),
		distance: 540,
		expectedTrucks: 1,
		route: 'national',
		share: 'subscribers',
		status: 'open',
		price: 540000,
		currency: 'MZN',
	},
	{
		shipperId: ORG_ID,
		shipperName: 'Seed Shipper D',
		loadingAddress: [
			{
				address: 'Seed Loading St 4, Inhambane',
				placeId: 'ChIJm31W5gKb5h4RBAJv-jOV6Sk',
				country: 'Mozambique',
				state: 'Inhambane',
			},
		],
		expectedLoadingDate: days(4),
		offloadingAddress: [
			{
				address: 'Seed Offload Ave 4, Inhambane',
				placeId: 'ChIJm31W5gKb5h4RBAJv-jOV6Sk',
				country: 'Mozambique',
				state: 'Inhambane',
			},
		],
		expectedOffloadingDate: days(7),
		distance: 220,
		expectedTrucks: 1,
		route: 'national',
		share: 'non-subscribers',
		status: 'open',
		price: 220000,
		currency: 'MZN',
	},
	{
		shipperId: ORG_ID,
		shipperName: 'Seed Shipper E',
		loadingAddress: [
			{
				address: 'Av. 25 de Junho 50, Quelimane',
				placeId: 'ChIJO4170wn00hgRp-EMPnY2SLI',
				country: 'Mozambique',
				state: 'Quelimane',
			},
		],
		expectedLoadingDate: days(5),
		offloadingAddress: [
			{
				address: 'Seed Offload Ave 5, Quelimane',
				placeId: 'ChIJO4170wn00hgRp-EMPnY2SLI',
				country: 'Mozambique',
				state: 'Quelimane',
			},
		],
		expectedOffloadingDate: days(9),
		distance: 410,
		expectedTrucks: 1,
		route: 'national',
		share: 'non-subscribers',
		status: 'open',
		price: 410000,
		currency: 'MZN',
	},
];

async function main() {
	try {
		await db.insert(order).values(ORDERS);

		console.log('Orders seeded correctly');
	} catch (error) {
		console.error('Error seeding orders: ', error);
		process.exit(1);
	}
}

main();
