'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
	IconBell,
	IconHelpCircle,
	IconLogout,
	IconSelector,
	IconSettings,
	IconUser,
} from '@tabler/icons-react';

import { authClient } from '@/backend/auth/auth-client';

import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarGenerator } from '@/components/customs/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from '@/components/ui/popover';

import { locales } from '@/i18n/config';

import { cn } from '@/lib/utils';

import { Language } from '../button/language';
import { ThemeToggle } from '../button/theme-toggle';
import { useTheme } from 'next-themes';

export function Header() {
	const [isLoading, setLoading] = useState<boolean>(false);

	const t = useTranslations('User.header');
	const router = useRouter();

	const { isPending, data } = authClient.useSession();

	if (isPending || !data) {
		return (
			<div className='flex items-center gap-2'>
				<div className='flex gap-2 rounded-md items-center h-9 bg-muted px-2 border'>
					<Skeleton className='size-4' />
					<IconSelector className='size-4 text-muted-foreground' />
				</div>

				<Skeleton className='size-9 rounded-md border' />

				<div className='flex gap-2 rounded-md items-center h-9 bg-muted px-2 border'>
					<Skeleton className='size-6 rounded-full' />
					<IconSelector className='size-4 text-muted-foreground' />
				</div>
			</div>
		);
	}

	async function handleSignOut() {
		await authClient.signOut({
			fetchOptions: {
				onRequest: () => {
					setLoading(true);
				},
				onSuccess: () => {
					setLoading(false);
					router.push('/sign-in');
				},
				onError: () => {
					toast.error(t('errors.sign-out'));
					setLoading(false);
				},
			},
		});
	}

	const { name, image, email } = data.user;

	function avatar(className?: string) {
		if (image) {
			return (
				<Avatar className={className}>
					<AvatarImage src={image} alt='avatar' />
				</Avatar>
			);
		}
		return <AvatarGenerator seed={name} className={className} />;
	}

	return (
		<div className='flex items-center gap-2'>
			<ThemeToggle />

			<Language
				items={locales.map((code) => ({
					flag: `/flags/${code === 'en-US' ? 'GB' : 'PT'}.svg`,
					locale: code,
				}))}
			/>

			<Button size='icon' variant='outline' className='hidden'>
				<IconBell />
			</Button>

			<Popover>
				<PopoverTrigger className='flex gap-2 rounded-md items-center h-9 bg-muted px-2 border'>
					{avatar('size-6')}
					<IconSelector className='size-4 text-muted-foreground' />
				</PopoverTrigger>
				<PopoverContent align='end' className='w-fit p-0 pb-2 gap-1'>
					<PopoverHeader className='flex flex-col text-sm justify-start items-start px-4 pt-4 pb-2'>
						<PopoverTitle>{name}</PopoverTitle>
						<PopoverDescription>{email}</PopoverDescription>
					</PopoverHeader>

					<Separator />

					<Link
						href='/u/account/profile'
						className={cn(
							buttonVariants({ variant: 'ghost' }),
							'py-5 font-light justify-start rounded-none'
						)}>
						<IconUser />
						{t('buttons.user.profile')}
					</Link>

					<Link
						href='/u/preferences'
						className={cn(
							buttonVariants({ variant: 'ghost' }),
							'py-5 font-light justify-start rounded-none'
						)}>
						<IconSettings />
						{t('buttons.user.preferences')}
					</Link>

					<Link
						href='/u/support'
						className={cn(
							buttonVariants({ variant: 'ghost' }),
							'py-5 font-light justify-start rounded-none'
						)}>
						<IconHelpCircle />
						{t('buttons.user.support')}
					</Link>

					<Separator />

					<Button
						variant='ghost'
						disabled={isLoading}
						onClick={handleSignOut}
						className='py-5 cursor-pointer font-light justify-start rounded-none hover:bg-destructive/20! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive! focus-visible:border-destructive/40 dark:hover:bg-destructive/30'>
						{isLoading ? <Spinner /> : <IconLogout />}
						{t('buttons.user.sign-out')}
					</Button>
				</PopoverContent>
			</Popover>
		</div>
	);
}
