// export default function Page() {
//     return (
//         <div>Clients</div>
//     )
// }
'use client';

import React, { useState } from 'react';

/* Local lightweight icon fallbacks to avoid importing lucide-react on this page.
   These small inline SVG components accept typical props (className, etc.) and
   use currentColor so Tailwind color classes still apply. Kept here so change
   is isolated to this file only.
*/

type IconProps = React.SVGProps<SVGSVGElement> & { title?: string };

const SvgIcon = ({
	title,
	children,
	...props
}: React.PropsWithChildren<IconProps>) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={2}
		strokeLinecap='round'
		strokeLinejoin='round'
		aria-hidden='true'
		{...props}>
		{title ? <title>{title}</title> : null}
		{children ?? <circle cx='12' cy='12' r='10' />}
	</svg>
);

export const Building2 = (props: IconProps) => (
	<SvgIcon {...props}>
		<rect x='5' y='6' width='14' height='12' rx='1' />
		<path d='M9 18v-3h6v3' />
	</SvgIcon>
);
export const MapPin = (props: IconProps) => (
	<SvgIcon {...props}>
		<path d='M12 22s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12z' />
		<circle cx='12' cy='10' r='2.5' />
	</SvgIcon>
);
export const Search = (props: IconProps) => (
	<SvgIcon {...props}>
		<circle cx='11' cy='11' r='6' />
		<path
			d='M21 21l-4.35-4.35'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			fill='none'
		/>
	</SvgIcon>
);
export const Star = (props: IconProps) => (
	<SvgIcon {...props}>
		<path
			d='M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
			fill='currentColor'
			stroke='none'
		/>
	</SvgIcon>
);
export const LayoutGrid = (props: IconProps) => (
	<SvgIcon {...props}>
		<rect x='3' y='3' width='8' height='8' />
		<rect x='13' y='3' width='8' height='8' />
		<rect x='3' y='13' width='8' height='8' />
		<rect x='13' y='13' width='8' height='8' />
	</SvgIcon>
);
export const List = (props: IconProps) => (
	<SvgIcon {...props}>
		<rect x='4' y='5' width='16' height='2' rx='1' />
		<rect x='4' y='11' width='16' height='2' rx='1' />
		<rect x='4' y='17' width='16' height='2' rx='1' />
	</SvgIcon>
);

// Local fallbacks for header and contexts to keep this page self-contained.
// When ready, replace these with the real implementations from your project.

interface CarrierPrivateHeaderProps {
	title: string;
	onNavigate?: (page: 'preferences' | 'profile' | 'support') => void;
	onLogout?: () => void;
	onNotificationNavigate?: (notification: Notification) => void;
	onMenuClick?: () => void;
}

const CarrierPrivateHeader = ({
	title,
	onNavigate,
	onLogout,
	onNotificationNavigate,
	onMenuClick,
}: CarrierPrivateHeaderProps) => {
	return (
		<header className="mb-4 flex items-center justify-between">
			<div className="flex items-center gap-4">
				<h2 className="text-lg font-semibold">{title}</h2>
			</div>
			<div className="flex items-center gap-2">
				<button type="button" onClick={() => onNavigate?.('profile')} className="text-sm">
					Profile
				</button>
				<button type="button" onClick={onLogout} className="text-sm">
					Logout
				</button>
				<button
					type="button"
					onClick={() => onNotificationNavigate?.({} as Notification)}
					className="text-sm">
					Notifications
				</button>
				<button type="button" onClick={onMenuClick} className="text-sm">
					Menu
				</button>
			</div>
		</header>
	);
};

// Minimal context fallbacks used only on this page to avoid missing-module errors.
const useCompany = () => ({ selectedCompany: undefined as { accentColor?: string } | undefined });
const useLanguage = () => ({ language: 'en' as const });


interface Client {
	id: string;
	name: string;
	logo?: string;
	location: string;
	industry: string;
	rating: number;
	totalOrders: number;
	activeOrders: number;
	onTimePayment: number;
	categories: string[];
	contactEmail: string;
	contactPhone: string;
	status: 'active' | 'inactive';
	lastOrderDate: string;
	nuit: string;
}

// Keep mock data for quick drop-in compatibility with Next.js dev environment
const mockClients: Client[] = [
	{
		id: '1',
		name: 'Mozal Aluminium',
		location: 'Maputo',
		industry: 'Manufacturing',
		rating: 4.9,
		totalOrders: 234,
		activeOrders: 12,
		onTimePayment: 98,
		categories: ['Raw Materials', 'Industrial Equipment', 'Export Cargo'],
		contactEmail: 'logistics@mozal.co.mz',
		contactPhone: '+258 84 111 2222',
		status: 'active',
		lastOrderDate: 'Feb 26, 2026',
		nuit: '400987654',
	},
	{
		id: '2',
		name: 'Cervejas de Moçambique',
		location: 'Maputo',
		industry: 'FMCG',
		rating: 4.8,
		totalOrders: 189,
		activeOrders: 8,
		onTimePayment: 97,
		categories: ['Beverages', 'Distribution', 'Retail'],
		contactEmail: 'supply@cdm.co.mz',
		contactPhone: '+258 82 222 3333',
		status: 'active',
		lastOrderDate: 'Feb 25, 2026',
		nuit: '400876543',
	},
	{
		id: '3',
		name: 'Vale Moçambique',
		location: 'Tete',
		industry: 'Mining',
		rating: 4.7,
		totalOrders: 167,
		activeOrders: 15,
		onTimePayment: 96,
		categories: ['Coal', 'Heavy Equipment', 'Mining Supplies'],
		contactEmail: 'transport@vale.co.mz',
		contactPhone: '+258 86 333 4444',
		status: 'active',
		lastOrderDate: 'Feb 24, 2026',
		nuit: '400765432',
	},
	{
		id: '4',
		name: 'Shoprite Moçambique',
		location: 'Beira',
		industry: 'Retail',
		rating: 4.6,
		totalOrders: 298,
		activeOrders: 18,
		onTimePayment: 95,
		categories: ['FMCG', 'Perishables', 'General Merchandise'],
		contactEmail: 'logistics@shoprite.co.mz',
		contactPhone: '+258 84 444 5555',
		status: 'active',
		lastOrderDate: 'Feb 26, 2026',
		nuit: '400654321',
	},
	{
		id: '5',
		name: 'Sasol Petroleum',
		location: 'Inhambane',
		industry: 'Energy',
		rating: 4.8,
		totalOrders: 145,
		activeOrders: 9,
		onTimePayment: 99,
		categories: ['Petroleum Products', 'Chemicals', 'Hazmat'],
		contactEmail: 'operations@sasol.co.mz',
		contactPhone: '+258 82 555 6666',
		status: 'active',
		lastOrderDate: 'Feb 23, 2026',
		nuit: '400543210',
	},
	{
		id: '6',
		name: 'Cimentos de Moçambique',
		location: 'Matola',
		industry: 'Construction',
		rating: 4.5,
		totalOrders: 112,
		activeOrders: 0,
		onTimePayment: 92,
		categories: ['Cement', 'Building Materials', 'Bulk Cargo'],
		contactEmail: 'supply@cimentos.co.mz',
		contactPhone: '+258 84 666 7777',
		status: 'inactive',
		lastOrderDate: 'Jan 18, 2026',
		nuit: '400432109',
	},
];

interface MyClientsPageProps {
	onNavigate?: (page: 'preferences' | 'profile' | 'support') => void;
	onLogout?: () => void;
	onNotificationNavigate?: (notification: Notification) => void;
	onMenuClick?: () => void;
}

export default function Page({
	onNavigate,
	onLogout,
	onNotificationNavigate,
	onMenuClick,
}: MyClientsPageProps) {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [hoveredId, setHoveredId] = useState<string | null>(null);
	const { selectedCompany } = useCompany();
	const { language } = useLanguage();

	// Use company accent color if available, fallback to orange
	const accentColor = selectedCompany?.accentColor || '#ff5722';

	// Safari can be picky about 8-digit hex (#RRGGBBAA). Use rgba(...) for translucent fills.
	const hexToRgba = (hex: string, alpha: number) => {
		const h = hex.replace('#', '');
		const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
		const n = parseInt(full, 16);
		return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
	};

	const content = {
		en: {
			title: 'My Clients',
			subtitle: 'Clients who have added you to their network',
			search: 'Search by name, location, or industry...',
			all: 'All',
			active: 'Active',
			inactive: 'Inactive',
			totalClients: 'Total Clients',
			activeClients: 'Active Clients',
			totalOrders: 'Total Orders',
			avgRating: 'Avg Rating',
			industry: 'Industry',
			onTimePayment: 'On-Time Payment',
			activeOrders: 'Active Orders',
			totalOrdersLabel: 'Total Orders',
			lastOrder: 'Last Order',
			categories: 'Categories',
			contact: 'Contact',
			viewDetails: 'View Details',
			contactClient: 'Contact',
			nuit: 'NUIT',
			noClientsFound: 'No clients found matching your criteria',
		},
		pt: {
			title: 'Meus Clientes',
			subtitle: 'Clientes que adicionaram você à rede deles',
			search: 'Pesquisar por nome, localização ou indústria...',
			all: 'Todos',
			active: 'Ativos',
			inactive: 'Inativos',
			totalClients: 'Total de Clientes',
			activeClients: 'Clientes Ativos',
			totalOrders: 'Total de Pedidos',
			avgRating: 'Classificação Média',
			industry: 'Indústria',
			onTimePayment: 'Pagamento Pontual',
			activeOrders: 'Pedidos Ativos',
			totalOrdersLabel: 'Total de Pedidos',
			lastOrder: 'Último Pedido',
			categories: 'Categorias',
			contact: 'Contacto',
			viewDetails: 'Ver Detalhes',
			contactClient: 'Contactar',
			nuit: 'NUIT',
			noClientsFound:
				'Nenhum cliente encontrado correspondente aos seus critérios',
		},
	} as const;

	const t = (content as any)[language] ?? content.en;

	const filteredClients = mockClients.filter((client) => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return true;
		return (
			client.name.toLowerCase().includes(q) ||
			client.location.toLowerCase().includes(q) ||
			client.industry.toLowerCase().includes(q) ||
			client.categories.some((cat) => cat.toLowerCase().includes(q))
		);
	});

	const stats = [
		{
			label: t.totalClients,
			value: mockClients.length.toString(),
			color: 'accent',
		},
		{
			label: t.activeClients,
			value: mockClients.filter((c) => c.status === 'active').length.toString(),
			color: 'green',
		},
		{
			label: t.totalOrders,
			value: mockClients.reduce((sum, c) => sum + c.totalOrders, 0).toString(),
			color: 'blue',
		},
		{
			label: t.avgRating,
			value: (
				mockClients.reduce((sum, c) => sum + c.rating, 0) / mockClients.length
			).toFixed(1),
			color: 'yellow',
		},
	];

	const hoverStyle = (clientId: string | undefined): React.CSSProperties => ({
		borderColor: clientId && hoveredId === clientId ? accentColor : undefined,
	});

	return (
		<div className='flex-1 min-h-0 flex flex-col overflow-hidden relative isolate'>
			{/* TODO: temporarily disabled CarrierPrivateHeader while testing layout
			<CarrierPrivateHeader
				title={t.title}
				onNavigate={onNavigate}
				onLogout={onLogout}
				onMenuClick={onMenuClick}
			/> */}

			<CarrierPrivateHeader
				title={t.title}
				onNavigate={onNavigate}
				onLogout={onLogout}
				onNotificationNavigate={onNotificationNavigate}
				onMenuClick={onMenuClick}
			/>

			<div className='flex-1 min-h-0 bg-gray-50 dark:bg-gray-900 overflow-y-auto relative z-0'>
				<div className='px-4 md:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto'>
					{/* Page Header */}
					<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
						<div>
							<h1 className='text-2xl text-gray-900 dark:text-white'>
								{t.title}
							</h1>
							<p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
								{t.subtitle}
							</p>
						</div>
					</div>

					{/* Stats Overview */}
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						{stats.map((stat, index) => {
							const isAccent = stat.color === 'accent';
							return (
								<div
									key={index}
									className=' dark:bg-gray-800 rounded-xl border-2 p-4'
									style={
										isAccent
											? {
													borderColor: accentColor,
													backgroundColor: hexToRgba(accentColor, 0.06),
											  }
											: undefined
									}>
									<p className='text-xs text-gray-600 dark:text-gray-400 mb-1'>
										{stat.label}
									</p>
									<p
										className='text-2xl dark:text-white'
										style={isAccent ? { color: accentColor } : undefined}>
										{stat.value}
									</p>
								</div>
							);
						})}
					</div>

					{/* Search and Filters */}
					<div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4'>
						<div className='flex flex-col md:flex-row gap-4'>
							{/* Search */}
							<div className='flex-1 relative'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' />
								<input
									type='search'
									aria-label={t.search}
									placeholder={t.search}
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className='w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent'
									style={
										{
											['--tw-ring-color' as any]: accentColor,
										} as React.CSSProperties
									}
								/>
							</div>

							{/* View Toggle */}
							<div className='inline-flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg'>
								<button
									type='button'
									onClick={() => setViewMode('grid')}
									className={`p-2 rounded-md transition-colors ${
										viewMode === 'grid'
											? 'bg-white dark:bg-gray-600 shadow-sm'
											: 'bg-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
									}`}
									style={
										viewMode === 'grid' ? { color: accentColor } : undefined
									}
									aria-pressed={viewMode === 'grid'}>
									<LayoutGrid className='w-4 h-4' />
								</button>
								<button
									type='button'
									onClick={() => setViewMode('list')}
									className={`p-2 rounded-md transition-colors ${
										viewMode === 'list'
											? 'bg-white dark:bg-gray-600 shadow-sm'
											: 'bg-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
									}`}
									style={
										viewMode === 'list' ? { color: accentColor } : undefined
									}
									aria-pressed={viewMode === 'list'}>
									<List className='w-4 h-4' />
								</button>
							</div>
						</div>
					</div>

					{/* Clients - Grid View */}
					{viewMode === 'grid' && (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
							{filteredClients.map((client) => (
								<div
									key={client.id}
									className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all cursor-pointer group'
									onMouseEnter={() => setHoveredId(client.id)}
									onMouseLeave={() => setHoveredId(null)}
									style={hoverStyle(client.id)}>
									{/* Header */}
									<div className='flex items-start gap-3 mb-4'>
										<div
											className='w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0'
											style={{
												backgroundColor: hexToRgba(accentColor, 0.08),
												color: accentColor,
											}}>
											<Building2 className='w-6 h-6' />
										</div>
										<div className='flex-1 min-w-0'>
											<h3 className='text-base font-semibold text-gray-900 dark:text-white truncate mb-1'>
												{client.name}
											</h3>
											<div className='flex items-center gap-2'>
												<span className='flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400'>
													<MapPin className='w-3 h-3' />
													{client.location}
												</span>
												<span
													className={`px-2 py-0.5 rounded-full text-xs font-medium ${
														client.status === 'active'
															? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
															: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
													}`}>
													{client.status === 'active' ? t.active : t.inactive}
												</span>
											</div>
										</div>
									</div>

									{/* NUIT & Industry */}
									<div className='mb-3 pb-3 border-b border-gray-200 dark:border-gray-700'>
										<div className='flex items-center justify-between text-xs mb-1'>
											<span className='text-gray-600 dark:text-gray-400'>
												{t.nuit}:
											</span>
											<span className='text-gray-900 dark:text-white font-mono font-medium'>
												{client.nuit}
											</span>
										</div>
										<div className='flex items-center justify-between text-xs'>
											<span className='text-gray-600 dark:text-gray-400'>
												{t.industry}:
											</span>
											<span className='text-gray-900 dark:text-white font-medium'>
												{client.industry}
											</span>
										</div>
									</div>

									{/* Stats */}
									<div className='grid grid-cols-2 gap-3 mb-4'>
										<div className='bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3'>
											<p className='text-xs text-gray-600 dark:text-gray-400 mb-0.5'>
												{t.onTimePayment}
											</p>
											<p
												className='text-lg font-bold'
												style={{ color: accentColor }}>
												{client.onTimePayment}%
											</p>
										</div>
										<div className='bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3'>
											<p className='text-xs text-gray-600 dark:text-gray-400 mb-0.5'>
												{t.activeOrders}
											</p>
											<p className='text-lg font-bold text-gray-900 dark:text-white'>
												{client.activeOrders}
											</p>
										</div>
										<div className='bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3'>
											<p className='text-xs text-gray-600 dark:text-gray-400 mb-0.5'>
												{t.totalOrdersLabel}
											</p>
											<p className='text-lg font-bold text-gray-900 dark:text-white'>
												{client.totalOrders}
											</p>
										</div>
										<div className='bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3'>
											<p className='text-xs text-gray-600 dark:text-gray-400 mb-0.5'>
												{t.avgRating}
											</p>
											<p className='text-lg font-bold text-gray-900 dark:text-white'>
												{client.rating}
											</p>
										</div>
									</div>

									{/* Rating & Last Order */}
									<div className='flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700'>
										<span className='flex items-center gap-1 text-sm'>
											<Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
											<span className='font-medium text-gray-900 dark:text-white'>
												{client.rating}
											</span>
										</span>
										<span className='text-xs text-gray-600 dark:text-gray-400'>
											{client.lastOrderDate}
										</span>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Clients - List View */}
					{viewMode === 'list' && (
						<div className='space-y-3'>
							{filteredClients.map((client) => (
								<div
									key={client.id}
									className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all cursor-pointer'
									onMouseEnter={() => setHoveredId(client.id)}
									onMouseLeave={() => setHoveredId(null)}
									style={hoverStyle(client.id)}>
									<div className='flex flex-col lg:flex-row lg:items-center gap-4'>
										{/* Logo & Name */}
										<div className='flex items-center gap-3 lg:w-64 flex-shrink-0'>
											<div
												className='w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0'
												style={{
													backgroundColor: hexToRgba(accentColor, 0.08),
													color: accentColor,
												}}>
												<Building2 className='w-6 h-6' />
											</div>
											<div className='min-w-0'>
												<h3 className='font-semibold text-gray-900 dark:text-white truncate'>
													{client.name}
												</h3>
												<div className='flex items-center gap-2 mt-0.5'>
													<MapPin className='w-3 h-3 text-gray-400' />
													<span className='text-xs text-gray-600 dark:text-gray-400'>
														{client.location}
													</span>
												</div>
											</div>
										</div>

										{/* Stats */}
										<div className='flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3'>
											<div>
												<p className='text-xs text-gray-600 dark:text-gray-400'>
													{t.onTimePayment}
												</p>
												<p
													className='text-base font-bold'
													style={{ color: accentColor }}>
													{client.onTimePayment}%
												</p>
											</div>
											<div>
												<p className='text-xs text-gray-600 dark:text-gray-400'>
													{t.industry}
												</p>
												<p className='text-base font-bold text-gray-900 dark:text-white'>
													{client.industry}
												</p>
											</div>
											<div>
												<p className='text-xs text-gray-600 dark:text-gray-400'>
													{t.activeOrders}
												</p>
												<p className='text-base font-bold text-gray-900 dark:text-white'>
													{client.activeOrders}
												</p>
											</div>
											<div>
												<p className='text-xs text-gray-600 dark:text-gray-400'>
													{t.totalOrdersLabel}
												</p>
												<p className='text-base font-bold text-gray-900 dark:text-white'>
													{client.totalOrders}
												</p>
											</div>
										</div>

										{/* Status & Rating */}
										<div className='flex items-center gap-3 lg:flex-shrink-0'>
											<span
												className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
													client.status === 'active'
														? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
														: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
												}`}>
												{client.status === 'active' ? t.active : t.inactive}
											</span>
											<span className='flex items-center gap-1'>
												<Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
												<span className='font-semibold text-gray-900 dark:text-white'>
													{client.rating}
												</span>
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{filteredClients.length === 0 && (
						<div className='text-center py-12'>
							<Building2 className='w-16 h-16 text-gray-400 mx-auto mb-4' />
							<p className='text-gray-600 dark:text-gray-400'>
								{t.noClientsFound}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
