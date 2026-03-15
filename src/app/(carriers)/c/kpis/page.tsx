import { getQueryClient, HydrateClient, trpc } from '@/backend/trpc/server';

import { CarrierKPIsView } from '@/modules/app/routes/carrier/pages/kpis/views/carrier-kpis-view';
import { CarrierTendenciesView } from '@/modules/app/routes/carrier/pages/kpis/views/carrier-tendencies-view';

export default async function Page() {
	const now = new Date();

	const startDate = new Date(now.setDate(now.getDate() - 30));
	const endDate = new Date();

	const client = getQueryClient();

	await client.prefetchQuery(
		trpc.carrierKpis.report.queryOptions({
			endDate,
			startDate,
			currency: 'MZN',
			section: 'operational',
		})
	);

	await Promise.all([
		client.prefetchQuery(
			trpc.carrierKpis.onTime.queryOptions({
				endDate,
				startDate,
				currency: 'MZN',
			})
		),
		client.prefetchQuery(
			trpc.carrierKpis.incidents.queryOptions({
				endDate,
				startDate,
				currency: 'MZN',
			})
		),
		client.prefetchQuery(
			trpc.carrierKpis.loading.queryOptions({
				endDate,
				startDate,
				currency: 'MZN',
			})
		),
		client.prefetchQuery(
			trpc.carrierKpis.offloading.queryOptions({
				endDate,
				startDate,
				currency: 'MZN',
			})
		),
	]);

	return (
		<HydrateClient>
			<div className='flex flex-col gap-6'>
				<CarrierKPIsView endDate={endDate} startDate={startDate} />
				<CarrierTendenciesView endDate={endDate} startDate={startDate} />
			</div>
		</HydrateClient>
	);
}
