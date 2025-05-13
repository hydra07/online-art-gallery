import { getBlog } from "@/service/blog-service";
import BlogLoading from "./loading";
import { Suspense } from "react";
import { BlogPost } from "../../blog-post";
import { notFound } from "next/navigation";
export default async function BlogPreviewPage({ params }: { params: { id: string } }) {
  const blog = await getBlog(params.id);
  if (!blog) {
    throw notFound();
}

return (
    <Suspense fallback={<BlogLoading />}>
        <BlogPost
            blog={blog}
            author={blog.author}
        />
    </Suspense>
);
}
