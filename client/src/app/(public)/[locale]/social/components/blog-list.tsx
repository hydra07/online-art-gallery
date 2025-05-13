"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { BlogCard } from "./blog-card";
import { useBlogs } from "@/hooks/use-blogs";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateReadingTime } from "@/app/utils";
import { createSlug } from "@/lib/utils";
export const Loading: React.FC = () => {
  return (
    <div className="w-full max-w-[700px] rounded-xl overflow-hidden border bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl flex flex-col">
      <div className="px-4 py-2">
        <div className="flex items-center">
          <Skeleton className="h-8 w-8 rounded-full mr-3" />
          <div>
            <Skeleton className="w-24 h-4 mb-1" />
            <Skeleton className="w-32 h-3" />
          </div>
        </div>
      </div>
      <div className="flex justify-between px-4">
        <div className="w-2/3 py-2">
          <Skeleton className="w-3/4 h-6 mb-2" />
          <Skeleton className="w-full h-4 mb-1" />
          <Skeleton className="w-full h-4 mb-1" />
          <Skeleton className="w-3/4 h-4" />
        </div>
        <div className="w-1/4 relative h-28">
          <Skeleton className="w-full h-full rounded" />
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="w-8 h-8 rounded" />
        </div>
        <Skeleton className="w-8 h-8 rounded" />
      </div>
    </div>
  );
};

export default function BlogList({
  bookmarkIds = [],
  isSignedIn,
}: {
  bookmarkIds: string[];
  isSignedIn: boolean;
}) {
  const {
    blogs,
    isError,
    isReachingEnd,
    size,
    setSize,
    isLoadingMore,
    isLoading,
  } = useBlogs();
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const isBookmarked = (id: string) => bookmarkIds.includes(id);

  useEffect(() => {
    if (inView && !isReachingEnd && !isLoadingMore) {
      setSize(size + 1);
    }
  }, [inView, isReachingEnd, size, setSize, isLoadingMore]);

  if (isError) return <div>Error loading blogs</div>;
  if (isLoading)
    return (
      <div className="flex justify-center">
        <Loading />
      </div>
    );

  return (
    <>
      <div className="grid grid-cols-1 gap-8 place-items-center">
        {blogs.map(
          (post) =>
            post && (
              <BlogCard
                key={post._id}
                id={post._id}
                title={post.title}
                coverImage={post.image}
                content={post.content}
                heartCount={post.heartCount}
                // heartCount={0}
                isHearted={false}
                author={{
                  id: post.author._id,
                  name: `${post.author.name}`,
                  image: post.author.image || "/default-avatar.jpg",
                }}
                publishedAt={new Date(post.createdAt)}
                readTime={calculateReadingTime(post.content)}
                slug={`${createSlug(post.title)}.${post._id}`}
                isBookmarked={isBookmarked(post._id)}
                isSignedIn={isSignedIn}
              />
            )
        )}
        {/* {isLoading && <Loading />} */}
      </div>
      {!isReachingEnd && (
        <div ref={ref} className="flex justify-center">
          {isLoadingMore ? <Loading /> : null}
        </div>
      )}

      {isReachingEnd && (
        <div className="flex justify-center mt-8">
          You have reached the end!
        </div>
      )}
    </>
  );
}
