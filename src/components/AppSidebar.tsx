
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import {
  Home,
  Package,
  Boxes,
  LayoutGrid,
  Settings,
  Building2,
  Wrench,
  Users,
  Route,
  ArrowRightLeft,
  User,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
  Menu
} from "lucide-react";
import { Button } from './ui/button';
import { SheetTitle, SheetDescription } from './ui/sheet';

const AppSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { toggleSidebar, state, openMobile, setOpenMobile } = useSidebar();

  const menuItems = [
    { title: "Dashboard", path: "/dashboard", icon: Home },
    { title: "Items", path: "/items", icon: Package },
    { title: "Item Types", path: "/item-types", icon: Boxes },
    { title: "Areas", path: "/areas", icon: LayoutGrid },
    { title: "Issuances", path: "/issuance", icon: ArrowRightLeft },
    { title: "Repairs", path: "/repairs", icon: Wrench },
    // Only show "Users" and "Trails" for Admins
    ...(user?.role === 'Admin' ? [
      { title: "Users", path: "/users", icon: Users },
      { title: "Trails", path: "/trails", icon: Route }
    ] : []),
    { title: "Profile", path: "/profile", icon: User },
    { title: "Settings", path: "/settings", icon: Settings }
  ];

  return (
    <>
      {/* Mobile menu trigger - NOW AT THE TOP */}
      <button 
        className="fixed left-4 top-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-md"
        onClick={() => setOpenMobile(true)}
        aria-label="Open mobile menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Sidebar>
        <SidebarHeader className="p-4 relative">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            <span className="font-bold text-lg">noAssets</span>
          </div>
          {/* Desktop collapse button */}
          <div className="absolute right-2 top-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="h-7 w-7 hidden md:flex"
              aria-label={state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
            >
              {state === "collapsed" ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  tooltip={item.title}
                >
                  <a href={item.path} className="flex items-center gap-2">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      {/* Floating expand button - only visible when sidebar is collapsed on desktop */}
      {state === "collapsed" && (
        <div className="fixed left-4 bottom-6 z-20 hidden md:block">
          <Button 
            onClick={toggleSidebar} 
            variant="secondary" 
            size="icon" 
            className="h-10 w-10 rounded-full shadow-lg"
            aria-label="Expand sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
        </div>
      )}
    </>
  );
};

export default AppSidebar;
