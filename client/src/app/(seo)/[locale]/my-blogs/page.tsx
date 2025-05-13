import { getCurrentUser } from '@/lib/session';
import { getLastEditedBlogId } from '@/service/blog';
import { Newspaper } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

export default async function BlogsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BlogContent />
        </Suspense>
    );
}

async function BlogContent() {
    const user = await getCurrentUser();
    if (!user) redirect('/');
    const t = await getTranslations('blog');
    
    try {
        const res = await getLastEditedBlogId(user.accessToken);
        if (res?.data?.blog) {
            redirect(`/my-blogs/${res.data.blog._id}`);
        }
    } catch (error) {
        console.error("Failed to fetch last edited blog:", error);
    }
    
    return (
        <div className="flex flex-col items-center justify-center h-[70vh] p-6 text-center">
            <div className="bg-secondary/30 rounded-full p-6 mb-6">
                <Newspaper className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('no-blogs-title')}</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                {t('no-blogs-description')}
            </p>
        </div>
    );
}