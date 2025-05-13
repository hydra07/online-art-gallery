import { getMostHeartedBlogs } from '@/service/home';
import { ArticleSection } from './components/article-section';

export default async function ArticlesPage() {
  const data = await getMostHeartedBlogs();
  const articles = data.data?.blogs || [];
  
  return (
    <section className="py-24 bg-white">
      <ArticleSection articles={articles} />
    </section>
  );
}