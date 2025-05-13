"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/session";
import { createComment, updateComment, deleteComment } from "@/service/comment";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Flag } from "lucide-react";
import ReportButton from "@/components/ui.custom/report-button";
import { RefType } from "@/utils/enums";
import { AuthDialog } from "@/components/ui.custom/auth-dialog";

interface CommentDrawerProps {
  contentId: string;
  contentType: "blog" | "artwork";
  authorId: string;
  isSignedIn: boolean;
}

export default function CommentArtworkDrawer({
  contentId,
  contentType,
  authorId,
  isSignedIn,
}: CommentDrawerProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

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
      if (user) setCurrentUser(user);
      setUser(user);
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchComments();
  }, [contentId]);

  const handleSubmitComment = async () => {
    // Check if user is not authenticated
    if (!currentUser) {
      setShowAuthDialog(true);
      return;
    }

    // Proceed with comment submission if authenticated
    if (!newComment.trim()) return;
    
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
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error creating comment:", err);
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return;
    try {
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
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({
        accessToken: currentUser.accessToken,
        commentId,
      });
      setComments((prev) =>
        prev.filter((c) => c._id !== commentId && c.parentId !== commentId)
      );
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleSubmitReply = async (parentId: string, replyContent: string) => {
    if (!currentUser) {
      setShowAuthDialog(true);
      return;
    }
    if (!replyContent.trim()) return;
    try {
      const newReply = await createComment({
        accessToken: currentUser.accessToken,
        targetId: contentId,
        targetType: contentType,
        content: replyContent,
        parentId,
        onModel: contentType,
      });

      setComments((prev) => [...prev, newReply]);
      setReplyContent("");
      setReplyTo(null);

      fetchComments();
    } catch (err) {
      console.error("Failed to add reply:", err);
    }
  };

  const renderComment = (comment: any, isReply = false) => (
    <div
      key={comment._id}
      className={`flex space-x-3 text-white items-start ${
        isReply ? "mt-2 ml-6" : "mt-4"
      }`}
    >
      <Avatar className="h-8 w-8 rounded-full">
        <AvatarImage src={comment.author?.image || ""} />
        <AvatarFallback>{comment.author?.name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{comment.author?.name}</p>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {comment.author?._id === currentUser?.id && (
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
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {isSignedIn && comment.author?._id !== currentUser?.id && (
              <ReportButton
                refId={comment._id}
                refType={RefType.COMMENT}
                url={typeof window !== "undefined" ? window.location.href : ""}
                triggerElement={
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Flag className="w-3.5 h-3.5" />
                  </Button>
                }
              />
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>

        {editingCommentId === comment._id && (
          <div className="flex items-center space-x-2 mt-2">
            <Input
              key={comment._id}
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
              key={`${comment._id}-reply`}
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <Button
              className="text-white"
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

        {!isReply && isSignedIn && (
          <Button
            variant="link"
            onClick={() => setReplyTo(comment._id)}
            className="text-xs text-white mt-1"
          >
            Reply
          </Button>
        )}

        {comment.replies?.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((replyId: string) => {
              const reply = comments.find((c) => c._id === replyId);
              return reply ? renderComment(reply, true) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );

  const topLevelComments = comments.filter(
    (c) => !comments.some((parent) => parent.replies?.includes(c._id))
  );

  return (
    <div className="space-y-4 text-white">
      {/* Comment input section */}
      <div className="flex items-start space-x-3 mt-2">
        {/* <Avatar className="h-8 w-8 rounded-full">
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-white/20 text-xs" />
        </Avatar> */}
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={isSignedIn ? "Add a comment" : "Sign in to comment"}
          className="flex-1 text-sm text-white bg-white/10 rounded-full px-3 py-1.5 border-transparent focus:border-white/30 focus:outline-none"
        />
        <Button
          onClick={handleSubmitComment}
          className="h-9"
        >
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>

      <div
        className="space-y-4 overflow-y-auto pr-2"
        style={{ maxHeight: "600px" }}
      >
        {topLevelComments.map((comment) => renderComment(comment))}
      </div>

      <AuthDialog isOpen={showAuthDialog} setIsOpen={setShowAuthDialog} />
    </div>
  );
}
