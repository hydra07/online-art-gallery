export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<div className='p-8 justify-center '>{children}</div>
		</>
	);
}
