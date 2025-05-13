"use client";
import { BlogCard } from "./blog-card";
import { useBlogs } from "@/hooks/use-blogs";
import { calculateReadingTime } from "@/app/utils";
import { createSlug } from "@/lib/utils";

export function BlogFeed() {
  const {
    blogs,
    isError,
    isReachingEnd,
    size,
    setSize,
    isLoadingMore,
    isLoading,
  } = useBlogs();

  if (isError) return <div>Error loading blogs</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {blogs.map(
        (post) =>
          post && (
            <div key={post._id} className="relative group">
              <BlogCard
                id={post._id}
                title={post.title}
                coverImage={post.image}
                content={post.content}
                heartCount={post.heartCount}
                isHearted={false}
                author={{
                  id: post.author._id,
                  name: post.author.name,
                  image: post.author.image || "/default-avatar.jpg",
                }}
                publishedAt={new Date(post.createdAt)}
                readTime={calculateReadingTime(post.content)}
                slug={`${createSlug(post.title)}.${post._id}`}
                isBookmarked={false}
                isSignedIn={true}
              />
            </div>
          )
      )}

      {!isReachingEnd && (
        <button
          onClick={() => setSize(size + 1)}
          className="w-full py-2 text-center text-muted-foreground hover:text-primary"
        >
          {isLoadingMore ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
