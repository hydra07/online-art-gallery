// Removed: /* eslint-disable @typescript-eslint/no-explicit-any */
// No longer needed as we'll type 't' correctly

import { Button } from '@/components/ui/button';
import { ClockIcon, CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Blog } from '@/types/blog'; // Assuming this type is well-defined
import { calculateReadingTime } from '@/app/utils'; // Ensure this path and function exist
import { useTranslations, TranslationValues } from 'next-intl'; // Import TranslationValues if needed for complex types
import { createSlug } from '@/lib/utils';

type Translator = (key: string, values?: TranslationValues) => string;

interface ArticleSectionProps {
  articles: Blog[];
}

// --- Main Section Component ---
export function ArticleSection({ articles }: ArticleSectionProps) {
  const t = useTranslations('home.articles');

  // Handle empty state gracefully
  if (!articles || articles.length === 0) {
    // Optional: Render a message or null
    // return <div className="text-center text-gray-500 py-12">No articles found.</div>;
    return null;
  }

  // Sort articles safely (create copy)
  const sortedArticles = [...articles].sort((a, b) => (b.heartCount || 0) - (a.heartCount || 0));

  // Destructure with checks
  const [featuredArticle, ...regularArticles] = sortedArticles;

  // --- Generate a consistent base URL for articles ---
  const articleBaseUrl = '/en/blogs'; // Or '/articles', ensure consistency

  return (
    <div className="mx-auto px-4">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">{t('title')}</h2>

        <Button variant="ghost" asChild>
          <Link href={articleBaseUrl}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {t('view_all')}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Featured Article */}
        {featuredArticle && (
          <FeaturedArticle
            article={featuredArticle}
            t={t} // Pass the function correctly
            baseUrl={articleBaseUrl}
          />
        )}

        {/* Regular Articles Grid */}
        {regularArticles.length > 0 && ( // Check if there are regular articles
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {regularArticles.map(article => (
              <RegularArticle
                key={article._id}
                article={article}
                t={t} // Pass the function correctly
                baseUrl={articleBaseUrl}
              />
            ))}
          </div>
        )}
        {/* Optional: Handle case where there's only one article (featured, no regulars) */}
        {featuredArticle && regularArticles.length === 0 && (
          <div className="flex items-center justify-center text-gray-500">
            {/* Placeholder or message if desired */}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Featured Article Component ---
interface FeaturedArticleProps {
  article: Blog;
  t: Translator; // Use the defined type
  baseUrl: string;
}

function FeaturedArticle({ article, t, baseUrl }: FeaturedArticleProps) {
  // Default image if article.image is missing
  const imageUrl = article.image || '/images/placeholder-article.jpg';
  const authorImageUrl = article.author?.image || '/images/default-avatar.jpg'; // Use optional chaining

  return (
    // Use group directly on the Link for hover effects
    <Link href={`${baseUrl}/${`${createSlug(article.title)}.${article._id}`}`} className="group block">
      {/* Image Container */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 shadow-sm">
        <Image
          src={imageUrl}
          alt={article.title || 'Featured article image'}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw" // Example sizes
        />
      </div>

      {/* Badges/Meta */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded-full inline-block">
          {t('most_popular')}
        </span>
        {/* Optional Heart Count Display
          {typeof article.heartCount === 'number' && (
             <div className="flex items-center gap-1 text-gray-600">
               <Heart className="w-4 h-4 text-red-500" />
               <span>{article.heartCount}</span>
             </div>
           )} */}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-3 line-clamp-3">
        {article.title || 'Untitled Article'}
      </h3>

      {/* Author */}
      {article.author && ( // Render author only if available
        <div className="flex items-center gap-2 mb-4">
          <Image
            src={authorImageUrl}
            alt={article.author.name || 'Author'}
            width={28} // Slightly larger for featured
            height={28}
            className="rounded-full object-cover" // Added object-cover
          />
          <span className="text-sm font-medium text-gray-700">{article.author.name || 'Unknown Author'}</span>
        </div>
      )}

      {/* Meta (Reading Time, Date) */}
      <ArticleMeta article={article} t={t} />
    </Link>
  );
}

// --- Regular Article Component ---
interface RegularArticleProps {
  article: Blog;
  t: Translator; // Use the defined type
  baseUrl: string;
}

function RegularArticle({ article, t, baseUrl }: RegularArticleProps) {
  const imageUrl = article.image || '/images/placeholder-article-small.jpg';
  const authorImageUrl = article.author?.image || '/images/default-avatar.jpg';

  return (
    <Link href={`${baseUrl}/${createSlug(article.title)}.${article._id}`} className="group block">
      {/* Image Container */}
      <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-3 shadow-sm">
        <Image
          src={imageUrl}
          alt={article.title || 'Article image'}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw" // Example sizes
        />
        {/* Optional Heart Count Badge
           {typeof article.heartCount === 'number' && (
             <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
               <Heart className="w-3 h-3 text-red-500" />
               <span className="text-xs font-medium text-gray-800">{article.heartCount}</span>
             </div>
           )} */}
      </div>

      {/* Title */}
      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-2 text-base">
        {article.title || 'Untitled Article'}
      </h3>

      {/* Author */}
      {article.author && (
        <div className="flex items-center gap-2 mb-2">
          <Image
            src={authorImageUrl}
            alt={article.author.name || 'Author'}
            width={20}
            height={20}
            className="rounded-full object-cover"
          />
          <span className="text-xs text-gray-600">{article.author.name || 'Unknown Author'}</span>
        </div>
      )}

      {/* Meta */}
      <ArticleMeta article={article} t={t} />
    </Link>
  );
}

// --- Shared Meta Component ---
interface ArticleMetaProps {
  article: Blog;
  t: Translator; // Use the defined type
}

function ArticleMeta({ article, t }: ArticleMetaProps) {
  const readingTime = calculateReadingTime(article.content || ''); // Handle potentially missing content
  const publishDate = article.createdAt ? new Date(article.createdAt) : null; // Handle potentially missing date

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-500 text-xs"> {/* Adjusted size, wrap */}
      {typeof readingTime === 'number' && readingTime > 0 && ( // Check reading time validity
        <div className="flex items-center gap-1.5">
          <ClockIcon className="w-3.5 h-3.5" /> {/* Slightly smaller icon */}
          <span>{readingTime} {t('min_read')}</span>
        </div>
      )}
      {publishDate && ( // Check date validity
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5" />
          {/* Consider using date-fns or similar for formatting if needed */}
          <time dateTime={publishDate.toISOString()}>
            {publishDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </time>
        </div>
      )}
    </div>
  );
}