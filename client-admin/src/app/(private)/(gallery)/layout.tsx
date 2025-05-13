export default function GalleryLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen w-full bg-background flex flex-col">
            {children}
        </div>
    );
}