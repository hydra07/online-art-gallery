import Sidebar from "@/components/ui.custom/sidebar";

export default function PrivateLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen w-full bg-background flex flex-col">
            <Sidebar />
            <main className="flex-1 p-4 md:p-8 md:ml-64 transition-all duration-300 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto w-full">{children}</div>
            </main>
        </div>
    );
}