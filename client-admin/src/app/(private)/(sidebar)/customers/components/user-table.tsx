'use client';
import * as React from 'react';
import { Role } from '@/utils/enums';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '@/service/user-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, User, Mail, Shield, Calendar, ShieldCheck, ShieldOff, Ban, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui.custom/data-table";
import { useToast } from "@/hooks/use-toast";

export type User = {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: Role[] | Role;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function UserTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: response, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const response = await userService.getAllUser();
        return response;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000
  });

  const updateToAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await userService.updateToAdmin(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Success",
        description: "User has been given admin role successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeAdminRoleMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await userService.removeAdminRole(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Success",
        description: "Admin role has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove admin role. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getRolesArray = (role: Role[] | Role | undefined): Role[] => {
    if (!role) return [];
    return Array.isArray(role) ? role : [role];
  };

  const isAdmin = (user: User): boolean => {
    const roles = getRolesArray(user.role);
    return roles.includes(Role.ADMIN);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div className="flex items-center justify-center">
          <User className="mr-1 h-4 w-4 text-primary" />
          <span>Name</span>
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2 justify-start">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-left">{user.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: () => (
        <div className="flex items-center justify-center">
          <Mail className="mr-1 h-4 w-4 text-primary" />
          <span>Email</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.original.email}</div>
      ),
    },
    {
      accessorKey: "role",
      header: () => (
        <div className="flex items-center justify-center">
          <Shield className="mr-1 h-4 w-4 text-primary" />
          <span>Roles</span>
        </div>
      ),
      cell: ({ row }) => {
        const roles = getRolesArray(row.original.role);
        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {roles.map(role => (
              <Badge key={role} variant="outline" className="capitalize">
                {role.toLowerCase()}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="flex items-center justify-center">
          <span>Status</span>
        </div>
      ),
      cell: ({ row }) => {
        const isBanned = row.original.isBanned;
        return (
          <div className="flex justify-center">
            <Badge 
              variant="outline"
              className={isBanned ? 
                "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200" : 
                "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200"
              }
            >
              {isBanned ? 'Banned' : 'Active'}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <div className="flex items-center justify-center">
          <Calendar className="mr-1 h-4 w-4 text-primary" />
          <span>Joined</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="flex items-center justify-center">
          <span>Actions</span>
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original;
        const userIsAdmin = isAdmin(user);
        const isPending = updateToAdminMutation.isPending || removeAdminRoleMutation.isPending;

        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => userIsAdmin 
                    ? removeAdminRoleMutation.mutate(user._id) 
                    : updateToAdminMutation.mutate(user._id)
                  }
                  disabled={isPending}
                  className={`flex items-center ${userIsAdmin ? "text-red-600" : "text-blue-600"}`}
                >
                  {userIsAdmin ? (
                    <>
                      <ShieldOff className="mr-2 h-4 w-4" />
                      <span>Remove Admin Role</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Make Admin</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center text-red-600">
                  {user.isBanned ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      <span>Unban User</span>
                    </>
                  ) : (
                    <>
                      <Ban className="mr-2 h-4 w-4" />
                      <span>Ban User</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading users: {(error as Error)?.message || 'Unknown error'}</p>
      </div>
    );
  }

  const users = response?.data || [];
  
  return (
    <DataTable 
      columns={columns} 
      data={users}
      pagination={{
        pageIndex: 0,
        pageSize: 10,
        totalCount: users.length,
        totalPages: Math.ceil(users.length / 10),
        hasNextPage: users.length > 10,
        hasPrevPage: false
      }}
    />
  );
}