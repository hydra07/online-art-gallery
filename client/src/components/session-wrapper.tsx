'use client';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
export default function SessionWrapper({
	children
}: Readonly<{ children: React.ReactNode }>) {
	return <SessionProvider
	refetchOnWindowFocus={false}
	>{children}</SessionProvider>;
}
