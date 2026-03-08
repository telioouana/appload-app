/*
  Cargo seed (5 rows)
  Usage:
    - Run with ts-node or compile + run with node
    - Example: npx ts-node --esm src/backend/db/seeds/cargo.seed.ts

  Notes:
    - Queries existing orders at runtime and attaches cargo rows to them.
    - Each cargo row is unique per order (orderId unique constraint).
    - Includes examples of hazardous and refrigerated cargo.
    - Uses categories and packing from shared enums.
*/

import { db } from '..';
import { cargo, order } from '../schema';
import { randomUUID } from 'crypto';
import { CATEGORIES, PACKING, WEIGHT_UNIT } from '../types';
import { eq, isNull } from 'drizzle-orm';

async function main() {
	try {
		// Check if orders exist
		const orderCount = await db.$count(order);

		if (orderCount === 0) {
			console.error('No orders found. Please run orders.seed.ts first.');
			process.exit(1);
		}

		// Get orders that don't have cargo yet (limit to 5)
		const ordersWithoutCargo = await db
			.select({ id: order.id })
			.from(order)
			.leftJoin(cargo, eq(order.id, cargo.orderId))
			.where(isNull(cargo.orderId))
			.limit(5);

		if (ordersWithoutCargo.length === 0) {
			console.log('All orders already have cargo. No new cargo seeded.');
			return;
		}

		const CARGOS = [
			{
				id: randomUUID().toString(),
				orderId: ordersWithoutCargo[0].id,
				category: 'agriculture-products' as typeof CATEGORIES[number],
				description: 'Fresh tomatoes for market distribution',
				quantity: '2.5',
				unit: 'ton' as typeof WEIGHT_UNIT[number],
				packing: 'boxes' as typeof PACKING[number],
				isHazardous: false,
				isRefrigerated: true,
				temperature: 8,
				temperatureInstructions: 'Keep at 8°C during transport',
				isGroupageAllowed: true,
			},
			{
				id: randomUUID().toString(),
				orderId: ordersWithoutCargo[1]?.id || ordersWithoutCargo[0].id,
				category: 'construction' as typeof CATEGORIES[number],
				description: 'Cement bags for building project',
				quantity: '25',
				unit: 'ton' as typeof WEIGHT_UNIT[number],
				packing: 'bags-50kg' as typeof PACKING[number],
				isHazardous: false,
				isRefrigerated: false,
				isGroupageAllowed: false,
			},
			{
				id: randomUUID().toString(),
				orderId: ordersWithoutCargo[2]?.id || ordersWithoutCargo[0].id,
				category: 'fmcg' as typeof CATEGORIES[number],
				description: 'Household cleaning chemicals',
				quantity: '1.2',
				unit: 'ton' as typeof WEIGHT_UNIT[number],
				packing: 'container-20ft' as typeof PACKING[number],
				isHazardous: true,
				hazchemCode: '8',
				isRefrigerated: false,
				isGroupageAllowed: false,
			},
			{
				id: randomUUID().toString(),
				orderId: ordersWithoutCargo[3]?.id || ordersWithoutCargo[0].id,
				category: 'machinery-equipment' as typeof CATEGORIES[number],
				description: 'Agricultural irrigation pumps',
				quantity: '3',
				unit: 'ton' as typeof WEIGHT_UNIT[number],
				packing: 'pallets' as typeof PACKING[number],
				isHazardous: false,
				isRefrigerated: false,
				isGroupageAllowed: true,
			},
			{
				id: randomUUID().toString(),
				orderId: ordersWithoutCargo[4]?.id || ordersWithoutCargo[0].id,
				category: 'medicine' as typeof CATEGORIES[number],
				description: 'Vaccines requiring cold chain',
				quantity: '0.8',
				unit: 'ton' as typeof WEIGHT_UNIT[number],
				packing: 'boxes' as typeof PACKING[number],
				isHazardous: false,
				isRefrigerated: true,
				temperature: 2,
				temperatureInstructions: 'Maintain at 2-8°C, temperature monitoring required',
				isGroupageAllowed: false,
			},
		];

		await db.insert(cargo).values(CARGOS);

		console.log('Cargo seeded correctly');
	} catch (error) {
		console.error('Error seeding cargo: ', error);
		process.exit(1);
	}
}

main();