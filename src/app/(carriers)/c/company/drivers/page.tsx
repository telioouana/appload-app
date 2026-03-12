// export default function Page() {
//     return (
//         <div>Drivers</div>
//     )
// }
'use client';

import React, { useMemo, useState } from 'react';

type IconProps = {
	className?: string;
};

function AwardIcon({ className }: IconProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			aria-hidden='true'>
			<path
				d='M12 2a7 7 0 0 0-4 12.75V22l4-2 4 2v-7.25A7 7 0 0 0 12 2Z'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path
				d='m9.5 9.5 1.5 1.5 3-3'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	);
}

function CheckCircleIcon({ className }: IconProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			aria-hidden='true'>
			<path
				d='M22 11.08V12a10 10 0 1 1-5.93-9.14'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path
				d='m22 4-10 10-3-3'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	);
}

function ClockIcon({ className }: IconProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			aria-hidden='true'>
			<circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' />
			<path
				d='M12 6v6l4 2'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	);
}

function Grid3x3Icon({ className }: IconProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			aria-hidden='true'>
			<rect
				x='3'
				y='3'
				width='7'
				height='7'
				rx='1'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<rect
				x='14'
				y='3'
				width='7'
				height='7'
				rx='1'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<rect
				x='3'
				y='14'
				width='7'
				height='7'
				rx='1'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<rect
				x='14'
				y='14'
				width='7'
				height='7'
				rx='1'
				stroke='currentColor'
				strokeWidth='2'
			/>
		</svg>
	);
}

function ListIcon({ className }: IconProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			aria-hidden='true'>
			<path
				d='M8 6h13'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
			<path
				d='M8 12h13'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
			<path
				d='M8 18h13'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
			<path
				d='M3 6h.01'
				stroke='currentColor'
				strokeWidth='3'
				strokeLinecap='round'
			/>
			<path
				d='M3 12h.01'
				stroke='currentColor'
				strokeWidth='3'
				strokeLinecap='round'
			/>
			<path
				d='M3 18h.01'
				stroke='currentColor'
				strokeWidth='3'
				strokeLinecap='round'
			/>
		</svg>
	);
}

function MailIcon({ className }: IconProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			aria-hidden='true'>
			<rect
				x='3'
				y='5'
				width='18'
				height='14'
				rx='2'
				stroke='currentColor'
				strokeWidth='2'
			/>
			<path
				d='m3 7 9 6 9-6'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	);
}

function MapPinIcon({ className }: IconProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			aria-hidden='true'>
			<path
				d='M12 22s7-4.5 7-12a7 7 0 0 0-14 0c0 7.5 7 12 7 12Z'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinejoin='round'
			/>
			<circle cx='12' cy='10' r='2.5' stroke='currentColor' strokeWidth='2' />
		</svg>
	);
}

function PhoneIcon({ className }: IconProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			aria-hidden='true'>
			<path
				d='M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12.86.32 1.7.59 2.51a2 2 0 0 1-.45 2.11L9.1 10.9a16 16 0 0 0 4 4l1.56-1.04a2 2 0 0 1 2.11-.45c.81.27 1.65.47 2.51.59A2 2 0 0 1 22 16.92Z'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	);
}

function PlusIcon({ className }: IconProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			aria-hidden='true'>
			<path
				d='M12 5v14'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
			<path
				d='M5 12h14'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
		</svg>
	);
}

function SearchIcon({ className }: IconProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			aria-hidden='true'>
			<circle cx='11' cy='11' r='8' stroke='currentColor' strokeWidth='2' />
			<path
				d='m21 21-4.3-4.3'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
		</svg>
	);
}

function StarIcon({ className }: IconProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			aria-hidden='true'>
			<path
				d='m12 2 3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 17.77 5.82 21l1.18-6.87-5-4.87 6.91-1L12 2Z'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinejoin='round'
			/>
		</svg>
	);
}

function Trash2Icon({ className }: IconProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			aria-hidden='true'>
			<path
				d='M3 6h18'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
			<path
				d='M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinejoin='round'
			/>
			<path
				d='M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinejoin='round'
			/>
			<path
				d='M10 11v6'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
			<path
				d='M14 11v6'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
		</svg>
	);
}

function TrendingUpIcon({ className }: IconProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			aria-hidden='true'>
			<path
				d='m22 7-8.5 8.5-5-5L2 17'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path
				d='M16 7h6v6'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
		</svg>
	);
}

function TruckIcon({ className }: IconProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			aria-hidden='true'>
			<path
				d='M14 7h3l4 4v6h-2'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinejoin='round'
			/>
			<path
				d='M3 17V5a2 2 0 0 1 2-2h9v14H3Z'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinejoin='round'
			/>
			<path
				d='M3 17h2'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
			<path
				d='M14 17h4'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
			<circle cx='7' cy='17' r='2' stroke='currentColor' strokeWidth='2' />
			<circle cx='17' cy='17' r='2' stroke='currentColor' strokeWidth='2' />
		</svg>
	);
}

function UserIcon({ className }: IconProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			aria-hidden='true'>
			<path
				d='M20 21a8 8 0 0 0-16 0'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
			<circle cx='12' cy='7' r='4' stroke='currentColor' strokeWidth='2' />
		</svg>
	);
}

// Local fallbacks for missing components so this page compiles in isolation.

type NewDriver = {
	name: string;
	email: string;
	phone: string;
};

function SimpleTopBar({
	title,
	onNavigate,
	onLogout,
}: {
	title: string;
	onNavigate?: (
		page: 'preferences' | 'profile' | 'support' | string,
		driverId?: string
	) => void;
	onLogout?: () => void;
}) {
	return (
		<header className='flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'>
			<h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
				{title}
			</h2>
			<div className='flex items-center gap-2'>
				<button
					type='button'
					className='text-sm'
					onClick={() => onNavigate?.('profile')}>
					Profile
				</button>
				<button type='button' className='text-sm' onClick={onLogout}>
					Logout
				</button>
			</div>
		</header>
	);
}

function AddDriverModal({
	isOpen,
	onClose,
	onSave,
}: {
	isOpen: boolean;
	onClose: () => void;
	onSave: (driver: NewDriver) => void;
}) {
	if (!isOpen) return null;
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
			<div className='absolute inset-0 bg-black/40' onClick={onClose} />
			<div className='relative w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-4'>
				<div className='flex items-center justify-between mb-3'>
					<h3 className='text-sm font-semibold text-gray-900 dark:text-white'>
						Add Driver
					</h3>
					<button type='button' className='text-sm' onClick={onClose}>
						Close
					</button>
				</div>
				<button
					type='button'
					className='px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-sm'
					onClick={() => onSave({ name: '', email: '', phone: '' })}>
					Save (stub)
				</button>
			</div>
		</div>
	);
}

function RemoveDriverModal({
	isOpen,
	onClose,
	drivers,
	onRemove,
}: {
	isOpen: boolean;
	onClose: () => void;
	drivers: Array<{
		id: string;
		name: string;
		email: string;
		assignedTruck?: string;
	}>;
	onRemove: (driverIds: string[]) => void;
}) {
	if (!isOpen) return null;
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
			<div className='absolute inset-0 bg-black/40' onClick={onClose} />
			<div className='relative w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-4'>
				<div className='flex items-center justify-between mb-3'>
					<h3 className='text-sm font-semibold text-gray-900 dark:text-white'>
						Remove Driver
					</h3>
					<button type='button' className='text-sm' onClick={onClose}>
						Close
					</button>
				</div>
				<p className='text-xs text-gray-600 dark:text-gray-400 mb-3'>
					{drivers.length} drivers
				</p>
				<button
					type='button'
					className='px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-sm'
					onClick={() => onRemove(drivers.slice(0, 1).map((d) => d.id))}>
					Remove (stub)
				</button>
			</div>
		</div>
	);
}

// Local fallback to keep this page self-contained (matches approach used in clients page).
const useLanguage = () => ({
	t: {
		manageDriverRoster: 'Manage your driver roster',
	},
});

interface Driver {
	id: string;
	name: string;
	email: string;
	phone: string;
	status: 'active' | 'off-duty' | 'on-break';
	rating: number;
	totalTrips: number;
	location: string;
	assignedTruck?: string;
	experience: string;
	profileImage?: string;
}

const mockDrivers: Driver[] = [
	{
		id: '1',
		name: 'João Silva',
		email: 'joao.silva@carrier.com',
		phone: '+258 84 123 4567',
		status: 'active',
		rating: 4.8,
		totalTrips: 342,
		location: 'En route to Beira',
		assignedTruck: 'SD-752069247',
		experience: '8 years',
		profileImage:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
	},
	{
		id: '2',
		name: 'Maria Santos',
		email: 'maria.santos@carrier.com',
		phone: '+258 84 234 5678',
		status: 'active',
		rating: 4.9,
		totalTrips: 287,
		location: 'En route to Nacala',
		assignedTruck: 'AL-113945307',
		experience: '6 years',
		profileImage:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
	},
	{
		id: '3',
		name: 'Carlos Mendes',
		email: 'carlos.mendes@carrier.com',
		phone: '+258 84 345 6789',
		status: 'off-duty',
		rating: 4.7,
		totalTrips: 421,
		location: 'Beira Depot',
		assignedTruck: 'XR-936383762',
		experience: '12 years',
		profileImage:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
	},
	{
		id: '4',
		name: 'Pedro Costa',
		email: 'pedro.costa@carrier.com',
		phone: '+258 84 456 7890',
		status: 'on-break',
		rating: 4.6,
		totalTrips: 198,
		location: 'Maputo',
		assignedTruck: 'SD-752263347',
		experience: '4 years',
		profileImage:
			'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
	},
	{
		id: '5',
		name: 'Ana Ferreira',
		email: 'ana.ferreira@carrier.com',
		phone: '+258 84 567 8901',
		status: 'active',
		rating: 4.9,
		totalTrips: 315,
		location: 'En route to Chimoio',
		assignedTruck: 'AL-118134203',
		experience: '7 years',
		profileImage:
			'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
	},
	{
		id: '6',
		name: 'José Pereira',
		email: 'jose.pereira@carrier.com',
		phone: '+258 84 678 9012',
		status: 'off-duty',
		rating: 4.5,
		totalTrips: 256,
		location: 'Quelimane Depot',
		assignedTruck: 'XR-914427621',
		experience: '5 years',
		profileImage:
			'https://images.unsplash.com/photo-1472099645785-5658abf4e?w=400',
	},
];

const stats = [
	{ label: 'Total Drivers', value: '24', color: 'accent' },
	{ label: 'Active', value: '12', color: 'green' },
	{ label: 'Off Duty', value: '10', color: 'gray' },
	{ label: 'On Break', value: '2', color: 'orange' },
] as const;

const accentColor = '#ff5722';

interface FleetDriversPageProps {
	onNavigate?: (
		page: 'preferences' | 'profile' | 'support' | string,
		driverId?: string
	) => void;
	onLogout?: () => void;
	selectedDriverId?: string;
}

export default function Page({
	onNavigate,
	onLogout,
	selectedDriverId,
}: FleetDriversPageProps) {
	const { t } = useLanguage();
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<
		'all' | 'assigned' | 'active' | 'free'
	>('all');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
	const [selectedDriver, setSelectedDriver] = useState<Driver | null>(() => {
		if (!selectedDriverId) return null;
		return mockDrivers.find((d) => d.id === selectedDriverId) || null;
	});
	const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
	const [isRemoveDriverModalOpen, setIsRemoveDriverModalOpen] = useState(false);

	const handleSaveDriver = (driver: NewDriver) => {
		console.log('New driver added:', driver);
		// TODO: wire to backend when API exists
	};

	const filteredDrivers = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		return mockDrivers.filter((driver) => {
			const matchesSearch =
				driver.name.toLowerCase().includes(q) ||
				driver.email.toLowerCase().includes(q) ||
				driver.phone.includes(searchQuery);

			const matchesStatus =
				statusFilter === 'all' || driver.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [searchQuery, statusFilter]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
			case 'off-duty':
				return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
			case 'on-break':
				return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
			default:
				return 'bg-gray-100 text-gray-700';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'active':
				return 'Active';
			case 'off-duty':
				return 'Off Duty';
			case 'on-break':
				return 'On Break';
			default:
				return status;
		}
	};

	if (selectedDriver) {
		return (
			<div className='flex-1 flex flex-col overflow-hidden'>
				{/* <SimpleTopBar
					title='Driver Details'
					onNavigate={onNavigate}
					onLogout={onLogout}
				/> */}

				<div className='flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto'>
					<div className='px-4 md:px-6 lg:px-8 py-6 space-y-6 max-w-5xl mx-auto'>
						<button
							type='button'
							onClick={() => setSelectedDriver(null)}
							className='text-sm text-[#ff5722] hover:text-[#f4511e] font-medium flex items-center gap-2'>
							← Back to Drivers
						</button>

						<div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6'>
							<div className='flex flex-col md:flex-row gap-6'>
								<div className='shrink-0'>
									<div className='w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700'>
										{selectedDriver.profileImage ? (
											<img
												src={selectedDriver.profileImage}
												alt={selectedDriver.name}
												className='w-full h-full object-cover'
											/>
										) : (
											<div className='w-full h-full flex items-center justify-center'>
												<UserIcon className='w-16 h-16 text-gray-400' />
											</div>
										)}
									</div>
								</div>

								<div className='flex-1'>
									<div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4'>
										<div>
											<h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-1'>
												{selectedDriver.name}
											</h2>
											<div className='flex items-center gap-2'>
												<span
													className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
														selectedDriver.status
													)}`}>
													{getStatusText(selectedDriver.status)}
												</span>
												<div className='flex items-center gap-1'>
													<StarIcon className='w-4 h-4 text-yellow-500 fill-yellow-500' />
													<span className='text-sm font-medium text-gray-900 dark:text-white'>
														{selectedDriver.rating}
													</span>
												</div>
											</div>
										</div>
										<button
											type='button'
											className='px-4 py-2 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-lg text-sm font-medium transition-colors'>
											Edit Driver
										</button>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div className='flex items-center gap-3'>
											<MailIcon className='w-5 h-5 text-gray-400' />
											<div>
												<p className='text-xs text-gray-500 dark:text-gray-400'>
													Email
												</p>
												<p className='text-sm text-gray-900 dark:text-white'>
													{selectedDriver.email}
												</p>
											</div>
										</div>
										<div className='flex items-center gap-3'>
											<PhoneIcon className='w-5 h-5 text-gray-400' />
											<div>
												<p className='text-xs text-gray-500 dark:text-gray-400'>
													Phone
												</p>
												<p className='text-sm text-gray-900 dark:text-white'>
													{selectedDriver.phone}
												</p>
											</div>
										</div>
										<div className='flex items-center gap-3'>
											<MapPinIcon className='w-5 h-5 text-gray-400' />
											<div>
												<p className='text-xs text-gray-500 dark:text-gray-400'>
													Current Location
												</p>
												<p className='text-sm text-gray-900 dark:text-white'>
													{selectedDriver.location}
												</p>
											</div>
										</div>
										<div className='flex items-center gap-3'>
											<ClockIcon className='w-5 h-5 text-gray-400' />
											<div>
												<p className='text-xs text-gray-500 dark:text-gray-400'>
													Experience
												</p>
												<p className='text-sm text-gray-900 dark:text-white'>
													{selectedDriver.experience}
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
							<div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4'>
								<div className='flex items-center gap-2 mb-2'>
									<AwardIcon className='w-5 h-5 text-[#ff5722]' />
									<p className='text-xs text-gray-600 dark:text-gray-400'>
										Total Trips
									</p>
								</div>
								<p className='text-2xl font-semibold text-gray-900 dark:text-white'>
									{selectedDriver.totalTrips}
								</p>
							</div>
							<div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4'>
								<div className='flex items-center gap-2 mb-2'>
									<StarIcon className='w-5 h-5 text-yellow-500' />
									<p className='text-xs text-gray-600 dark:text-gray-400'>
										Rating
									</p>
								</div>
								<p className='text-2xl font-semibold text-gray-900 dark:text-white'>
									{selectedDriver.rating}/5.0
								</p>
							</div>
							<div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4'>
								<div className='flex items-center gap-2 mb-2'>
									<CheckCircleIcon className='w-5 h-5 text-green-500' />
									<p className='text-xs text-gray-600 dark:text-gray-400'>
										On-Time
									</p>
								</div>
								<p className='text-2xl font-semibold text-gray-900 dark:text-white'>
									96%
								</p>
							</div>
							<div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4'>
								<div className='flex items-center gap-2 mb-2'>
									<TrendingUpIcon className='w-5 h-5 text-blue-500' />
									<p className='text-xs text-gray-600 dark:text-gray-400'>
										This Month
									</p>
								</div>
								<p className='text-2xl font-semibold text-gray-900 dark:text-white'>
									28
								</p>
							</div>
						</div>

						{selectedDriver.assignedTruck && (
							<div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6'>
								<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
									Assigned Truck
								</h3>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-sm font-medium text-gray-900 dark:text-white mb-1'>
											{selectedDriver.assignedTruck}
										</p>
										<p className='text-xs text-gray-500 dark:text-gray-400'>
											Currently assigned vehicle
										</p>
									</div>
									<button
										type='button'
										onClick={() => onNavigate?.('fleet-trucks')}
										className='px-4 py-2 border border-[#ff5722] text-[#ff5722] hover:bg-[#ff5722] hover:text-white rounded-lg text-sm font-medium transition-colors'>
										View Truck Details
									</button>
								</div>
							</div>
						)}

						<div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6'>
							<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
								Recent Activity
							</h3>
							<div className='space-y-3'>
								<div className='flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
									<div className='w-2 h-2 rounded-full bg-green-500 mt-2' />
									<div className='flex-1'>
										<p className='text-sm text-gray-900 dark:text-white'>
											Completed delivery to Beira
										</p>
										<p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
											2 hours ago
										</p>
									</div>
								</div>
								<div className='flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
									<div className='w-2 h-2 rounded-full bg-blue-500 mt-2' />
									<div className='flex-1'>
										<p className='text-sm text-gray-900 dark:text-white'>
											Started new trip to Chimoio
										</p>
										<p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
											5 hours ago
										</p>
									</div>
								</div>
								<div className='flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
									<div className='w-2 h-2 rounded-full bg-green-500 mt-2' />
									<div className='flex-1'>
										<p className='text-sm text-gray-900 dark:text-white'>
											Completed delivery to Maputo
										</p>
										<p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
											1 day ago
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='flex-1 flex flex-col overflow-hidden'>
			<div className='flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto'>
				<div className='px-4 md:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto'>
					<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
						<div>
							<h1 className='text-2xl text-gray-900 dark:text-white'>
								Drivers
							</h1>
							<p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
								{t.manageDriverRoster}
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
									<Grid3x3Icon className='w-4 h-4' />
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
									<ListIcon className='w-4 h-4' />
								</button>
							</div>

							<button
								type='button'
								onClick={() => setIsAddDriverModalOpen(true)}
								className='px-4 py-2 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2'>
								<PlusIcon className='w-4 h-4' />
								<span className='hidden md:inline'>Add New Driver</span>
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
								<SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' />
								<input
									type='search'
									placeholder='Search by name, email, or phone...'
									aria-label='Search drivers'
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
									onClick={() => setStatusFilter('assigned')}
									className={`px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap ${
										statusFilter === 'assigned'
											? 'bg-white dark:bg-gray-600 font-medium shadow-sm text-[#ff5722]'
											: 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
									}`}>
									Assigned
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
									onClick={() => setStatusFilter('free')}
									className={`px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap ${
										statusFilter === 'free'
											? 'bg-white dark:bg-gray-600 font-medium shadow-sm text-[#ff5722]'
											: 'bg-transparent text-gray-600 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white'
									}`}>
									Free
								</button>
							</div>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<button
							type='button'
							onClick={() => setIsAddDriverModalOpen(true)}
							className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-md hover:border-[#ff5722] transition-all text-left'>
							<div className='w-10 h-10 rounded-lg bg-[#ff5722]/10 text-[#ff5722] flex items-center justify-center mb-3'>
								<PlusIcon className='w-5 h-5' />
							</div>
							<p className='text-gray-900 dark:text-white font-medium mb-1'>
								Add New Driver
							</p>
							<p className='text-xs text-gray-600 dark:text-gray-400'>
								Register a new driver in your roster
							</p>
						</button>

						<button
							type='button'
							onClick={() => setIsRemoveDriverModalOpen(true)}
							className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-md hover:border-[#ff5722] transition-all text-left'>
							<div className='w-10 h-10 rounded-lg bg-[#ff5722]/10 text-[#ff5722] flex items-center justify-center mb-3'>
								<Trash2Icon className='w-5 h-5' />
							</div>
							<p className='text-gray-900 dark:text-white font-medium mb-1'>
								Remove a Driver
							</p>
							<p className='text-xs text-gray-600 dark:text-gray-400'>
								Deregister a driver from your roster
							</p>
						</button>
					</div>

					{viewMode === 'grid' ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
							{filteredDrivers.map((driver) => (
								<button
									type='button'
									key={driver.id}
									onClick={() => setSelectedDriver(driver)}
									className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md hover:border-[#ff5722] transition-all text-left'>
									<div className='relative h-48 bg-linear-to-br from-[#ff5722]/10 to-[#ff8a65]/10 overflow-hidden flex items-center justify-center'>
										{driver.profileImage ? (
											<img
												src={driver.profileImage}
												alt={driver.name}
												className='w-full h-full object-cover'
											/>
										) : (
											<UserIcon className='w-20 h-20 text-gray-300' />
										)}
										<div className='absolute top-3 right-3'>
											<span
												className={`px-2 py-1 rounded-full text-xs backdrop-blur-sm ${getStatusColor(
													driver.status
												)}`}>
												{getStatusText(driver.status)}
											</span>
										</div>
									</div>

									<div className='p-4'>
										<div className='mb-3'>
											<p className='text-sm font-medium text-gray-900 dark:text-white'>
												{driver.name}
											</p>
											<p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
												{driver.email}
											</p>
										</div>

										<div className='grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700'>
											<div>
												<p className='text-xs text-gray-500 dark:text-gray-400'>
													Rating
												</p>
												<div className='flex items-center gap-1 mt-1'>
													<StarIcon className='w-3 h-3 text-yellow-500 fill-yellow-500' />
													<span className='text-sm font-medium text-gray-900 dark:text-white'>
														{driver.rating}
													</span>
												</div>
											</div>
											<div>
												<p className='text-xs text-gray-500 dark:text-gray-400'>
													Trips
												</p>
												<p className='text-sm font-medium text-gray-900 dark:text-white mt-1'>
													{driver.totalTrips}
												</p>
											</div>
										</div>

										<div className='space-y-2'>
											<div className='flex items-center gap-2'>
												<MapPinIcon className='w-4 h-4 text-gray-400 shrink-0' />
												<p className='text-xs text-gray-600 dark:text-gray-400 truncate'>
													{driver.location}
												</p>
											</div>
											{driver.assignedTruck && (
												<div className='flex items-center gap-2'>
													<TruckIcon className='w-4 h-4 text-gray-400 shrink-0' />
													<p className='text-xs text-gray-600 dark:text-gray-400 truncate'>
														{driver.assignedTruck}
													</p>
												</div>
											)}
										</div>
									</div>
								</button>
							))}
						</div>
					) : (
						<div className='lg:space-y-3'>
							<div className='lg:hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden divide-y divide-gray-200 dark:divide-gray-700'>
								{filteredDrivers.map((driver) => (
									<button
										type='button'
										key={driver.id}
										onClick={() => setSelectedDriver(driver)}
										className='w-full hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left'>
										<div className='p-3'>
											<div className='flex items-center gap-2 mb-2'>
												<div className='w-10 h-10 rounded-full overflow-hidden bg-linear-to-br from-[#ff5722]/10 to-[#ff8a65]/10 shrink-0'>
													{driver.profileImage ? (
														<img
															src={driver.profileImage}
															alt={driver.name}
															className='w-full h-full object-cover'
														/>
													) : (
														<div className='w-full h-full flex items-center justify-center'>
															<UserIcon className='w-5 h-5 text-gray-400' />
														</div>
													)}
												</div>
												<div className='flex-1 min-w-0'>
													<p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
														{driver.name}
													</p>
													<div className='flex items-center gap-2 mt-0.5'>
														<span
															className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(
																driver.status
															)}`}>
															{getStatusText(driver.status)}
														</span>
														<div className='flex items-center gap-0.5'>
															<StarIcon className='w-3 h-3 text-yellow-500 fill-yellow-500' />
															<span className='text-xs text-gray-900 dark:text-white'>
																{driver.rating}
															</span>
														</div>
													</div>
												</div>
												<div className='text-right shrink-0'>
													<p className='text-xs text-gray-500 dark:text-gray-400'>
														Trips
													</p>
													<p className='text-sm font-semibold text-gray-900 dark:text-white'>
														{driver.totalTrips}
													</p>
												</div>
											</div>

											<div className='grid grid-cols-2 gap-x-3 gap-y-1 text-xs'>
												<div className='truncate'>
													<span className='text-gray-500 dark:text-gray-400'>
														Truck:{' '}
													</span>
													<span className='text-gray-900 dark:text-white font-medium'>
														{driver.assignedTruck || 'None'}
													</span>
												</div>
												<div className='truncate text-right'>
													<span className='text-gray-900 dark:text-white font-medium'>
														{driver.location}
													</span>
												</div>
											</div>
										</div>
									</button>
								))}
							</div>

							{filteredDrivers.map((driver) => (
								<button
									type='button'
									key={driver.id}
									onClick={() => setSelectedDriver(driver)}
									className='hidden lg:block w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-5 hover:border-[#ff5722] hover:shadow-md transition-all text-left'>
									<div className='flex flex-col md:flex-row md:items-center gap-4'>
										<div className='flex items-center gap-3 md:w-64 shrink-0'>
											<div className='w-16 h-16 rounded-full overflow-hidden bg-linear-to-br from-[#ff5722]/10 to-[#ff8a65]/10 shrink-0'>
												{driver.profileImage ? (
													<img
														src={driver.profileImage}
														alt={driver.name}
														className='w-full h-full object-cover'
													/>
												) : (
													<div className='w-full h-full flex items-center justify-center'>
														<UserIcon className='w-8 h-8 text-gray-400' />
													</div>
												)}
											</div>
											<div className='flex-1 min-w-0'>
												<p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
													{driver.name}
												</p>
												<span
													className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(
														driver.status
													)}`}>
													{getStatusText(driver.status)}
												</span>
											</div>
										</div>

										<div className='flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4'>
											<div>
												<div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
													Email
												</div>
												<div className='text-sm text-gray-900 dark:text-white truncate'>
													{driver.email}
												</div>
											</div>
											<div>
												<div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
													Location
												</div>
												<div className='text-sm text-gray-900 dark:text-white truncate'>
													{driver.location}
												</div>
											</div>
											<div>
												<div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
													Truck
												</div>
												<div className='text-sm text-gray-900 dark:text-white truncate'>
													{driver.assignedTruck || 'None'}
												</div>
											</div>
										</div>

										<div className='flex items-center gap-4 md:w-auto'>
											<div className='text-center'>
												<div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
													Rating
												</div>
												<div className='flex items-center gap-1'>
													<StarIcon className='w-3 h-3 text-yellow-500 fill-yellow-500' />
													<span className='text-sm font-medium text-gray-900 dark:text-white'>
														{driver.rating}
													</span>
												</div>
											</div>
											<div className='text-center'>
												<div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
													Trips
												</div>
												<div className='text-sm font-medium text-gray-900 dark:text-white'>
													{driver.totalTrips}
												</div>
											</div>
										</div>
									</div>
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			<AddDriverModal
				isOpen={isAddDriverModalOpen}
				onClose={() => setIsAddDriverModalOpen(false)}
				onSave={handleSaveDriver}
			/>

			<RemoveDriverModal
				isOpen={isRemoveDriverModalOpen}
				onClose={() => setIsRemoveDriverModalOpen(false)}
				drivers={mockDrivers.map((d) => ({
					id: d.id,
					name: d.name,
					email: d.email,
					assignedTruck: d.assignedTruck,
				}))}
				onRemove={(driverIds) => {
					console.log('Removing drivers:', driverIds);
					// TODO: wire to backend when API exists
				}}
			/>
		</div>
	);
}
