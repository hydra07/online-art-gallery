"use client";

import React, { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { useToast } from "@/hooks/use-toast";
import { Terminal, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { ToggleContext } from "@/components/ui.custom/interactive-overlay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArtistRequest } from "@/types/artist-request";
import { rejectArtistRequestAction, approveArtistRequestAction } from "./action";

const approveRequestSchema = z.object({});

const rejectRequestSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ApproveRequestForm({ request, setIsOpen }: { request: ArtistRequest; setIsOpen: (open: boolean) => void }) {
  const { setIsOpen: setIsOverlayOpen } = useContext(ToggleContext);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"approve" | "reject">("approve");
  const cccd = request.cccd!;
  const approveForm = useForm<z.infer<typeof approveRequestSchema>>({
    resolver: zodResolver(approveRequestSchema),
    defaultValues: {},
  });

  const rejectForm = useForm<z.infer<typeof rejectRequestSchema>>({
    resolver: zodResolver(rejectRequestSchema),
    defaultValues: {
      reason: "",
    },
  });

  const { execute: executeApprove, error: approveError, isPending: isApprovePending } = useServerAction(approveArtistRequestAction, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Artist request approved successfully",
        variant: "success",
      });
      setIsOverlayOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve artist request",
        variant: "destructive",
      });
    }
  });

  const { execute: executeReject, error: rejectError, isPending: isRejectPending } = useServerAction(rejectArtistRequestAction, {
    onSuccess: () => {
      toast({
        title: "Request Rejected",
        description: "Artist request has been rejected",
        variant: "success",
      });
      setIsOverlayOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject artist request",
        variant: "destructive",
      });
    }
  });

  const onApprove = () => {
    executeApprove({
      requestId: request._id,
    });
  };

  const onReject: SubmitHandler<z.infer<typeof rejectRequestSchema>> = (values) => {
    executeReject({
      requestId: request._id,
      reason: values.reason,
    });
  };

  return (
    <div className="w-full p-4 space-y-6"> {/* Adjusted padding and spacing */}
      {/* Header Section - Made more compact */}
      <div className="border-b pb-3">
        <h1 className="text-xl font-semibold">Artist Verification Request</h1> {/* Reduced text size */}
        <p className="text-sm text-muted-foreground mt-1">Review application details and documents</p>
      </div>

      {/* Main Content - Changed to vertical layout for drawer */}
      <div className="space-y-6"> {/* Removed grid, stack vertically */}
        {/* Documents Section */}
        <div className="space-y-4"> {/* Reduced spacing */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">ID Card - Front</h3>
            <div className="relative aspect-[3/2] rounded-lg overflow-hidden border bg-muted/10 max-h-[200px]"> {/* Added max height */}
              <Image
                src={cccd.imageFront}
                alt="ID Front"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">ID Card - Back</h3>
            <div className="relative aspect-[3/2] rounded-lg overflow-hidden border bg-muted/10 max-h-[200px]"> {/* Added max height */}
              <Image
                src={cccd.imageBack}
                alt="ID Back"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Personal Information Section - Made more compact */}
        <div className="space-y-4"> {/* Reduced spacing */}
          <div className="bg-card rounded-lg p-4 border space-y-4"> {/* Reduced padding */}
            <h2 className="text-lg font-semibold">{cccd.name}</h2>
            
            <div className="grid grid-cols-2 gap-4 text-sm"> {/* Made text smaller */}
              <div className="space-y-0.5">
                <p className="font-medium text-muted-foreground">ID Number</p>
                <p className="font-medium">{cccd.id}</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-medium text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{cccd.dob}</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-medium text-muted-foreground">Nationality</p>
                <p className="font-medium">{cccd.nationality}</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-medium text-muted-foreground">Sex</p>
                <p className="font-medium">{cccd.sex}</p>
              </div>
            </div>

            <div className="space-y-0.5 text-sm">
              <p className="font-medium text-muted-foreground">Address</p>
              <p className="font-medium">{cccd.address}</p>
            </div>

            <div className="space-y-0.5 text-sm">
              <p className="font-medium text-muted-foreground">Features</p>
              <p className="font-medium">{cccd.features}</p>
            </div>
          </div>

          {/* Action Tabs - Made more compact */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "approve" | "reject")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-3">
              <TabsTrigger value="approve" className="flex items-center gap-1 text-sm">
                <CheckCircle className="w-3.5 h-3.5" />
                Approve
              </TabsTrigger>
              <TabsTrigger value="reject" className="flex items-center gap-1 text-sm">
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </TabsTrigger>
            </TabsList>

            <div className="bg-card rounded-lg p-4 border"> {/* Reduced padding */}
              <TabsContent value="approve" className="mt-0">
                <Form {...approveForm}>
                  <form onSubmit={approveForm.handleSubmit(onApprove)} className="space-y-4">
                    {approveError && (
                      <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error approving request</AlertTitle>
                        <AlertDescription>{approveError.message}</AlertDescription>
                      </Alert>
                    )}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isApprovePending}
                        className="w-full sm:w-32"
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
                          <FormLabel>Reason for rejection</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter the reason for rejection"
                              className="min-h-[100px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {rejectError && (
                      <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error rejecting request</AlertTitle>
                        <AlertDescription>{rejectError.message}</AlertDescription>
                      </Alert>
                    )}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isRejectPending}
                        className="w-full sm:w-32"
                        variant="destructive"
                      >
                        {isRejectPending ? "Rejecting..." : "Reject"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}