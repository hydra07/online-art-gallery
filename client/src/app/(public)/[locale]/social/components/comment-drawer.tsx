// components/BlogCommentDrawer.tsx
"use client";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MessagesSquare, Flag, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReportButton from "@/components/ui.custom/report-button";
import { RefType } from "@/utils/enums";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";

import { useState, useEffect } from "react";
import { createComment, deleteComment, updateComment } from "@/service/comment";
import { getCurrentUser } from "@/lib/session";

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  author: {
    _id: string;
    name: string;
    image: string;
  };
  replies?: string[];
}

interface CommentDrawerProps {
  contentId: string;
  contentType: "blog" | "artwork";
  authorId: string;
  isSignedIn: boolean;
}

export default function CommentDrawer({
  contentId,
  contentType,
  authorId,
  isSignedIn,
}: CommentDrawerProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/target/${contentType}/${contentId}`
      );
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setToken(user.accessToken);
        setUserId(user.id);
        setCurrentUser(user);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUser) return;
    try {
      const comment = await createComment({
        accessToken: currentUser.accessToken,
        targetId: contentId,
        targetType: contentType,
        content: newComment,
        parentId: null,
        onModel: contentType,
      });
      setComments((prev) => [comment, ...prev]);
      fetchComments();
      setNewComment("");
    } catch (err) {
      console.error("Error creating comment:", err);
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    const comment = comments.find((c) => c._id === commentId);
    if (!comment) return;

    await updateComment({
      accessToken: currentUser.accessToken,
      commentId,
      content: editContent,
      replies: comment.replies || [],
    });

    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId ? { ...c, content: editContent } : c
      )
    );
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment({
      accessToken: currentUser.accessToken,
      commentId,
    });
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  const handleSubmitReply = async (parentId: string, replyContent: string) => {
    if (!replyContent.trim()) return;
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) throw new Error("User not authenticated.");

      const newReply = await createComment({
        accessToken: user.accessToken,
        targetId: contentId,
        targetType: contentType,
        content: replyContent,
        parentId,
        onModel: contentType,
      });

      if (newReply) {
        setComments((prevComments) => [...prevComments, newReply]);
        setReplyContent("");
      }
      fetchComments();
    } catch (error) {
      console.error("Failed to add reply:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div
      key={comment._id}
      className={`flex space-x-3 items-start ${isReply ? "mt-2 ml-6" : ""}`}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.author?.image || ""} />
        <AvatarFallback>{comment.author?.name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{comment.author?.name}</p>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-end space-x-2 ml-auto">
            {comment.author?._id === currentUser?.id && (
              <div className="relative z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingCommentId(comment._id);
                        setEditContent(comment.content);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        const user = await getCurrentUser();
                        if (user?.accessToken) {
                          handleDeleteComment(comment._id);
                        } else {
                          console.error("User not authenticated.");
                        }
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            {isSignedIn && comment.author?._id !== currentUser?._id && (
              <div className="z-0">
                <ReportButton
                  refId={comment._id}
                  refType={RefType.COMMENT}
                  url={
                    typeof window !== "undefined" ? window.location.href : ""
                  }
                  triggerElement={
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Flag className="w-3.5 h-3.5" />
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>

        {editingCommentId === comment._id && (
          <div className="flex items-center space-x-2 mt-2">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <Button
              variant="ghost"
              onClick={() => handleUpdateComment(comment._id)}
            >
              Save
            </Button>
          </div>
        )}

        {!isReply && replyTo === comment._id && (
          <div className="flex items-center space-x-2 mt-2">
            <Input
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <Button
              variant="ghost"
              onClick={() => {
                handleSubmitReply(comment._id, replyContent);
                setReplyContent("");
                setReplyTo(null);
              }}
            >
              Reply
            </Button>
          </div>
        )}

        {!isReply && (
          <Button
            variant="link"
            onClick={() => setReplyTo(comment._id)}
            className="text-xs mt-1"
          >
            Reply
          </Button>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((replyId) => {
              const reply = comments.find((c) => c._id === replyId);
              return reply ? renderComment(reply, true) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Drawer onOpenChange={(open) => open && fetchComments()}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm">
          <MessagesSquare className="w-4 h-4 mr-2" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="w-[400px] h-screen">
        <div className="w-full h-full flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Comments</DrawerTitle>
            <DrawerDescription>
              Write your thoughts about this {contentType}.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {loading ? (
              <p>Loading comments...</p>
            ) : comments.length > 0 ? (
              (() => {
                const repliedCommentIds = new Set(
                  comments.flatMap((c) => c.replies || [])
                );
                const topLevelComments = comments.filter(
                  (c) => !repliedCommentIds.has(c._id)
                );
                return topLevelComments.map((comment) =>
                  renderComment(comment)
                );
              })()
            ) : (
              <p>No comments yet.</p>
            )}
          </div>

          <DrawerFooter className="border-t mt-auto">
            <div className="flex space-x-2">
              <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button onClick={handleSubmitComment}>Post</Button>
            </div>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
