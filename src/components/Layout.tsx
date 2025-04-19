
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useAuth } from '../hooks/useAuth';
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from './AppSidebar';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const { data: settings } = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const response = await api.get('/api/settings');
      return response.data;
    },
    placeholderData: {
      appName: 'noAssets',
      companyName: 'Your Company'
    }
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="px-4 py-3 flex justify-between items-center">
              {/* Mobile menu spacing - left empty for now */}
              <div className="w-10 md:hidden" />
              
              {/* Company name or app name */}
              <div className="text-lg font-semibold">
                {settings?.appName || 'noAssets'}
              </div>

              {/* User dropdown - now on the right side */}
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user.firstname} {user.lastname}</span>
                        <span className="text-xs font-normal text-slate-500">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-grow p-4">
            {children}
          </main>

          <footer className="bg-white border-t py-4">
            <div className="px-4">
              <p className="text-center text-sm text-slate-500">
                &copy; {new Date().getFullYear()} {settings?.companyName || 'Your Company'}. All rights reserved.
              </p>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;

