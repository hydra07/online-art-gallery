import Footer from "@/components/footer";

export default async function HomeLayout({
  children,
  exhibition,
  spotlight,
  trending,
  recommendations,
  articles
}: {
  children: React.ReactNode;
  exhibition: React.ReactNode;
  spotlight: React.ReactNode;
  trending: React.ReactNode;
  recommendations: React.ReactNode;
  articles: React.ReactNode;
}) {
  return (
    <div className='min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]'>
      <main className='flex-1 w-full'>
        {children}
        {exhibition}
        {recommendations}
        {trending}
        {spotlight}
        {articles}
      </main>
      <Footer />
    </div>
  );
}