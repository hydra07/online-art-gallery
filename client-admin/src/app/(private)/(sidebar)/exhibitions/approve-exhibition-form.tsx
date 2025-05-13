"use client";

import React, { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { useToast } from "@/hooks/use-toast";
import { Terminal, CheckCircle, XCircle, ExternalLink, Check, X, Loader2, User, Calendar, Info } from "lucide-react"; // Added icons
import { approveExhibitionAction, rejectExhibitionAction } from "./action";
import Link from "next/link";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ToggleContext } from "@/components/ui.custom/interactive-overlay";
import { Exhibition } from "@/types/exhibition"; // Assuming ExhibitionStatus enum/type exists
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Added Card components
import { Badge } from "@/components/ui/badge"; // Added Badge component
import { format } from "date-fns"; // For formatting dates

// Define Zod schemas (no changes needed here)
const approveExhibitionSchema = z.object({
  // Name is no longer needed here as it's not an input for approval action
  // name: z.string().min(1, "Name is required"),
});

const rejectExhibitionSchema = z.object({
  reason: z.string().min(1, "Reason is required").max(500, "Reason cannot exceed 500 characters"), // Added max length
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ApproveExhibitionForm({ exhibition, setIsOpen }: { exhibition: Exhibition; setIsOpen: (open: boolean) => void }) {
  const { setIsOpen: setIsOverlayOpen } = useContext(ToggleContext);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"approve" | "reject">("approve");

  // Get default name from contents based on default language
  const defaultContent = exhibition.contents.find(c =>
    exhibition.languageOptions?.find(l => l.isDefault && l.code === c.languageCode)
  ) || exhibition.contents[0];
  const exhibitionName = defaultContent?.name || "Unnamed Exhibition";

  // --- Hooks ---
  const approveForm = useForm<z.infer<typeof approveExhibitionSchema>>({
    resolver: zodResolver(approveExhibitionSchema),
    defaultValues: {}, // No default values needed now
  });

  const rejectForm = useForm<z.infer<typeof rejectExhibitionSchema>>({
    resolver: zodResolver(rejectExhibitionSchema),
    defaultValues: {
      reason: "",
    },
  });

  const { execute: executeApprove, error: approveError, isPending: isApprovePending } = useServerAction(approveExhibitionAction, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Exhibition "${exhibitionName}" approved successfully.`,
        variant: "success",
      });
      setIsOverlayOpen(false); // Close overlay on success
    },
    onError: (error) => { // Capture specific error
      toast({
        title: "Approval Failed",
        description: error?.err.message || "An unexpected error occurred while approving.",
        variant: "destructive",
      });
    }
  });

  const { execute: executeReject, error: rejectError, isPending: isRejectPending } = useServerAction(rejectExhibitionAction, {
    onSuccess: () => {
      toast({
        title: "Exhibition Rejected",
        description: `Exhibition "${exhibitionName}" has been rejected.`,
        variant: "success", // Or maybe "default" or a custom variant
      });
      setIsOverlayOpen(false); // Close overlay on success
    },
    onError: (error) => { // Capture specific error
      toast({
        title: "Rejection Failed",
        description: error?.err.message || "An unexpected error occurred while rejecting.",
        variant: "destructive",
      });
    }
  });

  // --- Handlers ---
  const onApprove: SubmitHandler<z.infer<typeof approveExhibitionSchema>> = () => {
    executeApprove({
      exhibitionId: exhibition._id,
    });
  };

  const onReject: SubmitHandler<z.infer<typeof rejectExhibitionSchema>> = (values) => {
    executeReject({
      exhibitionId: exhibition._id,
      reason: values.reason,
    });
  };

  // --- Render ---
  return (
    // Using Card for better structure and visual separation
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-none"> {/* Adjust border/shadow if needed */}
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Review Exhibition Submission</CardTitle>
        <CardDescription>Review the details and approve or reject the exhibition.</CardDescription>
        <Separator className="mt-3 mb-1" />
         {/* Exhibition Details Section */}
         <div className="space-y-2 pt-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground text-base">
                {exhibitionName}
            </p>
            <div className="flex items-center gap-2">
                <User className="w-4 h-4"/>
                <span>Author: {exhibition.author?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4"/>
                <span>Dates: {format(new Date(exhibition.startDate), 'PP')} - {format(new Date(exhibition.endDate), 'PP')}</span>
            </div>
             <div className="flex items-center gap-2">
                <Info className="w-4 h-4"/>
                <span>Status: <Badge variant='default'>{exhibition.status}</Badge></span>
            </div>
        </div>
         {/* Preview Link */}
        <div className="pt-4">
             <Button variant="outline" size="sm" asChild>
                 <Link href={`/exhibitions/preview/${exhibition._id}`} target="_blank">
                     <ExternalLink className="w-4 h-4 mr-2" />
                     Open Preview
                 </Link>
             </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
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

          {/* Approve Tab Content */}
          <TabsContent value="approve" className="mt-0 space-y-4">
             <p className="text-sm text-muted-foreground px-1">
                You are about to approve the exhibition &quot;{exhibitionName}&quot;. Once approved, it may become publicly visible based on its settings.
             </p>
             {/* No form needed if no inputs, but keep Form structure for consistency and potential future fields */}
             <Form {...approveForm}>
                <form onSubmit={approveForm.handleSubmit(onApprove)} className="space-y-6">
                    {/* Removed the disabled name input */}
                    {approveError && (
                        <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Approval Error</AlertTitle>
                        <AlertDescription>{approveError.message || "An unexpected error occurred."}</AlertDescription>
                        </Alert>
                    )}
                     {/* Keep Separator if desired */}
                     {/* <Separator /> */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isApprovePending}
                            className="w-32"
                            variant="default" // Keep default for primary positive action
                        >
                        {isApprovePending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Check className="mr-2 h-4 w-4" />
                        )}
                        {isApprovePending ? "Approving..." : "Approve"}
                        </Button>
                    </div>
                </form>
             </Form>
          </TabsContent>

          {/* Reject Tab Content */}
          <TabsContent value="reject" className="mt-0">
            <Form {...rejectForm}>
              <form onSubmit={rejectForm.handleSubmit(onReject)} className="space-y-6">
                <FormField
                  control={rejectForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Rejection</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Provide clear feedback for the author..."
                          className="min-h-[120px] resize-none w-full"
                          maxLength={500} // Good practice to add max length
                        />
                      </FormControl>
                       <FormMessage /> {/* Validation message */}
                       <p className="text-xs text-muted-foreground text-right pr-1">
                         {field.value.length} / 500 {/* Character counter */}
                       </p>
                    </FormItem>
                  )}
                />
                {/* <Separator className="my-4" /> */}
                {rejectError && (
                  <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Rejection Error</AlertTitle>
                    <AlertDescription>{rejectError.message || "An unexpected error occurred."}</AlertDescription>
                  </Alert>
                )}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isRejectPending}
                    className="w-32"
                    variant="destructive"
                  >
                    {isRejectPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <X className="mr-2 h-4 w-4" />
                    )}
                    {isRejectPending ? "Rejecting..." : "Reject"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
       {/* CardFooter is optional, could place buttons here if preferred */}
       {/* <CardFooter className="flex justify-end"> */}
           {/* Buttons could go here instead of inside each TabContent */}
       {/* </CardFooter> */}
    </Card>
  );
}
