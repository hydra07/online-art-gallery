
import { Breadcrumb } from "@/components/ui.custom/breadcrumb";
import { BlogsTable } from "./blog-table";
import { CreateBlogButton } from "./create-blog-button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function BlogsContent({ searchParams } : { searchParams: any }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Breadcrumb
          items={[
            { label: "Dashboard", link: "/admin" },
            { label: "Blogs" }
          ]}
        />
        <CreateBlogButton />
      </div>
      <BlogsTable searchParams={searchParams} />
    </div>
  );
}