'use client';
import { ThemeProvider } from '@/components/theme-wrapper';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import QueryWrapper from '@/components/query-wrapper';
import { NotificationToaster } from '@/components/ui/NotificationToaster';
import SessionWrapper from '@/components/session-wrapper';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionWrapper>
			<QueryWrapper>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					{/* TODO add posthog */}
					<TooltipProvider>{children}</TooltipProvider>
					<Toaster />
					<NotificationToaster />
				</ThemeProvider>
			</QueryWrapper>
		</SessionWrapper>
	);
}
