
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Box, Route, Users, Home as HomeIcon, Clipboard, Settings } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const menuItems = [
    {
      title: "Users",
      icon: <Users className="h-8 w-8 text-blue-600" />,
      description: "Manage user accounts and permissions",
      path: "/users"
    },
    {
      title: "Items",
      icon: <Box className="h-8 w-8 text-blue-600" />,
      description: "Track and manage all equipment",
      path: "/items"
    },
    {
      title: "Areas",
      icon: <HomeIcon className="h-8 w-8 text-blue-600" />,
      description: "Manage location assignments",
      path: "/areas"
    },
    {
      title: "Repairs",
      icon: <Activity className="h-8 w-8 text-blue-600" />,
      description: "Manage equipment repair records",
      path: "/repairs"
    },
    {
      title: "Audit Trail",
      icon: <Route className="h-8 w-8 text-blue-600" />,
      description: "View system usage logs",
      path: "/trails"
    },
    {
      title: "Issuances",
      icon: <Clipboard className="h-8 w-8 text-blue-600" />,
      description: "Track item issuances to areas",
      path: "/issuance"
    },
    {
      title: "Settings",
      icon: <Settings className="h-8 w-8 text-blue-600" />,
      description: "Configure application settings",
      path: "/settings"
    }
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-600">Manage your asset inventory system</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card 
              key={item.title}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCardClick(item.path)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-slate-600">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
