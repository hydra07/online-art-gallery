import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Notification } from "@/types/notification";
import { RefreshCw, Bell, Globe, Users, Calendar, CheckCircle, AlertTriangle, FileText, Info, Send, User, Shield, X, ChevronDown, Check, Eye } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const roles = [
  { id: "user", label: "Regular Users", icon: <User className="h-4 w-4 text-blue-500" /> },
  { id: "artist", label: "Artists", icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
  { id: "admin", label: "Administrators", icon: <Shield className="h-4 w-4 text-purple-500" /> },
] as const;

const notificationFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  message: z.string().min(1, "Message is required").max(500, "Message must be less than 500 characters"),
  type: z.enum(["event", "system", "maintenance", "promotion"]),
  roles: z.array(z.string()).min(1, "Select at least one recipient role"),
  isSystem: z.boolean().default(false),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

interface NotificationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Notification | null;
  isPending: boolean;
}

export function NotificationForm({ open, onClose, onSubmit, initialData, isPending }: NotificationFormProps) {
  const [activeTab, setActiveTab] = useState<"details" | "preview">("details");
  const [isRolesOpen, setIsRolesOpen] = useState(false);
  const rolesRef = useRef<HTMLDivElement>(null);

  const getInitialRoles = () => {
    if (!initialData?.refType) return ["user"];

    const roles = [];
    if (initialData.sampleRecipients) {
      const hasUser = initialData.sampleRecipients.some(r => r.userId.includes("user"));
      const hasArtist = initialData.sampleRecipients.some(r => r.userId.includes("artist"));
      const hasAdmin = initialData.sampleRecipients.some(r => r.userId.includes("admin"));

      if (hasUser) roles.push("user");
      if (hasArtist) roles.push("artist");
      if (hasAdmin) roles.push("admin");
    }

    return roles.length > 0 ? roles : ["user"];
  };

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      message: initialData?.content || "",
      type: (initialData?.refType as any) || "event",
      roles: getInitialRoles(),
      isSystem: initialData?.refType === "system" || false,
    },
  });

  const { watch } = form;
  const watchedValues = watch();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rolesRef.current && !rolesRef.current.contains(event.target as Node)) {
        setIsRolesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (values: NotificationFormValues) => {
    onSubmit({
      ...values,
      recipients: values.roles.length === 3 ? "all_users" :
        values.roles.includes("user") && !values.roles.includes("artist") ? "subscribers" :
          values.roles.includes("artist") && !values.roles.includes("user") ? "artists" : "custom"
    });
  };

  const toggleRole = (roleId: string) => {
    const currentRoles = form.getValues().roles;
    if (currentRoles.includes(roleId)) {
      form.setValue(
        "roles",
        currentRoles.filter(id => id !== roleId),
        { shouldValidate: true }
      );
    } else {
      form.setValue("roles", [...currentRoles, roleId], { shouldValidate: true });
    }
  };

  const selectAllRoles = () => {
    form.setValue("roles", roles.map(role => role.id), { shouldValidate: true });
  };

  const clearAllRoles = () => {
    form.setValue("roles", [], { shouldValidate: true });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case "system":
        return <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      case "maintenance":
        return <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case "promotion":
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "event":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800";
      case "system":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800";
      case "maintenance":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800";
      case "promotion":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const getButtonColor = (type: string) => {
    switch (type) {
      case "event":
        return "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800";
      case "system":
        return "bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-800";
      case "maintenance":
        return "bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-700 dark:hover:bg-orange-800";
      case "promotion":
        return "bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800";
      default:
        return "bg-primary hover:bg-primary/90 text-primary-foreground";
    }
  };

  const getRolesLabel = (rolesList: string[]) => {
    if (rolesList.length === 3) {
      return "All Users";
    }

    if (rolesList.length === 0) {
      return "No recipients selected";
    }

    return rolesList.map(role => {
      switch (role) {
        case "user": return "Regular Users";
        case "artist": return "Artists";
        case "admin": return "Administrators";
        default: return role;
      }
    }).join(", ");
  };

  const getRolesIcon = (rolesList: string[]) => {
    if (rolesList.length === 3 || rolesList.length === 0) {
      return <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
    }

    if (rolesList.length === 1) {
      if (rolesList.includes("user")) return <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      if (rolesList.includes("artist")) return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      if (rolesList.includes("admin")) return <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
    }

    return <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl p-0 overflow-hidden h-[600px] max-h-[80vh]"
        onInteractOutside={(e) => {
          if (form.formState.isDirty && !confirm("Discard unsaved changes?")) {
            e.preventDefault();
          }
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full flex flex-col">
            <div className="flex flex-1 overflow-hidden">
              <div className="w-[200px] bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
                <DialogHeader className="mb-6 text-left">
                  <DialogTitle className="text-xl flex items-center gap-2 text-primary">
                    <Bell className="w-5 h-5" />
                    {initialData ? "Edit Notification" : "New Notification"}
                  </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col space-y-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      activeTab === "details"
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <FileText className="h-4 w-4" />
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      activeTab === "preview"
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <Bell className="h-4 w-4" />
                    Preview
                  </button>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Current Status</div>
                  <div className="flex items-center justify-between">
                    <div className="rounded-full h-2.5 bg-gray-200 dark:bg-gray-700 w-full">
                      <div
                        className={cn(
                          "h-2.5 rounded-full",
                          form.formState.isValid ? "bg-green-500" : "bg-amber-500",
                          form.formState.isSubmitted && !form.formState.isValid ? "bg-red-500" : ""
                        )}
                        style={{
                          width: `${
                            form.formState.isValid
                              ? "100%"
                              : Object.keys(form.formState.errors).length === 0
                                ? "50%"
                                : "30%"
                          }`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className={cn("space-y-5", activeTab !== "details" && "hidden")}>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Notification Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter a clear, concise title"
                            {...field}
                            className="text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Message Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter the notification message"
                            {...field}
                            className="min-h-[150px] resize-none text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Notification Type</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                if (value === "system") {
                                  form.setValue("isSystem", true);
                                } else {
                                  form.setValue("isSystem", false);
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select notification type">
                                  {field.value && (
                                    <div className="flex items-center">
                                      {getTypeIcon(field.value)}
                                      <span className="ml-2 capitalize">{field.value}</span>
                                    </div>
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="w-full">
                                <SelectItem value="event">
                                  <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                                    <span>Event</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="system">
                                  <div className="flex items-center">
                                    <Info className="mr-2 h-4 w-4 text-amber-500" />
                                    <span>System</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="maintenance">
                                  <div className="flex items-center">
                                    <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" />
                                    <span>Maintenance</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="promotion">
                                  <div className="flex items-center">
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                    <span>Promotion</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormField
                        control={form.control}
                        name="roles"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Recipients</FormLabel>
                            <div className="relative" ref={rolesRef}>
                              <div
                                onClick={() => setIsRolesOpen(!isRolesOpen)}
                                className={cn(
                                  "w-full flex items-center justify-between rounded-md border border-input px-3 py-2 text-base ring-offset-background",
                                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                  "disabled:cursor-not-allowed disabled:opacity-50",
                                  "cursor-pointer",
                                  field.value.length === 0 && "text-muted-foreground"
                                )}
                              >
                                <div className="flex flex-wrap gap-1 items-center">
                                  {field.value.length === 0 ? (
                                    <span>Select recipients...</span>
                                  ) : (
                                    <>
                                      {getRolesIcon(field.value)}
                                      <span className="ml-2">{getRolesLabel(field.value)}</span>
                                    </>
                                  )}
                                </div>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                              </div>

                              {field.value.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {field.value.map(roleId => {
                                    const role = roles.find(r => r.id === roleId);
                                    return role ? (
                                      <Badge
                                        key={role.id}
                                        variant="secondary"
                                        className="px-2 py-1 gap-1 group"
                                      >
                                        {role.icon}
                                        <span>{role.label}</span>
                                        <button
                                          type="button"
                                          className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 p-0.5"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleRole(role.id);
                                          }}
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </Badge>
                                    ) : null;
                                  })}
                                </div>
                              )}

                              {isRolesOpen && (
                                <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                                  <div className="p-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                                    <button
                                      type="button"
                                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        selectAllRoles();
                                      }}
                                    >
                                      Select All
                                    </button>
                                    <button
                                      type="button"
                                      className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        clearAllRoles();
                                      }}
                                    >
                                      Clear All
                                    </button>
                                  </div>
                                  <ul className="py-1 max-h-60 overflow-auto">
                                    {roles.map(role => (
                                      <li key={role.id}>
                                        <button
                                          type="button"
                                          className={cn(
                                            "w-full px-3 py-2 text-left flex items-center justify-between",
                                            "hover:bg-gray-100 dark:hover:bg-gray-700",
                                            field.value.includes(role.id) && "bg-gray-50 dark:bg-gray-700/50"
                                          )}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            toggleRole(role.id);
                                          }}
                                        >
                                          <div className="flex items-center gap-2">
                                            {role.icon}
                                            <span>{role.label}</span>
                                          </div>
                                          {field.value.includes(role.id) && (
                                            <Check className="h-4 w-4 text-primary" />
                                          )}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            <FormMessage />
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              Select one or more recipient roles for this notification
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className={cn("h-full", activeTab !== "preview" && "hidden")}>
                  <div className="border rounded-lg p-0 bg-white dark:bg-gray-800 shadow-sm h-full overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Notification Preview</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Just now
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0">
                          {getTypeIcon(watchedValues.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg leading-none dark:text-white mb-2">
                            {watchedValues.title || "Notification Title"}
                          </h3>
                          <Badge
                            className={cn(
                              "rounded-full text-xs font-medium border",
                              getTypeColor(watchedValues.type)
                            )}
                          >
                            {watchedValues.type}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-5 pb-6 text-gray-600 dark:text-gray-300 whitespace-pre-wrap bg-gray-50/50 dark:bg-gray-700/20 rounded-md p-4 border border-gray-100 dark:border-gray-700">
                        {watchedValues.message || "Your notification message will appear here..."}
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          {getRolesIcon(watchedValues.roles)}
                          <span>{getRolesLabel(watchedValues.roles)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4" />
                          <span>0 views</span>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end gap-2">
                        <button 
                          type="button"
                          className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                        >
                          Dismiss
                        </button>
                        <button 
                          type="button"
                          className={cn(
                            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                            getButtonColor(watchedValues.type)
                          )}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 border rounded-md bg-gray-50 dark:bg-gray-800/30 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Preview Mode</span>
                    </div>
                    <p>This is how your notification will appear to recipients. The actual appearance may vary slightly depending on the user's device and settings.</p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
              <div className="flex justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                  className="gap-1.5 border-gray-300 dark:border-gray-600"
                >
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setActiveTab(activeTab === "details" ? "preview" : "details")}
                    className="gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 border-0"
                  >
                    {activeTab === "details" ? (
                      <>
                        <Bell className="h-4 w-4" />
                        Preview
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        Edit Details
                      </>
                    )}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || !form.formState.isValid}
                    className={cn(
                      "gap-1.5",
                      "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white shadow-sm",
                      !form.formState.isValid && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        {initialData ? "Updating..." : "Sending..."}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {initialData ? "Update" : "Send Notification"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}