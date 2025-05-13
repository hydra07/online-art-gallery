import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";

export default async function PrivateLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getCurrentUser();
    if (!user || !user.role.includes("admin")) {
        return redirect('/auth');
    }
    
    return (
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
    );
}