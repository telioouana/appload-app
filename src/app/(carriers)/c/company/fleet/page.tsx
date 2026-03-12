// export default function Page() {
//     return (
//         <div>Fleet</div>
//     )
// }
'use client';

import React, { useMemo, useState } from 'react';

// Local, dependency-free fallbacks (so this page compiles even if shared UI/context isn't present).
const Icon = ({ className }: { className?: string }) => (
	<span aria-hidden className={className} />
);
const Grid3x3 = Icon;
const List = Icon;
const MapPin = Icon;
const Navigation = Icon;
const Package = Icon;
const Plus = Icon;
const Search = Icon;
const Trash2 = Icon;
const Truck = Icon;

type SimpleTopBarProps = {
	title?: string;
	onBack?: () => void;
	showSearch?: boolean;
	searchPlaceholder?: string;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	rightSlot?: React.ReactNode;
	// Accept extra props used by the real component in other pages.
	onNavigate?: (page: string, id?: string) => void;
	onLogout?: () => void;
	onMenuClick?: () => void;
};
const SimpleTopBar = (props: SimpleTopBarProps) => (
	<div className='sticky top-0 z-10 border-b bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60'>
		<div className='mx-auto flex max-w-6xl items-center gap-3 px-4 py-3'>
			{props.onBack ? (
				<button
					type='button'
					onClick={props.onBack}
					className='rounded px-2 py-1 text-sm'>
					Back
				</button>
			) : null}
			<div className='min-w-0 flex-1'>
				<div className='truncate text-base font-semibold'>
					{props.title ?? 'Fleet'}
				</div>
				{props.showSearch ? (
					<div className='mt-2'>
						<input
							value={props.searchValue ?? ''}
							onChange={(e) => props.onSearchChange?.(e.target.value)}
							placeholder={props.searchPlaceholder ?? 'Search'}
							className='w-full rounded border px-3 py-2 text-sm'
						/>
					</div>
				) : null}
			</div>
			{props.rightSlot ? (
				<div className='shrink-0'>{props.rightSlot}</div>
			) : null}
		</div>
	</div>
);

type NewTruck = {
	plateNumber: string;
	type: string;
	capacity: string;
	driver: string;
};
const AddTruckModal = ({
	isOpen,
	onClose,
	onAdd,
	onSave,
}: {
	isOpen: boolean;
	onClose: () => void;
	onAdd?: (truck: NewTruck) => void;
	onSave?: (truck: NewTruck) => void;
}) => {
	if (!isOpen) return null;
	const [form, setForm] = useState<NewTruck>({
		plateNumber: '',
		type: '',
		capacity: '',
		driver: '',
	});
	return (
		<div className='fixed inset-0 z-50 grid place-items-center bg-black/40 p-4'>
			<div className='w-full max-w-md rounded-lg bg-white p-4 shadow'>
				<div className='flex items-center justify-between gap-3'>
					<div className='text-base font-semibold'>Add truck</div>
					<button
						type='button'
						onClick={onClose}
						className='rounded px-2 py-1 text-sm'>
						Close
					</button>
				</div>
				<div className='mt-4 grid gap-3'>
					<input
						value={form.plateNumber}
						onChange={(e) =>
							setForm((s) => ({ ...s, plateNumber: e.target.value }))
						}
						placeholder='Plate number'
						className='w-full rounded border px-3 py-2 text-sm'
					/>
					<input
						value={form.type}
						onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
						placeholder='Type'
						className='w-full rounded border px-3 py-2 text-sm'
					/>
					<input
						value={form.capacity}
						onChange={(e) =>
							setForm((s) => ({ ...s, capacity: e.target.value }))
						}
						placeholder='Capacity'
						className='w-full rounded border px-3 py-2 text-sm'
					/>
					<input
						value={form.driver}
						onChange={(e) => setForm((s) => ({ ...s, driver: e.target.value }))}
						placeholder='Driver'
						className='w-full rounded border px-3 py-2 text-sm'
					/>
				</div>
				<div className='mt-4 flex justify-end gap-2'>
					<button
						type='button'
						onClick={onClose}
						className='rounded border px-3 py-2 text-sm'>
						Cancel
					</button>
					<button
						type='button'
						onClick={() => {
							(onSave ?? onAdd)?.(form);
							onClose();
						}}
						className='rounded bg-black px-3 py-2 text-sm text-white'>
						Add
					</button>
				</div>
			</div>
		</div>
	);
};

const RemoveTruckModal = ({
	isOpen,
	onClose,
	onConfirm,
	vehicle,
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	vehicle?: { id: string; plateNumber?: string } | null;
}) => {
	if (!isOpen) return null;
	return (
		<div className='fixed inset-0 z-50 grid place-items-center bg-black/40 p-4'>
			<div className='w-full max-w-md rounded-lg bg-white p-4 shadow'>
				<div className='text-base font-semibold'>Remove truck</div>
				<div className='mt-2 text-sm text-gray-600'>
					Remove {vehicle?.plateNumber ?? 'this vehicle'}?
				</div>
				<div className='mt-4 flex justify-end gap-2'>
					<button
						type='button'
						onClick={onClose}
						className='rounded border px-3 py-2 text-sm'>
						Cancel
					</button>
					<button
						type='button'
						onClick={() => {
							onConfirm();
							onClose();
						}}
						className='rounded bg-red-600 px-3 py-2 text-sm text-white'>
						Remove
					</button>
				</div>
			</div>
		</div>
	);
};

const useLanguage = () => ({
	t: new Proxy(
		{},
		{
			get: (_target, prop) => String(prop),
		}
	) as Record<string, string>,
});

interface Vehicle {
	id: string;
	plateNumber: string;
	type: string;
	status: 'active' | 'idle' | 'maintenance';
	from: string;
	to?: string;
	currentLoad: string;
	capacity: string;
	driver: string;
}

const mockVehicles: Vehicle[] = [
	{
		id: '1',
		plateNumber: 'SD-752069247',
		type: 'Heavy Truck',
		status: 'active',
		from: 'Maputo',
		to: 'Beira',
		currentLoad: 'FMCG Products',
		capacity: '24 ton',
		driver: 'João Silva',
	},
	{
		id: '2',
		plateNumber: 'AL-113945307',
		type: 'Box Truck',
		status: 'active',
		from: 'Nampula',
		to: 'Nacala',
		currentLoad: 'Agriculture Inputs',
		capacity: '12 ton',
		driver: 'Maria Santos',
	},
	{
		id: '3',
		plateNumber: 'XR-936383762',
		type: 'Heavy Truck',
		status: 'idle',
		from: 'Beira (Depot)',
		currentLoad: 'Empty',
		capacity: '24 ton',
		driver: 'Carlos Mendes',
	},
	{
		id: '4',
		plateNumber: 'SD-752263347',
		type: 'Flatbed Truck',
		status: 'maintenance',
		from: 'Maputo (Workshop)',
		currentLoad: 'N/A',
		capacity: '18 ton',
		driver: 'Pedro Costa',
	},
	{
		id: '5',
		plateNumber: 'AL-118134203',
		type: 'Box Truck',
		status: 'active',
		from: 'Tete',
		to: 'Chimoio',
		currentLoad: 'Construction Materials',
		capacity: '15 ton',
		driver: 'Ana Ferreira',
	},
	{
		id: '6',
		plateNumber: 'XR-914427621',
		type: 'Heavy Truck',
		status: 'idle',
		from: 'Quelimane (Depot)',
		currentLoad: 'Empty',
		capacity: '22 ton',
		driver: 'José Pereira',
	},
	{
		id: '7',
		plateNumber: 'MT-338472195',
		type: 'Panel Van',
		status: 'active',
		from: 'Matola',
		to: 'Maputo City',
		currentLoad: 'Express Parcels',
		capacity: '3 ton',
		driver: 'Teresa Lopes',
	},
	{
		id: '8',
		plateNumber: 'TT-529164083',
		type: 'Box Van',
		status: 'active',
		from: 'Tete',
		to: 'Chimoio',
		currentLoad: 'Retail Goods',
		capacity: '8 ton',
		driver: 'Pedro Martins',
	},
	{
		id: '9',
		plateNumber: 'QM-637452891',
		type: 'Small Tanker',
		status: 'active',
		from: 'Quelimane',
		to: 'Beira',
		currentLoad: 'Fuel Transport',
		capacity: '18 ton',
		driver: 'Isabel Ferreira',
	},
	{
		id: '10',
		plateNumber: 'PM-741258963',
		type: 'Dump Truck',
		status: 'idle',
		from: 'Pemba (Depot)',
		currentLoad: 'Empty',
		capacity: '20 ton',
		driver: 'Manuel Souza',
	},
];

// Truck outline SVG components (unchanged from FleetTrucksPage.tsx)
const TruckOutlines = {
	'Truck Tractor': () => (
		<svg
			viewBox='0 0 700 450'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className='w-full h-full'>
			<g transform='translate(200, 120) scale(0.5)'>
				<path
					d='M123.31,113.43l-79.02.26-.69,82.46c-4.96,3.94-10.86,4.61-17.97,8.43-.22,24.08-1.27,47.53.44,72.49.33,4.88,15.66,6.65,18.29,2.59,6.09-15.66,10.45-35.32,25.85-45.49,3.17-2.09,11.21,7.82,8.93,10.83-11.68,15.41-17.85,31.44-18.71,51.6-10.53-.36-56.72,3.05-59.69-2.91-3.61-7.25,7.1-13.88,7.28-17.14,1.39-25.39-1.39-50.24,2.72-75.17,1.34-8.14,10.41-11.91,16.78-17.05l-.84-69.73c-.47-2.87-9.55-4.69-9.46-8.61.62-27.43,23.22-46.2,50.09-46.15l164.07.32c4.6,0,7.63,2.88,7.64,7.63l.06,165.24c0,2.02-1.12,4.25-1.77,5.12-1.25,1.69-11.44,1.1-12.26.64-1.26-.7-2.41-3.48-2.41-6.13l.1-155.51-161.88.32c-11.42.02-22.52,7.04-24.08,18.23l91.84.13c6.17,0,10.28,2.9,10.5,9.4.66,19.84.68,39.38,0,59.6l-64.55,24.79c-5.96,2.29-9.32,1.17-12.04-3.81s.53-9.16,6.15-11.25l54.12-20.1.5-41.04Z'
					fill='currentColor'
				/>
				<path
					d='M337.12,280.25c7.22-6.95,8.36-16.38,14.53-22.96,13.19-14.08,31.98-20.79,50.22-13.6,21.62,8.52,34.87,28.86,31.7,51.3-2.98,21.11-20.75,38.45-41.9,40.77-23.51,2.58-43.12-12.47-51.53-34.97-2.57-6.87-17.84-6.25-21.72-.74-4.83,6.87-6.44,17.82-16.26,19.01-21.46,2.6-43.76,3.05-65.29.56-9.63-1.11-13.08-13.63-15.92-21.62l-37.24-2.69c.24-20.36-6.66-38.65-21-51.86,4.52-4.23,7.4-7.61,12.85-10.34,12.98,12.11,20.71,28.29,23.46,46.72,7.26,2.23,14.44,1.36,22.24.38,2.61-6.55-.58-14.86,2.95-20.98,1.64-2.82,11.28-2.54,12.88.44l2.81,43.68,59.32.08,3.71-43.51c.3-3.55,12.12-3.27,13.72-.05,2.54,5.11-1.89,13.43,2.5,18.31,2.78,3.09,14.59,5.31,17.98,2.05ZM418.11,288.7c0-17.18-13.93-31.11-31.11-31.11s-31.11,13.93-31.11,31.11,13.93,31.11,31.11,31.11,31.11-13.93,31.11-31.11Z'
					fill='currentColor'
				/>
				<path
					d='M449.02,248.15c11.25,5.68,10.25,20.71,15.12,30.38,3.27,4.8,13.1,2.5,19.6,1.68l.2-58.49h-221.74c-1.03-5.55-1.53-10.52.88-15.55l100.19-1.07c5.18-1.94,5.46-17.48.91-20.15-3.39-1.99-9.62-2.51-11.27-5.22-1.46-2.41-1.77-10.85,1.29-11.09,24.7-1.96,49.03-.75,73.79-.63,5.83.03,6.12,5.39,6.14,9.14.03,5.05-5.21,4.48-9.2,7.39-5.63,4.09-4.53,14.78-3.25,20.83l77.91,1c.58,31.13,1.4,60.03-.5,90.19l-51.28-.19c-1.08-15.71-3.01-28.77-10.15-41.64,2.04-2.33,7.64-8.47,11.36-6.59ZM403.83,204.39c.75-8.44.86-13.7-1.05-19.8-6.39-1.18-11.64-1.14-18.1-.06-2.29,6.59-2.43,12.65-1.97,20.08,7.02,1.74,13.32,2.05,21.12-.21Z'
					fill='currentColor'
				/>
				<path
					d='M168.8,288.58c0,26.14-21.19,47.33-47.33,47.33s-47.33-21.19-47.33-47.33,21.19-47.33,47.33-47.33,47.33,21.19,47.33,47.33ZM152.62,288.63c0-17.2-13.94-31.14-31.14-31.14s-31.14,13.94-31.14,31.14,13.94,31.14,31.14,31.14,31.14-13.94,31.14-31.14Z'
					fill='currentColor'
				/>
				<path
					d='M220.03,17.7c-23.21-1.83-44.62-.06-66.31,2.91-51.1,7-70.65,38.04-79.94,26.2-2.14-2.73-.89-7,3.16-10.56C113.51,4.17,179.45-2.57,226.6.77c5.01.35,10.2,3.24,10.39,8.48.44,11.94,1.33,25.72-.76,37.58-1.92,3.3-11.93,3.47-14.31.88-2.89-8.05-.75-17.92-1.89-30.01Z'
					fill='currentColor'
				/>
			</g>
		</svg>
	),
	'Panel Van': () => (
		<svg
			viewBox='0 0 700 450'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className='w-full h-full'>
			<g transform='translate(190, 150) scale(0.5)'>
				<path
					d='M119.88,105.72c5.67-10.86.3-24.93,2.08-37.69l-41.6.46-.91,52.05-46.78,27.85c.06,24.58-.76,48.36,1.07,73.59.39,5.31,14.37,7.24,15.96,2.47,5.77-17.3,11.13-33.84,25.2-46.08,4.33,2.52,7.51,5.97,10.92,10.44-13.13,14.5-19.19,31.59-20.05,52.77-20.95.48-40.93,1.35-61.86-.2-3.57-.27-5.27-10.92-2.64-13.2,3.98-3.45,10.55-1.03,15.51-4.67l.42-83.72,46.19-28.12-.33-42.7c-7.3-2.61-18.18.95-22.49-4.78-4.42-5.87,3.34-14.54,4.89-20.09,3.69-13.19,11.61-20.89,24.18-25.29C106.27,5.99,143.26.72,183.01.64L488.57,0c14.44-.03,23.95,9.02,23.92,23.73l-.36,169.94c-.02,7.1-9.55,15.52-15.6,16.01-13.78,1.11-26.58,1.92-39.59-.89-3.4-1.06-1.53-11.39,1.33-13.28l39.08-2.03-.71-177.23-301.64.21c-40.95.03-79.61,4.24-117.67,16.77-8.33,2.74-16.14,8.65-16.27,17.32l70.82.8c3.39.04,5.88,2.89,5.97,6.38.47,19.71,1.09,38.8-.47,58.37l-40.18,21.86c-3.97-.04-10.94-8.76-7.17-11.39l29.86-20.85Z'
					fill='currentColor'
				/>
				<path
					d='M317.63,226.18c7.58.02,11.53.54,11.71,6.69.15,4.97-1.26,8.87-7.94,8.9l-149.02.65c-6.13,25.87-29.5,42.04-54.27,38.17-24.08-3.76-42.33-26.67-39.79-51.63,2.44-24.06,24.68-44.2,50.49-42.48,22.01,1.47,37.78,18.25,43.86,39.37l144.96.32ZM156.82,233.89c0-17.2-13.94-31.14-31.14-31.14s-31.14,13.94-31.14,31.14,13.94,31.14,31.14,31.14,31.14-13.94,31.14-31.14Z'
					fill='currentColor'
				/>
				<path
					d='M510.8,241.4l-69.4.83c-6.38,23.66-27.77,42.04-52.61,38.83-27.62-3.57-45.46-28.43-41.21-54.23,4.28-25.98,29.12-45.66,55.9-39.36,19.37,4.56,32.82,18.84,37.19,38.53l69.45.81c3.01,2.59,3.24,10.35.67,14.59ZM425.01,233.86c0-17.16-13.91-31.08-31.08-31.08s-31.08,13.91-31.08,31.08,13.91,31.08,31.08,31.08,31.08-13.91,31.08-31.08Z'
					fill='currentColor'
				/>
			</g>
		</svg>
	),
	'Box Van': () => (
		<svg
			viewBox='0 0 700 450'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className='w-full h-full'>
			<g transform='translate(160, 140) scale(0.5)'>
				<path
					d='M177.43,125.29l-2.1-57.65c-13.25-1.21-24.65-.65-37.8-.08l-49.15,67.09,54.08-16.71c3.35-1.04,5.9,2.56,6.44,4.61.67,2.55,1.65,8.97-2.15,10.26l-118.09,40.27.37,70.06c10.46,1.3,19.28,1.5,28.76.88,2.96-20.26,10.3-40.69,27.15-52.77,4.11-2.95,11.16,7.86,7.93,11.78-26.27,31.85-12.34,57.76-25.48,57.7l-62.42-.29c-4.62-.02-6.65-9.51-3.32-12.15s9.79-2.14,9.82-7.72l.44-76.43c10.05-10.11,41-11.46,50.45-23.93L149.26,25.46C161.44,9.38,178.13,0,199,0l393.56.14c13.44,0,29.34,9.81,29.39,23.61l.73,185.37c2.62,3.2,10.21,4.69,11.38,8.97,2.07,7.57,7,41.74-11.19,42.29l-40.71,1.23c-5.28,21.49-22.01,35.28-41.51,38-20.2,2.82-40.53-9.16-48.84-28.14-6.74-15.4-4.28-32.11,4.97-45.44,8.36-12.04,22.72-21.61,39.37-20.92,22.88.96,40.55,16.86,46.23,39.29,11.59.85,22.5.76,33.94-1.16,4.38-.73,3.23-9.35,2.15-13.14-.94-3.3-6.12-4.5-11.27-7.52l-.1-189.97c0-10.7-6.61-16.92-17.27-16.93l-385.36-.09c-27.13,0-40.34,12.25-53.1,34.72l30.63.9c2.85.08,10.06.9,10.31,4.54,1.55,22.32,1.01,44.9.08,67.62-2.61,3.56-10.89,3.03-14.99,1.91ZM566.58,252.69c0-17.19-13.94-31.13-31.13-31.13s-31.13,13.94-31.13,31.13,13.94,31.13,31.13,31.13,31.13-13.94,31.13-31.13Z'
					fill='currentColor'
				/>
				<path
					d='M472.89,245.08c3.56,4.29,3.24,11.39-.27,15.53l-288.79.53c-6.37,25.22-28.27,41.23-52.44,38.55-23.85-2.64-42.54-23.4-42.14-48.21.37-22.72,19.07-43.37,42.06-45.9,24.79-2.73,46.64,13.62,52.22,39.28l289.35.22ZM167.84,252.68c0-17.19-13.94-31.13-31.13-31.13s-31.13,13.94-31.13,31.13,13.94,31.13,31.13,31.13,31.13-13.94,31.13-31.13Z'
					fill='currentColor'
				/>
			</g>
		</svg>
	),
	'Small Tanker': () => (
		<svg
			viewBox='0 0 700 450'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className='w-full h-full'>
			<g transform='translate(140, 130) scale(0.5)'>
				<path
					d='M468.1,242.21l-1.85-35.86c-9.08-1.64-18-1.62-26.87-.07l-1.88,35.58c-1.81,3.1-10.07,2.04-13.89.81l-1.12-37.39-98.56-.13c-43.3-.06-79.53-26.3-95.42-66.95-12.13-31.03-8.32-65.29,12.02-94.69C256.17,20.9,285.22-.07,317.73,0l269.96.56c59,.12,103.16,57.78,95.5,114.12-7.44,54.75-52.81,90.42-106.03,90.59l-94.03.3-1.2,37.48c-3.33,1-12.05,2.31-13.82-.83ZM590.65,187.13c49.28-.08,80.42-49.65,76.26-92.71-4.6-47.67-43.57-79.47-91.42-79.38l-249.6.5c-43.33.09-77.57,27.86-86.17,70.59-9.96,49.45,26.8,101.56,80.22,101.47l270.71-.47Z'
					fill='currentColor'
				/>
				<path
					d='M81.1,101.48l-1.19,52.07-47.26,28.76,1.3,74.38c.65,4.22,14.99,4.59,16.27.49,5.08-16.24,10.24-33.04,23.71-44.02,2.63-2.14,5.46.75,7.1,1.73,2.07,1.23,5.48,6,3.11,8.84-12.31,14.79-17.44,31.51-18.38,51.47-21.46.24-41.72,1.2-62.74-.68-3.57-.32-4.02-11.24-1.05-12.97,3.98-2.32,8.79-1.35,14.03-3.26l.52-84.74,46.28-28.27c1.94-14.41,1.45-28.37,1.07-42.95-6.97-2-14.28,0-19.58-4.28-9.88-7.98,7.43-38.4,21.99-44.15,42.59-16.8,85.12-20.12,131.1-20.31,2.38,4.79,2.57,9.7,2.59,15.44l.71,170.58c12.37,1.36,22.74-1.36,33.97,1.29,4.45,1.05,4.37,13.4.24,14.03-16.69,2.53-32.75,1.65-50.46.48l-.89-185.62c-18-.02-122.33,6.72-123.15,33.96,24.06,1.72,45.89.46,68.37.82,5.71.09,9.52,2.65,9.63,8.52.37,19.06.7,37.26-.29,56.13-13.62,7.4-26.12,15.13-40.31,21.56-4.04,1.83-7.16-3.66-8.11-6.38-1.37-3.95,2.22-7.33,5.79-9.45l26.43-15.79c.51-13.29.83-25.22-.13-38.14l-40.67.47Z'
					fill='currentColor'
				/>
				<path
					d='M649.27,223.59c2.66,14.69.49,28.86,1.65,43.27.38,4.72-2.44,7.78-6.72,7.98l-32.53,1.47c-7.12,30.28-38.3,45.96-65.14,34.35-27.38-11.84-38.09-46.01-19.77-70.71,11.49-15.49,29.36-23.78,47.9-19.43,19.18,4.51,29.42,19.07,37.9,35.71,3.83,4.93,17.37,3.98,21.34,1.63,1.38-13.14-1.64-24.05,1.92-35.53,1.22-3.94,12.56-3.73,13.46,1.26ZM596.15,267.18c0-17.19-13.94-31.13-31.13-31.13s-31.13,13.94-31.13,31.13,13.94,31.13,31.13,31.13,31.13-13.94,31.13-31.13Z'
					fill='currentColor'
				/>
				<rect
					x='185.07'
					y='259.25'
					width='318.84'
					height='16.83'
					transform='translate(-.27 .35) rotate(-.06)'
					fill='currentColor'
				/>
				<path
					d='M172.84,267.13c0,26.09-21.15,47.25-47.25,47.25s-47.25-21.15-47.25-47.25,21.15-47.25,47.25-47.25,47.25,21.15,47.25,47.25ZM156.8,267.22c0-17.22-13.96-31.17-31.17-31.17s-31.17,13.96-31.17,31.17,13.96,31.17,31.17,31.17,31.17-13.96,31.17-31.17Z'
					fill='currentColor'
				/>
			</g>
		</svg>
	),
	'Dump Truck': () => (
		<svg
			viewBox='0 0 700 450'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className='w-full h-full'>
			<g transform='translate(125, 110) scale(0.5)'>
				<path
					d='M72.27,244.82c3.16-3.06,12.3,1.35,12.72,5.02-2.19,7.52-10.25,15.19-12.25,23.33l-7.04,28.52-50.93.49c-18.91.18-15.27-30.11-12.58-36.13,1.99-4.46,8.37-5.32,11.66-9.55l.85-58.74c.16-10.97,7.08-18.38,17.26-21.47l81.89-24.85.15-63.19-71.39.28c-.86,25.42,1.87,49.12-1.17,73.99-.49,3.97-10.81,3.66-14.66,3.01l-1.98-76.32c-.94-2.75-7.53-4.88-8.14-7.37-2.59-10.6,8.94-44.26,46.22-44.19l99.52.19c3.33,0,5.27,6.35,5.65,9.29l19.17,146.5c2.8,21.4,6.58,42.55,7.77,63.66-3.3,3.17-10.22,3.65-14.45,1.64l-28.33-204.72-94.55.34c-10.63.44-20.64,6.67-22.58,16.62l94.41.9.65,90.81-84.64,25.95c-3.95,1.21-14.11,3.42-14.28,8.14l-2.46,71.56c-4.64,4.25-15.33,7.42-12.65,16.84l36.01,1.22c3.86-15.5,8.1-30.11,20.17-41.81Z'
					fill='currentColor'
				/>
				<path
					d='M644.69,265.16c-11.55,3.25-21.25,1.11-31.92.98-6.2-.07-9.17-3.01-9.41-8.38-.57-12.78,24.13-4.67,28.9-7.33l48.93-146.61-28.85-30.13-394.59.38-37.11-57.69-99.26-.45c-2.79-4.19-2.08-10.35-.07-15.3L222.82,0c4.93-.03,8.17,1.99,10.68,6.02,10.89,17.45,20.62,34.44,33.39,51.69l389.41-.13c10.78,5.65,16.84,14.57,24.94,22.85,6,6.13,13.22,10.47,17.85,18.61l-54.4,166.12Z'
					fill='currentColor'
				/>
				<path
					d='M440.96,266.3l-211.51,1.03c-5.82.03-9.14-3.33-9.9-8.88l-20.14-147.4c-2.64-19.29-6.18-37.03-7.8-56.33-.36-4.3.69-7.89,4.18-9.58,2.63-1.27,6.39-2.02,9.37,1.16,3.19,8.36,4.23,16.83,5.52,26.25l24.14,177.4,206.36,1.02c4.99.02,3.76,12.08-.22,15.33Z'
					fill='currentColor'
				/>
				<path
					d='M181.64,302.17c-3.92-4.53-2.25-10.43-1.02-15.81l267.96-.32c2.97-19.29,11.31-33.69,23.34-45.19,3.56,4.79,7.5,6.87,9.96,11.64-12.83,14-18.26,31.25-17.33,49.61l-282.9.07Z'
					fill='currentColor'
				/>
				<path
					d='M568.59,294.1c0,24.4-19.78,44.17-44.17,44.17s-44.17-19.78-44.17-44.17,19.78-44.17,44.17-44.17,44.17,19.78,44.17,44.17ZM552.54,294.22c0-15.5-12.56-28.06-28.06-28.06s-28.06,12.56-28.06,28.06,12.56,28.06,28.06,28.06,28.06-12.56,28.06-28.06Z'
					fill='currentColor'
				/>
				<path
					d='M166.87,294.25c0,24.37-19.76,44.13-44.13,44.13s-44.13-19.76-44.13-44.13,19.76-44.13,44.13-44.13,44.13,19.76,44.13,44.13ZM150.85,294.07c0-15.5-12.56-28.06-28.06-28.06s-28.06,12.56-28.06,28.06,12.56,28.06,28.06,28.06,28.06-12.56,28.06-28.06Z'
					fill='currentColor'
				/>
				<path
					d='M640.7,287.24c3.8.19,2.88,11.23,0,13.82-17.57,1.63-36.96,1.28-56.12.06,1.28-19.03-5.47-33.14-16.39-47.62-2.95-3.91,8.11-12.5,11.63-9.27,11.33,10.41,17.48,25.43,21.01,41.05l39.88,1.95Z'
					fill='currentColor'
				/>
			</g>
		</svg>
	),
	'Heavy Truck': () => (
		<svg
			viewBox='0 0 480 150'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className='w-full h-full'>
			<rect
				x='100'
				y='30'
				width='370'
				height='70'
				rx='4'
				stroke='currentColor'
				strokeWidth='2.5'
				fill='none'
			/>
			<path
				d='M20 50 L20 90 L40 90 L40 100 L60 100 L60 90 L90 90 L90 30 L100 30'
				stroke='currentColor'
				strokeWidth='2.5'
				fill='none'
			/>
			<rect
				x='25'
				y='55'
				width='20'
				height='20'
				rx='2'
				stroke='currentColor'
				strokeWidth='2'
				fill='none'
			/>
			<line
				x1='30'
				y1='80'
				x2='45'
				y2='80'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<circle
				cx='70'
				cy='105'
				r='12'
				stroke='currentColor'
				strokeWidth='2.5'
				fill='none'
			/>
			<circle cx='70' cy='105' r='6' stroke='currentColor' strokeWidth='2' />
			<circle
				cx='210'
				cy='105'
				r='12'
				stroke='currentColor'
				strokeWidth='2.5'
				fill='none'
			/>
			<circle cx='210' cy='105' r='6' stroke='currentColor' strokeWidth='2' />
			<circle
				cx='320'
				cy='105'
				r='12'
				stroke='currentColor'
				strokeWidth='2.5'
				fill='none'
			/>
			<circle cx='320' cy='105' r='6' stroke='currentColor' strokeWidth='2' />
			<circle
				cx='420'
				cy='105'
				r='12'
				stroke='currentColor'
				strokeWidth='2.5'
				fill='none'
			/>
			<circle cx='420' cy='105' r='6' stroke='currentColor' strokeWidth='2' />
			<line
				x1='60'
				y1='100'
				x2='58'
				y2='105'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<line
				x1='198'
				y1='100'
				x2='196'
				y2='105'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<line
				x1='308'
				y1='100'
				x2='306'
				y2='105'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<line
				x1='408'
				y1='100'
				x2='406'
				y2='105'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<line
				x1='10'
				y1='118'
				x2='475'
				y2='118'
				stroke='currentColor'
				strokeWidth='2'
				strokeDasharray='4 4'
				opacity='0.3'
			/>
		</svg>
	),
	'Box Truck': () => (
		<svg
			viewBox='0 0 400 150'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className='w-full h-full'>
			<rect
				x='120'
				y='35'
				width='260'
				height='65'
				rx='4'
				stroke='currentColor'
				strokeWidth='2.5'
				fill='none'
			/>
			<path
				d='M20 55 L20 90 L40 90 L40 100 L60 100 L60 90 L110 90 L110 35 L120 35'
				stroke='currentColor'
				strokeWidth='2.5'
				fill='none'
			/>
			<rect
				x='25'
				y='60'
				width='18'
				height='18'
				rx='2'
				stroke='currentColor'
				strokeWidth='2'
				fill='none'
			/>
			<line
				x1='30'
				y1='85'
				x2='43'
				y2='85'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<circle
				cx='70'
				cy='105'
				r='12'
				stroke='currentColor'
				strokeWidth='2.5'
				fill='none'
			/>
			<circle cx='70' cy='105' r='6' stroke='currentColor' strokeWidth='2' />
			<circle
				cx='190'
				cy='105'
				r='12'
				stroke='currentColor'
				strokeWidth='2.5'
				fill='none'
			/>
			<circle cx='190' cy='105' r='6' stroke='currentColor' strokeWidth='2' />
			<circle
				cx='340'
				cy='105'
				r='12'
				stroke='currentColor'
				strokeWidth='2.5'
				fill='none'
			/>
			<circle cx='340' cy='105' r='6' stroke='currentColor' strokeWidth='2' />
			<rect
				x='300'
				y='70'
				width='50'
				height='20'
				rx='2'
				stroke='currentColor'
				strokeWidth='2'
				fill='none'
			/>
			<line
				x1='10'
				y1='118'
				x2='390'
				y2='118'
				stroke='currentColor'
				strokeWidth='2'
				strokeDasharray='4 4'
				opacity='0.3'
			/>
		</svg>
	),
	'Flatbed Truck': () => (
		<svg
			viewBox='0 0 450 150'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className='w-full h-full'>
			<line
				x1='110'
				y1='50'
				x2='440'
				y2='50'
				stroke='currentColor'
				strokeWidth='3'
			/>
			<line
				x1='110'
				y1='90'
				x2='440'
				y2='90'
				stroke='currentColor'
				strokeWidth='3'
			/>
			<line
				x1='110'
				y1='50'
				x2='110'
				y2='90'
				stroke='currentColor'
				strokeWidth='2.5'
			/>
			<line
				x1='200'
				y1='50'
				x2='200'
				y2='90'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<line
				x1='290'
				y1='50'
				x2='290'
				y2='90'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<line
				x1='380'
				y1='50'
				x2='380'
				y2='90'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<line
				x1='440'
				y1='50'
				x2='440'
				y2='90'
				stroke='currentColor'
				strokeWidth='2.5'
			/>
			<path
				d='M20 55 L20 85 L40 85 L40 95 L60 95 L60 85 L100 85 L100 35 L110 35 L110 50'
				stroke='currentColor'
				strokeWidth='2.5'
				fill='none'
			/>
			<rect
				x='25'
				y='60'
				width='18'
				height='16'
				rx='2'
				stroke='currentColor'
				strokeWidth='2'
				fill='none'
			/>
			<line
				x1='30'
				y1='82'
				x2='43'
				y2='82'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<circle
				cx='70'
				cy='105'
				r='12'
				stroke='currentColor'
				strokeWidth='2.5'
				fill='none'
			/>
			<circle cx='70' cy='105' r='6' stroke='currentColor' strokeWidth='2' />
			<circle
				cx='200'
				cy='105'
				r='12'
				stroke='currentColor'
				strokeWidth='2.5'
				fill='none'
			/>
			<circle cx='200' cy='105' r='6' stroke='currentColor' strokeWidth='2' />
			<circle
				cx='380'
				cy='105'
				r='12'
				stroke='currentColor'
				strokeWidth='2.5'
				fill='none'
			/>
			<circle cx='380' cy='105' r='6' stroke='currentColor' strokeWidth='2' />
			<line
				x1='10'
				y1='118'
				x2='445'
				y2='118'
				stroke='currentColor'
				strokeWidth='2'
				strokeDasharray='4 4'
				opacity='0.3'
			/>
		</svg>
	),
} as const;

const stats = [
	{ label: 'Total Fleet', value: '24', color: 'accent' },
	{ label: 'Active', value: '12', color: 'green' },
	{ label: 'Idle', value: '10', color: 'gray' },
	{ label: 'Maintenance', value: '2', color: 'orange' },
] as const;

const accentColor = '#ff5722';

interface FleetTrucksPageProps {
	onNavigate?: (
		page: 'preferences' | 'profile' | 'support' | string,
		id?: string
	) => void;
	onLogout?: () => void;
	onMenuClick?: () => void;
}

export default function Page({
	onNavigate,
	onLogout,
	onMenuClick,
}: FleetTrucksPageProps) {
	const { t } = useLanguage();
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<'all' | Vehicle['status']>(
		'all'
	);
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
	const [isAddTruckModalOpen, setIsAddTruckModalOpen] = useState(false);
	const [isRemoveTruckModalOpen, setIsRemoveTruckModalOpen] = useState(false);

	const handleSaveTruck = (truck: NewTruck) => {
		console.log('New truck added:', truck);
		// TODO: wire to backend when API exists
	};

	const filteredVehicles = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		return mockVehicles.filter((vehicle) => {
			const matchesSearch =
				vehicle.plateNumber.toLowerCase().includes(q) ||
				vehicle.driver.toLowerCase().includes(q) ||
				vehicle.currentLoad.toLowerCase().includes(q);

			const matchesStatus =
				statusFilter === 'all' || vehicle.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [searchQuery, statusFilter]);

	const getStatusColor = (status: Vehicle['status']) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
			case 'idle':
				return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
			case 'maintenance':
				return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
			default:
				return 'bg-gray-100 text-gray-700';
		}
	};

	const getStatusText = (status: Vehicle['status']) => {
		switch (status) {
			case 'active':
				return 'Active';
			case 'idle':
				return 'Idle';
			case 'maintenance':
				return 'Maintenance';
			default:
				return status;
		}
	};

	return (
		<div className='flex-1 flex flex-col overflow-hidden'>
			<div className='flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto'>
				<div className='px-4 md:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto'>
					<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
						<div>
							<h1 className='text-2xl text-gray-900 dark:text-white'>Trucks</h1>
							<p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
								{t.manageTruckFleet}
							</p>
						</div>

						<div className='flex items-center gap-3'>
							<div className='flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg'>
								<button
									type='button'
									onClick={() => setViewMode('grid')}
									className={`p-2 rounded transition-colors ${
										viewMode === 'grid'
											? 'bg-white dark:bg-gray-700 text-[#ff5722] dark:text-[#ff8a65] shadow-sm'
											: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
									}`}
									aria-pressed={viewMode === 'grid'}>
									<Grid3x3 className='w-4 h-4' />
								</button>
								<button
									type='button'
									onClick={() => setViewMode('list')}
									className={`p-2 rounded transition-colors ${
										viewMode === 'list'
											? 'bg-white dark:bg-gray-700 text-[#ff5722] dark:text-[#ff8a65] shadow-sm'
											: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
									}`}
									aria-pressed={viewMode === 'list'}>
									<List className='w-4 h-4' />
								</button>
							</div>

							<button
								type='button'
								onClick={() => setIsAddTruckModalOpen(true)}
								className='px-4 py-2 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2'>
								<Plus className='w-4 h-4' />
								<span className='hidden md:inline'>Add New Truck</span>
								<span className='md:hidden'>Add</span>
							</button>
						</div>
					</div>

					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						{stats.map((stat, index) => {
							const isAccentColor = stat.color === 'accent';
							return (
								<div
									key={index}
									className='bg-white dark:bg-gray-800 rounded-xl border-2 p-4'
									style={
										isAccentColor
											? {
													borderColor: accentColor,
													backgroundColor: `${accentColor}10`,
											  }
											: undefined
									}>
									<p className='text-xs text-gray-600 dark:text-gray-400 mb-1'>
										{stat.label}
									</p>
									<p
										className='text-2xl font-semibold dark:text-white'
										style={isAccentColor ? { color: accentColor } : undefined}>
										{stat.value}
									</p>
								</div>
							);
						})}
					</div>

					<div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4'>
						<div className='flex flex-col md:flex-row gap-4'>
							<div className='flex-1 relative'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' />
								<input
									type='search'
									placeholder='Search by plate number, driver, or cargo...'
									aria-label='Search trucks'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className='w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff5722] focus:border-transparent'
								/>
							</div>

							<div className='inline-flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-full flex-wrap'>
								<button
									type='button'
									onClick={() => setStatusFilter('all')}
									className={`px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap ${
										statusFilter === 'all'
											? 'bg-white dark:bg-gray-600 font-medium shadow-sm text-[#ff5722]'
											: 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
									}`}>
									All
								</button>
								<button
									type='button'
									onClick={() => setStatusFilter('active')}
									className={`px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap ${
										statusFilter === 'active'
											? 'bg-white dark:bg-gray-600 font-medium shadow-sm text-[#ff5722]'
											: 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
									}`}>
									Active
								</button>
								<button
									type='button'
									onClick={() => setStatusFilter('idle')}
									className={`px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap ${
										statusFilter === 'idle'
											? 'bg-white dark:bg-gray-600 font-medium shadow-sm text-[#ff5722]'
											: 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
									}`}>
									Idle
								</button>
								<button
									type='button'
									onClick={() => setStatusFilter('maintenance')}
									className={`px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap ${
										statusFilter === 'maintenance'
											? 'bg-white dark:bg-gray-600 font-medium shadow-sm text-[#ff5722]'
											: 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
									}`}>
									Maintenance
								</button>
							</div>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<button
							type='button'
							onClick={() => setIsAddTruckModalOpen(true)}
							className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-md hover:border-[#ff5722] transition-all text-left'>
							<div className='w-10 h-10 rounded-lg bg-[#ff5722]/10 text-[#ff5722] flex items-center justify-center mb-3'>
								<Truck className='w-5 h-5' />
							</div>
							<p className='text-gray-900 dark:text-white font-medium mb-1'>
								Add New Truck
							</p>
							<p className='text-xs text-gray-600 dark:text-gray-400'>
								Register a new truck in your fleet
							</p>
						</button>

						<button
							type='button'
							onClick={() => setIsRemoveTruckModalOpen(true)}
							className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-md hover:border-[#ff5722] transition-all text-left'>
							<div className='w-10 h-10 rounded-lg bg-[#ff5722]/10 text-[#ff5722] flex items-center justify-center mb-3'>
								<Trash2 className='w-5 h-5' />
							</div>
							<p className='text-gray-900 dark:text-white font-medium mb-1'>
								Remove a Truck
							</p>
							<p className='text-xs text-gray-600 dark:text-gray-400'>
								Deregister a truck from your fleet
							</p>
						</button>

						<button
							type='button'
							onClick={() => onNavigate?.('map')}
							className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-md hover:border-[#ff5722] transition-all text-left'>
							<div className='w-10 h-10 rounded-lg bg-[#ff5722]/10 text-[#ff5722] flex items-center justify-center mb-3'>
								<MapPin className='w-5 h-5' />
							</div>
							<p className='text-gray-900 dark:text-white font-medium mb-1'>
								View Fleet Map
							</p>
							<p className='text-xs text-gray-600 dark:text-gray-400'>
								Real-time location of all vehicles
							</p>
						</button>
					</div>

					{viewMode === 'grid' ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
							{filteredVehicles.map((vehicle) => (
								<div
									key={vehicle.id}
									className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md hover:border-[#ff5722] transition-all flex flex-col'>
									<div className='relative h-40 bg-gray-50 dark:bg-gray-800 overflow-hidden flex items-center justify-center p-6'>
										<div className='text-[#ff5722]'>
											{TruckOutlines[
												vehicle.type as keyof typeof TruckOutlines
											]?.()}
										</div>
										<div className='absolute top-3 right-3'>
											<span
												className={`px-2 py-1 rounded-full text-xs backdrop-blur-sm ${getStatusColor(
													vehicle.status
												)}`}>
												{getStatusText(vehicle.status)}
											</span>
										</div>
									</div>

									<div className='p-4 flex flex-col flex-1'>
										<div className='mb-3'>
											<p className='text-xs text-gray-500 dark:text-gray-400'>
												{vehicle.plateNumber}
											</p>
											<p className='text-sm font-medium text-gray-900 dark:text-white mt-0.5'>
												{vehicle.type}
											</p>
										</div>

										<div className='space-y-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700'>
											{vehicle.to ? (
												<>
													<div className='flex items-center gap-2'>
														<div className='w-2 h-2 rounded-full bg-green-500 shrink-0' />
														<p className='text-sm text-gray-900 dark:text-white'>
															{vehicle.from}
														</p>
													</div>
													<div className='flex items-center gap-2'>
														<div className='w-2 h-2 rounded-full bg-red-500 shrink-0' />
														<p className='text-sm text-gray-900 dark:text-white'>
															{vehicle.to}
														</p>
													</div>
												</>
											) : (
												<div className='flex items-center gap-2'>
													<MapPin className='w-4 h-4 shrink-0 text-[#ff5722]' />
													<p className='text-sm text-gray-900 dark:text-white'>
														{vehicle.from}
													</p>
												</div>
											)}
										</div>

										<div className='space-y-2 text-xs text-gray-600 dark:text-gray-400 mb-3'>
											<div className='flex items-center justify-between'>
												<span>Current Load:</span>
												<span className='text-gray-900 dark:text-white'>
													{vehicle.currentLoad}
												</span>
											</div>
											<div className='flex items-center justify-between'>
												<span>Capacity:</span>
												<span className='text-gray-900 dark:text-white'>
													{vehicle.capacity}
												</span>
											</div>
											<div className='flex items-center justify-between'>
												<span>Driver:</span>
												<span className='text-gray-900 dark:text-white'>
													{vehicle.driver}
												</span>
											</div>
										</div>

										<div className='flex-1' />

										<div className='flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700'>
											<button
												type='button'
												className='flex-1 px-3 py-2 bg-[#ff5722]/10 hover:bg-[#ff5722]/20 text-[#ff5722] rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1'>
												<Truck className='w-4 h-4' />
												Details
											</button>
											{vehicle.status === 'active' && (
												<button
													type='button'
													className='flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1'>
													<Navigation className='w-4 h-4' />
													Track
												</button>
											)}
											{vehicle.status === 'idle' && (
												<button
													type='button'
													className='flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1'>
													<Package className='w-4 h-4' />
													Assign
												</button>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className='lg:space-y-3'>
							<div className='lg:hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden divide-y divide-gray-200 dark:divide-gray-700'>
								{filteredVehicles.map((vehicle) => (
									<div
										key={vehicle.id}
										className='w-full hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
										<div className='p-3'>
											<div className='flex items-center gap-2 mb-2'>
												<div className='w-12 h-10 shrink-0 text-[#ff5722]'>
													{TruckOutlines[
														vehicle.type as keyof typeof TruckOutlines
													]?.()}
												</div>
												<div className='flex-1 min-w-0'>
													<p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
														{vehicle.plateNumber}
													</p>
													<div className='flex items-center gap-2 mt-0.5'>
														<span
															className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(
																vehicle.status
															)}`}>
															{getStatusText(vehicle.status)}
														</span>
														<span className='text-xs text-gray-500 dark:text-gray-400 truncate'>
															{vehicle.type}
														</span>
													</div>
												</div>
											</div>

											<div className='space-y-1 text-xs'>
												<div className='flex items-center justify-between'>
													<span className='text-gray-500 dark:text-gray-400 truncate flex-1'>
														{vehicle.to
															? `${vehicle.from} → ${vehicle.to}`
															: vehicle.from}
													</span>
												</div>
												<div className='flex items-center justify-between gap-2'>
													<div className='truncate'>
														<span className='text-gray-500 dark:text-gray-400'>
															Load:{' '}
														</span>
														<span className='text-gray-900 dark:text-white font-medium'>
															{vehicle.currentLoad}
														</span>
													</div>
													<div className='truncate text-right'>
														<span className='text-gray-500 dark:text-gray-400'>
															Cap:{' '}
														</span>
														<span className='text-gray-900 dark:text-white font-medium'>
															{vehicle.capacity}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>

							{filteredVehicles.map((vehicle) => (
								<div
									key={vehicle.id}
									className='hidden lg:block w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-5 hover:border-[#ff5722] hover:shadow-md transition-all'>
									<div className='flex flex-col md:flex-row md:items-center gap-4'>
										<div className='flex items-center gap-3 md:w-80 shrink-0'>
											<div className='w-24 h-16 shrink-0 text-[#ff5722]'>
												{TruckOutlines[
													vehicle.type as keyof typeof TruckOutlines
												]?.()}
											</div>
											<div className='flex-1 min-w-0'>
												<p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
													{vehicle.plateNumber}
												</p>
												<p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
													{vehicle.type}
												</p>
												<span
													className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(
														vehicle.status
													)}`}>
													{getStatusText(vehicle.status)}
												</span>
											</div>
										</div>

										<div className='flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4'>
											<div>
												<div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
													Location
												</div>
												<div className='text-sm text-gray-900 dark:text-white'>
													{vehicle.to
														? `${vehicle.from} → ${vehicle.to}`
														: vehicle.from}
												</div>
											</div>
											<div>
												<div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
													Current Load
												</div>
												<div className='text-sm text-gray-900 dark:text-white truncate'>
													{vehicle.currentLoad}
												</div>
											</div>
											<div>
												<div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
													Driver
												</div>
												<div className='text-sm text-gray-900 dark:text-white truncate'>
													{vehicle.driver}
												</div>
											</div>
										</div>

										<div className='flex items-center gap-4 md:w-auto'>
											<div className='text-center'>
												<div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
													Capacity
												</div>
												<div className='text-sm font-medium text-gray-900 dark:text-white'>
													{vehicle.capacity}
												</div>
											</div>
											<div className='flex gap-2'>
												<button
													type='button'
													className='px-3 py-2 bg-[#ff5722]/10 hover:bg-[#ff5722]/20 text-[#ff5722] rounded-lg text-xs font-medium transition-colors'>
													Details
												</button>
												{vehicle.status === 'active' && (
													<button
														type='button'
														className='px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium transition-colors'>
														Track
													</button>
												)}
												{vehicle.status === 'idle' && (
													<button
														type='button'
														className='px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium transition-colors'>
														Assign
													</button>
												)}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			<AddTruckModal
				isOpen={isAddTruckModalOpen}
				onClose={() => setIsAddTruckModalOpen(false)}
				onSave={handleSaveTruck}
			/>

			<RemoveTruckModal
				isOpen={isRemoveTruckModalOpen}
				onClose={() => setIsRemoveTruckModalOpen(false)}
				onConfirm={() => {
					console.log('Removing truck');
					// TODO: wire to backend when API exists
				}}
			/>
		</div>
	);
}
