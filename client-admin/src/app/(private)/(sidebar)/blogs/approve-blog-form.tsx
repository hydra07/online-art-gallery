"use client";

import React, { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { useToast } from "@/hooks/use-toast";
import { Terminal, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { approveBlogAction, rejectBlogAction } from "./action";
import Link from "next/link";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ToggleContext } from "@/components/ui.custom/interactive-overlay";
import { Blog } from "@/types/blog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const approveBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  tags: z.string().optional(),
});

const rejectBlogSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ApproveBlogForm({ blog, setIsOpen }: { blog: Blog; setIsOpen: (open: boolean) => void }) {
  const { setIsOpen: setIsOverlayOpen } = useContext(ToggleContext);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"approve" | "reject">("approve");

  const approveForm = useForm<z.infer<typeof approveBlogSchema>>({
    resolver: zodResolver(approveBlogSchema),
    defaultValues: {
      title: blog.title,
      // tags: blog.tags.join(", "),
      tags: 'story, news, ideas',
    },
  });

  const rejectForm = useForm<z.infer<typeof rejectBlogSchema>>({
    resolver: zodResolver(rejectBlogSchema),
    defaultValues: {
      reason: "",
    },
  });

  const { execute: executeApprove, error: approveError, isPending: isApprovePending } = useServerAction(approveBlogAction, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog approved successfully",
        variant: "success",
      });
      setIsOverlayOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve blog",
        variant: "destructive",
      });
    }
  });

  const { execute: executeReject, error: rejectError, isPending: isRejectPending } = useServerAction(rejectBlogAction, {
    onSuccess: () => {
      toast({
        title: "Blog Rejected",
        description: "Blog has been rejected",
        variant: "success",
      });
      setIsOverlayOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject blog",
        variant: "destructive",
      });
    }
  });

  const onApprove: SubmitHandler<z.infer<typeof approveBlogSchema>> = () => {
    executeApprove({
      blogId: blog._id,
      // tags: values.tags ? values.tags.split(",").map(tag => tag.trim()) : [],
    });
  };

  const onReject: SubmitHandler<z.infer<typeof rejectBlogSchema>> = (values) => {
    executeReject({
      blogId: blog._id,
      reason: values.reason,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-1 py-6">
      <div className="mb-6">
        <div className="flex items-center justify-end mb-2">
          <Link
            href={`/blogs/preview/${blog._id}`}
            target="_blank"
            className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            <span>Open Preview</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <h4 className="font-medium mb-2">{blog.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {blog.content.replace(/<[^>]*>/g, '')}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{blog.author.name}</span>
          </div>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "approve" | "reject")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="approve" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Approve
          </TabsTrigger>
          <TabsTrigger value="reject" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Reject
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approve" className="mt-0">
          <Form {...approveForm}>
            <form onSubmit={approveForm.handleSubmit(onApprove)} className="space-y-4">
              <FormField
                control={approveForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} disabled placeholder="Enter title" className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={approveForm.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={blog.tags.join(", ") || ""}
                        disabled
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-6" />
              {approveError && (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error approving blog</AlertTitle>
                  <AlertDescription>{approveError.message}</AlertDescription>
                </Alert>
              )}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isApprovePending}
                  className="w-32"
                  variant="default"
                >
                  {isApprovePending ? "Approving..." : "Approve"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="reject" className="mt-0">
          <Form {...rejectForm}>
            <form onSubmit={rejectForm.handleSubmit(onReject)} className="space-y-4">
              <FormField
                control={rejectForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rejection Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Please provide a reason for rejection..."
                        className="min-h-[120px] resize-none w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className="my-6" />
              {rejectError && (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error rejecting blog</AlertTitle>
                  <AlertDescription>{rejectError.message}</AlertDescription>
                </Alert>
              )}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isRejectPending}
                  className="w-32"
                  variant="destructive"
                >
                  {isRejectPending ? "Rejecting..." : "Reject"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
